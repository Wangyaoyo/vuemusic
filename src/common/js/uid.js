let _uid = ''
/* cookie???? */
export function getUid() {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    /* 当前时间的毫秒数（0-999）*/
    const t = (new Date).getUTCMilliseconds()
    /* round 四舍五入为整数 random 随机生成0-1的数 */
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}
