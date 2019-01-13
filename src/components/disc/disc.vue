<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from "components/music-list/music-list"
  import {mapGetters} from "vuex"
  import {getDiscSong} from "api/recommend";
  import {ERR_OK} from "api/config";
  import {createSong} from "common/js/song";
  import {processSongsUrl} from "common/js/song";

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      this._getDiscSong()
    },
    data() {
      return {
        songs: []
      }
    },
    methods: {
      _getDiscSong() {
        /* 刷新就回到推荐页面 */
        if(!this.disc.dissid){
          this.$router.push('/recommend')
          return
        }
        getDiscSong(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.cdlist[0].songlist);
            processSongsUrl(this._normalizeSong(res.cdlist[0].songlist)).then((songs)=>{
              this.songs = songs
            })
          }
        })
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach((musicdata) => {
          if (musicdata.albumid && musicdata.songid) {
            ret.push(createSong(musicdata))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
