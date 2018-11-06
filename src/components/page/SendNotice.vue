<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>发送公告</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）输入内容发送；不显示已下线的区服，已合服的只显示主服。未到开服时间的区服将不会发送公告。
                    <br/>
                    （2）只发送一次，如果发送失败，系统将持续发送24小时，直到成功或超过24小时；在没有发送成功时，管理员也可以取消发送；
                    <br/>
                    （3）设置了公告后，这些公告不会在日后开的新服生效，新服要单独设置公告。
                </div>
                
                <!-- <Divider /> -->
                <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="折叠" name="1">
                        <div class="form-box">
                    <el-form ref="form" :model="form" label-width="250px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="platformValue" @change="selectPlatform" placeholder="请选择渠道平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="选择服务器">
                            <span class="grid-content bg-purple-light" style="margin:16px;color:#888888" v-show="!checkVisible">请先选择平台</span>
                            
                            <el-checkbox-group v-model="serverList" @change="handleCheckedServer" v-show="checkVisible">
                                <el-checkbox v-for="item in serverOptions" :label="item.serverName" :key="item.serverId"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="消息类型">
                            <el-select v-model="searchForm.noticeType"  placeholder="请选择消息类型" style="width:180px">
                                <el-option
                                v-for="item in noticeTypeList"
                                :key="item.id"
                                :label="item.noticeType"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发放类型">
                            <el-select v-model="searchForm.sendType"  placeholder="请选择发放类型" style="width:180px">
                                <el-option
                                v-for="item in sendTypeList"
                                :key="item.id"
                                :label="item.sendType"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间间隔">
                           <el-input style="width:180px"
                            placeholder="时间间隔"
                            v-model="searchForm.timeInterval"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">秒（一天为86400秒），定时发送需要填写，默认为60秒间隔</span>
                            
                        </el-form-item>
                        <el-form-item label="循环次数">
                           <el-input style="width:180px"
                            placeholder="循环次数"
                            v-model="searchForm.cycleTime"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">不填写 默认为1次</span>
                            
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input style="width:515px"
                            placeholder="请输入发送内容" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="searchForm.noticeContent"
                            clearable>
                            </el-input>
                            
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">发送内容的格式以每个游戏自己的定义为准</span>
                            
                        </el-form-item>
                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                    
                        </el-form-item></el-form>
                    </div>
                    <Divider />
                </el-collapse-item>
                </el-collapse>
                <!-- <Divider /> -->

                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="playerName" label="平台"  >
                </el-table-column>
                <el-table-column prop="playerAccount" label="消息类型"  >
                </el-table-column>
                <el-table-column prop="playerId" label="发放类型" >
                </el-table-column>
                <el-table-column prop="isOnline" label="发送时间间隔" >
                </el-table-column>
                <el-table-column prop="lastIp" label="开始时间" >
                </el-table-column>
                <el-table-column prop="vipLevel" label="结束时间" >
                </el-table-column>
                <el-table-column prop="diamond"  label="内容" >
                </el-table-column>
                <el-table-column prop="rechargeAmount"  label="状态" >
                </el-table-column>
                <el-table-column prop="combatPower"  label="编辑人" >
                </el-table-column>
                <el-table-column prop="combatPower"  label="发送时间" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">
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
                <el-button type="primary" @click="ProhibitSpeakToNormal">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToBan = false">取 消</el-button>
                <el-button type="primary" @click="ToBan">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁封提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeBanToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeBanToNormal = false">取 消</el-button>
                <el-button type="primary" @click="BanToNormal">确 定</el-button>
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
      activeNames: ["1"],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      handleVisible: true,
      checkVisible: true,
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
        {
          serverId: "4",
          serverName: "服务器1"
        },
        {
          serverId: "5",
          serverName: "服务器2"
        },

      ],
      serverValue: "",
      serverList: [],
      serverLabel: "",
      form: {},
      id: 0,
      userId: 0,
      idx: 0,
      serverIp: "",
      tableData: [],
      sendTypeList: [],
      noticeTypeList: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      searchForm: {
        timeInterval:"",
        cycleTime:"",
        sendType:"",
        noticeType:"",
        noticeContent:""
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
    getSendType() {
      this.$axios
        .post("/getSendNoticeSendType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("公告发送类别获取成功");
            this.$message.success("公告发送类别获取成功");
            this.sendTypeList = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("公告发送类别获取失败");
            this.$message.error("公告发送类别获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getNoticeType() {
      this.$axios
        .post("/getSendNoticeNoticeType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("公告消息类别获取成功");
            this.$message.success("公告消息类别获取成功");
            this.noticeTypeList = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("公告消息类别获取失败");
            this.$message.error("公告消息类别获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getServerIp() {},
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.userId = userData.id;
      this.getPlatformList(this.userId);
      this.getNoticeType();
      this.getSendType();
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
    submit() {
        if(this.searchForm.timeInterval==""){
              this.$message("请输入正确的时间间隔");
              return;
        }
        if(this.searchForm.cycleTime==""){
              this.$message("请输入正确的循环次数");
              return;
        }
        console.log(this.searchForm);
        console.log(JSON.stringify(this.searchForm));
        console.log(JSON.stringify(this.serverList)); 


    },
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {
      console.log(this.serverList);
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
