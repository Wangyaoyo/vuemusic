import {commonParam} from "./config";
import axios from 'axios'
export function getTopList() {
  const url = '/api/getTopList'

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
