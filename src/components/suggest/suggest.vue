<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCla(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {getSearchSong} from "api/search";
  import {ERR_OK} from "api/config";
  import Scroll from "base/scroll/scroll";
  import {createSong} from "common/js/song";

  const TYPE_SINGER = 'singer'
  export default {
    components: {Scroll},
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
        page: 1
      }
    },
    methods: {
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
        getSearchSong(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data);
            this.result = this._genResult(res.data)
            console.log(this.result);
          }
        })
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
      }
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
