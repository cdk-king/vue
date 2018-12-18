

import Vue from 'vue';
import App from '../App';
import axios from 'axios';
import getRouter from '../router/index';

import dynamicRouter from '../router/dynamicRouter';
import defaultRouter from '../router/defaultRouter';

var Utils = {};

Utils.getUserAllRight = function (id) {
    console.log(axios);
    console.log(this);
    axios.post('/getUserAllRight', {
        id: id
    })
        .then(successResponse => {

            this.responseResult = "\n" + JSON.stringify(successResponse.data)
            if (successResponse.data.code === 200) {
                console.log(this.responseResult);
                //console.log(successResponse.data.data);
                console.log("权限获取成功");
                localStorage.setItem('rightTags', "");
                localStorage.setItem('rightTags', successResponse.data.data);
                this.addRouter();
                //localStorage.setItem('ms_username',this.ruleForm.username);
                //this.$router.replace({path: '/index'})

            } else {
                this.$message.error(successResponse.data.message);
                console.log('error');
                console.log(this.responseResult);
                return false;
            }
        })
        .catch(failResponse => { })

};

Utils.addRouter = function () {
    var dfr = defaultRouter();
    //console.log("defaultRouter:"+JSON.stringify(dfr));
    //实验显示这样修改参数对实际路由没用任何影响

    var router = getRouter();
    //重启vue，亲测有效
    console.log("Vue重启中。。。");
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
    console.log("Vue重启成功");
};
Utils.timestampToStr = function () {
    var newDate = new Date();
    newDate.setTime(timestamp);
    // Wed Jun 18 2014 
    console.log(newDate.toDateString());
    // Wed, 18 Jun 2014 02:33:24 GMT 
    console.log(newDate.toGMTString());
    // 2014-06-18T02:33:24.000Z
    console.log(newDate.toISOString());
    // 2014-06-18T02:33:24.000Z 
    console.log(newDate.toJSON());
    // 2014年6月18日 
    console.log(newDate.toLocaleDateString());
    // 2014年6月18日 上午10:33:24 
    console.log(newDate.toLocaleString());
    // 上午10:33:24 
    console.log(newDate.toLocaleTimeString());
    // Wed Jun 18 2014 10:33:24 GMT+0800 (中国标准时间)
    console.log(newDate.toString());
    // 10:33:24 GMT+0800 (中国标准时间) 
    console.log(newDate.toTimeString());
    // Wed, 18 Jun 2014 02:33:24 GMT
    console.log(newDate.toUTCString());
}

export default Utils
