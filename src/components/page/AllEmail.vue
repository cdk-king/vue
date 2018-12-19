<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>全服邮件
        </el-breadcrumb-item>
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
          placeholder="请选择渠道平台"
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
          placeholder="请选择服务器"
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
          v-model="searchKey.EmailContent"
          placeholder="筛选内容"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAddPlatformEmail">添加</el-button>
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
        <el-table-column label="操作" align="center" v-if="handleVisible">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleSend(scope.$index, scope.row)"
              v-if="scope.row.sendState!=1 && scope.row.sendState!=2"
            >发送</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
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
      title="添加"
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
              placeholder="请选择渠道平台"
              style="width:180px"
            >
              <el-option
                v-for="item in platformOptions"
                :key="item.platformId"
                :label="item.platform"
                :value="item.platformId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择服务器">
            <span
              class="grid-content bg-purple-light"
              style="margin:16px;color:#888888"
              v-show="!checkVisible"
            >请先选择服务器</span>

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
            <el-input style="width:180px" placeholder="标题" v-model="form.emailTitle" clearable></el-input>
            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
          </el-form-item>
          <el-form-item label="邮件内容">
            <el-input
              style="width:515px"
              placeholder="请输入发送内容"
              type="textarea"
              :autosize="{ minRows:4, maxRows: 10}"
              v-model="form.emailContent"
              clearable
            ></el-input>
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
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPlatformEmailVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPlatformEmailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog
      title="编辑"
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
              placeholder="请选择渠道平台"
              style="width:180px"
            >
              <el-option
                v-for="item in platformOptions"
                :key="item.platformId"
                :label="item.platform"
                :value="item.platformId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择服务器">
            <span
              class="grid-content bg-purple-light"
              style="margin:16px;color:#888888"
              v-show="!checkVisible"
            >请先选择服务器</span>

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
            <el-input style="width:180px" placeholder="标题" v-model="form.emailTitle" clearable></el-input>
            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
          </el-form-item>
          <el-form-item label="邮件内容">
            <el-input
              style="width:515px"
              placeholder="请输入发送内容"
              type="textarea"
              :autosize="{ minRows:4, maxRows: 10}"
              v-model="form.emailContent"
              clearable
            ></el-input>
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
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPlatformEmailVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPlatformEmailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除提示框 -->
    <el-dialog title="批量删除提示" :visible.sync="delAllVisible" width="300px" center>
      <div class="del-dialog-cnt">批量删除不可恢复，是否确定批量删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDelAll">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
import setLocalThisUrl from "../../code/setLocalThisUrl";
export default {
  name: "PlayerInfo",
  data() {
    return {
      activeNames: ["1"],
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      total: 0,
      handleVisible: true,
      checkVisible: false,
      addPlatformEmailVisible: false,
      editPlatformEmailVisible: false,
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
      strPlatform: ""
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
    setLocalThisUrl(this);
    this.getAllServer();
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
    formatServer(item, platformId) {
      console.log(JSON.stringify(this.allServerList));
      for (var i = 0; i < this.allServerList.length; i++) {
        if (this.allServerList[i].id == item) {
          return this.allServerList[i].server;
        }
      }
    },
    getAllServer() {
      this.$axios
        .post(this.url + "/getAllServer", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            this.allServerList = successResponse.data.data.list;
          } else {
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
            console.log(this.responseResult);
            console.log("用户渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            console.log(this.strPlatform);
            this.strPlatform = this.strPlatform.substring(
              0,
              this.strPlatform.length - 1
            );
            this.getPlatformEmail();
          } else {
            console.log(this.responseResult);
            console.log("用户渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
          } else {
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {
          this.form.serverList = "";
          this.serverOptions = [];
        });
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.searchKeyServerOptions = successResponse.data.data;
          } else {
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.form.serverList = "";
      this.serverOptions = [];
      this.getServerList(this.form.platformId);
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

      this.getPlatformEmail();
    },
    getPlatformEmail() {
      this.$axios
        .post(this.url + "/getPlatformEmail", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          EmailContent: this.searchKey.EmailContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          strPlatform: this.strPlatform
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件列表获取成功");
            //this.$message.success("邮件列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
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
      console.log("page:" + val);
      this.selectServer();
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
      if (this.form.emailTitle == "") {
        this.$message("请输入正确的邮件标题");
        return;
      }
      if (this.form.emailContent == "") {
        this.$message("请输入正确的邮件内容");
        return;
      }
      console.log(this.form);
      console.log(JSON.stringify(this.form));
      console.log(JSON.stringify(this.form.serverList));

      this.$axios
        .post(this.url + "/addPlatformEmail", {
          platformId: this.form.platformId,
          serverList: JSON.stringify(this.form.serverList),
          emailTitle: this.form.emailTitle,
          emailContent: this.form.emailContent,
          sendReason: this.form.sendReason,
          startDatetime: this.form.startDatetime,
          endDatetime: this.form.endDatetime,
          addUser: this.userId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("全服邮件添加成功");
            this.$message.success("全服邮件添加成功");
            this.getPlatformEmail();
            this.addPlatformEmailVisible = false;
          } else {
            console.log(this.responseResult);
            console.log("全服邮件添加失败");
            this.$message.error("全服邮件添加失败");
            return false;
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
      console.log(JSON.stringify(this.form));
      console.log(JSON.stringify(this.form.serverList));

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
          addUser: this.userId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("全服邮件编辑成功");
            this.$message.success("全服邮件编辑成功");
            this.getPlatformEmail();
            this.editPlatformEmailVisible = false;
          } else {
            console.log(this.responseResult);
            console.log("全服邮件编辑失败");
            this.$message.error("全服邮件编辑失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {
      console.log(this.form.serverList);
    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getPlatformEmail();
    },
    selectSearchKeyServer() {
      this.getPlatformEmail();
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
      var item = this.tableData[index];

      console.log(item.serverList);
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
      console.log(strServerList);
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
          addUser: item.userId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            this.$message.success("全服邮件发送完成");
            this.getPlatformEmail();
          } else {
            console.log("error");
            console.log(this.responseResult);
            this.$message.error("全服邮件发送失败");
          }
        })
        .catch(failResponse => {});
    },
    handleReSend(index, row) {
      var item = this.tableData[index];
      console.log(item.errorList);
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
          addUser: item.userId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            this.$message.success("重新发送完成");
            this.getPlatformEmail();
          } else {
            console.log("error");
            console.log(this.responseResult);
            this.$message.error("重新发送失败");
          }
        })
        .catch(failResponse => {});
    },
    handleDelete(index, row) {
      console.log(index);
      console.log(this.tableData[index].id);
      this.$axios
        .post(this.url + "/deletePlatformEmail", {
          id: this.tableData[index].id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            this.$message.success("全服邮件批量删除完成");
            this.getPlatformEmail();
          } else {
            console.log("error");
            console.log(this.responseResult);
            this.$message.error("全服邮件批量删除失败");
            return false;
          }
        })
        .catch(failResponse => {});
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

      console.log("serverList:" + item.serverList);
      this.getServerList(item.platformId);
      this.editPlatformEmailVisible = true;
    },
    search() {
      this.getPlatformEmail();
    },
    formatIsSend(row, column, cellValue, index) {
      return row.sendState == 1 ? "已发送" : "未发送";
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
      console.log(str);
      //批量删除处理
      this.$axios
        .post(this.url + "/deleteAllPlatformEmail", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            this.$message.success("全服邮件批量删除完成");
            this.multipleSelection = [];
            this.getPlatformEmail();
          } else {
            console.log("error");
            console.log(this.responseResult);
            this.$message.error("全服邮件批量删除失败");
            return false;
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
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
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
