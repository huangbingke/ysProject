/**
  * desc：活动界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import api from '../../api/index'
import ProductCell from '../../components/ProductListCell'
import ScrollToTop from "../../components/ScrollToTop";

export default class ActivityPage extends BasePage {

	static navigationOptions = ({navigation}) => {
		const {params} = navigation.state
		return {
			headerTitle: params.title
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			title: '',
			type: '',
			pageIndex: 1,
			productList: []
		}
	}

	static startMe(navigation, title, type) {
		navigation.navigate('Activity', {
			title: title,
			type: type
		})
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.state.title = this.props.navigation.getParam('title')
		this.state.type = this.props.navigation.getParam('type')
		this.showLoading()
		api.product.getProductListByType(this.state.type, this.state.pageIndex).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if(1 === this.state.pageIndex){
					this.state.productList = []
				}
				this.setState({
					productList: this.state.productList.concat(...res.data)
				})
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					ref={productList => this.productList = productList}
					data={this.state.productList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => <ProductCell item={item} keyExtractor={(index) => index} index={index}/>}
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
