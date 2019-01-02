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

    export default {
      computed:{
        title(){
          return this.disc.dissname
        },
        bgImage(){
          return this.disc.imgurl
        },
        songs(){
          // return this._getDiscSong()
        },
        ...mapGetters([
          'disc'
        ])
      },
      created(){
        this._getDiscSong()
      },
      methods:{
        _getDiscSong(){
          getDiscSong(this.disc.dissid).then((res)=>{
            if(res.code === ERR_OK){
              console.log(res.cdlist[0].songlist);
              return res.cdlist[0].songlist
            }
          })
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
    transform:  translate3d(100%, 0, 0)
</style>
