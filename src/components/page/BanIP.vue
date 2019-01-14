<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>IP封禁
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>
        封禁物理IP地址；
        <br>
        时长单位为秒，不输入则为永久禁封；
      </div>
      <el-collapse v-model="activeNames"  v-if="handleVisible">
        <el-collapse-item title="折叠" name="1">
          <div class="form-box">
            <el-form ref="form" :model="form" label-width="150px">
              <el-form-item class="el-form-item" label="选择平台">
                <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择平台">
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.platformId"
                    :label="item.platform"
                    :value="item.platformId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="el-form-item" label="选择服务器">
                <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器">
                  <el-option
                    v-for="item in serverOptions"
                    :key="item.serverId"
                    :label="item.serverName"
                    :value="item.serverId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="IP">
                <el-input style="width:215px" placeholder="请输入IP" v-model="form.ip" clearable></el-input>
              </el-form-item>
              <el-form-item label="时长">
                <el-input style="width:215px" placeholder="请输入时长" v-model="form.banLong" clearable></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  style="width:515px"
                  type="textarea"
                  :autosize="{ minRows:4, maxRows: 10}"
                  placeholder="请输入备注"
                  v-model="form.note"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="添加人">
                <el-input style="width:215px" placeholder="请输入添加人" v-model="form.addUser" clearable></el-input>
              </el-form-item>
              <el-form-item label>
                <el-button type="primary" icon="addBanIp" @click="addBanIp">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div style="margin:15px;">
        <el-button
          type="primary"
          icon="delete"
          class="handle-del mr10"
          @click="handleDelAll"
          v-if="handleVisible"
        >批量删除</el-button>
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
            :key="item.id"
            :label="item.platform"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="grid-content bg-purple-light">服务器：</span>
        <el-select
          v-model="searchKey.serverId"
          @change="selectSearchKeyServer"
          placeholder="筛选服务器"
          style="width:150px"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in searchKeyServerOptions"
            :key="item.serverId"
            :label="item.serverName"
            :value="item.serverId"
          ></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">内容：</span>
        <el-input
          v-model="searchKey.releaseContent"
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
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="note" label="备注" width="200"></el-table-column>
        <el-table-column prop="banLong" label="禁封时长"></el-table-column>
        <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="banDatetime" label="禁封时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="banState" label="禁封状态" :formatter="formatBanState"></el-table-column>
        <el-table-column prop="addUser" label="编辑人"></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleBan(scope.$index, scope.row)"
              v-if="scope.row.banState!=1"
            >封禁</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleNotBan(scope.$index, scope.row)"
              v-if="scope.row.banState==1"
            >解除封禁</el-button>
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
          :page-sizes="[ 5, 10, 15, 20]"
          :page-size="10"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑冻结提示框 -->
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

  </div>
</template>

<script>
import Vue from "vue";
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
export default {
  name: "BanIp",
  data() {
    return {
      url: "http://localhost:8011",
      activeNames: ["1"],
      editableTabsValue: "1",
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      total: 0,
      platformOptions: [
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [],
      serverValue: "",
      serverLabel: "",
      form: {
        platformId: "",
        serverId: "",
        banLong:"",
        ip:"",
        addUser:"",
      },
      searchKey: {
        platformId: "",
        serverId: "",
        releaseContent:"",
      },
      id: 0,
      serverIp: "",
      tableData: [],
      delAllVisible: false,
      idx: 0,
      cur_page: 1,
      handleVisible: false,
      searchKeyServerOptions:[],
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
    this.right();
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
  beforeDestroy() {
    bus.$off("changeGameId");
  },
  methods: {
    right() {
      const right = localStorage.getItem("rightTags");
      if (right == null) {
        this.handleVisible = false;
      } else if (right.indexOf("Player_BanIp_Handle") == -1) {
        this.handleVisible = false;
      } else {
        this.handleVisible = true;
      }
    },
    handleDelAll() {
      this.delAllVisible = true;
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
            this.getBanIp();
          } else {
            this.platformOptions =[];
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
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("平台服务器列表获取成功");
            this.serverOptions = successResponse.data.data;
          } else {
            this.serverOptions =[];
            console.log(this.responseResult);
            console.log("平台服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId,
          gameId: this.$gameId
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
    search() {
      this.getBanIp();
    },
    getBanIp() {
      var strPlatform = "";
      for (var i = 0; i < this.platformOptions.length; i++) {
        strPlatform += this.platformOptions[i].platformId + ",";
      }
      strPlatform = strPlatform.substring(0, strPlatform.length - 1);

      this.$axios
        .post(this.url + "/api/ip/getBanIp", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          platformId: this.searchKey.platformId,
          serverId: this.searchKey.serverId,
          strPlatform: strPlatform,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("IP封禁列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            this.tableData =[];
            this.total =0;
            console.log(this.responseResult); 
            this.$message.error("IP封禁列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getServerList(this.form.platformId);
    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getBanIp();
    },
    selectSearchKeyServer() {
      this.getBanIp();
    },
    changePropCount(value) {
    },
    changeMoneyCount(value) {
    },
    formatter(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }

      var tt = new Date(parseInt(date)).toLocaleString();
      return tt;
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
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
    addBanIp() {
      this.$axios
        .post(this.url + "/api/ip/addBanIp", {
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          ip: this.form.ip,
          banLong: this.form.banLong,
          note: this.form.note,
          addUser: this.form.addUser,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("IP禁封申请添加成功");
            this.$message.success("IP禁封申请添加成功");
            this.getBanIp();
          } else {
            console.log(this.responseResult);
            console.log("IP禁封申请添加失败");
            this.$message.error("IP禁封申请添加失败");
          }
        });
    },
    handleBan(index, row) {
      var item = this.tableData[index];
      this.$axios
        .post(this.url + "/api/ip/banIp", {
          id: item.id,
          platformId: item.platformId,
          remove: 0,
          ip: item.ip,
          banLong: item.banLong,
          note: item.note,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("IP禁封成功");
            this.$message.success("IP禁封成功");
            this.getBanIp();
          } else {
            console.log(this.responseResult);
            console.log("IP禁封失败");
            this.$message.error("IP禁封失败");
          }
        });
    },
    handleNotBan(index, row) {
      var item = this.tableData[index];
      this.$axios
        .post(this.url + "/api/ip/banIp", {
          id: item.id,
          platformId: item.platformId,
          remove: 1,
          ip: item.ip,
          banLong: item.banLong,
          note: item.note,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("IP解除禁封成功");
            this.$message.success("IP解除禁封成功");
            this.getBanIp();
          } else {
            console.log(this.responseResult);
            console.log("IP解除禁封失败");
            this.$message.error("IP解除禁封失败");
          }
        });
    },
    saveDelAll() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      //批量删除处理
      this.$axios
        .post(this.url + "/api/ip/deleteAllBanIp", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("批量删除成功");
            this.multipleSelection = [];
            this.getBanIp();
          } else {
            console.log(this.responseResult);
            this.$message.error("批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(index, row) {
      var item = this.tableData[index];
      this.$axios
        .post(this.url + "/api/ip/deleteBanIp", {
          id: item.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("删除成功");
            this.$message.success("删除成功");
            this.getBanIp();
          } else {
            console.log(this.responseResult);
            console.log("删除失败");
            this.$message.error("删除失败");
          }
        });
    },
    resetForm() {
      this.form = {
        platformId: "",
        serverId: ""
      };
    },
    formatBanState(row, column, cellValue, index) {
      return row.banState == 0 ? "未禁封" : "已禁封";
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getBanIp();
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
.red{
    color: #ff0000;
}
</style>
