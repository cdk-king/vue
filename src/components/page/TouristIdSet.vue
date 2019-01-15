<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-document"></i> 系统设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>游客账号设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="content-title">游客账号设置</div>
      <div class="plugins-tips">设置游客登陆时使用的账号</div>
      <Divider/>
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item class="el-form-item" label="已设置账号">{{userName+'—'+userId}}</el-form-item>
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
        <el-form-item class="el-form-item" label>
          <el-button type="primary" @click="setTourist">设置</el-button>
        </el-form-item>
      </el-form>
      <Divider/>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
export default {
  name: "touristSet",
  data: function() {
    return {
      url: "http://localhost:8011",
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      fileList: [],
      playerList: [],
      strplayerList: "",
      userOptions: [],
      serverOptions: [],
      form: {
        userId: "",
        platformId:"",
        serverId: ""
      },
      userId: "",
      userName: ""
    };
  },
  components: {},
  created() {
    setLocalThisUrl(this);
    this.getData();
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
    getData() {
      //每次需要显示游客Id时，会设置一次this.$touristId和touristName
      this.getTourist();
      this.getAllUserList();
    },
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
              this.userId = this.$touristId;
              this.setUserName();
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
    setTourist() {
      //保存在数据库
      var name = "";
      for (var i = 0; i < this.userOptions.length; i++) {
        if (this.form.userId == this.userOptions[i].id) {
          name = this.userOptions[i].name;
          break;
        }
      }
      this.$axios
        .post(this.url + "/api/login/setTourist", {
          userId: this.form.userId,
          name: name
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("用户列表获取成功");
            this.$setTouristId(this.form.userId);
            this.userId = this.$touristId;
            this.setUserName();
          } else {
            console.log(this.responseResult);
            console.log("用户列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getAllUserList() {
      var userData = JSON.parse(localStorage.getItem("userData"));

      this.$axios
        .post(this.url + "/api/user/getAllUser", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("用户列表获取成功");
            this.userOptions = successResponse.data.data.list;
            this.setUserName();
          } else {
            console.log(this.responseResult);
            console.log("用户列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectUser() {
    },
    setUserName() {
      for (var i = 0; i < this.userOptions.length; i++) {
        if (this.userId == this.userOptions[i].id) {
          this.userName = this.userOptions[i].name;
          this.$setTouristName(this.userName);
          break;
        }
      }
    }
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