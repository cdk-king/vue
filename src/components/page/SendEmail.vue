<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document"></i>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>发送邮件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>（1）两种发送方式（为指定角色发送、为全服玩家发送）只能选择其中的一种。
        <br>（2）指定角色发送当中输入的角色Id和角色名，只会生效一种
        <br>（3）输入多个角色Id和角色名，请用","分隔
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="折叠" name="1">
          <div class="form-box">
            <el-form ref="form" :model="form" label-width="250px">
              <el-form-item class="el-form-item" label="选择平台">
                <el-select
                  v-model="form.platformId"
                  @change="selectPlatform"
                  placeholder="请选择平台"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.platformId"
                    :label="item.platform"
                    :value="item.platformId"
                  ></el-option>
                </el-select>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="选择服务器">
                <el-select
                  v-model="form.serverId"
                  @change="selectServer"
                  placeholder="请选择服务器"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in serverOptions"
                    :key="item.serverId"
                    :label="item.serverName"
                    :value="item.serverId"
                  ></el-option>
                </el-select>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>

              <el-form-item label="标题">
                <el-input
                  style="width:430px"
                  placeholder="请输入标题"
                  v-model="form.emailTitle"
                  clearable
                ></el-input>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="邮件内容">
                <el-input
                  style="width:430px"
                  placeholder="请输入邮件内容"
                  type="textarea"
                  :autosize="{ minRows:6, maxRows: 10}"
                  v-model="form.emailContent"
                  v-on:change="changeContent"
                  clearable
                ></el-input>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
                <span class="grid-content bg-purple-light" style="margin:20px;color:red" v-show="maxLengthVisible">{{"超过最大字符长度"+countMaxLength}}</span>
              </el-form-item>
              <el-form-item label="发送原因">
                <el-input
                  style="width:515px"
                  placeholder="请输入发送原因"
                  type="textarea"
                  :autosize="{ minRows:1, maxRows: 10}"
                  v-model="form.sendReason"
                  clearable
                ></el-input>
              </el-form-item>

              <el-tabs type="border-card" @tab-click="handleClick" v-model="editableTabsValue">
                <el-tab-pane label="按角色发送" name="2">
                  <el-form-item label="角色ID">
                    <el-input
                      style="width:515px"
                      placeholder="请输入角色ID"
                      type="textarea"
                      :autosize="{ minRows:2, maxRows: 10}"
                      v-model="form.playerIdList"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色名称">
                    <el-input
                      style="width:515px"
                      placeholder="请输入角色名称"
                      type="textarea"
                      :autosize="{ minRows:2, maxRows: 10}"
                      v-model="form.playerNameList"
                      clearable
                    ></el-input>
                  </el-form-item>

                  <el-form-item label>
                    <el-button type="primary" icon="search" @click="submit">提交邮件申请</el-button>
                    <el-button type="primary" icon="search" @click="reset">重置</el-button>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="全服发送" name="3">
                  <el-form-item label>
                    <el-button type="primary" icon="search" @click="submit">提交邮件申请</el-button>
                    <el-button type="primary" icon="search" @click="reset">重置</el-button>
                  </el-form-item>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="margin:15px;">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          v-model="searchKey.platformId"
          @change="selectSearchKeyPlatform"
          placeholder="筛选平台"
          style="width:150px"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in platformOptions"
            :key="item.platformId"
            :label="item.platform"
            :value="item.platformId"
          ></el-option>
        </el-select>
        <span class="grid-content bg-purple-light">服务器：</span>
        <el-select
          v-model="searchKey.serverName"
          @change="selectSearchKeyServer"
          placeholder="筛选服务器"
          style="width:150px"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in searchKeyServerOptions"
            :key="item.serverName"
            :label="item.serverName"
            :value="item.serverName"
          ></el-option>
        </el-select>
        <span class="grid-content bg-purple-light">内容：</span>
        <el-input
          v-model="searchKey.emailContent"
          placeholder="筛选内容"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>

      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="platform" label="平台"></el-table-column>
        <el-table-column prop="server" label="服务器"></el-table-column>
        <el-table-column prop="sendType" label="发送类型" :formatter="formatterSendType"></el-table-column>
        <el-table-column prop="emailTitle" label="标题"></el-table-column>
        <el-table-column prop="emailContent" label="内容" width="300"></el-table-column>
        
        <el-table-column prop="sendReason" label="原因"></el-table-column>
        <el-table-column prop="playerIdList" label="角色ID"></el-table-column>
        <el-table-column prop="playerNameList" label="角色名称"></el-table-column>
        <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="sendDatetime" label="发送时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="sendState" label="状态" :formatter="formatIsSend"></el-table-column>
        <el-table-column prop="userName" label="编辑人"></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" fixed="right" width="130px">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="scope.row.sendState!=1"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-message"
              @click="handleSend(scope.$index, scope.row)"
              v-if="scope.row.sendState!=1"
            >发送</el-button>

            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑提示框 -->
    <el-dialog title="编辑邮件" :visible.sync="dialogVisible" width="900px" center>
      <el-form ref="form" :model="form" label-width="250px">
        <el-form-item class="el-form-item" label="选择平台">
          <el-select
            v-model="form.platformId"
            @change="selectPlatform"
            placeholder="请选择平台"
            style="width:180px"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="选择服务器">
          <el-select
            v-model="form.serverId"
            @change="selectServer"
            placeholder="请选择服务器"
            style="width:180px"
          >
            <el-option
              v-for="item in serverOptions"
              :key="item.serverId"
              :label="item.serverName"
              :value="item.serverId"
            ></el-option>
          </el-select>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>

        <el-form-item label="标题">
          <el-input style="width:430px" placeholder="请输入标题" v-model="form.emailTitle" clearable></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="邮件内容">
          <el-input
            style="width:430px"
            placeholder="请输入邮件内容"
            type="textarea"
            :autosize="{ minRows:6, maxRows: 10}"
            v-model="form.emailContent"
            v-on:change="changeContent"
            clearable
          ></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
          <p class="grid-content bg-purple-light" style="margin:20px;color:red" v-show="maxLengthVisible">{{"超过最大字符长度"+countMaxLength}}</p>
        </el-form-item>
        <el-form-item label="发送原因">
          <el-input
            style="width:515px"
            placeholder="请输入发送原因"
            type="textarea"
            :autosize="{ minRows:1, maxRows: 10}"
            v-model="form.sendReason"
            clearable
          ></el-input>
        </el-form-item>
        <div v-if="form.sendType == 2">
          <el-form-item label="玩家账号">
            <el-input
              style="width:515px"
              placeholder="请输入玩家账号"
              type="textarea"
              :autosize="{ minRows:2, maxRows: 10}"
              v-model="form.playerAccountList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="玩家名称">
            <el-input
              style="width:515px"
              placeholder="请输入玩家名称"
              type="textarea"
              :autosize="{ minRows:2, maxRows: 10}"
              v-model="form.playerNameList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="角色ID">
            <el-input
              style="width:515px"
              placeholder="请输入角色ID"
              type="textarea"
              :autosize="{ minRows:2, maxRows: 10}"
              v-model="form.playerIdList"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label>
          <el-button type="primary" icon="search" @click="saveEdit">编辑</el-button>
          <el-button type="primary" icon="search" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量删除提示框 -->
    <el-dialog title="批量删除提示" :visible.sync="delAllVisible" width="300px" center>
      <div class="del-dialog-cnt">批量删除不可恢复，是否确定批量删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDelAll">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="删除提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发送提示框 -->
    <el-dialog title="发送提示" :visible.sync="sendVisible" width="300px" center>
      <div class="del-dialog-cnt">发送后不能修改撤回，是否确定发送？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "PlayerInfo",
  data() {
    return {
      activeNames: ["1"],
      editableTabsValue: "2",
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      cur_page: 1,
      total: 0,
      handleVisible: true,
      delVisible:false,
      sendVisible:false,
      checkVisible: false,
      platformOptions: [
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [],
      searchKeyServerOptions: [],
      serverValue: "",
      serverList: [],
      serverLabel: "",
      form: {
        platformId: "",
        serverId: "",
        emailTitle: "",
        emailContent: "",
        sendReason: "",
        playerNameList: "",
        playerAccountList: "",
        playerIdList: "",
      },
      id: 0,
      userId: 0,
      idx: 0,
      serverIp: "",
      tableData: [],
      sendTypeList: [],
      EmailTypeList: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      searchKey: {
        timeInterval: "",
        cycleTime: "",
        sendType: "",
        emailType: "",
        emailContent: ""
      },
      delAllVisible: false,
      url: "http://localhost:8011",
      strPlatform: "",
      maxLengthVisible:false,
      countMaxLength:600,
    };
  },
  components: {
  },

  computed: {
    data() {
      return this.tableData;
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    setLocalThisUrl(this);
    this.getData();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.form.platformId="";
        this.form.serverId="";
        this.searchKey.platformId="";
        this.searchKey.serverId="";
        this.getPlatformList(this.id);
      }.bind(this)
    );
  },
  beforeDestroy() {
    bus.$off("changeGameId");
  },
  methods: {
    getPlatformList(userId) {
      this.$axios
        .post(this.url + "/getPlatformListForUserIdAndGameId", {
          userId: userId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("用户平台列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            this.strPlatform = this.strPlatform.substring(  
              0,
              this.strPlatform.length - 1
            );
            this.getEmail();
          } else {
            this.platformOptions =[];
            this.strPlatform = "";
            console.log(this.responseResult);
            console.log("用户平台列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("服务器列表获取成功");
            this.serverOptions = successResponse.data.data;
          } else {
            this.serverOptions =[];
            this.form.serverId = "";
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {
          this.form.serverId = "";
          this.serverOptions = [];
        });
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("服务器列表获取成功");
            this.searchKeyServerOptions = successResponse.data.data;
          } else {
            this.searchKeyServerOptions =[];
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getServerList(this.form.platformId);
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            break;
          }
        }
      }

      this.getEmail();
    },
    getEmail() {
      this.$axios
        .post(this.url + "/getEmail", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          emailContent: this.searchKey.emailContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          strPlatform: this.strPlatform,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("邮件列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
            this.mapDate();
          } else {
            this.tableData =[];
            this.total =0;
            console.log(this.responseResult);
            console.log("邮件列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.userId = userData.id;
      this.getPlatformList(this.userId);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.selectServer();
    },
    changeContent(){
      if(this.form.emailContent.length>this.countMaxLength){
          this.$message.info("超过最大字符长度"+this.countMaxLength);
          this.maxLengthVisible = true;
      }else{
          this.maxLengthVisible = false;
      }
    },
    formatter(row, column) {
      //时间格式化
      var date = row[column.property];
      return formatDatetime(date);
    },
    handleClick(tab, event) {
    },
    submit() {
      var data = {};
      if (this.form.platformId == "") {
        this.$message("请选择正确的平台");
        return;
      }
      if (this.form.serverId == "") {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.emailTitle == "") {
        this.$message("标题不能为空");
        return;
      }
      if (this.form.emailContent == "") {
        this.$message("内容不能为空");
        return;
      }
      if (this.form.emailContent.length > this.countMaxLength) {
        this.$message("内容超过最大字数上限");
        return;
      }
      if (this.editableTabsValue == "2") {
        data = {
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          sendType: 2,

          playerNameList: this.form.playerNameList,
          playerAccountList: this.form.playerAccountList,
          playerIdList: this.form.playerIdList,

          addUser: this.userId,
          gameId:this.$gameId
        };
        if(this.form.playerNameList=="" && this.form.playerIdList==""){
            this.$message("请输入其中一项角色信息");
            return;
        }
      }
      if (this.editableTabsValue == "3") {
        data = {
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          sendType: 3,
          addUser: this.userId,
          gameId:this.$gameId
        };
      }
      this.$axios
        .post(this.url + "/addEmail", data)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("邮件添加成功");
            this.$message.success("邮件添加成功");
            this.getEmail();
          } else {
            console.log(this.responseResult);
            console.log("邮件添加失败");
            this.$message.error("邮件添加失败");
          }
        })
        .catch(failResponse => {});
    },
    saveEdit() {
      var data = {};
      if (this.form.platformId == "") {
        this.$message("请选择正确的平台");
        return;
      }
      if (this.form.serverId == "") {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.emailTitle == "") {
        this.$message("标题不能为空");
        return;
      }
      if (this.form.emailContent == "") {
        this.$message("内容不能为空");
        return;
      }
      if (this.form.emailContent.length > this.countMaxLength) {
        this.$message("内容超过最大字数上限");
        return;
      }
      if (this.form.sendType == 2) {
        data = {
          id: this.form.id,
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          sendType: 2,
          playerNameList: this.form.playerNameList,
          playerAccountList: this.form.playerAccountList,
          playerIdList: this.form.playerIdList,
          addUser: this.userId,
          gameId:this.$gameId
        };
      }
      if (this.form.sendType == 3) {
        data = {
          id: this.form.id,
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          sendType: 3,
          addUser: this.userId,
          gameId:this.$gameId
        };
      }
      this.$axios
        .post(this.url + "/editEmail", data)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("邮件编辑成功");
            this.$message.success("邮件编辑成功");
            this.getEmail();
            this.dialogVisible = false;
          } else {
            console.log(this.responseResult);
            console.log("邮件编辑失败");
            this.$message.error("邮件编辑失败");
          }
        })
        .catch(failResponse => {});
    },
    mapDate() {},
    reset() {
      this.form = {
        platformId: "",
        serverId: "",
        emailTitle: "",
        emailContent: "",
        sendReason: "",
        sendType: "",

        playerAccountList: "",
        playerNameList: "",
        playerIdList: "",

        addUser: ""
      };
    },
    timestampToStr(timestamp) {
      if (timestamp == null) {
        return null;
      }
      var d = new Date(timestamp); //根据时间戳生成的时间对象

      var date =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      return date;
    },
    handleEdit(index, row) {
      this.idx = index;
      var item = this.tableData[index];
      this.form = {
        id: item.id,
        platformId: item.platformId,
        serverId: item.serverId,
        emailTitle: item.emailTitle,
        emailContent: item.emailContent,
        sendReason: item.sendReason,
        sendType: item.sendType,

        playerAccountList: item.playerAccountList,
        playerNameList: item.playerNameList,
        playerIdList: item.playerIdList,

        addUser: item.userId
      };
      this.getServerList(item.platformId);
      this.dialogVisible = true;
    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getEmail();
    },
    selectSearchKeyServer() {
      this.getEmail();
    },
    formatter(row, column) {
      //时间格式化
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      var tt = new Date(parseInt(date)).toLocaleString();
      return tt;
    },
    handleSend(index, row) {
      this.idx = index;
      this.sendVisible = true;
    },
    saveSend(){
        var item = this.tableData[this.idx];
        this.$axios
        .post(this.url + "/sendEmail", {
          id: item.id,
          platformId: item.platformId,
          serverId: item.serverId,
          emailTitle: item.emailTitle,
          emailContent: item.emailContent,
          sendType: item.sendType,
          playerNameList: item.playerNameList,
          playerIdList: item.playerIdList,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("邮件发送完成");
            this.getEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("邮件发送失败");
            this.getEmail();
          }
        })
        .catch(failResponse => {});
        this.sendVisible = false;
    },
    handleDelete(index, row) {
        this.idx = index;
        this.delVisible = true;
    },
    saveDel(){
        this.$axios
          .post(this.url + "/deleteEmail", {
            id: this.tableData[this.idx].id
          })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("邮件删除完成");
            this.getEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("邮件删除失败");
          }
        })
        .catch(failResponse => {});
        this.delVisible = false;
    },
    search() {
      this.getEmail();
    },
    formatterSendType(row, column, cellValue, index) {
      return row.sendType == 1 ? "范围" : row.sendType == 2 ? "角色" : "全服";
    },
    formatIsSend(row, column, cellValue, index) {
      return row.sendState == 1
        ? "已发送"
        : row.sendState == 2
        ? "发送失败"
        : "未发送";
    },
    formatEmailType(row, column, cellValue, index) {
      for (var i = 0; i < this.EmailTypeList.length; i++) {
        if (this.EmailTypeList[i].id == row.EmailType) {
          return this.EmailTypeList[i].EmailType;
        }
      }
    },
    formatSendType(row, column, cellValue, index) {
      for (var i = 0; i < this.sendTypeList.length; i++) {
        if (this.sendTypeList[i].id == row.sendType) {
          return this.sendTypeList[i].sendType;
        }
      }
    },
    handleDelAll() {
      this.delAllVisible = true;
    },
    saveDelAll() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      //批量删除处理
      this.$axios
        .post(this.url + "/deleteAllEmail", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("邮件批量删除完成");
            this.multipleSelection = [];
            this.getEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("邮件批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  watch: {
  }
};
</script>

<style scoped>
.el-form-item {
  width: 100%;
}
.form-box {
  width: 100%;
}
.red{
  color: red;
}
</style>
