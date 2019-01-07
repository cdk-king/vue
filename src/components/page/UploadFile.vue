<template>
  <div>
    <input id="inputFile" class="fileInput" type="file" @change="getFile($event)">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 文件
        </el-breadcrumb-item>
        <el-breadcrumb-item>文件中转</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="content-title">文件中转</div>

      <div class="plugins-tips">
          备注：
        <br>文件中转只能看到自己平台的文件，上传文件必须先选择平台
      </div>
      
      <Divider/>
      <div class="handle-box">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
              <span class="grid-content bg-purple-light">平台：</span>
              <el-select
                v-model="searchKey.platformId"
                @change="selectSearchKeyPlatform"
                placeholder="请选择平台"
                style="width:150px"
              >
                <el-option key="0" label="全部" value="0"></el-option>
                <el-option
                  v-for="item in platformOptions"
                  :key="item.platformId"
                  :label="item.platform"
                  :value="item.platformId"
                ></el-option>
              </el-select>
              <span class="grid-content bg-purple-light">原文件名：</span>
              <el-input
                v-model="searchKey.fileOldName"
                placeholder="筛选原文件名"
                class="handle-input"
                style="width:150px"
              ></el-input>
              <span class="grid-content bg-purple-light">新文件名：</span>
              <el-input
                v-model="searchKey.fileName"
                placeholder="筛选新文件名"
                class="handle-input"
                style="width:150px"
              ></el-input>
              <el-button type="primary" icon="search" @click="search">搜索</el-button>
              <el-button type="success" @click="HandleAddFile">添加文件</el-button>
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
        <el-table-column prop="platform" label="平台"></el-table-column>
        <el-table-column prop="fileType" label="文件类别"></el-table-column>
        <el-table-column prop="fileOldName" label="原始文件名"></el-table-column>
        <el-table-column prop="fileName" label="新文件名"></el-table-column>
        <el-table-column prop="fileDescribe" label="文件描述"></el-table-column>
        <el-table-column prop="fileSize" label="文件大小" width="100"></el-table-column>
        <el-table-column prop="addUser" label="上传人" width="100"></el-table-column>
        <el-table-column
          prop="addDatetime"
          width="120"
          label="创建时间"
          :formatter="formatter"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-table-column>
        <el-table-column prop="downloadTime" label="下载次数" width="80"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-download"
              @click="handleDownload(scope.$index, scope.row)"
            >下载</el-button>
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
    
    <!-- 添加弹出框 -->
    <el-dialog
      title="文件上传"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="uploadVisible"
      width="30%"
    >
      <el-form ref="form"  label-width="100px">
        <el-form-item class="el-form-item" label="选择平台" >
          <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择平台">
            <el-option
              v-for="item in platformOptions"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新文件名">
          <el-input v-model="form.newFileName"></el-input>
        </el-form-item>
        <el-form-item label="文件描述">
          <el-input v-model="form.fileDescribe"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item fileInputBox-out" label>
          <div class="fileInputBox">
            <div style="margin-bottom:10px">
            <label style="margin-left:0px" for>{{fileName | filterFileName}}</label>
            <label style="margin-left:20px" for>{{fileSize | filterFileSize}}</label>
            </div>
            <el-button type="primary" @click="clickInputFile">选取文件</el-button>
            
            <el-button type="success" @click="fileUpload">文件上传</el-button>

          </div>
        </el-form-item>
      </el-form>
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
  </div>
</template>

<script>
import bus from "../common/bus";
import Vue from "vue";
import axios from "axios";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "upload",
  data: function() {
    return {
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      propList: [],
      strPropList: "",
      platformOptions: [],
      form: {
        platformId: "",
        newFileName:"",
        fileDescribe:""
      },
      searchKey:{
        platformId: "",
        fileOldName:"",
        fileName:""
      },
      fullscreenLoading: false,
      loading: null,
      name: "",
      age: "",
      file: null,
      fileName: "",
      fileSize: 0,
      total: 0,
      url: "http://localhost:8011",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      inputFile: "",
      uploadVisible:false,
      idx:"",
      delVisible:false,
      delAllVisible:false,
      strPlatform:"",
      userId:"",
    };
  },
  components: {},
  computed: {
    data() {
      return this.tableData;
    }
  },
  created() {
    setLocalThisUrl(this);
    this.getData();
    var userData = JSON.parse(localStorage.getItem("userData"));
    this.userName = userData.name;
    bus.$on(
      "changeGameId",
      function(obj) {
        console.log(obj.message);
        this.getData();
      }.bind(this)
    );
  },
  beforeDestroy() {
    bus.$off("changeGameId");
  },
  mounted() {
    this.inputFile = document.getElementById("inputFile");
  },
  methods: {
    selectSearchKeyPlatform(){
        this.getFileList(this.$gameId);
    },
    deleteRow(){
        var item = this.tableData[this.idx];
        var fileName = item.fileName+"."+item.fileType;
        var filePath = "file/";
        this.$axios
        .post(this.url + "/api/file/deleteFile", {
            fileName:fileName,
            filePath:filePath,
            id:item.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          this.delVisible = false;
          console.log("删除成功");
          this.$message.success("删除成功");
            this.getData();
        })
        .catch(failResponse => {});
    },
    saveDelAll(){
      const length = this.multipleSelection.length;
      if(length==0){
        this.$message.info("请选择删除项");
        return;
      }
      let str = "";
      var fileName = "";
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
        for(let j = 0;j<this.tableData.length;j++){
            if(this.multipleSelection[i].id==this.tableData[j].id){
                fileName +=this.tableData[j].fileName+"."+this.tableData[j].fileType+",";
            }
        }
      }
        fileName =fileName.substring(0,fileName.length-1);
        str =str.substring(0,str.length-1);
        var filePath = "file/";
        console.log(fileName);
        console.log(str);
        this.$axios
        .post(this.url + "/api/file/deleteAllFile", {
            fileName:fileName,
            filePath:filePath,
            id:str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          this.delAllVisible = false;
          console.log("批量删除成功");
          this.$message.success("批量删除成功");
            this.getData();
        })
        .catch(failResponse => {});
    },
    search(){
        this.getFileList(this.$gameId);
    },
    delAll(){
        this.delAllVisible = true;
    },
    handleDelete(index, row){
        this.idx = index;
        this.delVisible = true;
    },
    handleDownload(index, row){
        this.idx = index;
        var item = this.tableData[index];
        var fileName = item.fileName+"."+item.fileType;
        var filePath = "file/";
        console.log(fileName);
        console.log(filePath);
        let config = {
        responseType: "blob",
        headers:{
            "Content-type":"application/json;charset=UTF-8"
        }
        };
        this.$axios
        .post(this.url + "/api/file/fileDownload", {
            fileName:fileName,
            filePath:filePath
        },config)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          let url = window.URL.createObjectURL(successResponse.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click();
          URL.revokeObjectURL(link.href) // 释放URL 对象
          document.body.removeChild(link);
          this.addDownloadTime(item.id);
          this.uploadVisible = false;
        })
        .catch(failResponse => {});
    },
    addDownloadTime(id){
        this.$axios
        .post(this.url + "/api/file/addDownloadTime", {
            id:id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("下载次数修改成功");
            this.getData();
          } else {
            console.log(this.responseResult);
            console.log("下载次数修改成功");
          }
        })
        .catch(failResponse => {});
    },
    HandleAddFile(){
      this.form={
        platformId: "",
        newFileName:"",
        fileDescribe:""
      } 
      this.fileName = "";
      this.fileSize = "";
      this.uploadVisible = true;
    },
    clickInputFile() {
      this.inputFile.click();
    },
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.userId = userData.id;
      this.getPlatformList(this.userId);
      
    },
    getFileList(gameId) {
      this.$axios
        .post(this.url + "/api/file/getFileList", {
            pageNo:"1",
            pageSize:"10",
            fileOldName:this.searchKey.fileOldName,
            fileName:this.searchKey.fileName,
            strPlatform:this.strPlatform,
            platformId: this.searchKey.platformId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("文件列表获取成功");
            this.tableData = successResponse.data.data.list;
            
          } else {
            console.log(this.responseResult);
            console.log("文件列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    formatter(row, column) {
      //时间格式化
      var date = row[column.property];
      return formatDatetime(date);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    selectPlatform() {
    },
    getFile(event) {
      this.file = event.target.files[0];
      this.fileName = this.file.name;
      this.form.newFileName = this.file.name.split('.')[0];
      this.form.fileDescribe = this.file.name.split('.')[0];
      this.fileSize = this.file.size;
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
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            this.strPlatform = this.strPlatform.substring(  
              0,
              this.strPlatform.length - 1
            );
            this.getFileList(this.$gameId);
          } else {
            console.log(this.responseResult);
            console.log("用户平台列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    fileUpload() {
      if(this.form.platformId == ""){
        this.$message.error("请选择平台")
          return;
      }
      if(this.file == null){
        this.$message.error("请选择正确的文件")
          return;
      }
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("fileName", this.form.newFileName);
      formData.append("fileSize", this.filterFileSize(this.fileSize));
      formData.append("fileDescribe", this.form.fileDescribe);
      formData.append("addUser", this.userName);
      formData.append("platformId", this.form.platformId);
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$axios
        .post(this.url + "/fileUpload", formData, headers)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("文件添加成功");
            this.getFileList(this.$gameId);
            this.uploadVisible = false;
          } else {
            console.log(this.responseResult);
            this.$message.error("文件添加失败");
          }
        })
        .catch(failResponse => {
          console.log("文件添加失败");
        });
    },
    submitForm(event) {
      event.preventDefault();
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("age", this.age);
      formData.append("file", this.file);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      this.$axios
        .post(this.url + "/fileUpload", formData, config)
        .then(function(res) {
          if (res.status === 2000) {
            /*这里做处理*/
          }
        });
    },
    filterFileSize(value){
        if (value != 0) {
          var size = 0;
          if (value < 0.1 * 1024) {
            //如果小于0.1KB转化成B
            size = value.toFixed(2) + "B";
          } else if (value < 0.1 * 1024 * 1024) {
            //如果小于0.1MB转化成KB
            size = (value / 1024).toFixed(2) + "KB";
          } else if (value < 0.1 * 1024 * 1024 * 1024) {
            //如果小于0.1GB转化成MB
            size = (value / (1024 * 1024)).toFixed(2) + "MB";
          } else {
            //其他转化成GB
            size = (value / (1024 * 1024 * 1024)).toFixed(2) + "GB";
          }
          return size;
        }
        return "";
    }

  },
  filters: {
    filterFileName: function(value) {
      if (value != "") {
        return "文件名：" + value;
      }
      return "";
    },
    filterFileSize: function(value) {
      if (value != 0) {
        var size = 0;
        if (value < 0.1 * 1024) {
          //如果小于0.1KB转化成B
          size = value.toFixed(2) + "B";
        } else if (value < 0.1 * 1024 * 1024) {
          //如果小于0.1MB转化成KB
          size = (value / 1024).toFixed(2) + "KB";
        } else if (value < 0.1 * 1024 * 1024 * 1024) {
          //如果小于0.1GB转化成MB
          size = (value / (1024 * 1024)).toFixed(2) + "MB";
        } else {
          //其他转化成GB
          size = (value / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }
        return "文件大小：" + size;
      }
      return "";
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.fileInput {
  border: 1px solid red;
  z-index: 10;
  width: 80px;
  overflow: hidden;
  position: absolute;
  left: 0px;
  top: 0;
  height: 32px;
  opacity: 0;
  padding: 0;
  margin: 0;
  display: none;
}
.fileInputBox {
}
.fileInputBox-out {
  position: relative;
}
</style>