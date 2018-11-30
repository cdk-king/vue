


function getchildren() {


    var children = [];
    var item = {
        path: "",
        component: "",
        meta: ""
    };

    item.path = '/dashboard';
    item.component = resolve => require(['../components/page/Dashboard.vue'], resolve);
    item.meta = { title: '系统首页' };
    children.push(item);
    item = {}

    item.path = '/403';
    item.component = resolve => require(['../components/page/403.vue'], resolve);
    item.meta = { title: '403' };
    children.push(item);
    item = {}

    item.path = '/404';
    item.component = resolve => require(['../components/page/404.vue'], resolve);
    item.meta = { title: '404' };
    children.push(item);
    item = {}

    var right = localStorage.getItem('rightTags');
    if(null==right){
        right = "";
    }else{
        
    }
    
    console.log("right2:" + right);
    item.path = '/userTable';
    item.component = resolve => require(['../components/page/UserTable.vue'], resolve);
    item.meta = { title: '用户管理' };
    if (right.indexOf('User_Management_View') != -1) {
        item.component = resolve => require(['../components/page/UserTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/roleTable';
    item.meta = { title: '角色管理' };
    if (right.indexOf('Role_Management_View') != -1) {
        item.component = resolve => require(['../components/page/RoleTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/rightTable';
    item.meta = { title: '权限管理' };
    if (right.indexOf('Right_Management_View') != -1) {
        item.component = resolve => require(['../components/page/RightTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/gameTable';
    item.meta = { title: '游戏管理' };
    if (right.indexOf('Game_Management_View') != -1) {
        item.component = resolve => require(['../components/page/GameTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/platformTable';
    item.meta = { title: '平台管理' };
    if (right.indexOf('Platform_Management_View') != -1) {
        item.component = resolve => require(['../components/page/PlatformTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/serverTable';
    item.meta = { title: '服务器管理' };
    if (right.indexOf('Server_Management_View') != -1) {
        item.component = resolve => require(['../components/page/ServerTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/serverTree';
    item.meta = { title: '服务器树形管理' };
    if (right.indexOf('Server_Tree_View') != -1) {
        item.component = resolve => require(['../components/page/ServerTree.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PlayerInfo';
    item.meta = { title: '玩家基本信息' };
    if (right.indexOf('Player_Info_View') != -1) {
        item.component = resolve => require(['../components/page/PlayerInfo.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PlayerUpload';
    item.meta = { title: '玩家信息导入' };
    if (right.indexOf('Upload_Player_View') != -1) {
        item.component = resolve => require(['../components/page/PlayerUpload.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PlayerProhibitSpeakLog';
    item.meta = { title: '玩家禁言记录' };
    if (right.indexOf('Player_ProhibitSpeakLog_View') != -1) {
        item.component = resolve => require(['../components/page/PlayerProhibitSpeakLog.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PlayerBanLog';
    item.meta = { title: '玩家禁封记录' };
    if (right.indexOf('Player_BanLog_View') != -1) {
        item.component = resolve => require(['../components/page/PlayerBanLog.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/BanIp';
    item.meta = { title: 'IP禁封' };
    if (right.indexOf('Player_BanIp_View') != -1) {
        item.component = resolve => require(['../components/page/BanIP.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/SendEmail';
    item.meta = { title: '发送邮件' };
    if (right.indexOf('Send_Email_View') != -1) {
        item.component = resolve => require(['../components/page/SendEmail.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/SendNotice';
    item.meta = { title: '发送公告' };
    if (right.indexOf('Send_Notice_View') != -1) {
        item.component = resolve => require(['../components/page/SendNotice.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/AllEmail';
    item.meta = { title: '全服邮件' };
    if (right.indexOf('All_Email_View') != -1) {
        item.component = resolve => require(['../components/page/AllEmail.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/AllNotice';
    item.meta = { title: '全服公告' };
    if (right.indexOf('All_Notice_View') != -1) {
        item.component = resolve => require(['../components/page/AllNotice.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PropInfo';
    item.meta = { title: '道具信息' };
    if (right.indexOf('Prop_Info_View') != -1) {
        item.component = resolve => require(['../components/page/PropTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/newPropInfo';
    item.meta = { title: '道具导入信息' };
    if (right.indexOf('Prop_Upload_View') != -1) {
        item.component = resolve => require(['../components/page/NewPropTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/AppleProp';
    item.meta = { title: '申请道具' };
    if (right.indexOf('Apple_Prop_View') != -1) {
        item.component = resolve => require(['../components/page/AppleProp.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    
    item.path = '/PropUpload';
    item.meta = { title: '道具导入' };
    if (right.indexOf('Upload_Prop_View') != -1) {
        item.component = resolve => require(['../components/page/PropUpload.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/GiftInfo';
    item.meta = { title: '礼包信息' };
    if (right.indexOf('Gift_Info_View') != -1) {
        item.component = resolve => require(['../components/page/GiftTable.vue'], resolve); 
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/newGiftInfo';
    item.meta = { title: '礼包导入信息' };
    if (right.indexOf('Gift_Upload_View') != -1) {
        item.component = resolve => require(['../components/page/NewGiftTable.vue'], resolve); 
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}


    item.path = '/GiftUpload';
    item.meta = { title: '礼包导入' };
    if (right.indexOf('Upload_Gift_View') != -1) {
        item.component = resolve => require(['../components/page/GiftUpload.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}


    item.path = '/AppleGiftCDK';
    item.meta = { title: '申请礼包激活码' };
    if (right.indexOf('Apple_GiftCDK_View') != -1) {
        item.component = resolve => require(['../components/page/AppleGiftCDK.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/CDK_Use';
    item.meta = { title: '激活码使用情况' };
    if (right.indexOf('CDK_Use_View') != -1) {
        item.component = resolve => require(['../components/page/CDK_Use.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/CommunicationTest';
    item.meta = { title: '测试' };
    item.component = resolve => require(['../components/test/ComponentCommunicationTest.vue'], resolve);
    children.push(item);
    item = {}

    item.path = '/TouristIdSet';
    item.meta = { title: '游客账号设置' };
    if (right.indexOf('TouristId_Set_View') != -1) {
        item.component = resolve => require(['../components/page/TouristIdSet.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    
    var otherItem=[{
            path: '/tabs',
            component: resolve => require(['../components/page/Tabs.vue'], resolve),
            meta: { title: '消息中心' }
        },
        {
            path: '/form',
            component: resolve => require(['../components/page/BaseForm.vue'], resolve),
            meta: { title: '基本表单' }
        },
        {
        path: '/form',
        component: resolve => require(['../components/page/BaseForm.vue'], resolve),
        meta: { title: '基本表单' }
        },
        {
            // 富文本编辑器组件
            path: '/editor',
            component: resolve => require(['../components/page/VueEditor.vue'], resolve),
            meta: { title: '富文本编辑器' }
        },
        {
            // markdown组件
            path: '/markdown',
            component: resolve => require(['../components/page/Markdown.vue'], resolve),
            meta: { title: 'markdown编辑器' }    
        },
        {
            // 图片上传组件
            path: '/upload',
            component: resolve => require(['../components/page/Upload.vue'], resolve),
            meta: { title: '文件上传' }   
        },
        {
            // vue-schart组件
            path: '/charts',
            component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
            meta: { title: 'schart图表' }
        },
        {
            // 自定义图标组件
            path: '/icon',
            component: resolve => require(['../components/page/icon.vue'], resolve),
            meta: { title: '自定义图标' }
        },
        {
            // 拖拽列表组件
            path: '/drag',
            component: resolve => require(['../components/page/DragList.vue'], resolve),
            meta: { title: '拖拽列表' }
        },
        {
            // 权限页面
            path: '/permission',
            component: resolve => require(['../components/page/Permission.vue'], resolve),
            meta: { title: '权限测试', permission: true }
        },
    ]
    for(var i = 0;i<otherItem.length;i++){
        children.push(otherItem[i]);
    }
    console.log(children);
    //console.log("router-right-check:" + right);

    const dynamicRouter =

    {
        path: '/',
        //加载组件
        //如果用import引入的话，当项目打包时路由里的所有component都会打包在一个js中，造成进入首页时，需要加载的内容过多，时间相对比较长。
        //当你用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js。
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children: children

        // {
        //     path: '/dashboard',
        //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
        //     meta: { title: '系统首页' }
        // },
        // {
        //     path: '/icon',
        //     component: resolve => require(['../components/page/Icon.vue'], resolve),
        //     meta: { title: '自定义图标' }
        // },
        // {
        //     path: '/CommunicationTest',
        //     component: resolve => require(['../components/test/ComponentCommunicationTest.vue'], resolve),
        //     meta: { title: '测试' }
        // },
        // {
        //     path: '/usertable',
        //     component: resolve => require(['../components/page/UserTable.vue'], resolve),
        //     meta: { title: '用户表格' }
        // },
        // {
        //     path: '/tabs',
        //     component: resolve => require(['../components/page/Tabs.vue'], resolve),
        //     meta: { title: 'tab选项卡' }
        // },
        // {
        //     path: '/form',
        //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
        //     meta: { title: '基本表单' }
        // },
        // {
        //     // 富文本编辑器组件
        //     path: '/editor',
        //     component: resolve => require(['../components/page/VueEditor.vue'], resolve),
        //     meta: { title: '富文本编辑器' }
        // },
        // {
        //     // markdown组件
        //     path: '/markdown',
        //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
        //     meta: { title: 'markdown编辑器' }    
        // },
        // {
        //     // 图片上传组件
        //     path: '/upload',
        //     component: resolve => require(['../components/page/Upload.vue'], resolve),
        //     meta: { title: '文件上传' }   
        // },
        // {
        //     // vue-schart组件
        //     path: '/charts',
        //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
        //     meta: { title: 'schart图表' }
        // },
        // {
        //     // 拖拽列表组件
        //     path: '/drag',
        //     component: resolve => require(['../components/page/DragList.vue'], resolve),
        //     meta: { title: '拖拽列表' }
        // },
        // {
        //     // 权限页面
        //     path: '/permission',
        //     component: resolve => require(['../components/page/Permission.vue'], resolve),
        //     meta: { title: '权限测试', permission: true }
        // },

    }
    return dynamicRouter;
}
export default getchildren

