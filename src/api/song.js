import {commonParam, option} from "./config"
import axios from 'axios'
import {getUid} from "common/js/uid";

/* 开发环境（true）*/
const debug = process.env.NODE_ENV !== 'production'

/* 歌曲url获取 */
export function getSongUrl(songs) {
  // const url = debug ? '/api/getPurlUrl' : 'http://usthuangyi.com/music/api/music/api/getPurlUrl'
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const data = Object.assign({}, commonParam, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return axios.post(url, {
    comm: data,
    url_mid: genUrlMid(mids, types)
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/* 歌曲歌词获取 */
export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    songmid: mid,
    hostUin: 0,
    format: 'json',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

function genUrlMid(mids, types) {
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid: getUid(),
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
