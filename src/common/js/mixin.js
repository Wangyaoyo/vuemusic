/* mixin是一个对象 */
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from "./config";
import {getRandomList} from "./util";
/* 迷你播放器出现后高度需要重新计算的mixin */
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      throw new Error('component must implement handlePlaylist function')
    }
  }
}
/* 歌曲播放模式切换逻辑的mixin */
export const modeMixin = {
  computed: {
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
  methods: {
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
      setPlaying: 'SET_PLAYING',
      setPlayList: 'SET_PLAY_LIST'
    })
  }
}
/* 搜索框及搜索结果逻辑的mixin */
export const searchMixin = {
  data() {
    return {
      query: '',
      showSinger: false
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    getQuery(query) {
      this.query = query
    },
    inputBlur() {
      /* 父组件可以调用子组件的方法：滚动时派发事件让输入框失去焦点，同时：在移动端还可以让键盘收起 */
      this.$refs.searchBox.inputblur()
    },
    searchhistory() {
      this.saveSearchHistory(this.query)
    },
    addQuery(k) {
      this.$refs.searchBox.setQuery(k)
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
  }
}
