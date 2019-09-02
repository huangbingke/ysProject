/**
  * desc：首页子分类页面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList,
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import ProductCell from '../../../components/ProductListCell'
import api from "../../../api";
import ScrollToTop from "../../../components/ScrollToTop";
import LoadMore from "../../../components/load_more/LoadMore";
import CateHeader from "./header/CateHeader";

export default class CatePage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			refreshing: false,
			pageIndex: 1,
			cateId: -1,
			productList: []
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let { cateId } = this.props
		this.state.cateId = cateId
		this.refresh(true, this.state.pageIndex)
	}

	refresh = (showLoading, pageIndex) => {
		if(showLoading){
			this.showLoading()
		}
		api.product.getProductList(pageIndex, '', this.state.cateId).then(res => {
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
		this.refresh(false, this.state.pageIndex)
	}

	render() {
		let { cateList } = this.props
		let list = this.state.productList
		return (
			<View style={styles.container}>
				<FlatList
					ref={productList => this.productList = productList}
					data={list}
					refreshing={this.state.refreshing}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item,index}) => <ProductCell item={item} key={index} index={index}/>}
					onRefresh={() => {
						this.state.refreshing = true
						this.state.pageIndex = 1
						this.refresh(false, this.state.pageIndex)
					}}
					onEndReached={() => {
						this.loadMore()
					}}
					ListHeaderComponent={() => <CateHeader cateList={cateList}/>}
					ListFooterComponent={() => <LoadMore mode='loading'/> }
				/>
				<ScrollToTop
					scrollAction={() => {
						this.productList.scrollToIndex({
							animated: true,
							index: 0
						})
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
