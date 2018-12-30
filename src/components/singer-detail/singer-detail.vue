<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getDetail} from "api/singer";
  import {ERR_OK} from "api/config";
  import {createSong} from "common/js/song"
  import MusicList from "components/music-list/music-list"
  import {processSongsUrl} from "common/js/song";

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      }
    },
    created() {
      this._getDetailList()
    },
    data() {
      return {
        songs:[]
      }
    },
    methods: {
      _getDetailList() {
        /* id 不存在，返回歌手页面 */
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSong(res.data.list)).then((songs)=>{
              this.songs = songs
            })
          }
        })
      },
      _normalizeSong(songs) {
        let ret = []
        songs.forEach((item) => {
          /* ES6的解构赋值 */
          let {musicData} = item
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform:  translate3d(100%, 0, 0)
  /*color*/
</style>
