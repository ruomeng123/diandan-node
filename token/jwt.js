const jwt = require('jsonwebtoken')
const { security } = require('./tokentime.js')

// token加密生成方法,传入登录账户的uid和一个默认值scope参与加密
function getToken(uid, scope = 2) {
	const secretKey = security.secretKey
	const expiresIn = security.expiresIn
	// 使用jwt加密token
	const token = jwt.sign({uid, scope}, secretKey, {expiresIn})
	return token
}
 // 导出
 module.exports = { getToken }
