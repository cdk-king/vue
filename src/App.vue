<template>
    <div id="app">
        <!-- :key="activeDate" -->
        <!-- :key="key" -->
        <router-view ></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    /* 浅绿色主题 */
    @import "../static/css/theme-green/color-green.css";   
    /*深色主题*/
    @import "../static/css/color-dark.css"; 
    
</style>

<script>
export default {
    data(){
        return {
            activeDate:new Date()
        }
    },
    computed: {
        key() {
            return new Date()
        }
    },
    methods:{
        changeDate(){
            this.activeDate = new Date();
        },
        judgelogin(){ //methods写一个判断是否登录的方法
        }
    },
    created() {
        this.judgelogin(); //在created里调用上面构造的方法
    }
}
</script>