var fs = require('fs')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var path = require('path')
var colors = require('colors')
var md5 = require('md5')
var _ = require('lodash/array')
var exec = require('child_process').exec,child;

// var appId = '56c6c309243cb728205a3dff' // for xinshengdaxue
// var prompt = chalk.bold.magenta
// var userInfo = {
//   phone: '18758268565',
//   password: 'Lz123456'
// }

// exports.getLoginInfo = async(function () {
//   return {
//     phone: userInfo.phone,
//     token: await(_login(userInfo)).token
//   }
// })

// exports.uploadFiles = function (token, files) {
//   return new Promise(function (resolve, reject) {
//     if (Object.keys(files).length === 0) {
//       return resolve({})
//     }
//     console.log('-> 开始上传...'.green)
//     var req = request
//       .post('http://api-saas.tinfinite.com/v3/upload/picture')
//       .set('x-app-id', appId)
//       .set('x-access-token', token)

//       for (var file in files) {
//         var item = files[file]
//         req.attach(item.css.name, item.css.path)
//         req.attach(item.js.name, item.js.path)
//       }

//       req.end(function(err, res) {
//         if (err) {
//           console.log(('upload error1: ' + err ).red)
//           process.exitCode = 1
//           return reject(err)
//         }
//         if (res.body.code !== 1) {
//           console.log(('upload error2: ' + JSON.stringify(res)).red)
//           process.exitCode = 1
//           return reject(res.body)
//         }
//         console.log('-> 上传完毕...\n'.green)
//         resolve(res.body.result)
//       })
//   })
// }

exports.getStatics = function (type, prefix, path) {
  var dirs = fs.readdirSync(path)
  var result = []
  prefix += type

  dirs.forEach(function (item) {
    if ((type === 'css' || type === 'js') && item.slice(-3) !== 'map') {
      result.push({
        id: item.split('.')[0],
        type: type,
        name: prefix + '/' + item,
        path: path + '/' +item
      })
    }

    var is_Html = type === '_html' && /^_\S*\.html$/.test(item)
    var isHtml = type === 'html' && /^[^_]\S*\.html$/.test(item)
    if (is_Html || isHtml) {
      result.push({
        id: item.split('.')[0],
        type: 'html',
        name: '/' + item,
        path: path + '/' +item
      })
    }

  })
  return result
}

exports.generateTpls = function (_distHtmlPath, modifyPages, addresses) {
  return new Promise(function (resolve, reject) {
    var len = Object.keys(modifyPages).length
    if (len === 0) {
      resolve()
    }
    var i = 0
    for (var key in modifyPages) {
      var page = modifyPages[key]
      var content = fs.readFileSync(page.html, 'utf8')
      content = _replaceStatics(content, addresses)
      fs.writeFile(_distHtmlPath + '/' + key.slice(1) + '.html', content, function (err) {
        i++
        if(err) {
          process.exitCode = 1
          reject(err)
          return console.log(err.red)
        }
        if (i === len) {
          resolve()
        }
      })
    }
  })
}

exports.transfer_Dist_Tpls = function (_dist_htmlPaths, htmlPath) {
  return new Promise(function (resolve, reject) {
    _dist_htmlPaths.forEach(function (item) {
      var content = fs.readFileSync(item.path, 'utf8')
      fs.writeFile(htmlPath + '/' + item.id + '.html', content, function (err) {
        if(err) {
          process.exitCode = 1
          reject(err)
          return console.log(err.red)
        }
        resolve()
      })
    })
  })
}

exports.transfer_DistTpls = function (_distHtmlPaths, htmlPath, deleteHtml) {
  return new Promise(function (resolve, reject) {
    _distHtmlPaths.forEach(function (item) {
      var content = fs.readFileSync(item.path, 'utf8')
      fs.writeFile(htmlPath + '/' + item.id + '.html', content, function (err) {
        if(err) {
          process.exitCode = 1
          reject(err)
          return console.log(err.red)
        }
        resolve()
      })
    })
  })
}

exports.deleteTpls = function (deleteHtml) {
  return new Promise(function (resolve, reject) {
    exec('rm -rf dist/static && cp -r _dist/static dist/', function(err, out) {
      console.log(out)
      err && console.log(err) && reject(err)
    })

    if (deleteHtml.length === 0) {
      return resolve()
    }

    deleteHtml.forEach(function (item) {
      var _page = 'dist/' + item.id + '.html '
      var page = 'dist/' + item.id.slice(1) + '.html'
      exec('rm ' + _page + page, function(err, out) {
        console.log(out)
        resolve()
        err && console.log(err) && reject(err)
      })
    })
  })
}

exports.getDiffPage = function (_dist_htmlPaths, _distCssPaths, _distJsPaths, dist_htmlPaths, distCssPaths, distJsPaths) { // 如果 js 或 css 有一项有差异，便认为其需要替换发布
  var addPaths = {}

  if (dist_htmlPaths.length === 0) { // 全量发布
    _dist_htmlPaths.forEach(function (item) {
      var cssIndex = _.findIndex(_distCssPaths, function (o) { return ('_' + o.id) === item.id })
      var jsIndex = _.findIndex(_distJsPaths, function (o) { return ('_' + o.id) === item.id })
      addPaths[item.id] = {
        html: item.path,
        css: _distCssPaths[cssIndex],
        js: _distJsPaths[jsIndex]
      }
    })
    return {
      modify: addPaths,
      delete: []
    }
  }

  var deleteHtmls = _.differenceBy(dist_htmlPaths, _dist_htmlPaths, 'id') // 删除掉的 html
  var modifyHtmls = []

  var diffCss = _.differenceBy(_distCssPaths, distCssPaths, 'name')
  var diffJs = _.differenceBy(_distJsPaths, distJsPaths, 'name')
  var diffStatic = [].concat(diffCss, diffJs) // 可以推算出增加的或修改的页面

  diffStatic.forEach(function (item) {
    var index = _.findIndex(_dist_htmlPaths, function(o) { return o.id === ('_' + item.id) })
    modifyHtmls.push(_dist_htmlPaths[index])
  })
  modifyHtmls = _.uniqBy(modifyHtmls, 'id')

  modifyHtmls.forEach(function (item) {
    var cssIndex = _.findIndex(_distCssPaths, function (o) { return ('_' + o.id) === item.id })
    var jsIndex = _.findIndex(_distJsPaths, function (o) { return ('_' + o.id) === item.id })
    addPaths[item.id] = {
      html: item.path,
      css: _distCssPaths[cssIndex],
      js: _distJsPaths[jsIndex]
    }
  })

  return {
    modify: addPaths,
    delete: deleteHtmls
  }
}

exports.contentFileHash = function (_distJsPath) {
  return new Promise(function (resolve, reject) {
    var dirs = fs.readdirSync(_distJsPath)
    var addresses = {}

    // js hash
    dirs.forEach(function (item, index) {
      var oldPath = _distJsPath + '/' + item
      var content = fs.readFileSync(oldPath, 'utf8')
      var hash = md5(content)
      var newJsName = item.split('.')[0] + '.' + hash + '.js'
      var newPath = _distJsPath + '/' + newJsName

      fs.renameSync(oldPath, newPath)
      addresses[item.split('.')[0]] = '/static/js/' + newJsName
      if (index === dirs.length - 1) {
        resolve(addresses)
      }
    })
  })
}

exports.replaceHtmlJsPath = function (addresses, _distHtmlPath) {
  return new Promise(function (resolve, reject) {
    var htmlDirs = fs.readdirSync(_distHtmlPath)
    htmlDirs.forEach(function (item, index) {
      if (/^_\S*\.html$/.test(item)) {
        var pageJs = item.split('.')[0].slice(1)
        var pageJsPath = '/static/js/' + pageJs + '.js'
        var content = fs.readFileSync(_distHtmlPath + '/' + item, 'utf8')

        content = content.replace(pageJsPath, addresses[pageJs])
        fs.writeFile(_distHtmlPath + '/' + item, content, function (err) {
          if(err) {
            reject()
            process.exitCode = 1
            return console.log(err.red)
          }
        })
      }
      if (index === htmlDirs.length - 1) {
        resolve()
      }
    })
  })
}


function filterJS (item, filter) {
  for (var i = 0, len = filter.length; i < len; i++) {
    if (item.indexOf(filter[i]) !== -1) {
      return true
    }
  }
  return false
}

function _replaceStatics (content, addresses) {
  for (var key in addresses) {
    if (content.indexOf(key) !== -1) {
      content = content.replace(key, _dealProtocol(addresses[key]))
    }
  }
  return content
}


function _dealProtocol (url) {
  var res = url.match(/^(?:[^\/]*)\/\/(.+)/)
  return !!res ? ('//' + res[1]) : ''
}

// function _login (userInfo) {
//   var params = {
//     phone: userInfo.phone,
//     device_id: UUID.v4(),
//     country_code: 'CN',
//     password: md5(md5(md5(md5(md5(md5(md5(userInfo.password + userInfo.password + userInfo.password + userInfo.password)))))))
//   }

//   return new Promise(function (resolve, reject) {
//     request
//       .post('http://api-saas.tinfinite.com/v3/passport/sign-in')
//       .set('x-app-id', appId)
//       .send(params)
//       .end(function(err, res) {
//         if (err) {
//           console.log(('login error1: ' + err ).red)
//           process.exitCode = 1
//           return reject(err)
//         }
//         if (res.body.code !== 1) {
//           console.log(('login error2: ' + JSON.stringify(res)).red)
//           process.exitCode = 1
//           return reject(res.body)
//         }
//         console.log('\n-> 登录成功...'.green)
//         resolve(res.body.result)
//       })
//   })
// }

