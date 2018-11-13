<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>道具申请</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）两种申请方式（为指定角色申请、为全服玩家申请）只能选择其中的一种；
                    <br/>
                    （2）如果需要发送钻石，请找策划把钻石包装成一个道具，之后通过该接口发送，发送的钻石不会提升玩家的vip等级；
                </div>
                
                <!-- <Divider /> -->
                <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="折叠" name="1">
                    <div class="form-box">
                    <el-form ref="form" :model="form" label-width="150px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择渠道">
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="el-form-item" label="选择服务器">
                            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器" >
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="标题">
                            <el-input style="width:215px"
                            placeholder="请输入标题"
                            v-model="form.releaseTitle"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item  label="说明（玩家看到）">
                            <el-input style="width:515px" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            placeholder="请输入说明"
                            v-model="form.releaseContent"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="需要发送的道具">
                            <el-select v-model="form.propId" @change="selectProp" placeholder="请选择道具">
                                <el-option
                                v-for="item in propOptions"
                                :key="item.id"
                                :label="item.propName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
                        </el-form-item>
                        <el-form-item label="已选择道具列表">

                            <el-table :data="propData" border class="table" ref="multipleTable" >

                                <el-table-column prop="propName" label="道具名称"  >
                                </el-table-column>
                                <el-table-column prop="propTag" label="道具ID"  >
                                </el-table-column>
                                <el-table-column prop="propCount" label="数量" >
                                </el-table-column>
                                <el-table-column prop="propDescribe" label="道具描述"  >
                                </el-table-column>


                                <el-table-column label="操作"  align="center" >
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-edit" @click="handleAddPropCount(scope.$index, scope.row)" >添加</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleReducePropCount(scope.$index, scope.row)" >减小</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleDelProp(scope.$index, scope.row)" >删除</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>

                        </el-form-item>
               
                        </el-form>

                    </div>

                <Divider />

                    <el-tabs type="border-card" @tab-click="handleClick" v-model="editableTabsValue">
                    <el-tab-pane label="为指定角色申请" name="1">
                        <el-form ref="form" :model="form" label-width="350px">

                        <el-form-item label="玩家账号">
                            <el-input style="width:515px"
                            placeholder="请输入玩家账号" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}" 
                            v-model="form.playerAccountList"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item label="玩家名称">
                            <el-input style="width:515px"
                            placeholder="请输入玩家名称" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.playerNameList"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色ID">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.playerIdList"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="玩家类型">
                            <el-select v-model="form.playerType" @change="selectPlayerType" placeholder="请选择玩家类型">
                                <el-option
                                v-for="item in playerTypeOptions"
                                :key="item.id"
                                :label="item.playerType"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    

                        <el-form-item label="申请人">
                            <el-input style="width:215px"
                            placeholder="请输入"
                            v-model="form.applyUser"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请说明">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.applyReason"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            
                                <el-button type="primary" icon="search" @click="addApply">申请</el-button>
                                <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
                    
                        </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="为全服玩家申请" name="2">
                        <el-form ref="form" :model="form" label-width="350px">
                        

                        <el-form-item label="申请人">
                            <el-input style="width:215px"
                            placeholder="请输入"
                            v-model="form.applyUser"
                            clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请说明">
                            <el-input style="width:515px"
                            placeholder="请输入" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.applyReason"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                                <el-button type="primary" icon="search" @click="addApply">申请</el-button>
                                <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
                        </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    </el-tabs>
                </el-collapse-item>
                </el-collapse>
            

            <div style="margin:15px;">
                      <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
                      <span class="grid-content bg-purple-light">平台：</span>
                            <el-select v-model="searchKey.platformId" @change="selectSearchKeyPlatform" placeholder="请选择渠道平台" style="width:150px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                      <span class="grid-content bg-purple-light">服务器：</span>
                            <el-select v-model="searchKey.serverId" @change="selectSearchKeyServer"  placeholder="请选择服务器" style="width:150px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in searchKeyServerOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                      <!-- <span class="grid-content bg-purple-light">：</span>
                      <el-input v-model="searchKey.rightName" placeholder="筛选权限名" class="handle-input " style="width:150px"></el-input> -->

                      <span class="grid-content bg-purple-light">内容：</span>
                      <el-input v-model="searchKey.releaseContent" placeholder="筛选内容" class="handle-input " style="width:150px"></el-input>

                      <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>

            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="platform" label="平台"  >
                </el-table-column>
                <!-- <el-table-column prop="serverList" label="服务器" >
                </el-table-column> -->
                <el-table-column prop="server" label="服务器" >
                </el-table-column>

                <el-table-column prop="releaseTitle"  label="标题" >
                </el-table-column>
                <el-table-column prop="releaseContent"  label="内容" width="200">
                </el-table-column>
                <el-table-column prop="propList" label="道具列表" width="200">
                    <template slot-scope="scope">
                      <p style=""  v-for="item in scope.row.propList" :key="item"
                                :label="item"
                                :value="item">{{item}}
                      </p>
                    </template>
                </el-table-column>
                <el-table-column prop="applyType"  label="申请类型" :formatter="formatApplyType">
                </el-table-column>
                 <el-table-column prop="playerAccountList"  label="玩家账号" >
                </el-table-column>
                <el-table-column prop="playerNameList"  label="玩家名称" >
                </el-table-column>
                <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter">
                </el-table-column>
                <!-- 0未审核1已通过2未通过 -->
                <el-table-column prop="sendState"  label="状态" :formatter="formatIsSend">
                </el-table-column>
                <el-table-column prop="userName"  label="编辑人" >
                </el-table-column>
                <el-table-column label="操作"  align="center" >
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="handleConfirm(scope.$index, scope.row)" >通过</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleNotConfirm(scope.$index, scope.row)" >不通过</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    
                    </template>
                </el-table-column>

            </el-table>

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
import Vue from 'vue';
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
export default {
  name: "AppleProp",
  data() {
    return {
        activeNames: ["1"],
        editableTabsValue: '1',
        multipleSelection:[],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      platformOptions: [
        {
          id: "1",
          platform: "渠道1"
        },
        {
          id: "2",
          platform: "渠道2"
        }
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [
        // {
        //   serverId: "1",
        //   serverName: "服务器1"
        // }
      ],
      serverValue: "",
      serverLabel: "",
      form: {
        platformId:"",
        serverId:"",
        propId:"",
        prop:"",
        releaseTitle:"",
        releaseContent:"",
        applyType:"",
        propList:"",
        playerNameList:"",
        playerAccountList:"",
        playerIdList:"",
        applyUser:"",
        applyReason:"",
      },
    searchKey: {
        platformId:"",
        serverId:"",
        propId:"",
        prop:"",
        releaseTitle:"",
        releaseContent:"",
        applyType:"",
        propList:"",
        playerNameList:"",
        playerAccountList:"",
        playerIdList:"",
        applyUser:"",
        applyReason:"",
      },
      id: 0,
      serverIp: "",
      checkVisible: false,
      playerTypeOptions:[],
      propOptions:[],
      propData:[],
      tableData:[],
      searchKeyServerOptions:[],
      delAllVisible:false,
    };
  },
  components: {
    "t-dialog": dialog
  },
  computed: {
    propData() {
      return this.propData;
    },
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

    this.getData();
    this.getApplyProp();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getPlatformList(this.id);
      }.bind(this)
    );
  },
  methods: {
        handleClick(tab, event){
        console.log(tab);
        console.log(tab.name);
        },
      handleDelProp(index,row){
          this.propData.splice(index,1);
      },
      handleAddPropCount(index,row){
            var data = this.propData[index];
            var count = data.propCount+1;
            data.propCount = count;
            this.$set(this.propData, index, data);
      },
      handleReducePropCount(index,row){
          if(this.propData[index].propCount>1){
            var data = this.propData[index];
            var count = data.propCount-1;
            data.propCount = count;
            this.$set(this.propData, index, data);
          }
      },
      selectProp(){
          console.log(this.form.prop);
      },
    addPropToList(){
        //找到相同项的道具数量加一
        for(var i = 0;i<this.propData.length;i++){
            var item = this.propData[i];
            if(item.id==this.form.propId){
                var data = this.propData[i];
                var count = data.propCount+1;
                data.propCount = count;
                //console.log(this.propData[i].propCount);
                this.$set(this.propData, i, data);
                //console.log(this.propData[i].propCount);
                return;
            }
        }
        //否则添加新的道具 
        for(var j = 0; j<this.propOptions.length;j++){
            var item= this.propOptions[j];
            if(item.id==this.form.propId){
                this.form.prop = item;
                break;
            }

        }
        console.log(this.form.prop);
        this.form.prop.propCount = 1;
        this.propData.push(this.form.prop);
    },
    getApplyProp(){
        this.$axios.post("/getApplyProp", {
                platformId:this.searchKey.platformId,
                serverId:this.searchKey.serverId,
                pageNo: 1,
                pageSize: 10,
                isPage:"isPage",

        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("申请道具列表获取成功");
                this.tableData = successResponse.data.data.list;
                this.mapDate();
                
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("申请道具列表获取失败");
                return false;
            }
        })
    },
    mapDate(){
        var list = [];
        
        for(var  i = 0;i<this.tableData.length;i++){
            var item = this.tableData[i];
            //this.getPropList(item.platformId);
            var propList = item.propList.split(',');
            for(var j = 0;j<propList.length;j++){
                var propInfo = propList[j].split('-');
                // for(var k = 0;k<this.propOptions.length;k++){
                //     console.log(this.propOptions[k].id+"|"+propInfo[0]);
                //     if(this.propOptions[k].id==propInfo[0]){
                //         console.log(this.propOptions[k].propName);
                //         propInfo.push(this.propOptions[k].propName);
                //     }
                // }
                list.push(propInfo)
            }
            this.tableData[i].propList = list;
            list=[];
        }
    },
    getPlayerTypeList() {
        this.$axios.post("/getPlayerTypeList", {
        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("玩家类型列表获取成功");
                this.playerTypeOptions = successResponse.data.data.list;
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("玩家类型列表获取失败");
                return false;
            }
        })
    },
    handleDelAll(){
        this.delAllVisible = true;
    },
    getPropList(platformId) {
        this.$axios.post("/getPropUplaod", {
            pageNo: 1,
            pageSize: 10,
            isPage:"",
            platformId:platformId,
            strPlatform:platformId
        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("道具列表获取成功");
                //this.$message.success("道具列表获取成功");
                this.propOptions = successResponse.data.data.list;
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("道具列表获取失败");
                return false;
            }
        })
    },
    getPlatformList(userId) {
      this.$axios
        .post("/getPlatformListForUserIdAndGameId", {
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
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post("/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("渠道服务器列表获取成功");
            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("渠道服务器列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post("/getServerListForPlatform", {
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
      this.getPropList(this.form.platformId);
    },
        selectSearchKeyPlatform(){
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getApplyProp();
    },
    selectSearchKeyServer(){
            this.getApplyProp();
    },
    search(){
        this.getApplyProp();
        //var a = "[{'id':1,'propName':'道具1','propTag':'prop1','propDescribe':'描述1','platformId':1,'platform':'平台1','propCount':1}]";
        //var a = '[{"id":1,"propName":"道具1","propTag":"prop1","propDescribe":"描述1","platformId":1,"platform":"平台1","propCount":1}]';
        //var a = '([{\"id\":1,\"propName\":\"道具1\",\"propTag\":\"prop1\",\"propDescribe\":\"描述1\r\",\"platformId\":1,\"platform\":\"平台1\",\"propCount\":1}])';
        //a=a.replace('=',':')
        //console.log(eval(a));
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
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            console.log("当前serverIp:" + this.serverIp);
            this.$message.success("当前serverIp:" + this.serverIp);
            return;
          }
        }
      }
    },
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.id = userData.id;
      this.getPlatformList(this.id);
      this.getPlayerTypeList();
    },
    addApply(){
        var data = {};
        if(this.form.platformId==""){
            this.$message("请选择正确的平台");
            return;
        }
        if(this.form.serverId==""){
            this.$message("请选择正确的服务器");
            return;
        }
        if(this.form.releaseTitle==""){
            this.$message("标题不能为空");
            return;
        }
        if(this.form.releaseContent==""){
            this.$message("内容不能为空");
            return;
        }
        var list = "";
            for(var i = 0;i<this.propData.length;i++){
                if((i+1)>=this.propData.length){
                    list+=this.propData[i].id+"-"+this.propData[i].propCount;
                    break;
                }
                list+=this.propData[i].id+"-"+this.propData[i].propCount+","
            }
        if(this.editableTabsValue=="1"){
            console.log("1");
            
            data = {
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                releaseTitle:this.form.releaseTitle,
                releaseContent:this.form.releaseContent,
                applyType:1,
                //
                propList:list,

                playerNameList:this.form.playerNameList,
                playerAccountList:this.form.playerAccountList,
                playerIdList:this.form.playerIdList,

                playerType:this.form.playerType,

                applyUser:this.form.applyUser,

                applyReason:this.form.applyReason,

                addUser:this.id
            };

        }
        if(this.editableTabsValue=="2"){
                console.log("2");
            data = {
                platformId:this.form.platformId,
                serverId:this.form.serverId,
                releaseTitle:this.form.releaseTitle,
                releaseContent:this.form.releaseContent,
                applyType:2,

                propList:list,

                applyUser:this.form.applyUser,

                applyReason:this.form.applyReason,

                addUser:this.id
            };

        }
        this.$axios
        .post("/addApplyProp", data)
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp(); 
               
        } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
            return false;
        }
        })
        .catch(failResponse => {});
        console.log(this.form);
        console.log(data);
        console.log(JSON.stringify(data));
        
    },
    handleConfirm(index,row){
        this.$axios
        .post("/confirmApplyProp", {
            id:this.tableData[index].id,
            addUser:this.id
        })
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp(); 
               
        } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
            return false;
        }
        })
    },
    saveDelAll(){
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id + ',';
                }
                console.log(str);
                //批量删除处理
                this.$axios.post('/deleteAllApplyProp',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("道具申请批量删除完成");
                        this.multipleSelection = []; 
                        this.getApplyProp(); 

                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("道具申请批量删除失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
                 
                this.delAllVisible = false;
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
        console.log(this.multipleSelection);
    },
    handleNotConfirm(index,row){
        this.$axios
        .post("/notConfirmApplyProp", {
            id:this.tableData[index].id,
            addUser:this.id
        })
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp(); 
               
        } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
            return false;
        }
        })
    },
    handleDelete(index,row){
        this.$axios
        .post("/deleteApplyProp", {
            id:this.tableData[index].id,
            addUser:this.id
        })
        .then(successResponse => {
        this.responseResult = "\n" + JSON.stringify(successResponse.data);
        if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp(); 
               
        } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
            return false;
        }
        })
    },
    resetForm(){
        this.form={
        platformId:"",
        serverId:"",
        propId:"",
        prop:"",
        releaseTitle:"",
        releaseContent:"",
        applyType:"",
        propList:"",
        playerNameList:"",
        playerAccountList:"",
        playerIdList:"",
        applyUser:"",
        applyReason:"",
      }
    },
    testDialog() {
      this.dialogVisible = true;
    },
    formatIsSend(row, column, cellValue, index){
        return row.sendState == 0 ? "未审核" : row.sendState == 1 ? "已通过" : "未通过";
    },
    formatApplyType(row, column, cellValue, index){
        return row.applyType == 1 ? "角色申请" : "全服申请";
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
