


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
    if(right==null){
        right = "";
    }else{
        
    }
    //console.log("right2:" + right);
    item.path = '/userTable';
    item.component = resolve => require(['../components/page/UserTable.vue'], resolve);
    item.meta = { title: '用户管理' };
    if (right.indexOf('User_management_view') != -1) {
        item.component = resolve => require(['../components/page/UserTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/roleTable';
    item.meta = { title: '角色管理' };
    if (right.indexOf('Role_management_view') != -1) {
        item.component = resolve => require(['../components/page/RoleTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/rightTable';
    item.meta = { title: '权限管理' };
    if (right.indexOf('Right_management_view') != -1) {
        item.component = resolve => require(['../components/page/RightTable.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/403.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/PlayerInfo';
    item.meta = { title: '玩家基本信息' };
    if (right.indexOf('Player_Info_view') != -1) {
        item.component = resolve => require(['../components/page/PlayerInfo.vue'], resolve);
    }else{
        item.component = resolve => require(['../components/page/PlayerInfo.vue'], resolve);
    }
    children.push(item);
    item = {}

    item.path = '/CommunicationTest';
    item.meta = { title: '测试' };
    item.component = resolve => require(['../components/test/ComponentCommunicationTest.vue'], resolve);
    children.push(item);
    item = {}


    var otherItem=[{
            path: '/tabs',
            component: resolve => require(['../components/page/Tabs.vue'], resolve),
            meta: { title: 'tab选项卡' }
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
        //     path: '/userTable',
        //     component: resolve => require(['../components/page/UserTable.vue'], resolve),
        //     meta: { title: '用户管理' }
        // },
        // {
        //     path: '/roleTable',
        //     component: resolve => require(['../components/page/RoleTable.vue'], resolve),
        //     meta: { title: '角色管理' }
        // },
        // {
        //     path: '/rightTable',
        //     component: resolve => require(['../components/page/RightTable.vue'], resolve),
        //     meta: { title: '权限管理' }
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

