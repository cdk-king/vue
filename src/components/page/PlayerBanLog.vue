<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>玩家禁封记录</el-breadcrumb-item>
                <el-breadcrumb-item>玩家管理</el-breadcrumb-item>
                <el-breadcrumb-item>玩家管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <span class="grid-content bg-purple-light">平台：</span>
                <el-select v-model="searchKey.platformId" @change="selectPlatform" placeholder="筛选平台" class="handle-select mr10">
                        <el-option key="0" label="全部" value="0"></el-option>
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">选择服务器</span>
                <el-select v-model="searchKey.serverId" @change="selectServer" placeholder="筛选服务器" style="width:150px">
                    <el-option
                    v-for="item in serverOptions"
                    :key="item.serverId"
                    :label="item.serverName"
                    :value="item.serverId">
                    </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">操作类型：</span>
                    <el-select  placeholder="筛选操作类型" @change="selectisToBan"  v-model="searchKey.isToBan" class="handle-select mr10" style="width:150px">
                    <el-option key="1" label="全部" value="0"></el-option>
                    <el-option key="2" label="解除禁封" value="1"></el-option>
                    <el-option key="3" label="禁封" value="2"></el-option>
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
                <el-table-column prop="isToBan" label="操作类型" :formatter="formatisToBan">
                </el-table-column> 
                <el-table-column prop="banTime" label="禁封时间" >
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
import setLocalThisUrl from '../../code/setLocalThisUrl';
import formatDatetime from "../../code/formatDatetime";
    export default {
        name: 'playerLogTable',
        data() {
            return {
                url:"http://localhost:8011",
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

                ],
                serverOptions:[],
                idx: -1,
                responseResult:[],
                id:"",
                strPlatform:""
            }
        },
        created() {
            setLocalThisUrl(this);
            this.getPlatformList(this.$gameId);

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
                this.getData();
            },
            //筛选当前用户游戏的玩家
            getData() {
                this.$axios.post(this.url+'/getPlayerBan', {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    playerName:this.searchKey.playerName,
                    playerAccount:this.searchKey.playerAccount,
                    playerId:this.searchKey.playerId,
                    platformId:this.searchKey.platformId,
                    serverId:this.searchKey.serverId,
                    isToBan:this.searchKey.isToBan,
                    strPlatform:this.strPlatform,
                    gameId:this.$gameId
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("禁封记录获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                         this.tableData =[];
                         this.total =0;
                        console.log(this.responseResult);
                        this.$message.error("禁封记录获取失败");
                    }
                })
            },
            //当前游戏的平台
            getPlatformList(gameId) {
            var userData =JSON.parse(localStorage.getItem('userData'));
            this.$axios
                .post(this.url+"/getPlatformListForUserIdAndGameId", {
                userId:userData.id,
                gameId:gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("平台列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                    this.strPlatform = "";
                    for(var i = 0;i<this.platformOptions.length;i++){
                        this.strPlatform += this.platformOptions[i].platformId+","; 
                    }
                    this.strPlatform=this.strPlatform.substring(0,this.strPlatform.length-1);
                    this.getData();
                } else {           
                    this.platformOptions =[];
                    this.strPlatform = "";
                    console.log(this.responseResult);
                    console.log("平台列表获取失败");
                }
                })
                .catch(failResponse => {});
            },
            getServerList(platformId) {
                this.$axios
                .post(this.url+"/getServerListForPlatform", {
                platformId: platformId,
                gameId:this.$gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("平台服务器列表获取成功");
                    this.serverOptions = successResponse.data.data;
                } else {
                    this.serverOptions = [];
                    console.log(this.responseResult);
                    console.log("平台服务器列表获取失败");
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
            selectisToBan(){
                this.getData();
            },
            formatDatetime(row, column) {
                //时间格式化
                var date = row[column.property];
                return formatDatetime(date);
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
            formatisToBan(row, column, cellValue, index){
                return row.isToBan == 1 ? '禁封' : '解除禁封';
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
