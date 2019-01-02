<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 玩家管理</el-breadcrumb-item>
                <el-breadcrumb-item>玩家导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">玩家导入</div>
            <div class="plugins-tips">
                请将玩家信息按下边规定格式写入到文本文件中
                一行数据对应一个玩家，示例：
                玩家名|玩家账号|玩家Id|是否在线|最后登录IP|会员等级|钻石|充值金额|战力|是否禁言|是否禁封|注册时间
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
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                    </el-select>
                    <span style="margin-left:22px">选择服务器</span>
                    <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器">
                        <el-option
                        v-for="item in serverOptions"
                        :key="item.serverId"
                        :label="item.serverName"
                        :value="item.serverId">
                        </el-option>
                    </el-select>
                        <el-button type="primary" @click="ImportDatabase">导入数据库</el-button>
                </el-form-item>
            </el-form>
            <Divider />

            <div class="plugins-tips">
            {{strplayerList}}
            </div>
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
                playerList: [],
                strplayerList: "",
                platformOptions: [
                ],
                serverOptions:[

                ],
                form:{
                    platformId:0,
                    serverId:0
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
                    console.log("渠道列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                } else {
                    console.log(this.responseResult);
                    console.log("渠道列表获取失败");
                }
                })
                .catch(failResponse => {});
            },
            getServerList(platformId) {
            this.$axios
                .post("/getServerListForPlatform", {
                platformId: platformId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("渠道服务器列表获取成功");
                    this.serverOptions = successResponse.data.data;
                } else {
                    console.log(this.responseResult);
                    console.log("渠道服务器列表获取失败");
                }
                })
                .catch(failResponse => {});
            },
            ImportDatabase(){
                this.$axios.post('/ImportPlayer',{
                    list: JSON.stringify(this.playerList),
                    platformId:this.form.platformId,
                    serverId:this.form.serverId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("玩家导入成功");
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("玩家导入失败");
                    }
                })
                .catch(failResponse => {})
            },
            handlePreview(file){
                
            },
            handleChange(file,fileList){
                const reader = new FileReader();

                 reader.readAsText(file.raw, "gb2312");
                 reader.onload = function (e) {
                        this.playerList = [];
                        var fileText = reader.result.split("\n");
                        for(var i = 0;i<fileText.length;i++){
                            var data = fileText[i].split('|')
                            var map = new Object();
                            map.playerName = data[0];
                            map.playerAccount = data[1];
                            map.playerId = data[2];
                            map.isOnline = data[3];
                            map.lastIp = data[4];
                            map.vipLevel = data[5];
                            map.diamond = data[6];
                            map.rechargeAmount = data[7];
                            map.level = data[8];
                            map.combatPower = data[9];
                            map.isProhibitSpeak = data[10];
                            map.isBan = data[11];
                            map.registrationTime = data[12];
                            this.playerList.push(map);
                        }
                        this.strplayerList = JSON.stringify(this.playerList);
                    }.bind(this)
            },
            selectPlatform() {
                this.getServerList(this.form.platformId);
            },
            selectServer() {
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