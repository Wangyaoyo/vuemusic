import {getSongUrl} from 'api/song'
import {ERR_OK} from "api/config";

class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

export function processSongsUrl(songs) {
  return getSongUrl(songs).then((res) => {
    if(ERR_OK === res.code){
      let urlMid = res.url_mid
      if(urlMid && urlMid.code === ERR_OK){
        let midUrlInfo = urlMid.data.midurlinfo
        midUrlInfo.forEach((info,index)=>{
          let song = songs[index]
          song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
        })
      }
    }
    return songs
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
