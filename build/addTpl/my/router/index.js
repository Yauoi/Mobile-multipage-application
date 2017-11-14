import Vue from 'vue'
import Router from 'vue-router'
// import HomePage from '../components/homepage'
// import Hello from '../components/hello'

// 异步加载路由 懒加载
const HomePage = () => import('../../../components/homepage')
const Hello = () => import('../../../components/hello')

Vue.use(Router)

export const RouterMap = [
  {
    path: '/',
    component: HomePage,
    name: '首页'
  },
  {
    path: '/hello',
    component: Hello,
    name: '你好'
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: RouterMap
})
