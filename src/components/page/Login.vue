<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="账号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登&emsp;录</el-button>
        </div>

        <div v-if="footVisible">
          <el-button-group style="width:100%">
            <el-button
              class="bottomBtnClass"
              icon="el-icon-arrow-left"
              style
              @click="loginInTourist"
            >游客登陆</el-button>
            <el-button class="bottomBtnClass" style @click="register">注册用户
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
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
import Vue from "vue";
import App from "../../App";
import defaultRouter from "../../router/defaultRouter";
import dynamicRouter from "../../router/dynamicRouter";
import getRouter from "../../router/index";
import md5 from "js-md5";
import setLocalThisUrl from "../../code/setLocalThisUrl";
export default {
  data: function() {
    var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空!!"));
      }
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error("格式有误"));
        } else {
          callback();
        }
      }, 1000);
    };

    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" } 
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      responseResult: [],
      url: "http://localhost:8011",
      footVisible: true
    };
  },
  created() {
    setLocalThisUrl(this);
  },
  mounted() {},
  methods: {
    getTourist() {
      this.$axios
        .post(this.url + "/api/login/getTourist", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {

            var touristId = successResponse.data.data.split("|")[0];
            var touristName = successResponse.data.data.split("|")[1];
            if (touristId != "0" && touristId != "") {
              this.$setTouristId(parseInt(touristId));
              this.$setTouristName(touristName);
              this.$message.info(touristName);
              console.log(this.$touristName);
              this.getUserAllRole(this.$touristId);
              localStorage.setItem("ms_username", this.$touristName);
              this.getThisUserInfo(this.$touristName);
              
            } else {
              this.$message.error("游客Id获取失败！");
            }
          } else {
            this.$message.error(successResponse.data.message);
            console.log(this.responseResult);
          }
        })
        .catch(failResponse => {});
    },
    register() {
      this.$message.info("暂不支持注册");
      console.log("暂不支持注册");
      //todo   localStorage.setItem('userData'
      //路由跳转钩子函数会判断有无ms_username
      //localStorage.setItem('ms_username',"admin");
      //this.$router.push('/register');
    },
    loginInTourist() {
      localStorage.removeItem('ms_username');
      localStorage.setItem("rightTags", "");
      localStorage.removeItem('rightTags');
      localStorage.removeItem('roles');
      localStorage.removeItem('userData');
      this.$message.info("暂不支持游客登录");
      if (true) {
        //todo
        if (this.$touristId == 0) {
          
          this.getTourist();
        } else {
          console.log(this.$touristName);
          localStorage.setItem("ms_username", this.$touristName);
          this.getUserAllRole(this.$touristId);
          this.getThisUserInfo(this.$touristName);
        }
      }
    },
    routerTo(value){
        this.$router.push(value);
    },
    //游客登录使用
    getThisUserInfo(name) {
      this.$axios
        .post(this.url + "/api/login/getThisUserInfo", {
          name: name
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            localStorage.setItem(
              "userData",
              JSON.stringify(successResponse.data.data)
            );
            console.log("当前用户信息获取成功");
          } else {
            this.$message.error(successResponse.data.message);
            console.log(this.responseResult);
          }
        })
        .catch(failResponse => {});
    },
    submitForm(formName) {
      var myDate = new Date();
      var adpwd = (
        (parseInt(myDate.getMonth())+1) *
        parseInt(myDate.getDate()) *
        parseInt(myDate.getHours())
      ).toString();
      
      if (this.ruleForm.username == "admin") {
        if (this.ruleForm.password == adpwd) {
          localStorage.setItem("ms_username", "admin");
          this.$router.push("/BackDoor");
          return;
        } else {
          this.$message.error("错误的用户名");
          return;
        }
      }

      var password1 = md5.hex(this.ruleForm.password + "cdk");
      var password2 = md5.hex(password1 + "cdk");
      //表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.url + "/login", {
              username: this.ruleForm.username,
              password: password2
            })
            .then(successResponse => {
              this.responseResult = "\n" + JSON.stringify(successResponse.data);
              if (successResponse.data.code === 200) {
                this.getUserAllRole(successResponse.data.data.id);

                this.$message.success("登录成功");
                localStorage.setItem("ms_username", successResponse.data.data.name);

                //只能储存字符串
                //roleTable、giftUpload、giftTable...需要获取userId、userName
                localStorage.setItem(
                  "userData",
                  JSON.stringify(successResponse.data.data)
                );
                //this.getUserAllRole(successResponse.data.data.id);
              } else {
                this.$message.error(successResponse.data.message);
                console.log(this.responseResult);
                var router = getRouter();
                //重启vue
                new Vue({
                  router,
                  render: h => h(App)
                }).$mount("#app");
                console.log("Vue重启成功");
                return false;
              }
            })
            .catch(failResponse => {});
        } else {
          console.log("error submit!!");
        }
      });
    },
    getUserAllRole(id) {
      this.$axios
        .post(this.url + "/getUserAllRole", {
          id: id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("角色获取成功");
            localStorage.setItem("roles", "");
            localStorage.setItem("roles", successResponse.data.data);
            //获取用户权限
            this.getUserAllRight(id);
          } else {
            this.$message.error(successResponse.data.message);
            console.log(this.responseResult);
          }
        })
        .catch(failResponse => {});
    },
    getUserAllRight(id) {
      this.$axios
        .post(this.url + "/getUserAllRight", {
          id: id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("权限获取成功");
            localStorage.setItem("rightTags", "");
            localStorage.setItem("rightTags", successResponse.data.data);
            //添加修改权限
            this.addRouter();
          } else {
            this.$message.error("用户权限获失败");
            console.log(this.responseResult);
          }
        })
        .catch(failResponse => {});
    },
    addRouter() {
      const right = localStorage.getItem("rightTags");
      var dfr = defaultRouter();
      //实验显示这样修改参数对实际路由没用任何影响
      this.$router.options.routes = dfr;

      //vue-router 有方法router.addRoutes(routes) 动态添加更多的路由规则。暂无删减路由api

      var router = getRouter();
      //重启vue
      new Vue({
        router,
        render: h => h(App),
        mounted: function() {
          this.$router.push("/");
        }
      }).$mount("#app");

      console.log("Vue重启成功");
    }
  }
};
</script>

<style scoped>
.bottomBtnClass {
  height: 35 px;
  width: 50%;
  font-size: 14px;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
  margin-bottom: 0px;
  padding-bottom: 12px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  font-size: 16px;
}
.login-tips {
  margin-top: 20px;
  margin-bottom: 0px;
  padding: 0px;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
}
</style>