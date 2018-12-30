import {jsonp} from 'common/js/jsonp'
import {commonParam, option} from "./config"
/* 获取歌手列表 */
export function getSingerList() {
  const url =  'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParam, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, option)
}
/* 获取歌曲详细信息 */
export function getDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({},commonParam,{
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order:'listen',
    begin:0,
    num:100,
    songstatus:1,
    g_tk:1664029744,
    singermid:singerId
  })
  return jsonp(url,data,option)
}
