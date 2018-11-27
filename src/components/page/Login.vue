<template>

    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登&emsp;录</el-button>
                </div>
                
                <div >
                    <el-button-group style="width:100%" >
                    <el-button  class="bottomBtnClass" icon="el-icon-arrow-left" style="" @click="loginInTourist">游客登陆</el-button>
                    <el-button  class="bottomBtnClass" style="">注册用户<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
                    </el-button-group>
                </div>
                <div>
                    <p class="login-tips">Tips : 请输入用户名和密码。</p>
                    
                </div>
            </el-form>
        </div>
    </div>
    
</template>

<script>
// ./是当前目录../是父级目录 /是根目录
import Vue from 'vue';
import App from '../../App';
import defaultRouter from '../../router/defaultRouter';
import dynamicRouter from '../../router/dynamicRouter';
import getRouter from '../../router/index';
import md5 from 'js-md5';
    export default {
        data: function(){
            var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
            var validatePhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('号码不能为空!!'))
                }
                setTimeout(() => {
                    if (!phoneReg.test(value)) {
                    callback(new Error('格式有误'))
                    } else {
                    callback()
                    }
                }, 1000)
                }

            return {
                ruleForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur'} //,validator: validatePhone
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                responseResult:[]
            }
        },
        methods: {    
            loginInTourist(){
                localStorage.setItem('ms_username',"游客");
                    var router = getRouter();
                    //重启vue
                    console.log("Vue重启中。。。");
                    new Vue({
                        router,
                        render: h => h(App)
                    }).$mount('#app');
                    console.log("Vue重启成功");
                    this.$router.push('/');
            },      
            submitForm(formName) {
                if(this.ruleForm.username=="admin" && this.ruleForm.password=="123456"){
                    localStorage.setItem('ms_username',"admin");
                    var router = getRouter();
                    //重启vue
                    console.log("Vue重启中。。。");
                    new Vue({
                        router,
                        render: h => h(App)
                    }).$mount('#app');
                    console.log("Vue重启成功");
                    this.$router.push('/');
                }
                //离线环境下测试
                // localStorage.setItem('ms_username',"admin");
                // this.$router.push('/');

                var password1 = md5.hex(this.ruleForm.password+"cdk");
                var password2 = md5.hex(password1+"cdk");
                console.log("md5Password:"+password);
                //表单验证
                this.$refs[formName].validate((valid) => {
                   //console.log("valid:"+valid);
                    if (valid) {
                        this.$axios.post('/login',{
                            username:this.ruleForm.username,
                            password:password2

                        })
                        .then(successResponse =>{
                            //stringify json => str
                            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                            if(successResponse.data.code === 200){
                                console.log(successResponse.data);
                                this.getUserAllRole(successResponse.data.data.id);
                                
                                this.$message.success("登录成功");
                                localStorage.setItem('ms_username',this.ruleForm.username);
                                console.log(successResponse.data.data);

                                //只能储存字符串
                                localStorage.setItem('userData',JSON.stringify(successResponse.data.data));
                                //localStorage.setItem('ms_username',this.ruleForm.username);
                                this.$router.push('/');
                                //this.$router.replace({path: '/index'})
                            }else{
                                this.$message.error(successResponse.data.message);
                                console.log('error submit!!');
                                console.log(this.responseResult);
                                var router = getRouter();
                                //重启vue
                                console.log("Vue重启中。。。");
                                new Vue({
                                    router,
                                    render: h => h(App)
                                }).$mount('#app');
                                console.log("Vue重启成功"); 
                                    return false;
                                }
                        })
                        .catch(failResponse => {})
                        //
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getUserAllRole(id){
                //console.log("id:"+id);
                this.$axios.post('/getUserAllRole',{
                    id:id
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        //console.log(successResponse.data.data);
                        console.log("角色获取成功");
                        localStorage.setItem('roles',"");
                        localStorage.setItem('roles',successResponse.data.data);
                        this.getUserAllRight(id);
                        //localStorage.setItem('ms_username',this.ruleForm.username);
                        //this.$router.replace({path: '/index'})

                    }else{
                        this.$message.error(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                            
                        return false;
                    }
                })
                .catch(failResponse => {})

            },
            getUserAllRight(id){
                //console.log("id:"+id);
                this.$axios.post('/getUserAllRight',{
                    id:id
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        //console.log(successResponse.data.data);
                        console.log("权限获取成功");
                        localStorage.setItem('rightTags',"");
                        
                        localStorage.setItem('rightTags',successResponse.data.data);
                        this.addRouter();
                        //localStorage.setItem('ms_username',this.ruleForm.username);
                        //this.$router.replace({path: '/index'})

                    }else{
                        this.$message.error(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        return false;
                    }
                })
                .catch(failResponse => {})

            },
            addRouter(){
                    const right = localStorage.getItem('rightTags');
                    console.log("right:"+right);

                    //var dnmr = dynamicRouter();
                    //console.log("dynamicRouter:"+JSON.stringify(dnmr));
                    var dfr = defaultRouter();
                    //console.log("defaultRouter:"+JSON.stringify(dfr));
                    //实验显示这样修改参数对实际路由没用任何影响
                    this.$router.options.routes = dfr; 
                    console.log('routes:');
                    console.log(this.$router.options.routes);
    
                    //‘vue-router 有方法router.addRoutes(routes) 动态添加更多的路由规则。
                    //只能动态添加，暂无删减api
                    //router.addRoutes(dfr);

                    var router = getRouter();
                    //重启vue
                    console.log("Vue重启中。。。");
                    new Vue({
                         router,
                        render: h => h(App)
                    }).$mount('#app');
                    console.log("Vue重启成功");
            }
        }
    }
</script>

<style scoped>
    .bottomBtnClass{
        height:35 px;
        width:50%;
        font-size: 14px;
    }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        /* background-image: url(../../assets/login-bg.jpg); */
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
        margin-bottom: 0px;
        padding-bottom: 12px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
        font-size: 16px;
    }
    .login-tips{
        margin-top: 20px;
        margin-bottom:  0px;
        padding: 0px;
        font-size:12px;
        line-height:20px;
        color:#fff;
    }
</style>