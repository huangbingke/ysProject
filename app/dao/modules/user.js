import {storage} from '../../utils/StorageUtil'

const USER_ID = 'userId'
const USER_NICK = 'userNick'
const TOKEN = 'token'
const PHONE = 'phone'
const PASSWORD = 'password'
const USER_INFO = 'userInfo'
const INVITOR_CODE = 'invitorCode'	// 邀请人编码

let user = {
	isLogin: function () {
		return this.getToken()
	},
	getToken: function () {
		return new Promise((resolve) => {
			storage.load(TOKEN, data => {
				resolve(data)
			})
		})
	},
	setToken: function (token) {
		storage.save(TOKEN, token)
	},
	getUserId: function () {
		return new Promise((resolve) => {
			storage.load(USER_ID, data => {
				resolve(data)
			})
		})
	},
	setUserId: function (userId) {
		storage.save(USER_ID, userId)
	},
	getNick: function () {
		return new Promise((resolve) => {
			storage.load(USER_NICK, data => {
				resolve(data)
			})
		})
	},
	setNick: function (nick) {
		storage.save(USER_NICK, nick)
	},
	getPhone: function () {
		return new Promise((resolve) => {
			storage.load(PHONE, data => {
				resolve(data)
			})
		})
	},
	setPhone: function (phone) {
		storage.save(PHONE, phone)
	},
	getPassword: function () {
		return new Promise((resolve) => {
			storage.load(PASSWORD, data => {
				resolve(data)
			})
		})
	},
	setPassword: function (password) {
		storage.save(PASSWORD, password)
	},
	setUserInfo: function (userInfo) {
		storage.save(USER_INFO, userInfo)
	},
	getUserInfo: function () {
		return new Promise((resolve) => {
			storage.load(USER_INFO, data => {
				resolve(data)
			})
		})
	},
	setInvitorCode: function(code){
		storage.save(INVITOR_CODE, code)
	},
	getInvitorCode: function(){
		return new Promise(resolve => {
			storage.load(INVITOR_CODE, data => {
				resolve(data)
			})
		})
	},
	logout: function () {
		storage.remove(USER_INFO)
		storage.remove(TOKEN)
		storage.remove(PASSWORD)
	}
}

export default user
