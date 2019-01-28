import {commonParam} from "./config";
import axios from 'axios'

/* 开发环境（true）*/
const debug = process.env.NODE_ENV !== 'production'

/* 排行榜 */
export function getTopList() {
  const url = debug ? '/api/getTopList' : 'http://39.105.52.64/music/api/getTopList'

  const data = Object.assign({},commonParam,{
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1546522282909
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
/* 排行榜详情 */
export function getTopListDetail(topid) {
  const url = debug ? '/api/getTopListDetail': 'http://39.105.52.64/music/api/getTopListDetail'

  const data = Object.assign({},commonParam,{
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid,
    _: 1546526315248
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
