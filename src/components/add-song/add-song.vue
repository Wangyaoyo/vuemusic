<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲</h1>
        <span class="close" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="getQuery" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @select="selectItem"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll" ref="songListRef">
            <div class="list-inner">
              <song-list @selectSong="select" :songs="playHistory"></song-list>
            </div>
          </scroll>
          <scroll v-if="currentIndex === 1" :data="searchHistory" class="list-scroll" ref="searchListRef">
            <div class="list-inner">
              <search-list :searches="searchHistory" @selectSearch="addQuery" @deleteSearch="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest @searchQuery="searchhistory" @listScroll="inputBlur" :query="query" ref="suggest" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">该歌曲已添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from "base/search-box/search-box";
  import Suggest from "components/suggest/suggest";
  import {searchMixin} from "common/js/mixin";
  import Switches from "base/switches/switches";
  import {mapMutations,mapGetters,mapActions} from "vuex"
  import Scroll from "base/scroll/scroll";
  import SongList from "base/song-list/song-list";
  import Song from "common/js/song"
  import SearchList from "base/search-list/search-list";
  import TopTip from "base/top-tip/top-tip";
  import {objectToSong} from "common/js/song";

  export default {
      mixins:[searchMixin],
      components: {TopTip, SearchList, SongList, Scroll, Switches, Suggest, SearchBox},
      data(){
        return{
          showFlag:false,
          currentIndex:0,
          switches:[
            {name:'最近播放'},
            {name:'搜索历史'}
            ]
        }
      },
      computed:{
        ...mapGetters([
          'playHistory',
          'searchHistory'
        ])
      },
      methods:{
        select(song,index){
          if(index !== 0){
            this.insertSong(objectToSong(song))
            this.showTip()
          }
        },
        show(){
          this.showFlag = true
          /* 重新计算高度 */
          setTimeout(()=>{
            if(this.currentIndex === 0){
              this.$refs.songListRef.refresh()
            }else{
              this.$refs.searchListRef.refresh()
            }
          },20)
        },
        hide(){
          this.showFlag = false
        },
        selectItem(index){
          this.currentIndex = index
        },
        showTip(){
          this.$refs.topTip.show()
        },
        ...mapActions([
          'insertSong'
        ])
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
