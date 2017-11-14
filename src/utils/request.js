import axios from 'axios'
import { PREFIX } from '../config/app'
function handleError (err, params) {
  return Promise.reject(err)
}

export default {
  checkParams (params) {
    if (!params.url) {
      throw new Error('无效的请求地址')
    }
  },
  init () {
    axios.defaults.baseURL = PREFIX
    // if (same === 1) {
    //   axios.defaults.baseURL = PREFIX_COTTECT
    // } else {
    //   axios.defaults.baseURL = PREFIX
    // }
    // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // axios.defaults.withCredentials = true
  },
  async get (params, token = '') {
    this.checkParams(params)
    this.init()
    let url = params.url
    // 此处处理 params.data 拼接数据到 url 上
    if (params.data) {
      let str = ''
      for (let i in params.data) {
        str += `${i}=${params.data[i]}&`
      }
      url += '?' + str.substring(0, str.length - 1)
    }
    try {
      let res = await axios({
        method: 'get',
        url: url
      })

      console.log('-------get start--------')
      console.log(params)
      console.log(res.data)
      console.log('-------get end--------')

      return Promise.resolve(res.data ? res.data : {})
    } catch (err) {
      return handleError(err, params)
    }
  },
  async post (params, token = '') {
    this.checkParams(params)
    this.init()

    try {
      let res = await axios({
        method: 'post',
        url: params.url,
        data: params.data,
        // 很坑啊 与Java的post参数始终不对
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })

      console.log('--------post start-------')
      console.log(params)
      console.log(res.data)
      console.log('--------post end-------')
      return Promise.resolve(res.data ? res.data : {})
    } catch (err) {
      return handleError(err, params)
    }
  },
  async put (params, token = '') {
    this.checkParams(params)
    this.init()

    if (token) {
      axios.defaults.headers.common['x-access-token'] = token
    }

    try {
      let res = await axios({
        method: 'put',
        url: params.url,
        data: params.data
      })

      console.log('--------put start-------')
      console.log(params)
      console.log(res.data)
      console.log('--------put end-------')
      return Promise.resolve(res.data ? res.data : {})
    } catch (err) {
      return handleError(err, params)
    }
  },
  async patch (params, token = '') {
    this.checkParams(params)
    this.init()

    try {
      let res = await axios({
        method: 'patch',
        url: params.url,
        data: params.data
      })

      console.log('--------put start-------')
      console.log(params)
      console.log(res.data)
      console.log('--------put end-------')
      return Promise.resolve(res.data ? res.data : {})
    } catch (err) {
      return handleError(err, params)
    }
  },
  async delete (params) {
    this.checkParams(params)
    this.init()

    try {
      let res = await axios({
        method: 'delete',
        url: params.url,
        data: params.data
      })

      console.log('-------delete start--------')
      console.log(params)
      console.log(res.data)
      console.log('-------delete end--------')
      return Promise.resolve(res.data ? res.data : {})
    } catch (err) {
      return handleError(err, params)
    }
  }
}
