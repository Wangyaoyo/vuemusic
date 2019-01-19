<template>
  <transition name="slide">
    <div class="user-center" ref="userCenter">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @select="selectSwitch"></switches>
      </div>
      <div class="play-btn" @click="randomPlay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll v-if="currentIndex === 0" :data="favorite" class="list-scroll" ref="favoriteScroll">
          <div class="list-inner">
            <song-list :songs="favorite" @selectSong="selectSong"></song-list>
          </div>
        </Scroll>
        <Scroll v-if="currentIndex === 1" :data="playHistory" class="list-scroll" ref="recentScroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @selectSong="selectSong"></song-list>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show="!noResultFlag">
        <no-result :text="noResultText"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from "base/switches/switches";
  import {mapGetters,mapActions} from "vuex"
  import Scroll from "base/scroll/scroll";
  import SongList from "base/song-list/song-list";
  import {playlistMixin} from "common/js/mixin";
  import NoResult from "base/no-result/no-result";
  import {objectToSong} from "common/js/song";

  export default {
    mixins:[playlistMixin],
    components: {NoResult, SongList, Scroll, Switches},
    computed:{
      ...mapGetters([
        'favorite',
        'playHistory'
      ]),
      noResultText(){
        if(this.currentIndex === 0 ){
          return '暂无收藏'
        }else{
          return '您还没有听过歌曲'
        }
      },
      noResultFlag(){
        if(this.currentIndex === 0 ){
          return this.favorite.length > 0
        }else{
          return this.playHistory.length > 0
        }
      }
    },
    data() {
      return {
        currentIndex: 0,
        switches: [
          {name: '我喜欢的', index: 0},
          {name: '最近听的', index: 1}
        ]
      }
    },
    methods:{
      selectSwitch(index){
        this.currentIndex = index
      },
      back(){
        this.$router.back()
      },
      randomPlay(){
        if(this.currentIndex === 0 && this.favorite.length){
          let list = this.favorite.map((item)=>{
            return objectToSong(item)
          })
          this.randomPlayer({list})
        }else if(this.currentIndex === 1 && this.playHistory.length){
          let list = this.playHistory.map((item)=>{
            return objectToSong(item)
          })
          this.randomPlayer({list})
        }
      },
      selectSong(song,index){
        if(index >= 0){
          this.insertSong(song)
        }
      },
      handlePlaylist(playList){
        const bottom = playList.length > 0 ?  '60' : '0'
        this.$refs.listWrapper.style.bottom = `${bottom}px`
        /* 先判断是否存在再调用 */
        this.$refs.favoriteScroll && this.$refs.favoriteScroll.refresh()
        this.$refs.recentScroll && this.$refs.recentScroll.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlayer'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
