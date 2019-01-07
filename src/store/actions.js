import * as types from './mutation-types'
import {playMode} from "common/js/config";
import {getRandomList} from "common/js/util";

function getIndex(list,song) {
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
    index = getIndex(randomList,list[index])
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

export const insertSong = function ({commit,state},song) {
  let playList = state.playList.slice()
  let sequenseList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]

  //判断playlist中是否存在这首歌
  const fpIndex = getIndex(playList,song)
  currentIndex++
  //添加歌曲
  playList.splice(currentIndex,0,song)
  //删除歌曲
  if(fpIndex > -1){
    if(fpIndex < currentIndex){
      playList.splice(fpIndex,1)
      currentIndex--
    }else{
      playList.splice(fpIndex+1,1)
    }
  }

  let currentSIndex = getIndex(sequenseList,currentSong) + 1
  const fsIndex = getIndex(sequenseList,song)
  //添加歌曲
  sequenseList.splice(currentSIndex,0,song)
  //删除歌曲
  if(fsIndex > -1){
    if(fsIndex < currentSIndex){
      sequenseList.splice(fsIndex,1)
      currentSIndex--
    }else{
      sequenseList.splice(fsIndex+1,1)
    }
  }

  commit(types.SET_PLAY_LIST,playList)
  commit(types.SET_PLAYING,true)
  commit(types.SET_SEQUENCE_LIST,sequenseList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULLSCREEN,true)
}
