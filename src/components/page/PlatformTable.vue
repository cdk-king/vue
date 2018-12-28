<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>平台管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                     备注：
                    <br/>
                    一个渠道平台对应一个且唯一的游戏和角色，在添加和修改渠道平台的时候必须指定对应的游戏的角色。
                    <br/>
                    </div>
                
                <Divider />
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <span class="grid-content bg-purple-light">状态：</span>
                
                <el-select v-model="searchKey.state" placeholder="筛选" @change="stateSelect" class="handle-select mr10">
                    <el-option key="1" label="全部" value="0"></el-option>
                    <el-option key="2" label="冻结" value="1"></el-option>
                     <el-option key="3" label="未冻结" value="2"></el-option>
                </el-select>

                <span class="grid-content bg-purple-light">平台名：</span>
                <el-input v-model="searchKey.platformName" placeholder="筛选平台名" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">平台标识：</span>
                <el-input v-model="searchKey.platformTag" placeholder="筛选平台标识" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">游戏：</span>
                <el-input v-model="searchKey.gameName" placeholder="筛选游戏" class="handle-input " style="width:150px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleAddplatform">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="id" label="ID"  width="80">
                </el-table-column>
                <el-table-column prop="platformId" label="平台ID"  width="80">
                </el-table-column>
                <el-table-column prop="platform" label="平台名称" width="160">
                </el-table-column>
                <el-table-column prop="platformTag" label="平台标识" >
                </el-table-column>
                <el-table-column prop="gameName" label="所属游戏" width="120">
                </el-table-column>
                <el-table-column prop="role" label="对应角色" width="120">
                </el-table-column>
                <el-table-column prop="platform_describe" label="描述" >
                </el-table-column> 
                <el-table-column prop="state" label="状态" width="100" :formatter="formatState">
                </el-table-column>
                <el-table-column prop="platform_describe" label="描述" >
                </el-table-column> 
                <!-- <el-table-column prop="dataSource_url" label="数据库地址" >
                </el-table-column> -->
                <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter" value-format="YYYY-MM-DD HH:mm:ss">
                </el-table-column>
                <el-table-column prop="addUser"  label="添加人" >
                </el-table-column>
                <el-table-column prop="sort" width="50" label="排序" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible" fixed="right">
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
        <el-dialog title="添加平台" :modal="false"  :close-on-click-modal="false" :visible.sync="addplatformVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="平台名称">
                    <el-input v-model="form.platform"></el-input>
                </el-form-item>
                <el-form-item label="平台ID">
                    <el-input v-model="form.platformId"></el-input>
                </el-form-item>
                <el-form-item label="平台标识">
                    <el-input v-model="form.platformTag"></el-input>
                </el-form-item>
                <el-form-item label="平台描述">
                    <el-input v-model="form.platform_describe"></el-input>
                </el-form-item>
                <el-form-item label="所属游戏">
                    <el-select class="el-select" v-model="form.gameId" filterable placeholder="请选择游戏">
                        <el-option
                        v-for="item in gameList"
                        :key="item.id"
                        :label="item.gameName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应角色">
                    <el-select class="el-select" v-model="form.roleId" filterable placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.role"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加人">
                    <el-input v-model="form.addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addplatformVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddplatform">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑平台" :modal="false"  :close-on-click-modal="false" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="平台名称">
                    <el-input v-model="form.platform"></el-input>
                </el-form-item>
                <el-form-item label="平台ID">
                    <el-input v-model="form.platformId"></el-input>
                </el-form-item>
                <el-form-item label="平台标识">
                    <el-input v-model="form.platformTag"></el-input>
                </el-form-item>
                <el-form-item label="平台描述">
                    <el-input v-model="form.platform_describe"></el-input>
                </el-form-item>
                <el-form-item label="所属游戏">
                    <el-select class="el-select" v-model="form.gameId" filterable placeholder="请选择游戏">
                        <el-option
                        v-for="item in gameList"
                        :key="item.id"
                        :label="item.gameName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应角色">
                    <el-select class="el-select" v-model="form.roleId" filterable placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.role"
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
            <div class="del-dialog-cnt">冻结后将停止平台使用，是否确定冻结？</div>
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
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
    export default {
        name: 'platformTable',
        data() {
            return {
                url:"http://localhost:8011",
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
                addplatformVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    platformId:'',
                    platform:'',
                    gameId:'',
                    roleId:'',
                    platformTag:'',
                    platform_describe: '',
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
                    platformId:'',
                    platform:'',
                    platformTag:'',
                    platform_describe: '',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    gameName:'',
                },
                idx: -1,
                responseResult:[],
                id:"",
                gameList:[

                ],
                roleList:[

                ],
                selectGame:"",
                selectRole:""
            }
        },
        created() {
            setLocalThisUrl(this);
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
                this.$axios.post(this.url+'/getAllGameList',{
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("游戏列表获取成功");
                        this.gameList = successResponse.data.data;
                    }else{
                        console.log(this.responseResult);
                        console.log("游戏列表获取失败");
                    }
                })
                .catch(failResponse => {})
            },
            getRoleList(){
                this.$axios.post(this.url+'/getAllRoleList',{
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("角色列表获取成功");
                        this.roleList = successResponse.data.data;       
                    }else{
                        console.log(this.responseResult);
                        console.log("角色列表获取失败");
                    }
                })
                .catch(failResponse => {})
            },
            right(){
                const right = localStorage.getItem('rightTags');
                const username = localStorage.getItem('ms_username');
                if(right.indexOf('Platform_management_Handle')==-1){
                    this.handleVisible = false;
                }else{
                    this.handleVisible = true;
                }
            },
            //重置表单
            rest() {
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                console.log("page:"+val);
                this.getData();
            },
            getData() {
                this.$axios.post(this.url+'/getAllPlatform', {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    platformId:'',
                    id:'',
                    platform:this.searchKey.platform,
                    gameId:'',
                    roleId:'',
                    platformTag:this.searchKey.platformTag,
                    platform_describe: this.searchKey.platform_describe,
                    sort:this.searchKey.sort,
                    addUser: '',
                    addDatetime: '',
                    state:this.searchKey.state,
                    gameName:this.searchKey.gameName
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("平台列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("平台列表获取失败");
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
                //时间格式化               
                var date = row[column.property];
                return formatDatetime(date);
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.getGameList();
                this.getRoleList();
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    platformId:item.platformId,
                    platform:item.platform,
                    platformTag:item.platformTag,
                    platform_describe: item.platform_describe,
                    sort:item.sort,
                    addUser: item.addUser,
                    addDatetime: item.addDatetime,
                    state:item.state,
                    gameId:item.gameId,
                    roleId:item.roleId
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
                //批量删除处理
                this.$axios.post(this.url+'/deleteAllPlatform',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("平台批量删除完成");
                        this.multipleSelection = []; 
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("平台批量删除失败");
                    }
                })
                .catch(failResponse => {})
                this.delAllVisible = false;
            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddplatform(){
                this.getGameList();
                this.getRoleList();
                this.addplatformVisible = true;
                this.form = {
                    id:'',
                    platformId: '',
                    platformName:'',
                    platformTag:'',
                    platform_describe: '',
                    platformParentId:'',
                    platformSort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                }
                this.selectGame="";
                this.selectRole="";
            },
            saveAddplatform(){
                if(this.form.platform==""){
                    console.log("平台名称不能为空");
                    this.$message.error("平台名称不能为空");
                }else if(this.form.gameId==""){
                    console.log("所属游戏不能为空");
                    this.$message.error("所属游戏不能为空");
                }else if(this.form.roleId==""){
                    console.log("对应角色不能为空");
                    this.$message.error("对应角色不能为空");
                }else{
                    this.$axios.post(this.url+'/addPlatform',{

                        platformId: this.form.platformId,
                        platform:this.form.platform,
                        platformTag:this.form.platformTag,
                        platform_describe: this.form.platform_describe,
                        sort:this.form.sort,
                        addUser: this.form.addUser,
                        state:this.form.state,
                        gameId:this.form.gameId,
                        roleId:this.form.roleId
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("平台添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("平台添加失败");
                        }
                    })
                    .catch(failResponse => {})
                    this.addplatformVisible = false; 
                }               
            },
            // 保存编辑
            saveEdit() {
                this.$axios.post(this.url+'/editPlatform',{
                    id:this.form.id,
                    platformId: this.form.platformId,
                    platform:this.form.platform,
                    platformTag:this.form.platformTag,
                    platform_describe: this.form.platform_describe,
                    sort:this.form.sort,
                    addUser: this.form.addUser,
                    addDatetime: this.form.addDatetime,
                    state:this.form.state,
                    gameId:this.form.gameId,
                    roleId:this.form.roleId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("平台信息修改成功");
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("平台信息修改失败");
                    }
                })
                .catch(failResponse => {})
                this.editVisible = false;  
            },
            // 确定冻结
            changeStateToFrozen(){
                this.$axios.post(this.url+'/changeStateToFrozen_Platform',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`平台冻结成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('平台冻结失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToFrozenVisible = false;
                this.rest();
            },
            // 确定解冻
            changeStateToNormal(){
                this.$axios.post(this.url+'/changeStateToNormal_Platform',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("平台解冻成功");
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('平台解冻失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToNormalVisible = false;
                this.rest();
            },
            // 确定删除
            deleteRow(){
                this.$axios.post(this.url+'/deletePlatform',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`平台删除成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('平台删除失败');
                        }
                    })
                    .catch(failResponse => {})    
                this.tableData.splice(this.idx, 1);
                this.delVisible = false;
            },
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
