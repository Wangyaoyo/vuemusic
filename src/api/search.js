import {commonParam} from "./config";
import axios from 'axios'

/* 开发环境（true）*/
const debug = process.env.NODE_ENV !== 'production'

/* 热门歌曲 */
export function getHotKey() {
  const url = debug ? '/api/getHotKey': 'http://39.105.52.64/music/api/getHotKey'

  const data = Object.assign({}, commonParam, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    _: 1546664682647
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/* 搜索歌曲 */
export function getSearchSong(query,page,zhida,pagenum) {
  const url = debug ? '/api/getSearchSong': 'http://39.105.52.64/music/api/getSearchSong'

  const data = Object.assign({}, commonParam, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: pagenum,
    n: pagenum,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: 1546672483314
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
