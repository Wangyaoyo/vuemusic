/*  1 首先定义state  */
import {playMode} from "common/js/config";
import {initialSearch,initialPlay} from "common/js/cache";

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
  playHistory: initialPlay()
}

export default state
