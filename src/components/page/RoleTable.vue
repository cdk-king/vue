<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>角色管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">状态：</span>

        <el-select
          v-model="searchKey.state"
          placeholder="筛选状态"
          @change="stateSelect"
          class="handle-select mr10"
        >
          <el-option key="1" label="全部" value="0"></el-option>
          <el-option key="2" label="冻结" value="1"></el-option>
          <el-option key="3" label="未冻结" value="2"></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">角色：</span>
        <el-input
          v-model="searchKey.role_describe"
          placeholder="筛选角色"
          class="handle-input"
          style="width:150px"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAddRole">添加</el-button>
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

        <el-table-column prop="role" label="角色名称"></el-table-column>
        <el-table-column prop="state" label="状态" :formatter="formatState"></el-table-column>
        <el-table-column prop="role_describe" label="描述"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="right">
            <el-collapse>
              <el-collapse-item title="折叠" name="1">
                <ul>
                  <li
                    class="li-small"
                    v-for="item in right.row.rights"
                    v-bind:key="item"
                  >{{ item | filters_rightItem }}</li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column
          prop="addDatetime"
          width="170"
          label="添加时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column prop="addUser" width="120" label="添加人"></el-table-column>
        <el-table-column label="操作" align="center" v-if="handleVisible" width="400" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleManageRight(scope.$index, scope.row)"
            >拖拽管理权限</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleTransferRight(scope.$index, scope.row)"
            >穿梭管理权限</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEditRight(scope.$index, scope.row)"
            >编辑权限</el-button>
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

    <!-- 权限选择弹出框 -->
    <el-dialog
      title="权限管理"
      :visible.sync="ManageRightVisible"
      width="50%"
      height="50%"
      style="top:-100px"
    >
      <el-form ref="form" :model="form" label-width="0px">
        <el-form-item label>
          <div>
            <div class="plugins-tips">
              角色名称：{{form.role}}
              <br>

              描述：{{form.role_describe}}
            </div>
            <div class="drag-box">
              <div class="drag-box-item">
                <div class="item-title">权限列表</div>
                <draggable v-model="todo" @remove="removeHandle" :options="dragOptions">
                  <transition-group tag="div" id="todo" class="item-ul">
                    <div v-for="item in todo" class="drag-list" :key="item.id">{{item.content}}</div>
                  </transition-group>
                </draggable>
              </div>
              <div class="drag-box-item">
                <div class="item-title">用户权限</div>
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
        <el-button @click="ManageRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveManageRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加角色"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addRoleVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form.role"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.role_describe"></el-input>
        </el-form-item>
        <el-form-item label="添加人">
          <el-input v-model="form.addUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑角色"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form.role"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.role_describe"></el-input>
        </el-form-item>
        <el-form-item label="添加人">
          <el-input v-model="form.addUser"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限弹出框 -->
    <el-dialog
      title="编辑角色权限"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editRightVisible"
      width="800px"
    >
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="权限">
          <el-input
            style="width:600px"
            type="textarea"
            :autosize="{ minRows:10, maxRows: 20}"
            v-model="editRights"
            clearable
          ></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRight">确 定</el-button>
      </span>
    </el-dialog>

        <!-- 添加权限穿梭框 -->
    <el-dialog title="管理权限" :visible.sync="roleAddRightVisible" width="600px" center>
      <template >
        <el-transfer
          filterable
          v-model="checkRightData"
          :props="{
          key: 'value',
          label: 'desc'
        }"
          :data="otherRightData"
          :titles="['其他权限', '已选权限']"
          :button-texts="['移除', '添加']"
        ></el-transfer>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleAddRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCheckRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑冻结提示框 -->
    <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
      <div class="del-dialog-cnt">冻结后将停止角色使用，是否确定冻结？</div>
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
import Utils from "../../UtilsJs/Utils";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "roleTable",
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
      addRoleVisible: false,
      ManageRightVisible: false,
      handleVisible: true,
      delAllVisible: false,
      total: 0,
      form: {
        id: "",
        role: "",
        role_describe: "",
        addUser: "",
        addDatetime: "",
        state: "",
        rights:""
      },
      searchKey: {
        id: "",
        role: "",
        role_describe: "",
        addUser: "",
        addDatetime: "",
        state: ""
      },
      idx: -1,
      responseResult: [],
      id: "",
      rightData: [],
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style"
      },
      todo: [],
      doing: [],
      done: [],
      editRightVisible:false,
      editRights:"",
      otherRightData: [],
      checkRightData: [],
      roleAddRightVisible:false
    };
  },
  components: {
    draggable
  },
  created() {
    setLocalThisUrl(this);
    this.getRight();
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

      if (right.indexOf("Role_management_Handle") == -1) {
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
      this.getData();
    },
    getRight() {
      this.$axios
        .post(this.url + "/getRight", {
          pageNo: 1,
          pageSize: 10,
          role: "",
          role_describe: "",
          addUser: "",
          state: "",
          isPage: ""
        })
        .then(res => {
          this.rightData = res.data.data.list;
          this.getData();
        });
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios
        .post(this.url + "/getRole", {
          pageNo: this.cur_page,
          pageSize: 10,
          role: this.searchKey.role,
          role_describe: this.searchKey.role_describe,
          addUser: this.searchKey.addUser,
          state: this.searchKey.state,
          isPage: "isPage"
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("角色列表获取成功");
            this.tableData = this.mapData(successResponse.data.data.list);
            this.total = successResponse.data.data.total;
          } else {
            this.tableData = [];
            this.total =0;
            console.log(this.responseResult);
            this.$message.error("角色列表获取失败");
          }
        });
    },
    mapData(obj) {
      if (!Array.isArray(obj)) {
        return;
      }
      obj.map(item => {
        if (item.rights != undefined) {
          if (item.rights != null && item.rights != "") {
            item.rights = item.rights.split(",");
            for (var i = 0; i < item.rights.length; i++) {
              for (var j = 0; j < this.rightData.length; j++) {
                if (this.rightData[j]["id"] == item.rights[i]) {
                  item.rights[i] =
                    item.rights[i] + "#cdk#" + this.rightData[j]["rightName"];
                }
              }
            }
          }else{
            item.rights = [];
          }
        }else{
          item.rights = [];
        }
      });
      return obj;
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
    saveCheckRight(){
      const item = this.tableData[this.idx];
      var data = [];
      if(item.rights!=null){
        for(var i = 0;i<item.rights.length;i++){
            data.push(parseInt( item.rights[i].split("#cdk#")[0]));
        }
      }

        var deleteRoleRights = "";
        var InsertRoleRights = "";
        var list = this.checkRightData;
        var oldList = data;

        for(var j = 0;j<oldList.length;j++){
            for(i = 0;i<list.length;i++){
                if(oldList[j]==list[i]){
                    oldList.splice(j,1);
                    list.splice(i,1);
                    j--;
                    i = list.length;
                }
            }
        }

        for (i = 0; i < list.length; i++) {
              InsertRoleRights += list[i];
          if (i != list.length - 1) {
            InsertRoleRights += ",";
          }
        }

        for (i = 0; i < oldList.length; i++) {
          deleteRoleRights += oldList[i];
          if (i != oldList.length - 1) {
            deleteRoleRights += ",";
          }
        }
        console.log(InsertRoleRights);
        console.log(deleteRoleRights);

        this.InsertRoleRights(InsertRoleRights,deleteRoleRights);
        this.roleAddRightVisible = false;
    },
    handleEditRight(index, row){
        this.idx = index;
        this.form.id = this.tableData[index].id;
        var item = this.tableData[index];
        if(item.rights=="" || item.rights ==null){
          this.editRights = "";
        }else{
          this.editRights = item.rights.toString().replace(/#cdk#/g,"-");
        }
        
        this.editRightVisible = true;
    },
    handleTransferRight(index, row){
        this.idx = index;
        const item = this.tableData[index];
        this.form.id = this.tableData[index].id;
        this.id = item.id;
        this.generateAllRightData();
        var data = [];
        if(item.rights!=null){
          for(var i = 0;i<item.rights.length;i++){
              data.push(parseInt( item.rights[i].split("#cdk#")[0]));
          }
        }
        this.checkRightData = data;
        this.roleAddRightVisible = true;
    },
    generateAllRightData() {
      var len = this.rightData.length;
      const data = [];
      for (let i = 0; i < len; i++) {
        data.push({
          value: this.rightData[i].id,
          desc: this.rightData[i].rightName + "",
          disabled: false
        });
      }
      this.otherRightData = data;
    },
    handleManageRight(index, row) {
      this.getData();
      this.idx = index;
      const item = this.tableData[index];
      var rights = item.rights;
      this.doing = [];
      this.todo = [];
      this.done = [];
      if (rights != null && rights != "") {
        for (var i = 0; i < rights.length; i++) {
          (function(a, that) {
            if (rights[a].split) {
              var mapObj = new Map();
              mapObj["content"] = rights[a].split("#cdk#")[1];
              mapObj["id"] = rights[a].split("#cdk#")[0];
              that.doing.push(mapObj);
              that.done.push(mapObj);
            }
          })(i, this);
        }
      }
      if (this.rightData.length != 0) {
        for (var j = 0; j < this.rightData.length; j++) {
          (function(a, that) {
            var mapObj = new Map();
            mapObj["content"] = that.rightData[a]["rightName"];
            mapObj["id"] = that.rightData[a]["id"];
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
        role: item.role,
        role_describe: item.role_describe,
        addUser: item.addUser,
        addDatetime: item.addDatetime,
        state: item.state
      };
      this.ManageRightVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        role: item.role,
        role_describe: item.role_describe,
        addUser: item.addUser,
        addDatetime: item.addDatetime,
        state: item.state
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
        .post(this.url + "/deleteAllRole", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("角色批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("角色批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddRole() {
      this.addRoleVisible = true;
      this.form = {
        id: "",
        role: "",
        role_describe: "",
        addUser: "",
        addDatetime: "",
        state: ""
      };
    },
    saveEditRight(){
        const item = this.tableData[this.idx];
        var deleteRoleRights = "";
        var InsertRoleRights = "";
        var temp = "";
        if(this.editRights!="" && this.editRights!=null){
            var list = this.editRights.split(',');
        }else{
          var list = [];
        }
        if(item.rights!="" && item.rights!=null){
            var oldList = item.rights;
        }else{
          var oldList = [];
        }
        
        //去重
        var hash=[];
        for (var i = 0; i < list.length; i++) {
          for (var j = i+1; j < list.length; j++) {
            var a = "";
            var b = "";
            if(!list[i].indexOf("-")){
                a = list[i];
            }else{
                a = list[i].split("-")[0];
            }
            if(!list[j].indexOf("-")){
                b = list[j];
            }else{
                b = list[j].split("-")[0];
            }

            if(a==b){
              ++i;
            }
          }
          hash.push(list[i]);
        }
        list = hash;
        console.log(JSON.stringify(list));

        for(j = 0;j<oldList.length;j++){
            for(i = 0;i<list.length;i++){
              if( !list[i].indexOf("-")){
                temp += list[i]+",";
                if(oldList[j].split("#cdk#")[0]==list[i]){
                    oldList.splice(j,1);
                    list.splice(i,1);
                    j--;
                    i = list.length;
                }
              }else{
                temp += list[i].split("-")[0]+",";
                if(oldList[j].split("#cdk#")[0]==list[i].split("-")[0]){
                    oldList.splice(j,1);
                    list.splice(i,1);
                    j--;
                    i = list.length;
                }
              }
            }
        }

        for (i = 0; i < list.length; i++) {

          if(!list[i].indexOf("-")){
              InsertRoleRights += list[i];
          }else{
              InsertRoleRights += list[i].split("-")[0];
          }

          if (i != list.length - 1) {
            InsertRoleRights += ",";
          }
        }

        for (i = 0; i < oldList.length; i++) {
          deleteRoleRights += oldList[i].split("#cdk#")[0];
          if (i != oldList.length - 1) {
            deleteRoleRights += ",";
          }
        }
        console.log(InsertRoleRights);
        console.log(deleteRoleRights);

        this.InsertRoleRights(InsertRoleRights,deleteRoleRights);
        this.editRightVisible = false;
    },
    saveManageRight() {
      var deleteRoleRights = "";
      var InsertRoleRights = "";

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
        InsertRoleRights += this.doing[i]["id"];
        if (i != this.doing.length - 1) {
          InsertRoleRights += ",";
        }
      }

      for (i = 0; i < this.done.length; i++) {
        deleteRoleRights += this.done[i]["id"];
        if (i != this.done.length - 1) {
          deleteRoleRights += ",";
        }
      }

      //还原操作前的数据
      this.doing = oldDoing;
      this.done = olddone;
      //添加角色处理
      this.InsertRoleRights(InsertRoleRights,deleteRoleRights);
      this.ManageRightVisible = false;
    },
    InsertRoleRights(InsertRoleRights,deleteRoleRights){
        //添加角色处理
      this.$axios
        .post(this.url + "/InsertRoleRights", {
          id: this.form.id,
          InsertRoleRights: InsertRoleRights
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("角色权限添加完成");
            //删除角色处理
            this.deleteRoleRights(deleteRoleRights);
          } else {
            console.log(this.responseResult);
            this.$message.error("角色权限添加失败");
          }
        })
        .catch(failResponse => {});
    },
    deleteRoleRights(deleteRoleRights){
      //删除角色处理
      this.$axios
        .post(this.url + "/deleteRoleRights", {
          id: this.form.id,
          deleteRoleRights: deleteRoleRights
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("角色权限编辑完成");
            this.$message.success("角色权限编辑完成");
            this.getData();
            var userId = JSON.parse(localStorage.getItem("userData")).id;
            Utils.getUserAllRight(userId, this.url);
            
          } else {
            console.log(this.responseResult);
            this.$message.error("角色权限删除失败");
          }
        })
        .catch(failResponse => {});
    },
    saveAddRole() {
      if (this.form.role == "") {
        console.log("角色名称不能为空");
        this.$message.error("角色名称不能为空");
      } else {
        this.$axios
          .post(this.url + "/addRole", {
            id: this.form.id,
            role: this.form.role,
            role_describe: this.form.role_describe,
            addUser: this.form.addUser,
            state: this.form.state
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("角色添加成功");
              this.tableData.push(this.form);
              this.getData();
            } else {
              console.log(this.responseResult);
              this.$message.error("角色添加失败");
            }
          })
          .catch(failResponse => {});
      }
      this.addRoleVisible = false;
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post(this.url + "/editRole", {
          id: this.form.id,
          role: this.form.role,
          role_describe: this.form.role_describe,
          addUser: this.form.addUser,
          addDatetime: this.form.addDatetime,
          state: this.form.state
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("角色信息修改成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("角色信息修改失败");
          }
        })
        .catch(failResponse => {});
      this.editVisible = false;
    },
    // 确定冻结
    changeStateToFrozen() {
      this.$axios
        .post(this.url + "/changeStateToFrozen_Role", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`角色冻结成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("角色冻结失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToFrozenVisible = false;
      this.rest();
    },
    // 确定解冻
    changeStateToNormal() {
      this.$axios
        .post(this.url + "/changeStateToNormal_Role", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("角色解冻成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("角色解冻失败");
          }
        })
        .catch(failResponse => {});
      this.changeStateToNormalVisible = false;
      this.rest();
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/deleteRole", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`角色删除成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("角色删除失败");
          }
        })
        .catch(failResponse => {});
      this.tableData.splice(this.idx, 1);
      this.delVisible = false;
    },
    formatState: function(row, column, cellValue, index) {
      return row.state == 1 ? "已冻结" : row.sex == 0 ? "正常" : "正常";
    },
    removeHandle(event) {
    }
  },
  filters: {
    filters_rightItem: function(arg) {
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
.li-small {
  font-size: 12px;
}
/* 尝试设置背景颜色透明 */
el-collapse {
  background: rgba(255, 255, 255, 0);
  background-color: rgba(255, 255, 255, 0);
}
el-collapse-item {
  background: rgba(255, 255, 255, 0);
  background-color: rgba(255, 255, 255, 0);
}
</style>
