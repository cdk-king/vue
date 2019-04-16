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

    前端开发流程

1、安装node.js：

下载相应版本的node.js,下载地址：https://nodejs.org/en/download/，下载完双击安装，点击下一步直到安装完成

2、安装npm的国内镜像：

安装完成后，附件里选择命令提示符（或者在开始的搜索框里输入cmd回车调出命令面板）输入：node -v回车，出现相应版本证明安装成功， node环境已经安装完成，由于有些npm有些资源被屏蔽或者是国外资源的原因，经常会导致用npm安装依赖包的时候失败，所有我还需要npm的国内镜像---cnpm。在命令行中输入：npm install -g cnpm –registry=https://registry.npm.taobao.org回车，大约需要3分钟，如果报错或没反应，则卸掉node.js重新安装

3、安装全局vue-cli脚手架：

vue-cli脚手架用于帮助搭建所需的模板框架。输入命令：cnpm install -g vue-cli回车等待完成。

4、安装webpack：

//全局安装
cnpm install -g webpack
//安装到你的项目目录
cnpm install --save-dev webpack

5、安装项目所需的依赖包：

首先输入：cd 项目名回车，然后输入：cnpm install回车等待安装，安装完成之后，会在我们的项目目录文件夹中多出一个node_modules文件夹，这里边就是我们项目需要的依赖包资源。安装完依赖包之后，就可以运行整个项目了。

6、测试环境是否搭建成功：

在cmd里输入：cnpm run dev回车，项目运行成功后，浏览器打开localhost:8080（如果浏览器没有自动打开，可以手动输入）查看项目效果。

7、打包：

在cmd里输入：cnpm run build回车，打包完成后会在项目根目录生成dist文件夹


    后端开发流程

1、安装JDK1.8并配置好JAVA_HOME环境变量.

2、安装maven依赖（jar包管理）

3、将打包好的前端文件dist放在\src\main\resources\static\目录下，

4、配置数据库源

在根目录的application.properties文件下添加
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/gm?serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=123456

5、初始化springboot项目

运行后端springboot项目，浏览器打开localhost:8011/dist/index.html即可看到项目效果

6、打包:

在项目目录下用cmd命令行输入mvn package spring-boot:repackage
打包完成后会在项目根目录下的target文件夹下生成game-web-server.jar文件


## 构建生产 ##

    前端

// 执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build

    后端

在项目目录下用cmd命令行输入mvn package spring-boot:repackage
打包完成后会在项目根目录下的target文件夹下生成game-web-server.jar文件


## 功能开发 ##

    权限系统

权限控制系统采用了类似RBAC模型
系统中包括用户、角色、权限模块，一个用户拥有若干角色，每一个角色拥有若干权限。一般是多对多的关系
 
权限绑定前端的路由系统，前端的路由采用了动态路由，每个路由都有自己的权限标识，只有当用户拥有该权限时才会添加该路由，同时主界面的菜单栏也根据路由动态的显示和隐藏。
操作权限的判定需要在组件页面里动态实现显示或者隐藏，下边是操作权限实现的一个示例：
 
    区服管理系统

区服管理主要包括游戏管理，平台管理，服务器管理，渠道管理，数据源管理
一个游戏有若干个平台，一个平台有若干个服务器，一个平台有若干个渠道，都是一对多的关系，一个平台有且只有唯一的一个数据源，一个游戏有且只有一个服务器列表接口，关系图如下：
 
其中一个平台绑定一个角色Id，系统通过判断用户所拥有的角色Id来判断用户对应那个平台，再通过平台来判断对应哪个游戏，哪些服务器。
用户进入系统后可以自行切换已关联的游戏，切换游戏后，用户将只能看到当前游戏下，自己拥有的平台的数据。

    日志系统

日志系统主要包括物品流通日志、现金流日志、角色创建日志、角色登录日志、充值流水日志、充值消费日志。
日志系统的数据全部来自平台数据源接口的数据，不同的平台有不同的数据源，具体数据源需要在区服管理里的数据源管理页面中去配置。
不同的日志数据对应着数据源数据库里的一张数据表，除了平台和服务器字段，其他的字段名均储存在一个xml文件中，前端通过接口获取到xml文件的json数据，再把不同日志的字段名映射到日志页面中。
 
日志系统的所有接口都写在后端控制层的PlayerLogTableController.class文件中，其中
getLogXml方法是获取日志字段的接口，下边将展示添加新日志的大致步骤：

添加前端日志组件

需要有平台筛选框、服务器筛选框、角色信息筛选框、查询按钮、数据表格、分页器
效果图如下：
 
获取字段信息

通过接口/api/log/getLogXml获取数据源数据库表字段，获取对应的数据表的字段，将字段逐一映射到表格中。

添加获取表格数据接口

在后端控制层的PlayerLogTableController.class文件中添加新的获取数据接口，首先通过游戏Id和平台Id获取相应的数据源地址、数据源用户名和数据源密码，再通过数据源信息创建新的数据源连接，通过相应的sql语句查询对应数据库表的数据，最后添加数据筛选和数据分页。

前端组件通过接口显示数据

前端组件通过 axios 的post请求从接口获取数据并将数据显示在表格中。

添加路由和权限

在前端的vue Router中的dynamicRouter.js中添加权限路由，示例：
setRouterItem("/Shop","充值消费","Shop_View","Shop.vue",children,right);
最后在权限管理中添加相应的权限即可。

    礼包激活码

激活码生成流程图：
 
激活码兑换流程图：
 
    激活码生成
    
激活码的生成需要获取游戏id、平台Id、礼包Id以及生成激活码的数量，在前端向后端传输数据时需要进行MD5加密，通过生成数量确认每个激活码对应且唯一的序列，再结合礼包Id、平台Id和随机生成的salt通过位算法生成激活码，将激活码逐一储存在文件中，最后生成一条保存礼包Id、游戏Id、平台Id、salt、开始序列、结束序列、文件地址的数据库记录。

    激活码兑换
    
兑换激活码时，首先判读激活码的格式和能否从激活码中读取礼包Id和序列号，再通过礼包Id查询当前玩家角色是否超过该礼包的领取限制、若没有超过上限，继续判断是否有相同游戏平台相同礼包Id和相同序列范围的生成记录，如果有则继续判断使用该序列号、礼包Id、平台Id、salt和相同算法生成的激活码和要兑换的激活码是否相同，如果相同则判断再激活码兑换记录中是否有该激活码的兑换记录，如果没有则说明该激活码有效，兑换成功。

    接口开发

后端接口的实现主要在Controller层
1)	定义控制器
使用 @RestController注解 定义一个 Controller 控制器
@RestController注解相当于@ResponseBody ＋ @Controller
大多数情况我们只需要返回json格式的字符串而不需要返回json对象，所以加上@Responsebody就行了
2)	设置接口url
使用 @RequestMapping注解 来映射 Request 请求与处理器
3)	获取数据
使用@requestBody注解常用来处理application/json类型。
当使用表单上传数据时，使用@RequestParam注解获取表单参数
当使用get请求时，使用（HttpServletRequest request）获取接收到的参数

    前端组件开发

系统里的各个页面都在单页面里边，都统称为组件(Component)，所有的 Vue 组件同时也都是 Vue 的实例，所以可接受相同的选项对象 (除了一些根级特有的选项) 并提供相同的生命周期钩子。
前端所有的组件都放在src/component/目录下，其中common文件夹下是一些公用组件，包括系统的父组件，头部组件，菜单栏组件和标签页组件，和一个bus.js（vue的组件通讯Event Bus）。Example文件夹下是一些vue-manage-system模板下的一些示例组件。Page文件夹下是系统各个功能的组件，新开发的组件统一写在page文件夹下。

    前端组件通讯

前端组件间的通讯主要用了官方推荐的Event Bus，核心文件是common文件夹下的bus.js。
实现通讯的过程是注册Event Bus事件和广播消息
导入Event bus
import bus from "../common/bus";

注册事件

created() {
    bus.$on("changeGameId",function(obj){
this.form.platformId = "";
        this.getData();
    }.bind(this))   
  },
  
触发事件

bus.$emit('changeGameId', {
    gameId:command.id,
    message:"已选择游戏："+command.gameName
});

销毁事件

beforeDestroy () {
    bus.$off('changeGame');
},
这个$on事件是不会自动清楚销毁的，需要我们手动来销毁

## 项目截图 ##


