<template>
  <scroll class="listview"
          :data="data"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType"
          ref="listView">
    <ul>
      <li v-for="item in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{item.title}}</h2>
        <ul>
          <li v-for="ll in item.items" class="list-group-item" @click="selectItem(ll)">
            <img class="avatar" width="50" height="50" v-lazy="ll.avatar"/>
            <p class="name">{{ll.name}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            :data-index="index"
            :class="{'current':currentIndex === index}"
            class="item"
        >{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <loading class="loading-container" v-show="!data.length"></loading>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from "common/js/dom"
  import Loading from "base/loading/loading"

  const SHORT_CUT_LEN = 18
  const FIXED_HEIGHT = 30
  export default {
    created() {
      this.touch = {}
    },
    props: {
      data: {
        type: Array,
        default: null,
      }
    },
    data() {
      return {
        listenScroll: true,
        probeType: 3,
        scrollY: -1,
        listHeight: [],
        currentIndex: 0,
        diff: -1
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data() {
        /* 数据到dom的变化会有一个延时：确保dom更新完成 */
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        if (-newY < 0) {
          this.currentIndex = 0
        }
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if ((-newY < height2 && -newY >= height1)) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
        // if (this.fixedTop === fixedTop) {
        //   return
        // }
        // this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    methods: {
      refresh(){
        this.$refs.listView.refresh()
      },
      onShortcutTouchStart(e) {
        let index = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.firstindex = index
        this._scrollTo(index)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let dalta = (this.touch.y2 - this.touch.y1) / SHORT_CUT_LEN | 0
        let lastIndex = parseInt(this.touch.firstindex) + dalta
        this._scrollTo(lastIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < this.data.length; i++) {
          let list = this.$refs.listGroup[i]
          height += list.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
