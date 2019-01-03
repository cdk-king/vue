<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
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

        <span class="grid-content bg-purple-light">账号：</span>
        <el-input
          v-model="searchKey.account"
          placeholder="筛选账号"
          class="handle-input"
          style="width:150px"
        ></el-input>
        <span class="grid-content bg-purple-light">用户名：</span>
        <el-input
          v-model="searchKey.name"
          placeholder="筛选用户名"
          class="handle-input"
          style="width:150px"
        ></el-input>
        <span class="grid-content bg-purple-light">角色：</span>
        <el-input v-model="select_word" placeholder="筛选角色" class="handle-input" style="width:150px"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAddUser">添加</el-button>
      </div>
      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="account" label="账号" width="100"></el-table-column>
        <el-table-column prop="name" label="用户名" width="100"></el-table-column>
        <el-table-column label="角色" width="120">
          <template slot-scope="role">
            <ul>
              <li v-for="item in role.row.roles" v-bind:key="item">{{ item | filters_roleItem }}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="80" :formatter="formatState"></el-table-column>
        <el-table-column prop="phone" label="手机" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column
          prop="addDatetime"
          width="120"
          label="创建时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column
          prop="lastDatetime"
          width="120"
          label="更新时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleManageRole(scope.$index, scope.row)"
            >管理角色</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEditPassword(scope.$index, scope.row)"
            >修改密码</el-button>
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
          :page-sizes="[ 5, 10, 15, 20]"
          :page-size="10"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>

    <!-- 角色选择弹出框 -->
    <el-dialog
      title="角色管理"
      :visible.sync="ManageRoleVisible"
      width="50%"
      height="50%"
      style="top:-100px"
    >
      <el-form ref="form" :model="form" label-width="0px">
        <el-form-item label>
          <div>
            <div class="plugins-tips">
              账号：{{form.account}}
              <br>

              用户名：{{form.name}}
            </div>
            <div class="drag-box">
              <div class="drag-box-item">
                <div class="item-title">角色列表</div>
                <draggable v-model="todo" @remove="removeHandle" :options="dragOptions">
                  <transition-group tag="div" id="todo" class="item-ul">
                    <div v-for="item in todo" class="drag-list" :key="item.id">{{item.content}}</div>
                  </transition-group>
                </draggable>
              </div>
              <div class="drag-box-item">
                <div class="item-title">用户角色</div>
                <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                  <transition-group tag="div" id="doing" class="item-ul">
                    <div v-for="item in doing" class="drag-list" :key="item.id">{{item.content}}</div>
                  </transition-group>
                </draggable>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label></el-form-item>
      </el-form>
      <p>Tips : 可拖拽权限列表进行管理</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ManageRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveManageRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加用户"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addUserVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label=" 用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label=" 用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑密码弹出框 -->
    <el-dialog
      title="修改密码"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editPasswordVisible"
      width="30%"
    >
      <el-form ref="form" :model="passwordform" label-width="100px">
        <el-form-item label="输入新密码">
          <el-input v-model="passwordform.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordform.checkPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditPassword">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑冻结提示框 -->
    <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
      <div class="del-dialog-cnt">冻结后将停止账号使用，是否确定冻结？</div>
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
import draggable from "vuedraggable";
import md5 from "js-md5";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "usertable",
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
      addUserVisible: false,
      ManageRoleVisible: false,
      handleVisible: true,
      delAllVisible: false,
      total: 0,
      form: {
        id: "",
        account: "",
        name: "",
        type: "",
        phone: "",
        email: "",
        addDatetime: "",
        lastDatetime: "",
        roles: []
      },
      searchKey: {
        account: "",
        name: "",
        type: "",
        phone: "",
        email: "",
        addDatetime: "",
        lastDatetime: "",
        state: ""
      },
      passwordform: {
        id: "",
        newPassword: "",
        checkPassword: ""
      },
      idx: -1,
      responseResult: [],
      id: "",
      roleData: [],
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style"
      },
      todo: [
      ],
      doing: [

      ],
      done: [

      ]
    };
  },
  components: {
    draggable
  },
  created() {
    setLocalThisUrl(this);
    this.getRole();
    this.right();
  },
  computed: {
    computeA: function() {
      return;
    },
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
      if (right == null) {
        this.handleVisible = false;
      } else if (right.indexOf("User_management_Handle") == -1) {
        this.handleVisible = false;
      } else {
        this.handleVisible = true;
      }
    },
    test() {
      this.ManageRoleVisible = true;
    },
    //重置表单
    rest() {
      this.$refs.multipleTable.resetFields();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getRole() {
      this.$axios
        .post(this.url + "/getRole", {
          pageNo: 1,
          pageSize: 10,
          role: "",
          role_describe: "",
          addUser: "",
          state: "",
          isPage: ""
        })
        .then(res => {
          console.log("角色列表获取成功");
          this.roleData = res.data.data.list;
          this.getData();
        });
    },
    getData() {
      this.$axios
        .post(this.url + "/getUser", {
          pageNo: this.cur_page,
          pageSize: 10,
          account: this.searchKey.account,
          name: this.searchKey.name,
          type: this.form.type,
          phone: this.form.phone,
          email: this.form.email,
          state: this.searchKey.state
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) { 
            console.log("用户列表获取成功");
            this.tableData = this.mapData(successResponse.data.data.list);
            this.total = successResponse.data.data.total;
          } else {
            this.$message.error("用户列表获取失败");
            console.log("用户列表获取失败");
          }
        });
    },
    mapData(obj) {
      if (!Array.isArray(obj)) {
        return;
      }

      obj.map(item => {
        if (item.roles != undefined) {
          if (item.roles != null && item.roles != "") {
            item.roles = item.roles.split(",");
            for (var i = 0; i < item.roles.length; i++) {
              for (var j = 0; j < this.roleData.length; j++) {
                if (this.roleData[j]["id"] == item.roles[i]) {
                  item.roles[i] =
                    item.roles[i] + "#cdk#" + this.roleData[j]["role"];
                }
              }
            }
          }
        }
      });
      return obj;
    },
    search() {
      this.is_search = true;
      this.getData();
      this.getRole();
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
    handleManageRole(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      var roles = item.roles;
      this.doing = [];
      this.todo = [];
      this.done = [];
      if (roles != null && roles != "") {
        for (var i = 0; i < roles.length; i++) {
          (function(a, that) {
            if (roles[a].split) {
              var mapObj = new Map();
              mapObj["content"] = roles[a].split("#cdk#")[1];
              mapObj["id"] = roles[a].split("#cdk#")[0];
              that.doing.push(mapObj);
              that.done.push(mapObj);
            }
          })(i, this);
        }
      }
      if (this.roleData.length != 0) {
        for (var j = 0; j < this.roleData.length; j++) {
          (function(a, that) {
            var mapObj = new Map();
            mapObj["content"] = that.roleData[a]["role"];
            mapObj["id"] = that.roleData[a]["id"];
            that.todo.push(mapObj);
          })(j, this);
        }
      }
      for (var i = 0; i < this.doing.length; i++) {
        for (var j = 0; j < this.todo.length; j++) {
          if (this.doing[i]["content"] == this.todo[j]["content"]) {
            this.todo.splice(j, 1);
            j--;
          }
        }
      }
      this.form = {
        id: item.id,
        account: item.account,
        name: item.name,
        type: item.type,
        phone: item.phone,
        email: item.email
      };
      this.ManageRoleVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        account: item.account,
        name: item.name,
        type: item.type,
        phone: item.phone,
        email: item.email
      };
      this.editVisible = true;
    },
    handleEditPassword(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.passwordform = {
        id: item.id,
        newPassword: "",
        checkPassword: ""
      };
      this.editPasswordVisible = true;
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
      //concat() 方法用于连接两个或多个数组。
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
        .post("/deleteAllUser", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddUser() {
      this.addUserVisible = true;
      this.form = {
        id: "",
        account: "",
        name: "",
        type: "",
        phone: "",
        email: ""
      };
    },
    saveManageRole() {
      var deleteUserRoles = "";
      var InsertUserRoles = "";

      //储存操作前的数据
      var oldDoing = this.doing;
      var olddone = this.done;

      for (var i = 0; i < this.doing.length; i++) {
        for (var j = 0; j < this.done.length; j++) {
          if (this.doing[i]["content"] == this.done[j]["content"]) {
            this.doing.splice(i, 1);
            this.done.splice(j, 1);
            i--;
            j = this.done.length;
          }
        }
      }

      for (i = 0; i < this.doing.length; i++) {
        InsertUserRoles += this.doing[i]["id"];
        if (i != this.doing.length - 1) {
          InsertUserRoles += ",";
        }
      }

      for (i = 0; i < this.done.length; i++) {
        deleteUserRoles += this.done[i]["id"];
        if (i != this.done.length - 1) {
          deleteUserRoles += ",";
        }
      }

      //还原操作前的数据
      this.doing = oldDoing;
      this.done = olddone;
      //添加角色处理
      this.$axios
        .post(this.url + "/insertUserRoles", {
          id: this.form.id,
          InsertUserRoles: InsertUserRoles
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("用户角色添加成功");
            this.$message.success("用户角色添加成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户角色添加失败");
          }
        })
        .catch(failResponse => {});
      //删除角色处理
      this.$axios
        .post(this.url + "/deleteUserRoles", {
          id: this.form.id,
          deleteUserRoles: deleteUserRoles
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户角色编辑完成");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户角色删除失败");
          }
        })
        .catch(failResponse => {});
      this.ManageRoleVisible = false;
    },
    saveAddUser() {
      if (this.form.account == "") {
        this.$message.error("账号不能为空");
      } else if (this.form.name == "") {
        this.$message.error("用户名不能为空");
      } else {
        this.$axios
          .post(this.url + "/addUser", {
            id: this.form.id,
            account: this.form.account,
            name: this.form.name,
            type: this.form.type,
            phone: this.form.phone,
            email: this.form.email
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("用户添加成功");
              this.getData();
            } else {
              console.log(this.responseResult);
              this.$message.error("用户添加失败");
            }
          })
          .catch(failResponse => {});
      }
      this.addUserVisible = false;
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post(this.url + "/editUser", {
          id: this.form.id,
          account: this.form.account,
          name: this.form.name,
          type: this.form.type,
          phone: this.form.phone,
          email: this.form.email
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户信息编辑成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户信息编辑失败");
          }
        })
        .catch(failResponse => {});
      this.editVisible = false;
    },
    saveEditPassword() {
      if (this.passwordform.newPassword == "") {
        this.$message.error("密码不能为空");
        return false;
      } else if (
        this.passwordform.newPassword != this.passwordform.checkPassword
      ) {
        this.$message.error("密码不一致");
        return false;
      } else {
        var password1 = md5.hex(this.passwordform.newPassword + "cdk");
        var password2 = md5.hex(password1 + "cdk");
        this.$axios
          .post(this.url + "/editPassword", {
            id: this.passwordform.id,
            password: password2
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("密码修改成功");
            } else {
              console.log(this.responseResult);
              this.$message.error("密码修改失败");
            }
          })
          .catch(failResponse => {});
      }
      this.editPasswordVisible = false;
    },
    // 确定冻结
    changeStateToFrozen() {
      this.$axios
        .post(this.url + "/changeStateToFrozen_User", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户冻结成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户冻结失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToFrozenVisible = false;
    },
    // 确定解冻
    changeStateToNormal() {
      this.$axios
        .post(this.url + "/changeStateToNormal_User", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户解冻成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户解冻失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToNormalVisible = false;
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/deleteUser", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("用户删除成功");
            this.tableData.splice(this.idx, 1);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("用户删除失败");
          }
        })
        .catch(failResponse => {});
      this.delVisible = false;
    },
    formatState: function(row, column, cellValue, index) {
      return row.state == 1 ? "已冻结" : row.sex == 0 ? "正常" : "正常";
    },

    removeHandle(event) {
      this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
    }
  },
  filters: {
    filters2: function(arg) {
      if (arg != null && arg != "") {
        var arr = arg.split(",");
        return arr;
      } else {
        return "";
      }
    },
    filters_roleItem: function(arg) {
      if (arg != null && arg != "") {
        var arr = arg.split("#cdk#");
        return arr[1];
      } else {
        return "";
      }
    }
  }
};
</script>

//在vue组件中，为了使样式私有化（模块化），不对全局造成污染，可以在style标签上添加scoped属性以表示它的只属于当下的模块
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

/* DragList */
.drag-box {
  display: inline-flex;
  user-select: none;
  width: 100%;
  max-width: 1500px;
  min-width: 100px;
}
.drag-box-item {
  flex: 1;
  background-color: #eff1f5;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}
.item-title {
  padding: 8px 8px 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}
.item-ul {
  padding: 0 8px 8px;
  height: 400px;
  overflow-y: scroll;
}
.item-ul::-webkit-scrollbar {
  width: 0;
}
.drag-list {
  border: 1px #e1e4e8 solid;
  padding: 10px;
  margin: 5px 0 10px;
  list-style: none;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  -webkit-transition: border 0.3s ease-in;
  transition: border 0.3s ease-in;
}
.drag-list:hover {
  border: 1px solid #20a0ff;
}
.drag-title {
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed;
}
ul {
  list-style: none;
}
</style>
