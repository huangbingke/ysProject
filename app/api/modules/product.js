import Rest from '../../utils/Rest'
import { rsa } from '../../utils/Sign'

export default {
	getIndexProductList: function (pageIndex) {
		return Rest.post('/v1/product/list', {
			pageIndex: pageIndex,
			pageSize: 20,
			searchType: 1
		})
	},
	getCouponProductList: function (pageIndex) {
		return Rest.post('/v1/product/list', {
			pageIndex: pageIndex,
			pageSize: 20
		})
	},
	// 获取产品列表
	getProductList: function (pageIndex, key, cateId, showCoupon, sort, startPrice, endPrice) {
		let params = {
			pageIndex: pageIndex,
			pageSize: 20
		}
		if(key){
			params['q'] = key
		}
		if(cateId && -1 !== cateId){
			params['cat'] = cateId
		}
		if(sort && sort > -1){
			params['sort'] = sort
		}
		if(startPrice && startPrice > 0){
			params['startPrice'] = startPrice
		}
		if(endPrice && endPrice > 0){
			params['endPrice'] = endPrice
		}
		if(showCoupon){
			params['hasCoupon'] = 1
		}
		return Rest.post('/v1/product/list', params)
	},
	// 根据搜索类型获取产品列表
	getProductListByType: function (type, pageIndex) {
		return Rest.post('/v1/product/list', {
			pageIndex: pageIndex,
			pageSize: 20,
			type: type
		})
	},
	// 获取产品详情
	getProductDetail: function(itemId){
		return Rest.post('/v1/product/detail', {
			itemId
		})
	},
	// 获取关联推荐商品
	getRelateProduct: function (itemId) {
		return Rest.post('/v1/product/recommend', {
			itemId
		})
	},
	// 该产品是否在收藏夹中
	isProductInCollection: function (itemId) {
		return Rest.post('/v1/product/favCheck', {
			itemId: itemId
		})
	},
	// 添加到收藏夹中
	addToCollection: function (itemId) {
		return Rest.post('/v1/product/fav', {
			itemId: itemId,
			favType: 2
		})
	},
	// 添加在浏览足迹中
	addToFoot: function (itemId) {
		return Rest.post('/v1/product/fav', {
			itemId: itemId,
			favType: 2
		})
	},
	// 从收藏夹中移除
	removeFromCollection: function (itemId) {
		let params = []
		params.push(itemId + '')
		return Rest.post('/v1/product/favDel', {
			favType: 1,
			itemIds: params
		})
	},
	// 创建淘口令
	createTbkCode: function (title, url, logo, adzoneId, itemId) {
		return Rest.post('/v1/tpwd/create', {
			text: title,
			url: url,
			logo: logo,
			vid: rsa.encrypt(adzoneId + '-' + itemId)
		})
	},
	// 解析淘口令
	parseTbkCode: function (key) {
		return Rest.post('/v1/tpwd/get', {
			q: key
		})
	}
}
