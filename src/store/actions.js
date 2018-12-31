import * as types from './mutation-types'
import {playMode} from "common/js/config";
import {getRandomList} from "common/js/util";

function getRandomIndex(list,song) {
  return list.findIndex((item)=>{
    return item.id === song.id
  })
}
export function selectPlayer({commit,state},{list,index}) {
  /* 在点击随机播放之后再点列表歌曲播放非点击歌曲*/
  if(state.mode === playMode.random){
    let randomList = getRandomList(list)
    commit(types.SET_PLAY_LIST,randomList)
    /* 在随机歌曲数组中找到正播放的歌曲下标 */
    index = getRandomIndex(randomList,list[index])
  }else{
    commit(types.SET_PLAY_LIST,list)
  }
  commit(types.SET_FULLSCREEN,true)
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYING,true)
  commit(types.SET_CURRENT_INDEX,index)
}

export function randomPlayer({commit},{list}) {
  let randomList = getRandomList(list)
  commit(types.SET_PLAY_LIST,randomList)
  commit(types.SET_PLAYING,true)
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_FULLSCREEN,true)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_MODE,playMode.random)
}
