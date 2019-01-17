<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document"></i>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>发送广播</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>（1）消息类型分为聊天系统消息和滚屏消息
        <br>（2）发送类型有即时发生和定时发送，定时消息需要设置时间间隔（秒）和循环次数
        <br>（3）广播消息均为全服发送
      </div>

      <el-collapse v-model="activeNames">
        <el-collapse-item title="折叠" name="1">
          <div class="form-box">
            <el-form ref="form" :model="form" label-width="250px">
              <el-form-item class="el-form-item" label="选择平台">
                <el-select
                  v-model="platformValue"
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
                  v-model="serverList"
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
              <el-form-item label="消息类型">
                <el-select v-model="form.noticeType" placeholder="请选择消息类型" style="width:180px">
                  <el-option
                    v-for="item in noticeTypeList"
                    :key="item.id"
                    :label="item.noticeType"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="发送类型">
                <el-select v-model="form.sendType" placeholder="请选择发送类型" style="width:180px" @change="selectSendType">
                  <el-option
                    v-for="item in sendTypeList"
                    :key="item.id"
                    :label="item.sendType"
                    :value="item.id"
                    
                  ></el-option>
                </el-select>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="时间间隔"  v-if="isTiming">
                <el-input
                  style="width:180px"
                  placeholder="请输入时间间隔"
                  v-model="form.timeInterval"
                  clearable
                ></el-input>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="循环次数" v-if="isTiming">
                <el-input style="width:180px" placeholder="请输入循环次数" v-model="form.cycleTime" clearable></el-input>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
              </el-form-item>
              <el-form-item label="公告内容">
                <el-input
                  style="width:515px"
                  placeholder="请输入发送内容"
                  type="textarea"
                  :autosize="{ minRows:4, maxRows: 10}"
                  v-model="form.noticeContent"
                  v-on:change="changeContent"
                  clearable
                ></el-input>
                <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
                <span class="grid-content bg-purple-light" style="margin:20px;color:red" v-show="maxLengthVisible">{{"超过最大字符长度"+countMaxLength}}</span>
              </el-form-item>

              <el-form-item label>
                <el-button type="primary" icon="search" @click="submit">提交广播申请</el-button>
                <el-button type="primary" icon="search" @click="reset">重置</el-button>
              </el-form-item>
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
          v-model="searchKey.noticeContent"
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

        <el-table-column prop="noticeType" label="消息类型" :formatter="formatNoticeType"></el-table-column>
        <el-table-column prop="sendType" label="发送类型" :formatter="formatSendType"></el-table-column>
        <el-table-column prop="timeInterval" label="发送时间间隔"></el-table-column>
        <el-table-column prop="cycleTime" label="循环次数"></el-table-column>
        <el-table-column prop="noticeContent" label="内容" width="300px"></el-table-column>
        <el-table-column prop="sendState" label="状态" :formatter="formatIsSend"></el-table-column>
        <el-table-column prop="addUser" label="编辑人"></el-table-column>
        <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="sendDatetime" label="发送时间" :formatter="formatter"></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" fixed="right" width="130px">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-message"
              @click="handleSend(scope.$index, scope.row)"
              
            >发送</el-button>
            <el-button
            type="text" 
            icon="el-icon-delete"
            class="red"
            @click="handleDel(scope.$index, scope.row)"
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确定？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        sendType: "",
        noticeType: "",
        timeInterval: "",
        cycleTime: "",
        noticeContent: ""
      },
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
      searchKey: {
        timeInterval: "",
        cycleTime: "",
        sendType: "",
        noticeType: "",
        noticeContent: ""
      },
      delAllVisible: false,
      url: "http://localhost:8011",
      strPlatform: "",
      maxLengthVisible:false,
      countMaxLength:600,
      isTiming:true
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
        this.platformValue="";
        this.serverList=[];
        this.searchKey.platformId="";
        this.searchKey.serverName="";
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
            this.getNotice();
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
            this.serverOptions = [];
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {
          this.serverList = "";
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
      this.getServerList(this.platformValue);
    },
    selectSendType(){
        if(this.form.sendType=="1"){
            this.isTiming = false;
        }
        if(this.form.sendType=="2"){
            this.isTiming = true;
        }
    },
    changeContent(){
      if(this.form.noticeContent.length>this.countMaxLength){
          this.$message.info("超过最大字符长度"+this.countMaxLength);
          this.maxLengthVisible = true;
      }else{
          this.maxLengthVisible = false;
      }
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

      this.getNotice();
    },
    getNotice() {
      this.$axios
        .post(this.url + "/getNotice", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          noticeContent: this.searchKey.noticeContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          strPlatform: this.strPlatform,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("公告列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
            this.mapDate();
          } else {
            this.tableData = [];
            this.total = 0;
            console.log(this.responseResult);
            console.log("公告列表获取失败");
            this.$message.error("公告列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getSendType() {
      this.$axios
        .post(this.url + "/getSendNoticeSendType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("公告发送类别获取成功");
            this.sendTypeList = successResponse.data.data.list;
          } else {
            this.sendTypeList = [];
            console.log(this.responseResult);
            console.log("公告发送类别获取失败");
            this.$message.error("公告发送类别获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getNoticeType() {
      this.$axios
        .post(this.url + "/getSendNoticeNoticeType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("公告消息类别获取成功");
            this.noticeTypeList = successResponse.data.data.list;
          } else {
            this.noticeTypeList = [];
            console.log(this.responseResult);
            console.log("公告消息类别获取失败");
            this.$message.error("公告消息类别获取失败");
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
      this.selectServer();
    },
    formatter(row, column) {
      //时间格式化
      var date = row[column.property];
      return formatDatetime(date);
    },
    submit() {
      if (this.platformValue == "" || this.platformValue == undefined) {
        this.$message("请选择正确的平台");
        return;
      }
      if (
        this.serverList.length == 0 ||
        this.serverList == undefined
      ) {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.noticeType == "") {
        this.$message("请选择正确的消息类型");
        return;
      }
      if (this.form.sendType == "") {
        this.$message("请选择正确的发送类型");
        return;
      }
      
      if(this.form.sendType=="2"){
          
          if (this.form.timeInterval == "") {
            this.$message("时间间隔不能为空");
            return;
          }
          if(!parseInt(this.form.timeInterval)){
            this.$message("时间间隔格式不正确");
            return;
          }
          if(parseInt(this.form.timeInterval)<=0){
            this.$message("时间间隔不能小于等于0");
            return;
          }
          if (this.form.cycleTime == "") {
            this.$message("循环次数不能为空");
            return;
          }
          if(!parseInt(this.form.cycleTime)){
            this.$message("循环次数格式不正确");
            return;
          }
          if(parseInt(this.form.cycleTime)<=0){
            this.$message("循环次数不能小于等于0");
            return;
          }
      }else if(this.form.sendType=="1"){
          this.form.timeInterval = "1";
          this.form.cycleTime = "1";
      }

      if (this.form.noticeContent == "") {
        this.$message("公告内容不能为空");
        return;
      }
      if (this.form.noticeContent.length > this.countMaxLength) {
        this.$message("内容长度超过最大限制"+this.countMaxLength);
        return;
      }

      this.$axios
        .post(this.url + "/addNotice", {
          platformId: this.platformValue,
          serverList: JSON.stringify(this.serverList),
          sendType: this.form.sendType,
          noticeType: this.form.noticeType,
          timeInterval: this.form.timeInterval,
          cycleTime: this.form.cycleTime,
          noticeContent: this.form.noticeContent,
          addUser: this.userId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("广播添加成功");
            this.$message.success("广播添加成功");
            this.reset();
            this.getNotice();
          } else {
            console.log(this.responseResult);
            console.log("广播添加失败");
            this.$message.error("广播添加失败");
          }
        })
        .catch(failResponse => {});
    },
    mapDate() {},
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {
    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getNotice();
    },
    selectSearchKeyServer() {
      this.getNotice();
    },
    reset() {
      this.platformValue = "";
      this.serverValue = "";
      this.serverList = [];
      this.form = {
        platformId: "",
        serverId: "",
        sendType: "",
        noticeType: "",
        timeInterval: "",
        cycleTime: "",
        noticeContent: ""
      };
    },
    handleSend(index, row) {
      this.idx = index;
      var item = this.tableData[index];
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
        .post(this.url + "/sendNotice", {
          id: this.tableData[index].id,
          platformId: this.tableData[index].platformId,
          serverList: strServerList,
          sendType: item.sendType,
          noticeType: item.noticeType,
          timeInterval: item.timeInterval,
          cycleTime: item.cycleTime,
          Content: item.noticeContent,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          console.log(this.responseResult)
          if(successResponse.data.code === 200){
              console.log("公告已发送");
              this.$message.success("公告已发送");
              this.getNotice();
          }else{
              console.log("公告发送失败");
              this.$message.error("公告发送失败");
              this.getNotice();
          }
        })
        .catch(failResponse => {
          console.log("公告发送失败");
          this.$message.error("公告发送失败");
        });
    },
    saveSend(){
        this.sendVisible = false;
    },
    search() {
      this.getNotice();
    },
    formatIsSend(row, column, cellValue, index) {
      return row.sendState == 1
        ? "已发送"
        : row.sendState == 2
        ? "发送失败"
        : "未发送";
    },
    formatNoticeType(row, column, cellValue, index) {
      for (var i = 0; i < this.noticeTypeList.length; i++) {
        if (this.noticeTypeList[i].id == row.noticeType) {
          return this.noticeTypeList[i].noticeType;
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
    handleDel(index, row) {
      this.idx = index;
      this.delVisible = true;

    },
    saveDel(){
      var item = this.tableData[this.idx];
      this.$axios
        .post(this.url + "/deleteAllNotice", {
          id: item.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("公告批量删除完成");
            this.multipleSelection = [];
            this.getNotice();
          } else {
            console.log(this.responseResult);
            this.$message.error("公告批量删除失败");
          }
        })
        .catch(failResponse => {});
        this.delVisible = false;
    },
    saveDelAll() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      //批量删除处理
      this.$axios
        .post(this.url + "/deleteAllNotice", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("公告批量删除完成");
            this.multipleSelection = [];
            this.getNotice();
          } else {
            console.log(this.responseResult);
            this.$message.error("公告批量删除失败");
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
