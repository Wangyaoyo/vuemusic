<template>
	<div class="header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin.styl"
  .header
    position relative
    color $color-theme
    text-align center
    height 44px
    font-size 0
    .icon
      display inline-block
      margin-top 6px
      margin-right 9px
      width 30px
      height 32px
      background-size 30px 32px
      vertical-align top
      bg-image('logo')
    .text
      display inline-block
      font-size $font-size-large
      line-height 44px
</style>
