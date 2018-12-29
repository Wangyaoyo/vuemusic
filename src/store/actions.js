import * as types from './mutation-types'

export function selectPlayer({commit,state},{list,index}) {
  commit(types.SET_PLAY_LIST,list)
  commit(types.SET_FULLSCREEN,true)
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYING,true)
  commit(types.SET_CURRENT_INDEX,index)
}
