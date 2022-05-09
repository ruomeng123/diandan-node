// 定义一个统一返回给前端数据格式的类
class result {
	// 在参数中可以指定默认值,如果传了就用传过来的,没传就直接使用默认值
	constructor(ctx, msg='SUCCESS', code = 200, data = null, extra = null) {
		this.ctx = ctx,
		this.msg = msg,
		this.code = code,
		this.data = data,
		this.extra = extra // 额外数据
	}
	// 返回统一格式的方法
	answer() {
		this.ctx.body = {
			msg: this.msg,
			data: this.data,
			extra: this.extra
		}
		this.ctx.status = this.code
	}
	
}

// 导出这个类
module.exports = result