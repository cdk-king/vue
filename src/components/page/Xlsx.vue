<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 文件上传</el-breadcrumb-item>
                <el-breadcrumb-item>excel文件上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">excel文件上传</div>
            <div class="plugins-tips">
                SheetJS js-xlsx 是 SheetJS 的社区版,是一个电子表格解析和编写库。 SheetJS 是官方规格的纯 JS 实现,强调解析和编写性能,以及跨格式和兼容性。
                访问地址：<a href="https://github.com/SheetJS/js-xlsx" target="_blank">SheetJS/js-xlsx</a>
            </div>

            <Divider/>
            <div class="crop-demo">
                <input type="file" @change="importFile(this)" id="imFile" style="display: none"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                <Button type="primary" @click="uploadFile">导入</Button>
            </div>
            <Divider/>
            <div class="plugins-tips">
                <p style="">
                {{this.result}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import XLSX from 'xlsx';
    export default {
        name: 'upload',
        data: function(){
            return {
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                imFile: "", // 导入文件el
                result:""
            }
        },
        components: {
            VueCropper
        },
        mounted() {
        this.imFile = document.getElementById("imFile");
        },
        methods:{
            uploadFile: function() {
            // 点击导入按钮
            this.imFile.click();
            },
            importFile: function() {
                var self = this;
                // 导入excel
                this.fullscreenLoading = true;
                let obj = this.imFile;
                if (!obj.files) {
                    this.fullscreenLoading = false;
                    return;
                }
                var f = obj.files[0];
                console.log(f);
                var reader = new FileReader();
                let $t = this;
                reader.onload = function(e) {
                    var data = e.target.result;
                    console.log(e);
                    if ($t.rABS) {
                        $t.wb = XLSX.read(btoa(this.fixdata(data)), {
                        // 手动转化
                        type: "base64"
                        });
                    } else {
                        $t.wb = XLSX.read(data, {
                        type: "binary"
                        });
                    }
                    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
                    console.log(json);
                    console.log(JSON.stringify(json));
                    self.result = JSON.stringify(json);
                    //$t.dealFile(json); // analyzeData: 解析导入数据
                };
                if (this.rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            
        },
        created(){
        }
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>