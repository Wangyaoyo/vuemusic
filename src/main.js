/* 引入 babel-polyfill :辅助编译 */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import Lazyload from 'vue-lazyload'

Vue.config.productionTip = false
/* 解决移动端点击300毫秒延迟问题 */
FastClick.attach(document.body);
/* 引入总体样式 */
import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  /* 注入store */
  store,
  render: h => h(App)
})

/* 懒加载模块：Vue 的第三方插件都要use()*/
Vue.use(Lazyload,{
  /* require加载图片路径 */
  loading:require('common/image/default.png')
})