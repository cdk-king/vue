<template>
  <div>
    <input id="inputFile" class="fileInput" type="file" @change="getFile($event)">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 文件中转
        </el-breadcrumb-item>
        <el-breadcrumb-item>文件中转</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="content-title">文件中转</div>

      <div class="plugins-tips"></div>
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item class="el-form-item" label="选择渠道" v-if="false">
          <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台">
            <el-option
              v-for="item in platformOptions"
              :key="item.platformId"
              :label="item.platform"
              :value="item.platformId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="HandleAddFile">添加文件</el-button>
      </el-form>
      
      <Divider/>

      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
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
              icon="el-icon-edit"
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

      <!-- <form action="http://localhost:8011/fileUpload" method="post" enctype="multipart/form-data">
            <p>选择文件: <input type="file" name="file"/></p>
            <p><input type="submit" value="提交"/></p>
      </form>-->
      <!-- <form>
            <input type="text" value="" v-model="name" placeholder="请输入用户名">
            <input type="text" value="" v-model="age" placeholder="请输入年龄">
            <input type="file" @change="getFile($event)">
            <button @click="fileUpload">提交</button>
      </form>-->
    
    <!-- 添加弹出框 -->
    <el-dialog
      title="文件上传"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="uploadVisible"
      width="30%"
    >
      <el-form ref="form"  label-width="100px">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUpload">确 定</el-button>
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
        platformId: 0,
        newFileName:"",
        fileDescribe:""
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
      uploadVisible:false
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
    saveUpload(){
      this.uploadVisible = false;
    },
    handleDelete(index, row){
        this.idx = index;
        var item = this.tableData[index];
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
            console.log(successResponse.data);
            this.getData();
        })
        .catch(failResponse => {});
    },
    handleDownload(index, row){
        this.idx = index;
        var item = this.tableData[index];
        var fileName = item.fileName+"."+item.fileType;
        var filePath = "/";
        console.log(fileName);
        console.log(filePath);
        //window.location.href = "http://127.0.0.1:8011/download";
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
          this.getData();
          this.uploadVisible = false;
        })
        .catch(failResponse => {});
    },
    HandleAddFile(){
        this.uploadVisible = true;
    },
    clickInputFile() {
      this.inputFile.click();
    },
    getData() {
      console.log("this.$gameId:" + this.$gameId);
      this.getPlatformList(this.$gameId);
      this.getFileList(this.$gameId);
    },
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
            console.log(this.responseResult);
            console.log("渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
          } else {
            console.log(this.responseResult);
            console.log("渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getFileList(gameId) {
      this.$axios
        .post(this.url + "/api/file/getFileList", {
            pageNo:"1",
            pageSize:"10"
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("文件列表获取成功");
            this.tableData = successResponse.data.data.list;
            
          } else {
            console.log(this.responseResult);
            console.log("文件列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    ImportDatabase() {
      //this.fullscreenLoading = true;
      this.loading = this.$loading({
        lock: true,
        text: "数据导入中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios
        .post(this.url + "/ImportProp", {
          list: JSON.stringify(this.propList),
          platformId: this.form.platformId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            //this.fullscreenLoading = false;
            this.loading.close();
            this.$message.success("道具导入成功");
          } else {
            console.log("error");
            this.loading.close();
            console.log(this.responseResult);
            this.$message.error("道具导入失败");
          }
        })
        .catch(failResponse => {
          this.loading.close();
          console.log("error");
        });
    },
    formatter(row, column) {
      //时间格式化
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      var tt = new Date(parseInt(date)).toLocaleString();
      return tt;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("page:" + val);
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    selectPlatform() {
      console.log(this.form.platformId);
    },
    getFile(event) {
      this.file = event.target.files[0];
      this.fileName = this.file.name;
      this.fileSize = this.file.size;
      console.log(this.file);
    },
    fileUpload() {
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
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$axios
        .post(this.url + "/fileUpload", formData, headers)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
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