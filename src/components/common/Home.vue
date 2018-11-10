<template>
    <div class="wrapper">
        <v-head v-on:increment1="increment1"></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <!-- 注意标签格式 --> 
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <!-- 
                    <keep-alive>是Vue的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。 
                    可使用$route.meta的keepAlive属性设置是否缓存   
                    -->
                    <keep-alive :include="tagsList">
                        <!-- 在用到子组件的地方监听，监听当前实例上的自定义事件 ,接受参数，并执行回调-->
                        <router-view v-on:increment1="increment1"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false,
                value:"这是父组件的数据",
            }
        },
        components:{
            vHead, vSidebar, vTags
        },
        created(){
            //$on $emit 可实现组件间的通讯
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            bus.$on('busEmit',function(msg){
                    console.log(msg);
            })
            // bus.$on('increment1', function(){
            //     console.log("cdkckdklckdclkdclkdlcd");
            // })
            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
        },
        methods:{
                //这个回调在父组件监听到事件时，执行的，其参数为触发事件时传递的
                increment1(str){
                    console.log(str);
                },
        }
    }
</script>
