export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classnames = el.className.split(' ')
  classnames.push(className)
  el.className = classnames.join(' ')
}

/* 使用正则检测是否含有某个class */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/* 设置和获取属性 */
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard:'transform'
}
  for(let key in transformNames){
    if(elementStyle[transformNames[key]]!==undefined){
      return key
    }
  }
  return false
})()

/* css属性兼容浏览器前缀 */
export function prefixName(style) {
  /* 注意边界值考虑 */
  if(vendor === false){
    return false
  }
  if(vendor === 'standard'){
    return style
  }
  return vendor + style.substr(0,1).toUpperCase() + style.substr(1)
}
