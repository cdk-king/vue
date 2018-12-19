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
                    （1）平台和服务器为必选，请选择平台后再选择服务器
                    <br/>
                    （2）禁封和禁言操作不输入时间则为永久操作
                </div>
                <el-collapse v-model="activeNames" >
                <el-collapse-item title="折叠" name="1">
                        <div class="form-box">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="platformValue" @change="selectPlatform" placeholder="请选择平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.platformId"
                                :label="item.platform"
                                :value="item.platformId">
                                </el-option>
                            </el-select>
                            <span style="margin-left:22px">选择服务器</span>
                            <el-select v-model="serverValue" @change="selectServer" placeholder="请选择服务器" style="width:180px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <Divider />
                        <el-form-item label="玩家账号">
                            <el-input style="width:180px"
                            placeholder="请输入玩家账号"
                            v-model="searchForm.playerAccount"
                            clearable>
                            </el-input>
                            <span style="margin-left:36px">角色名</span>
                            <el-input style="width:180px"
                            placeholder="请输入角色名"
                            v-model="searchForm.playerName"
                            clearable>
                            </el-input>
                            <span style="margin-left:35px">角色ID</span>
                            <el-input style="width:180px"
                            placeholder="请输入角色ID"
                            v-model="searchForm.playerId"
                            clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="是否禁言">
                                <el-select  placeholder="请选择"  v-model="searchForm.isProhibitSpeak" class="handle-select mr10" style="width:180px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="未禁言" value="0"></el-option>
                                <el-option key="3" label="已禁言" value="1"></el-option>
                            </el-select>
                            <span style="margin-left:22px">是否禁封</span>
                                <el-select  placeholder="请选择"  v-model="searchForm.isBan" class="handle-select mr10" style="width:180px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option key="2" label="未封禁" value="0"></el-option>
                                <el-option key="3" label="已封禁" value="1"></el-option>
                            </el-select>
                            
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" icon="search" @click="testMessage">查询</el-button>
                        </el-form-item>
                        </el-form>
                    </div>
                </el-collapse-item>
                </el-collapse>
                <div style="margin:15px;" v-if="false">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleProhibitSpeakAll">批量禁言</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleProhibitSpeakToNormalAll">批量解除禁言</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleBanAll">批量禁封</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleBanToNormalAll">批量解除禁封</el-button>
                </div>
                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>

                <el-table-column prop="playerAccount" label="玩家账号"  >
                </el-table-column>
                <el-table-column prop="playerName" label="角色名"  >
                </el-table-column>
                <el-table-column prop="playerId" label="角色Id" >
                </el-table-column>
                <el-table-column prop="isProhibitSpeak"  label="是否禁言" :formatter="formatIsProhibitSpeak"> 
                    	<template slot-scope="scope">
                            <span v-if="scope.row.isProhibitSpeak==0" style="color:#000000">正常</span>
                            <span v-else style="color: red" >已禁言
                              <p>{{scope.row.prohibitSpeakTime}}</p>
                            </span>
                        </template>
                </el-table-column>
                <el-table-column prop="isBan"  label="是否禁封" :formatter="formatIsBan"> 
                    <template slot-scope="scope">
                            <span v-if="scope.row.isBan==0" style="color:#000000">正常</span>
                            <span v-else style="color: red" >已禁封
                              <p>{{scope.row.banTime}}</p>
                            </span>
                    </template>
                </el-table-column>
                <el-table-column prop="platform"  label="平台" >
                    <template slot-scope="scope">
                            <span  style="color:#000000">{{getPlatformName(platformValue)}}</span> 

                    </template>
                </el-table-column>
                <el-table-column prop="server"  label="服务器" >
                    <template slot-scope="scope">
                            <span style="color:#000000">{{getServerName(serverValue) }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleDetail(scope.$index, scope.row)" >详细信息</el-button>
                        
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeToProhibitSpeak(scope.$index, scope.row)" v-if="scope.row.isProhibitSpeak!=1">禁言</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeProhibitSpeakToNormal(scope.$index, scope.row)" v-if="scope.row.isProhibitSpeak==1">解除禁言</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeToBan(scope.$index, scope.row)" v-if="scope.row.isBan!=1">禁封</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeBanToNormal(scope.$index, scope.row)" v-if="scope.row.isBan==1">解除禁封</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
               </div>     

               <!-- 详细信息框 -->
            <el-dialog title="详细信息" :visible.sync="detailVisible" width="800px" center>
                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span class="span-right">玩家ID:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.PlayerID}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家角色名:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.AccountName}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家账号:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.AccountName}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">总充值金额:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.TotalRecharge}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">总消费金额:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.TotalConsume}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">VIP等级:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Vip}}</span>
                </div></el-col>
                </el-row>

                
                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家经验:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Exp}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家种族:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Race}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家等级:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Level}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家生命值:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.HP}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家PK值:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.PK}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">玩家战力:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.FightPower}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">所在区域:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Scene}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">钻石数量:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Diamond}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">绑定钻石数量:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.BindDiamond}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">金钱:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Money}}</span>
                </div></el-col>
                </el-row>

                <el-row :gutter="20">
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">是否在线:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.Online | filtersIsOnline}}</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span  class="span-right">角色创建时间:</span>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <span>{{detail.CreateTime}}</span>
                </div></el-col>
                </el-row>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="detailVisible = false">取 消</el-button>
                    <el-button type="primary" @click="detailVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
                <div class="del-dialog-cnt">是否确定？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        <!-- 编辑禁言提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToProhibitSpeak" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁言？</div>

            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="禁言时间">
                    <el-input v-model="form.prohibitSpeakTime"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToProhibitSpeak = false">取 消</el-button>
                <el-button type="primary" @click="ToProhibitSpeak">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑批量禁言提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeAllToProhibitSpeak" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeAllToProhibitSpeak = false">取 消</el-button>
                <el-button type="primary" @click="AllToProhibitSpeak">确 定</el-button>
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
        <!-- 编辑批量解除禁言提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeAllProhibitSpeakToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量解除禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeAllProhibitSpeakToNormal = false">取 消</el-button>
                <el-button type="primary" @click="AllProhibitSpeakToNormal">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁封？</div>


            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="禁封时间">
                    <el-input v-model="form.banTime"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToBan = false">取 消</el-button>
                <el-button type="primary" @click="ToBan">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑批量禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeAllToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeAllToBan = false">取 消</el-button>
                <el-button type="primary" @click="AllToBan">确 定</el-button>
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
        <!-- 编辑批量解除禁封提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeAllBanToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量解除禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeAllBanToNormal = false">取 消</el-button>
                <el-button type="primary" @click="AllBanToNormal">确 定</el-button>
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
        activeNames: ['1'],
      show: false,
      dialogVisible: false,
      delAllVisible: false,
      detailVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      pageSize:10,
      handleVisible: false,
      multipleSelection:[],
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
      ],
      serverValue: "",
      serverLabel: "",
      form: {},
      detail:{},
      id: 0,
      userId:0,
      idx: 0,
      serverIp: "",
      tableData: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      ChangeAllToProhibitSpeak: false,
      ChangeAllProhibitSpeakToNormal: false,
      ChangeAllToBan: false,
      ChangeAllBanToNormal: false,
      searchForm: {
        playerName: "",
        playerAccount: "",
        playerId: "",
        lastIp: "",
        isOnline: "",
        isProhibitSpeak: "",
        isBan: "",
        minVipLevel: "",
        maxVipLevel: "",
        minDiamond: "",
        maxDiamond: "",
        minRechargeAmount: "",
        maxRechargeAmount: "",
        minLevel: "",
        maxLevel: "",
        minRegistrationTime: "",
        maxRegistrationTime: "",
        minCombatPower: "",
        maxCombatPower: "",
        
      },
      url:"http://localhost:8011",
      total:0
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
    },
    getPlatformName(){
        //用闭包去实现传参
        return function(platformId){
            console.log(platformId);
            console.log(JSON.stringify(this.platformOptions));
            var item;
            for(var i = 0;i<this.platformOptions.length;i++){
                if(this.platformOptions[i].id==platformId){
                         return this.platformOptions[i].platform;
                }
            }

        }
    },
    getServerName(){
        return function(serverId){
            for(var i = 0;i<this.serverOptions.length;i++){
                    if(this.serverOptions[i].serverId==serverId){
                            return this.serverOptions[i].serverName;
                    }
            }
        }
    }

  },
  created() {
    if(this.$url!=null){
         this.url = this.$url;
    }
    this.getData();
    this.right();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getPlatformList(this.id);
        this.getPlayer();
      }.bind(this)
    );
  },
    beforeDestroy () {
        bus.$off('changeGameId');
    },
  methods: {
    right(){
        const right = localStorage.getItem('rightTags');
        
        if(right.indexOf('Player_Info_Handle')==-1){
            this.handleVisible = false;
        }else{
            this.handleVisible = true;
        }
    },
    getPlatformList(userId) {
      this.$axios
        .post(this.url+"/getPlatformListForUserIdAndGameId", {
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
        .post(this.url+"/getServerListForPlatform", {
          platformId: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("渠道服务器列表获取成功");
             this.serverOptions = [];
            this.serverOptions = successResponse.data.data;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("渠道服务器列表获取失败");
          }
        })
        .catch(failResponse => {
            this.serverOptions = [];
        });
    },
    selectPlatform() {
        this.serverValue = "";
      this.getServerList(this.platformValue);
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            break;
          }
        }
      }else{
          this.serverIp = "";
      }

      this.getPlayer();
    },
    getPlayer() {
        if(this.platformValue==null || this.platformValue==""){
                this.$message.error("请选择正确的平台");
                return;
            }
         if(this.serverValue==null || this.serverValue==""){
                this.$message.error("请选择正确的服务器");
                return;
            }


        this.$axios
        .post(this.url+"/api/player/getPlayerFromServer", {
          platformId: this.platformValue,
          WorldID: this.serverValue,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          AccountName:this.searchForm.playerAccount,
          PlayerID:this.searchForm.playerId,
          PlayerName:this.searchForm.playerName,
          LoginBan:this.searchForm.isBan,
          TalkBan:this.searchForm.isProhibitSpeak,
        
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家列表获取成功");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            this.mapData(successResponse.data.data);
          } else {
            console.log(this.responseResult);
            console.log("玩家列表获取失败"); 
            this.$message.error("玩家列表获取失败");
          }
        })
        .catch(failResponse => {
            this.tableData = [];
            if(this.serverValue==null || this.serverValue==""){
                this.$message.error("请选择正确的服务器");
            }
        });
    },
    mapData(data){
        data = data.replace(/AccountName/g,"playerAccount");
        data = data.replace(/PlayerID/g,"playerId");
        data = data.replace(/PlayerName/g,"playerName");
        data = data.replace(/TalkBan/g,"isProhibitSpeak");
        data = data.replace(/TalkBanEndTime/g,"prohibitSpeakTime");
        data = data.replace(/LoginBan/g,"isBan");
        data = data.replace(/LoginBanEndTime/g,"banTime");
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        console.log(typeof(data));
        this.tableData = data.PlayerList;
        
        this.total = this.tableData.length;
        //特殊分页技巧
        this.tableData  = this.tableData.splice((this.cur_page-1)*this.pageSize,this.pageSize);
    },
    getServerIp() {},
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.userId = userData.id;
      this.getPlatformList(this.userId);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("page:" + val);
      this.getPlayer();
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
    testMessage() {
      console.log(this.searchForm);
      console.log(JSON.stringify(this.searchForm));
      this.getPlayer();
    },
    testDialog() {
      this.dialogVisible = true;
    },
    formatIsBan: function(row, column, cellValue, index) {
      return row.isBan == 1 ? "已禁封" : "正常";
    },
    formatIsOnline: function(row, column, cellValue, index) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
    formatIsProhibitSpeak: function(row, column, cellValue, index) {
      return row.isProhibitSpeak == 1 ? "已禁言" : "正常";
    },
    handleDetail(index, row){
        this.detailVisible = true;
        var item = this.tableData[index];
        var PlayerID = item.playerId;

        this.$axios
        .post(this.url+"/api/player/getPlayerDetailInfo", {
          platformId: this.platformValue,
          WorldID: this.serverValue,
          PlayerID:PlayerID,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家详细信息获取成功");
            this.detail = JSON.parse(successResponse.data.data);
          } else {
            console.log(this.responseResult);
            console.log("玩家详细信息获取失败"); 
            this.$message.error("玩家详细信息获取失败");
          }
        })
        .catch(failResponse => {});
    },
    handleChangeToProhibitSpeak(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeToProhibitSpeak = true;
        
    },
    handleChangeProhibitSpeakToNormal(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeProhibitSpeakToNormal = true;
      
    },
    handleProhibitSpeakAll(){
        this.ChangeAllToProhibitSpeak = true;
    },
    handleProhibitSpeakToNormalAll(){
        this.ChangeAllProhibitSpeakToNormal = true;
    },
    handleBanAll(){
        this.ChangeAllToBan = true;
    },
    handleBanToNormalAll(){
        this.ChangeAllBanToNormal = true;
    },
    ToProhibitSpeak() {
        this.$axios
        .post(this.url+"/api/player/talkBan", {
            platformId: this.platformValue,
            WorldID: this.serverValue,
            PlayerID:this.tableData[this.idx].playerId,
            PlayerAccount:this.tableData[this.idx].playerAccount,
            PlayerName:this.tableData[this.idx].playerName,
            Remove:0,
            HowLong:this.form.prohibitSpeakTime,
            userId:this.userId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家禁言成功");
            this.$message.success("玩家禁言成功");
            this.ChangeToProhibitSpeak = false;
            this.getPlayer();
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});




    },
    AllToProhibitSpeak(){
        this.ChangeAllToProhibitSpeak = false;
    },
    ProhibitSpeakToNormal() {
        this.$axios
        .post(this.url+"/api/player/talkBan", {
            platformId: this.platformValue,
            WorldID: this.serverValue,
            PlayerID:this.tableData[this.idx].playerId,
            PlayerAccount:this.tableData[this.idx].playerAccount,
            PlayerName:this.tableData[this.idx].playerName,
            Remove:1,
            HowLong:this.form.prohibitSpeakTime,
            userId:this.userId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家解除禁言成功");
            this.$message.success("玩家解除禁言成功");
            this.ChangeProhibitSpeakToNormal = false;
            this.getPlayer();
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    AllProhibitSpeakToNormal(){
        this.ChangeAllProhibitSpeakToNormal = false;
    },
    handleChangeToBan(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeToBan = true;
    },
    handleChangeBanToNormal(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = this.tableData[index].id;
      this.ChangeBanToNormal = true;
    },
    ToBan() {

        this.$axios
        .post(this.url+"/api/player/Ban", {
            platformId: this.platformValue,
            WorldID: this.serverValue,
            playerName:this.tableData[this.idx].playerName,
            AccountName:this.tableData[this.idx].playerAccount,
            PlayerIds:this.tableData[this.idx].playerId,
            Remove:0,
            HowLong:this.form.banTime,
            userId:this.userId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
              
            console.log(this.responseResult);
            console.log("玩家禁封成功");
            this.$message.success("玩家禁封成功");
            this.ChangeToBan = false;
            this.getPlayer();
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    AllToBan(){
        this.ChangeAllToBan = false;
    },
    BanToNormal() {

        this.$axios
        .post(this.url+"/api/player/Ban", {
            platformId: this.platformValue,
            WorldID: this.serverValue,
            playerName:this.tableData[this.idx].playerName,
            AccountName:this.tableData[this.idx].playerAccount,
            PlayerIds:this.tableData[this.idx].playerId,
            Remove:1,
            HowLong:this.form.banTime,
            userId:this.userId,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("玩家解除禁封成功");
            this.$message.success("玩家解除禁封成功");
            this.ChangeBanToNormal = false;
            this.getPlayer();
          } else {
            console.log(this.responseResult);
            console.log(successResponse.data.message);
            this.$message.error(successResponse.data.message);
          }
        })
        .catch(failResponse => {});
    },
    AllBanToNormal(){
        this.ChangeAllBanToNormal = false;
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
        console.log(this.multipleSelection);
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
        this.$axios.post('/',{
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
    }
  },
  watch: {
    aa: function(curVal, oldVal) {
      console.log(curVal);
      this.$message(curVal);
    }
  },
  filters:{
    //这里不能访问this  
        filtersIsOnline:function (arg) {
            return arg == 1 ? "在线" : "离线";
            
        },
        filtersServer:function(arg){
            
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
 .el-row {
    margin-bottom: 20px;
  }
  .el-row :last-child{
      margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

.span-right{
    float: right;
}
</style>
