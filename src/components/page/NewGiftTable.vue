<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>礼包管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
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

                <span class="grid-content bg-purple-light">礼包名：</span>
                <el-input v-model="searchKey.giftName" placeholder="筛选礼包名" class="handle-input " style="width:150px"></el-input>

                <span class="grid-content bg-purple-light">礼包标识：</span>
                <el-input v-model="searchKey.giftTag" placeholder="筛选礼包标识" class="handle-input " style="width:150px"></el-input>

                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="handleImportGift">导入礼包信息</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  >
                </el-table-column>
                <el-table-column prop="giftId" label="礼包ID"  >
                </el-table-column>
                <el-table-column prop="giftName" label="礼包名"  >
                </el-table-column>
                <el-table-column  label="礼包描述"  width="250px">
                     <template slot-scope="scope">
                        <ul>
                            <li v-for="item in scope.row.giftDescribe.split('，')" v-bind:key="item">{{ item }}</li>
                        </ul>
                     </template>
                </el-table-column>
                <el-table-column prop="limitCount" label="领取限制" >
                </el-table-column>
                <el-table-column prop="expire_time" label="过期时间" >
                </el-table-column>
                
                
                <el-table-column prop="goods_prize1" label="道具内容" >
                </el-table-column> 
                <el-table-column prop="value_prize1" label="货币" >
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
        <el-dialog title="添加礼包" :visible.sync="addgiftVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="平台">
                    <el-select v-model="form.platformId" placeholder="请选择平台">
                        <el-option
                        v-for="item in platformOptions"
                        :key="item.platformId"
                        :label="item.platform"
                        :value="item.platformId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="礼包名称">
                    <el-input v-model="form.giftName"></el-input>
                </el-form-item>
                <el-form-item label="礼包标识">
                    <el-input v-model="form.giftTag"></el-input>
                </el-form-item>
                <el-form-item label="礼包描述">
                    <el-input v-model="form.gift_describe"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addgiftVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddgift">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑礼包" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="礼包名称">
                    <el-input v-model="form.giftName"></el-input>
                </el-form-item>
                <el-form-item label="礼包标识">
                    <el-input v-model="form.giftTag"></el-input>
                </el-form-item>
                <el-form-item label="礼包描述">
                    <el-input v-model="form.gift_describe"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑冻结提示框 -->
        <el-dialog title="冻结提示" :visible.sync="changeStateToFrozenVisible" width="300px" center>
            <div class="del-dialog-cnt">冻结后将停止礼包使用，是否确定冻结？</div>
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
import bus from '../common/bus';
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
    export default {
        name: 'giftTable',
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
                addgiftVisible:false,
                handleVisible:true,
                delAllVisible:false,
                total:0,
                form: {
                    id:'',
                    giftName:'',
                    giftTag:'',
                    gift_describe: '',
                    giftType:'',
                    sort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                    platformId:"",
                    platform:""
                },
                searchKey: {
                    id:'',
                    giftName:'',
                    giftTag:'',
                    gift_describe: '',
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
            }
        },
        created() {
            setLocalThisUrl(this);
            this.getPlatformList(this.$gameId);
            bus.$on('changeGameId',function(obj){
                console.log(obj.message);
                this.searchKey.platformId="";
                this.getPlatformList(this.$gameId);
            }.bind(this)) 
            bus.$on('giftDataUpload',function(obj){
                console.log(obj.message);
                this.getData();
            }.bind(this))
            this.right();
        },
        beforeDestroy() {
            bus.$off("changeGameId");
            bus.$off("giftDataUpload");
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
                if(right.indexOf('Gift_management_Handle')==-1){
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
            //筛选当前用户游戏的礼包
            getData() {
                this.$axios.post(this.url+"/getGiftUpload", {
                    pageNo: this.cur_page,
                    pageSize: 10,
                    isPage:"isPage",
                    id:'',
                    giftName:this.searchKey.giftName,
                    giftTag:this.searchKey.giftTag,
                    platformId:this.searchKey.platformId,
                    strPlatform:this.strPlatform,
                    gameId:this.$gameId
                }).then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log("礼包列表获取成功");
                        this.tableData = successResponse.data.data.list;
                        this.total = successResponse.data.data.total;
                    }else{
                        this.tableData = [];
                        this.total = 0;
                        console.log(this.responseResult);
                        this.$message.error("礼包列表获取失败");
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
                    giftName:item.giftName,
                    giftTag:item.giftTag,
                    gift_describe: item.gift_describe,
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
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id + ',';
                }
                //批量删除处理
                this.$axios.post(this.url+'/deleteAllGift',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        this.$message.success("礼包批量删除完成");
                        this.multipleSelection = []; 
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("礼包批量删除失败");
                    }
                })
                .catch(failResponse => {})
                this.delAllVisible = false;
            }, 
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddgift(){
                this.addgiftVisible = true;
                this.form = {
                    id:'',
                    giftName:'',
                    giftTag:'',
                    gift_describe: '',
                    giftParentId:'',
                    giftSort:'',
                    addUser: '',
                    addDatetime: '',
                    state:'',
                }
            },
            handleImportGift(){
                this.$router.push('/GiftUpload');
            },
            saveAddgift(){
                if(this.form.giftName==""){
                    console.log("礼包名称不能为空");
                    this.$message.error("礼包名称不能为空");
                }else if(this.form.giftTag==""){
                    console.log("礼包标识不能为空");
                    this.$message.error("礼包标识不能为空");
                }else{
                    this.$axios.post(this.url+'/addGift',{
                        id: this.form.id,
                        giftName:this.form.giftName,
                        giftTag:this.form.giftTag,
                        giftType:this.form.giftType,
                        gift_describe: this.form.gift_describe,
                        sort:this.form.sort,
                        addUser: this.form.addUser,
                        state:this.form.state,
                        platformId:this.form.platformId,
                        gameId:this.$gameId
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("礼包添加成功");
                            this.tableData.push(this.form);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error("礼包添加失败");
                        }
                    })
                    .catch(failResponse => {})
                }               
                this.addgiftVisible = false; 
            },
            // 保存编辑
            saveEdit() {
                this.$axios.post(this.url+'/editGift',{
                    id:this.form.id,
                    giftName:this.form.giftName,
                    giftTag:this.form.giftTag,
                    gift_describe: this.form.gift_describe,
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
                        this.$message.success("礼包信息修改成功");
                        this.getData();
                    }else{
                        console.log(this.responseResult);
                        this.$message.error("礼包信息修改失败");
                    }
                })
                .catch(failResponse => {})
                this.editVisible = false;
            },
            // 确定冻结
            changeStateToFrozen(){
                this.$axios.post(this.url+'/changeStateToFrozen_Gift',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`礼包冻结成功`);
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('礼包冻结失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToFrozenVisible = false;
                this.rest();
            },
            // 确定解冻
            changeStateToNormal(){
                this.$axios.post(this.url+'/changeStateToNormal_Gift',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success("礼包解冻成功");
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('礼包解冻失败');
                        }
                    })
                    .catch(failResponse => {})
                this.changeStateToNormalVisible = false;
                this.rest();
            },
            // 确定删除
            deleteRow(){
                this.$axios.post(this.url+'/deleteGift',{
                        id: this.id, 
                    })
                    .then(successResponse =>{
                        this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                        if(successResponse.data.code === 200){
                            this.$message.success(`礼包删除成功`);
                            //必须异步处理
                            this.getData();
                        }else{
                            console.log(this.responseResult);
                            this.$message.error('礼包删除失败');
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
