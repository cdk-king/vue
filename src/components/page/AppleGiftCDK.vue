<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>申请礼包激活码</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：{{value}}
                    <br/>
                    （1）请先选择渠道平台后再选择礼包
                    <br/>
                    （2）渠道平台、礼包、数量为必填项
                </div>
                
                <Divider />

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
                        <el-form-item class="el-form-item" label="选择礼包">
                            <el-select v-model="form.giftId" @change="selectGift" placeholder="请选择礼包">
                                <el-option
                                v-for="item in giftOptions"
                                :key="item.id"
                                :label="item.giftName"
                                :value="item.id">
                                </el-option>
                        </el-select>

                        </el-form-item>
                        <Divider />
                        <el-form-item label="标题">
                            <el-input style="width:215px"
                            placeholder="请输入标题"
                            v-model="form.couponTitle"
                            clearable>
                            </el-input>
                            
                        </el-form-item>
                        <el-form-item  label="说明">
                            <el-input style="width:515px" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            placeholder="请输入说明"
                            v-model="form.coupon_describe"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="数量">
                            <el-input style="width:215px"
                            placeholder="请输入数量"
                            v-model="form.couponCount"
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
                        <el-form-item label="申请人">
                            <el-input style="width:215px"
                            placeholder="请输入申请人"
                            v-model="form.addUser"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="generateCDK">生成激活码</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-form-item>
                        </el-form>

                    </div>

                

                <el-form  label-width="150px" v-if="false">
                        <el-form-item label="激活码">
                            <el-input style="width:215px"
                            placeholder="请输入激活码"
                            v-model="analyseCDK"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="exchange">解析</el-button>
                        </el-form-item>
                </el-form>
 
            </div>
            <el-dialog title="提示" :modal="false"  :close-on-click-modal="false" :visible.sync="dialogVisible"   width="300px" center>
                
                <div v-for="item in CDKs" :key="item" class="text item">{{item}}</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="提示" :modal="false"  :close-on-click-modal="false" :visible.sync="exchangeVisible"   width="300px" center>
                
                <div  class="text item">couponID:{{exchangeResult.couponID}}</div>
                <div  class="text item">sequenceID:{{exchangeResult.sequenceID}}</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="exchangeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="exchangeVisible = false">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
import bus from '../common/bus';
import crypto from 'crypto';
import md5 from 'js-md5';
import dialog from "../test/dialog.vue";
export default {
  name: "AppleGiftCDK",
  props:["value"],
  data() {
    return {
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
      giftOptions: [
        // {
        //   id: "1",
        //   giftName: "礼包1"
        // },

      ],
      platformValue: "",
      platformLabel: "",
      giftValue: "",
      giftLabel: "",
      serverOptions: [
        // {
        //   serverId: "1",
        //   serverName: "服务器1"
        // }
      ],
      serverValue: "",
      serverLabel: "",
      form: {
          id:'',
          giftId:'',
          couponTitle:'',
          couponCount:'',
          coupon_describe: '',
          platformId:'',
          addUser: '',
          addDatetime: '',
          startDatetime:'',
          endDatetime:''
      },
      id: 0,
      serverIp: "",
      CDKs:[],
      analyseCDK:"QVYQCAI",
      exchangeVisible:false,
      exchangeResult:{
        couponID:"",
        sequenceID:""
      }
    };
  },
  components: {
    "t-dialog": dialog
  },
  computed: {
    cdk: function() {
      return this.$store.state.gameId
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    this.getData();
    bus.$on('changeGameId',function(obj){
        console.log(obj.message);
        this.getData();
    }.bind(this))
    
    //this.right();
  },
  beforeDestroy () {
    bus.$off('changeGameId')
  },
  methods: {
    exchange(){
        console.log(this.analyseCDK);
        this.$axios 
        .post("/analyseCDK", {
          analyseCDK: this.analyseCDK,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("CDK解析成功");
            this.exchangeResult = successResponse.data.data;
            this.exchangeVisible = true;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("CDK解析失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    generateCDK() {
      //表单验证
      
      if(this.form.platformId==""){
          this.$message.error("请选择正确的平台");
          return;
      }
      if(this.form.giftId==""){
          this.$message.error("请选择正确的礼包");
          return;
      }
      if(this.form.couponCount==""){
          this.$message.error("请输入生成数量");
          return;
      }
      console.log(this.form.platformId);
      console.log(this.form.giftId);
      console.log(this.form);
      var type = 0;
      var CouponID = parseInt((this.form.giftId).toString()) * 1;
      var strCouponID = (CouponID + type ).toString();
      console.log(strCouponID);
      
      console.log(this.form.couponCount);
      //console.log(this.stringToByte(cdk));

      // var md51 = crypto.createHash("md5");
      //       md51.update('20000');
      //       md51.update('2');
      //       md51.update('2');
      //       md51.update('cdk');
      //       var a = md51.digest('hex');
      //       console.log(a);
      //正解
      var sign =  md5.hex(strCouponID+this.form.platformId.toString()+this.form.couponCount.toString()+"cdk");
      console.log(sign);
        this.$axios 
        .post("/generateCDK", {
          id: this.form.id,
          platformId:this.form.platformId,
          giftId:this.form.giftId,
          couponTitle:this.form.couponTitle,
          coupon_describe:this.form.coupon_describe,
          couponCount:this.form.couponCount.trim(),
          startDatetime:this.form.startDatetime,
          endDatetime:this.form.endDatetime,
          addUser:this.form.addUser,
          addDatetime:this.form.addDatetime,
          sign:sign
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("CDK生成成功");
            this.$message.success("CDK生成成功");
            var data =  successResponse.data.data;
            console.log(JSON.stringify(data));
            this.CDKs = data;
            this.dialogVisible = true;
            this.resetForm();
            //this.platformOptions = successResponse.data.data;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("CDK生成失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    resetForm(){
      bus.$emit("busEmit","bus.$emit('busEmit','')");
      this.$emit('increment1',"这个位子是可以加参数的");
      this.form = {
          id:'',
          giftId:'',
          couponTitle:'',
          couponCount:'',
          coupon_describe: '',
          platformId:'',
          addUser: '',
          addDatetime: '',
          startDatetime:'',
          endDatetime:''
      }
      //this.dialogVisible = true;
    },
    stringToByte(str) {  
    var bytes = new Array();
    var len, c;  
    len = str.length;  
    for(var i = 0; i < len; i++) {  
        c = str.charCodeAt(i);  
        if(c >= 0x010000 && c <= 0x10FFFF) {  
            bytes.push(((c >> 18) & 0x07) | 0xF0);  
            bytes.push(((c >> 12) & 0x3F) | 0x80);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } else if(c >= 0x000800 && c <= 0x00FFFF) {  
            bytes.push(((c >> 12) & 0x0F) | 0xE0);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } else if(c >= 0x000080 && c <= 0x0007FF) {  
            bytes.push(((c >> 6) & 0x1F) | 0xC0);  
            bytes.push((c & 0x3F) | 0x80);  
        } else {  
            bytes.push(c & 0xFF);  
        }  
    }  
    return bytes;  
    },
    byteToString(arr) {  
        if(typeof arr === 'string') {  
            return arr;  
        }  
        var str = '',  
            _arr = arr;  
        for(var i = 0; i < _arr.length; i++) {  
            var one = _arr[i].toString(2),  
                v = one.match(/^1+?(?=0)/);  
            if(v && one.length == 8) {  
                var bytesLength = v[0].length;  
                var store = _arr[i].toString(2).slice(7 - bytesLength);  
                for(var st = 1; st < bytesLength; st++) {  
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
    selectGift(){

    },
    getPlatformList(gameId) {
      var userData =JSON.parse(localStorage.getItem('userData'));
      this.$axios
        .post("/getPlatformListForUserIdAndGameId", {
          
          userId:userData.id,
          gameId: gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
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
        .post("/getNewGiftListForPlatformId", {
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
      console.log("this.$gameId:"+this.$gameId);
      this.getPlatformList(this.$gameId);
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
  /* border: 1px solid red; */
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
