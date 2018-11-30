<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>玩家禁言记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <span class="grid-content bg-purple-light">平台：</span>
                <el-select v-model="searchKey.platformId" @change="selectPlatform" placeholder="请选择平台" class="handle-select mr10">
                        <el-option key="0" label="全部" value="0"></el-option>
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.id"
                        :label="item.platform"
                        :value="item.id">
                        </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">选择服务器</span>
                <el-select v-model="serverValue" @change="selectServer" placeholder="请选择服务器" style="width:150px">
                    <el-option
                    v-for="item in serverOptions"
                    :key="item.serverId"
                    :label="item.serverName"
                    :value="item.serverId">
                    </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">是否禁言：</span>
                    <el-select  placeholder="请选择" @change="selectIsToBan"  v-model="searchKey.isToBan" class="handle-select mr10" style="width:150px">
                    <!-- @change="stateSelect" -->
                    <el-option key="1" label="全部" value="0"></el-option>
                    <el-option key="2" label="未禁言" value="1"></el-option>
                    <el-option key="3" label="已禁言" value="2"></el-option>
                </el-select>

                <span class="grid-content bg-purple-light">玩家名：</span>
                <el-input v-model="searchKey.playerName" placeholder="筛选玩家名" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">玩家账号：</span>
                <el-input v-model="searchKey.playerAccount" placeholder="筛选玩家账号" class="handle-input " style="width:150px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  width="80">
                </el-table-column>
                <el-table-column prop="playerName" label="玩家名称" width="160">
                </el-table-column>
                <el-table-column prop="playerAccount" label="玩家账号" >
                </el-table-column>
                <el-table-column prop="playerId" label="玩家ID" >
                </el-table-column>
                <el-table-column prop="isToBan" label="操作类型" :formatter="formatIsToProhibitSpeak">
                </el-table-column> 
                <el-table-column prop="prohibitSpeakTime" label="禁言时间" >
                </el-table-column> 
                <el-table-column prop="addDatetime" label="操作时间" :formatter="formatDatetime" value-format="YYYY-MM-DD HH:mm:ss">
                </el-table-column>
                <el-table-column prop="platform" label="平台" >
                </el-table-column>
                <el-table-column prop="server" label="服务器" >
                </el-table-column>
                <el-table-column prop="userName" label="操作人员" >
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../common/bus';
    export default {
        name: 'playerLogTable',
        data() {
            return {
                url:'/getPlayerProhibitSpeakLog',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                is_search: false,
                total:0,
                form: {
                    id:'',
                    playerName:'',
                    playerAccount:'',
                    playerId: '',
                    userId: '',
                    addDatetime: '',
                    platformId:"",
                    platform:"",
                    serverId:"",
                    server:"",
                    isToBan:""
                },
                searchKey: {
                    id:'',
                    playerName:'',
                    playerAccount:'',
                    playerId: '',
                    userId: '',
                    addDatetime: '',
                    platformId:"",
                    platform:"",
                    serverId:"",
                    server:"",
                    isToBan:""
                },
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
                serverOptions:[],
                idx: -1,
                responseResult:[],
                id:"",
                strPlatform:""
            }
        },
        created() {
            console.log("this.$gameId:"+this.$gameId);
            this.getPlatformList(this.$gameId);
            console.log(this.strPlatform);

            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.getPlatformList(this.$gameId);
            }.bind(this))
        },
        beforeDestroy () {
            bus.$off('changeGameId');
        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        mounted() {
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                console.log("page:"+val);
                this.getData();
            },
            //筛选当前用户游戏的玩家
            getData() {
                this.$axios.post(this.url, {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    playerName:this.searchKey.playerName,
                    playerAccount:this.searchKey.playerAccount,
                    playerId:this.searchKey.playerId,
                    platformId:this.searchKey.platformId,
                    serverId:this.searchKey.serverId,
                    isToBan:this.searchKey.isToBan,
                    strPlatform:this.strPlatform
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        console.log("日志列表获取成功");
                        //this.$message.success("玩家列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        console.log(this.tableData);
                        this.total = successResponse.data.data.total;
                    }else{
                        
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("日志列表获取失败");
                        return false;
                    }
                })
            },
            //当前游戏的平台
            getPlatformList(gameId) {
            var userData =JSON.parse(localStorage.getItem('userData'));
            this.$axios
                .post("/getPlatformListForUserIdAndGameId", {
                userId:userData.id,
                gameId:gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log(this.responseResult);
                    console.log("渠道列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                    this.strPlatform = "";
                    for(var i = 0;i<this.platformOptions.length;i++){
                        this.strPlatform += this.platformOptions[i].id+",";
                        
                    }
                    this.strPlatform=this.strPlatform.substring(0,this.strPlatform.length-1);
                    this.getData();
                } else {
                    
                    console.log(this.responseResult);
                    console.log("渠道列表获取失败");
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
                    console.log("渠道服务器列表获取成功");
                    this.serverOptions = successResponse.data.data;
                } else {
                    this.open4(successResponse.data.message);
                    console.log(this.responseResult);
                    console.log("渠道服务器列表获取失败");
                    return false;
                }
                })
                .catch(failResponse => {});
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            stateSelect(){
                this.getData();
            },
            selectPlatform(){
                this.getServerList(this.searchKey.platformId);
                this.getData(); 
            },
            selectServer(){
                this.getData();
            },
            selectIsToBan(){
                this.getData();
            },
            formatDatetime(row, column) {
                //return row.address;
                //时间格式化
                    
                var date = row[column.property];  
                if (date == undefined) {  
                    return "";  
                }

                var tt=new Date(parseInt(date)).toLocaleString();
                return tt;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            formatState: function (row, column, cellValue, index) { 
			return row.state == 1 ? '已冻结' : row.sex == 0 ? '正常' : '正常';
            },
            formatIsToProhibitSpeak(row, column, cellValue, index){
                return row.isToProhibitSpeak == 1 ? '禁言' : '解除禁言';
            }
        }
    }

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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
