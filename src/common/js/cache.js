import storage from "good-storage"

const SEARCH_KEY = '__SEARCH__'
const MAX_LENGTH = 15

/* 排除重复值并存储 */
function add(arr, query, compare, len) {
  let index = arr.findIndex(compare)
  /* 找到且是第一个*/
  if (index === 0) {
    return
  }
  /* 找到了，删除 */
  if (index > 0) {
    arr.splice(index, 1)
  }
  /* 添加进去 unshift()方法是向数组的开头添加 */
  arr.unshift(query)
  /* 若长度超出，就删除最老的数据 */
  if (len && arr.length > len) {
    /* pop()方法删除数组的最后一个元素 */
    arr.pop()
  }
  return arr
}

function deleteOne(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

/* 添加到缓存中一条搜索记录 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  add(searches, query, (item) => {
    return item === query
  }, MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

/* mutation初始化获取记录 */
export function initialSearch() {
  return storage.get(SEARCH_KEY, [])
}

/* 删除某一条搜索记录 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteOne(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
/* 清除缓存 */
export function clearSearch() {
  storage.set(SEARCH_KEY,[])
  return []
}