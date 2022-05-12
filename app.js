const Koa =	require('koa')
const app = new Koa()
// 引入中间件
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
// 引入并实例化路由
const router = require('koa-router')()
// 引入自定义全局处理异常中间件
const abnormal = require('./config/abnormal.js')


// 注入中间件依赖
app.use(json())
app.use(bodyParser())
app.use(cors())
app.use(abnormal)

// 注册,登录接口
const login = require('./router/login/login.js')
const merchantInfo = require('./router/merchantInfo/merchantInfo.js')
const dish = require('./router/dish/dish.js')

// 配置路由接口
router.use('/api', login)
router.use('/api', merchantInfo)
router.use('/api', dish)

// 启动路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动8080端口
app.listen(8080);
console.log('启动成功！')
