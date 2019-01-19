<template>
  <div class="player" v-show="playList.length>0">
    <!--播放器-->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCla">
                <img class="image" :src="currentSong.image"/>
              </div>
            </div>
            <!--单行歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
            <!--/end单行歌词-->
          </div>
          <!--歌词滚动图层-->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines" ref="lyricLine">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
          <!--/end歌词滚动图层-->
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentPage === 'cd'}"></span>
            <span class="dot" :class="{'active':currentPage === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(nowTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeClass" @click="modeChange"></i>
            </div>
            <div class="icon i-left" :class="disableCla">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="playClass" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCla">
              <i class="icon icon-next" @click="next"></i>
            </div>
            <div class="icon i-right" @click="toggleFavorite(currentSong)">
              <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--end/播放器-->
    <!--迷你播放器-->
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCla"/>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :percent="percent" :radius="radius">
            <i :class="miniPlayCla" class="icon-mini" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <Playlist ref="playlistRef"></Playlist>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"
           @ended="endSong"></audio>
    <!--end/迷你播放器-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations,mapActions} from 'vuex'
  import animations from "create-keyframe-animation"
  import {prefixName} from "common/js/dom"
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from "common/js/config";
  import {getRandomList} from "common/js/util";
  import Lyric from "lyric-parser"
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  import {modeMixin} from "common/js/mixin";
  import {objectToSong} from "common/js/song";

  const transform = prefixName('transform')
  const transitionDuration = prefixName('transitionDuration')
  export default {
    mixins:[modeMixin],
    computed: {
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
        'playHistory'
      ]),
      playClass() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayCla() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCla() {
        //设置两个值才能停止在原位置
        return this.playing ? 'play' : 'play pause'
      },
      disableCla() {
        return this.songReady ? '' : 'disabled'
      },
      percent() {
        return this.nowTime / this.currentSong.duration
      }
    },
    created() {
      /* 无需添加getter和setter ,可以在created中定义 */
      this.touch = {}
    },
    data() {
      return {
        songReady: false,
        nowTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentPage: 'cd',
        playingLyric: ''
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!newSong.id){
          return
        }
        /* 防止歌曲切换时歌词跳动 */
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        if (newSong.id === oldSong.id) {
          return
        }
        /* 使用setTimeout 而不是 nextTick的原因：保证微信从后台切到前台的时候歌曲可以重新播放？？？*/
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric();
        }, 1000)
      },
      playing(newplay) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newplay ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      showPlaylist(){
        this.$refs.playlistRef.show()
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      togglePlay() {
        this.setPlaying(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev() {
        if (!this.songReady) {
          return
        }
        /* 防止currentSong不变化歌词不会执行stop()*/
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlay()
          }
          this.songReady = false
        }
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length - 1) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlay()
          }
          this.songReady = false
        }
      },
      ready() {
        this.songReady = true
        /* 添加一条播放历史 */
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true
      },
      updateTime(e) {
        /* 获取到的是时间戳 */
        this.nowTime = e.target.currentTime
      },
      format(interval) {
        /* 或0就是向下取整 */
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = interval % 60
        if (second < 10) {
          return `${minute}:0${second}`
        }
        return `${minute}:${second}`
      },
      onProgressChange(percent) {
        const time = percent * this.currentSong.duration
        this.$refs.audio.currentTime = time
        if (!this.playing) {
          this.togglePlay()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(time * 1000)
        }
      },
      endSong() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        const audio = this.$refs.audio
        audio.currentTime = 0
        audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      getLyric() {
        let song = objectToSong(this.currentSong);
        song.getlyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLineNum = 0
          this.playingLyric = ''
        })
      },
      /* 歌词每一行发生改变时的回调函数 */
      handLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        this.playingLyric = txt
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          /* 向上偏移5个 */
          // console.log(this.$refs.lyricList);
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          /* 五行之内滚动到顶部 */
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
      middleTouchStart(e) {
        this.touch.initalted = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initalted) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentPage === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.max(Math.min(left + deltaX, 0), -window.innerWidth)
        /* 比较重要的变量 决定了滑动的方向 */
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        // 过渡效果持续的时间
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style[transitionDuration] = 0
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      middleTouchEnd() {
        let offset
        let opacity
        this.touch.initalted = false
        if (this.currentPage === 'cd') {
          if (this.touch.percent > 0.1) {
            opacity = 0
            offset = -window.innerWidth
            this.currentPage = 'lyric'
          } else {
            opacity = 1
            offset = 0
          }
        } else {
          if (this.touch.percent < 0.9) {
            opacity = 1
            offset = 0
            this.currentPage = 'cd'
          } else {
            opacity = 0
            offset = -window.innerWidth
          }
        }
        const time = 300
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offset}px,0,0)`
        this.touch.initiated = false
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        /* 1.注册animation : 每个百分比下面的动画是怎样的 */
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        /* 2.注册animation */
        animations.registerAnimation({
          name: 'move',
          animation,         //插入自定义的动画
          presets: {        //参数配置
            duration: 400,   //持续时间
            easing: 'linear'  //过渡效果
          }
        })

        /* 3.运行animation */
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        /* done后执行的函数 */
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const miniWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        const scale = miniWidth / width
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
