<!--父组件中引入子组件-->
<template>
    <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>消息弹出测试</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="handle-box">
                    <el-button type="primary" icon="search" @click="testMessage">消息弹出测试</el-button>
                    <el-button type="primary" icon="search" @click="testDialog">对话弹出测试</el-button>
                    <el-button type="primary" icon="search" @click="show = true">子组件通讯测试</el-button>
                    <t-dialog :show.sync="show"></t-dialog>
                </div>
                <div>
                    this.$cdk全局变量测试：{{cdk}}
                </div>
                <div>
                    localStorage.getItem('ms_username')：{{ms_username}}
                </div>
                <div></div>
                <div></div>
                

                
            </div>
            <!-- 编辑冻结提示框 -->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
                <div class="del-dialog-cnt">是否确定？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
import dialog from '../test/dialog.vue'
export default {
    name: 'CommunicationTest',
    data(){
        return {
        show:false,
        dialogVisible:false,
        }
    },
    components:{
        "t-dialog":dialog
    },
    computed:{
        cdk: function () {
            return this.$cdk;
        },
        ms_username:function(){
            const role = localStorage.getItem('ms_username');
            return role;
        }
    },
    methods:{
        testMessage(){
            this.$message.success('success');
        },
        testDialog(){
            this.dialogVisible = true;
        },

    }
}
</script>