/**
  * desc：微信相关管理类
  * author：zhenggl
  * date： $
  */
import *as wechat from 'react-native-wechat'

const wxAppId = 'wx5a66d277c7091673'
import {Toast} from 'beeshell'

let WechatManager = {
	registerApp: function () {
		wechat.registerApp(wxAppId)
	},
	// 添加分享的监听动作
	addShareListener: function (success, failed) {
		wechat.addListener('SendMessageToWX.Resp', (response) => {
			if (parseInt(response.errCode) === 0) {
				Toast.show('分享成功', '2000', 'bottom')
				if (success) {
					success()
				}
			} else {
				Toast.show('分享失败', '2000', 'bottom')
				if (failed) {
					failed()
				}
			}
		})
	},
	// 添加支付的监听动作
	addPayListener: function () {
	},
	// 微信授权
	wxAuth: function () {
		return new Promise((resolve, reject) => {
			wechat.isWXAppInstalled().then(isInstalled => {
				if (isInstalled) {
					wechat.sendAuthRequest('snsapi_userinfo', 'wetchat_sdk_demo').then(code => {
						// 返回code码，通过code获取access_token以及用户信息
						resolve(code)
					}).catch(err => {
						reject(err)
					})
				} else {
					Toast.show('没有安装微信，请安装微信后重试', '2000', 'bottom')
					reject('没有安装微信，请安装微信后重试')
				}
			})
		})
	},
	// 转发給好友
	shareFriend: function (title, content, url, thumbImage) {
		wechat.isWXAppInstalled().then(isInstalled => {
			if (isInstalled) {
				wechat.shareToSession({
					type: 'news',
					title: title,
					description: content,
					webpageUrl: url,
					thumbImage: thumbImage
				})
			} else {
				Toast.show('没有安装微信，请安装微信后重试', '2000', 'bottom')
			}
		})
	},
	// 分享到朋友圈
	shareFriendCircle: function (title, content, url, thumbImage) {
		wechat.isWXAppInstalled().then(isInstalled => {
			if (isInstalled) {
				wechat.shareToTimeline({
					title: title,
					description: content,
					thumbImage: thumbImage,
					type: 'news',
					webpageUrl: url
				})
			} else {
				Toast.show('没有安装微信，请安装微信后重试', '2000', 'bottom')
			}
		})
	},
	// 分享到收藏
	shareToFavorite: function (title, content, url, thumbImage) {
		wechat.isWXAppInstalled().then(isInstalled => {
			if (isInstalled) {
				wechat.shareToFavorite({
					type: 'news',
					title: title,
					description: content,
					webpageUrl: url,
					thumbImage: thumbImage
				})
			}
		})
	}
};

export default WechatManager
