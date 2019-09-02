/**
  * desc：首页的hot页面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	SectionList
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import HotHeader from './header/HotHeader'
import ProductCell from '../../../components/ProductListCell'
import api from '../../../api/index'
import ScrollToTop from "../../../components/ScrollToTop";
import LoadMore from "../../../components/load_more/LoadMore";
import EmptyView from "../../../components/EmptyView";

export default class HotPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			refreshing: false,
			pageIndex: 1,
			productList: []
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.refresh(true)
	}

	refresh = (showLoading, pageIndex) => {
		api.product.getIndexProductList(pageIndex).then(res => {
			if(1 === pageIndex){
				this.state.productList = []
			}
			this.setState({
				refreshing: false,
				productList: this.state.productList.concat(...res.data)
			})
			this.hideLoading()
		})
	}

	loadMore = () => {
		this.state.pageIndex ++
		this.state.refreshing = true
		this.refresh(false, this.state.pageIndex)
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<SectionList
					style={{flex: 1}}
					ref={productList => this.productList = productList}
					refreshing={this.state.refreshing}
					sections={[{key:'s1', data:this.state.productList}]}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					onRefresh={() => {
						this.refresh(false, 1)
					}}
					onEndReached={() => {
						this.loadMore()
					}}
					ListEmptyComponent={() => <EmptyView/>}
					ListHeaderComponent={<HotHeader/>}
					renderItem={({item,index}) => <ProductCell item={item} keyExtractor={(index) => index} index={index}/>}
					ListFooterComponent={() => <LoadMore mode='loading'/> }
				/>
				<ScrollToTop
					scrollAction={() => {
						this.productList.scrollToLocation({
							animated: true,
							itemIndex: 0
						})
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({})
