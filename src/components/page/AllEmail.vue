<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document"></i>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>全服邮件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>(1)选择多个服务器发送邮件，系统会依次向每个服务器发送更新请求
        <br>(2)发送失败后会显示失败服务器的id，点击重新发送会对失败的服务器重新发送邮件
      </div>

      <Divider/>

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
        <el-button type="primary" icon="search" @click="handleAddPlatformEmail">添加全服邮件申请</el-button>
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
        <el-table-column prop="serverList" label="服务器">
          <template slot-scope="scope">
            <p
              style
              v-for="item in scope.row.serverList.substring(1,scope.row.serverList.length-1).split(',') "
              :key="item"
              :label="item.substring(1,item.length-1)"
              :value="item"
            >{{item.substring(1,item.length-1)}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="emailTitle" label="标题"></el-table-column>
        <el-table-column prop="emailContent" label="内容" width="250"></el-table-column>
        <el-table-column prop="sendReason" label="原因"></el-table-column>
        <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="startDatetime" label="发送时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="sendState" label="状态" :formatter="formatIsSend"></el-table-column>
        <el-table-column prop="userName" label="编辑人"></el-table-column>
        <el-table-column prop="errorList" label="错误列表">
          <template slot-scope="scope">
            <p
              style
              v-for="item in (scope.row.errorList!=null ? scope.row.errorList.split(','):[])"
              :key="item"
              :label="item"
              :value="item"
            >{{ formatServer(item,scope.row.platformId) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" fixed="right" width="130px">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="scope.row.sendState!=1 && scope.row.sendState!=2"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-message"
              @click="handleSend(scope.$index, scope.row)"
              v-if="scope.row.sendState!=1 && scope.row.sendState!=2"
            >发送</el-button>
            <el-button
              type="text"
              icon="el-icon-message"
              @click="handleReSend(scope.$index, scope.row)"
              v-if="scope.row.sendState==2"
            >重新发送</el-button>
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
    <!-- 添加框 -->
    <el-dialog
      title="添加全服邮件申请"
      :visible.sync="addPlatformEmailVisible"
      width="900px"
      center
      :modal="false"
      :close-on-click-modal="false"
    >
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
            <span
              class="grid-content bg-purple-light"
              style="margin:16px;color:#888888"
              v-show="!checkVisible"
            >请先选择平台</span>

            <el-checkbox-group
              v-model="form.serverList"
              @change="handleCheckedServer"
              v-show="checkVisible"
            >
              <el-checkbox
                v-for="item in serverOptions"
                :label="item.serverId+'-'+item.serverName"
                :key="item.serverId"
              ></el-checkbox>
            </el-checkbox-group>
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
              :autosize="{ minRows:4, maxRows: 10}"
              v-model="form.sendReason"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" icon="search" @click="submit">提交</el-button>
            <el-button @click="addPlatformEmailVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog
      title="编辑全服邮件申请"
      :visible.sync="editPlatformEmailVisible"
      width="900px"
      center
      :modal="false"
      :close-on-click-modal="false"
    >
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
            <span
              class="grid-content bg-purple-light"
              style="margin:16px;color:#888888"
              v-show="!checkVisible"
            >请先选择平台</span>
            <el-checkbox-group
              v-model="form.serverList"
              @change="handleCheckedServer"
              v-show="checkVisible"
            >
              <el-checkbox
                v-for="item in serverOptions"
                :label="item.serverId+'-'+item.serverName"
                :key="item.serverId"
              ></el-checkbox>
            </el-checkbox-group>
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
              :autosize="{ minRows:4, maxRows: 10}"
              v-model="form.sendReason"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" icon="search" @click="editPlatformEmail">提交</el-button>
            <el-button @click="editPlatformEmailVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
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
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      cur_page: 1,
      total: 0,
      handleVisible: true,
      delVisible:false,
      sendVisible:false,
      checkVisible: false,
      addPlatformEmailVisible: false,
      editPlatformEmailVisible: false,
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
        serverList: [],
        emailTitle: "",
        emailContent: "",
        sendReason: ""
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
      countMaxLength:600
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
    this.getAllServer();
    this.getData();

    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.searchKey.platformId = "";
        this.searchKey.serverName = "";
        this.form.serverList =  [];
        this.form.platformId = "";
        this.getPlatformList(this.id);
      }.bind(this)
    );
  },
  beforeDestroy () {
      bus.$off('changeGameId');
  },
  methods: {
    formatServer(item, platformId) {
      for (var i = 0; i < this.allServerList.length; i++) {
        if (this.allServerList[i].id == item) {
          return this.allServerList[i].server;
        }
      }
    },
    getAllServer() {
      this.$axios
        .post(this.url + "/getAllServer", {
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.allServerList = successResponse.data.data.list;
          } else {
            this.allServerList =[];
            console.log(this.responseResult);
          }
        })
        .catch(failResponse => {});
    },
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
            this.getPlatformEmail();
          } else {
            this.platformOptions = [];
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
            this.checkVisible = true;
          } else {
            this.form.serverList = [];
            this.serverOptions = [];
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {
          this.form.serverList = [];
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
            this.searchKeyServerOptions = [];
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.form.serverList = [];
      this.serverOptions = [];
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
      this.getPlatformEmail();
    },
    getPlatformEmail() {
      this.$axios
        .post(this.url + "/getPlatformEmail", {
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
          } else {
            this.tableData = [];
            this.total =0;
            console.log(this.responseResult);
            console.log("邮件列表获取失败");
            this.$message.error("邮件列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerIp() {},
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
    formatter(row, column) {
      //时间格式化               
      var date = row[column.property];
      return formatDatetime(date);
    },
    changeContent(){
      if(this.form.emailContent.length>this.countMaxLength){
          this.$message.info("超过最大字符长度"+this.countMaxLength);
          this.maxLengthVisible = true;
      }else{
          this.maxLengthVisible = false;
      }
    },
    handleAddPlatformEmail() {
      this.form = {
        platformId: "",
        serverList: [],
        emailTitle: "",
        emailContent: "",
        sendReason: ""
      };
      this.addPlatformEmailVisible = true;
    },
    submit() {
      if (this.form.platformId == "" || this.form.platformId == undefined) {
        this.$message("请选择正确的平台");
        return;
      }
      if (
        this.form.serverList.length == 0 ||
        this.form.serverList == undefined
      ) {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.emailTitle == "") {
        this.$message("请输入正确的邮件标题");
        return;
      }
      if (this.form.emailContent == "") {
        this.$message("请输入正确的邮件内容");
        return;
      }
      if (this.form.emailContent.length > this.countMaxLength) {
        this.$message("内容长度超过最大限制"+this.countMaxLength);
        return;
      }

      this.$axios
        .post(this.url + "/addPlatformEmail", {
          platformId: this.form.platformId,
          serverList: JSON.stringify(this.form.serverList),
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          startDatetime: this.form.startDatetime,
          endDatetime: this.form.endDatetime,
          addUser: this.userId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("全服邮件添加成功");
            this.$message.success("全服邮件添加成功");
            this.getPlatformEmail();
            this.addPlatformEmailVisible = false;
          } else {
            console.log("全服邮件添加失败");
            this.$message.error("全服邮件添加失败");
          }
        })
        .catch(failResponse => {});
    },
    editPlatformEmail() {
      if (this.form.platformId == "" || this.form.platformId == undefined) {
        this.$message("请选择正确的平台");
        return;
      }
      if (
        this.form.serverList.length == 0 ||
        this.form.serverList == undefined
      ) {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.EmailTitle == "") {
        this.$message("请输入正确的邮件标题");
        return;
      }
      if (this.form.EmailContent == "") {
        this.$message("请输入正确的邮件内容");
        return;
      }

      this.$axios
        .post(this.url + "/editPlatformEmail", {
          id: this.form.id,
          platformId: this.form.platformId,
          serverList: JSON.stringify(this.form.serverList),
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          startDatetime: this.form.startDatetime,
          endDatetime: this.form.endDatetime,
          addUser: this.userId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("全服邮件编辑成功");
            this.$message.success("全服邮件编辑成功");
            this.getPlatformEmail();
            this.editPlatformEmailVisible = false;
          } else {
            console.log("全服邮件编辑失败");
            this.$message.error("全服邮件编辑失败");
          }
        })
        .catch(failResponse => {});
    },
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {

    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getPlatformEmail();
    },
    selectSearchKeyServer() {
      this.getPlatformEmail();
    },
    handleSend(index, row) {
      this.idx = index;
      this.sendVisible = true;
      
    },
    saveSend(){
      var item = this.tableData[this.idx];
      var serverList = item.serverList
        .substring(1, item.serverList.length - 1)
        .split(",");
      var strServerList = "";
      for (var i = 0; i < serverList.length; i++) {
        serverList[i] = serverList[i]
          .substring(1, serverList[i].length)
          .split("-")[0];
        strServerList += serverList[i] + ",";
      }
      strServerList = strServerList.substring(0, strServerList.length - 1);
      this.$axios
        .post(this.url + "/sendPlatformEmail", {
          id: item.id,
          platformId: item.platformId,
          serverList: strServerList,
          emailTitle: item.emailTitle,
          emailContent: item.emailContent,
          sendReason: item.sendReason,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          addUser: item.userId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("全服邮件发送完成");
            this.getPlatformEmail();
            
          } else {
            console.log(this.responseResult);
            this.getPlatformEmail();
            this.$message.error("全服邮件发送失败");
          }
        })
        .catch(failResponse => {});
        this.sendVisible = false;
    },
    handleReSend(index, row) {
      var item = this.tableData[index];
      this.$axios
        .post(this.url + "/sendPlatformEmail", {
          id: item.id,
          platformId: item.platformId,
          serverList: item.errorList,
          emailTitle: item.emailTitle,
          emailContent: item.emailContent,
          sendReason: item.sendReason,
          startDatetime: item.startDatetime,
          endDatetime: item.endDatetime,
          addUser: item.userId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("重新发送完成");
            this.getPlatformEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("重新发送失败");
          }
        })
        .catch(failResponse => {});
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    saveDel(){
        this.$axios
        .post(this.url + "/deletePlatformEmail", {
          id: this.tableData[this.idx].id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("全服邮件删除完成");
            this.getPlatformEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("全服邮件删除失败");
          }
        })
        .catch(failResponse => {});
        this.delVisible = false;
    },
    timestampToStr(timestamp) {
      var d = new Date(timestamp); //根据时间戳生成的时间对象
      if (timestamp == null) {
        return null;
      }
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
    strToArray(str) {
      str = str.substring(1, str.length - 1);
      var list = str.split(",");
      for (var i = 0; i < list.length; i++) {
        list[i] = list[i].substring(1, list[i].length - 1);
      }
      return list;
    },
    handleEdit(index, row) {
      this.idx = index;
      var item = this.tableData[index];

      this.form = {
        id: item.id,
        platformId: item.platformId,
        serverList: this.strToArray(item.serverList),
        emailTitle: item.emailTitle,
        emailContent: item.emailContent,
        sendReason: item.sendReason,
        startDatetime: this.timestampToStr(item.startDatetime),
        endDatetime: this.timestampToStr(item.endDatetime)
      };
      this.getServerList(item.platformId);
      this.editPlatformEmailVisible = true;
    },
    search() {
      this.getPlatformEmail();
    },
    formatIsSend(row, column, cellValue, index) {
      return row.sendState == 1 ? "已发送" :  row.sendState == 2 ? "发送失败" : "未发送";
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
        .post(this.url + "/deleteAllPlatformEmail", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("全服邮件批量删除完成");
            this.multipleSelection = [];
            this.getPlatformEmail();
          } else {
            console.log(this.responseResult);
            this.$message.error("全服邮件批量删除失败");
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
