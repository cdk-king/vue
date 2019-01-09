<!--父组件中引入子组件-->
<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>发送道具邮件
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">备注：
        <br>（1）两种发送道具邮件方式“为指定角色发送”、“为全服玩家发送”，只能选择其中的一种
        <br>（2）道具参数格式：道具id-道具数量-是否绑定-品质
      </div>

      <div style="margin:15px;">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
        <span class="grid-content bg-purple-light">平台：</span>
        <el-select
          v-model="searchKey.platformId"
          @change="selectSearchKeyPlatform"
          placeholder="请选择平台"
          style="width:150px"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in platformOptions"
            :key="item.platformId"
            :label="item.platform"
            :value="item.platformId"
          ></el-option>
        </el-select>
        <span class="grid-content bg-purple-light">服务器：</span>
        <el-select
          v-model="searchKey.serverId"
          @change="selectSearchKeyServer"
          placeholder="请选择服务器"
          style="width:150px"
        >
          <el-option key="0" label="全部" value="0"></el-option>
          <el-option
            v-for="item in searchKeyServerOptions"
            :key="item.serverId"
            :label="item.serverName"
            :value="item.serverId"
          ></el-option>
        </el-select>
        <span class="grid-content bg-purple-light">内容：</span>
        <el-input
          v-model="searchKey.releaseContent"
          placeholder="筛选内容"
          class="handle-input"
          style="width:150px"
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="handleAdd">添加道具邮件申请</el-button>
      </div>

      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="platform" label="平台"></el-table-column>

        <el-table-column prop="server" label="服务器"></el-table-column>

        <el-table-column prop="releaseTitle" label="标题"></el-table-column>
        <el-table-column prop="releaseContent" label="内容" width="260px"></el-table-column>
        <el-table-column prop="propList" label="道具列表" width="175px">
          <template slot-scope="scope">
            <p
              style
              v-for="item in scope.row.propList.split(',')"
              :key="item"
              :label="item"
              :value="item"
            >{{formatPropName(item, scope.row.platformId)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="moneyCount" label="货币" width="140px">
          <template slot-scope="scope">
            <p
              style
              v-for="item in scope.row.moneyList.split(';')"
              :key="item"
              :label="item"
              :value="item"
            >{{formatMoneyType(item)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="applyType" label="申请类型" :formatter="formatApplyType"></el-table-column>
        <el-table-column prop="playerAccountList" label="玩家账号"></el-table-column>
        <el-table-column prop="playerNameList" label="玩家名称"></el-table-column>
        <el-table-column prop="addDatetime" label="添加时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="applyDatetime" label="最后发送时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="applyState" label="邮件发送状态" :formatter="formatApplyState"></el-table-column>
        <el-table-column prop="userName" label="申请人"></el-table-column>
        <el-table-column label="操作" align="center" width="120px" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-message"
              @click="handleApply(scope.$index, scope.row)"
              v-if="scope.row.applyState!=1"
            >发送邮件</el-button>
            <!-- <el-button type="text" icon="el-icon-edit" @click="handleConfirm(scope.$index, scope.row)" v-if="scope.row.confirmState!=1" >通过</el-button> -->
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="scope.row.applyState!=1"
            >编辑</el-button>
            <!-- <el-button type="text" icon="el-icon-edit" @click="handleNotConfirm(scope.$index, scope.row)" v-if="scope.row.confirmState!=2 && scope.row.applyState!=1" >不通过</el-button> -->
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :page-sizes="[ 5, 10, 15, 20]"
          :page-size="10"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加提示框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="1100px" center>
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item class="el-form-item" label="选择平台">
            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择平台">
              <el-option
                v-for="item in platformOptions"
                :key="item.platformId"
                :label="item.platform"
                :value="item.platformId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="选择服务器">
            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器">
              <el-option
                v-for="item in serverOptions"
                :key="item.serverId"
                :label="item.serverName"
                :value="item.serverId"
              ></el-option>
            </el-select>
          </el-form-item>
          <Divider/>
          <el-form-item label="标题">
            <el-input style="width:515px" placeholder="请输入标题" v-model="form.releaseTitle" clearable></el-input>
          </el-form-item>
          <el-form-item label="道具邮件内容">
            <el-input
              style="width:515px"
              type="textarea"
              :autosize="{ minRows:4, maxRows: 10}"
              placeholder="请输入邮件内容"
              v-model="form.releaseContent"
              v-on:change="changeContent"
              clearable
            ></el-input>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red" v-show="maxLengthVisible">{{"超过最大字符长度"+countMaxLength}}</span>
          </el-form-item>
          <Divider/>
          <el-form-item label="需要发送的道具">
            <el-select v-model="form.propId" @change="selectProp" filterable placeholder="请选择道具">
              <el-option
                v-for="item in propOptions"
                :key="item.propId"
                :label="item.propId+'—'+item.propName"
                :value="item.propId"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red">道具不能为空,品种数量限制为5个 </span>
          </el-form-item>
          <el-form-item label="已选择道具列表">
            <el-table :data="propData" border class="table" ref="multipleTable">
              <el-table-column prop="propId" label="道具ID"></el-table-column>
              <el-table-column prop="propName" label="道具名称"></el-table-column>
              <el-table-column prop="propType" label="道具类别" :formatter="formatPropTypeName"></el-table-column>
              <el-table-column prop="propDescribe" width="200px" label="道具描述"></el-table-column>
              <el-table-column prop="propMaxCount" label="最大堆叠数量"></el-table-column>
              <el-table-column prop="propCount" label="数量">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入数量"
                    v-on:change="changePropCount(scope.$index)"
                    v-model="propData[scope.$index].propCount"
                    clearable
                  >{{scope.row.propCount}}</el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否绑定" align="center">
                <template slot-scope="scope">
                  <el-radio v-model="propData[scope.$index].propBind" label="0" style="margin-left:0px" @change="radioChange(scope.$index)">不绑定</el-radio>
                  <el-radio v-model="propData[scope.$index].propBind" label="1" style="margin-left:0px" @change="radioChange(scope.$index)">绑定</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" style="text-align:center" width="120px">
                <template slot-scope="scope" >
                  <el-button
                    type="text"  style="margin-left:0px"
                    icon="el-icon-remove-outline"
                    @click="handleReducePropCount(scope.$index, scope.row)"
                  >减小</el-button>
                  <el-button 
                    type="text" style="margin-left:0px"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddPropCount(scope.$index, scope.row)"
                  >添加</el-button>

                  <el-button
                    type="text"  style="margin-left:0px"
                    icon="el-icon-delete"
                    @click="handleDelProp(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="货币类别">
            <el-select v-model="form.moneyType" placeholder="请选择货币类别">
              <el-option
                v-for="item in moneyTypeOptions"
                :key="item.moneyId"
                :label="item.moneyType"
                :value="item.moneyId"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="addMoneyToList">添加货币</el-button>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red">暂时只支持系统金子</span>
          </el-form-item>
          <el-form-item label="已选择货币列表">
            <el-table :data="moneyList" border class="table" ref="multipleTable">
              <el-table-column prop="moneyType" label="货币类型" :formatter="formatMoneyTypeName">></el-table-column>
              <el-table-column prop="moneyCount" label="数量">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入数量"
                    v-on:change="changeMoneyCount(scope.$index)"
                    v-model="moneyList[scope.$index].moneyCount"
                    clearable
                  >{{scope.row.moneyCount}}</el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-remove-outline"
                    @click="handleReduceMoneyCount(scope.$index, scope.row)"
                  >减小</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddMoneyCount(scope.$index, scope.row)"
                  >添加</el-button>
                  <el-button
                    type="text" 
                    icon="el-icon-delete"
                    class="red"
                    @click="handleDelMoneyItem(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <Divider/>
      <el-tabs type="border-card" @tab-click="handleClick" v-model="editableTabsValue">
        <el-tab-pane label="指定角色道具邮件申请" name="1">
          <el-form ref="form" :model="form" label-width="200px">
            <el-form-item label="玩家名称">
              <el-input
                style="width:515px"
                placeholder="请输入玩家名称"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.playerNameList"
                clearable
              ></el-input>
              <p
                class="grid-content bg-purple-light"
                style="color:#888888"
              >玩家名称和角色ID至少填写一项，多个玩家请用','分隔</p>
            </el-form-item>
            <el-form-item label="角色ID">
              <el-input
                style="width:515px"
                placeholder="请输入角色ID"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.playerIdList"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="申请人">
              <el-input style="width:215px" placeholder="请输入" v-model="form.applyUser" clearable></el-input>
            </el-form-item> -->

            <el-form-item label="申请说明">
              <el-input
                style="width:515px"
                placeholder="请输入申请说明"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.applyReason"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" icon="search" @click="addApply">申请</el-button>
              <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="全服玩家道具邮件申请" name="2">
          <el-form ref="form" :model="form" label-width="200px">
            <!-- <el-form-item label="申请人">
              <el-input style="width:215px" placeholder="请输入" v-model="form.applyUser" clearable></el-input>
            </el-form-item> -->

            <el-form-item label="申请说明">
              <el-input
                style="width:515px"
                placeholder="请输入申请说明"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.applyReason"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" icon="search" @click="addApply">申请</el-button>
              <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

    <!-- 编辑提示框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="1100px" center>
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item class="el-form-item" label="选择平台">
            <el-select v-model="form.platformId" @change="selectPlatform" placeholder="请选择平台">
              <el-option
                v-for="item in platformOptions"
                :key="item.platformId"
                :label="item.platform"
                :value="item.platformId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="选择服务器">
            <el-select v-model="form.serverId" @change="selectServer" placeholder="请选择服务器">
              <el-option
                v-for="item in serverOptions"
                :key="item.serverId"
                :label="item.serverName"
                :value="item.serverId"
              ></el-option>
            </el-select>
          </el-form-item>
          <Divider/>
          <el-form-item label="标题">
            <el-input style="width:515px" placeholder="请输入标题" v-model="form.releaseTitle" clearable></el-input>
          </el-form-item>
          <el-form-item label="道具邮件内容">
            <el-input
              style="width:515px"
              type="textarea"
              :autosize="{ minRows:4, maxRows: 10}"
              placeholder="请输入邮件内容"
              v-model="form.releaseContent"
              v-on:change="changeContent"
              clearable
            ></el-input>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red" v-show="maxLengthVisible">{{"超过最大字符长度"+countMaxLength}}</span>
          </el-form-item>
          <Divider/>
          <el-form-item label="需要发送的道具">
            <el-select v-model="form.propId" @change="selectProp" filterable placeholder="请选择道具">
              <el-option
                v-for="item in propOptions"
                :key="item.propId"
                :label="item.propId+'—'+item.propName"
                :value="item.propId"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="addPropToList">添加道具</el-button>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red">道具不能为空,品种数量限制为5个 </span>
          </el-form-item>
          <el-form-item label="已选择道具列表">
            <el-table :data="propData" border class="table" ref="multipleTable">
              <el-table-column prop="propId" label="道具ID"></el-table-column>
              <el-table-column prop="propName" label="道具名称"></el-table-column>
              <el-table-column prop="propType" label="道具类别" :formatter="formatPropTypeName"></el-table-column>
              <el-table-column prop="propDescribe" width="200px" label="道具描述"></el-table-column>
              <el-table-column prop="propMaxCount" label="最大堆叠数量"></el-table-column>
              <el-table-column prop="propCount" label="数量">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入数量"
                    v-on:change="changePropCount(scope.$index)"
                    v-model="propData[scope.$index].propCount"
                    clearable
                  >{{scope.row.propCount}}</el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否绑定">
                <template slot-scope="scope">
                  <el-radio v-model="propData[scope.$index].propBind" label="0" style="margin-left:0px" @change="radioChange(scope.$index)">不绑定</el-radio>
                  <el-radio v-model="propData[scope.$index].propBind" label="1" style="margin-left:0px" @change="radioChange(scope.$index)">绑定</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="120px">
                <template slot-scope="scope">

                  <el-button
                    type="text" style="margin-left:0px"
                    icon="el-icon-remove-outline"
                    @click="handleReducePropCount(scope.$index, scope.row)"
                  >减小</el-button>
                  <el-button
                    type="text" style="margin-left:0px"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddPropCount(scope.$index, scope.row)"
                  >添加</el-button>
                  <el-button
                    type="text" style="margin-left:0px"
                    icon="el-icon-delete"
                    @click="handleDelProp(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="货币类别">
            <el-select v-model="form.moneyType" placeholder="请选择货币类别">
              <el-option
                v-for="item in moneyTypeOptions"
                :key="item.moneyId"
                :label="item.moneyType"
                :value="item.moneyId"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="addMoneyToList">添加货币</el-button>
            <span class="grid-content bg-purple-light" style="margin:20px;color:red">暂时只支持系统金子</span>
          </el-form-item>
          <el-form-item label="已选择货币列表">
            <el-table :data="moneyList" border class="table" ref="multipleTable">
              <el-table-column prop="moneyType" label="货币类型" :formatter="formatMoneyTypeName">></el-table-column>
              <el-table-column prop="moneyCount" label="数量">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入数量"
                    v-on:change="changeMoneyCount(scope.$index)"
                    v-model="moneyList[scope.$index].moneyCount"
                    clearable
                  >{{scope.row.moneyCount}}</el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-remove-outline"
                    @click="handleReduceMoneyCount(scope.$index, scope.row)"
                  >减小</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddMoneyCount(scope.$index, scope.row)"
                  >添加</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelMoneyItem(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <Divider/>
      <el-tabs type="border-card" @tab-click="handleClick" v-model="editableTabsValue">
        <el-tab-pane label="指定角色道具邮件申请" name="1">
          <el-form ref="form" :model="form" label-width="200px">
            <el-form-item label="玩家名称">
              <el-input
                style="width:515px"
                placeholder="请输入玩家名称"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.playerNameList"
                clearable
              ></el-input>
              <p
                class="grid-content bg-purple-light"
                style="margin:20px;color:#888888"
              >玩家名称和角色ID至少填写一项，','分隔</p>
            </el-form-item>
            <el-form-item label="角色ID">
              <el-input
                style="width:515px"
                placeholder="请输入角色ID"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.playerIdList"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="申请人">
              <el-input style="width:215px" placeholder="请输入" v-model="form.applyUser" clearable></el-input>
            </el-form-item> -->

            <el-form-item label="申请说明">
              <el-input
                style="width:515px"
                placeholder="请输入申请说明"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.applyReason"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" icon="search" @click="editApply">编辑</el-button>
              <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="全服玩家道具邮件申请" name="2">
          <el-form ref="form" :model="form" label-width="200px">
            <!-- <el-form-item label="申请人">
              <el-input style="width:215px" placeholder="请输入" v-model="form.applyUser" clearable></el-input>
            </el-form-item> -->

            <el-form-item label="申请说明">
              <el-input
                style="width:515px"
                placeholder="请输入申请说明"
                type="textarea"
                :autosize="{ minRows:4, maxRows: 10}"
                v-model="form.applyReason"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" icon="search" @click="editApply">编辑</el-button>
              <el-button type="primary" icon="search" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

    <!-- 批量删除提示框 -->
    <el-dialog title="批量删除提示" :visible.sync="delAllVisible" width="300px" center>
      <div class="del-dialog-cnt">批量删除不可恢复，是否确定批量删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDelAll">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发送道具申请邮件提示框 -->
    <el-dialog title="发送道具申请" :visible.sync="showApplyVisible" width="300px" center>
      <div class="del-dialog-cnt">道具申请邮件申请后将不可撤销，是否确定发送？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showApplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="Apply">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import bus from "../common/bus";
import setLocalThisUrl from "../../code/setLocalThisUrl";
import formatDatetime from "../../code/formatDatetime";
export default {
  name: "AppleProp",
  data() {
    return {
      editableTabsValue: "1",
      multipleSelection: [],
      show: false,
      dialogVisible: false,
      platformOptions: [

      ],
      platformValue: "",
      platformLabel: "",
      serverOptions: [],
      serverValue: "",
      serverLabel: "",
      form: {
        platformId: "",
        serverId: "",
        propId: "",
        prop: "",
        releaseTitle: "",
        releaseContent: "",
        applyType: "",
        propList: "",
        playerNameList: "",
        playerAccountList: "",
        playerIdList: "",
        applyUser: "",
        applyReason: "",
        moneyType: "",
        moneyCount: ""
      },
      searchKey: {
        platformId: "",
        serverId: "",
        propId: "",
        prop: "",
        releaseTitle: "",
        releaseContent: "",
        applyType: "",
        propList: "",
        playerNameList: "",
        playerAccountList: "",
        playerIdList: "",
        applyUser: "",
        applyReason: ""
      },
      id: 0,
      serverIp: "",
      checkVisible: false,
      playerTypeOptions: [],
      propOptions: [],
      propData: [],
      tableData: [],
      searchKeyServerOptions: [],
      delAllVisible: false,
      moneyTypeOptions: [],
      propQualityOptions: [],
      moneyList: [],
      showApplyVisible: false,
      idx: 0,
      cur_page: 1,
      total: 0,
      editVisible: false,
      addVisible: false,
      url: "http://localhost:8011",
      strPlatform: "",
      maxLengthVisible:false,
      countMaxLength:600,
      allPropOptions:[]
    };
  },
  components: {
  },
  computed: {
    data() {
      return this.tableData;
    },
    ms_username: function() {
      const role = localStorage.getItem("ms_username");
      return role;
    }
  },
  created() {
    setLocalThisUrl(this);
    this.getPropTypeList(this.$gameId);
    this.getData();

    bus.$on(
      "changeGameId",
      function(obj) {
        var userData = JSON.parse(localStorage.getItem("userData"));
        this.id = userData.id;
        this.searchKey.platformId = "";
        this.searchKey.serverId = "";
        this.form.platformId = "";
        this.form.serverId = "";
        this.getPlatformList(this.id);
        this.getPropTypeList(this.$gameId);
        this.getMoneyTypeList();
        this.getPropQualityList();
      }.bind(this)
    );
    bus.$on('propDataUpload',function(obj){
        console.log(obj.message);
        this.getAllPropList();
        this.getApplyProp();
    }.bind(this))   
  },
  beforeDestroy() {
    bus.$off("changeGameId");
    bus.$off("propDataUpload");
  },
  methods: {
    getPropTypeList(gameId) {
      this.$axios
        .post(this.url + "/api/newProp/getPropTypeList", {
          gameId: gameId
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
    handleClick(tab, event) {
    },
    handleDelProp(index, row) {
      this.propData.splice(index, 1);
    },
    handleDelMoneyItem(index, row) {
      this.moneyList.splice(index, 1);
    },
    handleAddPropCount(index, row) {
      var data = this.propData[index];
      var count = parseInt(data.propCount) + 1;
      if(count>parseInt(row.propMaxCount)){
          this.$message.info("超过最大堆叠数量");
          return;
      }
      data.propCount = count;
      this.$set(this.propData, index, data);
    },
    handleAddMoneyCount(index, row) {
      var data = this.moneyList[index];
      var count = parseInt(data.moneyCount) + 1;
      data.moneyCount = count;
      this.$set(this.moneyList, index, data);
    },
    handleReducePropCount(index, row) {
      if (this.propData[index].propCount > 1) {
        var data = this.propData[index];
        var count = parseInt(data.propCount) - 1;
        data.propCount = count;
        this.$set(this.propData, index, data);
      }
    },
    changeContent(){
      if(this.form.releaseContent.length>this.countMaxLength){
          this.$message.info("超过最大字符长度"+this.countMaxLength);
          this.maxLengthVisible = true;
      }else{
          this.maxLengthVisible = false;
      }
    },
    handleReduceMoneyCount(index, row) {
      if (this.moneyList[index].moneyCount > 1) {
        var data = this.moneyList[index];
        var count = parseInt(data.moneyCount) - 1;
        data.moneyCount = count;
        this.$set(this.moneyList, index, data);
      }
    },
    selectProp() {
    },
    addMoneyToList() {
      //找到相同项的货币数量加一
      for (var i = 0; i < this.moneyList.length; i++) {
        var item = this.moneyList[i];
        if (item.moneyType == this.form.moneyType) {
          var data = this.moneyList[i];
          var count = parseInt(data.moneyCount) + 1;
          data.moneyCount = count;
          this.$set(this.moneyList, i, data);
          return;
        }
      }
      //否则添加新的货币
      if(this.form.moneyType!="" && this.form.moneyType!=null ){
        var moneyType = this.form.moneyType;
        var moneyCount = 1;
        var item = {};
        item.moneyType = moneyType;
        item.moneyCount = moneyCount;
        this.moneyList.push(item);
      }
      
    },
    addPropToList() {
      //找到相同项的道具数量加一
      for (var i = 0; i < this.propData.length; i++) {
        var item = this.propData[i];
        if (item.propId == this.form.propId) {
          var data = this.propData[i];
          
          var count = parseInt(data.propCount) + 1;
          if(count>parseInt(item.propMaxCount)){
              this.$message.info("超过最大堆叠数量");
              return;
          }
          data.propCount = count;
          this.$set(this.propData, i, data);
          
          return;
        }
      }
      //否则添加新的道具
      var item = {};
      for (var j = 0; j < this.propOptions.length; j++) {
        if (this.propOptions[j].propId == this.form.propId) {
          item = this.propOptions[j];
          break;
        }
      }
      item.propCount = 1;
      item.propBind = '0';
      if(this.propData.length<5){
          this.propData.push(item);
      }else{
          this.$message.info("超过最大品种数量5");
      }
    },
    getMoneyTypeList() {
      this.$axios
        .post(this.url + "/api/applyProp/getMoneyTypeList", {
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("货币类型列表获取成功");
            this.moneyTypeOptions = successResponse.data.data.list;
          } else {
            this.moneyTypeOptions = [];
            console.log(this.responseResult);
            this.$message.error("货币类型列表获取失败");
          }
        });
    },
    getPropQualityList() {
      this.$axios
        .post(this.url + "/api/applyProp/getPropQualityList", {
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("品质类型列表获取成功");
            this.propQualityOptions = successResponse.data.data.list;
          } else {
            this.propQualityOptions = [];
            console.log(this.responseResult);
            this.$message.error("品质类型列表获取失败");
          }
        });
    },
    getApplyProp() {
      this.$axios
        .post(this.url + "/getApplyProp", {
          platformId: this.searchKey.platformId,
          serverId: this.searchKey.serverId,
          pageNo: this.cur_page,
          pageSize: 10,
          isPage: "isPage",
          strPlatform: this.strPlatform,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("申请道具列表获取成功");
            this.tableData = successResponse.data.data.list;
            this.total = successResponse.data.data.total;
            //获取table后再关闭所有窗口，避免闪烁
            this.editVisible = false;
            this.showApplyVisible = false;
            this.addVisible = false;
          } else {
            this.tableData = [];
            this.total = 0;
            console.log(this.responseResult);
            this.$message.error("申请道具列表获取失败");
          }
        });
    },
    getPlayerTypeList() {
      this.$axios
        .post(this.url + "/getPlayerTypeList", {})
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("玩家类型列表获取成功");
            this.playerTypeOptions = successResponse.data.data.list;
          } else {
            this.playerTypeOptions = [];
            console.log(this.responseResult);
            this.$message.error("玩家类型列表获取失败");
          }
        });
    },
    radioChange(index){
        //强制刷新界面
        var item = this.propData[index];
        this.$set(this.propData,index,item);
    },
    handleDelAll() {
      this.delAllVisible = true;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getApplyProp();
    },
    getAllPropList() {
      this.$axios
        .post(this.url + "/getPropUplaod", {
          pageNo: 1,
          pageSize: 10,
          isPage: "",
          platformId: 0,
          strPlatform: this.strPlatform,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具列表获取成功");
            this.allPropOptions = successResponse.data.data.list;
          } else {
            this.allPropOptions = [];
            console.log(this.responseResult);
            this.$message.error("道具列表获取失败");
          }
        });
    },
    getPlatformList(userId) {
      this.$axios
        .post(this.url + "/getPlatformListForUserIdAndGameId", {
          userId: userId,
          gameId: this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("用户平台列表获取成功");
            this.platformOptions = successResponse.data.data.list;
            this.strPlatform = "";
            for (var i = 0; i < this.platformOptions.length; i++) {
              this.strPlatform += this.platformOptions[i].platformId + ",";
            }
            this.strPlatform = this.strPlatform.substring(
              0,
              this.strPlatform.length - 1
            );
            
            this.getAllPropList();
            this.getApplyProp();
          } else { 
            this.platformOptions = [];
            this.strPlatform = "";
            console.log(this.responseResult);
            console.log("用户平台列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("平台服务器列表获取成功");
            this.serverOptions = successResponse.data.data;
            this.checkVisible = true;
          } else {
            this.serverOptions = [];
            console.log(this.responseResult);
            console.log("平台服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    getSearchKeyServerList(platformId) {
      this.$axios
        .post(this.url + "/getServerListForPlatform", {
          platformId: platformId,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("服务器列表获取成功");
            this.searchKeyServerOptions = successResponse.data.data;
          } else {
            this.searchKeyServerOptions = [];
            console.log(this.responseResult);
            console.log("服务器列表获取失败");
          }
        })
        .catch(failResponse => {});
    },
    selectPlatform() {
      this.getServerList(this.form.platformId);
      for(var k = 0;k<this.allPropOptions.length;k++){
          if(this.form.platformId==this.allPropOptions[k].platformId){
              this.propOptions.push(this.allPropOptions[k]);
          }
      }
    },
    selectSearchKeyPlatform() {
      this.getSearchKeyServerList(this.searchKey.platformId);
      this.getApplyProp();
    },
    selectSearchKeyServer() {
      this.getApplyProp();
    },
    changePropCount(index) {
        var item = this.propData[index];
        //解除引用
        var arr = JSON.parse(JSON.stringify(item));
        if(!parseInt(arr.propCount) || arr.propCount=="" || arr.propCount=="0" || parseInt(arr.propCount)<0){
            //arr.propCount=1;
            arr.propCount="1";
            this.$set(this.propData,index,arr);
        }
        if(arr.propCount>item.propMaxCount){
            this.$message.info("超过最大堆叠数量");
            arr.propCount = item.propMaxCount;
            this.$set(this.propData,index,arr);
        }
    },
    changeMoneyCount(index) {
        var item = this.moneyList[index];
        //解除引用
        var arr = JSON.parse(JSON.stringify(item));
        if(!parseInt(arr.moneyCount) || arr.moneyCount=="" || arr.moneyCount=="0" || parseInt(arr.moneyCount)<0){
            arr.moneyCount=1;
            this.$set(this.moneyList,index,arr);
        }
    },
    search() {
      this.getApplyProp();
    },
    formatter(row, column) {
      //时间格式化               
      var date = row[column.property];
      return formatDatetime(date);
    },
    selectServer() {
      if (this.serverOptions.length > 0) {
        for (let i = 0; i < this.serverOptions.length; i++) {
          if (this.serverOptions[i].serverId == this.serverValue) {
            this.serverIp = this.serverOptions[i].serverIp;
            return;
          }
        }
      }
    },
    getData() {
      var userData = JSON.parse(localStorage.getItem("userData"));
      this.id = userData.id;
      this.getPlatformList(this.id);
      this.getPlayerTypeList();
      this.getMoneyTypeList();
      this.getPropQualityList();
    },
    addApply() {
      var data = {};
      if (this.form.platformId == "") {
        this.$message("请选择正确的平台");
        return;
      }
      if (this.form.serverId == "") {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.releaseTitle == "") {
        this.$message("标题不能为空");
        return;
      }
      if (this.form.releaseContent == "") {
        this.$message("内容不能为空");
        return;
      }
      if (this.propData == "") {
        this.$message("道具不能为空");
        return;
      }
      if(this.form.releaseContent.length>this.countMaxLength){
        this.$message("内容长度超过最大限制"+this.countMaxLength);
        return;
      }
      var list = "";
      for (var i = 0; i < this.propData.length; i++) {
        //判断道具数量是否正确
        if(!parseInt(this.propData[i].propCount) || this.propData[i].propCount=="" || this.propData[i].propCount=="0" || parseInt(this.propData[i].propCount)<0){
          this.$message("请输入正确的道具数量");
          return;
        }
        //判断是否最后
        if (i + 1 >= this.propData.length) {
          list += this.propData[i].propId + "-" + this.propData[i].propCount;
          if (this.propData[i].propBind) {
            list += "-" + this.propData[i].propBind;
          } else {
            //默认不绑定
            list += "-0";
          }
          if (this.propData[i].propQuality) {
            list += "-" + this.propData[i].propQuality;
          } else {
            //默认白品质
            list += "-1";
          }
          break;
        }
        list += this.propData[i].propId + "-" + this.propData[i].propCount;
        if (this.propData[i].propBind) {
          list += "-" + this.propData[i].propBind;
        } else {
          //默认不绑定
          list += "-0";
        }
        if (this.propData[i].propQuality) {
          list += "-" + this.propData[i].propQuality + ",";
        } else {
          //默认白品质
          list += "-1,";
        }
      }
      var moneyList = "";
      for (var j = 0; j < this.moneyList.length; j++) {
        //判断货币数量是否正确
        if(!parseInt(this.moneyList[j].moneyCount) || this.moneyList[j].moneyCount=="" || this.moneyList[j].moneyCount=="0" || parseInt(this.moneyList[j].moneyCount)<0){
          this.$message("请输入正确的货币数量");
          return;
        }
        moneyList +=
          this.moneyList[j].moneyType +
          "|" +
          this.moneyList[j].moneyCount +
          ";";
      }
      moneyList = moneyList.substring(0, moneyList.length - 1);
      if (this.editableTabsValue == "1") {
        data = {
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          releaseTitle: this.form.releaseTitle,
          releaseContent: this.form.releaseContent,
          applyType: 1,
          propList: list,
          playerNameList: this.form.playerNameList,
          playerAccountList: this.form.playerAccountList,
          playerIdList: this.form.playerIdList,
          playerType: this.form.playerType,
          applyUser: this.form.applyUser,
          applyReason: this.form.applyReason,
          addUser: this.id,
          moneyList: moneyList,
          gameId:this.$gameId
        };
        if(this.form.playerNameList=="" && this.form.playerIdList==""){
            this.$message("请输入其中一项角色信息");
            return;
        }
      }
      if (this.editableTabsValue == "2") {
        data = {
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          releaseTitle: this.form.releaseTitle,
          releaseContent: this.form.releaseContent,
          applyType: 2,
          propList: list,
          applyUser: this.form.applyUser,
          applyReason: this.form.applyReason,
          addUser: this.id,
          moneyList: moneyList,
          gameId:this.$gameId
        };
      }
      this.$axios
        .post(this.url + "/addApplyProp", data)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp();
            
          } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
          }
        })
        .catch(failResponse => {});
    },
    handleEdit(index, row) {
      
      this.propData =[];
      this.moneyList = [];
      this.propOptions=[];
      var item = this.tableData[index];
      this.form = {
        id: item.id,
        platformId: item.platformId,
        serverId: item.serverId,
        releaseTitle: item.releaseTitle,
        releaseContent: item.releaseContent,
        applyType: item.applyType,
        playerNameList: item.playerNameList,
        playerAccountList: item.playerAccountList,
        playerIdList: item.playerIdList,
        applyUser: item.applyUser,
        applyReason: item.applyReason,
      };
      this.getServerList(item.platformId);

      for(var k = 0;k<this.allPropOptions.length;k++){
          if(item.platformId==this.allPropOptions[k].platformId){
              this.propOptions.push(this.allPropOptions[k]);
          }
      }

      var arr = item.propList.split(",");
      for(var i = 0;i<arr.length;i++){
          var ob = {};
          ob.propId = arr[i].split("-")[0];
          ob.propCount = arr[i].split("-")[1];
          ob.propBind = arr[i].split("-")[2];
          ob.propQuality = arr[i].split("-")[3];
          for(var j = 0;j<this.propOptions.length;j++){
              if(ob.propId==this.propOptions[j].propId ){
                ob.propName = this.propOptions[j].propName;
                ob.propType = this.propOptions[j].propType;
                ob.propDescribe = this.propOptions[j].propDescribe;
                ob.propMaxCount = this.propOptions[j].propMaxCount;
                
                this.propData.push(ob);
                break;
              }
          }
      }
      if(item.moneyList!=""){
        arr = item.moneyList.split(";");
        for(var i = 0;i<arr.length;i++){
            var ob = {};
            ob.moneyType = arr[i].split("|")[0];
            ob.moneyCount = arr[i].split("|")[1];
            this.moneyList.push(ob);
        }
      }
      this.editVisible = true;
    },
    editApply() {
      var data = {};
      if (this.form.platformId == "") {
        this.$message("请选择正确的平台");
        return;
      }
      if (this.form.serverId == "") {
        this.$message("请选择正确的服务器");
        return;
      }
      if (this.form.releaseTitle == "") {
        this.$message("标题不能为空");
        return;
      }
      if (this.form.releaseContent == "") {
        this.$message("内容不能为空");
        return;
      }
      if (this.propData == "") {
        this.$message("道具不能为空");
        return;
      }
      var list = "";
      for (var i = 0; i < this.propData.length; i++) {
        //判断道具数量是否正确
        if(!parseInt(this.propData[i].propCount) || this.propData[i].propCount=="" || this.propData[i].propCount=="0" || parseInt(this.propData[i].propCount)<0){
          this.$message("请输入正确的道具数量");
          return;
        }
        //判断是否是最后一个元素
        if (i + 1 >= this.propData.length) {
          list += this.propData[i].propId + "-" + this.propData[i].propCount;
          if (this.propData[i].propBind) {
            list += "-" + this.propData[i].propBind;
          } else {
            //默认不绑定
            list += "-0";
          }
          if (this.propData[i].propQuality) {
            list += "-" + this.propData[i].propQuality;
          } else {
            //默认白品质
            list += "-1";
          }
          break;
        }
        list += this.propData[i].propId + "-" + this.propData[i].propCount;
        if (this.propData[i].propBind) {
          list += "-" + this.propData[i].propBind;
        } else {
          //默认不绑定
          list += "-0";
        }
        if (this.propData[i].propQuality) {
          list += "-" + this.propData[i].propQuality + ",";
        } else {
          //默认白品质
          list += "-1,";
        }
      }
      var moneyList = "";
      for (var j = 0; j < this.moneyList.length; j++) {
        //判断货币数量是否正确
        if(!parseInt(this.moneyList[j].moneyCount) || this.moneyList[j].moneyCount=="" || this.moneyList[j].moneyCount=="0" || parseInt(this.moneyList[j].moneyCount)<0){
          this.$message("请输入正确的货币数量");
          return;
        }
        moneyList +=
          this.moneyList[j].moneyType +
          "|" +
          this.moneyList[j].moneyCount +
          ";";
      }
      moneyList = moneyList.substring(0, moneyList.length - 1);
      if (this.editableTabsValue == "1") {
        data = {
          id: this.form.id,
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          releaseTitle: this.form.releaseTitle,
          releaseContent: this.form.releaseContent,
          applyType: 1,
          propList: list,
          playerNameList: this.form.playerNameList,
          playerAccountList: this.form.playerAccountList,
          playerIdList: this.form.playerIdList,
          playerType: this.form.playerType,
          applyUser: this.form.applyUser,
          applyReason: this.form.applyReason,
          addUser: this.id,
          moneyList: moneyList,
          gameId:this.$gameId
        };
      }
      if (this.editableTabsValue == "2") {
        data = {
          id: this.form.id,
          platformId: this.form.platformId,
          serverId: this.form.serverId,
          releaseTitle: this.form.releaseTitle,
          releaseContent: this.form.releaseContent,
          applyType: 2,
          propList: list,
          applyUser: this.form.applyUser,
          applyReason: this.form.applyReason,
          addUser: this.id,
          moneyList: moneyList,
          gameId:this.$gameId
        };
      }
      this.$axios
        .post(this.url + "/api/apply/editApplyProp", data)
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请修改成功");
            this.$message.success("道具申请修改成功");
            this.getApplyProp();
            
          } else {
            console.log(this.responseResult);
            console.log("道具申请修改失败");
            this.$message.error("道具申请修改失败");
          }
        })
        .catch(failResponse => {});
    },
    handleAdd() {
      this.form = {
        platformId: "",
        serverId: "",
        releaseTitle: "",
        releaseContent: "",
        applyType: "",
        playerNameList: "",
        playerAccountList: "",
        playerIdList: "",
        applyUser: "",
        applyReason: ""
      };
      this.propData = [];
      this.moneyList = [];
      this.serverOptions = [];
      this.propOptions = [];
      this.addVisible = true;
    },
    handleApply(index, row) {
      this.idx = index;
      this.showApplyVisible = true;
    },
    Apply() {
      var item = this.tableData[this.idx];
      var money = item.moneyList;
      var propList = item.propList;
      propList = propList.split(",");
      var itemList = "";
      var len = propList.length;
      for (var i = 0; i < len; i++) {
        var a = propList[i].split("-")[0];
        var b = propList[i].split("-")[1];
        var c = propList[i].split("-")[2];
        var d = propList[i].split("-")[3];
        var e = 0;
        var info = a + "|" + b + "|" + c + "|" + d + "|" + e;
        itemList += info + ";";
      }
      itemList = itemList.substring(0, itemList.length - 1);
      this.$axios
        .post(this.url + "/api/applyProp/confirmApply", {
          id: item.id,
          platformId: item.platformId,
          serverId: item.serverId,
          IsAllPlayer: parseInt(item.applyType) - 1,
          PlayerID: item.playerIdList,
          PlayerName: item.playerNameList,
          Title: item.releaseTitle,
          Content: item.releaseContent,
          ItemList: itemList,
          Money: money,
          gameId:this.$gameId
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请邮件发送成功");
            this.$message.success("道具申请邮件发送成功");
            
            this.getApplyProp();
            
          } else {
            console.log(this.responseResult);
            console.log("道具申请邮件发送失败");
            this.$message.error("道具申请邮件发送失败");
          }
        });
    },
    handleConfirm(index, row) {
      this.$axios
        .post(this.url + "/confirmApplyProp", {
          id: this.tableData[index].id,
          addUser: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请审核通过成功");
            this.$message.success("道具申请审核通过成功");
            this.getApplyProp();
          } else {
            console.log(this.responseResult);
            console.log("道具申请审核通过失败");
            this.$message.error("道具申请审核通过失败");
          }
        });
    },
    saveDelAll() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ",";
      }
      //批量删除处理
      this.$axios
        .post(this.url + "/deleteAllApplyProp", {
          id: str
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$message.success("道具申请批量删除完成");
            this.multipleSelection = [];
            this.getApplyProp();
          } else {
            console.log(this.responseResult);
            this.$message.error("道具申请批量删除失败");
          }
        })
        .catch(failResponse => {});

      this.delAllVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNotConfirm(index, row) {
      this.$axios
        .post(this.url + "/notConfirmApplyProp", {
          id: this.tableData[index].id,
          addUser: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请审核不通过成功");
            this.$message.success("道具申请审核不通过成功");
            this.getApplyProp();
          } else {
            console.log(this.responseResult);
            console.log("道具申请审核不通过失败");
            this.$message.error("道具申请审核不通过失败");
          }
        });
    },
    handleDelete(index, row) {
      this.$axios
        .post(this.url + "/deleteApplyProp", {
          id: this.tableData[index].id,
          addUser: this.id
        })
        .then(successResponse => {
          this.responseResult = "\n" + JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            console.log("道具申请添加成功");
            this.$message.success("道具申请添加成功");
            this.getApplyProp();
          } else {
            console.log(this.responseResult);
            console.log("道具申请添加失败");
            this.$message.error("道具申请添加失败");
          }
        });
    },
    resetForm() {
      this.form = {
        platformId: "",
        serverId: "",
        propId: "",
        prop: "",
        releaseTitle: "",
        releaseContent: "",
        applyType: "",
        propList: "",
        playerNameList: "",
        playerAccountList: "",
        playerIdList: "",
        applyUser: "",
        applyReason: ""
      };
      this.propData = [];
      this.moneyList = [];
      this.serverOptions = [];
      this.propOptions = [];
    },
    testDialog() {
      this.dialogVisible = true;
    },
    formatIsSend(row, column, cellValue, index) {
      return row.confirmState == 0
        ? "未审核"
        : row.confirmState == 1
        ? "已通过"
        : "未通过";
    },
    formatApplyState(row, column, cellValue, index) {
      return row.applyState == 1
        ? "发送成功"
        : row.applyState == 2
        ? "发送失败"
        : "未发送";
    },
    formatApplyType(row, column, cellValue, index) {
      return row.applyType == 1 ? "角色申请" : "全服申请";
    },
    formatMoneyTypeName(row, column, cellValue, index) {
      for (var i = 0; i < this.moneyTypeOptions.length; i++) {
        if (row.moneyType == this.moneyTypeOptions[i].moneyId) {
          return this.moneyTypeOptions[i].moneyType;
        }
      }
    },
    formatPropTypeName(row, column, cellValue, index) {
      for (var i = 0; i < this.propTypeList.length; i++) {
        if (row.propType == this.propTypeList[i].propTypeId) {
          return this.propTypeList[i].propType;
        }
      }
    },
    formatPropName(item,platformId) {
      //十分消耗性能
      if(item!=""){
        if(this.allPropOptions.length==0){
            return item;
        }
        for (var i = 0; i < this.allPropOptions.length; i++) {
          if (item.split('-')[0] == this.allPropOptions[i].propId && platformId == this.allPropOptions[i].platformId) {
            return this.allPropOptions[i].propName+"-"+item.split('-')[1]+"个";
          }
        }
      }
    },
    formatMoneyType(item) {
      if(item!=""){
        if(this.moneyTypeOptions.length==0){
            return item;
        }
        for (var i = 0; i < this.moneyTypeOptions.length; i++) {
          if (item.split('|')[0] == this.moneyTypeOptions[i].moneyId) {
            return this.moneyTypeOptions[i].moneyType+"-"+item.split('|')[1];
          }
        }
      }
    }
  },
  watch: {
  }
};
</script>

<style scoped>
.el-form-item {
  width: 100%;
}
.form-box {
  width: 100%;
}
.red{
  color:red;
}
</style>
