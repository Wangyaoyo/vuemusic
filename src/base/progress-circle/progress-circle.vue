<template>
  <div class="progress-circle">
    <!-- viewBox: svg视窗口,这个属性很重要，定义以后相当于一个舞台，内部元素单位都是相对于这个舞台，不受外部单位影响。 -->
    <!-- stroke-dasharray: 圆周长：2πR = 2 * 3.14 * 50 default：2πR -->
    <!-- stroke-dashoffset: 周长偏移量（逆时针） default：0 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  /*
  *stroke-width: 8px 描边宽度，实际指视窗内的宽度（当svg内部视窗宽度和svg的width比例为1:1时,1px = 1px）
  *transform-origin: 旋转的中心点
  *transfrom: scale(0.9) rotate(-90deg); scale：缩放比例 rotate：默认是X轴0deg，-90deg看起来更像常规进度条
  *stroke：描边颜色
  */
  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
