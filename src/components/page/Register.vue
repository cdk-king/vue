<template>
    <div>

        <div class="container">
            <div class="content-title">用户注册</div>
            <div class="plugins-tips">
                用户注册
               </div>

            <Divider />
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item class="el-form-item" label="用户名">
                    <el-input style="width:250px"
                        placeholder="请输入用户名"
                        v-model="form.name"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item class="el-form-item" label="密码">
                    <el-input style="width:250px" type="password"
                        placeholder="请输入密码"
                        v-model="form.password"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item class="el-form-item" label="手机">
                    <el-input style="width:250px"
                        placeholder="请输入手机号码"
                        v-model="form.phone"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item class="el-form-item" label="">

                </el-form-item>
                <el-form-item class="el-form-item" label="">
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('form')">注&emsp;册</el-button>
                </div>
                </el-form-item>
                <el-form-item class="el-form-item" label="">

                </el-form-item>
            </el-form>


        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import md5 from 'js-md5';
    import setLocalThisUrl from "../../code/setLocalThisUrl";
    export default {
        name: 'register',
        data: function(){
            return {
                url:"http://localhost:8011",
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                strplayerList: "",
                form:{
                    userId:0,
                    platformId:0,
                    serverId:0
                },
            }
        },
        components: {
            
        },
        created(){
            setLocalThisUrl(this);
            this.getData();
            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.getData();
            }.bind(this))
        },
        beforeDestroy () {
            bus.$off('changeGameId');
        },
        methods:{
            getData(){         
            },
            submitForm(formName){
                var password1 = md5.hex(this.form.password+"cdk");
                var password2 = md5.hex(password1+"cdk");
                //保存在数据库
                this.$axios
                .post(this.url+"/api/register/addRegisterUser", {
                    name:this.form.name,
                    password:password2,
                    phone:this.form.phone
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("用户注册成功");
                    this.$message.success("用户注册成功");
                    this.form = [];
                    localStorage.setItem('ms_username',this.form.name);
                    this.$router.push('/');

                } else {
                    console.log(this.responseResult);
                    console.log(successResponse.data.message);
                    this.$message.error(successResponse.data.message);
                    this.form = [];
                }
                })
                .catch(failResponse => {});
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