<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">状态：</span>

        <el-select
          v-model="searchKey.state"
          placeholder="筛选"
          @change="stateSelect"
          class="handle-select mr10"
        >
          <el-option key="1" label="全部" value="0"></el-option>
          <el-option key="2" label="冻结" value="1"></el-option>
          <el-option key="3" label="未冻结" value="2"></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">权限名：</span>
        <el-input
          v-model="searchKey.rightName"
          placeholder="筛选权限名"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <span class="grid-content bg-purple-light">权限标识：</span>
        <el-input
          v-model="searchKey.rightTag"
          placeholder="筛选权限标识"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAddRight">添加</el-button>
      </div>
      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="rightName" label="权限名称"></el-table-column>
        <el-table-column prop="rightTag" label="权限标识"></el-table-column>
        <el-table-column prop="right_describe" label="描述"></el-table-column>
        <el-table-column prop="state" label="状态" width="80" :formatter="formatState"></el-table-column>
        <el-table-column
          prop="addDatetime"
          width="170"
          label="添加时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column prop="addUser" width="100" label="添加人"></el-table-column>
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
              @click="handleChangeStateToFrozen(scope.$index, scope.row)"
              v-if="scope.row.state!=1"
            >冻结</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleChangeStateToNormal(scope.$index, scope.row)"
              v-if="scope.row.state==1"
            >解冻</el-button>
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

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加权限"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addRightVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="form.rightName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.rightTag"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="form.right_describe"></el-input>
        </el-form-item>
        <el-form-item label="添加人">
          <el-input v-model="form.addUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑权限"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="form.rightName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.rightTag"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="form.right_describe"></el-input>
        </el-form-item>
        <el-form-item label="添加人">
          <el-input v-model="form.addUser"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.rightSort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑冻结提示框 -->
    <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
      <div class="del-dialog-cnt">冻结后将停止权限使用，是否确定冻结？</div>
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
  </div>
</template>

<script>
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "rightTable",
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
      addRightVisible: false,
      handleVisible: true,
      delAllVisible: false,
      total: 0,
      form: {
        id: "",
        rightName: "",
        rightTag: "",
        right_describe: "",
        rightParentId: "",
        rightSort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        rightSort: ""
      },
      searchKey: {
        id: "",
        rightName: "",
        rightTag: "",
        right_describe: "",
        rightParentId: "",
        rightSort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        rightSort: ""
      },
      idx: -1,
      responseResult: [],
      id: ""
    };
  },
  created() {
    setLocalThisUrl(this);
    this.getData();
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

      if (right.indexOf("Right_management_Handle") == -1) {
        this.handleVisible = false;
      } else {
        this.handleVisible = true;
      }
    },
    //重置表单
    rest() {},
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("page:" + val);
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.url + "/getRight", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          id: "",
          rightName: this.searchKey.rightName,
          rightTag: this.searchKey.rightTag,
          right_describe: this.searchKey.right_describe,
          rightParentId: this.searchKey.rightParentId,
          rightSort: this.searchKey.rightSort,
          addUser: "",
          addDatetime: "",
          state: this.searchKey.state
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            console.log(this.responseResult);
            this.$message.error("权限列表获取失败");
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
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        rightName: item.rightName,
        rightTag: item.rightTag,
        right_describe: item.right_describe,
        rightParentId: item.rightParentId,
        rightSort: item.rightSort,
        addUser: item.addUser,
        addDatetime: item.addDatetime,
        state: item.state,
        sort: item.sort
      };
      this.editVisible = true;
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
        .post(this.url + "/deleteAllRight", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("权限批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("权限批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddRight() {
      this.addRightVisible = true;
      this.form = {
        id: "",
        rightName: "",
        rightTag: "",
        right_describe: "",
        rightParentId: "",
        rightSort: "",
        addUser: "",
        addDatetime: "",
        state: ""
      };
    },
    saveAddRight() {
      if (this.form.rightName == "") {
        console.log("权限名称不能为空");
        this.$message.error("权限名称不能为空");
      } else if (this.form.rightTag == "") {
        console.log("权限标识不能为空");
        this.$message.error("权限标识不能为空");
      } else {
        this.$axios
          .post(this.url + "/addRight", {
            id: this.form.id,
            rightName: this.form.rightName,
            rightTag: this.form.rightTag,
            right_describe: this.form.right_describe,
            rightParentId: this.form.rightParentId,
            rightSort: this.form.rightSort,
            addUser: this.form.addUser,
            state: this.form.state
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("权限添加成功");
              this.tableData.push(this.form);
              this.getData();
            } else {
              console.log(this.responseResult);
              this.$message.error("权限添加失败");
            }
          })
          .catch(failResponse => {});
      }
      this.addRightVisible = false;
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post(this.url + "/editRight", {
          id: this.form.id,
          rightName: this.form.rightName,
          rightTag: this.form.rightTag,
          right_describe: this.form.right_describe,
          rightParentId: this.form.rightParentId,
          rightSort: this.form.rightSort,
          addUser: this.form.addUser,
          addDatetime: this.form.addDatetime,
          state: this.form.state,
          sort: this.form.sort
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("权限信息修改成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("权限信息修改失败");
          }
        })
        .catch(failResponse => {});
      this.editVisible = false;
    },
    // 确定冻结
    changeStateToFrozen() {
      this.$axios
        .post(this.url + "/changeStateToFrozen_Right", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`权限冻结成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("权限冻结失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToFrozenVisible = false;
      this.rest();
    },
    // 确定解冻
    changeStateToNormal() {
      this.$axios
        .post(this.url + "/changeStateToNormal_Right", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("权限解冻成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("权限解冻失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToNormalVisible = false;
      this.rest();
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/deleteRight", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`权限删除成功`);
            //必须异步处理
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("权限删除失败");
          }
        })
        .catch(failResponse => {});

      this.tableData.splice(this.idx, 1);

      this.delVisible = false;
    },
    formatState: function(row, column, cellValue, index) {
      return row.state == 1 ? "已冻结" : row.sex == 0 ? "正常" : "正常";
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
