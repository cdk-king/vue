<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">游戏管理系统</div>
            <i class="el-icon-lx-sort el-select"></i>
            <el-dropdown class="el-select" @command="handleChangGame">
            
                <span class="el-dropdown-link" style="">
                    {{gameLabel}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu class="el-dropdown-menu" slot="dropdown" >
                    <el-dropdown-item class="el-dropdown-item" 
                    :key="item.id" 
                    :value="item.id"  
                    v-for="item in options"
                    :command="item" >
                    {{item.gameName}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator hoverCursor" @click="goCenter"><img src="dist/static/img/img.jpg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="center">个人中心</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import setLocalThisUrl from "../../code/setLocalThisUrl";
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'cdk',
                message: 0,
                options: [],
                gameValue: '1',
                gameLabel:"请选择游戏",
                url:"http://localhost:8011"
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        created() {
            setLocalThisUrl(this);
            this.right();
            bus.$on(
            "changeGame",
            function(obj) {
                var userData = JSON.parse(localStorage.getItem("userData"));
                this.id = userData.id;
                this.getData();
            }.bind(this)
            );
        },
        beforeDestroy () {
            bus.$off('changeGame');
        },
        methods:{
            right(){
                const right = localStorage.getItem('rightTags');
                this.getData();
            },
            getData(){
                
                var userData = JSON.parse(localStorage.getItem("userData"));
                if(userData==null || userData==""){
                    return;
                }
                this.$axios
                    .post(this.url+"/getGameListForUser", {
                    id: userData.id
                    })
                    .then(successResponse => {
                    this.responseResult = "\n" + JSON.stringify(successResponse.data);
                    if (successResponse.data.code === 200) {
                        console.log("用户游戏列表获取成功");
                        console.log( this.responseResult);
                        this.options = successResponse.data.data.list;
                        //默认选取第一个游戏
                        this.$setGameId(this.options[0].id);
                        console.log("已选择游戏："+this.options[0].gameName);
                        this.gameLabel = this.options[0].gameName;
                    } else {
                        console.log(this.responseResult);
                        console.log("用户游戏列表获取失败");
                    }
                    })
                    .catch(failResponse => {});
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                //用户注销
                if(command == 'loginout'){
                    //清除缓存信息
                    localStorage.removeItem('ms_username');
                    localStorage.setItem("rightTags", "");
                    localStorage.removeItem('rightTags');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('userData');
                    //跳转到登录界面
                    this.$router.push('/login');
                }
                if(command=="center"){
                    this.$router.push('/center');
                }
            },
            goCenter(){
                this.$router.push("/center");
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            handleChangGame(command){
                //要提前更改gameId
                this.$setGameId(command.id);
                bus.$emit('changeGameId', {
                    gameId:command.id,
                    message:"已选择游戏："+command.gameName
                });
                this.gameLabel = command.gameName;               
                this.$message("已选择游戏："+command.gameName);       
            }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .el-select{
        top: 20px;
        font-size:20px;
    }
    .el-dropdown-menu{
        width: 100px;

    }
    .el-dropdown-item{
        font-size: 15px;
        
    }
    .hoverCursor:hover{
        cursor:pointer;
    }
</style>
