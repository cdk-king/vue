<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>用户中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container " >

            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo notoselect"
                mode="horizontal"
                @select="handleSelect"
                background-color="#EAEAEA"
                text-color="#000"
                active-text-color="#5CACEE">
                <el-menu-item index="1" disabled>处理中心</el-menu-item>
                <el-submenu index="2" disabled>
                    <template slot="title">我的工作台</template>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                    <el-menu-item index="2-2">选项2</el-menu-item>
                    <el-menu-item index="2-3">选项3</el-menu-item>
                    <el-submenu index="2-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="3" disabled>消息中心</el-menu-item>
                <el-menu-item index="4"  @click="changeShow('show2')">信息修改</el-menu-item>
                <el-menu-item index="5" @click="changeShow('show1')">密码修改</el-menu-item>
            </el-menu>
            <Divider />
                <div v-show="show1" class="div-box">
                    <el-form ref="form" :model="passwordform" label-width="100px" style="width:100%">
                        <el-form-item label="输入新密码">
                            <el-input v-model="passwordform.newPassword" style="width:300px;float:left"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码">
                            <el-input v-model="passwordform.checkPassword" style="width:300px;float:left"></el-input>
                        </el-form-item>

                    </el-form>
                    <p slot="footer" class="dialog-footer" style="width:100%; text-align:left;padding-left:100px">
                        <el-button @click="reset">取 消</el-button>
                        <el-button type="primary" @click="saveEditPassword">确 定</el-button>
                    </p>
                </div>
                <div v-show="show2" class="div-box">
                    <div class="plugins-tips">
                        <el-form  ref="userOptions"  :model="userOptions" label-width="100px" style="width:100%">
                            <el-form-item label="用户名">
                                <span  style="width:300px;text-align:left;float:left;">{{userOptions.name}}</span>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <span  style="width:300px;text-align:left;float:left;">{{userOptions.phone}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <Divider />
                    <el-form ref="form" :model="form" label-width="100px" style="width:100%">
                        <el-form-item label="用户名">
                            <el-input v-model="form.name" style="width:300px;float:left"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="form.phone" style="width:300px;float:left"></el-input>
                        </el-form-item>

                    </el-form>
                    <p slot="footer" class="dialog-footer" style="width:100%; text-align:left;padding-left:100px">
                        <el-button @click="reset">取 消</el-button>
                        <el-button type="primary" @click="saveEditInfo">确 定</el-button>
                    </p>
                </div>
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import md5 from 'js-md5';
    
    export default {
        name: 'center',
        data: function(){
            return {
                url:"http://localhost:8011",
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                fileList: [],
                playerList: [],
                strplayerList: "",
                userOptions: {

                },
                serverOptions:[

                ],
                form:{
                    name:"",
                    phone:"",
                    platformId:0,
                    serverId:0,
                    email:""
                },
                userId:0,
                userName:"",
                show1: false,
                show2: true,
                passwordform:{
                    id:"",
                    newPassword:"",
                    checkPassword:""
                },
                activeIndex: '4',
                info:[]

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
            this.getUserInfo();
        },
        beforeDestroy () {
            bus.$off('changeGameId');
        },
        methods:{
            changeShow(show){
                if(show=="show2"){
                    this.show1 = false;
                    this.show2 = true;
                }
                if(show=="show1"){
                    this.show1 = true;
                    this.show2 = false;
                }
            },
            reset(){
                this.form={};
                this.passwordform={};
            }, 
            saveEditPassword(){
                var userId =JSON.parse(localStorage.getItem('userData')).id;
                if(this.passwordform.newPassword==""){
                    this.$message.error("密码不能为空");
                    return false;
                }else if(this.passwordform.newPassword != this.passwordform.checkPassword){
                    this.$message.error("密码不一致");
                    return false;
                }else{
                    var password1 = md5.hex(this.passwordform.newPassword+"cdk");
                    var password2 = md5.hex(password1+"cdk");
                    this.$axios.post(this.url+'/editPassword',{
                        id: userId,
                        password: password2
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("密码修改成功");
                            this.passwordform={};
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("密码修改失败");
                        }
                    })
                    .catch(failResponse => {})
                }
            },
            saveEditInfo(){
                var userId =JSON.parse(localStorage.getItem('userData')).id;
                var name = this.userOptions.name;
                var phone = this.userOptions.phone;
                var email = this.userOptions.email;
                if(this.form.name!=undefined){
                    if(this.form.name.trim()!=""){
                    name = this.form.name;
                    }
                }
                if(this.form.phone!=undefined){
                    if(this.form.phone.trim()!=""){
                        phone = this.form.phone;
                    }
                }
                
                this.$axios.post(this.url+'/editUser',{
                    id: userId,
                    account: name,
                    name: name,
                    type: "",
                    phone: phone,
                    email:email

                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("用户信息编辑成功");
                        this.form={};
                        this.getUserInfo();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("用户信息编辑失败");
                    }
                })
                .catch(failResponse => {})
            },
            handleSelect(key, keyPath) {
            },
            getData(){            

            },
            getUserInfo() {
                var userData =JSON.parse(localStorage.getItem('userData'));
                this.$axios
                .post(this.url+"/api/user/getUserById", {
                        id:userData.id
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("用户获取成功");
                    this.userOptions = successResponse.data.data.list[0];
                    localStorage.setItem('userData',JSON.stringify(successResponse.data.data.list[0]));
                } else {
                    console.log(this.responseResult);
                    console.log("用户获取失败");
                }
                })
                .catch(failResponse => {});
            },
            selectUser() {
                 
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
      .div-box {
    margin-bottom: 10px;
    width: 100%;
    border-radius: 4px;
    background-color: #eaeaea;
    text-align: center;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
  .notoselect{
      -webkit-user-select:none;

        -moz-user-select:none;

        -ms-user-select:none;

        user-select:none;
  }
  .plugins-tips{
      background: #fff;
  }
</style>