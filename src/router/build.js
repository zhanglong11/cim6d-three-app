const fs = require('fs')
const path = require('path')
const router = require('./index.js')

// 将子路由模块配置文件转化为 uniapp 配置文件格式
const buildRouter = route => {
  const res = []
  const { children } = route
  children.forEach(i => {
    const obj = {
      path: i.path,
      style: i.style
    }
    Object.keys(i).forEach(ii => {
      !['path'].includes(ii) && (obj.style[ii] = i[ii])
    })
    res.push(obj)
  })
  return res
}

// 自动加载 './modules' 目录子路由配置文件
const getRouter = () => {
  const srcPath = path.resolve(__dirname, './modules')
  const result = fs.readdirSync(srcPath)
  let baseRouter = require('./baseRouter')
  let router = [...buildRouter(baseRouter)]
  result.forEach(r => {
    const route = require('./modules/' + r)
    router = [...router, ...buildRouter(route)]
  })
  return router
}

// 构建 pages 并写入 pages.json 文件
router.pages = getRouter()
let cache = []
let routerJson = JSON.stringify(
  router,
  function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      } // Store value in our collection
      cache.push(value)
    }
    return value
  },
  '  '
)
// 根据router生成pages
fs.writeFile(__dirname + '/../pages.json', routerJson, e =>
  e ? console.error(e) : console.log('pages.json 配置文件更新成功')
)
