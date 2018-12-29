<template>
	<div class="singer">
    <listview :data="singerList" @select="select"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
    import {getSingerList} from "api/singer";
    import {ERR_OK} from "api/config";
    import Singer from "common/js/singer"
    import Listview from "base/listview/listview"
    import {mapMutations} from "vuex"
    const HOT_SINGER = '热门'
    const HOT_LENGTH = 10
    export default {
      data(){
        return {
          singerList:[]
        }
      },
      created(){
          this._getSingerList()
      },
      methods:{
        select(singer){
          /* 子路由跳转 */
          this.$router.push({
            path:`/singer/${singer.id}`
          })
          this.setSinger(singer)  //数据是payload
        },
        _getSingerList(){
          getSingerList().then((res) => {
            if(res.code === ERR_OK){
              console.log(res.data.list)
              this.singerList = this._normalSingers(res.data.list)
            }
          })
        },
        _normalSingers(list){
          let map = {
            hot:{
              title: HOT_SINGER,
              items:[]
            }
          }
          list.forEach((item,index) => {
            if(index < HOT_LENGTH){
              map.hot.items.push(
                new Singer({
                id:item.Fsinger_mid,
                name:item.Fsinger_name
              }))
            }
            const key = item.Findex
            if(!map[key]){
              map[key] = {
                title:key,
                items:[]
              }
            }
            map[key].items.push(
              new Singer({
                id:item.Fsinger_mid,
                name:item.Fsinger_name
              }))
          })
          let hot = []
          let ret = []
          for(let m in map){
            let val = map[m]
            if(val.title.match(/[a-zA-Z]/)){
              ret.push(val)
            }else{
              hot.push(val)
            }
          }
          ret.sort((a,b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
          console.log(hot.concat(ret));
          return hot.concat(ret)
        },
        ...mapMutations({
          /* 对象映射 */
          setSinger:'SET_SINGER'
        })
      },
      components:{
        Listview
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
