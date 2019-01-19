/*  1 首先定义state  */
import {playMode} from "common/js/config";
import {initialSearch,initialPlay,initialFavorite} from "common/js/cache";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: [],
  searchHistory: initialSearch(),
  playHistory: initialPlay(),
  favorite: initialFavorite()
}

export default state
