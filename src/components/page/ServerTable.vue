<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>服务器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                     备注：
                    <br/>
                    一个服务器对应一个且唯一的渠道平台，在添加和修改服务器的时候必须指定对应的游渠道平台。
                    <br/>
                    </div>
                
                <Divider />
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <span class="grid-content bg-purple-light">状态：</span>
                
                <el-select v-model="searchKey.state" placeholder="筛选" @change="stateSelect" class="handle-select mr10">
                    <!-- @change="stateSelect" -->
                    <el-option key="1" label="全部" value="0"></el-option>
                    <el-option key="2" label="冻结" value="1"></el-option>
                     <el-option key="3" label="未冻结" value="2"></el-option>
                </el-select>

                <span class="grid-content bg-purple-light">服务器名：</span>
                <el-input v-model="searchKey.server" placeholder="筛选服务器名" class="handle-input " style="width:120px"></el-input>

                <span class="grid-content bg-purple-light">服务器IP：</span>
                <el-input v-model="searchKey.serverIp" placeholder="筛选服务器IP" class="handle-input " style="width:120px"></el-input>

                <span class="grid-content bg-purple-light">渠道平台：</span>
                <el-input v-model="searchKey.platform" placeholder="渠道平台" class="handle-input " style="width:120px"></el-input>

                <span class="grid-content bg-purple-light">游戏：</span>
                <el-input v-model="searchKey.gameName" placeholder="游戏" class="handle-input " style="width:120px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleAddServer">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="id" label="ID"  width="80">
                </el-table-column>
                <el-table-column prop="server" label="服务器名称" width="160">
                </el-table-column>
                <el-table-column prop="serverIp" label="服务器IP" >
                </el-table-column>
                <el-table-column prop="serverPort" label="服务器端口" >
                </el-table-column>
                <el-table-column prop="gameName" label="所属游戏" width="120">
                </el-table-column>
                <el-table-column prop="platform" label="所属渠道" width="120">
                </el-table-column>
                <el-table-column prop="server_describe" label="描述" >
                </el-table-column> 
                <el-table-column prop="state" label="状态" width="100" :formatter="formatState">
                </el-table-column>
                <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter" value-format="YYYY-MM-DD HH:mm:ss">
                </el-table-column>
                <el-table-column prop="addUser"  label="添加人" >
                </el-table-column>
                <el-table-column prop="sort" width="50" label="排序" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeStateToFrozen(scope.$index, scope.row)" v-if="scope.row.state!=1">冻结</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleChangeStateToNormal(scope.$index, scope.row)" v-if="scope.row.state==1">解冻</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加服务器" :modal="false"  :close-on-click-modal="false" :visible.sync="addServerVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="服务器名称">
                    <el-input v-model="form.server"></el-input>
                </el-form-item>
                <el-form-item label="服务器IP">
                    <el-input v-model="form.serverIp"></el-input>
                </el-form-item>
                <el-form-item label="服务器端口">
                    <el-input v-model="form.serverPort"></el-input>
                </el-form-item>
                <el-form-item label="服务器描述">
                    <el-input v-model="form.server_describe"></el-input>
                </el-form-item>
                <!-- <el-form-item label="所属游戏">
                    <el-select class="el-select" v-model="form.gameId" filterable placeholder="请选择游戏">
                        <el-option
                        v-for="item in gameList"
                        :key="item.id"
                        :label="item.gameName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="所属渠道">
                    <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择渠道">
                        <el-option
                        v-for="item in platformList"
                        :key="item.id"
                        :label="item.platform"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加人">
                    <el-input v-model="form.addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addServerVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddServer">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑服务器" :modal="false"  :close-on-click-modal="false" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="服务器名称">
                    <el-input v-model="form.server"></el-input>
                </el-form-item>
                <el-form-item label="服务器IP">
                    <el-input v-model="form.serverIp"></el-input>
                </el-form-item>
                <el-form-item label="服务器端口">
                    <el-input v-model="form.serverPort"></el-input>
                </el-form-item>
                <el-form-item label="服务器描述">
                    <el-input v-model="form.server_describe"></el-input>
                </el-form-item>
                <!-- <el-form-item label="所属游戏">
                    <el-select class="el-select" v-model="form.gameId" filterable placeholder="请选择游戏">
                        <el-option
                        v-for="item in gameList"
                        :key="item.id"
                        :label="item.gameName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="所属渠道">
                    <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择渠道">
                        <el-option
                        v-for="item in platformList"
                        :key="item.id"
                        :label="item.platform"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加人">
                    <el-input v-model="form.addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑冻结提示框 -->
        <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
            <div class="del-dialog-cnt">冻结后将停止服务器使用，是否确定冻结？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeStateToFrozenVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeStateToFrozen">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解冻提示框 -->
        <el-dialog title="解冻提示" :visible.sync="changeStateToNormalVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定解冻？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeStateToNormalVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeStateToNormal">确 定</el-button>
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
    export default {
        name: 'serverTable',
        data() {
            return {
                url:'/getAllServer',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                editPasswordVisible:false,
                changeStateToFrozenVisible:false,
                changeStateToNormalVisible:false,
                addServerVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    server:'',
                    gameId:'',
                    platformId:'',
                    serverIP:'',
                    serverPort:'',
                    server_describe: '',
                    parentId:'',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    gameName:'',
                    role:'',
                },
                searchKey: {
                    id:'',
                    server:'',
                    serverIp:'',
                    serverPort:'',
                    server_describe: '',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    gameName:'',
                    platform:''
                },
                idx: -1,
                responseResult:[],
                id:"",
                gameList:[
                    {
                        id:1,
                        gameName:"游戏1"
                    },
                    {
                        id:2,
                        gameName:"游戏2"
                    },
                ],
                platformList:[
                    {
                        id:1,
                        role:"渠道1"
                    },
                    {
                        id:2,
                        role:"渠道2"
                    },
                ],
                selectGame:"",
                selectPlatform:""

            }
        },
        created() {
            this.getData();
            this.right();
        
        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        mounted() {
            this.right();
        },
        methods: {
            getGameList(){
                this.$axios.post('/getAllGameList',{
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        console.log("游戏列表获取成功");
                        this.gameList = successResponse.data.data;
                        //this.gameList
                        
                    }else{
                        this.open4(successResponse.data.message);
                        console.log(this.responseResult);
                        console.log("游戏列表获取失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
            },
            getPlatformList(){
                this.$axios.post('/getAllPlatformList',{
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        console.log("渠道列表获取成功");
                        this.platformList = successResponse.data.data;
                        //this.gameList
                        
                    }else{
                        this.open4(successResponse.data.message);
                        console.log(this.responseResult);
                        console.log("渠道列表获取失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
            },
            right(){
                const right = localStorage.getItem('rightTags');
                if(right==null){
                    this.handleVisible = false;
                }else if(right.indexOf('Server_management_Handle')==-1){
                    this.handleVisible = false;
                }else{
                    this.handleVisible = true;
                }
                //console.log("this.handleVisible:"+this.handleVisible);
            },
            //重置表单
            rest() {
                //this.getData();
                //this.$refs.multipleTable.resetFields();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                console.log("page:"+val);
                this.getData();
            },
            getData() {

                this.$axios.post(this.url, {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    id:'',
                    server:this.searchKey.server,
                    gameId:'',
                    gameName:this.searchKey.gameName,
                    platformId:'', 
                    platform:this.searchKey.platform, 
                    serverIp:this.searchKey.serverIp,
                    server_describe: this.searchKey.server_describe,
                    sort:this.searchKey.sort,
                    addUser: '',
                    addDatetime: '',
                    state:this.searchKey.state,
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("服务器列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("服务器列表获取失败");
                        return false;
                    }
                })
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            stateSelect(){
                 this.getData();
            },
            formatter(row, column) {
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
            handleEdit(index, row) {
                //this.getGameList();
                this.getPlatformList();
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    server:item.server,
                    serverIp:item.serverIp,
                    server_describe: item.server_describe,
                    sort:item.sort,
                    addUser: item.addUser,
                    addDatetime: item.addDatetime,
                    state:item.state,
                    gameId:item.gameId,
                    roleId:item.roleId,
                    platformId:item.platformId,
                    serverPort:item.serverPort
                }
                this.editVisible = true;
            },
            handleChangeStateToFrozen(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.id = this.tableData[index].id;
                this.changeStateToFrozenVisible = true;
            },
            handleChangeStateToNormal(index, row){
                this.idx = index;
                const item = this.tableData[index];
                this.id = this.tableData[index].id;
                this.changeStateToNormalVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.id = this.tableData[index].id;
                
            },
            delAll() {
                this.del_list = this.del_list.concat(this.multipleSelection);
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
                this.$axios.post('/deleteAllServer',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("服务器批量删除完成");
                        this.multipleSelection = []; 
                        this.getData();

                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("服务器批量删除失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
                 
                this.delAllVisible = false;

            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddServer(){
                //this.getGameList();
                this.getPlatformList();
                this.addServerVisible = true;
                this.form = {
                    id:'',
                    server:'',
                    serverTag:'',
                    server_describe: '',
                    serverParentId:'',
                    serverSort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    serverPort:''
                }
                this.selectGame="";
                this.selectPlatform="";
                
            },
            saveAddServer(){
                if(this.form.server==""){
                    console.log("服务器名称不能为空");
                    this.$message.error("服务器名称不能为空");
                }else if(this.form.platformId==""){
                    console.log("所属渠道不能为空");
                    this.$message.error("所属渠道不能为空");
                }else{

                    this.$axios.post('/addServer',{

                        id: this.form.id,
                        server:this.form.server,
                        serverIp:this.form.serverIp,
                        server_describe: this.form.server_describe,
                        sort:this.form.sort,
                        addUser: this.form.addUser,
                        state:this.form.state,
                        gameId:"",
                        platformId:this.form.platformId,
                        serverPort:this.form.serverPort
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            console.log(this.responseResult);
                            this.$message.success("服务器添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                        }else{
                            this.open4(successResponse.data.message);
                            console.log('error');
                            console.log(this.responseResult);
                            this.$message.error("服务器添加失败");
                            return false;
                        }
                    })
                    .catch(failResponse => {})
                    this.addServerVisible = false; 
                }               

            },
            // 保存编辑
            saveEdit() {

                this.$axios.post('/editServer',{
                    id:this.form.id,
                    server:this.form.server,
                    serverIp:this.form.serverIp,
                    server_describe: this.form.server_describe,
                    sort:this.form.sort,
                    addUser: this.form.addUser,
                    addDatetime: this.form.addDatetime,
                    state:this.form.state,
                    gameId:"",
                    platformId:this.form.platformId,
                    serverPort:this.form.serverPort

                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        //this.$router.push('/');
                        //this.$router.replace({path: '/index'})
                        this.$message.success("服务器信息修改成功");
                        this.getData();
                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("服务器信息修改失败");
                        return false;
                    }
                })
                .catch(failResponse => {})

                //受 ES5 的限制，Vue.js 不能检测到对象属性的添加或删除(不包括修改)。因为 Vue.js 在初始化实例时将属性转为 getter/setter
                //this.$set(this.data,”key”,value’)  添加属性
                //this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                
                
            },
            // 确定冻结
            changeStateToFrozen(){
                this.$axios.post('/changeStateToFrozen_Server',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            console.log(this.responseResult);
                            this.$message.success(`服务器冻结成功`);
                            this.getData();
                        }else{
                            this.open4(successResponse.data.message);
                            console.log('error');
                            console.log(this.responseResult);
                            this.$message.error('服务器冻结失败');
                            return false;
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToFrozenVisible = false;
                this.rest();
                
            },
            // 确定解冻
            changeStateToNormal(){
                this.$axios.post('/changeStateToNormal_Server',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            console.log(this.responseResult);
                            this.$message.success("服务器解冻成功");
                            this.getData();
                        }else{
                            this.open4(successResponse.data.message);
                            console.log('error');
                            console.log(this.responseResult);
                            this.$message.error('服务器解冻失败');
                            return false;
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToNormalVisible = false;
                this.rest();
                
            },
            // 确定删除
            deleteRow(){

                this.$axios.post('/deleteserver',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            console.log(this.responseResult);
                            this.$message.success(`服务器删除成功`);
                            //必须异步处理
                            this.getData();
                        }else{
                            this.open4(successResponse.data.message);
                            console.log('error');
                            console.log(this.responseResult);
                            this.$message.error('服务器删除失败');
                            return false;
                        }
                    })
                    .catch(failResponse => {})    
                
                this.tableData.splice(this.idx, 1);
                
                this.delVisible = false;
                
            },
            // formatSex: function (row, column, cellValue, index) {
			// return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            // }
            // ,
            formatState: function (row, column, cellValue, index) { 
			return row.state == 1 ? '已冻结' : row.sex == 0 ? '正常' : '正常';
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
