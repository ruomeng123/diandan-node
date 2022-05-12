/* 编写'菜品管理'接口 */

// 引入路由
const router = require('koa-router')()
// 引入自定义统一响应格式的类
const result = require('../../config/result.js')
// 引入获取接口调用凭证的类
const { GetAccessToken, addUrl, queryUrl, updateUrl } = require('../../config/databaseapi.js')
// 引入公共参数校验的类
const { DishCategory, DishUnit, AddDish } = require('../../config/checking')
// 引入校验token合法性的类
const { Auth } = require('../../token/auth')
// 引入文件上传存储
const { upload, cosfun } = require('../../cos/cos')
const moment = require('moment')

// 添加菜品类目接口
router.post('/addDishCategory', new Auth().m, async ctx => {
	const { value } = ctx.request.body
	const cid = 'a' + new Date().getTime()
	// 校验菜品类目名称
	await new DishCategory(ctx, value).start()
	// 判断数据库中是否已经存在该类目
	const query =`db.collection('dish-category').where({ value: '${value}' }).get()`
	// 发起网络请求上传到数据库
	const addQuery = `db.collection('dish-category').add({ data: { value: '${value}', label: '${value}', cid: '${cid}', count: 0, select_count: 0 } })`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		if(res.data.length > 0) {
			// 代表数据库中已经存在该类目了
			new result(ctx, '该类目已存在', 202).answer()
		} else {
			await new GetAccessToken().posteve(addUrl, addQuery)
			new result(ctx, '添加成功').answer()
		}
	}catch(err){
		new result(ctx, '添加失败,服务器发生异常', 500).answer()
	}
})
// 获取菜品类目接口
router.get('/getDishCategory', new Auth().m, async ctx => {
	// get路径携带前端传来的分页数(page:0代表展示1~10条数据)
	// ctx.query:获取get路径携带的值：www.baidu.com?page=1
	// 关于分页：小程序一次性返回20条数据。nodejs端一次性返回10条；云函数端一次性返回100条
	const { page } = ctx.query
	// 跳过结果集中的前 page * 10 条，从第 page * 10 + 1 条开始返回
	const skip = page * 10
	// 'asc'表示升序,'desc'表示降序
	const query = `db.collection('dish-category').orderBy('cid', 'desc').limit(10).skip(${skip}).get()`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		// 将data和total合并传给前端
		const data = res.data.map(item => { return JSON.parse(item) })
		const total = res.pager.Total
		const obj = {...{ result: data }, total}
		new result(ctx, '获取成功', 200 , obj).answer()
	}catch(e){
		new result(ctx, '获取失败,服务器发生异常', 500).answer()
	}
})

// 获取菜品单位接口
router.get('/getDishUint', new Auth().m, async ctx => {
	const query = `db.collection('dish-unit').get()`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		const data = res.data.map(item => { return JSON.parse(item) })
		console.log(data);
		new result(ctx, '获取成功', 200, data).answer()
	}catch(err){
		new result(ctx, '获取失败,服务器发生异常', 500).answer()
	}
})
// 添加菜品单位接口
router.post('/addDishUint', new Auth().m, async ctx => {
	const { value } = ctx.request.body
	// 校验参数
	new DishUnit(ctx, value).start()
	// 生成uid
	const uid = new Date().getTime()
	// 查看数据库中有没有一样的
	const query = `db.collection('dish-unit').where({ value: '${value}' }).get()`
	const addQuery = `db.collection('dish-unit').add({ data: { value: '${value}', label: '${value}', uid: ${uid} } })`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		if(res.data.length > 0) {
			new result(ctx, '该单位已存在,不能重复添加', 202).answer()
		} else {
			const res = await new GetAccessToken().posteve(addUrl, addQuery)
			new result(ctx, '添加成功').answer()
		}
	}catch(err){
		new result(ctx, '添加失败,服务器发生异常', 500).answer()
	}
})
// 上架菜品接口
router.post('/addDish', async ctx => {
	const { id, category, image, name, unitprice, unit, cid } = ctx.request.body
	// 校验参数
	new AddDish(ctx, category, image, name, unitprice, unit, cid).start()
	// utcOffset(8):东八区:北京时间
	const time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	// 上传请求
	const addQuery = `db.collection('dishes').add({ data: { category: '${category}', image: ${image}, name: '${name}', monthlysale: 0, unitprice:${unitprice}, unit: '${unit}', select_count: 0, time: '${time}', onsale: true, cid: '${cid}' } })`
	// 对当前菜品类目的count进行自增,Command.inc(value: number)更新操作符，原子操作，用于指示字段自增
	const updateQuery = `db.collection('dish-category').where({ cid: '${cid}' }).update({ data: { count: db.command.inc(1) } })`
	try{
		await new GetAccessToken().posteve(addUrl,addQuery)
		// 添加成功后对所属类目count进行自增
		await new GetAccessToken().posteve(updateUrl, updateQuery)
		new result(ctx, '上传成功').answer()
	}catch(e){
		new result(ctx, '上传失败,服务器发生异常', 500).answer()
	}
})
// 获取菜品接口
router.get('/getDishes', async ctx => {
	const { page } = ctx.query
	const skip = page * 10
	const query = `db.collection('dishes').orderBy('time', 'desc').limit(10).skip(${skip}).get()`
	try{
		const res = await new GetAccessToken().posteve(queryUrl, query)
		const total = res.pager.Total
		const obj = res.data.map(item => { return JSON.parse(item) })
		const data = {...{ result: obj }, total}
		new result(ctx, '获取成功', 200, data).answer()
	}catch(e){
		new result(ctx, '获取失败,服务器发生异常', 500).answer()
	}
})
// 下架菜品接口
router.get('/delDish', async ctx => {
	const { id, cid } = ctx.query
	// 更新数据库
	const updateQuery = `db.collection('dishes').doc('${id}').update({ data: { onsale: false } })`
	// 更新菜品类目数量
	const updateCountQuery = `db.collection('dish-category').where({ cid: '${cid}' }).update({ data: { count: db.command.inc(-1) } })`
	try{
		await new GetAccessToken().posteve(updateUrl, updateQuery)
		await new GetAccessToken().posteve(updateUrl, updateCountQuery)
		new result(ctx, '下架成功').answer()
	}catch(err){
		new result(ctx, '下架失败,服务器发生异常', 500).answer()
	}
} )
// 修改上架的菜品接口
router.post('/updateDish', async ctx => {
	const { id, category, image, name, unitprice, unit, cid } = ctx.request.body
	// 校验参数
	// new AddDish(ctx, id, category, image, name, unitprice, unit, cid).start()
	// 发起请求
	const time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	const query = `db.collection('dishes').doc('${id}').update({ data: { category: '${category}', image: ${image}, name: '${name}', unitprice:${unitprice}, unit: '${unit}', select_count: 0, time: '${time}', onsale: true, cid: '${cid}' } })`
	try{
		await new GetAccessToken().posteve(updateUrl, query)
		new result(ctx, '修改成功').answer()
	}catch(err){
		new result(ctx, '修改失败,服务器发生异常', 500).answer()
	}
})


module.exports = router.routes()