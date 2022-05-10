module.exports = {
	security: {
		// 自定义参与加密token的值
		secretKey: "ruomeng",
		// 设置token过期时间，比如为3天
		expiresIn: 60 * 60 * 24 * 3
	}
}