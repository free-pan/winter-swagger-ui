import qs from 'qs'

export default {
  /**
   * 判断对象是否为空或null
   * @param obj
   * @return {boolean} true表示对象为空或null
   */
  isEmptyObject (obj) {
    if (!obj) {
      return true
    }
    /* eslint-disable no-unused-vars */
    for (const item of obj) {
      return false
    }
    return true
  },
  /**
   * 将请求参数拼装到url中
   */
  convertRealUrl (url, reqParamObj) {
    let tmpUrl = url
    if (tmpUrl.indexOf('?') !== -1) {
      tmpUrl = tmpUrl + '&' + qs.stringify(reqParamObj, { arrayFormat: 'repeat' })
    } else {
      tmpUrl = tmpUrl + '?' + qs.stringify(reqParamObj, { arrayFormat: 'repeat' })
    }
    return tmpUrl
  },
  /**
   * 去掉字符串前后空格
   * @param str
   * @return {*}
   */
  strTrim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  /**
   * 判断字符串是否为空
   * @param {string}} str
   * @returns boolean 当字符串为undefined类型或null值或纯空格时返回true
   */
  strIsBlank (str) {
    if (typeof (str) === 'undefined' || str === null || str.trim() === '') {
      return true
    } else {
      return false
    }
  },
  strNotBlank (str) {
    if (typeof (str) !== 'undefined' && str !== null && str.trim() !== '') {
      return true
    } else {
      return false
    }
  },
  /**
   * 替换国际化资源的占位符
   * langMessage示例: {test:'你好:{name}'}
   * messageFlag示例: test
   * params示例: {name:'张三'}
   * 替换结果示例: 你好:张三
   *
   * @param {object} langMessage
   * @param {string} messageFlag
   * @param {object} params
   * @returns string
   */
  formatMessage (langMessage, messageFlag, params) {
    let originalMsg = langMessage[messageFlag]
    if (typeof (params) !== 'undefined' && params !== null) {
      for (const propName in params) {
        originalMsg = originalMsg.replace(new RegExp('\\{[ ]*' + propName + '[ ]*\\}', 'g'), params[propName])
      }
    }
    return originalMsg
  },
  /**
   * 替换url中的路径变量.
   * url示例: http://localhost/user/{id}   params示例: {id:12}
   * 替换结果示例: http://localhost/user/12
   * @param {string} url
   * @param {string} params
   * @returns string
   */
  formReplacePathVar (url, params) {
    let tmpUrl = url
    if (typeof (params) !== 'undefined' && params !== null) {
      for (const propName in params) {
        tmpUrl = tmpUrl.replace(new RegExp('\\{[ ]*' + propName + '[ ]*\\}', 'g'), params[propName])
      }
    }
    return tmpUrl
  },
  /**
   * 判断数组中是否包含某个值(完全匹配)
   * @param {array} arr
   * @param {*} val
   * @returns boolean
   */
  arrayContainsVal (arr = [], val) {
    for (const itemVal of arr) {
      if (itemVal === val) {
        return true
      }
    }
    return false
  },
  /**
   * 判断数组中是否包含val值(对val值进行模糊匹配)
   * @param {array} arr 必须是字符串数组
   * @param {string} val
   * @returns boolean
   */
  arrayLikeContainsVal (arr = [], val) {
    const valType = typeof (val)
    for (const itemVal of arr) {
      if (typeof (itemVal) === 'undefined') {
        if (valType === 'undefined') {
          return true
        } else {
          continue
        }
      }
      const pos = itemVal.toUpperCase().indexOf(val.toUpperCase())
      if (pos !== -1) {
        return true
      }
    }
    return false
  },
  /**
   * 删除数组中所有与val匹配的值
   * @param {Array} arr
   * @param {string} val
   * @returns {array} array
   */
  removeAllMatchedValInArray (arr = [], val) {
    let len = arr.length
    while (len--) {
      if (val === arr[len]) {
        arr.splice(len, 1)
      }
    }
    return arr
  },
  /**
   * 将数据从sessionStorage中删除
   * @param {string} key
   */
  removeSessionItem (key) {
    window.sessionStorage.removeItem(key)
  },
  /**
   * 将数据存储到sessionStorage中
   * @param {string} key
   * @param {string} val
   */
  setJsSessionItem (key, val) {
    window.sessionStorage.setItem(key, val)
  },
  /**
   * 从sessionStorage中查找数据,未找到则返回null
   * @param {string} key
   * @returns {string} string or null
   */
  getJsSessionItem (key) {
    return window.sessionStorage.getItem(key)
  },
  /**
   * 将字符串转换为json对象
   * @param {string} str
   */
  str2Json (str) {
    return JSON.parse(str)
  },
  /**
   * 将json对象转换为未格式化的json字符串
   * @param {object} jsonObj
   */
  jsonObj2Str (jsonObj) {
    return JSON.stringify(jsonObj)
  },
  /**
   * 将json对象转换为格式化的json字符串
   * @param {object}} jsonObj
   */
  jsonObj2StrFormat (jsonObj) {
    return JSON.stringify(jsonObj, null, 3)
  },
  /**
   * 将date按照模式字符串格式化
   * @param {Date} date
   * @param {string} patternStr 示例值: yyyy-MM-dd, yyyy-MM-dd hh:mm:ss
   */
  dateFormat (date, patternStr) {
    let fmt = patternStr
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}
