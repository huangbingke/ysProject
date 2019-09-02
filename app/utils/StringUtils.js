export default {
	getSecretPhone: function(phone) {
		return phone.substring(0, 3) + '****' + phone.substring(8, 11)
	},
	getParams: function (name, link) {
		if (link) {
			let reg = new RegExp('(^|[&|?])' + name + '=([^&]*)(&|$)', 'i')
			let r = link.substr(1).match(reg)
			if (r != null) {
				return unescape(r[2])
			}
		}
		return ''
	},
	// 从链接中获取邀请人编码
	getInvitorCode: function (link) {
		if(link){
			let r = link.match(/∞(\S*)∞/)
			if(r){
				return r[1]
			}
		}
		return ''
	}
}
