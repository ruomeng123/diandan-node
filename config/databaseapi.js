/* 在此创建对数据增删改查操作的一些类 */

// 引入axios
const axios = require('axios')
// 引入node内置模块qs
const qs = require('querystring')
// 引入Error的子类
const result = require('./handle.js')

/* 请求获取小程序全局唯一后台接口调用凭据（access_token）*/
// 拼接路径参数
const params = qs.stringify({
	grant_type: 'client_credential',
	appid: 'wxca24a4c4179d5a5b',
	secret: '1149517302032335af84f01d50cdc8d5'
})
// 获取token请求路径
const url = 'https://api.weixin.qq.com/cgi-bin/token?' + params

// 数据库插入记录请求路径
const addUrl = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='
// 云环境ID
const env = 'cloud1-2gci1hg2f2593f4d'

// 创建类
class GetAccessToken {
	constructor() {
		// 不用传参
	}
	// 获取token
	async getAccessToken() {
		try{
			// 发起请求
			const token = await axios.get(url)
			// 判断是否成功
			if(token.status === 200) {
				// 成功后返回token值即可
				return token.data.access_token
			} else {
				// 状态码不是'200'和以'5'开头的时候,需要让它也走catch
				// 出现throw就会自动进入catch里,后面的提示信息也会进入它的参数里
				throw '获取token失败!'
			}
		} catch(err){
			// 只有状态码为'5'开头的会进入这里,抛出错误提示即可
			throw new result(err, 500)
		}
	}
	
	// 调用云开发数据库api
	async posteve(dataUrl, query) {
		try{
			// 获取到token
			const token = await this.getAccessToken()
			// 发起请求
			const data = await axios.post(dataUrl + token, {env, query})
			// 判断请求是否成功
			if(data.data.errcode === 0) {
				return data.data
			} else {
				throw '请求失败!'
			}
		}catch(err){
			throw new result(err, 500)
		}
	}
}

// 导出
module.exports = {
	GetAccessToken,
	addUrl
}