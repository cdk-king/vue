<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 礼包管理</el-breadcrumb-item>
                <el-breadcrumb-item>礼包导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">礼包导入</div>
            <div class="plugins-tips">
                请将礼包信息按下边规定格式写入到Excel文件中
                <br/>
                一行数据对应一个礼包，示例：
                id、limit、expire_time、goods_prize1、value_prize1

               </div>

            <el-upload
                class="upload-demo"
                drag
                action="XXX"
                :auto-upload="false"
                :on-change="handleChangeXlsx"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
            </el-upload>

            <Divider />
                <div class="plugins-tips">
                    请先选择渠道平台后再导入数据库
                </div>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item class="el-form-item" label="选择渠道">
                    <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台">
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.id"
                        :label="item.platform"
                        :value="item.id">
                        </el-option>
                    </el-select>
                        <el-button type="primary" @click="ImportDatabase">导入数据库</el-button>
                </el-form-item>
            </el-form>
            <Divider />

            <div class="plugins-tips">
            {{strGiftList}}
            </div>

            <!-- <div class="crop-demo-btn">选择文件
            <input class="crop-input" type="file"   @change="upload"/>
            </div> -->
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import XLSX from 'xlsx';
    export default {
        name: 'upload',
        data: function(){
            return {
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                fileList: [],
                giftList: [],
                strGiftList: "",
                platformOptions: [
                    // {
                    // id: "1",
                    // platform: "渠道1"
                    // },
                ],
                form:{
                    platformId:0
                },
                loading:null,
                url:"http://localhost:8011",
            }
        },
        components: {
            
        },
        created(){
            if(this.$url!=null){
                this.url = this.$url;
            }
            this.getData();
            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.getData();
            }.bind(this))
        },
        beforeDestroy () {
            bus.$off('changeGameId')
        },
        methods:{
            getData(){
                console.log("this.$gameId:"+this.$gameId);
                this.getPlatformList(this.$gameId);
            },
            getPlatformList(gameId) {
                var userData =JSON.parse(localStorage.getItem('userData'));
                this.$axios
                .post(this.url+"/getPlatformListForUserIdAndGameId", {
                
                userId:userData.id,
                gameId: gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log(this.responseResult);
                    console.log("渠道列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                } else {
                    this.open4(successResponse.data.message);
                    console.log(this.responseResult);
                    console.log("渠道列表获取失败");
                    return false;
                }
                })
                .catch(failResponse => {});
            },
            ImportDatabase(){
                this.loading = this.$loading({
                        lock: true,
                        text: '数据导入中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                        });
                this.$axios.post(this.url+'/api/gift/ImportGift',{
                    list: JSON.stringify(this.giftList),
                    platformId:this.form.platformId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.loading.close();
                        this.$message.success("礼包导入成功");
                    }else{
                        console.log('error');
                        console.log(this.responseResult);
                        this.loading.close();
                        this.$message.error("礼包导入失败");
                    }
                })
                .catch(failResponse => {
                    this.loading.close();
                    console.log('error');
                })
            },
            handlePreview(file){
                //console.log(file);
                
            },
            handleChange(file,fileList){
                console.log(file.raw);
                const reader = new FileReader();

                 reader.readAsText(file.raw, "gb2312");
                 reader.onload = function (e) {
                        this.giftList = [];
                        var fileText = reader.result.replace(/(\t)|(\r)/g,"");
                        var list = fileText.split("\n");
                        for(var i = 0;i<list.length;i++){
                            var data = list[i].split('|');
                            console.log(data.length);
                            if(data.length>1){
                            var map = new Object();
                            map.giftId = data[0];
                            map.limit = data[1];
                            map.expire_time = data[2];
                            map.goods_prize1 = data[3];
                            map.value_prize1 = data[4];
                            this.giftList.push(map);
                            }
                            
                        }
                        console.log(this.propList);
                        this.strGiftList = JSON.stringify(this.giftList);
                        console.log(this.strGiftList);
                    }.bind(this)
            },
            handleChangeXlsx(file,fileList){
                console.log(file); 
                 var self = this;
                // 导入excel
                var f = file.raw;
                var reader = new FileReader();
                let $t = this;
                //定义onload事件
                reader.onload = function(e) {
                    console.log(e);
                    var data = e.target.result;
                    
                    if ($t.rABS) {
                        $t.wb = XLSX.read(btoa(this.fixdata(data)), {
                        // 手动转化
                        type: "base64"
                        });
                    } else {
                        $t.wb = XLSX.read(data, {
                        type: "binary"
                        });
                    }
                    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
                    console.log(json);
                    console.log(JSON.stringify(json));
                    //self.result = JSON.stringify(json);
                    $t.dealFile(json); // analyzeData: 解析导入数据
                }
                if (this.rABS) {
                    
                    reader.readAsArrayBuffer(f);
                } else {
                    //执行读取操作
                    reader.readAsBinaryString(f);
                }
            },
            dealFile(json){
                //第一个对象是类型
                console.log(json.length);
                for(var i = 2;i<json.length;i++){
                    var map = new Object();
                        map.giftId = json[i].id;
                        map.limit = json[i].limit;
                        map.expire_time = json[i].expire_time;
                        map.goods_prize1 = json[i].goods_prize1;
                        map.value_prize1 = json[i].value_prize1;
                    this.giftList.push(map);
                }
                this.strGiftList = JSON.stringify(this.giftList);
                console.log(JSON.stringify(this.giftList))
            },
            upload(e){
                
                const file = e.target.files[0];
                console.log(file);
                // if (!file.type=='.png')) {
                //     return;
                // }
                const reader = new FileReader();

                 reader.readAsText(file, "gb2312");
                 reader.onload = function (e) {
                        var fileText = e.target.result.split("\n");
                        for(var i = 0;i<fileText.length;i++){
                            var data = fileText[i].split('|')
                            console.log(fileText[i]);
                        }
                    }
            },
            selectPlatform() {
                console.log(this.form.platformId);
            },

        },
        
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>