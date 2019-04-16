<<<<<<< HEAD
# vue-manage-system #
基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案。[线上地址](http://blog.gdfengshuo.com/example/work/)

[English document](https://github.com/lin-xin/manage-system/blob/master/README_EN.md)


## 功能 ##

1.	用户管理	
添加用户	
编辑用户信息	
修改密码	
管理用户角色	
编辑角色	
删除用户	
2.	角色管理	
添加角色
角色信息编辑
管理权限	
编辑权限	
删除角色	
3.	权限管理	
添加权限	
编辑权限	
删除权限	
4.	游戏管理	
添加游戏	
编辑游戏信息	
删除游戏	
5.	平台管理	
添加平台	
编辑平台信息	
删除平台	
6.	数据源管理	
添加数据源	
编辑数据源	
测试数据源	
删除数据源	
7.	渠道管理	
添加渠道	
编辑渠道	
删除渠道	
8.	服务器管理	
服务器同步	
编辑服务器信息	
设置服务器状态	
设置默认服务器	
添加平台渠道	
删除服务器	
9.	服务器树形管理	
查看服务器信息	
编辑服务器信息	
删除服务器	
10.	玩家基本信息	
查询玩家详细信息	
玩家禁言	
玩家禁封	
11.	玩家禁言记录	
查看禁言记录	
12.	玩家禁封记录	
查看玩家禁封记录	
13.	IP禁封	
添加IP禁封申请	
IP禁封	
删除禁封申请	
14.	物品流通日志	
查看物品流通日志	
15.	现金流日志	
查看现金流日志	
16.	角色创建日志	
查看角色创建日志	
17.	角色登录日志	
查看角色登录日志	
18.	充值流水日志	
查看充值流水日志	
19.	充值消费日志	
查看充值消费日志	
20.	发送邮件	
进行提交邮件申请	
编辑邮件信息	
发送邮件	
删除邮件申请	
21.	发送广播	
提交广播申请	
发送广播	
删除广播申请
22.	全服邮件	
添加全服邮件申请	
编辑全服邮件申请	
发送全服邮件	
删除全服邮件申请	
23.	全服公告	
添加全服更新公告申请	
编辑全服公告信息	
发送全服公告	
删除全服公告申请	
24.	道具导入信息	
查看道具导入信息	
25.	道具导入	
导入道具信息	
26.	发送道具邮件	
添加道具邮件申请	
编辑道具邮件	
发送道具邮件	
删除道具邮件申请	
27.	礼包导入信息
查看礼包导入信息	
28.	礼包导入	
礼包信息导入	
29.	申请礼包激活码	
生成礼包激活码	
下载激活码文件	
删除礼包激活码文件	
30.	激活码使用情况	
查询激活码是否有效	
31.	游客账号设置	
设置游客账号	
32.	文件中转	
文件上传	
文件下载	
文件删除	
33.	用户中心	
编辑个人信息	
密码修改	
34.	用户登录	
用户登录	
35.	退出登录	
退出登录	
36.	游客登录	
游客登录	
37.	系统后门	


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- bus.js           	 // Event Bus
	|           |-- Header.vue           // 公共头部
	|           |-- Home.vue           	 // 公共路由入口
	|           |-- Sidebar.vue          // 公共左边栏
	|           |-- Tags.vue           	 // 页面切换标签组件
	|       |-- page                   	 // 主要路由页面
	|           |-- 403.vue
	|           |-- 404.vue
	|           |-- BaseCharts.vue       // 基础图表
	|           |-- BaseForm.vue         // 基础表单
	|           |-- BaseTable.vue        // 基础表格
	|           |-- DashBoard.vue        // 系统首页
	|           |-- DragList.vue         // 拖拽列表组件
	|           |-- Icon.vue			 // 自定义图标组件
	|           |-- Login.vue          	 // 登录
	|           |-- Markdown.vue         // markdown组件
	|           |-- Premission.vue       // 权限测试组件
	|           |-- Upload.vue           // 图片上传
	|           |-- VueEditor.vue        // 富文本编辑器
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 安装步骤 ##

	git clone https://github.com/lin-xin/vue-manage-system.git      // 把模板下载到本地
	cd vue-manage-system    // 进入模板目录
	npm install         // 安装项目依赖，等待安装完成之后

## 本地开发 ##

	// 开启服务器，浏览器访问 http://localhost:8080
	npm run dev

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build

## 组件使用说明与演示 ##

### vue-schart ###
vue.js封装sChart.js的图表组件。访问地址：[vue-schart](https://github.com/linxin/vue-schart)
<p><a href="https://www.npmjs.com/package/vue-schart"><img src="https://img.shields.io/npm/dm/vue-schart.svg" alt="Downloads"></a></p>

```html
<template>
    <div>
        <schart  class="wrapper"
				:canvasId="canvasId"
				:type="type"
				:data="data"
				:options="options"
		></schart>
    </div>
</template>
	
<script>
    import Schart from 'vue-schart';        // 导入Schart组件
    export default {
        data: function(){
            return {
                canvasId: 'myCanvas',       // canvas的id
                type: 'bar',                // 图表类型
                data: [
                    {name: '2014', value: 1342},
                    {name: '2015', value: 2123},
                    {name: '2016', value: 1654},
                    {name: '2017', value: 1795},
                ],
                options: {                  // 图表可选参数
                    title: 'Total sales of stores in recent years'
                }
            }
        },
        components: {
            Schart
        }
    }
</script>
<style>
.wrapper{
	width: 7rem;
	height: 5rem;
}
</style>
```

### element-ui ###
一套基于vue.js2.0的桌面组件库。访问地址：[element](http://element.eleme.io/#/zh-CN/component/layout)

### Vue-Quill-Editor ###
基于Quill、适用于Vue2的富文本编辑器。访问地址：[vue-quill-editor](https://github.com/surmon-china/vue-quill-editor)

（IE10及以下不支持）

### mavonEditor ###
基于Vue的markdown编辑器。访问地址：[mavonEditor](https://github.com/hinesboy/mavonEditor)

### vue-cropperjs ###
一个封装了 cropperjs 的 Vue 组件，用于裁剪图片。访问地址：[vue-cropperjs](https://github.com/Agontuk/vue-cropperjs)

## 其他注意事项 ##
### 一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？ ###

举个栗子，我不想用 Vue-Quill-Editor 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/index.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    // 富文本编辑器组件
    path: '/editor',
    component: resolve => require(['../components/page/VueEditor.vue'], resolve) 
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 VueEditor.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/Sidebar.vue 中，找到该入口，删除下面这段代码。
	
```js
{
	index: 'editor',
	title: '富文本编辑器'
},
```

第四步：卸载该组件。执行以下命令：
	
	npm un vue-quill-editor -S

完成。

### 二、如何切换主题色呢？ ###

第一步：打开 src/main.js 文件，找到引入 element 样式的地方，换成浅绿色主题。

```javascript
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
```

第二步：打开 src/App.vue 文件，找到 style 标签引入样式的地方，切换成浅绿色主题。

```javascript
@import "../static/css/main.css";
@import "../static/css/color-dark.css";     /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
```

第三步：打开 src/components/common/Sidebar.vue 文件，找到 el-menu 标签，把 background-color/text-color/active-text-color 属性去掉即可。

## 项目截图 ##

=======
# GmWebBrowser
>>>>>>> c6fd5a6a9ec4e5b4a7d7dfb7879971812f8a72b1
