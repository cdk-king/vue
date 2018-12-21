<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。
                访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>
            </div>
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: 'Hello World'
                }
            }
        },
        components: {
            quillEditor
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            }
            // 背景颜色 - background 
            // 加粗- bold 
            // 颜色 - color 
            // 字体 - font 
            // 内联代码 - code 
            // 斜体 - italic 
            // 链接 - link 
            // 大小 - size 
            // 删除线 - strike 
            // 上标/下标 - script 
            // 下划线 - underline 
            // 引用- blockquote 
            // 标题 - header 
            // 缩进 - indent 
            // 列表 - list 
            // 文本对齐 - align 
            // 文本方向 - direction 
            // 代码块 - code-block 
            // 公式 - formula 
            // 图片 - image 
            // 视频 - video 
            // 清除字体样式- clean

        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>