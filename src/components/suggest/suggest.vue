<template>
  <scroll class="suggest"
          :data="result"
          :pullUp="pullUp"
          @scrollToEnd="searchMore"
          :beforeScroll="beforescroll"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selecItem(item)" v-for="item in result">
        <div class="icon">
          <i :class="getIconCla(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading text="" v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result text="抱歉，暂无此歌曲"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {getSearchSong} from "api/search";
  import {ERR_OK} from "api/config";
  import Scroll from "base/scroll/scroll";
  import {createSong} from "common/js/song";
  import Loading from "base/loading/loading";
  import Singer from "common/js/singer"
  import {mapMutations} from "vuex"
  import {mapActions} from "vuex"
  import NoResult from "base/no-result/no-result";

  const pageNum = 30
  const TYPE_SINGER = 'singer'
  export default {
    components: {NoResult, Loading, Scroll},
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        result: [],
        page: 1,
        hasMore:true,
        pullUp:true,
        beforescroll:true
      }
    },
    methods: {
      listScroll(){
        this.$emit('listScroll')
      },
      selecItem(item){
        //点击歌手
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          /* 设置singer 才能显示歌手详情页 */
          this.setSinger(singer)
        }
        //点击歌曲
        else{
          this.insertSong(item)
        }
        /* 派发事件：存储搜索历史 */
        this.$emit('searchQuery')
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        getSearchSong(this.query, this.page, this.showSinger,pageNum).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      getIconCla(item) {
        return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _getSearch() {
        /* 一些重置操作（保证每次搜索词改变的时候重新开始） */
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0,0)
        this.result = []

        getSearchSong(this.query, this.page, this.showSinger,pageNum).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data);
            this.result = this.result.concat(this._genResult(res.data))
            // console.log(this.result);
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data){
        if(!data.song.list.length || data.song.curnum * this.page >= data.song.totalnum){
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          /* 用扩展运算符把它们都添加到一个对象上 */
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSong(data.song.list))
        }
        return ret
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        'setSinger':'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this._getSearch()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
