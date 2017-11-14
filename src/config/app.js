import Cookie from '../utils/cookie'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port
// console.log(host.split('.')[0])
// const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'
const APP_ENV = host.split('.')[0] === 'pre' ? 'pre' : (host.split('.')[0] === 'dev' ? 'dev' : 'pro')

// 初始变量  // 根据情况自己配置
let APP_ID = 'APP_ID'
let APP_HOST = 'APP_HOST'
let DEVICE_ID_KEY = ''
let APP_IS_LOCAL = false

// 服务请求域名
let PREFIX = '//请求域名/'
let TOKEN = ''
let APP_TOKEN_KEY = '_token'

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for host
APP_HOST = TOP_LEVEL_HOST

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  // throw new Error('url is wrong!')
} else {
  DEVICE_ID_KEY = '_device_id' + APP_ID
}

// for env
if (port) {
  APP_IS_LOCAL = true
}

let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV
if (SUFFIX) {
  APP_TOKEN_KEY = SUFFIX === 'pro' ? '_token' : '_token_' + SUFFIX
  PREFIX = '//请求域名/'
}
TOKEN = Cookie.get(APP_TOKEN_KEY)

export {
  APP_HOST,
  APP_IS_LOCAL,
  APP_ID,
  TOP_LEVEL_HOST,
  APP_ENV,
  DEVICE_ID_KEY,
  TOKEN,
  PREFIX,
  APP_TOKEN_KEY
}
