<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>物品流通日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div class="handle-box">
                
                <span class="grid-content bg-purple-light">平台：</span>
                <el-select v-model="searchKey.platformId" @change="selectPlatform" placeholder="请选择平台" class="handle-select mr10">
                        <el-option key="0" label="全部" value="0"></el-option>
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">选择服务器</span>
                <el-select v-model="searchKey.serverId" @change="selectServer" placeholder="请选择服务器" style="width:150px">
                    <el-option
                    v-for="item in serverOptions"
                    :key="item.serverId"
                    :label="item.serverName"
                    :value="item.serverId">
                    </el-option>
                </el-select>

                <span class="grid-content bg-purple-light">玩家名：</span>
                <el-input v-model="searchKey.playerName" placeholder="筛选玩家名" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">玩家账号：</span>
                <el-input v-model="searchKey.playerAccount" placeholder="筛选玩家账号" class="handle-input " style="width:150px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="platform" label="平台" >
                </el-table-column>
                <el-table-column prop="server" label="服务器" >
                </el-table-column>
                <el-table-column prop="iEventId" label="操作ID" >
                </el-table-column>
                <el-table-column prop="iWorldId" label="游戏大区ID" >
                </el-table-column>
                <el-table-column prop="iUin" label="用户ID" >
                </el-table-column>
                <el-table-column prop="dtEventTime" label="记录时间" :formatter="formatDatetime">
                </el-table-column>
                <el-table-column prop="iRoleId" label="角色ID" >
                </el-table-column>
                <el-table-column prop="vRoleName" label="角色名" >
                </el-table-column>
                <el-table-column prop="vOperate" label="操作类型" >
                </el-table-column>
                <el-table-column prop="iGoodsId" label="物品id" >
                </el-table-column>
                <el-table-column prop="vGoodsName" label="物品名字" >
                </el-table-column>
                <el-table-column prop="iCount" label="个数" >
                </el-table-column>
                <el-table-column prop="iTotalCount" label="总个数" >
                </el-table-column>
                <el-table-column prop="iIdentifier" label="得失" :formatter="formatIsGetOrLost">
                </el-table-column>
                <!-- <el-table-column prop="dt" label="时间日期" >
                </el-table-column> -->

            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-sizes="[15, 30, 50, 100]" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../common/bus';
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
    export default {
        name: 'playerLogTable',
        data() {
            return {
                activeNames: ['1'],
                url:"http://localhost:8011",
                tableData: [],
                cur_page: 1,
                pager:0,
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
            console.log("this.$gameId:"+this.$gameId);
            this.getPlatformList(this.$gameId);
            console.log(this.strPlatform);
            this.getData();
            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.getPlatformList(this.$gameId);
            }.bind(this))
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
                this.$axios.post(this.url+'/api/log/getPlayerLogByPlayerId', {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(successResponse.data);
                        this.tableData = successResponse.data.data.list;
                        console.log(this.tableData);
                        this.total = successResponse.data.data.total;
                        this.mapData();

                    }else{
                        
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("物品流通日志失败");
                    }
                })
            },
            mapData(){
                
            },
                // 分页导航
            handleCurrentChange(val) {
            this.cur_page = val;
            console.log("page:" + val);
            this.getData();
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
                    console.log(this.responseResult);
                    console.log("渠道列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                    this.strPlatform = "";
                    for(var i = 0;i<this.platformOptions.length;i++){
                        this.strPlatform += this.platformOptions[i].platformId+",";
                        
                    }
                    this.strPlatform=this.strPlatform.substring(0,this.strPlatform.length-1);
                    this.getData();
                } else {           
                    console.log(this.responseResult);
                    console.log("渠道列表获取失败");
                }
                })
                .catch(failResponse => {});
            },
            getServerList(){

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
                    this.serverOptions = successResponse.data.data;
                } else {
                    console.log(this.responseResult);
                    console.log("渠道服务器列表获取失败");
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
            formatIsGetOrLost(row, column){
                var str = row[column.property];
                return str=="1" ? "得到":"失去"
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
