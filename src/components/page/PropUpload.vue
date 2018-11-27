<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 道具管理</el-breadcrumb-item>
                <el-breadcrumb-item>道具导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">道具导入</div>
            <div class="plugins-tips">
                请将道具信息按下边规定格式写入到文本文件中
                一行数据对应一个道具，示例：
                道具编号|道具名称|道具标识|道具描述
               </div>

            <el-upload
                class="upload-demo"
                drag
                action="XXX"
                :auto-upload="false"
                :on-change="handleChange"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传txt文件，且不超过500kb</div>
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
            {{strPropList}}
            </div>

            <!-- <div class="crop-demo-btn">选择文件
            <input class="crop-input" type="file"   @change="upload"/>
            </div> -->
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
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
                propList: [],
                strPropList: "",
                platformOptions: [
                    // {
                    // id: "1",
                    // platform: "渠道1"
                    // },
                ],
                form:{
                    platformId:0
                }
            }
        },
        components: {
            
        },
        created(){
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
                .post("/getPlatformListForUserIdAndGameId", {
                
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
                this.$axios.post('/ImportProp',{
                    list: JSON.stringify(this.propList),
                    platformId:this.form.platformId,
                    gameId:this.$gameId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("道具导入成功");
                    }else{
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("道具导入失败");
                    }
                })
                .catch(failResponse => {})
            },
            handlePreview(file){
                //console.log(file);
                
            },
            handleChange(file,fileList){
                console.log(file.raw);
                const reader = new FileReader();

                 reader.readAsText(file.raw, "gb2312");
                 reader.onload = function (e) {
                        this.propList = [];
                        var fileText = reader.result.replace(/(\t)|(\r)/g,"");
                        var list = fileText.split("\n");
                        for(var i = 0;i<list.length;i++){
                            var data = list[i].split('|');
                            if(data.length>1){
                            var map = new Object();
                            map.propId = data[0];
                            map.propName = data[1];
                            map.propType = data[2];
                            map.prop_describe = data[3];
                            this.propList.push(map);
                            }
                        }
                        console.log(this.propList);
                        this.strPropList = JSON.stringify(this.propList);
                        console.log(this.strPropList);
                    }.bind(this)
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
                        var fileText = e.target.result;
                        fileText = fileText.replace(/(\t)|(\r)/g,"");
                        list = e.target.result.split("\n");
                        for(var i = 0;i<list.length;i++){
                            var data = list[i].split('|')
                            console.log(list[i]);
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