<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-document"></i>区服管理</el-breadcrumb-item>
        <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>一个渠道对应一个且唯一的平台，在添加和修改渠道的时候必须指定对应的平台。
        <br>
      </div>

      <Divider/>
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          class="handle-select mr10"
          v-model="searchKey.platformId"
          filterable
          style="width:150px"
          placeholder="筛选平台"
        >
          <el-option
            v-for="item in platformList"
            :key="item.platformId"
            :label="item.platform"
            :value="item.platformId"
          ></el-option>
        </el-select>

        <span class="grid-content bg-purple-light">渠道名：</span>
        <el-input
          v-model="searchKey.channelName"
          placeholder="筛选渠道名"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <span class="grid-content bg-purple-light">渠道标识：</span>
        <el-input
          v-model="searchKey.channelTag"
          placeholder="筛选渠道标识"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAddchannel">添加</el-button>
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
        <el-table-column prop="channelId" label="渠道ID" width="80"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称" width="160"></el-table-column>
        <el-table-column prop="channelTag" label="渠道标识"></el-table-column>
        <el-table-column prop="platform" label="所属平台" width="120"></el-table-column>
        <el-table-column prop="channel_describe" label="描述"></el-table-column>
        <el-table-column prop="state" label="状态" width="100" :formatter="formatState"></el-table-column>
        <el-table-column
          prop="addDatetime"
          label="添加时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column prop="addUser" label="添加人"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
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
      title="添加渠道"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addchannelVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="渠道名称">
          <el-input v-model="form.channel" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道ID">
          <el-input v-model="form.channelId" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道标识">
          <el-input v-model="form.channelTag" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道描述">
          <el-input v-model="form.channel_describe" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="所属平台">
          <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择平台">
            <el-option
              v-for="item in platformList"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addchannelVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddchannel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑渠道"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="渠道名称">
          <el-input v-model="form.channel" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道ID">
          <el-input v-model="form.channelId" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道标识">
          <el-input v-model="form.channelTag" style="width:90%"></el-input>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
        <el-form-item label="渠道描述">
          <el-input v-model="form.channel_describe" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="所属平台">
          <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择平台">
            <el-option
              v-for="item in platformList"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
          <span class="grid-content bg-purple-light" style="margin:10px;color:red">*</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑冻结提示框 -->
    <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
      <div class="del-dialog-cnt">冻结后将停止渠道使用，是否确定冻结？</div>
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
import bus from '../common/bus';
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "channelTable",
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
      addchannelVisible: false,
      handleVisible: true,
      delAllVisible: false,
      total: 0,
      form: {
        id: "",
        channelId: "",
        channel: "",
        platformId: "",
        roleId: "",
        channelTag: "",
        channel_describe: "",
        parentId: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        platform: "",
        role: ""
      },
      searchKey: {
        id: "",
        channelId: "",
        channel: "",
        channelTag: "",
        channel_describe: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        platform: ""
      },
      idx: -1,
      responseResult: [],
      id: "",
      platformList: [],
      selectGame: "",
      selectRole: ""
    };
  },
  created() {
    setLocalThisUrl(this);
    this.getPlatformList();
    this.getData();
    this.right();
    bus.$on('changeGameId',function(obj){
    console.log(obj.message);
    this.getPlatformList();
    this.getData();
    this.right();
    }.bind(this)) 
  },
  beforeDestroy() {
    bus.$off("changeGameId");
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
        .catch(failResponse => {
            this.platformList = [];
            console.log("平台列表获取失败");
        });
    },
    getRoleList() {
      this.$axios
        .post(this.url + "/getAllRoleList", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("角色列表获取成功");
            this.roleList = successResponse.data.data;
          } else {
            this.roleList = [];
            console.log(this.responseResult);
            console.log("角色列表获取失败");
          }
        })
        .catch(failResponse => {
            this.roleList = [];
            console.log("角色列表获取失败");
        });
    },
    right() {
      const right = localStorage.getItem("rightTags");
      const username = localStorage.getItem("ms_username");
      if (right.indexOf("channel_management_Handle") == -1) {
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
    getData() {
      this.$axios
        .post(this.url + "/api/channel/getChannelTable", {
          gameId:this.$gameId,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          channelId: "",
          channelName: this.searchKey.channel,
          platformId: this.searchKey.platformId,
          channelTag: this.searchKey.channelTag,
          channel_describe: this.searchKey.channel_describe,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            if(successResponse.data.data.list.length==0){
               this.tableData = [];
               this.total =0;
               
            }else{
              this.tableData = successResponse.data.data.list;
              this.total = successResponse.data.data.total;
            }
          } else {
            this.tableData =[];
            this.total = 0;
            this.$message.success("渠道列表为空");
          }
        }).catch(failResponse => {
            this.tableData =[];
            this.total = 0;
            //this.$message.error("渠道列表获取失败");
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
      this.getRoleList();
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id: item.id,
        channelId: item.channelId,
        channel: item.channelName,
        channelTag: item.channelTag,
        channel_describe: item.channel_describe,
        sort: item.sort,
        addUser: item.addUser,
        addDatetime: item.addDatetime,
        state: item.state,
        platformId: item.platformId,
        roleId: item.roleId
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
      str = str.substring(0,str.length-1);
      //批量删除处理
      this.$axios
        .post(this.url + "/api/channel/deleteChannel", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("渠道批量删除完成");
            this.multipleSelection = [];
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("渠道批量删除失败");
          }
        })
        .catch(failResponse => {
          this.$message.error("渠道批量删除失败");
        });
      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddchannel() {
      this.getPlatformList();
      this.getRoleList();
      this.addchannelVisible = true;
      this.form = {
        id: "",
        channelId: "",
        channelName: "",
        channelTag: "",
        channel_describe: "",
        channelParentId: "",
        channelSort: "",
        addUser: "",
        addDatetime: "",
        state: ""
      };
      this.selectGame = "";
      this.selectRole = "";
    },
    checkChannelId(channelId,platformId,id){
      for(var i = 0;i<this.tableData.length;i++){
          if(id!=null){
              if(channelId==this.tableData[i].channelId && platformId == this.tableData[i].platformId && this.tableData[i].id!=id){
                return false;
              }
          }else{
              if(channelId==this.tableData[i].channelId && platformId == this.tableData[i].platformId){
                return false;
              }
          }
          
      }
      return true;
    },
    saveAddchannel() {
      if (this.form.channel == "") {
        console.log("渠道名称不能为空");
        this.$message.error("渠道名称不能为空");
        return;
      } 
      else if (this.form.channelId == "") {
        console.log("渠道ID不能为空");
        this.$message.error("渠道ID不能为空");
        return;
      }else if(!parseInt(this.form.channelId)){
          console.log("渠道ID格式不正确");
          this.$message.error("渠道ID格式不正确");
          return;
      } 
      else if (this.form.channelTag == "") {
        console.log("渠道标识不能为空");
        this.$message.error("渠道标识不能为空");
        return;
      }
      else if (this.form.platformId == "") {
        console.log("所属平台不能为空");
        this.$message.error("所属平台不能为空");
        return;
      } else {
        if(!this.checkChannelId(this.form.channelId,this.form.platformId)){
            console.log("渠道Id重复");
            this.$message.error("渠道Id重复");
            return;
        }
        this.$axios
          .post(this.url + "/api/channel/addChannel", {
            channelId: this.form.channelId,
            channelName: this.form.channel,
            channelTag: this.form.channelTag,
            channel_describe: this.form.channel_describe,
            addUser: JSON.parse(localStorage.getItem("userData")).name,
            platformId: this.form.platformId,
            gameId: this.$gameId
          })
          .then(successResponse => {
            this.responseResult = "\n" + JSON.stringify(successResponse.data);
            if (successResponse.data.code === 200) {
              this.$message.success("渠道添加成功");
              this.tableData.push(this.form);
              this.getData();
              bus.$emit('changeChannel', {});
            } else {
              console.log(this.responseResult);
              this.$message.error("渠道添加失败");
            }
          })
          .catch(failResponse => {
            this.$message.error("渠道添加失败");
          });
        this.addchannelVisible = false;
      }
    },
    // 保存编辑
    saveEdit() {
      if (this.form.channel == "") {
        console.log("渠道名称不能为空");
        this.$message.error("渠道名称不能为空");
        return;
      } 
      else if (this.form.channelId == "") {
        console.log("渠道ID不能为空");
        this.$message.error("渠道ID不能为空");
        return;
      } 
      else if(!parseInt(this.form.channelId)){
          console.log("渠道ID格式不正确");
          this.$message.error("渠道ID格式不正确");
          return;
      } 
      else if (this.form.channelTag == "") {
        console.log("渠道标识不能为空");
        this.$message.error("渠道标识不能为空");
        return;
      }
      else if (this.form.platformId == "") {
        console.log("所属平台不能为空");
        this.$message.error("所属平台不能为空");
        return;
      } else {
          if(!this.checkChannelId(this.form.channelId,this.form.platformId,this.form.id)){
              console.log("渠道Id重复");
              this.$message.error("渠道Id重复");
              return;
          }
      this.$axios
        .post(this.url + "/api/channel/editChannel", {
          id: this.form.id,
          channelId: this.form.channelId,
          channelName: this.form.channel,
          channelTag: this.form.channelTag,
          channel_describe: this.form.channel_describe,
          addUser: JSON.parse(localStorage.getItem("userData")).name,
          platformId: this.form.platformId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("渠道信息修改成功");
            this.getData();
            bus.$emit('changeChannel', {});
          } else {
            console.log(this.responseResult);
            this.$message.error("渠道信息修改失败");
          }
        })
        .catch(failResponse => {
          this.$message.error("渠道信息修改失败");
        });
      this.editVisible = false;
      }
    },
    // 确定冻结
    changeStateToFrozen() {
      this.$axios
        .post(this.url + "/changeStateToFrozen_channel", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`渠道冻结成功`);
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("渠道冻结失败");
          }
        })
        .catch(failResponse => {
          this.$message.error("渠道冻结失败");
        });
      this.changeStateToFrozenVisible = false;
      this.rest();
    },
    // 确定解冻
    changeStateToNormal() {
      this.$axios
        .post(this.url + "/changeStateToNormal_channel", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("渠道解冻成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            this.$message.error("渠道解冻失败");
          }
        })
        .catch(failResponse => {
          this.$message.error("渠道解冻失败");
        });
      this.changeStateToNormalVisible = false;
      this.rest();
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.url + "/api/channel/deleteChannel", {
          id: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success(`渠道删除成功`);
            this.getData();
            bus.$emit('changeChannel', {});
          } else {
            console.log(this.responseResult);
            this.$message.error("渠道删除失败");
          }
        })
        .catch(failResponse => {
          this.$message.error("渠道删除失败");
        });

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
