/* 编写'商家信息'接口 */

// 引入路由
const router = require('koa-router')()
// 引入自定义统一响应格式的类
const result = require('../../config/result.js')
// 引入获取接口调用凭证的类
const { GetAccessToken, addUrl, queryUrl, updateUrl } = require('../../config/databaseapi.js')
// 引入公共参数校验的类
const { Register, Shopinfo } = require('../../config/checking')
// 引入校验token合法性的类
const { Auth } = require('../../token/auth')
// 引入文件上传存储
const { upload, cosfun } = require('../../cos/cos')

// 图片上传接口
router.post('/uploadres', upload.single('file'), async ctx => {
	// console.log(ctx.file);
	try{
		const res = await cosfun(ctx.file.filename, ctx.file.path)
		new result(ctx, '上传成功', 200, 'https://' + res).answer()
	} catch(err){
		//TODO handle the exception
		new result(ctx, '上传失败,服务器发生异常', 500).answer()
	}
})

// 上传商家信息接口uploadshop
router.post('/uploadshop', new Auth().m, async ctx => {
	// 取出前端传过来的数据: 商家名字,商家地址和商家logo,id这里用不到,修改信息时可以根据id查找到对应商家进行修改
	const { id, name, address, logo } = ctx.request.body
	// 对数据进行校验,为undefined为空数组或为空字符
	new Shopinfo(ctx, name, address, logo).start()
	// 请求上传,注意:logo是数组类型的,不需要''包裹!!
	const query = `db.collection('shop-info').add({data: { name: '${name}', address: '${address}', logo: ${logo} }})`
	try{
		await new GetAccessToken().posteve(addUrl, query)
		// console.log(res);
		new result(ctx, '提交成功').answer()
	}catch(err){
		new result(ctx, '提交失败,服务器发生错误', 500).answer()
	}
})

// 获取商家信息接口obtainshop
router.get('/obtainshop', new Auth().m, async ctx => {
	const query = `db.collection('shop-info').get()`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		// console.log(res); // res.data: ['{"_id":"16db756f627b5ef4020c35fa667ee92b","address":"浙江慈溪","logo":[],"name":"大囍"}']
		const data = res.data.map(item => { return JSON.parse(item) })
		new result(ctx, 'SUCCESS', 200 , data).answer()
	}catch(err){
		new result(ctx, '请求失败,服务器发生错误', 500).answer()
	}
})

// 修改商家信息接口modifyshop
router.post('/modifyshop', new Auth().m, async ctx => {
	const { id, name, address, logo } = ctx.request.body
	// 对数据进行校验,为undefined为空数组或为空字符
	// new Shopinfo(ctx, name, address, logo).start()
	// 提交到数据库修改
	const query = `db.collection('shop-info').doc('${id}').update({data:{name:'${name}',address:'${address}',logo:${logo}}})`
	try{
		await new GetAccessToken().posteve(updateUrl, query)
		console.log('222');
		new result(ctx, '修改成功').answer()
	}catch(e){
		console.log(e);
		new result(ctx, '修改失败,服务器发生错误', 500).answer()
	}
})

// 导出接口
module.exports = router.routes()