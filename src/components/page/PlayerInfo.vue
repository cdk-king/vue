<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>玩家信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    （1）平台和服务器为必选，平台账号/角色ID/角色名/最后登录ip这四项必选其中一项，方可查询。
                    <br/>
                    （2）通过角色名查询，支持模糊匹配查询。
                    <br/>
                    （3）查询结果最多显示200条记录，若通过现有条件无法查询到目标玩家，请再详细查询条件缩小查询范围。
                </div>
                
                <Divider />

                    <div class="form-box">
                    <el-form ref="form" :model="form" label-width="100px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择渠道">
                            <el-select v-model="platformValue" @change="selectPlatform" placeholder="请选择渠道平台">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.platformId"
                                :label="item.platformName"
                                :value="item.platformId">
                                </el-option>
                            </el-select>
                            <span style="margin-left:22px">选择服务器</span>
                            <el-select v-model="serverValue" @change="selectServer" placeholder="请选择服务器">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="平台账号">
                            <el-input style="width:215px"
                            placeholder="请输入平台账号"
                            v-model="input10"
                            clearable>
                            </el-input>
                            <span style="margin-left:50px">角色名</span>
                            <el-input style="width:215px"
                            placeholder="请输入角色名"
                            v-model="input10"
                            clearable>
                            </el-input>
                            <span style="margin-left:50px">角色ID</span>
                            <el-input style="width:215px"
                            placeholder="请输入角色ID"
                            v-model="input10"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="最后登录IP">
                            <el-input style="width:215px"
                            placeholder="请输入IP"
                            v-model="input10"
                            clearable>
                            </el-input>
                           <span class="grid-content bg-purple-light" style="margin-left:35px">是否在线</span>
                           <!-- @change="stateSelect" v-model="searchKey.state"-->
                           <el-select  placeholder="请选择"  class="handle-select mr10">
                                <!-- @change="stateSelect" -->
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="在线" value="1"></el-option>
                                <el-option key="3" label="离线" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="VIP等级">

                            <el-input style="width:215px"
                            placeholder="最小等级"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:215px"
                            placeholder="最大等级"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="margin-left:50px">元宝</span>

                            <el-input style="width:215px"
                            placeholder="最小元宝"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:215px"
                            placeholder="最大元宝"
                            v-model="input10"
                            clearable>
                            </el-input>

                        </el-form-item>
                        <el-form-item label="充值金额">

                            <el-input style="width:215px"
                            placeholder="最小金额"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:215px"
                            placeholder="最大金额"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="margin-left:50px">等级</span>
                            
                            <el-input style="width:215px"
                            placeholder="最小等级"
                            v-model="input10"
                            clearable>
                            </el-input>

                            <span style="">—</span>

                            <el-input style="width:215px"
                            placeholder="最大等级"
                            v-model="input10"
                            clearable>
                            </el-input>

                        </el-form-item>

                        <el-form-item label="注册时间">
                                <el-date-picker style="width:215px" 
                                v-model="value1"
                                type="datetime"
                                placeholder="选择起始日期时间">
                                </el-date-picker>

                                <span style="">—</span>

                                <el-date-picker style="width:215px"  
                                v-model="value1"
                                type="datetime"
                                placeholder="选择截至日期时间">
                                </el-date-picker>

                                <span style="margin-left:50px">战力</span>

                                <el-input style="width:215px"
                                placeholder="最小战力"
                                v-model="input10"
                                clearable>
                                </el-input>

                                <span style="">—</span>

                                <el-input style="width:215px"
                                placeholder="最大战力"
                                v-model="input10"
                                clearable>
                                </el-input>


                        </el-form-item>
                        <el-form-item label="">
                            
                                <el-button type="primary" icon="search" @click="testMessage">查询</el-button>
                    
                        </el-form-item></el-form>
                    </div>


                <Divider />

                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="column1" label="column1.label"  >
                </el-table-column>
                <el-table-column prop="column2" label="column2.label"  >
                </el-table-column>
                <el-table-column prop="column3" label="column3.label" >
                </el-table-column>


                <el-table-column prop="column4" label="column4.label"  >
                </el-table-column>

                <el-table-column prop="column5" label="column5.label" >
                </el-table-column>
                <el-table-column prop="column6" label="column6.label" >
                </el-table-column>
                <el-table-column prop="column7"  label="column7.label" >
                </el-table-column>
                <el-table-column prop="column8"  label="column8.label" >
                </el-table-column>
                <el-table-column prop="column9"  label="column9.label" >
                </el-table-column>
                <el-table-column prop="column10"  label="column10.label" > 
                </el-table-column>
                

                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>

            </el-table>

                <!-- <div class="handle-box">
                    <el-button type="primary" icon="search" @click="testMessage">消息弹出测试</el-button>
                    <el-button type="primary" icon="search" @click="testDialog">对话弹出测试</el-button>
                    <el-button type="primary" icon="search" @click="show = true">子组件通讯测试</el-button>
                    <t-dialog :show.sync="show"></t-dialog>
                </div> -->
                    
            </div>
            <!-- 编辑冻结提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
                <div class="del-dialog-cnt">是否确定？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
import dialog from "../test/dialog.vue";
export default {
  name: "PlayerInfo",
  data() {
    return {
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
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
        //   serverId: "1",
        //   serverName: "服务器1"
        // }
      ],
      serverValue: "",
      serverLabel: "",
      form: {},
      id:0,
      serverIp:""
      
    };
  },
  components: {
    "t-dialog": dialog
  },
  computed: {
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
            //this.right();
        
        },
  methods: {
    getPlatformList(userId){
       
        this.$axios.post('/getPlatformListForUser',{
          id:userId
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("用户渠道列表获取成功");
                this.platformOptions = successResponse.data.data;
            
            }else{
                this.open4(successResponse.data.message);
                console.log(this.responseResult);
                console.log("用户渠道列表获取失败");
                return false;
            }
        })
        .catch(failResponse => {})
    },
    getServerList(platformId){
      this.$axios.post('/getServerListForUser',{
          id:platformId
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("渠道服务器列表获取成功");
                this.serverOptions = successResponse.data.data;
            
            }else{
                this.open4(successResponse.data.message);
                console.log(this.responseResult);
                console.log("渠道服务器列表获取失败");
                return false;
            }
        })
        .catch(failResponse => {})
    },
    selectPlatform(){
        this.getServerList(this.platformValue);
    },
    selectServer(){
        if(this.serverOptions.length>0){
          for(let  i = 0 ; i <  this.serverOptions.length ; i++){
              if(this.serverOptions[i].serverId == this.serverValue){
                   this.serverIp = this.serverOptions[i].serverIp;
                   console.log("当前serverIp:"+this.serverIp);
                    this.$message.success("当前serverIp:"+this.serverIp);
                   return;
              }
          }
        }
    },
    getData(){
        var userData =JSON.parse(localStorage.getItem('userData'));
        this.id = userData.id;
        this.getPlatformList(this.id);
    }
    ,
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
