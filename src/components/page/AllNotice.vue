<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>全服公告</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <!-- <br/> -->
                </div>
                
                <!-- <Divider /> -->
                <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="折叠" name="1">
                    
                    <!-- <Divider /> -->
                </el-collapse-item>
                </el-collapse>
                <!-- <Divider /> -->
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
                            <el-select v-model="searchKey.serverName" @change="selectSearchKeyServer"  placeholder="请选择服务器" style="width:150px">
                                <el-option key="1" label="全部" value="0"></el-option>
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
                      <el-input v-model="searchKey.noticeContent" placeholder="筛选内容" class="handle-input " style="width:150px"></el-input>

                      <el-button type="primary" icon="search" @click="search">搜索</el-button>
                      <el-button type="primary" icon="search" @click="handleAddPlatformNotice">添加</el-button>
                </div>
                            
                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="platform" label="平台"  >
                </el-table-column>
                <!-- <el-table-column prop="serverList" label="服务器" >
                </el-table-column> -->
                <el-table-column prop="serverList" label="服务器" >
                  <template slot-scope="scope">
                      <p style=""  v-for="item in scope.row.serverList.substring(1,scope.row.serverList.length-1).split(',') " :key="item"
                                :label="item.substring(1,item.length-1)"
                                :value="item">{{item.substring(1,item.length-1)}}
                      </p>
                  </template>
                </el-table-column>

                <el-table-column prop="noticeTitle"  label="标题" >
                </el-table-column>
                <el-table-column prop="noticeContent"  label="内容" width="400">
                </el-table-column>
                <el-table-column prop="startDatetime" label="开始时间" :formatter="formatter" >
                </el-table-column>
                <el-table-column prop="endDatetime" label="结束时间" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="sendState"  label="状态" :formatter="formatIsSend">
                </el-table-column>
                <el-table-column prop="userName"  label="编辑人" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleSend(scope.$index, scope.row)" v-if="scope.row.sendState!=1">发送</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
               </div>     
            <!-- 添加框 -->
            <el-dialog title="添加" :visible.sync="addPlatformNoticeVisible" width="900px" center :modal="false"  :close-on-click-modal="false">
                <div class="form-box">
                    <el-form ref="form" :model="form" label-width="250px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
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
                            <span class="grid-content bg-purple-light" style="margin:16px;color:#888888" v-show="!checkVisible">请先选择服务器</span>
                                    <!-- 全选 -->
                                   <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                    <div style="margin: 15px 0;"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group> -->

                            <el-checkbox-group v-model="form.serverList" @change="handleCheckedServer" v-show="checkVisible">
                                <el-checkbox v-for="item in serverOptions" :label="item.serverName" :key="item.serverId"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="标题">
                           <el-input style="width:180px"
                            placeholder="标题"
                            v-model="form.noticeTitle"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
                            
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input style="width:515px"
                            placeholder="请输入发送内容" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.noticeContent"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                       <el-form-item label="开始时间">
                                <el-date-picker style="width:215px" 
                                v-model="form.startDatetime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                                <el-date-picker style="width:215px"  
                                v-model="form.endDatetime"
                                type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>
                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                    
                        </el-form-item></el-form>
                    </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addPlatformNoticeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addPlatformNoticeVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        <!-- 编辑框 -->
        <el-dialog title="编辑" :visible.sync="editPlatformNoticeVisible" width="900px" center :modal="false"  :close-on-click-modal="false">
            <div class="form-box">
                    <el-form ref="form" :model="form" label-width="250px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
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
                            <span class="grid-content bg-purple-light" style="margin:16px;color:#888888" v-show="!checkVisible">请先选择服务器</span>
                                    <!-- 全选 -->
                                   <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                    <div style="margin: 15px 0;"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group> -->

                            <el-checkbox-group v-model="form.serverList" @change="handleCheckedServer" v-show="checkVisible">
                                <el-checkbox v-for="item in serverOptions" :label="item.serverName" :key="item.serverId"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="标题">
                           <el-input style="width:180px"
                            placeholder="标题"
                            v-model="form.noticeTitle"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
                            
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input style="width:515px"
                            placeholder="请输入发送内容" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.noticeContent"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                       <el-form-item label="开始时间">
                                <el-date-picker style="width:215px" 
                                v-model="form.startDatetime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                                <el-date-picker style="width:215px"  
                                v-model="form.endDatetime"
                                type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>
                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                    
                        </el-form-item></el-form>
                    </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editPlatformNoticeVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPlatformNoticeVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁言提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeProhibitSpeakToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeProhibitSpeakToNormal = false">取 消</el-button>
                <el-button type="primary" @click="ProhibitSpeakToNormal">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToBan = false">取 消</el-button>
                <el-button type="primary" @click="ToBan">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁封提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeBanToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeBanToNormal = false">取 消</el-button>
                <el-button type="primary" @click="BanToNormal">确 定</el-button>
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
export default {
  name: "PlayerInfo",
  data() {
    return {
      activeNames: ["1"],
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      handleVisible: true,
      checkVisible: false,
      addPlatformNoticeVisible:false,
      editPlatformNoticeVisible:false,
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
      platformValue: "",
      platformLabel: "",
      serverOptions: [
        // {
        //   serverId: "4",
        //   serverName: "服务器1"
        // },
        // {
        //   serverId: "5",
        //   serverName: "服务器2"
        // },

      ],
      searchKeyServerOptions:[],
      serverValue: "",
      serverList: [],
      serverLabel: "",
      form: {},
      id: 0,
      userId: 0,
      idx: 0,
      serverIp: "",
      tableData: [],
      sendTypeList: [],
      noticeTypeList: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      searchKey: {
        timeInterval:"",
        cycleTime:"",
        sendType:"",
        noticeType:"",
        noticeContent:""
      },
      delAllVisible:false,
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
  methods: {
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
            return false;
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
            console.log("服务器列表获取成功");

            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
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

      this.getPlatformNotice();
    },
    getPlatformNotice() {
      this.$axios
        .post("/getPlatformNotice", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          noticeContent:this.searchKey.noticeContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          //searchKey: JSON.stringify(this.searchKey)
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("公告列表获取成功");
            this.$message.success("公告列表获取成功");
            this.tableData = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("公告列表获取失败");
            this.$message.error("公告列表获取失败");
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
      this.getPlatformNotice();
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
    handleAddPlatformNotice(){
        this.form = [];
        this.addPlatformNoticeVisible = true;
    },
    submit() {
        if(this.form.noticeTitle==""){
              this.$message("请输入正确的公告标题");
              return;
        }
        if(this.form.noticeContent==""){
              this.$message("请输入正确的公告内容");
              return;
        }
        console.log(this.form);
        console.log(JSON.stringify(this.form));
        console.log(JSON.stringify(this.form.serverList));

        this.$axios
        .post("/addPlatformNotice", {
            platformId:this.form.platformId,
            serverList:JSON.stringify(this.form.serverList),
            noticeTitle: this.form.noticeTitle,
            noticeContent:this.form.noticeContent,
            startDatetime:this.form.startDatetime,
            endDatetime:this.form.endDatetime,
            addUser:this.userId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("全服公告添加成功");
            this.$message.success("全服公告添加成功");
            this.getPlatformNotice();  
            this.addPlatformNoticeVisible = false;  
          } else {
            console.log(this.responseResult);
            console.log("全服公告添加失败");
            this.$message.error("全服公告添加失败");
            return false;
          }
        })
        .catch(failResponse => {});
        
    },
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {
      console.log(this.from.serverList);
    },
    selectSearchKeyPlatform(){
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getPlatformNotice();
    },
    selectSearchKeyServer(){
      this.getPlatformNotice();
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
      console.log(index);
          console.log(this.tableData[index].id);
          this.$axios.post('/sendNotice',{
            id:this.tableData[index].id
          })
          .then(successResponse =>{
              this.responseResult ="\n"+ JSON.stringify(successResponse.data)
              if(successResponse.data.code === 200){
                  console.log(this.responseResult);
                  this.$message.success("公告发送完成"); 
                  this.getPlatformNotice();

              }else{
                  this.open4(successResponse.data.message);
                  console.log('error');
                  console.log(this.responseResult);
                  this.$message.error("公告发送失败");
                  return false;
              }
          })
          .catch(failResponse => {})
    },
    handleEdit(index,row){
        this.idx = index;
        var item = this.tableData[index];
        this.form={
            platformId:item.platformId,
            serverListZ:item.serverList,
            noticeTitle:item.noticeTitle,
            noticeContent:item.noticeContent,
            startDatetime:item.startDatetime,
            endDatetime:item.endDatetime,
            
        }
        this.getServerList(item.platformId);
        this.editPlatformNoticeVisible = true;
    },
    search(){
      this.getPlatformNotice();
    },
    formatIsSend(row, column, cellValue, index){
        return row.sendState == 1 ? "已发送" : "未发送";
    },
    formatNoticeType(row, column, cellValue, index){
        for(var i = 0;i<this.noticeTypeList.length;i++){
            if(this.noticeTypeList[i].id == row.noticeType){
                return this.noticeTypeList[i].noticeType;
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
                this.$axios.post('/deleteAllNotice',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("公告批量删除完成");
                        this.multipleSelection = []; 
                        this.getNotice();

                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("公告批量删除失败");
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
