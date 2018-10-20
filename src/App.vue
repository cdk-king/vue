<template>
    <div id="app">
        <router-view :key="activeDate"></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>

<script>
export default {
    data(){
        return {
            cdk:"Appcdk",
            activeDate:new Date()
        }
    },
    computed: {
        key() {
            console.log("keykeykey");
            return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
        }
    },
    methods:{
        changeDate(){
            console.log("changeDate");
            this.activeDate = new Date();
        },
        judgelogin(){ //methods写一个判断是否登录的方法
            // let isLogin = store.state.token; //这里我们从Vuex里取出token，因为登录请求成功后我们会将后台返回的token存储在vuex里方便使用
            // if(!isLogin){ //如果没有token，那就代表用户没有登录
                
            // }
            //return this.$router.push('/login'); //重定向到login页
        }
    },
    created() {
        this.judgelogin(); //在created里调用上面构造的方法
    }
}
</script>