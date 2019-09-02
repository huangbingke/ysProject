import {debug, host} from '../config/index'
import dao from '../dao/index'
import EventManager from "../manager/EventManager";

function header() {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Connection': 'close',
	}
}

function getAppendBody() {
	return {
		channel: 'ios',
		platform: 2,
		lng: 11.453343,
		lat: 130.438332,
		timestamp: new Date().getTime(),
		nonce: '',
		sign: ''
	}
}

let rest = {
	get: function (url) {
		if (url.indexOf('http') === -1) {
			url = host + url
		}
		return fetch(url, {
			method: 'GET',
			headers: header()
		}).then(res => res.json())
	},
	post: function (url, params) {
		return new Promise((resolve, reject) => {
			dao.user.isLogin().then(token => {
				if (!params) {
					params = {}
				}
				let appendBody = getAppendBody()
				params = Object.assign(appendBody, params)
				if (token) {
					params['token'] = token
				}
				if (url.indexOf('http') === -1) {
					url = host + url
				}
				fetch(url, {
					method: 'POST',
					headers: header(),
					body: JSON.stringify(params)
				}).then(res => {
					if(res._bodyInit){
						if(res._bodyInit instanceof String) {
							let bodyObj = JSON.parse(res._bodyInit)
							if (401 === bodyObj['status'] || 403 === bodyObj['status']) {
								EventManager.postAccountTimeOut()
							}
						}
					}
					resolve(res.json())
				})
			}).catch(error => {
				reject(error)
			})
		})
	}
}

export default rest
