/* 编写'注册','登录'等接口 */

// 引入路由
const router = require('koa-router')()
// 引入自定义统一响应格式的类
const result = require('../../config/result.js')
// 引入获取接口调用凭证的类
const { GetAccessToken, addUrl, queryUrl } = require('../../config/databaseapi.js')
// 引入公共参数校验的类
const { Register } = require('../../config/checking')
// 引入生成token方法
const { getToken } = require('../../token/jwt.js')
// 引入校验token合法性的类
const { Auth } = require('../../token/auth')


// 注册接口
router.post('/register', async ctx => {
	// 前端通过post方法提交的值存储在ctx.request.body中
	const { account, password } = ctx.request.body
	// 1.校验前端传过来的值是否合法
	new Register(ctx, account, password).start()
	// 2.判断该账号是否已经注册过
	// 判断数据库business-account集合中有没有用户填的这个手机号
	const query = `db.collection("business-account").where({account:'${account}'}).get()`
	try{
		// 发起查询请求
		const res = await new GetAccessToken().posteve(queryUrl, query)
		// 判断data是否为空数组
		if(res.data.length > 0) {
			// 代表该号码已经注册过了
			new result(ctx, '该手机号已经被注册了！', 202).answer()
		} else {
			// 代表还没有注册过，可以添加注册，需要的参数除了账号，密码，还可以加一个uid，表示商家的唯一标识
			// 使用时间戳作为uid
			const uid = JSON.stringify(new Date().getTime()) 
			// 请求参数
			const str = JSON.stringify({ account, password, uid }) 
			const addQuery = `db.collection('business-account').add({ data: ${str} })`
			// 发起插入记录请求
			const res = await new GetAccessToken().posteve(addUrl, addQuery)
			// console.log(res);
			new result(ctx, '注册成功！').answer()
		}
	}catch(err){
		new result(ctx, '注册失败,服务器发生错误!', 400).answer()
	}
})

// 登录接口
router.post('/login',async ctx => {
	const { account, password } = ctx.request.body
	// 查询数据库中有没有用户登录是输入的账号和密码
	const query = `db.collection('business-account').where({account: '${account}', password: '${password}'}).get()`
	// 这里注意：由于后面的块作用域需要用到res，所以最好使用var定义
	try{
		var res = await new GetAccessToken().posteve(queryUrl, query)
		if(res.data.length === 0) {
			// 表示没有找到，返回提示信息
			new result(ctx, '账号或密码错误!', 202).answer()
		} else {
			// 表示找到了，则返回登录成功信息并给前端返回token
			const obj = JSON.parse(res.data[0])
			new result(ctx, '登录成功!', 200 , { token: getToken(obj.uid) }).answer()
		}
	} catch(err){
		new result(ctx, '登录失败，服务器发生错误!', 500).answer()
	}
})

// 验证token
router.get('/test', new Auth().m, async ctx => {
	console.log(ctx.auth.uid); // 1652112263154
})

// 导出接口
module.exports = router.routes()