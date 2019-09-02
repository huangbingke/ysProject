import { debug } from './index'
let htmlHost = 'http://ys.32wd.cn'
let h5Host = 'http://m.32wd.cn'
if(debug){
	htmlHost = 'http://test-ys.32wd.cn'
	h5Host = 'http://test-m.32wd.cn'
}
let constant = {
	mallUrlInfo: {
		appShareUrl: htmlHost + '/html/app_share/app_share.html',
		singleProductUrl: htmlHost + '/html/product/single_product.html',
		productListUrl: htmlHost + '/html/product/product_list.html',
		faqUrl: htmlHost + '/html/faq/faq.html',
		watchAliAccountUrl: htmlHost + '/html/faq/watch_ali_account.html',
		userAgreement: htmlHost + '/html/faq/user_agreement.html',
		registerAgreement: htmlHost + '/html/protocal/register.html'
	},
	h5UrlInfo: {
		productUrl: h5Host + '/product/invite',
		inviteRegisterUrl: h5Host + '/invite-register'
	}
}

export default constant
