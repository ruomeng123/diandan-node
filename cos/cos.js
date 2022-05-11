// 引入处理 multipart/form-data 类型的表单数据，主要用于上传文件
const multer = require('@koa/multer');
// 引入对象存储 COS 的 XML JS SDK
const COS = require('cos-nodejs-sdk-v5');

// 创建一个 COS SDK 实例
const cos = new COS({
    SecretId: 'AKIDZx72jAMJ1TgfPuDH6g17xYu0rSovmNkr',
    SecretKey: 'ua2FmAKFvNbbNvEJAnBMJ2XrwmNjqiIh',
	// 发请求时用的协议
	Protocol: 'https:'
});

// 封装文件上传方法
const cosfun = function (filename, path) {
	return new Promise((resolve, reject) => {
		cos.uploadFile({
		    Bucket: 'daxi-image-1311562881', /* 填入您自己的存储桶，必须字段 */
		    Region: 'ap-nanjing',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
		    Key: 'daxi-img/' + filename,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
			FilePath: path
		})
		.then(res => {
			// 上传云端成功以后返回图片地址
			resolve(res.Location)
		})
		.catch(err => {
			reject(err)
		})
	})
}

// 磁盘存储引擎,可以控制文件的存储
const storage = multer.diskStorage({
	// 配置文件上传的目录,存储前端传过来的文件
	destination: (req, file, cb) => {
		cb(null, 'upload/images')
	},
	// 更改文件名,解决上传的文件可能重名的问题
	filename:(req, file, cb) => {
		// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		// cb(null, file.fieldname + '-' + uniqueSuffix)
		const fileFormat = file.originalname.split('.')
		const num = `${Date.now()}-${Math.floor(Math.random(0, 1) * 1000000)}${"."}${fileFormat[fileFormat.length - 1]}`
		// console.log(num); // 打印结果:1652194524595-226698.jpg
		cb(null, num)
	}
})

const upload = multer({ storage })

module.exports = {
	upload,
	cosfun
}
