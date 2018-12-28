import Vue from 'vue';
import App from './App';
//获取路由
import getRouter from './router/index';

import md5 from 'js-md5';

let Base64 = require('js-base64').Base64;

import store from './store';

import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import "babel-polyfill";

import iView from 'iview';
import 'iview/dist/styles/iview.css';
//使用iView UI控件
Vue.use(iView);

Vue.use(ElementUI, { size: 'small' });
//axios.defaults.baseURL = 'http://localhost:8011/'
Vue.prototype.$axios = axios;
//测试全局变量
Vue.prototype.$cdk = "cdk";
Vue.prototype.$setcdk = function(str){
    Vue.prototype.$cdk = str;
};

//游戏Id
Vue.prototype.$gameId = 0;
Vue.prototype.$setGameId = function(id){
    Vue.prototype.$gameId = id;
};
//游客Id
Vue.prototype.$touristId = 0;
Vue.prototype.$setTouristId = function(id){
    Vue.prototype.$touristId = id;
};
//游客name
Vue.prototype.$touristName = "";
Vue.prototype.$setTouristName = function(name){
    Vue.prototype.$touristName = name;
};
//url
//测试环境
//Vue.prototype.$url = "http://127.0.0.1:8011";
//生成环境
Vue.prototype.$url = "";
Vue.prototype.$setUrl = function(url){
    Vue.prototype.$url = url;
};

//router
Vue.prototype.$defaultRouter = "router";
Vue.prototype.$setDefaultRouter = function(router){
    Vue.prototype.$defaultRouter = router;
};

var router = getRouter();

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    const right = localStorage.getItem('rightTags');

    if(!role && to.path !== '/login'){
        //没有登录同时路径不是/login
        next('/login');
    }else if(to.meta.permission){
        console.log("这里是路由钩子函数");
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next('/login') : next('/login');

    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            //必须
            next();
        }
    }
})

new Vue({
    router, 
    store,
    // render方法生成template模板
    render: h => h(App)
}).$mount('#app');