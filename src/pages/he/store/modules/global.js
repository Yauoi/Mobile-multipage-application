/* 全局状态机
 * 内容：[请求失败的处理]、[全局消息广播]、[全局点击事件]、[判断手机端还是PC端]
 * 作者：Y.M.E
 **/

const globalStates = {
  state: {
    navState: 1,
    logoState: 0,
    isPc: true,
    eventEmitter: {},
    requestFail: {},
    redirect: '',
    requestLoading: false
  },

  mutations: {
    LOGO_STATE (state, data) {
      state.logoState = data
    },
    NAV_STATE (state, data) {
      state.navState = data
    },
    // 回收请求业务层的错误信息
    REQUEST_FAIL (state, res) {
      state.requestFail = Object.assign({}, res)
    },

    EVENT_EMITTER (state, data) {
      state.eventEmitter = Object.assign({}, data)
    },

    IS_PC (state, flag) {
      state.isPc = flag
    },

    IS_TEACHER (state, isTeacher) {
      state.isTeacher = isTeacher
    },

    REDIRECT (state, data) {
      state.redirect = data
    },
    // 全局load处理
    REQUEST_LOADING (state, bool) {
      state.requestLoading = bool
    }
  },

  actions: {
    // 依照业务层的错误信息进行相关操作
    requestFail ({ commit }, res) {
      commit('REQUEST_FAIL', { type: 'tip', message: res })
    },
    // 依照业务层的loading相关操作
    requestLoading ({ commit }, bool) {
      commit('REQUEST_LOADING', bool)
    },

    // 全剧消息广播
    eventEmitter ({ commit }, { event, data }) {
      try {
        if (!event && typeof event !== 'string') {
          throw new Error('action[eventEmitter]只接收字符串格式的消息类型！')
        }
        commit('EVENT_EMITTER', { event, data })
      } catch (err) {
        console.log(err)
      }
    },

    // 判断浏览设备
    getPcFlag ({ commit }) {
      let userAgentInfo = navigator.userAgent
      let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
      let flag = true
      for (let item of Agents) {
        if (userAgentInfo.indexOf(item) > 0) {
          flag = false
          break
        }
      }
      commit('IS_PC', flag)
    }
  }
}

export default globalStates
