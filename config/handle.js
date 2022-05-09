// 创建一个Error的子类
class result extends Error {
	constructor(msg, code) {
		super()
		this.msg = msg
		this.code = code
	}
}

// 导出这个类
module.exports = result