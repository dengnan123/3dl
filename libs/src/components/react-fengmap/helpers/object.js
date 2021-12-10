export function isNil(obj) {
  return obj === undefined || obj === null
}

export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]'
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

export function grabNumbers(str) {
  if (!str) {
    return 0
  }
  return +str.match(/\d+/)[0]
}

export function pick(obj, keys) {
  const newObj = {}

  keys.map(key => {
    newObj[key] = obj[key]
    return key
  })

  return newObj
}

export function VersionDetect(version) {
  let isSatisfyUp = false
  let defaultVersion = [2, 3, 0]
  if (version) {
    let nowVersion = version.split('.')
    let firstNumber = Number(nowVersion[0])
    let secondNumber = Number(nowVersion[1])
    if (firstNumber > defaultVersion[0]) {
      isSatisfyUp = true
    } else if (secondNumber >= defaultVersion[1]) {
      isSatisfyUp = true
    }
  }
  return isSatisfyUp
}
