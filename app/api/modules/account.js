import Rest from '../../utils/Rest'
import {rsa} from '../../utils/Sign'

let account = {
	//获取商品收藏列表
	getCollectionList: function (pageIndex) {
		return Rest.post('/v1/product/favList', {
			favType: 1,
			pageIndex: pageIndex,
			pageSize: 20
		})
	},
	// 获取好友推荐商品列表
	getFriendRecommendList: function (pageIndex) {
		return Rest.post('/v1/product/favList', {
			favType: 3,
			pageIndex: pageIndex,
			pageSize: 20
		})
	},
	// 新用户注册
	register: function (params) {
		if (params) {
			params['password'] = rsa.encrypt(params['password'])
		}
		return Rest.post('/v1/user/register', params)
	},
	// 普通手机号登录
	normalLogin: function (phone, password) {
		return Rest.post('/v1/user/login', {
			phone: phone,
			password: rsa.encrypt(password)
		})
	},
	// 短信验证码登录
	randomLogin: function (phone, code) {
		return Rest.post('/v2/user/login', {
			phone: phone,
			code: code
		})
	},
	// 微信方式登录
	wxLogin: function (weixinCode, inviteCode = '', phone = '', code = '') {
		return Rest.post('/v2/user/login/weixin', {
			weixinCode: weixinCode,
			source: 0,
			inviteCode: inviteCode,
			phone: phone,
			code: code
		})
	},
	// 淘宝方式登录
	taobaoLogin: function (taobaoCode, inviteCode = '', phone = '', code = '') {
		return Rest.post('/v1/user/login/taobao', {
			taobaoCode: taobaoCode,
			source: 0,
			phone: phone,
			code: code,
			inviteCode: inviteCode
		})
	},
	checkIfRegister: function (phone) {
		return Rest.post('/v1/user/checkPhone', {
			phone: phone
		})
	},
	// 追加邀请人推荐码
	appendInvitorCode: function (invitorCode) {
		return Rest.post('/v1/user/update', {
			inviteCode: inviteCode
		})
	},
	// 注销动作
	logout: function () {
		return Rest.post('/v1/user/logout', {})
	},
	// 找回密码
	findPassword: function (phone, code, password) {
		return Rest.post('/v1/user/findPwd', {
			phone: phone,
			code: code,
			password: rsa.encrypt(password)
		})
	},
	// 修改手机号码
	modifyPhone: function (phone, oldCode, newCode) {
		return Rest.post('/v1/user/update', {
			phone: phone,
			code: oldCode,
			newCode: newCode
		})
	},
	// 修改密码
	modifyPassword: function (oldPassword, newPassword) {
		return Rest.post('/v1/user/changePwd', {
			oldPassword: rsa.encrypt(oldPassword),
			newPassword: rsa.encrypt(newPassword)
		})
	},
	// 修改用户昵称
	modifyNick: function (newName) {
		return Rest.post('/v1/user/update', {
			nickName: newName
		})
	},
	// 获取当前登录用户信息
	getUserInfo: function () {
		return Rest.post('/v1/user', {})
	},
	// 用户升级动作
	userUpgrade: function (userId) {
		return Rest.post('/v1/user/upgrade', {
			userId: userId
		})
	},
	// 根据邀请码获取用户信息
	getUserInfoByCode: function (inviteCode) {
		return Rest.post('/v1/user', {
			inviteCode: inviteCode
		})
	},
	// 获取用户分享邀请信息
	getUserShareInfo: function (inviteCode) {
		return Rest.post('/v1/user/invite', {
			inviteCode: inviteCode
		})
	},
	// 绑定微信账号
	bindWxAccount: function (wxCode) {
		return Rest.post('/v1/user/update', {
			isUnbindWeixin: 0,
			weixinCode: wxCode
		})
	},
	// 解绑微信账号
	unBindWxAccount: function () {
		return Rest.post('/v1/user/update', {
			isUnbindWeixin: 1
		})
	},
	// 绑定支付宝账号
	bindAliAccount: function (alipayName, alipayAccount, code) {
		return Rest.post('/v1/user/update', {
			alipayName: alipayName,
			alipayAccount: alipayAccount,
			code: code
		})
	},
	// 解除绑定支付宝账号
	unBindAliAccount: function () {
		return Rest.post('/v1/user/update', {
			alipayName: '',
			alipayAccount: ''
		})
	},
	// 追加推荐人编码
	appendInviteCode: function (inviteCode) {
		return Rest.post('/v1/user/update', {
			inviteCode: inviteCode
		})
	},
	// 获取虚拟用户列表
	getVisualUserList: function () {
		return Rest.post('/v1/user/virtual', {})
	}
}

export default account
