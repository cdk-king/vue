<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
                <el-breadcrumb-item>现金流日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                备注：
                <br/>
                日志仅显示20天内的数据
                <br/>
            </div>
                <el-collapse v-model="activeNames" >
                <el-collapse-item title="折叠" name="1">
                    <div class="form-box" style="width:100%">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="searchKey.platformId" @change="selectPlatform" placeholder="请选择平台" class="handle-select mr10" style="width:160px">
                                    <el-option
                                    v-for="item in platformOptions"
                                    :key="item.platformId"
                                    :label="item.platform"
                                    :value="item.platformId">
                                    </el-option>
                            </el-select>
                            <i class="" style="color:red;font-size:18px">*</i>
                            <span class="grid-content bg-purple-light" style="margin-left:14px">选择服务器</span>
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
                <el-table-column :prop="item.name" :label="item.desc" v-for="item in formKey" :key="item.name" :formatter="formatDatetime">
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
                },
                platformOptions: [

                ],
                serverOptions:[],
                idx: -1,
                responseResult:[],
                id:"",
                strPlatform:"",
                serverList:[],
                serverIdList:"",
                logXml:"",
                formKey:[],
            }
        },
        created() {
            setLocalThisUrl(this);
            this.getPlatformList(this.$gameId);
            this.getAllServerList();
            this.getLogXml();
            this.getData();
            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.searchKey.platformId = "";
                this.searchKey.serverId = "";
                this.getPlatformList(this.$gameId);
            }.bind(this))
        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        beforeDestroy() {
            bus.$off("changeGameId");
        },
        mounted() {
        },
        methods: {
            getLogXml(){
                    this.$axios.post(this.url+'/api/log/getLogXml', {
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.logXml = successResponse.data.data;
                        this.getFormKey("MoneyFlowProduce");
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("getLogXml失败");
                    }
                })
            },
            getFormKey(str){
                var json = JSON.parse(this.logXml);
                for(var i = 0;i<json.length;i++){
                    if(json[i].name==str){
                        this.formKey = json[i].entry;
                        break;
                    }
                }
            },
            getData() {
                if(this.searchKey.platformId==""){
                    this.$message.info("请选择平台");
                    return;
                }
                const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$axios.post(this.url+'/api/log/getMoneyFlowLog', {
                    platformId:this.searchKey.platformId,
                    serverId:this.serverIdList,
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    iUin:this.searchKey.iUin,
                    iRoleId:this.searchKey.iRoleId,
                    vRoleName:this.searchKey.vRoleName,
                    gameId:this.$gameId
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                        this.mapData();
                        loading.close();
                    }else{
                        loading.close();
                        this.tableData=[];
                        console.log(this.responseResult);
                        this.$message.error("现金流日志获取失败");
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
                    console.log("平台列表获取成功");
                    this.platformOptions = successResponse.data.data.list;
                    this.strPlatform = "";
                    for(var i = 0;i<this.platformOptions.length;i++){
                        this.strPlatform += this.platformOptions[i].platformId+",";
                    }
                    this.strPlatform=this.strPlatform.substring(0,this.strPlatform.length-1);
                    this.getData();
                } else {           
                    this.platformOptions = [];
                    this.strPlatform="";
                    console.log(this.responseResult);
                    console.log("平台列表获取失败");
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
                    gameId:this.$gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                    if (successResponse.data.code === 200) {
                        this.serverList = successResponse.data.data.list;
                    } else {
                        this.serverList = [];
                        console.log(this.responseResult);
                        this.$message.error("服务器列表获取失败");
                    }
                });
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
                    this.serverIdList  = "";
                    for(var i = 0;i<this.serverOptions.length;i++){
                        
                        this.serverIdList += this.serverOptions[i].serverId+",";
                    }
                    this.serverIdList = this.serverIdList.substring(0,this.serverIdList.length-1);
                    this.getData(); 
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
            selectPlatform(){
                this.getServerList(this.searchKey.platformId);
            },
            selectServer(){
                this.serverIdList = this.searchKey.serverId;
                this.getData();
            },
            formatDatetime(row, column) {
                if(column.property=="dtEventTime"){
                    var date = row[column.property];
                    return formatDatetime(date);
                }
                return row[column.property];
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
