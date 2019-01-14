<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>游戏管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <span class="grid-content bg-purple-light">状态：</span>
                
                <el-select v-model="searchKey.state" placeholder="筛选状态" @change="stateSelect" class="handle-select mr10">
                    <el-option key="1" label="全部" value="0"></el-option>
                    <el-option key="2" label="冻结" value="1"></el-option>
                     <el-option key="3" label="未冻结" value="2"></el-option>
                </el-select>

                <span class="grid-content bg-purple-light">游戏名：</span>
                <el-input v-model="searchKey.gameName" placeholder="筛选游戏名" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">游戏标识：</span>
                <el-input v-model="searchKey.gameTag" placeholder="筛选游戏标识" class="handle-input " style="width:150px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleAddGame">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="id" label="ID"  width="80">
                </el-table-column>
                <el-table-column prop="gameName" label="游戏名称" width="160">
                </el-table-column>
                <el-table-column prop="gameTag" label="游戏标识" >
                </el-table-column>
                <el-table-column prop="game_describe" label="描述" >
                </el-table-column> 
                <!-- <el-table-column prop="gameEncryptSign" label="加密标识" >
                </el-table-column>  -->
                <el-table-column prop="serverApi" label="服务器接口" width="210" >
                </el-table-column> 
                <el-table-column prop="state" label="状态" width="100" :formatter="formatState">
                </el-table-column>
                <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter" value-format="YYYY-MM-DD HH:mm:ss">
                </el-table-column>
                <el-table-column prop="addUser"  label="添加人" >
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
        <el-dialog title="添加游戏" :modal="false"  :close-on-click-modal="false" :visible.sync="addGameVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="游戏名称">
                    <el-input v-model="form.gameName"></el-input>
                </el-form-item>
                <el-form-item label="游戏标识">
                    <el-input v-model="form.gameTag"></el-input>
                </el-form-item>
                <el-form-item label="游戏描述">
                    <el-input v-model="form.game_describe"></el-input>
                </el-form-item>
                <!-- <el-form-item label="游戏加密标识">
                    <el-input v-model="form.gameEncryptSign"></el-input>
                </el-form-item> -->
                <el-form-item label="服务器接口">
                    <el-input v-model="form.serverApi" ></el-input>
                </el-form-item>
                <el-form-item label="添加人">
                    <el-input v-model="form.addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addGameVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddGame">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑游戏" :modal="false"  :close-on-click-modal="false" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="游戏名称">
                    <el-input v-model="form.gameName"></el-input>
                </el-form-item>
                <el-form-item label="游戏标识">
                    <el-input v-model="form.gameTag"></el-input>
                </el-form-item>
                <el-form-item label="游戏描述">
                    <el-input v-model="form.game_describe"></el-input>
                </el-form-item>
                <!-- <el-form-item label="游戏加密标识">
                    <el-input v-model="form.gameEncryptSign"></el-input>
                </el-form-item> -->
                <el-form-item label="服务器接口">
                    <el-input v-model="form.serverApi"></el-input>
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
            <div class="del-dialog-cnt">冻结后将停止游戏使用，是否确定冻结？</div>
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
        name: 'GameTable',
        data() {
            return {
                url:"http://localhost:8011",
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                editPasswordVisible:false,
                changeStateToFrozenVisible:false,
                changeStateToNormalVisible:false,
                addGameVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    gameName:'',
                    gameTag:'',
                    game_describe: '',
                    gameEncryptSign:'',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    serverApi:''
                },
                searchKey: {
                    id:'',
                    gameName:'',
                    gameTag:'',
                    game_describe: '',
                    gameEncryptSign:'',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    serverApi:''
                },
                idx: -1,
                responseResult:[],
                id:""
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
            right(){
                const right = localStorage.getItem('rightTags');
                const username = localStorage.getItem('ms_username');
                if(right.indexOf('Game_management_Handle')==-1){
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
                this.getData();
            },
            getData() {

                this.$axios.post(this.url+'/getAllGame', {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    id:'',
                    gameName:this.searchKey.gameName,
                    gameTag:this.searchKey.gameTag,
                    game_describe: this.searchKey.game_describe,
                    sort:this.searchKey.sort,
                    addUser: '',
                    addDatetime: '',
                    state:this.searchKey.state,
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("游戏列表获取失败");
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
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    gameName:item.gameName,
                    gameTag:item.gameTag,
                    game_describe: item.game_describe,
                    sort:item.sort,
                    addUser: item.addUser,
                    addDatetime: item.addDatetime,
                    state:item.state,
                    gameEncryptSign:item.gameEncryptSign,
                    serverApi:item.serverApi
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
                this.$axios.post(this.url+'/deleteAllGame',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("游戏批量删除完成");
                        this.multipleSelection = []; 
                        this.getData();
                        //添加组件通讯
                        bus.$emit('changeGame', {
                        message:"游戏列表改变"
                        });
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("游戏批量删除失败");
                    }
                })
                .catch(failResponse => {})
                 
                this.delAllVisible = false;

            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddGame(){
                this.addGameVisible = true;
                this.form = {
                    id:'',
                    GameName:'',
                    GameTag:'',
                    Game_describe: '',
                    GameParentId:'',
                    GameSort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    gameEncryptSign:'',
                    serverApi:''
                }
            },
            saveAddGame(){
                if(this.form.gameName==""){
                    console.log("游戏名称不能为空");
                    this.$message.error("游戏名称不能为空");
                }else if(this.form.gameTag==""){
                    console.log("游戏标识不能为空");
                    this.$message.error("游戏标识不能为空");
                }else{
                    this.$axios.post(this.url+'/addGame',{ 

                        id: this.form.id,
                        gameName:this.form.gameName,
                        gameTag:this.form.gameTag,
                        game_describe: this.form.game_describe,
                        sort:this.form.sort,
                        addUser: this.form.addUser,
                        state:this.form.state,
                        gameEncryptSign:this.form.gameEncryptSign,
                        serverApi:this.form.serverApi
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("游戏添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                            this.addGameVisible = false;
                            //添加组件通讯
                            bus.$emit('changeGame', {
                            message:"游戏列表改变"
                            });
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("游戏添加失败");
                        }
                    })
                    .catch(failResponse => {})
                    
                }               
                   
            },
            // 保存编辑
            saveEdit() {

                this.$axios.post(this.url+'/editGame',{
                    id:this.form.id,
                    gameName:this.form.gameName,
                    gameTag:this.form.gameTag,
                    game_describe: this.form.game_describe,
                    sort:this.form.sort,
                    addUser: this.form.addUser,
                    addDatetime: this.form.addDatetime,
                    state:this.form.state,
                    gameEncryptSign:this.form.gameEncryptSign,
                    serverApi:this.form.serverApi
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("游戏信息修改成功");
                        this.getData();
                        //添加组件通讯
                        bus.$emit('changeGame', {
                        message:"游戏列表改变"
                        });
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("游戏信息修改失败");
                    }
                })
                .catch(failResponse => {})
                this.editVisible = false;
            },
            // 确定冻结
            changeStateToFrozen(){
                this.$axios.post(this.url+'/changeStateToFrozen_Game',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`游戏冻结成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('游戏冻结失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToFrozenVisible = false;
                this.rest();
                
            },
            // 确定解冻
            changeStateToNormal(){
                this.$axios.post(this.url+'/changeStateToNormal_Game',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("游戏解冻成功");
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('游戏解冻失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToNormalVisible = false;
                this.rest();
                
            },
            // 确定删除
            deleteRow(){
                this.$axios.post(this.url+'/deleteGame',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`游戏删除成功`);
                            this.getData();
                            //添加组件通讯
                            bus.$emit('changeGame', {
                            message:"游戏列表改变"
                            });
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('游戏删除失败');
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
