// 网络请求的例子
import Request from '../utils/request'
import Store from '../pages/my/store/'

export default async (params) => {
  try {
    // 请求开始，开始loading
    // Store.dispatch('requestLoading', true)
    let data = await Request.get({
      url: `请求接口`
    })
    // 请求结束后停止loading
    // Store.dispatch('requestLoading', false)
    if (+data.code === 0) {
      // 如果成功即使没有数据也应该是个空数组
      return Promise.resolve(data)
    } else {
      // 如果请求接口报错就处理
      window.alert(data.msg.toLowerCase())
      Store.dispatch('requestFail', data)
      throw new Error(data)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
