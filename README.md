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

1.	|-- build                            // webpack配置文件
2.	|-- config                           // 项目打包路径
3.	|-- src                              // 源码目录
4.	|   |-- code                   		// 代码块
5.	|       |-- formatDatetime.js       // 时间格式转换
6.	|       |-- setLocalThisUrl.js      // 设置接口地址
7.	|   |-- components                   // 组件
8.	|       |-- common                   // 公共组件
9.	|           |-- bus.js           	// Event Bus
10.	|           |-- Header.vue           // 公共头部
11.	|           |-- Home.vue             // 公共路由入口
12.	|           |-- Sidebar.vue          // 公共左边栏
13.	|           |-- Tags.vue             // 页面切换标签组件
14.	|       |-- example                  // 示例组件
15.	|           |-- BaseCharts.vue       // 基础图表
16.	|           |-- BaseForm.vue         // 基础表单
17.	|           |-- BaseTable.vue        // 基础表格
18.	|           |-- DragList.vue         // 拖拽列表组件
19.	|           |-- Icon.vue		// 自定义图标组件
20.	|           |-- Login.vue            // 登录
21.	|           |-- Markdown.vue         // markdown组件
22.	|           |-- Premission.vue       // 权限测试组件
23.	|           |-- Upload.vue           // 图片上传
24.	|           |-- VueEditor.vue        // 富文本编辑器
25.	|       |-- page                   	// 主要路由页面
26.	|           |-- 403.vue		//403
27.	|           |-- 404.vue		//404
28.	|           |-- AllEmail.vue         // 全服邮件
29.	|           |-- AllNotice.vue        // 全服更新公告
30.	|           |-- AppleProp.vue        // 申请道具邮件
31.	|           |-- BackDoor.vue         // 系统后门
32.	|           |-- BanIP.vue            // IP禁封
33.	|           |-- CDK_Use.vue          // 激活码使用情况
34.	|           |-- Center.vue           // 用户中心
35.	|           |-- Channel.vue          // 通道管理
36.	|           |-- CreateRoleLog.vue   // 角色创建日志记录
37.	|           |-- Dashboard.vue        // 系统首页
38.	|           |-- DataSource.vue       // 数据源管理 
39.	|           |-- GameTable.vue        // 游戏管理
40.	|           |-- GiftTable.vue        // 礼包管理(未)
41.	|           |-- GiftUpload.vue       // 礼包导入
42.	|           |-- GoodFlowLog.vue      // 物品流通日志
43.	|           |-- Login.vue		// 用户登录
44.	|           |-- MoneyFlowLog.vue    // 现金流日志管理
45.	|           |-- NewGiftTable.vue    // 礼包导入信息管理
46.	|           |-- NewPropTable.vue    // 道具导入信息管理
47.	|           |-- PlatformTable.vue   // 平台管理
48.	|           |-- PlayerBanLog.vue    // 玩家禁封日志
49.	|           |-- PlayerInfo.vue      // 玩家信息查询
50.	|           |-- PlayerProhibitSpeakLog.vue    // 玩家禁言日志
51.	|           |-- PlayerUpload.vue    // 玩家信息导入
52.	|           |-- PropTable.vue    	// 道具管理(未)
53.	|           |-- PropUpload.vue    	// 道具信息导入
54.	|           |-- ReCharge.vue    	// 充值流水日志
55.	|           |-- Register.vue    	// 用户注册(未)
56.	|           |-- RightTable.vue   	// 权限管理
57.	|           |-- RoleLoginLog.vue    	// 角色登录日志
58.	|           |-- RoleTable.vue    	// 角色管理
59.	|           |-- SendEmail.vue  	// 发送邮件
60.	|           |-- SendNotice.vue    	// 发送广播
61.	|           |-- ServerTable.vue    	// 服务器树形管理
62.	|           |-- Shop.vue    		// 充值消费日志
63.	|           |-- SystemConfig.vue   	// 系统配置(未)
64.	|           |-- TouristIdSet.vue    	// 游客账号设置
65.	|           |-- UploadFile.vue    	// 文件中转
66.	|           |-- UserTable.vue    	// 用户管理
67.	|           |-- Xlsx.vue    		// Xlsx文件导入(未)
68.	|   |-- router                       // 路由
69.	|       |-- defaultRouter.js      	// 默认路由
70.	|       |-- dynamicRouter.js      	// 动态路由
71.	|       |-- index.js      		// 设置路由
72.	|   |-- store                      	// vuex
73.	|       |-- actions.js      	// 
74.	|       |-- getters.js      	// 
75.	|       |-- index.js      	// 
76.	|       |-- mutations.js      	// 
77.	|   |-- UtilsJs                      // 工具
78.	|       |-- Utils.js      	// 工具
79.	|   |-- App.vue                      // 页面入口文件
80.	|   |-- main.js                      // 程序入口文件，加载各种公共组件
81.	|-- .babelrc                         // ES6语法编译配置
82.	|-- .editorconfig                    // 代码编写规格
83.	|-- .gitignore                       // 忽略的文件
84.	|-- index.html                       // 入口html文件
85.	|-- package.json                     // 项目及工具的依赖配置文件
86.	|-- README.md                        // 说明


后端目录结构
1.	|-- log                            	// 日志
2.	|-- META-INF                         // 
3.	|   |-- MANIFEST.MF                  // 
4.	|-- src                              // src
5.	|   |-- main                         // main
6.	|       |-- java          		// java
7.	|           |--com           	// Event Bus
8.	|           	|--cdk           	// Event Bus
9.	|           	|--app           	// Event Bus
10.	|           	|--configLoader           	// 配置加载器
11.	|           	|--controller           	// controller层
12.	|           	|--dao           		// dao层
13.	|           	|--entity           	// 实体类
14.	|           	|--result           	// 返回消息
15.	|           	|--service           	// server类
16.	|           	|--timer           	// 定时器
17.	|           	|--util           	// 工具类
18.	|           	|--XssFilter           	// 跨站脚本攻击过滤器
19.	|           	|--Main.java           	// 项目主入口
20.	|       |-- resources       		// resources
21.	|           |-- META-INF           	// META-INF
22.	|           	|--MANIFEST.MF      // MANIFEST.MF
23.	|           |-- static           	// static
24.	|           	|--dist              // 前端打包文件
25.	|           	|--favicon.ico      // 项目图标(暂)
26.	|           |-- templates           	// templates
27.	|           |-- banner.txt           // banner.txt
28.	|           |-- logback.xml          // logback.xml
29.	|       |-- webapp       		// webapp
30.	|           |-- WEB-INF           	// WEB-INF
31.	|           	|--jsp           	// jsp
32.	|           	|--index.jsp    // index.jsp
33.	|-- target                           // 打包文件夹
34.	|   |-- classes                      // classes
35.	|   |-- classes                      // classes
36.	|   |-- generated-sources           // generated-sources
37.	|   |-- maven-archiver              // maven-archiver
38.	|   |-- maven-status                // maven-status
39.	|   |-- game-web-server.jar        // 打包文件
40.	|-- .gitignore                       // 
41.	|-- application.properties          //外部配置文件
42.	|-- gm.sql                           // 数据库生成文件
43.	|-- info.txt                         // 信息文件 
44.	|-- pom.xml                          // maven配置文件
45.	|-- README.md                        // 说明
46.	|-- tlog.xml                         // 日志表字段说明
47.	|-- 道具表示例.xls                    //道具表示例.xls
48.	|-- 礼包表示例.xls                    // 礼包表示例.xls
49.	|-- 执行当前目录game-web-server程序.bat   // 打包文件执行命令




## 相关技术 ##

    前端技术栈：
编程语言：html5、js、css
开发工具：Visual Studio Code
开发框架：vue + axios
包管理工具:npm
打包工具：webpack
    后端技术栈：
编程语言：java
开发工具：IntelliJ IDEA
开发框架：spring boot
包管理工具: maven资源库
打包工具：spring-boot-maven-plugin


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
