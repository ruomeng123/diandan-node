/* 编写'注册','登录'等接口 */

// 引入路由
const router = require('koa-router')()
// 引入自定义统一响应格式的类
const result = require('../../config/result.js')
// 引入获取接口调用凭证的类
const { GetAccessToken, addUrl } = require('../../config/databaseapi.js')

// 注册接口
router.get('/register', async ctx => {
	const name = '浮生'
	const query = `db.collection("test").add({data:{name:'${name}'}})`
	// const query = "db.collection(\"test\").add({data:{name: '若梦'}})"
	let res = await new GetAccessToken().posteve(addUrl, query)
	console.log(res);
	// console.log(res);
	// 后面会大量使用到下面的代码,可以封装一个类供后续使用
	// ctx.body = {
	// 	msg: '123',
	// 	id: 001
	// }
	// ctx.status = 200
	// new result(ctx, 'success').answer()
})

// 导出接口
module.exports = router.routes()