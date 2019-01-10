<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>申请礼包激活码
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">
        备注：{{value}}
        <br>（1）请先选择渠道平台后再选择礼包
        <br>（2）渠道平台、礼包、数量为必填项
      </div>
      <Divider/>

      <div class="form-box">
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
          <el-form-item class="el-form-item" label="选择礼包">
            <el-select v-model="form.giftId" filterable @change="selectGift" placeholder="请选择礼包">
              <el-option
                v-for="item in giftOptions"
                :key="item.giftId"
                :label="item.giftId+'—'+item.giftName"
                :value="item.giftId"
              ></el-option>
            </el-select>
          </el-form-item>
          <Divider/>
          <el-form-item label="标题">
            <el-input style="width:215px" placeholder="请输入标题" v-model="form.couponTitle" clearable></el-input>
          </el-form-item>
          <el-form-item label="说明">
            <el-input
              style="width:515px"
              type="textarea"
              :autosize="{ minRows:4, maxRows: 10}"
              placeholder="请输入说明"
              v-model="form.coupon_describe"
              clearable
            ></el-input>
          </el-form-item>
          <Divider/>
          <el-form-item label="数量">
            <el-input style="width:215px" placeholder="请输入数量" v-model="form.couponCount" clearable></el-input>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input style="width:215px" placeholder="请输入申请人" v-model="form.addUser" clearable></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" @click="generateCDK">生成激活码</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button @click="testDownload" v-if="false">下载文件测试</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          v-model="searchKey.platformId"
          @change="selectPlatform"
          placeholder="筛选平台"
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
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="couponId" label="礼包ID"></el-table-column>
        <el-table-column prop="couponCount" label="数量"></el-table-column>
        <el-table-column prop="couponTitle" label="标题"></el-table-column>

        <el-table-column prop="coupon_describe" label="描述"></el-table-column>
        <el-table-column prop="platform" label="平台"></el-table-column>
        <el-table-column prop="fileUrl" label="文件名"></el-table-column>
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
          :total="this.total"
        ></el-pagination>
      </div>

      <el-form label-width="150px" v-if="false">
        <el-form-item label="激活码">
          
          <el-input style="width:215px" placeholder="请输入激活码" v-model="analyseCDK" clearable></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="exchange">解析</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提示"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="300px"
      center
    >
    <div  style="overflow:auto;max-height:500px">
      <div v-for="item in CDKs" :key="item" class="text item">{{item}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
      <div class="text item">couponID:{{exchangeResult.couponID}}</div>
      <div class="text item">sequenceID:{{exchangeResult.sequenceID}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exchangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="exchangeVisible = false">确 定</el-button>
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
import bus from "../common/bus";
import crypto from "crypto";
import md5 from "js-md5";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "AppleGiftCDK",
  props: ["value"],
  data() {
    return {
      show: false,
      tableData: [],
      dialogVisible: false,
      multipleSelection: [],
      delVisible:false,
      delAllVisible:false,
      platformOptions: [
      ],
      giftOptions: [],
      platformValue: "",
      platformLabel: "",
      giftValue: "",
      giftLabel: "",
      serverOptions: [],
      serverValue: "",
      serverLabel: "",
      idx:"",
      form: {
        id: "",
        giftId: "",
        couponTitle: "",
        couponCount: "",
        coupon_describe: "",
        platformId: "",
        addUser: "",
        addDatetime: "",
        startDatetime: "",
        endDatetime: ""
      },
      searchKey: {
        platformId: "",
        giftId:"",
        giftName:""
      },
      id: 0,
      serverIp: "",
      CDKs: [],
      analyseCDK: "QVYQCAI",
      exchangeVisible: false,
      exchangeResult: {
        couponID: "",
        sequenceID: ""
      },
      url: "http://localhost:8011",
      strPlatform: "",
      cur_page: 1,
      total: 0
    };
  },
  components: {
  },
  computed: {
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    setLocalThisUrl(this);
    this.getData();
    bus.$on(
      "changeGameId",
      function(obj) {
        console.log(obj.message);
        this.form.platformId = "";
        this.form.giftId = "";
        this.searchKey.platformId = "";
        this.getData();
      }.bind(this)
    );
    bus.$on('giftDataUpload',function(obj){
        console.log(obj.message);
        if(this.form.platformId!=""){
            this.getGiftList(this.form.platformId);
        }
    }.bind(this))
  },
  beforeDestroy() {
    bus.$off("changeGameId");
    bus.$off("giftDataUpload");
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(index, row){
        this.idx = index;
        this.delVisible = true;
    },
    deleteRow(){
        var item = this.tableData[this.idx];
        var len = item.fileUrl.split('/').length;
        var fileName = item.fileUrl.split('/')[len-1];
        var filePath = "";
        for(var i = 0;i<len-1;i++){
            filePath+=item.fileUrl.split('/')[i]+"/";
        }
        this.$axios
        .post(this.url + "/api/cdk/deleteCDK", {
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
    delAll(){
        this.delAllVisible = true;
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
                var len = this.tableData[j].fileUrl.split('/').length;
                fileName += this.tableData[j].fileUrl.split('/')[len-1]+",";
            }
        }
      }
        fileName =fileName.substring(0,fileName.length-1);
        str =str.substring(0,str.length-1);
        var filePath = "cdk/";
        console.log(fileName);
        console.log(str);
        this.$axios
        .post(this.url + "/api/cdk/deleteAllCDK", {
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

    handleDownload(index, row) {
        this.idx = index;
        var item = this.tableData[index];
        var len = item.fileUrl.split('/').length;
        var fileName = item.fileUrl.split('/')[len-1];
        var filePath = "";
        for(var i = 0;i<len-1;i++){
            filePath+=item.fileUrl.split('/')[i]+"/";
        }
        let config = {
        responseType: "blob",
        //responseType: "arraybuffer",
        headers:{
            //发送的格式
            //"Content-type":"application/octet-stream;charset=utf-8"
            //"Content-type":"application/force-download;charset=UTF-8"
            "Content-type":"application/json;charset=UTF-8"
            //"Content-type":"text/html;charset=UTF-8" 
        }
        };
        this.$axios
        .post(this.url + "/api/file/CDKFileDownload", {
            fileName:fileName,
            filePath:filePath
        },config)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          //window.location.href = window.URL.createObjectURL(successResponse.data);
          let url = window.URL.createObjectURL(successResponse.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click();
          // 释放URL 对象
          URL.revokeObjectURL(link.href) 
          document.body.removeChild(link)
            
        })
        .catch(failResponse => {});
    },
    testDownload() {
        let config = {
        //responseType: "arraybuffer",
        //BLOB (binary large object)，二进制大对象，是一个可以存储二进制文件的容器。
        responseType: 'blob',
        headers:{
            "Content-type":"application/octet-stream;charset=utf-8"
            //"Content-type":"application/force-download;charset=UTF-8"
            //"Content-type":"application/json;charset=UTF-8"
            //"Content-type":"text/html;charset=UTF-8"
        }
        };
        this.$axios
        .post(this.url + "/download", {
            fileName:"img.jpg",
            filePath:"F:/file"
        },config)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          var fileName = "img.jpg";
          let url = window.URL.createObjectURL(successResponse.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click();
          // 释放URL 对象
          URL.revokeObjectURL(link.href) 
          document.body.removeChild(link)
        })
        .catch(failResponse => {});

    },
    exchange() {
      this.$axios
        .post(this.url + "/analyseCDK", {
          analyseCDK: this.analyseCDK
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("CDK解析成功");
            this.exchangeResult = successResponse.data.data;
            this.exchangeVisible = true;
          } else {
            this.exchangeResult =[];
            console.log(this.responseResult);
            console.log("CDK解析失败");
          }
        })
        .catch(failResponse => {});
    },
    generateCDK() {
      //表单验证

      if (this.form.platformId == "") {
        this.$message.error("请选择正确的平台");
        return;
      }
      if (this.form.giftId == "") {
        this.$message.error("请选择正确的礼包");
        return;
      }
      if (this.form.couponCount == "") {
        this.$message.error("请输入生成数量");
        return;
      }
      var type = 0;
      var CouponID = parseInt(this.form.giftId.toString()) * 1;
      var strCouponID = (CouponID + type).toString();
      var sign = md5.hex(
        strCouponID +
          this.form.platformId.toString() +
          this.form.couponCount.toString() +
          "cdk"
      );
      this.$axios
        .post(this.url + "/generateCDK", {
          id: this.form.id,
          platformId: this.form.platformId,
          giftId: this.form.giftId,
          couponTitle: this.form.couponTitle,
          coupon_describe: this.form.coupon_describe,
          couponCount: this.form.couponCount.trim(),
          startDatetime: this.form.startDatetime,
          endDatetime: this.form.endDatetime,
          addUser: this.form.addUser,
          addDatetime: this.form.addDatetime,
          sign: sign,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("CDK生成成功");
            this.$message.success("CDK生成成功");
            var data = successResponse.data.data;
            this.CDKs = data;
            this.dialogVisible = true;
            this.resetForm();
            this.getCoupon();
          } else {
            console.log(this.responseResult);
            console.log("CDK生成失败");
            this.getCoupon();
          }
        })
        .catch(failResponse => {});
    },
    resetForm() {
      this.form = {
        id: "",
        giftId: "",
        couponTitle: "",
        couponCount: "",
        coupon_describe: "",
        platformId: "",
        addUser: "",
        addDatetime: "",
        startDatetime: "",
        endDatetime: ""
      };
    },
    stringToByte(str) {
      var bytes = new Array();
      var len, c;
      len = str.length;
      for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10ffff) {
          bytes.push(((c >> 18) & 0x07) | 0xf0);
          bytes.push(((c >> 12) & 0x3f) | 0x80);
          bytes.push(((c >> 6) & 0x3f) | 0x80);
          bytes.push((c & 0x3f) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00ffff) {
          bytes.push(((c >> 12) & 0x0f) | 0xe0);
          bytes.push(((c >> 6) & 0x3f) | 0x80);
          bytes.push((c & 0x3f) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007ff) {
          bytes.push(((c >> 6) & 0x1f) | 0xc0);
          bytes.push((c & 0x3f) | 0x80);
        } else {
          bytes.push(c & 0xff);
        }
      }
      return bytes;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    byteToString(arr) {
      if (typeof arr === "string") {
        return arr;
      }
      var str = "",
        _arr = arr;
      for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
          v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for (var st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(2).slice(2);
          }
          str += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
        } else {
          str += String.fromCharCode(_arr[i]);
        }
      }
      return str;
    },
    selectGift() {},
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
            console.log("平台列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            this.strPlatform = this.strPlatform.substring(
              0,
              this.strPlatform.length - 1
            );
            this.getCoupon();
          } else {
            this.platformOptions = [];
            this.strPlatform = "";
            console.log(this.responseResult);
            console.log("平台列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getGiftList(platformId) {
      this.$axios
        .post(this.url + "/getNewGiftListForPlatformId", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("礼包列表获取成功");
            this.giftOptions = successResponse.data.data.list;
          } else {
            this.giftOptions = [];
            console.log(this.responseResult);
            console.log("礼包列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getGiftList(this.form.platformId);
    },
    search(){
      this.getCoupon();
    },
    getData() {
      this.getPlatformList(this.$gameId);
    },
    getCoupon() {
      this.$axios
        .post(this.url + "/api/cdk/getCoupon", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          giftId:this.searchKey.giftId,
          giftName:this.searchKey.giftName,
          platformId: this.searchKey.platformId,
          strPlatform: this.strPlatform,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
            console.log(this.responseResult);
            this.$message.error("列表获取失败");
          }
        });
    },
    testDialog() {
      this.dialogVisible = true;
    }
  },
  watch: {
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.el-form-item {
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
