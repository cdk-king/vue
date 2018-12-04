<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>全服公告</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips">
                     备注：
                    <br/>
                    (1)选择多个服务器发送公告，系统会依次向每个服务器发送更新请求
                    <br/>
                    (2)服务器：服务器Id-服务器名;道具格式：物品id|物品数量|是否绑定|品质|过期时间;货币格式：货币类型|货币数量
                    <br/>
                    (3)发送失败后会显示失败服务器的id，点击重新发送会对失败的服务器重新发送公告
                </div>
                
                <Divider />
                <!-- <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="折叠" name="1">
                    
                </el-collapse-item>
                </el-collapse> -->
                <!-- <Divider /> -->
                <div style="margin:15px;">
                      <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
                      <span class="grid-content bg-purple-light">平台：</span>
                            <el-select v-model="searchKey.platformId" @change="selectSearchKeyPlatform" placeholder="请选择渠道平台" style="width:150px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                      <span class="grid-content bg-purple-light">服务器：</span>
                            <el-select v-model="searchKey.serverName" @change="selectSearchKeyServer"  placeholder="请选择服务器" style="width:150px">
                                <el-option key="1" label="全部" value="0"></el-option>
                                <el-option
                                v-for="item in searchKeyServerOptions"
                                :key="item.serverName"
                                :label="item.serverName"
                                :value="item.serverName">
                                </el-option>
                            </el-select>
                      <!-- <span class="grid-content bg-purple-light">：</span>
                      <el-input v-model="searchKey.rightName" placeholder="筛选权限名" class="handle-input " style="width:150px"></el-input> -->

                      <span class="grid-content bg-purple-light">内容：</span>
                      <el-input v-model="searchKey.noticeContent" placeholder="筛选内容" class="handle-input " style="width:150px"></el-input>

                      <el-button type="primary" icon="search" @click="search">搜索</el-button>
                      <el-button type="primary" icon="search" @click="handleAddPlatformNotice">添加</el-button>
                </div>
                            
                <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="platform" label="平台"  >
                </el-table-column>
                <!-- <el-table-column prop="serverList" label="服务器" >
                </el-table-column> -->
                <el-table-column prop="serverList" label="服务器" >
                  <template slot-scope="scope">
                      <p style=""  v-for="item in scope.row.serverList.substring(1,scope.row.serverList.length-1).split(',') " :key="item"
                                :label="item.substring(1,item.length-1)"
                                :value="item">{{item.substring(1,item.length-1)}}
                      </p>
                  </template>
                </el-table-column>

                <el-table-column prop="noticeTitle"  label="标题" >
                </el-table-column>
                <el-table-column prop="noticeContent"  label="内容" width="300">
                </el-table-column>
                <el-table-column prop="propList" label="道具列表" width="200">
                    <template slot-scope="scope">
                      <p style=""  v-for="item in (scope.row.propList!=null ? scope.row.propList.split(';'):[])" :key="item"
                                :label="item"
                                :value="item">{{item}}
                      </p>
                    </template>
                </el-table-column>
                <el-table-column prop="moneyCount"  label="货币" >
                    <template slot-scope="scope">
                        <p style=""  v-for="item in (scope.row.moneyList!=null ? scope.row.moneyList.split(';'):[])" :key="item"
                                :label="item"
                                :value="item">{{item}}
                      </p>
                    </template>
                </el-table-column>
                <el-table-column prop="startDatetime" label="开始时间" :formatter="formatter" >
                </el-table-column>
                <el-table-column prop="endDatetime" label="结束时间" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="sendState"  label="状态" :formatter="formatIsSend">
                </el-table-column>
                <el-table-column  label="错误服务器id列表" >
                    <template slot-scope="scope">
                        <p style=""  v-for="item in (scope.row.errorList!=null ? scope.row.errorList.split(','):[])" :key="item"
                                :label="item"
                                :value="item" >{{item}}
                      </p>
                    </template>
                </el-table-column>
                <el-table-column prop="userName"  label="编辑人" >
                </el-table-column>
                <el-table-column label="操作"  align="center" v-if="handleVisible">
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.sendState!=1">编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleSend(scope.$index, scope.row)" v-if="scope.row.sendState==0">发送</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleReSend(scope.$index, scope.row)" v-if="scope.row.sendState==2">重新发送</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    
                    </template>
                </el-table-column>

            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="this.total">
                </el-pagination>
            </div>
               </div>     
            <!-- 添加框 -->
            <el-dialog title="添加" :visible.sync="addPlatformNoticeVisible" width="1000px" center :modal="false"  :close-on-click-modal="false">
                <div class="form-box">
                    <el-form ref="form" :model="form" label-width="150px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择服务器">
                            <span class="grid-content bg-purple-light" style="margin:16px;color:#888888" v-show="!checkVisible">请先选择服务器</span>
                                    <!-- 全选 -->
                                   <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                    <div style="margin: 15px 0;"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group> -->

                            <el-checkbox-group v-model="form.serverList" @change="handleCheckedServer" v-show="checkVisible">
                                <el-checkbox v-for="item in serverOptions" :label="item.serverId+'-'+item.serverName" :key="item.serverId"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="标题">
                           <el-input style="width:180px"
                            placeholder="标题"
                            v-model="form.noticeTitle"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
                            
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input style="width:515px"
                            placeholder="请输入发送内容" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.noticeContent"
                            clearable>
                            </el-input>
                            
                        </el-form-item>

                        <el-form-item label="需要发送的道具">
                            <el-select v-model="form.propId" @change="selectProp" placeholder="请选择道具">
                                <el-option
                                v-for="item in propOptions"
                                :key="item.id"
                                :label="item.propName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
                        </el-form-item>
                        <el-form-item label="已选择道具列表">

                            <el-table :data="propData" border class="table" ref="multipleTable" >
                                <el-table-column prop="id" label="道具ID"  >
                                </el-table-column>
                                <el-table-column prop="propName" label="道具名称"  >
                                </el-table-column>
                                <el-table-column prop="propType" label="道具类别"  >
                                </el-table-column>
                                <el-table-column prop="propCount" label="数量" >
                                    <template slot-scope="scope">
                                        <el-input 
                                        placeholder="请输入标题" v-on:change="changePropCount"
                                        v-model="propData[scope.$index].propCount"
                                        clearable>{{scope.row.propCount}}
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="是否绑定" >
                                    <template slot-scope="scope">     
                                        <el-radio v-model="propData[scope.$index].propBind" label="0">不绑定</el-radio>
                                        <el-radio v-model="propData[scope.$index].propBind" label="1">绑定</el-radio>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作"  align="center" >
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-edit" @click="handleAddPropCount(scope.$index, scope.row)" >添加</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleReducePropCount(scope.$index, scope.row)" >减小</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleDelProp(scope.$index, scope.row)" >删除</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-form-item>
                        <el-form-item  label="货币类别">
                            <el-select v-model="form.moneyType"  placeholder="请选择货币类别">
                                <el-option
                                v-for="item in moneyTypeOptions"
                                :key="item.ValueTypeId"
                                :label="item.ValueTypeName"
                                :value="item.ValueTypeId">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addMoneyToList">添加货币</el-button>
                        </el-form-item>
                         <el-form-item label="已选择货币列表">

                            <el-table :data="moneyList" border class="table" ref="multipleTable" >
                                <el-table-column prop="moneyType" label="货币类型"   :formatter="formatMoneyTypeName">>
                                </el-table-column>
                                <el-table-column prop="moneyCount" label="数量" >
                                    <template slot-scope="scope">
                                        <el-input 
                                        placeholder="请输入数量" v-on:change="changeMoneyCount"
                                        v-model="moneyList[scope.$index].moneyCount"
                                        clearable>{{scope.row.moneyCount}}
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作"  align="center" >
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-edit" @click="handleAddMoneyCount(scope.$index, scope.row)" >添加</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleReduceMoneyCount(scope.$index, scope.row)" >减小</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleDelMoneyItem(scope.$index, scope.row)" >删除</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-form-item>

                       <el-form-item label="开始时间">
                                <el-date-picker style="width:215px" 
                                v-model="form.startDatetime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                                <el-date-picker style="width:215px"  
                                v-model="form.endDatetime"
                                type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>
                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="submit">提交</el-button>
                    
                        </el-form-item></el-form>
                    </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addPlatformNoticeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addPlatformNoticeVisible = false">确 定</el-button>
                </span>
            </el-dialog>

        <!-- 编辑框 -->
        <el-dialog title="编辑" :visible.sync="editPlatformNoticeVisible" width="900px" center :modal="false"  :close-on-click-modal="false">
            <div class="form-box">
                    <el-form ref="form" :model="form" label-width="250px">
                        <!-- <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item> -->
                        <el-form-item class="el-form-item" label="选择平台" >
                            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择渠道平台" style="width:180px">
                                <el-option
                                v-for="item in platformOptions"
                                :key="item.id"
                                :label="item.platform"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择服务器">
                            <span class="grid-content bg-purple-light" style="margin:16px;color:#888888" v-show="!checkVisible">请先选择服务器</span>
                                    <!-- 全选 -->
                                   <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                    <div style="margin: 15px 0;"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group> -->

                            <el-checkbox-group v-model="form.serverList" @change="handleCheckedServer" v-show="checkVisible">
                                <el-checkbox v-for="item in serverOptions" :label="item.serverId+'-'+item.serverName" :key="item.serverId"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="标题">
                           <el-input style="width:180px"
                            placeholder="标题"
                            v-model="form.noticeTitle"
                            clearable>
                            </el-input>
                            <span class="grid-content bg-purple-light" style="margin:20px;color:#888888">必须填写</span>
                            
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input style="width:515px"
                            placeholder="请输入发送内容" type="textarea"
                            :autosize="{ minRows:4, maxRows: 10}"
                            v-model="form.noticeContent"
                            clearable>
                            </el-input>
                            
                        </el-form-item>

                        <el-form-item label="需要发送的道具">
                            <el-select v-model="form.propId" @change="selectProp" placeholder="请选择道具">
                                <el-option
                                v-for="item in propOptions"
                                :key="item.id"
                                :label="item.propName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
                        </el-form-item>
                        <el-form-item label="已选择道具列表">

                            <el-table :data="propData" border class="table" ref="multipleTable" >
                                <el-table-column prop="id" label="道具ID"  >
                                </el-table-column>
                                <el-table-column prop="propName" label="道具名称"  >
                                </el-table-column>
                                <el-table-column prop="propType" label="道具类别"  >
                                </el-table-column>
                                <el-table-column prop="propCount" label="数量" >
                                    <template slot-scope="scope">
                                        <el-input 
                                        placeholder="请输入标题" v-on:change="changePropCount"
                                        v-model="propData[scope.$index].propCount"
                                        clearable>{{scope.row.propCount}}
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="是否绑定" >
                                    <template slot-scope="scope">     
                                        <el-radio v-model="propData[scope.$index].propBind" label="0">不绑定</el-radio>
                                        <el-radio v-model="propData[scope.$index].propBind" label="1">绑定</el-radio>
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作"  align="center" >
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-edit" @click="handleAddPropCount(scope.$index, scope.row)" >添加</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleReducePropCount(scope.$index, scope.row)" >减小</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleDelProp(scope.$index, scope.row)" >删除</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-form-item>
                        <el-form-item  label="货币类别">
                            <el-select v-model="form.moneyType"  placeholder="请选择货币类别">
                                <el-option
                                v-for="item in moneyTypeOptions"
                                :key="item.ValueTypeId"
                                :label="item.ValueTypeName"
                                :value="item.ValueTypeId">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="search" @click="addMoneyToList">添加货币</el-button>
                        </el-form-item>
                         <el-form-item label="已选择货币列表">

                            <el-table :data="moneyList" border class="table" ref="multipleTable" >
                                <el-table-column prop="moneyType" label="货币类型"   :formatter="formatMoneyTypeName">>
                                </el-table-column>
                                <el-table-column prop="moneyCount" label="数量" >
                                    <template slot-scope="scope">
                                        <el-input 
                                        placeholder="请输入数量" v-on:change="changeMoneyCount"
                                        v-model="moneyList[scope.$index].moneyCount"
                                        clearable>{{scope.row.moneyCount}}
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作"  align="center" >
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-edit" @click="handleAddMoneyCount(scope.$index, scope.row)" >添加</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleReduceMoneyCount(scope.$index, scope.row)" >减小</el-button>
                                        <el-button type="text" icon="el-icon-edit" @click="handleDelMoneyItem(scope.$index, scope.row)" >删除</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-form-item>

                       <el-form-item label="开始时间">
                                <el-date-picker style="width:215px" 
                                v-model="form.startDatetime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择起始日期时间">
                                </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                                <el-date-picker style="width:215px"  
                                v-model="form.endDatetime"
                                type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择截至日期时间">
                                </el-date-picker>
                        </el-form-item>
                        
                        <el-form-item label="">
                            
                            <el-button type="primary" icon="search" @click="editPlatformNotice">提交</el-button>
                    
                        </el-form-item></el-form>
                    </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editPlatformNoticeVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPlatformNoticeVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁言提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeProhibitSpeakToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁言？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeProhibitSpeakToNormal = false">取 消</el-button>
                <el-button type="primary" @click="ProhibitSpeakToNormal">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑禁封提示框 -->
        <el-dialog title="冻结提示" :visible.sync="ChangeToBan" width="300px" center>
            <div class="del-dialog-cnt">是否确定禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeToBan = false">取 消</el-button>
                <el-button type="primary" @click="ToBan">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑解除禁封提示框 -->
        <el-dialog title="解冻提示" :visible.sync="ChangeBanToNormal" width="300px" center>
            <div class="del-dialog-cnt">是否确定解除禁封？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ChangeBanToNormal = false">取 消</el-button>
                <el-button type="primary" @click="BanToNormal">确 定</el-button>
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
import bus from "../common/bus";
import dialog from "../test/dialog.vue";
export default {
  name: "PlayerInfo",
  data() {
    return {
      activeNames: ["1"],
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      aa: this.$cdk,
      cur_page: 1,
      total:0,
      handleVisible: true,
      checkVisible: false,
      addPlatformNoticeVisible:false,
      editPlatformNoticeVisible:false,
      platformOptions: [
        {
          platformId: "1",
          platformName: "渠道1"
        },
        {
          platformId: "2",
          platformName: "渠道2"
        }
      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [
        // {
        //   serverId: "4",
        //   serverName: "服务器1"
        // },
        // {
        //   serverId: "5",
        //   serverName: "服务器2"
        // },

      ],
      searchKeyServerOptions:[],
      serverValue: "",
      serverList: [],
      serverLabel: "",
      form: {//默认补全，否则校验过程需要判断是否定义
          platformId:"",
          serverList:[],//为多选框定义默认list
          noticeTitle:"",
          noticeContent:"",
          propId:"",
          prop:"",
      },
      id: 0,
      userId: 0,
      idx: 0,
      serverIp: "",
      tableData: [],
      sendTypeList: [],
      noticeTypeList: [],
      ChangeToProhibitSpeak: false,
      ChangeProhibitSpeakToNormal: false,
      ChangeToBan: false,
      ChangeBanToNormal: false,
      searchKey: {
        timeInterval:"",
        cycleTime:"",
        sendType:"",
        noticeType:"",
        noticeContent:""
      },
      delAllVisible:false,
        propOptions:[],
        propData:[],
      moneyTypeOptions:[],
      propQualityOptions:[],
      moneyList:[],
      errorList:[],
    };
  },
  components: {
    "t-dialog": dialog
  },
    computed: {
    propData() {
      return this.propData;
    },
    data() {
      return this.tableData;
    },
    cdk: function() {
      return this.$cdk;
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    this.getMoneyTypeList(this.$gameId);
    this.getData();
    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.getPlatformList(this.id);
        this.getMoneyTypeList(this.$gameId);
      }.bind(this)
    );

    console.log();

  },
  methods: {
       handleDelProp(index,row){
          this.propData.splice(index,1);
      },
      handleDelMoneyItem(index,row){
            this.moneyList.splice(index,1);
      },
      handleAddPropCount(index,row){
            var data = this.propData[index];
            var count = parseInt(data.propCount)+1;
            data.propCount = count;
            this.$set(this.propData, index, data);
      },
      handleAddMoneyCount(index,row){
            var data = this.moneyList[index];
            var count = parseInt(data.moneyCount)+1;
            data.moneyCount = count;
            this.$set(this.moneyList, index, data);
      },
      handleReducePropCount(index,row){
          if(this.propData[index].propCount>1){
            var data = this.propData[index];
            var count = parseInt(data.propCount)-1;
            data.propCount = count;
            this.$set(this.propData, index, data);
          }
      },
        handleReduceMoneyCount(index,row){
          if(this.moneyList[index].moneyCount>1){
            var data = this.moneyList[index];
            var count = parseInt(data.moneyCount)-1;
            data.moneyCount = count;
            this.$set(this.moneyList, index, data);
          }
      },
    getMoneyTypeList(){
        this.$axios.post("/api/prize/getValueTypeList", {
            gameId:this.$gameId,
            allow:"1,4"
        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("货币类型列表获取成功");
                this.moneyTypeOptions = successResponse.data.data.list;
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("货币类型列表获取失败");
            }
        })
    },

    getPlatformList(userId) {
      this.$axios
        .post("/getPlatformListForUserIdAndGameId", {
          userId: userId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("用户渠道列表获取成功");
            this.platformOptions = successResponse.data.data.list;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("用户渠道列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post("/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post("/getServerListForPlatform", {
          id: platformId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("服务器列表获取成功");

            this.searchKeyServerOptions = successResponse.data.data;
          } else {
            this.open4(successResponse.data.message);
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getPropList(platformId) {
        this.$axios.post("/getPropUplaod", {
            pageNo: 1,
            pageSize: 10,
            isPage:"",
            platformId:platformId,
            strPlatform:platformId
        }).then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                console.log("道具列表获取成功");
                //this.$message.success("道具列表获取成功");
                this.propOptions = successResponse.data.data.list;
            }else{
                
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("道具列表获取失败");
                return false;
            }
        })
    },
    selectPlatform() {
      this.getServerList(this.form.platformId);
      this.getPropList(this.form.platformId);
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            console.log("当前serverIp:" + this.serverIp);
            this.$message.success("当前serverIp:" + this.serverIp);
            break;
          }
        }
      }

      this.getPlatformNotice();
    },
    getPlatformNotice() {
      this.$axios
        .post("/getPlatformNotice", {
          platformId: this.searchKey.platformId,
          serverName: this.searchKey.serverName,
          noticeContent:this.searchKey.noticeContent,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          //searchKey: JSON.stringify(this.searchKey)
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("公告列表获取成功");
            //this.$message.success("公告列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
          } else {
            console.log(this.responseResult);
            console.log("公告列表获取失败");
            this.$message.error("公告列表获取失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    getServerIp() {},
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.userId = userData.id;
      this.getPlatformList(this.userId);
      this.getPlatformNotice();
      
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("page:" + val);
      this.selectServer();
    },
    formatter(row, column) {
      //return row.address;
      //时间格式化

      var date = row[column.property];
      if (date == undefined) {
        return "";
      }

      var tt = new Date(parseInt(date)).toLocaleString();
      return tt;
    },
    handleAddPlatformNotice(){
        this.form = {
            platformId:"",
            serverList:[],//为多选框定义默认list
            noticeTitle:"",
            noticeContent:"",
        };
        this.addPlatformNoticeVisible = true;
    },
    addMoneyToList(){
          //找到相同项的货币数量加一
        for(var i = 0;i<this.moneyList.length;i++){
            var item = this.moneyList[i];
            if(item.moneyType==this.form.moneyType){
                var data = this.moneyList[i];
                var count = parseInt(data.moneyCount)+1;
                data.moneyCount = count;
                //console.log(this.propData[i].propCount);
                this.$set(this.moneyList, i, data);
                //console.log(this.propData[i].propCount);
                return;
            }
        }
            //否则添加新的货币 
          var moneyType = this.form.moneyType;
          var moneyCount = 1;
          var  item = {};
          item.moneyType = moneyType;
          item.moneyCount = moneyCount;
        
          //var item = moneyType+"|"+moneyCount;
          this.moneyList.push(item);
          console.log(this.moneyList);
      },
    addPropToList(){
        //找到相同项的道具数量加一
        for(var i = 0;i<this.propData.length;i++){
            var item = this.propData[i];
            if(item.id==this.form.propId){
                var data = this.propData[i];
                var count = parseInt(data.propCount)+1;
                data.propCount = count;
                //console.log(this.propData[i].propCount);
                this.$set(this.propData, i, data);
                //console.log(this.propData[i].propCount);
                return;
            }
        }
        //否则添加新的道具 
        for(var j = 0; j<this.propOptions.length;j++){
            var item= this.propOptions[j];
            if(item.id==this.form.propId){
                this.form.prop = item;
                break;
            }

        }
        
        this.form.prop.propCount = 1;
        this.propData.push(this.form.prop);
        console.log(this.propData);
    },
    submit() {
        if(this.form.platformId=="" || this.form.platformId==undefined){
              this.$message("请选择正确的平台");
              return;
        }
        if(this.form.serverList.length==0 || this.form.serverList==undefined){
              this.$message("请选择正确的服务器");
              return;
        }
        if(this.form.noticeTitle=="" || this.form.noticeTitle==undefined){
              this.$message("请输入正确的公告标题");
              return;
        }
        if(this.form.noticeContent=="" || this.form.noticeContent==undefined){
              this.$message("请输入正确的公告内容");
              return;
        }
        console.log(this.form);
        console.log(JSON.stringify(this.form));
        console.log(JSON.stringify(this.form.serverList));

        var list = "";
        if(this.propData.length!=0){
            for(var i = 0;i<this.propData.length;i++){
                //判断是否最后
                if((i+1)>=this.propData.length){
                    
                    list+=this.propData[i].id+"|"+this.propData[i].propCount;
                    if(this.propData[i].propBind){
                        list+="|"+this.propData[i].propBind;
                    }else{
                        //默认不绑定
                        list+="|0";
                    }
                    if(this.propData[i].propQuality){
                        list+="|"+this.propData[i].propQuality;
                    }else{
                        //默认白品质
                        list+="|1";
                    }
                    list+="|0";
                    break;
                }
                console.log(this.propData[i].propBind);
                    list+=this.propData[i].id+"|"+this.propData[i].propCount;
                    if(this.propData[i].propBind){
                        list+="|"+this.propData[i].propBind;
                    }else{
                        //默认不绑定
                        list+="|0";
                    }
                    if(this.propData[i].propQuality){
                        list+="|"+this.propData[i].propQuality;
                    }else{
                        //默认白品质
                        list+="|1";
                    }
                    list+="|0;";
            }
        }
        var moneyList = "";
        if(this.moneyList.length!=0){
                for(var j = 0;j<this.moneyList.length;j++){
                    moneyList += this.moneyList[j].moneyType+"|"+this.moneyList[j].moneyCount +";"
                }
                moneyList = moneyList.substring(0,moneyList.length-1);
        }

        this.$axios
        .post("/addPlatformNotice", {
            platformId:this.form.platformId,
            serverList:JSON.stringify(this.form.serverList),
            noticeTitle: this.form.noticeTitle,
            noticeContent:this.form.noticeContent,
            startDatetime:this.form.startDatetime,
            endDatetime:this.form.endDatetime,
            addUser:this.userId,
            moneyList:moneyList,
            propList:list,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("全服公告添加成功");
            this.$message.success("全服公告添加成功");
            this.getPlatformNotice();  
            this.addPlatformNoticeVisible = false;  
          } else {
            console.log(this.responseResult);
            console.log("全服公告添加失败");
            this.$message.error("全服公告添加失败");
            return false;
          }
        })
        .catch(failResponse => {});
        
    },
    editPlatformNotice(){
        if(this.form.noticeTitle==""){
              this.$message("请输入正确的公告标题");
              return;
        }
        if(this.form.noticeContent==""){
              this.$message("请输入正确的公告内容");
              return;
        }
        console.log(JSON.stringify(this.form));
        console.log(JSON.stringify(this.form.serverList));

         var list = "";
        if(this.propData.length!=0){
            for(var i = 0;i<this.propData.length;i++){
                //判断是否最后
                if((i+1)>=this.propData.length){
                    
                    list+=this.propData[i].id+"|"+this.propData[i].propCount;
                    if(this.propData[i].propBind){
                        list+="|"+this.propData[i].propBind;
                    }else{
                        //默认不绑定
                        list+="|0";
                    }
                    if(this.propData[i].propQuality){
                        list+="|"+this.propData[i].propQuality;
                    }else{
                        //默认白品质
                        list+="|1";
                    }
                    list+="|0";
                    break;
                }
                console.log(this.propData[i].propBind);
                    list+=this.propData[i].id+"|"+this.propData[i].propCount;
                    if(this.propData[i].propBind){
                        list+="|"+this.propData[i].propBind;
                    }else{
                        //默认不绑定
                        list+="|0";
                    }
                    if(this.propData[i].propQuality){
                        list+="|"+this.propData[i].propQuality;
                    }else{
                        //默认白品质
                        list+="-1";
                    }
                    list+="|0;";
            }
        }
        var moneyList = "";
        if(this.moneyList.length!=0){
                for(var j = 0;j<this.moneyList.length;j++){
                    moneyList += this.moneyList[j].moneyType+"|"+this.moneyList[j].moneyCount +";"
                }
                moneyList = moneyList.substring(0,moneyList.length-1);
        }

        this.$axios
        .post("/editPlatformNotice", {
            id:this.form.id,
            platformId:this.form.platformId,
            serverList:JSON.stringify(this.form.serverList),
            noticeTitle: this.form.noticeTitle,
            noticeContent:this.form.noticeContent,
            startDatetime:this.form.startDatetime,
            endDatetime:this.form.endDatetime,
            addUser:this.userId,
            moneyList:moneyList,
            propList:list,
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log(this.responseResult);
            console.log("全服公告编辑成功");
            this.$message.success("全服公告编辑成功");
            this.getPlatformNotice();  
            this.editPlatformNoticeVisible = false;
          } else {
            console.log(this.responseResult);
            console.log("全服公告编辑失败");
            this.$message.error("全服公告编辑失败");
            return false;
          }
        })
        .catch(failResponse => {});
    },
    testDialog() {
      this.dialogVisible = true;
    },
    handleCheckedServer() {
      console.log(this.form.serverList);
    },
    selectSearchKeyPlatform(){
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getPlatformNotice();
    },
    selectSearchKeyServer(){
      this.getPlatformNotice();
    }
    ,
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
    handleReSend(index,row){
        var item = this.tableData[index];
        var serverList = item.errorList;
        
        this.$axios.post('/api/notice/sendNotice',{
            id:item.id,
            platformId:item.platformId,
            serverList:serverList,
            noticeTitle:item.noticeTitle,
            noticeContent:item.noticeContent,
            propList:item.propList,
            moneyList:item.moneyList,
            startDatetime:item.startDatetime
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);     
                var error = successResponse.data.data.error;
                if(error.length!=0){
                    //发送失败，返回失败服务器ID列表
                    this.$message.error("公告重新发送失败");
                }else{
                    this.$message.success("公告重新发送完成");
                }
                this.getPlatformNotice();

            }else{
                this.open4(successResponse.data.message);
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("重新发送失败");
            }
        })
        .catch(failResponse => {})

    },
    handleSend(index,row){
        var item = this.tableData[index];
        var serverList = item.serverList.substring(1,item.serverList.length-1).split(",");
        var strServerList = "";
        for(var i = 0;i<serverList.length;i++){
            serverList[i]=serverList[i].substring(1,serverList[i].length).split("-")[0];
            strServerList+=serverList[i]+",";
        }
        strServerList = strServerList.substring(0,strServerList.length-1);
        //console.log(strServerList);
        //console.log(this.tableData[index].id);
        this.$axios.post('/api/notice/sendNotice',{
            id:item.id,
            platformId:item.platformId,
            serverList:strServerList,
            noticeTitle:item.noticeTitle,
            noticeContent:item.noticeContent,
            propList:item.propList,
            moneyList:item.moneyList,
            startDatetime:item.startDatetime
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                var recodes =  successResponse.data.data.codes;
                var error = successResponse.data.data.error;
                console.log(recodes);
                if(error.length!=0){
                    //发送失败，返回失败服务器ID列表
                    this.$message.success("公告发送失败");
                    //serverId,
                    //this.errorList[index] = error.split(',');

                }else{
                    this.$message.success("全服公告发送完成");
                }
                
                this.getPlatformNotice();

            }else{
                this.open4(successResponse.data.message);
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("全服公告发送失败");
                return false;
            }
        })
        .catch(failResponse => {})
    },
    handleDelete(index,row){
                console.log(index);
        console.log(this.tableData[index].id);
        this.$axios.post('/deletePlatformNotice',{
        id:this.tableData[index].id
        })
        .then(successResponse =>{
            this.responseResult ="\n"+ JSON.stringify(successResponse.data)
            if(successResponse.data.code === 200){
                console.log(this.responseResult);
                this.$message.success("公告删除完成"); 
                this.getPlatformNotice();

            }else{
                this.open4(successResponse.data.message);
                console.log('error');
                console.log(this.responseResult);
                this.$message.error("公告删除失败");
                return false;
            }
        })
        .catch(failResponse => {})
    },
    timestampToStr(timestamp){
        var d = new Date(timestamp);    //根据时间戳生成的时间对象
        if(timestamp==null){
            return null;
        }
        var date = (d.getFullYear()) + "-" + 
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " + 
                (d.getHours()) + ":" + 
                (d.getMinutes()) + ":" + 
                (d.getSeconds());
        return date;
    },
    strToArray(str){
        str = str.substring(1,str.length-1);
        var list = str.split(',');
        for(var i = 0;i<list.length;i++){
            list[i] = list[i].substring(1,list[i].length-1);
        }
        return list;
    },
    handleEdit(index,row){
        this.idx = index;
        var item = this.tableData[index];

        this.form={
            id:item.id,
            platformId:item.platformId,
            serverList:this.strToArray(item.serverList),
            noticeTitle:item.noticeTitle,
            noticeContent:item.noticeContent,
            startDatetime:this.timestampToStr(item.startDatetime),
            endDatetime:this.timestampToStr(item.endDatetime),
        }
        this.getPropList(item.platformId);

        this.propData=[];
        this.moneyList=[];
        
        console.log("serverList:"+item.serverList);
        this.getServerList(item.platformId);
        this.editPlatformNoticeVisible = true;
    },
    search(){
      this.getPlatformNotice();
    },
    formatIsSend(row, column, cellValue, index){
        return row.sendState == 0 ? "未发送" : row.sendState == 1 ? "已发送":"发送失败";
    },
    formatNoticeType(row, column, cellValue, index){
        for(var i = 0;i<this.noticeTypeList.length;i++){
            if(this.noticeTypeList[i].id == row.noticeType){
                return this.noticeTypeList[i].noticeType;
            }
        }
    },
    formatSendType(row, column, cellValue, index){
        for(var i = 0;i<this.sendTypeList.length;i++){
            if(this.sendTypeList[i].id == row.sendType){
                return this.sendTypeList[i].sendType;
            }
        }
    },
    handleDelAll(){
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
                this.$axios.post('/deleteAllPlatformNotice',{
                        id: str
                })
                .then(successResponse =>{
                    this.responseResult ="\n"+ JSON.stringify(successResponse.data)
                    if(successResponse.data.code === 200){
                        console.log(this.responseResult);
                        this.$message.success("全服公告批量删除完成");
                        this.multipleSelection = []; 
                        this.getPlatformNotice();

                    }else{
                        this.open4(successResponse.data.message);
                        console.log('error');
                        console.log(this.responseResult);
                        this.$message.error("全服公告批量删除失败");
                        return false;
                    }
                })
                .catch(failResponse => {})
                 
                this.delAllVisible = false;
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
        console.log(this.multipleSelection);
    },
    formatMoneyTypeName(row, column, cellValue, index){
        for(var i = 0;i<this.moneyTypeOptions.length;i++){
            if(row.moneyType==this.moneyTypeOptions[i].ValueTypeId){
                return this.moneyTypeOptions[i].ValueTypeName;
            }
        }

    }
  },
  watch: {
    aa: function(curVal, oldVal) {
      console.log(curVal);
      this.$message(curVal);
    }
  }
};
</script>

<style scoped>
.el-form-item {
  /* border: 1px solid red; */
  width: 100%;
}
.form-box {
  width: 100%;
}
</style>
