/* mixin是一个对象 */
import {mapGetters,mapMutations} from 'vuex'
import {playMode} from "./config";
import {getRandomList} from "./util";

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
export const modeMixin = {
  computed:{
    modeClass() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList'
    ])
  },
  methods:{
    modeChange() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = getRandomList(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
      this.setPlayList(list)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  }
}
