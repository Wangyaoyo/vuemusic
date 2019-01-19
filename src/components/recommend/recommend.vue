<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :data="discList" class="recommend-content">
        <!-- 加v-if条件，只有有数据才加载该dom-->
      <div>
        <div v-if="slider.length" class="slider-wrapper">
          <slider>
            <!-- 作为插槽插入组件内部的slot之中 -->
            <div v-for="item in slider">
              <a :href="item.linkUrl">
                <img @load="imgLoad" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectDisc(item)" class="item" v-for="item in discList">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl"/>
              </div>
              <div class="text">
                <h1 class="name" v-html="item.creator.name"></h1>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from "api/recommend";
  import {ERR_OK} from "api/config";
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from "common/js/mixin";
  import {mapMutations} from 'vuex'

  export default {
    mixins:[playlistMixin],
    data() {
      return {
        slider: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      selectDisc(disc){
        this.$router.push({
          path:`/recommend/:${disc.dissid}`
        })
        this.setDisc(disc)
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60': '0'
        this.$refs.recommend.style['bottom'] = `${bottom}px`
        this.$refs.scroll.refresh()
      },
      _getRecommend() {
        /* 返回的promise数据 */
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.slider = res.data.slider;
          }
        });
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      imgLoad(){
        /* 设置标志位，确保逻辑只执行一次  */
        if(!this.checkImgLoad){
          this.$refs.scroll.refresh()
          this.checkImgLoad = true;
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Scroll,
      Slider,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          /* 在纵轴上居中：单行 */
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            /* 在横轴上居中 */
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: #fff
            .desc
              color: rgba(255, 255, 255, 0.3)
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
