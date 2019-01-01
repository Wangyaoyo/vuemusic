/* mixin是一个对象 */
import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed:{
    ...mapGetters([
      'playList'
    ])
  },
  mounted(){
    this.handlePlaylist(this.playList)
  },
  activated(){
    this.handlePlaylist(this.playList)
  },
  watch:{
    playList(newVal){
      this.handlePlaylist(newVal)
    }
  },
  methods:{
    handlePlaylist(playlist){
      throw new Error('component must implement handlePlaylist function')
    }
  }
}
