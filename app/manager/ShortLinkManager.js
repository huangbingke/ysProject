/**
  * desc：产品相关管理类：主要提供分享链接生成策略、端链接提供方
  * author：zhenggl
  * date： $
  */
import api from '../api/index'
import constant from '../config/constant'
import md5 from '../utils/md5'
import dao from "../dao";

// 生成产品分享的专属vcode
const generateVCode = (itemId, inviteCode) => {
	let result = ''
	for (let i = 0; i < itemId.length; i++) {
		if (0 === i % 2) {
			result += itemId.charAt(i)
		}
	}
	for (let i = 0; i < inviteCode.length; i++) {
		if (1 === i % 2) {
			result += inviteCode.charAt(i)
		}
	}
	return md5(result)
}

// 生成产品的长链接
const getProductLongLink = productInfo => {
	return new Promise((resolve, reject) => {
		dao.user.getUserInfo().then(userInfo => {
			let link = ''
			if (userInfo && userInfo.inviteCode) {
				let itemCode = productInfo.tbkPwd
				let vCode = generateVCode(productInfo.itemId, userInfo.inviteCode)
				if (itemCode) {
					if (itemCode.indexOf('￥') > -1) {
						itemCode = itemCode.replace('/￥/g', '')
					}
					link = constant.h5UrlInfo.productUrl + '?itemCode=' + itemCode + '&inviteCode=' + userInfo.inviteCode + '&vCode=' + vCode
				} else {
					link = constant.h5UrlInfo.productUrl + '?itemCode=' + productInfo.itemId + '&inviteCode=' + userInfo.inviteCode + '&vCode=' + vCode
				}
				resolve(link)
			}
		}).catch(error => {
			reject(error)
		})
	})
}

// 生成邀请购买的长链接
const getInviteLongLink = productInfo => {
	return new Promise((resolve, reject) => {
		dao.user.getUserInfo().then(userInfo => {
			let link = ''
			if(userInfo && userInfo.inviteCode){
				let itemCode = productInfo.tbkPwd
				let inviteCode = userInfo.inviteCode
				if(itemCode){
					if (itemCode.indexOf('￥') > -1) {
						itemCode = itemCode.replace('/￥/g', '')
					}
				}else{
					itemCode = productInfo.itemId
				}
				link = constant.h5UrlInfo.inviteRegisterUrl + '?itemCode=' + itemCode + '&inviteCode=' + inviteCode
			}
			resolve(link)
		})
	})
}

let ShortLinkManager = {
	// 生成分享链接
	generateProductShareLink: function (productInfo) {
		return new Promise((resolve, reject) => {
			if (productInfo) {
				getProductLongLink(productInfo).then(longLink => {
					api.resources.longLink2Short(longLink).then(res => {
						if (1 === res.status) {
							resolve(res.data)
						}else{
							resolve('')
						}
					})
				})
			}else{
				resolve('')
			}
		})
	},
	// 生成邀请购买链接
	generateInviteLink: function (productInfo) {
		return new Promise((resolve, reject) => {
			if(productInfo){
				getInviteLongLink(productInfo).then(longLink => {
					api.resources.longLink2Short(longLink).then(res => {
						if(1 === res.status){
							resolve(res.data)
						}else{
							resolve(longLink)
						}
					})
				})
			}else{
				resolve('')
			}
		})
	},
	// 生成App分享链接
	generateAppLink: function (longLink) {
		return new Promise((resolve, reject) => {
			api.resources.longLink2Short(longLink).then(res => {
				if(1 === res.status){
					resolve(res.data)
				}else{
					reject(longLink)
				}
			})
		})
	}
}

export default ShortLinkManager
