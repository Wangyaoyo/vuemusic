import {getSongUrl} from 'api/song'
import {ERR_OK} from "api/config";
import {getLyric} from "api/song";
/* 注意：Base64要加{} */
import {Base64} from 'js-base64'

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

  /*
  /**
   * 获取歌词并返回数据
   * @returns {Promise<any>}
   */
  getlyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(Base64.decode(res.lyric))
        } else {
          reject('no lyric')
        }
      })
    })
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

/* 用于将playHistory（object）转换成Song类型 */
export function objectToSong(obj) {
  return new Song({
    id:obj.id,
    mid: obj.mid,
    singer: obj.singer,
    name: obj.name,
    album: obj.album,
    duration: obj.duration,
    image: obj.image,
    url: obj.url
  })
}
export function processSongsUrl(songs) {
  return getSongUrl(songs).then((res) => {
    if (ERR_OK === res.code) {
      let urlMid = res.url_mid
      if (urlMid && urlMid.code === ERR_OK) {
        let midUrlInfo = urlMid.data.midurlinfo
        midUrlInfo.forEach((info, index) => {
          let song = songs[index]
          song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
        })
      }
    }
    return songs
  })
}
/* 过滤得到歌手名称 */
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
