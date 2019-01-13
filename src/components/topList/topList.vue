<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bgImage="bgImage" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from "components/music-list/music-list";
  import {getTopListDetail} from "api/rank";
  import {mapGetters} from 'vuex'
  import {ERR_OK} from "api/config";
  import {createSong} from "common/js/song";
  import {processSongsUrl} from "common/js/song";

  export default {
    created() {
      this._getTopSongs()
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    methods: {
      _getTopSongs() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getTopListDetail(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs)=>{
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.albumid && musicData.songid) {
            ret.push(createSong(musicData))
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
    transition all 0.4s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
