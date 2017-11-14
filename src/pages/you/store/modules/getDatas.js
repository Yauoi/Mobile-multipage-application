// 引入网络请求的api文件
import getData from '../../../../api/getData.js'

const datas = {
  state: {
    Datas: {}
  },

  mutations: {
    DATAS: (state, data) => {
      state.videoDatas = Object.assign({}, data)
    }
  },

  actions: {
    // 获取视频列表数据
    async getVideoDataAction ({commit}, params) {
      try {
        let data = await getData(params)
        commit('DATAS', data)
      } catch (err) {
        console.log(err)
      }
    }
  }
}

export default datas
