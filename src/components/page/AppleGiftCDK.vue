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
          <el-form-item class="el-form-item" label="选择渠道">
            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台">
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
                :label="item.giftName"
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

      <el-table :data="tableData" border class="table" ref="multipleTable">
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
              icon="el-icon-edit"
              @click="handleDownload(scope.$index, scope.row)"
            >下载</el-button>
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
      <div v-for="item in CDKs" :key="item" class="text item">{{item}}</div>
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
  </div>
</template>

<script>
import bus from "../common/bus";
import crypto from "crypto";
import md5 from "js-md5";
import dialog from "../test/dialog.vue";
export default {
  name: "AppleGiftCDK",
  props: ["value"],
  data() {
    return {
      show: false,
      tableData: [],
      dialogVisible: false,
      aa: this.$cdk,
      platformOptions: [
        {
          platformId: "1",
          platform: "渠道1"
        },
        {
          platformId: "2",
          platform: "渠道2"
        }
      ],
      giftOptions: [],
      platformValue: "",
      platformLabel: "",
      giftValue: "",
      giftLabel: "",
      serverOptions: [],
      serverValue: "",
      serverLabel: "",
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
        platformId: 0
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
    "t-dialog": dialog
  },
  computed: {
    cdk: function() {
      return this.$store.state.gameId;
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    if (this.$url != null) {
      this.url = this.$url;
    }
    this.getData();
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
  methods: {
    handleDownload(index, row) {
        this.idx = index;
        var item = this.tableData[index];
        console.log(item.fileUrl);
        var len = item.fileUrl.split('/').length;
        var fileName = item.fileUrl.split('/')[len-1];
        var filePath = "";
        for(var i = 0;i<len-1;i++){
            filePath+=item.fileUrl.split('/')[i]+"/";
        }
        console.log(fileName);
        console.log(filePath);
        //window.location.href = "http://127.0.0.1:8011/download";
        let config = {
        //二进制大对象，是一个可以存储二进制文件的容器
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
        .post(this.url + "/api/file/fileDownload", {
            fileName:fileName,
            filePath:filePath
        },config)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
            console.log(successResponse.data);
          //A File, Blob or MediaSource object to create an object URL for.
          let url = window.URL.createObjectURL(successResponse.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click();
          //URL.revokeObjectURL(link.href) // 释放URL 对象
          //document.body.removeChild(link)
            
        })
        .catch(failResponse => {});
    },
    testDownload() {
        //window.location.href = "http://127.0.0.1:8011/download";
        //window.location.href = "http://127.0.0.1:8011/api/file/fileDownload";
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
        //"/api/file/fileDownload"
        //"/download"
        this.$axios
        .post(this.url + "/download", {
            fileName:"img.jpg",
            filePath:"F:/file"
        },config)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
            console.log( this.responseResult);
            console.log(successResponse.data);

          var fileName = "img.jpg";
          //A File, Blob or MediaSource object to create an object URL for.
          let url = window.URL.createObjectURL(successResponse.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click();
          //URL.revokeObjectURL(link.href) // 释放URL 对象
          //document.body.removeChild(link)
        })
        .catch(failResponse => {});

    },
    exchange() {
      console.log(this.analyseCDK);
      this.$axios
        .post(this.url + "/analyseCDK", {
          analyseCDK: this.analyseCDK
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("CDK解析成功");
            this.exchangeResult = successResponse.data.data;
            this.exchangeVisible = true;
          } else {
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
      console.log(this.form.platformId);
      console.log(this.form.giftId);
      console.log(this.form);
      var type = 0;
      var CouponID = parseInt(this.form.giftId.toString()) * 1;
      var strCouponID = (CouponID + type).toString();
      console.log(strCouponID);

      console.log(this.form.couponCount);
      var sign = md5.hex(
        strCouponID +
          this.form.platformId.toString() +
          this.form.couponCount.toString() +
          "cdk"
      );
      console.log(sign);
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
          sign: sign
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("CDK生成成功");
            this.$message.success("CDK生成成功");
            var data = successResponse.data.data;
            console.log(JSON.stringify(data));
            this.CDKs = data;
            this.dialogVisible = true;
            this.resetForm();
            this.getCoupon();
            //this.platformOptions = successResponse.data.data;
          } else {
            console.log(this.responseResult);
            console.log("CDK生成失败");
            this.getCoupon();
          }
        })
        .catch(failResponse => {});
    },
    resetForm() {
      bus.$emit("busEmit", "bus.$emit('busEmit','')");
      this.$emit("increment1", "这个位子是可以加参数的");
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
      console.log("page:" + val);
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
            console.log(this.responseResult);
            console.log("渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            console.log(this.strPlatform);
            this.strPlatform = this.strPlatform.substring(
              0,
              this.strPlatform.length - 1
            );
            this.getCoupon();
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("渠道列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getGiftList(platformId) {
      console.log(platformId);
      this.$axios
        .post(this.url + "/getNewGiftListForPlatformId", {
          platformId: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("礼包列表获取成功");
            this.giftOptions = successResponse.data.data.list;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("礼包列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getGiftList(this.form.platformId);
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
      //var userData = JSON.parse(localStorage.getItem("userData"));
      //this.id = userData.id;
      console.log("this.$gameId:" + this.$gameId);
      this.getPlatformList(this.$gameId);
    },
    getCoupon() {
      this.$axios
        .post(this.url + "/api/cdk/getCoupon", {
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          platformId: this.searchKey.platformId,
          strPlatform: this.strPlatform
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("列表获取成功");
            this.tableData = successResponse.data.data.list;
            console.log(this.tableData);
            this.total = successResponse.data.data.total;
          } else {
            console.log("error");
            console.log(this.responseResult);
            this.$message.error("列表获取失败");
          }
        });
    },
    
    testMessage() {
      this.$message.success("success");
      this.$message.success(this.$cdk);
    },
    testDialog() {
      this.dialogVisible = true;
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
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
