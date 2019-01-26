## 一、项目概况

### 项目目标： 开发一个媲美原生的移动端App

### 前端技术栈：

- Vue：主要js框架，核心是数据绑定
- Vue-router：为单页面应用提供的路由系统
- Vuex：状态管理工具
- Vue-lazyload：第三方懒加载库，优化页面加载速度
- better-scroll：移动端滑动组件
- stylus：css预编译处理器
- ES6：ECMAScript新一代语法：模块化、解构赋值、类、promise、模板字符串、findIndex等等方法

### 后端技术栈

- Node.js：Express框架搭建本地服务器运行项目
- axios：服务端通讯。结合Node.js 代理后端请求，抓取QQ音乐数据
- jsonp：服务端通讯。抓取QQ音乐数据

### 自动化构建工具

- Vue-cli：Vue脚手架工具，快速初始化项目
- webpack：项目的编译打包
- vConsole：移动端的控制台输出工具

### 业务层(页面)

- 推荐页面
- 歌手页面
- 歌手详情页面
- 歌单页面
- 搜索页面
- 用户中心页面
- 歌曲列表页面
- 播放器页面
- 播放模式列表页面

### 业务组件

## 二、项目准备

### vue-cli快速初始化项目：

```js
npm install -g vue-cli
npm init webpack my-music        //初始化
npm run dev 				   //运行项目
```

### 项目结构(./src目录下)

- common：
  - fonts：字体文件
  - image：图片
  - js：util 、cache、song、singer类、mixin、dom操作、config(常量配置类)、jsonp封装
  - stylus：css文件
    - base.styl：基础样式，引用varible.styl
    - variable.styl：颜色定义，字体大小定义
    - icon.styl：制作字体文件后要使用的样式
    - reset.styl：重置默认样式
    - mixin：定义样式函数
    - index.styl：引入reset/base/icon.styl

- api：向后端代理发送请求的接口文件，一个业务一个文件
- base：基础组件
- components：业务组件
- router：路由配置
- store：配置vuex相关

##### 安装stylus stylue-loader

```npm installstylus-loader --save ```

##### 在main.js中引入

```import 'common/stylus/index.styl'```

## 三、项目骨架开发

### 页面入口

- index.html加入<meta>标签：**移动端常见的基本设置**

```html
<!-- 宽度等于设备宽度，原始缩放比例 最大最小缩放比例 用户不可缩放-->
<meta name="viewport" content="width=device-width, initial-scale=1.0,
      maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
```

- main.js

```js
/* 引入 babel-polyfill :辅助编译 一定要写在最前面 */
import 'babel-polyfill'

/* 引入总体样式 */
import 'common/stylus/index.styl'

/* 引入路由和状态管理 */
import router from './router'
import store from './store'

/* 引入fastClick :解决移动端点击300毫秒延迟问题 */
import FastClick from 'fastclick'
FastClick.attach(document.body);

/* 引入懒加载模块：Vue 的第三方插件都要use()*/
import Lazyload from 'vue-lazyload'
// 只要在index.js里规定了install方法，就可以向其他ui组件库那样，使用Vue.use()来全局使用
Vue.use(Lazyload,{
  /* require加载图片路径 */
  loading:require('common/image/default.png')
})

/* 引入移动端调试库 */
import vConsole from 'vconsole'
let vconsole = new vConsole()
console.log('I am vConsole')

/* 引入App组件：将App组件渲染挂载到index.html中id为app的元素上 */
import App from './App'

new Vue({
  el: '#app',
  /* 注入路由和状态管理 */
  router,
  store,
  /* ES6语法：通过render函数渲染dom树，挂载到el上 */
  /*Vue 在调用 render 方法时，会传入一个 createElement 函数作为参数，
  也就是这里的 h 的实参是 createElement 函数，然后 createElement 会以 APP 为参数进行调用*/
  render: h => h(App)
})
```

- 路由的配置（./router/index.js）

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes:[
      {
      path:'/',
      redirect:'/recommend'     //默认页面重定向到推荐页
      },
      {
        path: '/recommend',
        component: recommend,
        children: [{
            path: ':id',
            component: Disc
            }]
      }]
})
```
**App.vue**
```html
<!-- 对组件进行缓存，节省性能 -->
<keep-alive>
	<router-view></router-view>
</keep-alive>
```
**Tab.vue**
```html
<router-link tag="div" class="tab-item" to="/recommend">
    <span class="tab-link">推荐</span>
</router-link>

/* 链接被激活的样式 */
&.router-link-active
   .tab-link
      color $color-theme
      border-bottom solid 2px $color-theme
```

