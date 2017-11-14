var path = require('path')
var colors = require('colors')
var utils = require('../utils')
var pagesPath = path.resolve(__dirname, '../../src/pages')
var tplName = process.argv[2]

if (!tplName) {
  return console.log('error: Lack of page-name!'.red)
}

if (!/^[A-Za-z0-9_\-]*$/.test(tplName)) {
  return console.log('error: Page-name should be made up of number, letter or underline!'.red)
}

var allPages = utils.getPages(pagesPath)
if (allPages[tplName]) {
  return console.log(('error: The page named ' + tplName + ' is existent!').red)
}

var exec = require('child_process').exec
exec('cp -r ./build/addTpl/my ./src/pages/' + tplName, function(err, stdout, stderr) {
  if (err) throw err
  console.log(('success: Add page ' + tplName + '!').green)
})

