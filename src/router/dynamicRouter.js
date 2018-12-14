

function getchildren() {
//特别注意：require中的路径不可以是单独的一个变量，不过可以使用如下的方式：路径+变量。
    var setRouterItem = function(pathkey,titlekey,rightkey,pagekey,children,right){
        var item = {};
        item.path = pathkey;
        item.meta = { title: titlekey };
        if (right!=""  && right.indexOf(rightkey) != -1) {
            item.component = resolve => require(['../components/page/'+pagekey], resolve);
            item.isRight = 1;
        }else{
            item.component = resolve => require(['../components/page/403.vue'], resolve);
            item.isRight = -1;
        }
        children.push(item);
    }

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

     setRouterItem("/userTable","用户管理","User_Management_View","UserTable.vue",children,right);
     setRouterItem("/roleTable","角色管理","Role_Management_View","RoleTable.vue",children,right);
     setRouterItem("/rightTable","权限管理","Right_Management_View","RightTable.vue",children,right);
     setRouterItem("/gameTable","游戏管理","Game_Management_View","GameTable.vue",children,right);
     setRouterItem("/platformTable","平台管理","Platform_Management_View","PlatformTable.vue",children,right);
     setRouterItem("/serverTable","服务器管理","Server_Management_View","ServerTable.vue",children,right);
     setRouterItem("/serverTree","服务器树形管理","Server_Tree_View","ServerTree.vue",children,right);
     setRouterItem("/PlayerInfo","玩家基本信息","Player_Info_View","PlayerInfo.vue",children,right);
     setRouterItem("/PlayerUpload","玩家信息导入","Upload_Player_View","PlayerUpload.vue",children,right);
     setRouterItem("/PlayerProhibitSpeakLog","玩家禁言记录","Player_ProhibitSpeakLog_View","PlayerProhibitSpeakLog.vue",children,right);
     setRouterItem("/PlayerBanLog","玩家禁封记录","Player_BanLog_View","PlayerBanLog.vue",children,right);
     setRouterItem("/BanIp","IP禁封","Player_BanIp_View","BanIP.vue",children,right);
     setRouterItem("/SendEmail","发送邮件","Send_Email_View","SendEmail.vue",children,right);
     setRouterItem("/SendNotice","发送广播","Send_Notice_View","SendNotice.vue",children,right);
     setRouterItem("/AllEmail","全服邮件","All_Email_View","AllEmail.vue",children,right);
     setRouterItem("/AllNotice","全服公告","All_Notice_View","AllNotice.vue",children,right);
     setRouterItem("/PropInfo","道具信息","Prop_Info_View","PropTable.vue",children,right);
     setRouterItem("/newPropInfo","道具导入信息","Prop_Upload_View","NewPropTable.vue",children,right);
     setRouterItem("/AppleProp","申请道具","Apple_Prop_View","AppleProp.vue",children,right);
     setRouterItem("/PropUpload","道具导入","Upload_Prop_View","PropUpload.vue",children,right);
     setRouterItem("/GiftInfo","礼包信息","Gift_Info_View","GiftTable.vue",children,right);
     setRouterItem("/newGiftInfo","礼包导入信息","Gift_Upload_View","NewGiftTable.vue",children,right);
     setRouterItem("/GiftUpload","礼包导入","Upload_Gift_View","GiftUpload.vue",children,right);
     setRouterItem("/AppleGiftCDK","申请礼包激活码","Apple_GiftCDK_View","AppleGiftCDK.vue",children,right);
     setRouterItem("/CDK_Use","激活码使用情况","CDK_Use_View","CDK_Use.vue",children,right);
     setRouterItem("/TouristIdSet","游客账号设置","TouristId_Set_View","TouristIdSet.vue",children,right);
     setRouterItem("/Center","用户中心","Center_View","Center.vue",children,right);
     setRouterItem("/Upload","文件上传","Upload_View","Uploadfile.vue",children,right);
     setRouterItem("/Xlsx","Xlsx","Xlsx_View","Xlsx.vue",children,right);

    // item.path = '/userTable';
    // item.meta = { title: '用户管理' };
    // if (right.indexOf('User_Management_View') != -1) {
    //     item.component = resolve => require(['../components/page/UserTable.vue'], resolve);
    // }else{
    //     item.component = resolve => require(['../components/page/403.vue'], resolve);
    // }
    // children.push(item);
    // item = {}

    item.path = '/CommunicationTest';
    item.meta = { title: '测试' };
    item.component = resolve => require(['../components/test/ComponentCommunicationTest.vue'], resolve);
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
        // {
        //     path: '/fileUpload',
        //     component: resolve => require(['../components/page/UploadFile.vue'], resolve),
        //     meta: { title: '文件上传' }
        // },
        {
            // vue-schart组件
            path: '/charts',
            component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
            meta: { title: 'schart图表' }
        },
        {
            // 自定义图标组件
            path: '/icon',
            component: resolve => require(['../components/page/Icon.vue'], resolve),
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

