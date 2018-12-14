<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>发送邮件</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）两种发送方式（为指定角色发送、为全服玩家发送）只能选择其中的一种。
                    <br/>
                    （2）指定角色发送当中输入的角色Id和角色名，只会生效一种
                    <br/>
                    （3）输入多个角色Id和角色名，请用","分隔
                </div>
                
                <!-- <Divider /> -->
                <el-collapse v-model="activeNames" >
                <el-collapse-item title="折叠" name="1">
                        <div class="form-box">
                    <el-form ref="form" :model="form" label-width="250px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择服务器">
                            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器" style="width:180px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                       
                        <el-form-item label="标题">
                           <el-input style="width:515px"
                            placeholder="请输入标题"
                            v-model="form.emailTitle"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="邮件内容">
                            <el-input style="width:515px"
                            placeholder="请输入说明" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.emailContent"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
                        </el-form-item>
                        <el-form-item label="发送原因">
                            <el-input style="width:515px"
                            placeholder="请输入发送原因" type="textarea"
                            :autosize="{ minRows:1, maxRows: 10}"
                            v-model="form.sendReason"
                            clearable>
                            </el-input>
                            
                        </el-form-item>


                    <el-tabs type="border-card" @tab-click="handleClick" v-model="editableTabsValue">
                    <el-tab-pane label="按条件发送"  name="1" v-if="false">
                        <el-form-item label="玩家等级" style="margin-left:-18px">
                            
                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="form.minLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="form.maxLevel"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="VIP等级" style="margin-left:-18px">
                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="form.minVipLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="form.maxVipLevel"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="注册时间" style="margin-left:-18px">
                                <el-date-picker style="width:180px" 
                                v-model="form.minRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>

                                <span style="">—</span>

                                <el-date-picker style="width:180px"  
                                v-model="form.maxRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>


                        <el-form-item label="是否在线" style="margin-left:-18px">
                                <el-select v-model="form.isOnline"  placeholder="请选择是否在线" style="width:180px">
                                        <el-option
                                        v-for="item in isOnlineOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                </el-select>
                        </el-form-item>

                        <el-form-item label="性别" style="margin-left:-18px">
                                <el-select v-model="form.sex"  placeholder="请选择性别" style="width:180px">
                                        <el-option
                                        v-for="item in sexOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                </el-select>
                        </el-form-item>

                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                            <el-button type="primary" icon="search" @click="reset">重置</el-button>
                        </el-form-item>
                        
                    </el-tab-pane>
                    <el-tab-pane label="按角色发送" name="2" >

                        <!-- <el-form-item label="玩家账号">
                            <el-input style="width:515px"
                            placeholder="请输入玩家账号" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}" 
                            v-model="form.playerAccountList"
                            clearable>
                            </el-input>
                            
                        </el-form-item> -->
                        <el-form-item label="角色ID">
                            <el-input style="width:515px"
                            placeholder="请输入角色ID" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}"
                            v-model="form.playerIdList"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色名称">
                            <el-input style="width:515px"
                            placeholder="请输入角色名称" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}"
                            v-model="form.playerNameList"
                            clearable>
                            </el-input>
                        </el-form-item>

                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                            <el-button type="primary" icon="search" @click="reset">重置</el-button>
                    
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="全服发送" name="3">
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                            <el-button type="primary" icon="search" @click="reset">重置</el-button>
                    
                        </el-form-item>
                    </el-tab-pane>
                    </el-tabs>

                        
                        
                    </el-form>
                    </div>
                    <!-- <Divider /> -->
                </el-collapse-item>
                </el-collapse>
                <!-- <Divider /> -->
                <div style="margin:15px;">
                      <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
                      <span class="grid-content bg-purple-light">平台：</span>
                            <el-select v-model="searchKey.platformId" @change="selectSearchKeyPlatform" placeholder="请选择渠道平台" style="width:150px">
                                <el-option key="0" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                      <span class="grid-content bg-purple-light">服务器：</span>
                            <el-select v-model="searchKey.serverName" @change="selectSearchKeyServer"  placeholder="请选择服务器" style="width:150px">
                                <el-option key="0" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in searchKeyServerOptions"
                                :key="item.serverName"
                                :label="item.serverName"
                                :value="item.serverName">
                                </el-option>
                            </el-select>
                      <!-- <span class="grid-content bg-purple-light">：</span>
                      <el-input v-model="searchKey.rightName" placeholder="筛选权限名" class="handle-input " style="width:150px"></el-input> -->

                      <span class="grid-content bg-purple-light">内容：</span>
                      <el-input v-model="searchKey.EmailContent" placeholder="筛选内容" class="handle-input " style="width:150px"></el-input>

                      <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
                            
                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="platform" label="平台"  >
                </el-table-column>
                <el-table-column prop="server" label="服务器" >
                </el-table-column>
                <el-table-column prop="sendType"  label="发送类型" :formatter="formatterSendType">
                </el-table-column>
                <el-table-column prop="emailTitle"  label="标题" >
                </el-table-column>
                <el-table-column prop="emailContent"  label="内容" width="400" >
                </el-table-column>
                <el-table-column prop="sendReason"  label="原因" >
                </el-table-column>
                <el-table-column prop="sendDatetime" label="发送时间" :formatter="formatter" >
                </el-table-column>
                <el-table-column prop="sendState"  label="状态" :formatter="formatIsSend">
                </el-table-column>
                <el-table-column prop="userName"  label="编辑人" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleSend(scope.$index, scope.row)" v-if="scope.row.sendState!=1">发送</el-button>

                        <el-button type="text" icon="el-icon-edit" @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
               </div>     
            <!-- 编辑提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="900px" center>

                    <el-form ref="form" :model="form" label-width="250px">
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择服务器">
                            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器" style="width:180px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                       
                        <el-form-item label="标题">
                           <el-input style="width:515px"
                            placeholder="请输入标题"
                            v-model="form.emailTitle"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item label="说明(玩家看到)">
                            <el-input style="width:515px"
                            placeholder="请输入说明" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.emailContent"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item label="发送原因">
                            <el-input style="width:515px"
                            placeholder="请输入发送原因" type="textarea"
                            :autosize="{ minRows:1, maxRows: 10}"
                            v-model="form.sendReason"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <div v-if="form.sendType == 1">

                        <el-form-item label="玩家等级" style="margin-left:-18px" >
                            
                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="form.minLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="form.maxLevel"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="VIP等级" style="margin-left:-18px">
                            <el-input style="width:180px"
                            placeholder="最小等级"
                            v-model="form.minVipLevel"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:180px"
                            placeholder="最大等级"
                            v-model="form.maxVipLevel"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="注册时间" style="margin-left:-18px">
                                <el-date-picker style="width:180px" 
                                v-model="form.minRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>

                                <span style="">—</span>

                                <el-date-picker style="width:180px"  
                                v-model="form.maxRegistrationTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>

                        <el-form-item label="是否在线" style="margin-left:-18px">
                                <el-select v-model="form.isOnline"  placeholder="请选择是否在线" style="width:180px">
                                        <el-option
                                        v-for="item in isOnlineOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                </el-select>
                        </el-form-item>

                        <el-form-item label="性别" style="margin-left:-18px">
                                <el-select v-model="form.sex"  placeholder="请选择性别" style="width:180px">
                                        <el-option
                                        v-for="item in sexOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                </el-select>
                        </el-form-item>
                        </div>
                        <div v-if="form.sendType == 2">
                        <el-form-item label="玩家账号">
                            <el-input style="width:515px"
                            placeholder="请输入玩家账号" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}" 
                            v-model="form.playerAccountList"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item label="玩家名称">
                            <el-input style="width:515px"
                            placeholder="请输入玩家名称" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}"
                            v-model="form.playerNameList"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色ID">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:2, maxRows: 10}"
                            v-model="form.playerIdList"
                            clearable>
                            </el-input>
                        </el-form-item>
                        </div>
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="saveEdit">提交</el-button> 
                            <el-button type="primary" icon="search" @click="reset">重置</el-button>
                    
                        </el-form-item>
                    </el-form>
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
    </div>
</template>

<script>
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
import setLocalThisUrl from '../../code/setLocalThisUrl';
export default {
  name: "PlayerInfo",
  data() {
    return {
      activeNames: ["1"],
      editableTabsValue: '2',
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      total:0,
      handleVisible: true,
      checkVisible: false,
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
      isOnlineOptions:[
          {
            label:"全部",
            value:"0"
          },
          {
            label:"在线",
            value:"1"
          },
          {
            label:"离线",
            value:"2"
          }
      ],
      sexOptions:[
          {
            label:"全部",
            value:"0"
          },
          {
            label:"男",
            value:"1"
          },
          {
            label:"女",
            value:"2"
          }
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [

      ],
      searchKeyServerOptions:[],
      serverValue: "",
      serverList: [],
      serverLabel: "",
      form: {
          platformId:"",
          serverId:"",
          emailTitle:"",
          emailContent:"",
          sendReason:"",
          playerNameList:"",
          playerAccountList:"",
          playerIdList:"",
          isOnline:"",
          sex:""
        
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
        timeInterval:"",
        cycleTime:"",
        sendType:"",
        EmailType:"",
        EmailContent:""
      },
      delAllVisible:false,
      url:"http://localhost:8011",
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
    this.getData();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getPlatformList(this.id);
      }.bind(this)
    );

    console.log();

  },
  beforeDestroy () {
    bus.$off('changeGameId');
  },
  methods: {
    getPlatformList(userId) {
      this.$axios
        .post(this.url+"/getPlatformListForUserIdAndGameId", {
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
        .post(this.url+"/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.serverOptions = successResponse.data.data;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post(this.url+"/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.searchKeyServerOptions = successResponse.data.data;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
            return false;
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
            console.log("当前serverIp:" + this.serverIp);
            this.$message.success("当前serverIp:" + this.serverIp);
            break;
          }
        }
      }

      this.getEmail();
    },
    getEmail() {
      this.$axios
        .post(this.url+"/getEmail", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          EmailContent:this.searchKey.EmailContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          //searchKey: JSON.stringify(this.searchKey)
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件列表获取成功");
            //this.$message.success("邮件列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
            this.mapDate();
          } else {
            console.log(this.responseResult);
            console.log("邮件列表获取失败");
            //this.$message.error("邮件列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getSendType() {
      this.$axios
        .post(this.url+"/getSendEmailSendType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件发送类别获取成功");
            this.$message.success("邮件发送类别获取成功");
            this.sendTypeList = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("邮件发送类别获取失败");
            this.$message.error("邮件发送类别获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getEmailType() {
      this.$axios
        .post(this.url+"/getSendEmailEmailType", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件消息类别获取成功");
            this.$message.success("邮件消息类别获取成功");
            this.EmailTypeList = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("邮件消息类别获取失败");
            this.$message.error("邮件消息类别获取失败");
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
      //this.getEmailType();
      //this.getSendType();
      this.getEmail();
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
    handleClick(tab, event){
        console.log(tab);
        console.log(tab.name);
    },
    submit() {
        var data = {};
        if(this.form.platformId==""){
            this.$message("请选择正确的平台");
            return;
        }
        if(this.form.serverId==""){
            this.$message("请选择正确的服务器");
            return;
        }
        if(this.form.emailTitle==""){
            this.$message("标题不能为空");
            return;
        }
        if(this.form.emailContent==""){
            this.$message("内容不能为空");
            return;
        }
        if(this.editableTabsValue=="1"){
            console.log("1");
            data = {
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:1,

                minLevel:this.form.minLevel,
                maxLevel:this.form.maxLevel,

                minVipLevel:this.form.minVipLevel,
                maxVipLevel:this.form.maxVipLevel,

                minRegistrationTime:this.form.minRegistrationTime,
                maxRegistrationTime:this.form.maxRegistrationTime,

                isOnline:this.form.isOnline,
                sex:this.form.sex,

                addUser:this.userId
            };

        }
        if(this.editableTabsValue=="2"){
                console.log("2");
            data = {
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:2,

                playerNameList:this.form.playerNameList,
                playerAccountList:this.form.playerAccountList,
                playerIdList:this.form.playerIdList,

                addUser:this.userId
            };

        }
        if(this.editableTabsValue=="3"){
                console.log("3");
            data = {
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:3,

                addUser:this.userId
            };

        }
        this.$axios
        .post(this.url+"/addEmail", data)
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件添加成功");
            this.$message.success("邮件添加成功");
            this.getEmail();    
        } else {
            console.log(this.responseResult);
            console.log("邮件添加失败");
            this.$message.error("邮件添加失败");
            return false;
        }
        })
        .catch(failResponse => {});
        console.log(this.form);
        console.log(JSON.stringify(this.form));
        console.log(JSON.stringify(this.serverList));


        
    },
    saveEdit(){
        var data = {};
        if(this.form.platformId==""){
            this.$message("请选择正确的平台");
            return;
        }
        if(this.form.serverId==""){
            this.$message("请选择正确的服务器");
            return;
        }
        if(this.form.emailTitle==""){
            this.$message("标题不能为空");
            return;
        }
        if(this.form.emailContent==""){
            this.$message("内容不能为空");
            return;
        }
        if(this.form.sendType==1){
            data = {
                id:this.form.id,
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:1,

                minLevel:this.form.minLevel,
                maxLevel:this.form.maxLevel,

                minVipLevel:this.form.minVipLevel,
                maxVipLevel:this.form.maxVipLevel,

                minRegistrationTime:this.form.minRegistrationTime,
                maxRegistrationTime:this.form.maxRegistrationTime,

                isOnline:this.form.isOnline,
                sex:this.form.sex,

                addUser:this.userId
            };
        }
        if(this.form.sendType==2){
            data = {
                id:this.form.id,
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:2,

                playerNameList:this.form.playerNameList,
                playerAccountList:this.form.playerAccountList,
                playerIdList:this.form.playerIdList,

                addUser:this.userId
            };
        }
        if(this.form.sendType==3){
            data = {
                id:this.form.id,
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                emailTitle:this.form.emailTitle,
                emailContent:this.form.emailContent,
                sendReason:this.form.sendReason,
                sendType:3,

                addUser:this.userId
            }; 
        }
        console.log(data);
        this.$axios
        .post(this.url+"/editEmail", data)
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("邮件编辑成功");
            this.$message.success("邮件编辑成功");
            this.getEmail();   
        } else {
            console.log(this.responseResult);
            console.log("邮件编辑失败");
            this.$message.error("邮件编辑失败");
        }
        })
        .catch(failResponse => {});
 
    },
    mapDate(){

    },
    reset(){
        this.form = {
                platformId:"",
                serverId:"",
                emailTitle:"",
                emailContent:"",
                sendReason:"",
                sendType:"",

                minLevel:"",
                maxLevel:"",

                minVipLevel:"",
                maxVipLevel:"",

                minRegistrationTime:null,
                maxRegistrationTime:null,

                isOnline:"",
                sex:"",

                playerAccountList:"",
                playerNameList:"",
                playerIdList:"",

                addUser:""
        }
    },
    timestampToStr(timestamp){
        console.log(timestamp);
        if(timestamp==null){
            return null;
        }
        var d = new Date(timestamp);    //根据时间戳生成的时间对象

        var date = (d.getFullYear()) + "-" + 
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " + 
                (d.getHours()) + ":" + 
                (d.getMinutes()) + ":" + 
                (d.getSeconds());
        return date;
    },
    handleEdit(index,row){
        this.idx = index;
        var item = this.tableData[index];
        this.form = {
                id:item.id,
                platformId:item.platformId,
                serverId:item.serverId,
                emailTitle:item.emailTitle,
                emailContent:item.emailContent,
                sendReason:item.sendReason,
                sendType:item.sendType,

                minLevel:item.minLevel,
                maxLevel:item.maxLevel,

                minVipLevel:item.minVipLevel,
                maxVipLevel:item.maxVipLevel,

                minRegistrationTime:this.timestampToStr(item.minRegistrationTime),
                maxRegistrationTime:this.timestampToStr(item.maxRegistrationTime),

                isOnline:item.isOnline,
                sex:item.sex,

                playerAccountList:item.playerAccountList,
                playerNameList:item.playerNameList,
                playerIdList:item.playerIdList,

                addUser:item.userId
        }
        this.getServerList(item.platformId);
        console.log(JSON.stringify(this.form));
        this.dialogVisible = true;
    },
    selectSearchKeyPlatform(){
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getEmail();
    },
    selectSearchKeyServer(){
      this.getEmail();
    }
    ,
    formatter(row, column) {
        //return row.address;
        //时间格式化
            
        var date = row[column.property];  
        if (date == undefined) {  
            return "";  
        }

        var tt=new Date(parseInt(date)).toLocaleString();
        return tt;
    },
    handleSend(index,row){
        var item = this.tableData[index];
      console.log(index);
          console.log(this.tableData[index].id);
          this.$axios.post(this.url+'/sendEmail',{
            id:this.tableData[index].id,
            platformId:this.tableData[index].platformId,
            serverId:item.serverId,
            emailTitle:item.emailTitle,
            emailContent:item.emailContent,
            sendType:item.sendType,
            playerNameList:item.playerNameList,
            playerIdList:item.playerIdList,

          })
          .then(successResponse =>{
              this.responseResult ="\n"+ JSON.stringify(successResponse.data)
              if(successResponse.data.code === 200){
                  console.log(this.responseResult);
                  this.$message.success("邮件发送完成");
                  this.getEmail();

              }else{
                  this.open4(successResponse.data.message);
                  console.log('error');
                  console.log(this.responseResult);
                  this.$message.error("邮件发送失败");
                  return false;
              }
          })
          .catch(failResponse => {})
    },
    handleDelete(index,row){
      console.log(index);
          console.log(this.tableData[index].id);
          this.$axios.post(this.url+'/deleteEmail',{
            id:this.tableData[index].id
          })
          .then(successResponse =>{
              this.responseResult ="\n"+ JSON.stringify(successResponse.data)
              if(successResponse.data.code === 200){
                  console.log(this.responseResult);
                  this.$message.success("邮件删除完成");
                  this.getEmail();

              }else{
                  this.open4(successResponse.data.message);
                  console.log('error');
                  console.log(this.responseResult);
                  this.$message.error("邮件删除失败");
                  return false;
              }
          })
          .catch(failResponse => {})
    },
    search(){
      this.getEmail();
    },
    formatterSendType(row, column, cellValue, index){
        return row.sendType== 1 ? "范围" : row.sendType== 2 ? "玩家" : "全服";
    },
    formatIsSend(row, column, cellValue, index){
        return row.sendState == 1 ? "已发送" : row.sendState == 2 ? "发送失败" : "未发送";
    },
    formatEmailType(row, column, cellValue, index){
        for(var i = 0;i<this.EmailTypeList.length;i++){
            if(this.EmailTypeList[i].id == row.EmailType){
                return this.EmailTypeList[i].EmailType;
            }
        }
    },
    formatSendType(row, column, cellValue, index){
        for(var i = 0;i<this.sendTypeList.length;i++){
            if(this.sendTypeList[i].id == row.sendType){
                return this.sendTypeList[i].sendType;
            }
        }
    },
    handleDelAll(){
        this.delAllVisible = true;
    },
    saveDelAll(){
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id + ',';
                }
                console.log(str);
                //批量删除处理
                this.$axios.post(this.url+'/deleteAllEmail',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("邮件批量删除完成");
                        this.multipleSelection = []; 
                        this.getEmail();

                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("邮件批量删除失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
                 
                this.delAllVisible = false;
    },
    handleSelectionChange(val){
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
  /* border: 1px solid red; */
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
