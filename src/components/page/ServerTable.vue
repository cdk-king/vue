<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>服务器管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>一个服务器对应一个且唯一的平台，在添加和修改服务器的时候必须指定对应的平台。
        <br>筛选平台渠道时应先选择对应的平台
      </div>

      <Divider/>
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="HandleAddAllChannel">添加渠道</el-button>
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <span class="grid-content bg-purple-light">状态：</span>

        <el-select
          v-model="searchKey.state"
          placeholder="筛选状态"
          @change="stateSelect"
          class="handle-select mr10"
        >
          <el-option key="-1" label="全部" value="-1"></el-option>
          <el-option key="0" label="未开启" value="0"></el-option>
          <el-option key="1" label="维护" value="1"></el-option>
          <el-option key="2" label="新服" value="2"></el-option>
          <el-option key="3" label="良好" value="3"></el-option>
          <el-option key="4" label="爆满" value="4"></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          v-model="searchKey.platformId"
          @change="selectPlatform"
          placeholder="筛选平台"
          class="handle-select mr10"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in platformOptions"
            :key="item.platformId"
            :label="item.platform"
            :value="item.platformId"
          ></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">渠道：</span>
        <el-select
          v-model="searchKey.channelId"
          @change="selectChannel"
          placeholder="筛选渠道"
          class="handle-select mr10"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in allChannelFormPlatform"
            :key="item.channelId"
            :label="item.channelName"
            :value="item.channelId"
          ></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">服务器名：</span>
        <el-input
          v-model="searchKey.server"
          placeholder="筛选服务器名"
          class="handle-input"
          style="width:120px"
        ></el-input>

        <span class="grid-content bg-purple-light">服务器IP：</span>
        <el-input
          v-model="searchKey.serverIp"
          placeholder="筛选服务器IP"
          class="handle-input"
          style="width:120px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleSyn">同步</el-button>
        <!-- <el-button type="primary" icon="search" @click="handleAddServer" v-if="false">添加</el-button> -->
        <!-- <el-button type="primary" icon="search" @click="handleGetList">获取列表</el-button> -->
      </div>
      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="serverId" label="服务器ID"></el-table-column>
        <el-table-column prop="server" label="服务器名称"></el-table-column>
        <el-table-column prop="serverIp" label="服务器IP"></el-table-column>
        <el-table-column prop="serverPort" label="服务器端口"></el-table-column>
        <el-table-column prop="gameName" label="所属游戏"></el-table-column>
        <el-table-column prop="platform" label="所属平台"></el-table-column>

        <el-table-column prop="platformTag" label="平台标识"></el-table-column>
        <el-table-column prop="channel" label="平台渠道">
          <template slot-scope="channel">
            <ul style="text-align:center">
              <li v-for="item in channel.row.channel.split(';')" v-bind:key="item">{{formatChannal(item.substring(1,item.length-1),channel.row.platformId)}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="server_describe" label="描述"></el-table-column>
        <el-table-column prop="state" label="状态" :formatter="formatState"></el-table-column>
        <el-table-column
          prop="openServiceTime"
          label="开服时间"
          :formatter="formatter"
        ></el-table-column>
        <el-table-column
          prop="addDatetime"
          label="添加时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column prop="addUser" label="添加人"></el-table-column>
        <el-table-column prop="isDefault" width="50" label="是否默认" :formatter="formatIsDefault"></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" width="120px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="handleEditVisible">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleChangeState(scope.$index, scope.row)"
              v-if="handleSetStateVisible"
            >设置状态</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleSetDefault(scope.$index, scope.row)"
              v-if="handleSetDefaultVisible"
            >设置默认</el-button>
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="handleServerAddChannel(scope.$index, scope.row)"
              v-if="handleAddChannelVisible"
            >添加平台渠道</el-button>
            
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-if="handleDeleteVisible">删除</el-button>
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

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加服务器"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addServerVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="服务器名称">
          <el-input v-model="form.server"></el-input>
        </el-form-item>
        <el-form-item label="服务器Id">
          <el-input v-model="form.serverId"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP">
          <el-input v-model="form.serverIp"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口">
          <el-input v-model="form.serverPort"></el-input>
        </el-form-item>
        <el-form-item label="服务器描述">
          <el-input v-model="form.server_describe"></el-input>
        </el-form-item>
        <el-form-item label="所属渠道">
          <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择渠道">
            <el-option
              v-for="item in platformList"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加人">
          <el-input v-model="form.addUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addServerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddServer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑服务器"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="服务器名称">
          <el-input v-model="form.server" :disabled="editRight.server"></el-input>
        </el-form-item>
        <el-form-item label="服务器Id">
          <el-input v-model="form.serverId" :disabled="editRight.serverId"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP">
          <el-input v-model="form.serverIp" :disabled="editRight.serverIp"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口">
          <el-input v-model="form.serverPort" :disabled="editRight.serverPort"></el-input>
        </el-form-item>
        <el-form-item label="服务器描述">
          <el-input v-model="form.server_describe" :disabled="editRight.server_describe"></el-input>
        </el-form-item>
        <el-form-item label="所属平台">
          <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择平台" :disabled="editRight.platformId">
            <el-option
              v-for="item in platformList"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
              :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开服时间">
              <el-date-picker
              v-model="form.openServiceTime"
              type="datetime"
              :disabled="editRight.openServiceTime"
              placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="添加人">
          <el-input v-model="form.addUser" :disabled="editRight.addUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加平台渠道提示框 -->
    <el-dialog title="管理渠道" :visible.sync="ServerAddChannelVisible" width="580px" center>
      <template>
        <el-transfer
          filterable
          v-model="checkchannelData"
          :props="{
          key: 'value',
          label: 'desc'
        }"
          :data="otherChannelData"
          :titles="['其他渠道', '已选渠道']"
          :button-texts="['移除', '添加']"
        ></el-transfer>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ServerAddChannelVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCheckChannel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑冻结提示框 -->
    <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
      <div class="del-dialog-cnt">冻结后将停止服务器使用，是否确定冻结？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeStateToFrozenVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStateToFrozen">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑解冻提示框 -->
    <el-dialog title="解冻提示" :visible.sync="changeStateToNormalVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确定解冻？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeStateToNormalVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStateToNormal">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="删除提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
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
    <!-- 设置服务器状态提示框 -->
    <el-dialog title="设置服务器状态" :visible.sync="ChangeStateVisible" width="400px" center>
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item class="el-form-item" label="设置服务器状态：">
          <el-select v-model="form.state" placeholder="设置服务器状态" class="handle-select mr10">
            <el-option key="0" label="未开启" value="0"></el-option>
            <el-option key="1" label="维护" value="1"></el-option>
            <el-option key="2" label="新服" value="2"></el-option>
            <el-option key="3" label="良好" value="3"></el-option>
            <el-option key="4" label="爆满" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ChangeStateVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChangeState">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置默认服务器提示框 -->
    <el-dialog title="提示" :visible.sync="SetDefaultVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确定设置默认服务器？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetDefaultVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetDefault">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "serverTable",
  data() {
    return {
      url: "http://localhost:8011",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      editPasswordVisible: false,
      changeStateToFrozenVisible: false,
      changeStateToNormalVisible: false,
      addServerVisible: false,
      handleVisible: true,
      handleEditVisible: true,
      handleSetStateVisible: true,
      handleSetDefaultVisible: true,
      handleAddChannelVisible: true,
      handleDeleteVisible: true,
      delAllVisible: false,
      platformOptions: [],
      total: 0,
      form: {
        id: "",
        serverId: "",
        server: "",
        gameId: "",
        platformId: "",
        serverIP: "",
        serverPort: "",
        server_describe: "",
        parentId: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        gameName: "",
        role: "",
        openServiceTime:""
      },
      editRight:{
        server:false,
        serverId:false,
        serverIp:false,
        serverPort:false,
        server_describe:false,
        platformId:false,
        openServiceTime:false,
        addUser:false
      },
      searchKey: {
        id: "",
        server: "",
        serverId: "",
        serverIp: "",
        serverPort: "",
        server_describe: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        gameName: "",
        platform: "",
        openServiceTime:"",
        channelId:""
      },
      idx: -1,
      id: -1,
      responseResult: [],
      id: "",
      gameList: [],
      platformList: [],
      selectGame: "",
      synServerList: [],
      ChangeStateVisible: false,
      SetDefaultVisible: false,
      ServerAddChannelVisible: false,
      channel: [],
      otherChannelData: [],
      checkchannelData: [],
      allChannel: [],
      allChannelFormPlatform:{}
    };
  },
  created() {
    setLocalThisUrl(this);
    this.getAllChannel();
    this.getAllPlatform();
    this.getData();
    this.right();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getAllChannel();
        this.getAllPlatform();
        this.getData();
        this.right();
      }.bind(this)
    );
    bus.$on(
      "changeChannel",
      function(obj) {
        this.getAllChannel();
      }.bind(this)
    );
  },
  beforeDestroy() {
    bus.$off("changeGameId");
    bus.$off("changeChannel");
  },
  computed: {
    data() {
      return this.tableData;
    }
  },
  mounted() {
    this.right();
  },
  methods: {
    getAllPlatform() {
      this.$axios
        .post(this.url + "/getPlatformListForGameId", {
          id: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("平台获取成功");
            this.platformOptions = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("平台获取失败");
          }
        })
        .catch(failResponse => {});
    },
    saveCheckChannel() {
      var len = this.multipleSelection.length;
      var channel = "";
      for (var i = 0; i < this.checkchannelData.length; i++) {
        channel += "|"+this.checkchannelData[i] + "|;"; 
      }
      channel = channel.substring(0, channel.length - 1);
      if (len == 0) {
        this.$axios
          .post(this.url + "/api/channel/saveCheckChannel", {
            id: this.id,
            channel: channel
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              console.log("渠道更新成功");
              this.getData();
              this.ServerAddChannelVisible = false;
            } else {
              console.log(this.responseResult);
              console.log("渠道更新失败");
            }
          })
          .catch(failResponse => {});
      } else {
        var str = "";
        for (let i = 0; i < len; i++) {
          str += this.multipleSelection[i].id + ",";
        }
        str = str.substring(0, str.length - 1);

        this.$axios
          .post(this.url + "/api/channel/saveAllCheckChannel", {
            ids: str,
            channel: channel
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              console.log("渠道更新成功");
              this.getData();
              this.ServerAddChannelVisible = false;
            } else {
              console.log(this.responseResult);
              console.log("渠道更新失败");
            }
          })
          .catch(failResponse => {});
      }
    },
    generateAllChannelData(allChannel) {
      var len = allChannel.length;
      const data = [];
      for (let i = 0; i < len; i++) {
        data.push({
          value: allChannel[i].channelId,
          desc: allChannel[i].channelName + "",
          disabled: false
        });
      }
      this.otherChannelData = data;
    },
    HandleAddAllChannel() {
      const length = this.multipleSelection.length;
      if (length == 0) {
        this.$message.error("请勾选服务器");
        return;
      }
      this.ServerAddChannelVisible = true;

      let str = "";
      for (let i = 0; i < length; i++) {
        if (
          this.multipleSelection[i].platformId !=
          this.multipleSelection[0].platformId
        ) {
          this.$message.error("请选择相同平台的服务器");
          return;
        }
        // if(this.multipleSelection[i].gameId !=
        //   this.multipleSelection[0].gameId){
        //   this.$message.error("请选择相同游戏的服务器");
        // }
      }
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      this.getAllChannelFormPlatform(this.multipleSelection[0].platformId);
    },
    handleServerAddChannel(index, row){
      this.idx = index;

      const item = this.tableData[index];
      this.id = item.id;
      this.getAllChannelFormPlatform(item.platformId);
      this.getChannel(item);
      this.ServerAddChannelVisible = true;
    },
    getChannel(item) {
      var channelStr = item.channel;
      if (channelStr != null && channelStr != "") {
        var len = channelStr.split(";").length;

        const data = [];
        for (var i = 0; i < len; i++) {
          data.push(parseInt(channelStr.split(";")[i].substring(1,channelStr.split(";")[i].length-1)));
        }
        this.checkchannelData = data;
      }
    },
    getAllChannelFormPlatform(platformId) {
      this.$axios
        .post(this.url + "/api/channel/getAllChannelFormPlatform", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("列表获取成功");
            this.allChannelFormPlatform = successResponse.data.data.list;
            this.generateAllChannelData(this.allChannelFormPlatform);
          } else {
            console.log(this.responseResult);
            console.log("列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getAllChannel() {
      this.$axios
        .post(this.url + "/api/channel/getAllChannel", {
            gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("列表获取成功");
            this.allChannel = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getData();
      this.getAllChannelFormPlatform(this.searchKey.platformId);
    },
    selectChannel(){
      this.getData();
    },
    handleGetList() {
      this.$axios
        .post(this.url + "/api/server/getServerList", {
          platform: "muzhi"
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data != "") {
            console.log("服务器列表获取成功");
          }
        })
        .catch(failResponse => {});
    },
    handleSyn() {
      this.$axios
        .post(this.url + "/api/server/SynServerList", {
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("服务器列表同步成功");
            this.synServerList = JSON.parse(successResponse.data.data);
            console.log(this.synServerList);
            this.getData();
          }else{
            this.synServerList = [];
            console.log("服务器列表同步失败");
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    getGameList() {
      this.$axios
        .post(this.url + "/getAllGameList", {

        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("游戏列表获取成功");
            this.gameList = successResponse.data.data;
          } else {
            this.gameList = [];
            console.log(this.responseResult);
            console.log("游戏列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getPlatformList() {
      this.$axios
        .post(this.url + "/getAllPlatformList", {   
              gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("平台列表获取成功");
            this.platformList = successResponse.data.data;
          } else {
            this.platformList = [];
            console.log(this.responseResult);
            console.log("平台列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    right() {
      const right = localStorage.getItem("rightTags");
      if (right == null) {
        this.handleVisible = false;
        return;
      }
      if (right.indexOf("Server_management_Handle") != -1) {
        this.handleVisible = true;
      }
      if(right.indexOf("Server_State_Datetime_Handle") != -1){
        this.handleVisible = true;
        this.handleEditVisible= true;
        this.handleSetStateVisible= true;
        this.handleSetDefaultVisible= false;
        this.handleAddChannelVisible= false;
        this.handleDeleteVisible= false;
        this.editRight.server = true;
        this.editRight.serverId = true;
        this.editRight.serverIp = true;
        this.editRight.serverPort = true;
        this.editRight.server_describe = true;
        this.editRight.platformId = true;
        this.editRight.addUser = true;
      }
    },
    //重置表单
    rest() {},
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.url + "/getAllServer", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          id: "",
          server: this.searchKey.server,
           gameName: this.searchKey.gameName,
          platformId: this.searchKey.platformId,
          platform: this.searchKey.platform,
          serverIp: this.searchKey.serverIp,
          server_describe: this.searchKey.server_describe,
          sort: this.searchKey.sort,
          addUser: "",
          addDatetime: "",
          state: this.searchKey.state,
          channelId:this.searchKey.channelId,
          gameId: this.$gameId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
            console.log(this.responseResult);
            this.$message.error("服务器列表获取失败");
          }
        });
    },

    search() {
      this.is_search = true;
      this.getData();
    },
    stateSelect() {
      this.getData();
    },
    formatter(row, column) {
        //时间格式化               
        var date = row[column.property];
        return formatDatetime(date);
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.getPlatformList();
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        serverId: item.serverId,
        server: item.server,
        serverIp: item.serverIp,
        server_describe: item.server_describe,
        sort: item.sort,
        addUser: item.addUser,
        addDatetime: item.addDatetime,
        state: item.state,
        gameId: item.gameId,
        roleId: item.roleId,
        platformId: item.platformId,
        serverPort: item.serverPort,
        openServiceTime: item.openServiceTime
      };
      this.editVisible = true;
    },
    handleChangeState(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeStateVisible = true;
    },
    handleSetDefault(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.SetDefaultVisible = true;
    },
    saveSetDefault() {
      this.$axios
        .post(this.url + "/api/server/setDefaultServer", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("默认服务器设置成功");
            this.multipleSelection = [];
            this.SetDefaultVisible = false;
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("默认服务器设置失败");
          }
        })
        .catch(failResponse => {});
    },
    saveChangeState() {
      this.$axios
        .post(this.url + "/api/server/ChangeState", {
          id: this.id,
          state: this.form.state
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("设置服务器状态成功");
            this.multipleSelection = [];
            this.ChangeStateVisible = false;
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("设置服务器状态失败");
          }
        });
      this.ChangeStateVisible = false;
    },
    handleChangeStateToFrozen(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.changeStateToFrozenVisible = true;
    },
    handleChangeStateToNormal(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.changeStateToNormalVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
      this.id = this.tableData[index].id;
    },
    delAll() {
      this.del_list = this.del_list.concat(this.multipleSelection);
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
        .post(this.url + "/deleteAllServer", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("服务器批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("服务器批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddServer() {
      this.getPlatformList();
      this.addServerVisible = true;
      this.form = {
        id: "",
        server: "",
        serverTag: "",
        serverId: "",
        server_describe: "",
        serverParentId: "",
        serverSort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        serverPort: ""
      };
      this.selectGame = "";
    },
    saveAddServer() {
      if (this.form.server == "") {
        console.log("服务器名称不能为空");
        this.$message.error("服务器名称不能为空");
      } else if (this.form.platformId == "") {
        console.log("所属平台不能为空");
        this.$message.error("所属平台不能为空");
      } else {
        this.$axios
          .post(this.url + "/addServer", {
            serverId: this.form.serverId,
            server: this.form.server,
            serverIp: this.form.serverIp,
            server_describe: this.form.server_describe,
            sort: this.form.sort,
            addUser: this.form.addUser,
            state: this.form.state,
            gameId: this.$gameId,
            platformId: this.form.platformId,
            serverPort: this.form.serverPort
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("服务器添加成功");
              this.tableData.push(this.form);
              this.getData();
            } else {
              console.log(this.responseResult);
              this.$message.error("服务器添加失败");
            }
          })
          .catch(failResponse => {});
        this.addServerVisible = false;
      }
    },
    // 保存编辑
    saveEdit() {
      if (this.form.server == "") {
        console.log("服务器名称不能为空");
        this.$message.error("服务器名称不能为空");
      } else if (this.form.platformId == "") {
        console.log("所属平台不能为空");
        this.$message.error("所属平台不能为空");
      } else {
      this.$axios
        .post(this.url + "/editServer", {
          id: this.form.id,
          serverId: this.form.serverId,
          server: this.form.server,
          serverIp: this.form.serverIp,
          server_describe: this.form.server_describe,
          sort: this.form.sort,
          addUser: this.form.addUser,
          addDatetime: this.form.addDatetime,
          state: this.form.state,
          gameId: this.$gameId,
          platformId: this.form.platformId,
          serverPort: this.form.serverPort,
          openServiceTime:this.GMTToStr(this.form.openServiceTime)
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("服务器信息修改成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("服务器信息修改失败");
          }
        })
        .catch(failResponse => {});
      this.editVisible = false;
      }
    },
    GMTToStr(time){
        let date = new Date(time)
        let Str=date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + 
        date.getDate() + ' ' + 
        date.getHours() + ':' + 
        date.getMinutes() + ':' + 
        date.getSeconds()
        return Str
    },
    // 确定冻结
    changeStateToFrozen() {
      this.$axios
        .post(this.url + "/changeStateToFrozen_Server", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`服务器冻结成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("服务器冻结失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToFrozenVisible = false;
      this.rest();
    },
    // 确定解冻
    changeStateToNormal() {
      this.$axios
        .post(this.url + "/changeStateToNormal_Server", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("服务器解冻成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("服务器解冻失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToNormalVisible = false;
      this.rest();
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/deleteServer", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`服务器删除成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("服务器删除失败");
          }
        })
        .catch(failResponse => {});

      this.tableData.splice(this.idx, 1);

      this.delVisible = false;
    },
    formatIsDefault: function(row, column, cellValue, index) {
      return row.isDefault == 1 ? "默认" : "";
    },
    formatChannal: function(value,platformId) { 
      for(var i = 0;i<this.allChannel.length;i++){
          if(this.allChannel[i].channelId==value && this.allChannel[i].platformId==platformId){
              return this.allChannel[i].channelName;
          }
      }
    },
    formatState: function(row, column, cellValue, index) {
      var label = "";
      if (row.state == 0) {
        label = "未开启";
      }
      if (row.state == 1) {
        label = "维护";
      }
      if (row.state == 2) {
        label = "新服";
      }
      if (row.state == 3) {
        label = "良好";
      }
      if (row.state == 4) {
        label = "爆满";
      }
      return label;
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
