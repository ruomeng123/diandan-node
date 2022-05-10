// 引入错误提示子类
const result = require('./handle.js')

// 封装公共参数的校验
class Checking {
	// 传过来校验的参数个数不是固定的，所以统一都用obj接收
	constructor(ctx, ...obj) {
		this.ctx = ctx,
		this.obj = obj
		console.log(obj) // [ '13231511031', '123456aaa' ]
	}
	// 方法：校验前端传过来参数值的是否为undefined
	Errunder() {
		let isUndefined = this.obj.indexOf(undefined)
		// console.log(isUndefined)
		// 判断obj中是否有undefined
		if(isUndefined !== -1) {
			// 代表有undefined，需要返回错误提示
			// throw可以阻止程序往下走
			throw new result('参数填写错误！', 400)
		}
	}
	// 方法：校验手机号格式
	Phone(num, mobileMsg) {
		// 校验手机号的正则表达式
		const phoneReg = /^1[3456789]\d{9}$/
		// 调用的时候需要传入"手机号位于数组中的下标"参数，检测该手机号是否匹配上面定义的正则表达式
		if(!phoneReg.test(this.obj[num])) {
			// 表示不匹配,需要返回错误提示,调用时传入错误信息,状态码202表示"已经接受请求，但未处理完成"
			throw new result(mobileMsg, 202)
		}
	}
	// 方法：校验密码格式
	Password(num, passwordMsg) {
		// 校验密码的正则表达式，表示只能由6~20位的数字及字母组成
		const passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
		if(!passwordReg.test(this.obj[num])) {
			// 表示不匹配，返回错误信息
			throw new result(passwordMsg, 202)
		}
	}
}

//  创建子类："注册板块"的校验
class Register extends Checking {
	start() {
		super.Errunder()
		super.Phone(0, '手机号格式不正确！')
		super.Password(1, '密码必须由6-20位的数字和字母组成！')
	}
	
}

module.exports = {
	Register
}