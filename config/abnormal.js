// 引入Error子类
const result = require('./handle.js')

// 自定义全局处理异常中间件
const abnormal = async (ctx, next) => {
	try{
		// 等待下一个中间件执行完
		await next()
	} catch(err){
		// console.log(err);
		// 判断捕获到的错误对象在Error子类中是否存在，返回一个Boolen
		const isResult = err instanceof result
		if(isResult) {
			// 存在，表示是已知错误，将错误信息返回前端
			ctx.body = {
				msg: err.msg
			}
			ctx.status = err.code
		} else {
			// 不存在，表示为未知错误，，将错误信息返回前端
			ctx.body = {
				msg: '未知错误！'
			}
			ctx.status = 500
		}
	}
}

// 导出该中间件
module.exports = abnormal