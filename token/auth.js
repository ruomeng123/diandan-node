const basicAuth = require('basic-auth')
const req = require('express/lib/request')
const jwt = require('jsonwebtoken')
const { security } = require('./tokentime')
const result = require('../config/handle')

// 创建一个验证token合法性的类
class Auth {
	constructor() {}
	// 取值函数,中间件
	get m() {
		return async (ctx, next) => {
			// 将前端传过来验证的token解析出来：Credentials { name: '123445', pass: '' }
			const token = basicAuth(ctx, req)
			if(!token || !token.name) {
				// 如果没传，则给一个提示
				throw new result({ errcode: '401', errmsg: '没有访问权限' }, 401)
			}
			// 传了则进行token校验
			try{
				var authCode = jwt.verify(token.name, security.secretKey)
				// console.log(authCode);
			} catch(err){
				if(err.name == 'TokenExpiredError'){
					throw new result({errcode:'401',msg:'账号过期,请重新登陆'},401)
				} else {
					throw new result({errcode:'401',msg:'没有访问权限!'},401)
				}
			}
			// 把验证得到的uid存入ctx中
			ctx.auth = {
				uid: authCode.uid
			}
			// 继续下一个中间件操作
			await next()
		}
	}
	
}
module.exports = { Auth }