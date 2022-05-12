// 引入错误提示子类
const result = require('./handle.js')

// 封装公共参数的校验
class Checking {
	// 传过来校验的参数个数不是固定的，所以统一都用obj接收
	constructor(ctx, ...obj) {
		this.ctx = ctx,
		this.obj = obj
		// console.log(obj) // [ '13231511031', '123456aaa' ]
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
	// 方法:校验参数为空数组
	Emptyarr(num, arrMsg) {
		// 找到参数中的字符串数组,转换为数组后,判断是否为空数组
		if(JSON.parse(this.obj[num]).length === 0) {
			throw new result(arrMsg, 202)
		}
	}
	// 方法:检验参数为空格符
	Space(msgList) {
		// 将obj的每一个数组子项过滤出符合下面条件的新数组
		const newObj = this.obj.filter(item => {
			// 当前子项字符串中去掉空格符后组成一个新数组,用join方法使它变成字符串,字符串长度为零表示这个参数全是空格符,别忘记return!!!
			return item.split(" ").join("").length === 0
		})
		// 得到全是空格符的这个参数的数组下标,没有则返回-1
		const num = this.obj.indexOf(newObj[0])
		if(num !== -1) {
			// 代表找到了该参数,则根据下标返回对应的错误提示
			throw new result(msgList[num], 202)
		}
	}
	// 方法:校验参数为空
	Blank() {
		const num = this.obj.indexOf('')
		if(num !== -1) {
			// 代表找到了空参数
			throw new result(msgList[num], 202)
		}
	}
}

// 创建子类："注册板块"的校验
class Register extends Checking {
	start() {
		super.Errunder()
		super.Phone(0, '手机号格式不正确！')
		super.Password(1, '密码必须由6-20位的数字和字母组成！')
	}
	
}
// 创建子类："商家信息"的校验
class ShopInfo extends Checking {
	start() {
		// 定义错误提示数组,按需返回
		const msgList = ['请上传店铺名称', '请上传店铺地址', '请上传店铺logo']
		super.Errunder()
		super.Space(msgList)
		super.Blank(msgList)
		// 前端上传的商家信息中,只有logo是用数组格式上传的(element需要)
		super.Emptyarr(2, msgList[2])
	}
}
// 创建子类："菜品类目"的校验
class DishCategory extends Checking {
	start() {
		// 定义错误提示数组,按需返回
		const msgList = ['请上传菜品类目名称']
		super.Errunder()
		super.Space(msgList)
		super.Blank(msgList)
	}
}
// 创建子类："菜品单位"的校验
class DishUnit extends Checking {
	start() {
		// 定义错误提示数组,按需返回
		const msgList = ['请添加菜品单位']
		super.Errunder()
		super.Space(msgList)
		super.Blank(msgList)
	}
}
// 创建子类："上架菜品参数"的校验
class AddDish extends Checking {
	start() {
		// 定义错误提示数组,按需返回
		const msgList = ['请添加菜品类目', '请上传菜品logo', '请添加菜品名称', '请添加菜品单价', '请添加菜品单位', '请上传菜品所属类目的cid']
		super.Errunder()
		super.Space(msgList)
		super.Blank(msgList)
		super.Emptyarr(1, msgList[1])
	}
}
// 创建子类："修改菜品参数"的校验
class UpdateDish extends Checking {
	start() {
		// 定义错误提示数组,按需返回
		const msgList = ['请添加菜品id', '请添加菜品类目', '请上传菜品logo', '请添加菜品名称', '请添加菜品单价', '请添加菜品单位', '请上传菜品所属类目的cid']
		super.Errunder()
		super.Space(msgList)
		super.Blank(msgList)
		super.Emptyarr(2, msgList[2])
	}
}

module.exports = {
	Register,
	ShopInfo,
	DishCategory,
	DishUnit,
	AddDish,
	UpdateDish
}