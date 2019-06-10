/* 引入 babel-polyfill :辅助编译 */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import Lazyload from 'vue-lazyload'

/* 引入移动端调试库 */
import vConsole from 'vconsole'
let vconsole = new vConsole()

Vue.config.productionTip = false
/* 解决移动端点击300毫秒延迟问题 */
FastClick.attach(document.body);
/* 引入总体样式 */
import 'common/stylus/index.styl'
/* eslint-disable no-new */
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
/* 懒加载模块：Vue 的第三方插件都要use()*/
Vue.use(Lazyload,{
  /* require加载图片路径 */
  loading:require('common/image/default.png')
})
