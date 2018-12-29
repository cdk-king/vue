<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>服务器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <div class="custom-tree-container">
  <div class="block">
    <p>树形结构列表</p>
    <el-tree  class="el-tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </div>
</div>

<el-dialog title="具体信息" :visible.sync="showVisible">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{form.gameName}}/{{form.platform}}</span>
                <el-button style="float: right; padding: 3px 0" type="text"></el-button>
              </div>
                  <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="服务器名称">
                    <div v-bind:value="form.server" class="text item">{{form.server}}</div>
                </el-form-item>
                <el-form-item label="服务器IP">
                    <div class="text item">{{form.serverIp}}</div>
                </el-form-item>
                <el-form-item label="服务器端口">
                    <div class="text item">{{form.serverPort}}</div>
                </el-form-item>
                <el-form-item label="服务器描述">
                    <div class="text item">{{form.server_describe}}</div>
                </el-form-item>
                <el-form-item label="所属游戏">
                    <div class="text item">{{form.gameName}}</div>
                </el-form-item>
                <el-form-item label="所属渠道">
                    <div class="text item">{{form.platform}}</div>
                </el-form-item>
                <el-form-item label="状态">
                    <div class="text item" >{{form.state | filters1}}</div>
                </el-form-item>
                <el-form-item label="添加人">
                     <div class="text item">{{form.addUser}}</div>
                </el-form-item>
            </el-form>


            </el-card>
  <div slot="footer" class="dialog-footer">
    <el-button @click="showVisible = false">取 消</el-button>
    <el-button type="primary" @click="showVisible = false">确 定</el-button>
  </div>
</el-dialog>


        <!-- 编辑弹出框 -->
        <el-dialog title="编辑服务器" :modal="false"  :close-on-click-modal="false" :visible.sync="editVisible" width="30%">
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
                    <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择角色">
                        <el-option
                        v-for="item in platformList"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                    </el-select>
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


        <!-- 添加弹出框 -->
        <el-dialog title="添加服务器" :modal="false"  :close-on-click-modal="false" :visible.sync="addServerVisible" width="30%">
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
                        :value="item.platformId">
                        </el-option>
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

        <!-- 删除提示框 -->
        <el-dialog title="删除提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
          </div>
     </div>

</template>

<script>
let id = 1000;
import setLocalThisUrl from "../../code/setLocalThisUrl";
export default {
  data() {
    var data2 = [
      {
        id: 1,
        label: "一级 1",
        children: [
          {
            id: 4,
            label: "二级 1-1",
            children: [
              {
                id: 9,
                label: "三级 1-1-1"
              },
              {
                id: 10,
                label: "三级 1-1-2"
              }
            ]
          }
        ]
      }
    ];
    return {
      TreeList: [],
      treeData: JSON.parse(JSON.stringify(data2)),
      showVisible: false,
      editVisible: false,
      form: {
        id: "",
        server: "",
        gameId: "",
        platformId: "",
        serverIP: "",
        serverPort:"",
        server_describe: "",
        parentId: "",
        sort: "",
        addUser: "",
        addDatetime: "",
        state: "",
        gameName: "",
        role: "",
        platform: "",
      },
      tableData: [],
      platformList: [],
      addServerVisible:false,
      delVisible: false,
      id:"",
      url:"http://localhost:8011",
    };
  },
  created() {
    setLocalThisUrl(this);
    this.getData();
  },
  methods: {
    getPlatformList() {
      this.$axios
        .post(this.url+"/getAllPlatformList", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("渠道列表获取成功");
            this.platformList = successResponse.data.data;
          } else {
            console.log(this.responseResult);
            console.log("渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getData() {
      this.$axios
        .post(this.url+"/getServerTree", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("服务器树状结构获取成功");
            this.TreeList = successResponse.data.data;
            this.MapData(this.TreeList);
          } else {
            console.log(this.responseResult);
            console.log("服务器树状结构获取失败");
          }
        })
        .catch(failResponse => {});

      this.$axios
        .post(this.url+"/getAllServer", {
          pageNo: 1,
          pageSize: 10,
          isPage: "",
          id: "",
          server: "",
          serverId: "",
          gameId: "",
          platformId: "",
          platform: "",
          serverIp: "",
          serverPort:"",
          server_describe: "",
          sort: "",
          addUser: "",
          addDatetime: "",
          state: ""
        }).then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("所有服务器获取成功");
            this.tableData = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("所有服务器获取失败");
          }
        })
    },
    //递归生成树形结构
    MapData(TreeList) {
      var tags = ["gameId", "platformId", "serverId"];
      var labels = ["gameName", "platform", "server"];
      function isHaving(id, tag, list) {
        for (var i in list) {
          if (id == list[i]["id"]) {
            return i;
          }
        }
        return false;
      }
      var k = 0;
      var router = [];
      for (var i = 0; i < TreeList.length; i++) {
        var item = TreeList[i];
        getChildren(router, item, k);
      }
      function getChildren(child, item, k) {
        if (k >= 2) {
          if (isHaving(item[tags[k]], tags[k], child)) {
          } else {
            var map = {};
            map["id"] = item[tags[k]];
            map["label"] = item[labels[k]];
            map["tag"] = labels[k];
            child.push(map);
          }
        } else {
          if (isHaving(item[tags[k]], tags[k], child)) {
            var index = isHaving(item[tags[k]], tags[k], child);
            getChildren(child[index]["children"], item, k + 1);
          } else {
            var map = {};
            map["id"] = item[tags[k]];
            map["label"] = item[labels[k]];
            map["tag"] = labels[k];
            map["children"] = [];

            getChildren(map["children"], item, k + 1);
            child.push(map);
          }
        }
      }
      this.treeData = router;
      var ob = {};
      ob["list"] = router;
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post(this.url+"/editServer", {
          id: this.form.id,
          server: this.form.server,
          serverId: this.form.serverId,
          serverIp: this.form.serverIp,
          serverPort:this.form.serverPort,
          server_describe: this.form.server_describe,
          sort: this.form.sort,
          addUser: this.form.addUser,
          addDatetime: this.form.addDatetime,
          state: this.form.state,
          gameId: "",
          platformId: this.form.platformId
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
    },
    saveAddServer(){
    if(this.form.server==""){
        console.log("服务器名称不能为空");
        this.$message.error("服务器名称不能为空");
    }else if(this.form.platformId==""){
        console.log("所属渠道不能为空");
        this.$message.error("所属渠道不能为空");
    }else{

        this.$axios.post(this.url+'/addServer',{

            id: this.form.id,
            server:this.form.server,
            serverId:this.form.serverId,
            serverIp:this.form.serverIp,
            serverPort:this.form.serverPort,
            server_describe: this.form.server_describe,
            sort:this.form.sort,
            addUser: this.form.addUser,
            state:this.form.state,
            gameId:"",
            platformId:this.form.platformId
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                this.$message.success("服务器添加成功");
                this.tableData.push(this.form);
                this.getData();
            }else{
                console.log(this.responseResult);
                this.$message.error("服务器添加失败");
            }
        })
        .catch(failResponse => {})
        this.addServerVisible = false; 
    }               

    },
    // 确定删除
    deleteRow(){

        this.$axios.post(this.url+'/deleteServer',{
                id: this.id, 
            })
            .then(successResponse =>{
                this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                if(successResponse.data.code === 200){
                    this.$message.success(`服务器删除成功`);
                    //必须异步处理
                    this.getData();
                }else{
                    console.log(this.responseResult);
                    this.$message.error('服务器删除失败');
                }
            })
            .catch(failResponse => {}) 
        this.delVisible = false; 
    },
    append(node,data) {
        this.getPlatformList();
         const parent = node.parent;
         this.form = {
              id:'',
              server:'',
              serverId:'',
              serverTag:'',
              serverIp:'',
              serverPort:'',
              server_describe: '',
              serverParentId:'',
              serverSort:'',
              addUser: '',
              addDatetime: '',
              state:'',
              platformId:''
          }
        
        if(parent.data.tag=='platform'){
          const platformId = parent.data.id;
          this.form.platformId = platformId
        }
        this.addServerVisible = true;
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      const id = data.id;
      this.delVisible = true;
      this.id = id;
    },

    watch(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      const id = data.id;
      const tag = data.tag;
      this.showVisible = true;
      const item = this.tableData[0];
      if(tag=='server'){
        for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]["serverId"] == id) {
          const item = this.tableData[i];
          this.form = {
            id: item.id,
            server: item.server,
            serverId: item.serverId,
            serverIp: item.serverIp,
            serverPort:item.serverPort,
            server_describe: item.server_describe,
            sort: item.sort,
            addUser: item.addUser,
            addDatetime: item.addDatetime,
            state: item.state,
            gameId: item.gameId,
            roleId: item.roleId,
            platformId: item.platformId,
            platform: item.platform,
            gameName: item.gameName
          };
          break;
          }
          } 
      }else{
        this.form = {
            id: "",
            server: "",
            serverId: "",
            serverIp: "",
            serverPort:"",
            server_describe: "",
            sort: "",
            addUser: "",
            addDatetime: "",
            state: "",
            gameId: "",
            roleId: "",
            platformId: "",
            platform: "",
            gameName: ""
          };
      }
      

      this.showVisible = true;
    },
    edit(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      const id = data.id;
      const tag = data.tag;
      const item = this.tableData[0];
      if(tag=="server"){
        for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]["serverId"] == id) {
          const item = this.tableData[i];
          this.form = {
            id: item.id,
            server: item.server,
            serverId: item.serverId,
            serverIp: item.serverIp,
            serverPort:item.serverPort,
            server_describe: item.server_describe,
            sort: item.sort,
            addUser: item.addUser,
            addDatetime: item.addDatetime,
            state: item.state,
            gameId: item.gameId,
            roleId: item.roleId,
            platformId: item.platformId,
            platform: item.platform,
            gameName: item.gameName
          };
          break;
        }
        }
      }else{
        this.form = {
            id: "",
            server: "",
            serverId: "",
            serverIp: "",
            serverPort:"",
            server_describe: "",
            sort: "",
            addUser: "",
            addDatetime: "",
            state: "",
            gameId: "",
            roleId: "",
            platformId: "",
            platform: "",
            gameName: ""
          };
      }
      
      this.getPlatformList();
      this.editVisible = true;
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span style="font-size:16px">{node.label}</span>
          <span>
            <el-button
              style="position: absolute;right:350px;font-size:14px;vertical-align: middle;"
              size="mini"
              type="text"
              on-click={() => this.watch(node, data)}
              icon="el-icon-edit"
            >
              查看
            </el-button>
            <el-button
              style="position: absolute;right:250px;font-size:14px;vertical-align: middle;"
              size="mini"
              type="text"
              on-click={() => this.edit(node, data)}
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button
              style="position: absolute;right:150px;font-size:14px;vertical-align: middle;"
              size="mini"
              type="text"
              on-click={() => this.append(node,data)}
              icon="el-icon-circle-plus-outline"
            >
              添加
            </el-button>
            <el-button
              class="red"
              style="position: absolute;right:50px;font-size:14px;vertical-align: middle;"
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    formatState: function(row, column, cellValue, index) {
      return row.state == 1 ? "已冻结" : row.sex == 0 ? "正常" : "正常";
    }
  },
  filters: {
    filters1: function(arg) {
      if (arg == 1) {
        return "已冻结";
      } else {
        return "正常";
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  padding-right: 50px;
}
</style>