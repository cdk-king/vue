<!--子组件-->
<template>
  <el-dialog :visible.sync="currentShow">
      {{this.$cdk}}
  </el-dialog>
</template>

<script>
export default {
  props:['show'],
  computed:{
      currentShow:{
          get(){
              return this.show
          },
          set(val){
              //触发自定义事件update:show(或者函数名吧)，val为参数
              this.$emit("update:show",val)
          }
      }
  }
}
</script>