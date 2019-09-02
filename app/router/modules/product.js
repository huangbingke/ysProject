import ProductDetailPage from '../../pages/product/ProductDetailPage'
import ProductListPage from '../../pages/product/ProductListPage'
import ProductSharePage from '../../pages/product/ProductSharePage'
import SearchPage from '../../pages/search/SearchPage'

//以下是倒入自定义的头部

import React from 'react';

export default {
	ProductDetail: {
		screen: ProductDetailPage,
		navigationOptions: {
			header: null
		}
	},
	ProductList: ProductListPage,
	ProductShare: ProductSharePage,
	Search: {
		screen: SearchPage,
		navigationOptions: {
			header: null
		}
	}
}
