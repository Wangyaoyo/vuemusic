<template>
  <div id="app">
    <Header></Header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Header from 'components/header/header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'
export default {
  components:{
    Header,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
  @import "common/stylus/reset.styl"
  #app
    width 100%
    height 100%
    color: $color-theme
</style>
