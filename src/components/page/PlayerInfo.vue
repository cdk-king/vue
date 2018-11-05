<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>玩家信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）平台和服务器为必选，平台账号/角色ID/角色名/最后登录ip这四项必选其中一项，方可查询。
                    <br/>
                    （2）通过角色名查询，支持模糊匹配查询。
                </div>
                
                <!-- <Divider /> -->
                <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="折叠" name="1">
                        <div class="form-box">
                    <el-form ref="form" :model="form" label-width="100px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择渠道" >
                            <el-select v-model="platformValue" @change="selectPlatform" placeholder="请选择渠道平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <span style="margin-left:22px">选择服务器</span>
                            <el-select v-model="serverValue" @change="selectServer" placeholder="请选择服务器" style="width:180px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="平台账号">
                            <el-input style="width:180px"
                            placeholder="请输入平台账号"
                            v-model="searchForm.playerAccount"
                            clearable>
                            </el-input>
                            <span style="margin-left:36px">角色名</span>
                            <el-input style="width:180px"
                            placeholder="请输入角色名"
                            v-model="searchForm.playerName"
                            clearable>
                            </el-input>
                            <span style="margin-left:35px">角色ID</span>
                            <el-input style="width:180px"
                            placeholder="请输入角色ID"
                            v-model="searchForm.playerId"
                            clearable>
                            </el-input>
                            <span style="margin-left:22px">最后登录IP</span>
                            <el-input style="width:180px"
                            placeholder="请输入IP"
                            v-model="searchForm.lastIp"
                            clearable>
                            </el-input> 
                        </el-form-item>
                        <el-form-item label="是否在线">
                           <!-- @change="stateSelect" v-model="searchKey.state"-->
                            <el-select  placeholder="请选择"  v-model="searchForm.isOnline" class="handle-select mr10" style="width:180px">
                                <!-- @change="stateSelect" -->
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="在线" value="1"></el-option>
                                <el-option key="3" label="离线" value="2"></el-option>
                            </el-select>
                            <span style="margin-left:22px">是否禁言</span>
                                <el-select  placeholder="请选择"  v-model="searchForm.isProhibitSpeak" class="handle-select mr10" style="width:180px">
                                <!-- @change="stateSelect" -->
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="未禁言" value="1"></el-option>
                                <el-option key="3" label="已禁言" value="2"></el-option>
                            </el-select>
                            <span style="margin-left:22px">最后禁封</span>
                                <el-select  placeholder="请选择"  v-model="searchForm.isBan" class="handle-select mr10" style="width:180px">
                                <!-- @change="stateSelect" -->
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="未封禁" value="1"></el-option>
                                <el-option key="3" label="已封禁" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="VIP等级">

                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="searchForm.minVipLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="searchForm.maxVipLevel"
                            clearable>
                            </el-input>

                            <span style="margin-left:50px">钻石</span>

                            <el-input style="width:180px"
                            placeholder="最小元宝"
                            v-model="searchForm.minDiamond"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大元宝"
                            v-model="searchForm.maxDiamond"
                            clearable>
                            </el-input>

                        </el-form-item>
                        <el-form-item label="充值金额">

                            <el-input style="width:180px"
                            placeholder="最小金额"
                            v-model="searchForm.minRechargeAmount"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大金额"
                            v-model="searchForm.maxRechargeAmount"
                            clearable>
                            </el-input>

                            <span style="margin-left:50px">等级</span>
                            
                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="searchForm.minLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="searchForm.maxLevel"
                            clearable>
                            </el-input>

                        </el-form-item>

                        <el-form-item label="注册时间">
                                <el-date-picker style="width:180px" 
                                v-model="searchForm.minRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>

                                <span style="">—</span>

                                <el-date-picker style="width:180px"  
                                v-model="searchForm.maxRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>

                                <span style="margin-left:50px">战力</span>

                                <el-input style="width:180px"
                                placeholder="最小战力"
                                v-model="searchForm.minCombatPower"
                                clearable>
                                </el-input>

                                <span style="">—</span>

                                <el-input style="width:180px"
                                placeholder="最大战力"
                                v-model="searchForm.maxCombatPower"
                                clearable>
                                </el-input>

                        </el-form-item>
                        <el-form-item label="">
                            
                                <el-button type="primary" icon="search" @click="testMessage">查询</el-button>
                    
                        </el-form-item></el-form>
                    </div>
                </el-collapse-item>
                </el-collapse>
                <!-- <Divider /> -->

                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="playerName" label="玩家名"  >
                </el-table-column>
                <el-table-column prop="playerAccount" label="玩家账号"  >
                </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" >
                </el-table-column>
                <el-table-column prop="isOnline" label="是否在线"  :formatter="formatIsOnline">
                </el-table-column>
                <el-table-column prop="lastIp" label="最后登录IP" >
                </el-table-column>
                <el-table-column prop="vipLevel" label="会员等级" >
                </el-table-column>
                <el-table-column prop="diamond"  label="钻石" >
                </el-table-column>
                <el-table-column prop="rechargeAmount"  label="充值金额" >
                </el-table-column>
                <el-table-column prop="combatPower"  label="战力" >
                </el-table-column>
                <el-table-column prop="isProhibitSpeak"  label="是否禁言" :formatter="formatIsProhibitSpeak"> 
                    	<template slot-scope="scope">
                            <span v-if="scope.row.isProhibitSpeak==0" style="color:#000000">正常</span>
                            <span v-else style="color: red" >已禁言</span>
                        </template>
                </el-table-column>
                <el-table-column prop="isBan"  label="是否禁封" :formatter="formatIsBan"> 
                    <template slot-scope="scope">
                            <span v-if="scope.row.isBan==0" style="color:#000000">正常</span>
                            <span v-else style="color: red" >已禁封</span>
                    </template>
                </el-table-column>
                <el-table-column prop="registrationTime"  :formatter="formatter" label="注册时间" > 
                </el-table-column>
                <el-table-column prop="platform"  label="平台" >
                </el-table-column>
                <el-table-column prop="server"  label="服务器" >
                </el-table-column>
                
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeToProhibitSpeak(scope.$index, scope.row)" v-if="scope.row.isProhibitSpeak!=1">禁言</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeProhibitSpeakToNormal(scope.$index, scope.row)" v-if="scope.row.isProhibitSpeak==1">解除禁言</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeToBan(scope.$index, scope.row)" v-if="scope.row.isBan!=1">禁封</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeBanToNormal(scope.$index, scope.row)" v-if="scope.row.isBan==1">解除禁封</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
               </div>     
            <!-- 编辑提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
                <div class="del-dialog-cnt">是否确定？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        <!-- 编辑禁言提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToProhibitSpeak" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToProhibitSpeak = false">取 消</el-button>
                <el-button type="primary" @click="ToProhibitSpeak">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁言提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeProhibitSpeakToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeProhibitSpeakToNormal = false">取 消</el-button>
                <el-button type="primary" @click="ChangeProhibitSpeakToNormal">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToBan = false">取 消</el-button>
                <el-button type="primary" @click="ChangeToBan">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁封提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeBanToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeBanToNormal = false">取 消</el-button>
                <el-button type="primary" @click="ChangeBanToNormal">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
export default {
  name: "PlayerInfo",
  data() {
    return {
        activeNames: ['1'],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      handleVisible: true,
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
      form: {},
      id: 0,
      idx: 0,
      serverIp: "",
      tableData: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      searchForm: {
        playerName: "",
        playerAccount: "",
        playerId: "",
        lastIp: "",
        isOnline: "",
        isProhibitSpeak: "",
        isBan: "",
        minVipLevel: "",
        maxVipLevel: "",
        minDiamond: "",
        maxDiamond: "",
        minRechargeAmount: "",
        maxRechargeAmount: "",
        minLevel: "",
        maxLevel: "",
        minRegistrationTime: "",
        maxRegistrationTime: "",
        minCombatPower: "",
        maxCombatPower: ""
      }
    };
  },
  components: {
    "t-dialog": dialog
  },

  computed: {
    data() {
      return this.tableData;
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
            return false;
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
      this.getServerList(this.platformValue);
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            console.log("当前serverIp:" + this.serverIp);
            this.$message.success("当前serverIp:" + this.serverIp);
            break;
          }
        }
      }

      this.getPlayer();
    },
    getPlayer() {
        this.$axios
        .post("/getPlayer", {
          platformId: this.platformValue,
          serverId: this.serverValue,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          searchForm: JSON.stringify(this.searchForm)
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家列表获取成功");
            this.$message.success("玩家列表获取成功");
            this.tableData = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("玩家列表获取失败");
            this.$message.error("玩家列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getServerIp() {},
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.id = userData.id;
      this.getPlatformList(this.id);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("page:" + val);
      this.selectServer();
    },
    formatter(row, column) {
      //return row.address;
      //时间格式化

      var date = row[column.property];
      if (date == undefined) {
        return "";
      }

      var tt = new Date(parseInt(date)).toLocaleString();
      return tt;
    },
    testMessage() {
      console.log(this.searchForm);
      console.log(JSON.stringify(this.searchForm));
      this.getPlayer();
    },
    testDialog() {
      this.dialogVisible = true;
    },
    formatIsBan: function(row, column, cellValue, index) {
      return row.isBan == 1 ? "已禁封" : "正常";
    },
    formatIsOnline: function(row, column, cellValue, index) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
    formatIsProhibitSpeak: function(row, column, cellValue, index) {
      return row.isProhibitSpeak == 1 ? "已禁言" : "正常";
    },
    handleChangeToProhibitSpeak(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeToProhibitSpeak = true;
        
    },
    handleChangeProhibitSpeakToNormal(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeProhibitSpeakToNormal = true;
      
    },
    ToProhibitSpeak() {
        this.$axios
        .post("/ChangeToProhibitSpeak", {
            platformId: this.platformValue,
            serverId: this.serverValue,
            playerName:this.tableData[this.idx].playerName,
            playerAccount:this.tableData[this.idx].playerAccount,
            playerId:this.tableData[this.idx].playerId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家禁言成功");
            this.$message.success("玩家禁言成功");
            this.ChangeToProhibitSpeak = false;
            this.getPlayer();
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});

    },
    ChangeProhibitSpeakToNormal() {
        this.$axios
        .post("/ChangeProhibitSpeakToNormal", {
            platformId: this.platformValue,
            serverId: this.serverValue,
            playerName:"",
            playerAccount:"",
            playerId:""
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家解除禁言成功");
            this.$message.success("玩家解除禁言成功");
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    handleChangeToBan(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeToBan = true;
    },
    handleChangeBanToNormal(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeBanToNormal = true;
    },
    ChangeToBan() {
        this.$axios
        .post("/ChangeToBan", {
            platformId: this.platformValue,
            serverId: this.serverValue,
            playerName:"",
            playerAccount:"",
            playerId:""
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家禁封成功");
            this.$message.success("玩家禁封成功");
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    ChangeBanToNormal() {
        this.$axios
        .post("/ChangeProhibitSpeakToNormal", {
            platformId: this.platformValue,
            serverId: this.serverValue,
            playerName:"",
            playerAccount:"",
            playerId:""
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家解除禁封成功");
            this.$message.success("玩家解除禁封成功");
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
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
