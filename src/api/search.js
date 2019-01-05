import {commonParam} from "./config";
import axios from 'axios'
export function getHotKey() {
  const url = '/api/getHotKey'

  const data = Object.assign({},commonParam,{
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    _: 1546664682647
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    console.log(res);
    console.log(res.data);
    return Promise.resolve(res.data)
  })
}
