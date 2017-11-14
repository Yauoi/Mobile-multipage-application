import axios from 'axios'
import store from '../store/'

const WhiteList = ['checkUser', 'normalPull', 'upload']

export default {
  checkEvent (e) {
    if (!e || !e.methods || !e.class || !e.comment) {
      return false
    }
    return true
  },
  async get (params) {
    try {
      let url = '//god.tinfinite.com/data'
      if (params) {
        let str = ''
        for (let i in params) {
          str = str + `${i}=${params[i]}&`
        }
        url += '?' + str.substring(0, str.length - 1)
      }
      let res = await axios({
        method: 'get',
        url: url,
        ...params
      })

      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async up (event) {
    // console.log('%c<<<--- 抓取事件 --->>>', "color: red", event)
    if (!this.checkEvent(event)) {  // 拦截不规范事件请求
      return
    }
    for (let i of WhiteList) {   // 遍历白名单 符合则跳过上传 resolve合法结果
      if (event.class === i) {
        return Promise.resolve({code: 1, result: true})
      }
    }
    event.type = 'pay'
    event.username = store.getters.name
    try {
      let result = await axios({
        method: 'put',
        url: '//god.hualala.com/data',
        data: event
      })
      
      return Promise.resolve(result.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
