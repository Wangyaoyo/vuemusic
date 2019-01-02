import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import rank from 'components/rank/rank'
import search from 'components/search/search'
import singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
/* 子路由使用步骤：导入组件 配置子路由 <router-view>标签 事件中push进去 */
import Disc from 'components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path:'/rank',
      component:rank
    },
    {
      path:'/search',
      component:search
    },
    {
      path:'/singer',
      component:singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    }
  ]
})
