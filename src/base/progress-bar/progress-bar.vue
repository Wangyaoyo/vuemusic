<template>
  <div class="progress-bar" ref="progressBar" @click="clickPercent">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"
             @touchstart="progressTouchStart"
             @touchmove="progressTouchMove"
             @touchend="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixName} from "common/js/dom";

  const btnWidth = 16
  const transform = prefixName('transform')
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initalted) {
          const barWidth = this.$refs.progressBar.clientWidth - btnWidth
          const offset = barWidth * newPercent
          this._updateProgressWidth(offset)
        }
      }
    },
    methods: {
      progressTouchStart(e) {
        /* 初始化标志 :防止拖动时的跳动 */
        this.touch.initalted = true
        /* 第一次点击的位置 */
        this.touch.startX = e.touches[0].pageX
        /* 进度条滑过的宽度 */
        this.touch.progressLeft = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initalted) {
          return
        }
        const delta = e.touches[0].pageX - this.touch.startX
        const offset = Math.min(Math.max(this.touch.progressLeft + delta, 0), this.$refs.progressBar.clientWidth-btnWidth)

        this._updateProgressWidth(offset)
      },
      progressTouchEnd() {
        this.touch.initalted = false
        this.triggerPercent()
      },
      clickPercent(e) {
        /* 不通过e.offsetX 获取位置 会出现点击按钮跳回去的缺陷 */
        const offset = e.pageX - this.$refs.progressBar.getBoundingClientRect().left
        this._updateProgressWidth(offset)
        this.triggerPercent()
      },
      /* 通知父组件拖动完成后的percent */
      triggerPercent() {
        const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - btnWidth)
        this.$emit('percentChange', percent)
      },
      /* 更新进度 */
      _updateProgressWidth(offset) {
        this.$refs.progress.style.width = `${offset}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    width 230px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
