import StringUtils from '../utils/StringUtils'
import WebPage from "../pages/app/WebPage";
import ActivityPage from "../pages/activity/ActivityPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductListPage from "../pages/product/ProductListPage";
const APP_HOST_TARGET = 'ys://host/mall/'

const ActivityJumpManager = {
	//全局活动跳转控制
	activityJump: function (url, navigation) {
		if (url.indexOf('h5') > -1) {
			// 打开多一个新的链接
			this.toH5(url, navigation)
		}else if (url.indexOf('ys_list') > -1){
			let title = StringUtils.getParams('title', url)
			let type = StringUtils.getParams('type', url)
			this.toActivity(type, title, navigation)
		}
	},
	// 跳转到产品详情
	toProductDetail: function (productInfo, navigation) {
		ProductDetailPage.startMe(navigation, productInfo)
	},
	// 跳转到活动界面
	toActivity: function (type, title, navigation) {
		ActivityPage.startMe(navigation, title, type)
	},
	// 跳转到分类搜索结果页面
	toCateSearch: function (cateId, navigation) {
		ProductListPage.startMeByCateId(cateId, navigation)
	},
	// 跳转到关键词搜索结果页面
	toKeySearch: function (key, navigation) {
		if(isApp()){
			window.location.href = APP_HOST_TARGET + 'product_list?key=' + key
		}else{
			router.push({
				path: '/product/list',
				query: {
					key: key
				}
			})
		}
	},
	// 跳转到另外一个H5页面中
	toH5: function (url, navigation) {
		let link = StringUtils.getParams('link', url)
		WebPage.startMe(navigation, '', link)
	}
}

export default ActivityJumpManager
