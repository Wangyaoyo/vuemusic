/* 起服务：将打包后的代码运行在服务之上 */
var express = require('express')
// var config = require('./config/index')
var axios = require('axios')
var bodyParser = require('body-parser')

var apiRoutes = express.Router()

/* 用来解析req.body的数据 解析成功覆盖原来的req.body,解析失败则为{} */
/* extend选项用来配置使用querystring(false)或qs(true)来解析数据*/
/* qs比querystring出色的地方在于可以解析多级嵌套的复杂对象（最多5级） */
apiRoutes.use(bodyParser.urlencoded({extended:true}))
/* 歌单 */
apiRoutes.get('/api/getDiscList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
/* 歌曲url */
apiRoutes.post('/api/getPurlUrl',bodyParser.json(),function (req,res) {
  const url = 'http://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.post(url, req.body,{
    timeout: 0,
    headers:{
      referer:'https://y.qq.com',
      origin:'https://y.qq.com',
      'Content-type':'application/x-www-form-urlencoded'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e)=>{
    console.log(e);
  })
})
/* 歌词 */
apiRoutes.get('/api/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
/* 歌单详情页 */
apiRoutes.get('/api/getDiscSong', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
/* 排行榜 */
apiRoutes.get('/api/getTopList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})

/* 排行榜详情 */
apiRoutes.get('/api/getTopListDetail', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
/* 热门搜索词 */
apiRoutes.get('/api/getHotKey', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
/* 搜索歌曲 */
apiRoutes.get('/api/getSearchSong', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
app.use('/',apiRoutes)


// var port = 80

/*
设置服务启动在哪个端口（process是全局变量无需引入）
  开发环境：端口启动于4000
  生产环境：端口启动于9000
 */
var port = process.env.PORT || config.build.port
var app = express()

/* Express框架：提供了static中间件来设置静态文件的资源 */
app.use(express.static('./dist'))
/* 起端口 */
module.exports = app.listen(port, function (err) {
  if(err){
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n');
})
