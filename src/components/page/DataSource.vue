<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>数据源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                     备注：
                    <br/>
                    一个数据源对应一个且唯一的平台，在添加和修改数据源的时候必须指定对应的平台。
                    <br/>
                    </div>
                <Divider />
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>

                <span class="grid-content bg-purple-light">平台：</span>
                <el-select
                v-model="searchKey.platformId"
                @change="selectPlatform"
                placeholder="请选择渠平台"
                class="handle-select mr10"
                >
                <el-option key="0" label="全部" value="0"></el-option>
                <el-option
                    v-for="item in platformOptions"
                    :key="item.platformId"
                    :label="item.platform"
                    :value="item.platformId"
                ></el-option>
                </el-select>

                <span class="grid-content bg-purple-light">数据源地址：</span>
                <el-input
                v-model="searchKey.dataSource_url"
                placeholder="数据源地址"
                class="handle-input"
                style="width:120px"
                ></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleAddplatform">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="id" label="ID"  width="80">
                </el-table-column>
                <el-table-column prop="platform" label="平台"  >
                </el-table-column>
                <el-table-column prop="dataSource_id" label="数据源ID" >
                </el-table-column>
                <el-table-column prop="dataSource_url" label="数据源地址" width="300px">
                </el-table-column>
                <el-table-column prop="dataSource_name" label="数据源用户名">
                </el-table-column>
                <el-table-column prop="dataSource_password" label="数据源密码" >
                </el-table-column>
                <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter" value-format="YYYY-MM-DD HH:mm:ss">
                </el-table-column>
                <el-table-column prop="addUser"  label="添加人" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="数据源ID">
                    <el-input v-model="form.dataSource_id"></el-input>
                </el-form-item>
                <el-form-item label="数据源地址">
                    <el-input v-model="form.dataSource_url"></el-input>
                </el-form-item>
                <el-form-item label="数据源用户名">
                    <el-input v-model="form.dataSource_name"></el-input>
                </el-form-item>
                <el-form-item label="数据源密码">
                    <el-input v-model="form.dataSource_password"></el-input>
                </el-form-item>
                <el-form-item label="所属平台">
                <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择渠道">
                    <el-option
                    v-for="item in platformOptions"
                    :key="item.platformId"
                    :label="item.platform"
                    :value="item.platformId"
                    ></el-option>
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
                <el-form-item label="数据源ID">
                    <el-input v-model="form.dataSource_id"></el-input>
                </el-form-item>
                <el-form-item label="数据源地址">
                    <el-input v-model="form.dataSource_url"></el-input>
                </el-form-item>
                <el-form-item label="数据源用户名">
                    <el-input v-model="form.dataSource_name"></el-input>
                </el-form-item>
                <el-form-item label="数据源密码">
                    <el-input v-model="form.dataSource_password"></el-input>
                </el-form-item>
                <el-form-item label="所属平台">
                <el-select class="el-select" v-model="form.platformId" filterable placeholder="请选择渠道">
                    <el-option
                    v-for="item in platformOptions"
                    :key="item.platformId"
                    :label="item.platform"
                    :value="item.platformId"
                    ></el-option>
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
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                addplatformVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    platformId:'',
                    dataSource_id:'',
                    dataSource_url:'',
                    dataSource_name:'',
                    dataSource_password:'',
                    addUser: '',
                    addDatetime: '',
                    isDelete:''
                },
                searchKey: {
                    id:'',
                    platformId:'',
                    dataSource_id:'',
                    dataSource_url:'',
                    dataSource_name:'',
                    dataSource_password:'',
                    addUser: '',
                    addDatetime: '',
                    isDelete:''
                },
                idx: -1,
                responseResult:[],
                id:"",
                platformOptions:[]
            }
        },
        created() {
            setLocalThisUrl(this);
            this.getAllPlatform();
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
            getAllPlatform() {
            console.log("this.$gameId:" + this.$gameId);
            this.$axios
                .post(this.url + "/getPlatformListForGameId", {
                    id: this.$gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                    if (successResponse.data.code === 200) {
                        console.log("平台获取成功");
                        this.platformOptions = successResponse.data.data.list;
                    } else {
                        console.log(this.responseResult);
                        console.log("平台获取失败");
                    }
                })
                .catch(failResponse => {});
            },
            right(){
                const right = localStorage.getItem('rightTags');
                const username = localStorage.getItem('ms_username');
                if(right.indexOf('DataSource_Handle')==-1){
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
                this.$axios.post(this.url+'/api/db/getDataSource', {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    id:'',
                    platformId:this.searchKey.platformId,
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("数据源列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("数据源列表获取失败");
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
                    platformId:item.platformId,
                    dataSource_id:item.dataSource_id,
                    dataSource_url:item.dataSource_url,
                    dataSource_name:item.dataSource_name ,
                    dataSource_password:item.dataSource_password,
                    addUser: item.addUser,
                    addDatetime: item.addDatetime,
                    isDelete:item.isDelete
                }
                this.editVisible = true;
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
                this.$axios.post(this.url+'/api/db/deleteAllDataSource',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("数据源批量删除完成");
                        this.multipleSelection = []; 
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("数据源批量删除失败");
                    }
                })
                .catch(failResponse => {})
                this.delAllVisible = false;
            }, 
            selectPlatform(){
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddplatform(){
                this.addplatformVisible = true;
                this.form = {
                    id:'',
                    platformId:'',
                    dataSource_id:'',
                    dataSource_url:'',
                    dataSource_name:'',
                    dataSource_password:'',
                    addUser: '',
                    addDatetime: '',
                    isDelete:''
                }
            },
            saveAddplatform(){
                if(this.form.dataSource_id==""){
                    console.log("数据源Id不能为空");
                    this.$message.error("数据源Id不能为空");
                }else if(this.form.dataSource_url==""){
                    console.log("数据源地址不能为空");
                    this.$message.error("数据源地址不能为空");
                }else{
                    this.$axios.post(this.url+'/api/db/addDataSource',{
                        platformId: this.form.platformId,
                        addUser:this.form.addUser,
                        dataSource_id:this.form.dataSource_id,
                        dataSource_url:this.form.dataSource_url,
                        dataSource_name:this.form.dataSource_name,
                        dataSource_password:this.form.dataSource_password
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("数据源添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("数据源添加失败");
                        }
                    })
                    .catch(failResponse => {})
                    this.addplatformVisible = false; 
                }               
            },
            // 保存编辑
            saveEdit() {
                this.$axios.post(this.url+'/api/db/editDataSource',{
                    id:this.form.id,
                    platformId: this.form.platformId,
                    addUser:this.form.addUser,
                    dataSource_id:this.form.dataSource_id,
                    dataSource_url:this.form.dataSource_url,
                    dataSource_name:this.form.dataSource_name,
                    dataSource_password:this.form.dataSource_password
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("数据源信息修改成功");
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("数据源信息修改失败");
                    }
                })
                .catch(failResponse => {})
                this.editVisible = false;  
            },
            // 确定删除
            deleteRow(){
                this.$axios.post(this.url+'/api/db/deleteDataSource',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`数据源删除成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('数据源删除失败');
                        }
                    })
                    .catch(failResponse => {})    
                this.tableData.splice(this.idx, 1);
                this.delVisible = false;
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
