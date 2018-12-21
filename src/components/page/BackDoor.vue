<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
        系统
        </el-breadcrumb-item>
        <el-breadcrumb-item>后门</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="content-title">MD5生成</div> -->
      <div class="plugins-tips"></div>
      <Divider/>

      
      
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item class="el-form-item" label="选择账号">
          <el-select v-model="form.userId" @change="selectUser" placeholder="请选择账号">
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name+'—'+item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <Divider/>
        <el-form-item label="输入新密码">
            <el-input v-model="form.newPassword" style="width:300px;float:left"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
            <el-input v-model="form.checkPassword" style="width:300px;float:left"></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="saveEditPassword">修改密码</el-button>
            <div class="content-title">{{strMD5}}</div>
        </el-form-item>
        <Divider/>
        <el-form-item class="el-form-item" label="选择角色">
          <el-select
            v-model="form.roleId"
            placeholder="选择角色"
            style="width:180px"
          >
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.role"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="saveAddRole">添加角色</el-button>
        </el-form-item>
        <Divider/>
        <el-form-item class="el-form-item" label="选择权限">
          <el-select
            v-model="form.rightId"
            placeholder="选择权限"
            style="width:180px"
          >
            <el-option
              v-for="item in rightData"
              :key="item.id"
              :label="item.rightName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="saveAddRight">添加权限</el-button>
        </el-form-item>
      </el-form>
      <Divider/>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import md5 from 'js-md5';
export default {
  name: "touristSet",
  data: function() {
    return {
      url: "http://localhost:8011",
      dialogVisible: false,
      playerList: [],
      strplayerList: "",
      userOptions: [],
      serverOptions: [],
      roleData:[],
      form: {
        userId: 0,
        roleId:0,
        rightId:0,
        platformId: 0,
        serverId: 0,
        newPassword:"",
        checkPassword:"",
        
      },
      strMD5:""
    };
  },
  components: {},
  created() {
    if (this.$url != null) {
      this.url = this.$url;
    }
    this.getData();
    this.getRole();
    this.getRight();
    bus.$on(
      "changeGameId",
      function(obj) {
        console.log(obj.message);
        this.getData();
      }.bind(this)
    );
  },
  beforeDestroy() {
    bus.$off("changeGameId");
  },
  methods: {
    getRole() {
      this.$axios
        .post(this.url + "/getRole", {
          pageNo: 1,
          pageSize: 10,
          role: "",
          role_describe: "",
          addUser: "",
          state: "",
          isPage: ""
        })
        .then(res => {
          console.log("角色列表获取成功");
          console.log(res.data);
          this.roleData = res.data.data.list;
          this.getData();
        });
    },
      getRight(){
          this.$axios.post(this.url+"/getRight", {
              pageNo: 1,
              pageSize: 10,
              role: "",
              role_describe: "",
              addUser: "",
              state:"",
              isPage:""
          }).then((res) => {
              console.log(res.data);
              this.rightData = res.data.data.list;
              this.getData();
          })
      },
      reset(){

      },
    getData() {
      console.log("this.$gameId:" + this.$gameId);
      this.getAllUserList();
    },
    saveAddRole(){
      var userId =this.form.userId;

      this.$axios.post(this.url+'/api/user/addRole',{
          id: userId,
          roleId: this.form.roleId,
      })
      .then(successResponse =>{
          this.responseResult ="\n"+ JSON.stringify(successResponse.data)
          if(successResponse.data.code === 200){
              console.log(this.responseResult);
              this.$message.success("修改成功");
          }else{
              console.log('error');
              console.log(this.responseResult);
              this.$message.error("修改失败");
          }
      })
      .catch(failResponse => {})

    },
    saveAddRight(){
      var roleId =this.form.roleId;

      this.$axios.post(this.url+'/api/role/addRight',{
          id: roleId,
          rightId: this.form.rightId,
      })
      .then(successResponse =>{
          this.responseResult ="\n"+ JSON.stringify(successResponse.data)
          if(successResponse.data.code === 200){
              console.log(this.responseResult);
              this.$message.success("修改成功");
          }else{
              console.log('error');
              console.log(this.responseResult);
              this.$message.error("修改失败");
          }
      })
      .catch(failResponse => {})
    },
    saveEditPassword(){
        var userId =this.form.userId;
        console.log("password:"+this.form.newPassword);
        if(this.form.newPassword==""){
            this.$message.error("密码不能为空");
            return false;
        }else if(this.form.newPassword != this.form.checkPassword){
            this.$message.error("密码不一致");
            return false;
        }else{
            var password1 = md5.hex(this.form.newPassword+"cdk");
            var password2 = md5.hex(password1+"cdk");
            this.$axios.post(this.url+'/editPassword',{
                id: userId,
                password: password2,
            })
            .then(successResponse =>{
                this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                if(successResponse.data.code === 200){
                    console.log(this.responseResult);
                    this.$message.success("修改成功");
                    this.strMD5 = password2;
                }else{
                    console.log('error');
                    console.log(this.responseResult);
                    this.$message.error("修改失败");
                }
            })
            .catch(failResponse => {})
        }
    },
    getAllUserList() {
      var userData = JSON.parse(localStorage.getItem("userData"));

      this.$axios
        .post(this.url + "/api/user/getAllUser", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("用户列表获取成功");
            this.userOptions = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("用户列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectUser() {
      console.log(this.form.userId);
    },

  }
};
</script>

<style scoped>
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
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
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>