

import Vue from 'vue';
import Router from 'vue-router';
import defaultRouter from './defaultRouter';

function getRouter(){
    
    Vue.use(Router);

    const newRouter = new Router({
        //vue-router默认是hash模式的，我们要切换到history模式，只需在router初始化时，设置mode为history即可。
        mode: 'history',
        routes: defaultRouter()
    })
    console.log("路由生成中。。。");
    console.log("路由生成完毕");
    return newRouter
}



export default getRouter
