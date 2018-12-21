


import Vue from 'vue';
import dynamicRouter from './dynamicRouter';
function getDefaultRouter() {


  const defaultRouter = [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
    },
    {
      path: '/register',
      component: resolve => require(['../components/page/Register.vue'], resolve),
    },
    {
      path: '/BackDoor',
      component: resolve => require(['../components/page/BackDoor.vue'], resolve),
    },
    {
      path: '/403',
      redirect: '/403'
    },
    dynamicRouter()
    ,
    {
      //注意404页面的模糊匹配一定要放在最后。
      path: '*',
      // component: resolve => require(['../components/page/404.vue'], resolve),
      // meta: { title: '404' }
      redirect: '/'
    }
  ]
  Vue.prototype.$setDefaultRouter(defaultRouter);
  return defaultRouter;
}
export default getDefaultRouter;
