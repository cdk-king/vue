<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>角色创建日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
                <el-collapse v-model="activeNames" >
                <el-collapse-item title="折叠" name="1">
                    <div class="form-box" style="width:100%">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="searchKey.platformId" @change="selectPlatform" placeholder="请选择平台" class="handle-select mr10" style="width:160px">
                                    <el-option key="0" label="全部" value="0"></el-option>
                                    <el-option
                                    v-for="item in platformOptions"
                                    :key="item.platformId"
                                    :label="item.platform"
                                    :value="item.platformId">
                                    </el-option>
                            </el-select>
                            <span class="grid-content bg-purple-light" style="margin-left:22px">选择服务器</span>
                            <el-select v-model="searchKey.serverId" @change="selectServer" placeholder="请选择服务器" style="width:160px">
                                <el-option
                                v-for="item in serverOptions"
                                :key="item.serverId"
                                :label="item.serverName"
                                :value="item.serverId">
                                </el-option>
                            </el-select>
                            </el-form-item>
                        <Divider />
                        
                        <el-form-item label="用户ID">
                                <el-input v-model="searchKey.iUin" placeholder="用户ID" class="handle-input " style="width:160px"></el-input>
                                <span style="margin-left:22px">角色ID</span>
                                <el-input v-model="searchKey.iRoleId" placeholder="角色ID" class="handle-input " style="width:160px"></el-input>
                                <span style="margin-left:22px">角色名</span>
                                <el-input v-model="searchKey.vRoleName" placeholder="角色名" class="handle-input " style="width:160px"></el-input>
                            
                        </el-form-item>
                        <el-form-item label="客户端所在ip">
                                <el-input v-model="searchKey.vClientIp" placeholder="客户端所在ip" class="handle-input " style="width:160px"></el-input>
                                <span style="margin-left:22px">登录渠道</span>
                                <el-input v-model="searchKey.iLoginWay" placeholder="登录渠道" class="handle-input " style="width:160px"></el-input>
                            
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" icon="search" @click="search">查询</el-button>
                        </el-form-item>
                        </el-form>
                    </div>
                </el-collapse-item>
                </el-collapse>
            <div class="handle-box">      

            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="platform" label="平台" >
                </el-table-column>
                <el-table-column prop="serverName" label="服务器" >
                </el-table-column>
                <el-table-column prop="iEventId" label="事件ID" >
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
                <el-table-column prop="iJobId" label="角色职业" >
                </el-table-column>
                <el-table-column prop="vClientIp" label="客户端所在ip" >
                </el-table-column>
                <el-table-column prop="iLoginWay" label="登录渠道" >
                </el-table-column>

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
                    platformId:"",
                    platform:"",
                    serverId:"",
                    server:"",
                },
                searchKey: {
                    platformId:"",
                    platform:"",
                    serverId:"",
                    server:"",
                    iUin:"",
                    iRoleId:"",
                    vRoleName:"",
                    vClientIp:"",
                    iLoginWay:""
                },
                platformOptions: [

                ],
                serverOptions:[],
                idx: -1,
                responseResult:[],
                id:"",
                strPlatform:"",
                serverList:[],
                serverIdList:""
            }
        },
        created() {
            setLocalThisUrl(this);
            console.log("this.$gameId:"+this.$gameId);
            this.getPlatformList(this.$gameId);
            this.getAllServerList();
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
            getData() {
                this.$axios.post(this.url+'/api/log/getCreateRoleLog', {
                    serverId:this.serverIdList,
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    iUin:this.searchKey.iUin,
                    iRoleId:this.searchKey.iRoleId,
                    vRoleName:this.searchKey.vRoleName,
                    vClientIp:this.searchKey.vClientIp,
                    iLoginWay:this.searchKey.iLoginWay
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                        this.mapData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("角色创建日志获取失败");
                    }
                })
            },
            mapData(){
                var len = this.tableData.length;
                for(var i = 0;i<len;i++){
                    for(var j = 0;j<this.serverList.length;j++){
                        if(this.serverList[j].serverId == this.tableData[i].iWorldId){
                            this.tableData[i].serverName=this.serverList[j].server;
                            this.tableData[i].platform=this.serverList[j].platform;
                        }
                    }
                }
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
            getAllServerList(){
                this.$axios
                .post(this.url + "/getAllServer", {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage: "",
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                    if (successResponse.data.code === 200) {
                        this.serverList = successResponse.data.data.list;
                    } else {
                        console.log(this.responseResult);
                        this.$message.error("服务器列表获取失败");
                    }
                });
            },
            getServerList(platformId) {
                this.$axios
                .post(this.url+"/getServerListForPlatform", {
                platformId: platformId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("渠道服务器列表获取成功");
                    this.serverOptions = successResponse.data.data;
                    for(var i = 0;i<this.serverOptions.length;i++){
                        this.serverIdList  = "";
                        this.serverIdList += this.serverOptions[i].serverId+",";
                    }
                    this.serverIdList = this.serverIdList.substring(0,this.serverIdList.length-1);
                    this.getData(); 
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
            selectPlatform(){
                this.getServerList(this.searchKey.platformId);
            },
            selectServer(){
                this.serverIdList = this.searchKey.serverId;
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
