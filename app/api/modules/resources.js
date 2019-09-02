import Rest from '../../utils/Rest'
import { debug } from '../../config/index'

let resources = {
	getSetting: function () {
		let url = 'http://yishengdata.oss-cn-shenzhen.aliyuncs.com/app_setting/ys-setting-release.json'
		if(debug){
			url = 'http://yishengdata.oss-cn-shenzhen.aliyuncs.com/app_setting/ys-setting-test.json'
		}
		return Rest.get(url)
	},
	// 获取分类信息列表
	getCategoryList: function () {
		return Rest.post('/v1/category/list', {})
	},
	// 获取关键词列表
	getKeyList: function (key) {
		let params = {}
		if(key){
			params['q'] = key
		}
		return Rest.post('/v1/suggest/list', params)
	},
	// 获取首页活动相关信息
	getIndexActivity: function () {
		return Rest.post('/v1/element/list', {
		})
	},
	// 长链接转端链接
	longLink2Short: function (link) {
		return Rest.post('/v1/shortUrl', {
			url: link
		})
	},
	// 获取短信验证码
	getRandomCode: function (phone, type) {
		let params = {
			phone: phone,
			type: type,
		}
		if(debug){
			params['isVirtual'] = 1
		}
		return Rest.post('/v1/sms/send', params)
	}
}

export default resources
