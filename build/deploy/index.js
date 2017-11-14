var fs = require('fs')
var path = require('path')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var utils = require('./utils.js')
var exec = require('child_process').exec,child;

var _distJsPath = path.resolve(__dirname, '../../_dist/static/js')
var _distCssPath = path.resolve(__dirname, '../../_dist/static/css')
var _distHtmlPath = path.resolve(__dirname, '../../_dist')

var distJsPath = path.resolve(__dirname, '../../dist/static/js')
var distCssPath = path.resolve(__dirname, '../../dist/static/css')
var distHtmlPath = path.resolve(__dirname, '../../dist')

async(function () {
  var hashAddresses = await(utils.contentFileHash(_distJsPath))
  await(utils.replaceHtmlJsPath(hashAddresses, _distHtmlPath))

  // 获取 _dist/ 下的静态文件
  var _distJsPaths = []
  var _distCssPaths = []
  var _dist_htmlPaths = []

  // 获取 dist/ 下的静态文件
  var distJsPaths = []
  var distCssPaths = []
  var dist_htmlPaths = []
  var addresses = {}

  var diffPages = {}
  _distJsPaths = utils.getStatics('js', '/static/', _distJsPath)
  _distCssPaths = utils.getStatics('css', '/static/', _distCssPath)
  _dist_htmlPaths = utils.getStatics('_html', '/', _distHtmlPath)

  if (fs.existsSync(distHtmlPath) && fs.existsSync(distJsPath) && fs.existsSync(distCssPath)) {
    distJsPaths = utils.getStatics('js', '/static/', distJsPath)
    distCssPaths = utils.getStatics('css', '/static/', distCssPath)
    dist_htmlPaths = utils.getStatics('_html', '/', distHtmlPath)
  } else {
    !fs.existsSync(distHtmlPath) && fs.mkdirSync(distHtmlPath)
  }

  // 包含修改（包含增加）和删除的所有信息
  diffPages = utils.getDiffPage(_dist_htmlPaths, _distCssPaths, _distJsPaths, dist_htmlPaths, distCssPaths, distJsPaths)

  if (Object.keys(diffPages.modify).length > 0) {
    console.log('-> 本次发布修改/添加的页面有：'.green)
    for (var modify in diffPages.modify) {
      console.log(('　　' + modify.slice(1) + '.html').blue)// , (diffPages.modify[modify].).blue)
    }
  }

  if (diffPages.delete.length > 0) {
    console.log('-> 本次发布删除的页面有：'.green)
    diffPages.delete.forEach(function (item) {
      console.log(('　　' + item.id.slice(1) + '.html').blue)
    })
  }

  if (Object.keys(diffPages.modify).length === 0 && diffPages.delete.length === 0) {
    console.log('本次发布未改动任何东西，已停止发布！'.red)
    process.exitCode = 1
    return
  }

  // 获取登录信息
  // var loginInfo = await(utils.getLoginInfo())
  // var addresses = await(utils.uploadFiles(loginInfo.token, diffPages.modify))
  // for (var key in addresses) {
  //   console.log(('　　' + key + ': ').green, (addresses[key]).blue)
  // }

  await(utils.generateTpls(_distHtmlPath, diffPages.modify, addresses))
  var _distHtmlPaths = utils.getStatics('html', '/', _distHtmlPath)
  var distHtmlPaths = utils.getStatics('html', '/', distHtmlPath)

  await(utils.transfer_Dist_Tpls(_dist_htmlPaths, distHtmlPath))
  await(utils.transfer_DistTpls(_distHtmlPaths, distHtmlPath))
  await(utils.deleteTpls(diffPages.delete))

  console.log(('\n-> 替换完毕...').green)
  console.log('-> 准备发布...'.green)
})()
