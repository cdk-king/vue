<template>
    <div class="sidebar">
        <!-- background-color="#324157" active-text-color="#20a0ff"-->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
            text-color="#000" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs  && item.isShow==1">
                    <el-submenu :index="item.index" :key="item.index"  >
                        <template slot="title" v-show="item.isShow==1">
                            
                            <i :class="item.icon" ></i><span slot="title" >{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu    v-if="subItem.subs && subItem.isShow==1" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item class="el-menu-item" v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index" v-show="threeItem.isShow==1">
                                    {{ threeItem.title }}
                                    
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item class="el-menu-item" v-else :index="subItem.index" :key="subItem.index" v-show="subItem.isShow==1">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item class="el-menu-item" :index="item.index" :key="item.index" v-show="item.isShow==1">
                        <i :class="item.icon"></i><span slot="title" >{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'userTable',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'roleTable',
                        title: '角色管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'rightTable',
                        title: '权限管理'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '1',
                        title: '区服管理',
                        subs: [
                            {
                                index: 'gameTable',
                                title: '游戏管理'
                            },
                            {
                                index: 'platformTable',
                                title: '平台管理'
                            },
                            {
                                index:'DataSource',
                                title:'数据源管理'
                            },
                            {
                                index: 'Channel',
                                title: '通道管理'
                            },
                            {
                                index: 'serverTable',
                                title: '服务器管理'
                            },
                            {
                                index: 'serverTree',
                                title: '服务器树形管理'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '2',
                        title: '运营管理',
                        subs: [
                            {
                                index: '2-1',
                                title: '玩家管理',
                                subs: [
                                    {
                                        index: 'PlayerInfo',
                                        title: '玩家基本信息'
                                    },
                                    {
                                        index: 'PlayerProhibitSpeakLog',
                                        title: '玩家禁言记录' 
                                    },
                                    {
                                        index: 'PlayerBanLog',
                                        title: '玩家封禁记录'
                                    },
                                    {
                                        index: 'BanIp',
                                        title: 'IP封禁'
                                    },
                                ]
                            },
                             {
                                index: 'log',
                                title: '日志管理',
                                subs: [
                                    {
                                        index: 'GoodFlowLog',
                                        title: '物品流通'
                                    },
                                    {
                                        index: 'MoneyFlowLog',
                                        title: '货币消耗' 
                                    },
                                    {
                                        index: 'CreateRoleLog',
                                        title: '角色创建'
                                    },
                                    {
                                        index: 'RoleLoginLog',
                                        title: '角色登录'
                                    },
                                ]
                            },
                            {
                                index: 'NoticeManagement',
                                title: '系统公告管理',
                                subs: [
                                    {
                                        index: 'SendEmail',
                                        title: '发送邮件'
                                    },
                                     {
                                        index: 'SendNotice',
                                        title: '发送广播'
                                    },
                                    {
                                        index: 'AllEmail',
                                        title: '全服邮件'
                                    },
                                    {
                                        index: 'AllNotice',
                                        title: '全服公告'
                                    },
                                ]
                            },
                            {
                                index: '2-2',
                                title: '道具管理',
                                subs: [
                                    {
                                        index: 'newPropInfo',
                                        title: '道具导入信息'
                                    },
                                     {
                                        index: 'PropUpload',
                                        title: '道具导入'
                                    },
                                    {
                                        index: 'AppleProp',
                                        title: '申请道具'
                                    },
                                ]
                            },
                            {
                                index: '2-3',
                                title: '礼包管理',
                                subs: [
                                    {
                                        index: 'newGiftInfo',
                                        title: '礼包导入信息'
                                    },
                                    {
                                        index: 'GiftUpload',
                                        title: '礼包导入'
                                    },
                                    {
                                        index: 'AppleGiftCDK',
                                        title: '申请礼包激活码'
                                    },
                                    {
                                        index: 'CDK_Use',
                                        title: '激活码使用情况'
                                    }
                                ]
                            },

                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'SystemSet',
                        title: '系统设置',
                        subs: [
                                {
                                    index: 'TouristIdSet',
                                    title: '游客账号设置'
                                },
                                    {
                                    index: 'Upload',
                                    title: '文件中转'
                                },
                                {
                                    index:'Xlsx',
                                    title:'Xlsx',
                                }
                        ]
                    },
        
                ],
                indexList:[]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            //全局事件总线（Global Event Bus ）
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

            this.mapData();

            //this.createSide();
            this.addIsShow(this.items);
        },
        methods:{
            mapData(){
                var children;
                var len = this.$defaultRouter.length;
                for(var i = 0;i<len;i++){
                    if(this.$defaultRouter[i].children!=null){
                        children= this.$defaultRouter[i].children;
                    }
                }
                for(var j = 0;j<children.length;j++){
                    if(children[j].isRight!=null && children[j].isRight==-1){
                        
                    }else{
                        this.indexList.push(children[j].path);
                    }
                    //this.indexList[j] = children[j].path;
                }

            },
            createSide(){
                var item = [];
                if(this.isInclude("dashboard",this.indexList)){
                    var a = {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    }
                    item.push(a);
                }
                if(this.isInclude("userTable",this.indexList)){
                    var a = {
                        icon: 'el-icon-lx-cascades',
                        index: 'userTable',
                        title: '用户管理'
                    }
                    item.push(a);
                }
                if(this.isInclude("roleTable",this.indexList)){
                    var a =  {
                        icon: 'el-icon-lx-cascades',
                        index: 'roleTable',
                        title: '角色管理'
                    }
                    item.push(a);
                }
                this.items = item;
            },
            isInclude(key,list){
                for(var i = 0;i<list.length;i++){
                    let a = list[i].toString();
                    if(a.substring(0,list[i].length)=="/"+key){
                            return true;
                    }
                }
                return false;
            },
            addIsShow(items){
                var len = items.length;
                var count = 0;
                for(var i=0;i<len;i++ ){
                    if(items[i].subs!=null){
                        var subCount = this.addIsShow(items[i].subs);
                        if(subCount>0){
                            items[i].isShow = 1;
                            count++;
                        }
                        else{
                            items[i].isShow = -1;
                        }
                    }else{
                        if(this.isInclude(items[i].index,this.indexList)){
                            items[i].isShow = 1;
                            count++;
                        }else{
                             items[i].isShow = -1;
                        }
                    }
                }
                return count;
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0px;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-menu-item{
        
    }
</style>
