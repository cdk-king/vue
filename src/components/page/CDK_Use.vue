<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>激活码使用情况
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <div class="plugins-tips">提示：激活码兑换后将永久失效</div>

        <Divider/>
        <div class="form-box" v-if="true">
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
            <el-form-item class="el-form-item" label="激活码">
              <el-input style="width:215px" placeholder="请输入激活码" v-model="form.cdk" clearable></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" @click="checkCDKIsUse">查询是否有效</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          v-model="searchKey.platformId"
          @change="selectPlatform"
          placeholder="请选择平台"
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

        <span class="grid-content bg-purple-light">礼包ID：</span>
        <el-input
          v-model="searchKey.giftId"
          placeholder="筛选礼包ID"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <span class="grid-content bg-purple-light">礼包名：</span>
        <el-input
          v-model="searchKey.giftName"
          placeholder="筛选礼包名"
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
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="cdk" label="CDK"></el-table-column>
        <el-table-column prop="couponId" label="礼包ID" :formatter="formatCouponId"></el-table-column>
        <el-table-column prop="giftName" label="礼包名" ></el-table-column>
        <el-table-column prop="sequenceId" label="序列号"></el-table-column>
        <el-table-column prop="platform" label="所在平台"></el-table-column>
        <el-table-column prop="isUsed" label="状态" :formatter="formatIsUsed"></el-table-column>
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

    <el-dialog
      title="提示"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="exchangeVisible"
      width="300px"
      center
    >
      <div class="text item">couponID:{{exchangeResult.couponId}}</div>
      <div class="text item">sequenceID:{{exchangeResult.sequenceId}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exchangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="exchangeVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "CDK_Use",
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
      addgiftVisible: false,
      handleVisible: true,
      delAllVisible: false,
      total: 0,
      form: {
        id: "",
        platformId: "",
        cdk: "",
        platformId: "",
        platform: ""
      },
      searchKey: {
        id: "",
        platformId: "",
        giftName: "",
        giftId: "",
        gift_describe: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        platformId: "",
        platform: ""
      },
      platformOptions: [
      ],
      idx: -1,
      responseResult: [],
      id: "",
      strPlatform: "",
      exchangeVisible: false,
      exchangeResult: {}
    };
  },
  created() {
    setLocalThisUrl(this);
    this.getPlatformList(this.$gameId);
    bus.$on(
      "changeGameId",
      function(obj) {
        console.log(obj.message);
        this.getPlatformList(this.$gameId);
      }.bind(this)
    );

    this.right();
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
    right() {
      const right = localStorage.getItem("rightTags");
      const username = localStorage.getItem("ms_username");
      if (right.indexOf("Gift_management_Handle") == -1) {
        this.handleVisible = false;
      } else {
        this.handleVisible = true;
      }
    },
    //重置表单
    rest() {
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    //筛选当前用户游戏的礼包
    getData() {
      this.$axios
        .post(this.url + "/getCDK", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          id: "",
          giftName: this.searchKey.giftName,
          giftId: this.searchKey.giftId,
          platformId: this.searchKey.platformId,
          strPlatform: this.strPlatform
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("激活码列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            console.log(this.responseResult);
            this.$message.error("激活码列表获取失败");
          }
        });
    },
    //当前游戏的平台
    getPlatformList(gameId) {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.$axios
        .post(this.url + "/getPlatformListForUserIdAndGameId", {
          userId: userData.id,
          gameId: gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            this.strPlatform = this.strPlatform.substring(
              0,
              this.strPlatform.length - 1
            );
            this.getData();
          } else {
            console.log(this.responseResult);
            console.log("渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    search() {
      this.is_search = true;
      this.getData();
    },
    stateSelect() {
      this.getData();
    },
    selectPlatform() {
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
        .post(this.url + "/deleteAllGift", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("礼包批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("礼包批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/deleteGift", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`礼包删除成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("礼包删除失败");
          }
        })
        .catch(failResponse => {});

      this.tableData.splice(this.idx, 1);

      this.delVisible = false;
    },
    formatCouponId: function(row, column, cellValue, index) {
      return Math.round(parseInt(row.couponId) / 1).toString();
    },
    formatIsUsed: function(row, column, cellValue, index) {
      return parseInt(row.isUsed) == 1 ? "已使用" : "未使用？";
    },
    exchangeCDK() {
      this.$axios
        .post(this.url + "/exchangeCDK", {
          cdk: this.form.cdk,
          platformId: this.form.platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("CDK兑换成功");
            this.$message.success("CDK兑换成功");
            this.exchangeResult = successResponse.data.data;
            this.exchangeVisible = true;
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    checkCDKIsUse() {
      this.$axios
        .post(this.url + "/api/cdk/checkCDKIsUse", {
          cdk: this.form.cdk,
          platformId: this.form.platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("CDK校验通过");
            this.$message.success("CDK校验通过");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {
          this.$message.error("CDK解析出错");
        });
    },
    resetForm() {
      this.form.cdk = "";
      this.form.platformId = "";
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
