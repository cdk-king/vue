<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>运营管理</el-breadcrumb-item>
                <el-breadcrumb-item>道具管理</el-breadcrumb-item>
                <el-breadcrumb-item>道具导入信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
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
                <span class="grid-content bg-purple-light">道具类别：</span> 
                <el-select v-model="searchKey.propTypeId" @change="selectPropType" style="width:150px" placeholder="筛选道具类别" class="handle-select mr10">
                        <el-option key="0" label="全部" value="0"></el-option>
                        <el-option
                        v-for="item in propTypeList"
                        :key="item.propTypeId"
                        :label="item.propType"
                        :value="item.propTypeId">
                        </el-option>
                </el-select>
                <span class="grid-content bg-purple-light">道具ID：</span>
                <el-input v-model="searchKey.propId" placeholder="筛选道具ID" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">道具名：</span>
                <el-input v-model="searchKey.propName" placeholder="筛选道具名" class="handle-input " style="width:150px"></el-input>

                
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleImportProp">导入道具信息</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  >
                </el-table-column>
                <el-table-column prop="propId" label="道具ID"  >
                </el-table-column>
                <el-table-column prop="propName" label="道具名称" >
                </el-table-column>
                <el-table-column prop="propTypeName" label="道具类别" width="220">
                </el-table-column>
                
                
                <el-table-column prop="propDescribe" label="描述" width="400">
                </el-table-column> 
                <el-table-column prop="propMaxCount" label="最大堆叠数量" >
                </el-table-column> 
                <el-table-column prop="platform" label="所在平台" >
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加道具" :visible.sync="addpropVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="平台">
                    <el-select v-model="form.platformId" placeholder="请选择渠道平台">
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="道具名称">
                    <el-input v-model="form.propName"></el-input>
                </el-form-item>
                <el-form-item label="道具标识">
                    <el-input v-model="form.propTag"></el-input>
                </el-form-item>
                <el-form-item label="道具描述">
                    <el-input v-model="form.prop_describe"></el-input>
                </el-form-item>
                <el-form-item label="道具类别">
                    <el-input v-model="form.propType"></el-input>
                </el-form-item>
                <el-form-item label="添加人">
                    <el-input v-model="form.addUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addpropVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddprop">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑道具" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="道具名称">
                    <el-input v-model="form.propName"></el-input>
                </el-form-item>
                <el-form-item label="道具标识">
                    <el-input v-model="form.propTag"></el-input>
                </el-form-item>
                <el-form-item label="道具描述">
                    <el-input v-model="form.prop_describe"></el-input>
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
            <div class="del-dialog-cnt">冻结后将停止道具使用，是否确定冻结？</div>
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
            <div class="del-dialog-cnt" style="margin-bottom:20px">请选择需要删除的平台数据</div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="选择平台">
                    <el-select v-model="selectDelPlatformId"  placeholder="请选择平台" class="handle-select mr10">
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delAllVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDelAll">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '../common/bus';
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
    export default {
        name: 'newPropTable',
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
                addpropVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    propId:'',
                    propName:'',
                    propTag:'',
                    prop_describe: '',
                    propType:'',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    platformId:"",
                    platform:""
                },
                searchKey: {
                    id:'',
                    propId:'',
                    propName:'',
                    propTypeId:'',
                    prop_describe: '',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    platformId:"",
                    platform:""
                },
                platformOptions: [

                ],
                idx: -1,
                responseResult:[],
                id:"",
                strPlatform:"",
                propTypeList:[],
                selectDelPlatformId:""
            }
        },
        created() {       
            setLocalThisUrl(this);
            this.getPlatformList(this.$gameId);
            this.getPropTypeList(this.$gameId);

            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.searchKey.platformId = "";
                this.getPlatformList(this.$gameId);
                this.getPropTypeList(this.$gameId);
            }.bind(this))
            bus.$on('propDataUpload',function(obj){
                console.log(obj.message);
                this.getData();
            }.bind(this))    
            
            this.right();
        },
        beforeDestroy() {
            bus.$off("changeGameId");
            bus.$off("propDataUpload");
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
                if(right.indexOf('Prop_management_Handle')==-1){
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
            //筛选当前用户游戏的道具
            getData() {
                this.$axios.post(this.url+"/getPropUplaod", {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    id:'',
                    propId:this.searchKey.propId,
                    propName:this.searchKey.propName,
                    propType:this.searchKey.propTypeId,
                    platformId:this.searchKey.platformId,
                    strPlatform:this.strPlatform,
                    gameId:this.$gameId
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data);
                    if(successResponse.data.code === 200){
                        console.log("道具列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        this.tableData = [];
                        this.total = 0;
                        console.log(this.responseResult);
                        this.$message.error("道具列表获取失败");
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
                    this.platformOptions = [];
                    this.strPlatform = "";
                    console.log(this.responseResult);
                    console.log("平台列表获取失败");
                }
                })
                .catch(failResponse => {});
            },
            getPropTypeList(gameId){
                
                this.$axios
                .post(this.url+"/api/newProp/getPropTypeList", {
                    gameId:gameId
                })
                .then(successResponse => {
                this.responseResult = "\n" + JSON.stringify(successResponse.data);
                if (successResponse.data.code === 200) {
                    console.log("道具类别列表获取成功");
                    this.propTypeList = successResponse.data.data.list;
                } else {
                    this.propTypeList = [];
                    console.log(this.responseResult);
                    console.log("道具类别列表获取失败");
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
                
                this.getData();
            },
            selectPropType(){
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
                    propId:item.id,
                    propName:item.propName,
                    propTag:item.propTag,
                    prop_describe: item.prop_describe,
                    sort:item.sort,
                    addUser: item.addUser,
                    addDatetime: item.addDatetime,
                    state:item.state,
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
                if(this.selectDelPlatformId==""){
                    this.$message.info("请选择平台");
                    return;
                }
                //批量删除处理
                this.$axios.post(this.url+'/api/newProp/deleteAllPropForPlatform',{
                        platformId: this.selectDelPlatformId,
                        gameId:this.$gameId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("道具批量删除完成"); 
                        this.selectDelPlatformId = "";
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("道具批量删除失败");
                    }
                })
                .catch(failResponse => {})
                this.delAllVisible = false;
            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddprop(){
                this.addpropVisible = true;
                this.form = {
                    id:'',
                    propId:'',
                    propName:'',
                    propTag:'',
                    prop_describe: '',
                    propParentId:'',
                    propSort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                }
            },
            handleImportProp(){
                this.$router.push('/PropUpload');
            },
            saveAddprop(){
                if(this.form.propName==""){
                    console.log("道具名称不能为空");
                    this.$message.error("道具名称不能为空");
                }else if(this.form.propTag==""){
                    console.log("道具标识不能为空");
                    this.$message.error("道具标识不能为空");
                }else{
                    this.$axios.post(this.url+'/addProp',{ 
                        id: this.form.id,
                        propId:this.form.propId,
                        propName:this.form.propName,
                        propTag:this.form.propTag,
                        propType:this.form.propType,
                        prop_describe: this.form.prop_describe,
                        sort:this.form.sort,
                        addUser: this.form.addUser,
                        state:this.form.state,
                        platformId:this.form.platformId,
                        gameId:this.$gameId
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("道具添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("道具添加失败");
                        }
                    })
                    .catch(failResponse => {})
                }               
                this.addpropVisible = false; 
            },
            // 保存编辑
            saveEdit() {
                this.$axios.post(this.url+'/editProp',{
                    id:this.form.id,
                    propId:this.form.propId,
                    propName:this.form.propName,
                    propTag:this.form.propTag,
                    prop_describe: this.form.prop_describe,
                    sort:this.form.sort,
                    addUser: this.form.addUser,
                    addDatetime: this.form.addDatetime,
                    state:this.form.state,
                    platformId:this.form.platformId,
                    gameId:this.$gameId
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("道具信息修改成功");
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("道具信息修改失败");
                    }
                })
                .catch(failResponse => {})
                this.editVisible = false;               
            },
            // 确定冻结
            changeStateToFrozen(){
                this.$axios.post(this.url+'/changeStateToFrozen_Prop',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`道具冻结成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('道具冻结失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToFrozenVisible = false;
                this.rest();
            },
            // 确定解冻
            changeStateToNormal(){
                this.$axios.post(this.url+'/changeStateToNormal_Prop',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("道具解冻成功");
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('道具解冻失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToNormalVisible = false;
                this.rest();
            },
            // 确定删除
            deleteRow(){
                this.$axios.post(this.url+'/deleteProp',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`道具删除成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('道具删除失败');
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
