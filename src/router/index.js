import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import rank from 'components/rank/rank'
import search from 'components/search/search'
import singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import User from 'components/user-center/user-center'
/* 子路由使用步骤：导入组件 配置子路由 <router-view>标签 事件中push进去 */
import Disc from 'components/disc/disc'
import TopList from 'components/topList/topList'

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
      component:rank,
      children:[
        {
          path:':id',
          component:TopList
        }
        ]
    },
    {
      path:'/search',
      component:search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
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
    },
    {
      path:'/user',
      component:User
    }
  ]
})
