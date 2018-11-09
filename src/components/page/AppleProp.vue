<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>道具申请</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）两种申请方式（为指定角色申请、为全服玩家申请）只能选择其中的一种；
                    <br/>
                    （2）如果需要发送钻石，请找策划把钻石包装成一个道具，之后通过该接口发送，发送的钻石不会提升玩家的vip等级；
                </div>
                
                <Divider />

                    <div class="form-box">
                    <el-form ref="form" :model="form" label-width="150px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择渠道">
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="el-form-item" label="选择服务器">
                            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器" style="width:180px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="标题">
                            <el-input style="width:215px"
                            placeholder="请输入标题"
                            v-model="form.releaseTitle"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item  label="说明（玩家看到）">
                            <el-input style="width:515px" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            placeholder="请输入说明"
                            v-model="form.releaseContent"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="需要发送的道具">
                            <el-select v-model="form.prop" @change="selectProp" placeholder="请选择道具">
                                <el-option
                                v-for="item in propOptions"
                                :key="item.id"
                                :label="item.propName"
                                :value="item">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
                        </el-form-item>
                        <el-form-item label="已选择道具列表">

                            <el-table :data="propData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">

                                <el-table-column prop="propName" label="道具名称"  >
                                </el-table-column>
                                <el-table-column prop="propTag" label="道具ID"  >
                                </el-table-column>
                                <el-table-column prop="propCount" label="数量" >
                                </el-table-column>
                                <el-table-column prop="propDescribe" label="	装备属性"  >
                                </el-table-column>
                                <el-table-column prop="column5" label="	过期时间(秒)" >
                                </el-table-column>

                                <el-table-column label="操作"  align="center" v-if="handleVisible">
                                    <template slot-scope="scope">

                                    </template>
                                </el-table-column>

                            </el-table>

                        </el-form-item>
               
                        </el-form>

                    </div>

                <Divider />

                    <el-tabs type="border-card">
                    <el-tab-pane label="为指定角色申请">为指定角色申请
                        <el-form ref="form" :model="form" label-width="350px">

                        <el-form-item label="玩家账号">
                            <el-input style="width:515px"
                            placeholder="请输入玩家账号" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}" 
                            v-model="input10"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item label="玩家名称">
                            <el-input style="width:515px"
                            placeholder="请输入玩家名称" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色ID">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="玩家类型">
                            <el-select v-model="platformValue" @change="selectPlatform" placeholder="请选择渠道平台">
                                <el-option key="0" label="全部" value="0"></el-option>
                                <el-option key="1" label="玩家" value="1"></el-option>
                                <el-option key="2" label="内部" value="2"></el-option>
                                <el-option key="2" label="管理员" value="2"></el-option>
                                <el-option key="2" label="新手引导员" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="物品绑定">
                            <el-radio v-model="radio" label="1">绑定</el-radio>
                            <el-radio v-model="radio" label="2">不绑定</el-radio>
                        </el-form-item>

                        <el-form-item label="申请人">
                            <el-input style="width:215px"
                            placeholder="请输入"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请说明">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            
                                <el-button type="primary" icon="search" @click="testMessage">申请</el-button>
                                <el-button type="primary" icon="search" @click="testMessage">重置</el-button>
                    
                        </el-form-item>

                        <Divider />
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="为全服玩家申请">为全服玩家申请
                        <el-form ref="form" :model="form" label-width="350px">
                        
                        <el-form-item label="物品绑定">
                            <el-radio v-model="radio" label="1">绑定</el-radio>
                            <el-radio v-model="radio" label="2">不绑定</el-radio>
                        </el-form-item>

                        <el-form-item label="申请人">
                            <el-input style="width:215px"
                            placeholder="请输入"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请说明">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                                <el-button type="primary" icon="search" @click="testMessage">申请</el-button>
                                <el-button type="primary" icon="search" @click="testMessage">重置</el-button>
                        </el-form-item>
                        <Divider />
                        </el-form>
                    </el-tab-pane>
                    </el-tabs>
            </div>
            <!-- 编辑冻结提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
                <div class="del-dialog-cnt">是否确定？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
export default {
  name: "AppleProp",
  data() {
    return {
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      platformOptions: [
        {
          platformId: "1",
          platformName: "渠道1"
        },
        {
          platformId: "2",
          platformName: "渠道2"
        }
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [
        // {
        //   serverId: "1",
        //   serverName: "服务器1"
        // }
      ],
      serverValue: "",
      serverLabel: "",
      form: {
          platformId:"",
            serverId:"",
            prop:{},


      },
      id: 0,
      serverIp: "",
      checkVisible: false,
      propOptions:[],
      propData:[],
    };
  },
  components: {
    "t-dialog": dialog
  },
  computed: {
    propData() {
      return this.propData;
    },
    cdk: function() {
      return this.$cdk;
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    this.getData();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getPlatformList(this.id);
      }.bind(this)
    );
  },
  methods: {
      selectProp(){
          console.log(this.form.prop);
      },
    addPropToList(){
        var prop = this.form.prop;
        this.propData.push(prop);
    },
    getPropList() {
        this.$axios.post("/getPropUplaod", {
            pageNo: 1,
            pageSize: 10,
            isPage:"",
            platformId:this.form.platformId,
            strPlatform:this.form.platformId
        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("道具列表获取成功");
                //this.$message.success("道具列表获取成功");
                this.propOptions = successResponse.data.data.list;
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("道具列表获取失败");
                return false;
            }
        })
    },
    getPlatformList(userId) {
      this.$axios
        .post("/getPlatformListForUserIdAndGameId", {
          userId: userId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("用户渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("用户渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post("/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("渠道服务器列表获取成功");
            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("渠道服务器列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getServerList(this.form.platformId);
      this.getPropList();
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            console.log("当前serverIp:" + this.serverIp);
            this.$message.success("当前serverIp:" + this.serverIp);
            return;
          }
        }
      }
    },
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.id = userData.id;
      this.getPlatformList(this.id);
    },
    testMessage() {
      this.$message.success("success");
      this.$message.success(this.$cdk);
    },
    testDialog() {
      this.dialogVisible = true;
    }
  },
  watch: {
    aa: function(curVal, oldVal) {
      console.log(curVal);
      this.$message(curVal);
    }
  }
};
</script>

<style scoped>
.el-form-item {
  /* border: 1px solid red; */
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
