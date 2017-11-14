/* 打印log
 * 作者：刘金玲
 */

import { APP_ENV } from '../config'

let repeat = (str, times) => {
  return new Array(times + 1).join(str)
}

let pad = (num, maxLength) => {
  return repeat('0', maxLength - num.toString().length) + num
}

let Log = {

  defaultColor: '#03A9F4',
  color: [],
  hasConsole: !!console, // 这里后面需要做环境判断
  _print (type, content, data) {
    if (APP_ENV === 'pro') {
      return this
    }
    try {
      let color = ''

      switch (type) {
        case 'success':
          color = '#4CAF50'
          break
        case 'warn':
          color = '#FF6600'
          break
        case 'error':
          color = '#FF0000'
          break
        case 'print':
        default:
          color = this.defaultColor
      }
      console.log(`%c${content} >>`, `color: ${color}; font-weight: bold;`, data)
    } catch (e) {
    }
  },

  _groupContent (data, color = []) {
    if (APP_ENV === 'pro') {
      return this
    }

    if (!this.hasConsole) {
      return this
    }

    try {
      let i = 0
      this.color = color

      if (Object.prototype.toString.call(this.color) !== '[object Array]') {
        this.color = []
      } else if (typeof color === 'string') {
        this.defaultColor = this.color
      }

      for (let key in data) {
        console.log(`%c${key}:`, `color: ${color[i++] || this.defaultColor};`, data[key])
      }
    } catch (e) {
    }

    return this
  },

  groupStart (title, collapsed = true) {
    if (APP_ENV === 'pro') {
      return this
    }

    if (!this.hasConsole) {
      return this
    }
    try {
      let time = new Date()
      let groupStart = !collapsed ? console.groupCollapsed : console.group
      let formattedTime = ' @ ' + pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2) + ':' + pad(time.getSeconds(), 2) + '.' + pad(time.getMilliseconds(), 3)
      groupStart.call(console, `${title}${formattedTime}`)
    } catch (e) {
    }
    return this
  },

  groupEnd () {
    if (APP_ENV === 'pro') {
      return this
    }

    if (!this.hasConsole) {
      return this
    }
    try {
      console.groupEnd()
    } catch (e) {
    }
    return this
  },

  group (title, data, color = [], collapsed = true) { // data is json, one key/value one console
    if (APP_ENV === 'pro') {
      return this
    }
    if (!this.hasConsole) {
      return this
    }
    this.groupStart(title, collapsed)._groupContent(data, color).groupEnd()
  },

  success (content, data) {
    if (APP_ENV === 'pro') {
      return this
    }
    this._print('success', content, data)
    return this
  },

  error (content, data) {
    if (APP_ENV === 'pro') {
      return this
    }
    this._print('error', content, data)
    return this
  },

  print (content, data) {
    if (APP_ENV === 'pro') {
      return this
    }
    this._print('print', content, data)
    return this
  }
}

export default Log
