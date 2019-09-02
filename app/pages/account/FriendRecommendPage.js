/**
  * desc：好友推荐
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	FlatList
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import api from '../../api/index'
import WxLoginPage from "./WxLoginPage";
import {unitWidth} from "../../utils/AdapterUtil";

export default class FriendRecommendPage extends BasePage {

	static navigationOptions = {
		titleHeader: '好友推荐'
	}

	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			recommendList: []
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.loadData(true)
	}

	loadData = (showLoading) => {
		if(showLoading){
			this.showLoading()
		}
		api.account.getFriendRecommendList(this.state.pageIndex).then(res => {
			this.hideLoading()
			if(1 === res.status){
				this.state.recommendList = []
			}
			this.setState({
				recommendList: this.state.recommendList.concat(...res.data.list)
			})
		})
	}

	loadMore = () => {
		this.loadData(false)
	}

	// 渲染孩子组件
	renderRecommendItem = (item, index) => {
		return (
			<TouchableOpacity
				onPress={() => {

				}}
				style={itemStyle.container}
			>

			</TouchableOpacity>
		)
	}

	static startMe(navigation){
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('FriendRecommend')
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.recommendList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => this.renderRecommendItem(item, index)}
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
const itemStyle = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 15
	}
})
