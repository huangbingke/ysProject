/**
  * desc：每月收入界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {fontscale, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import dao from "../../dao";
import api from '../../api/index'
import WxLoginPage from "../account/WxLoginPage";

export default class OverviewPage extends BasePage {

	static navigationOptions = {
		headerTitle: '整体概况'
	}

	constructor(props) {
		super(props)
		this.state = {
			index: 0,
			overViewList: [
				{
					title: '今日预估',
					desc: '今日总效果预估',
					data: null
				},
				{
					title: '本月预估',
					desc: '本月总效果预估',
					data: null
				},
				{
					title: '上月预估',
					desc: '上月总效果预估',
					data: null
				},
				{
					title: '上月结算',
					desc: '上月总结算收入',
					data: null
				}
			]
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let index = this.props.navigation.getParam('index')
		this.showLoading()
		api.market.getOverview().then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.setState({
					overViewList: this.state.overViewList.map((item, index) => {
						switch (index) {
							case 0:
								return {...item, data: res.data.today}
							case 1:
								return {...item, data: res.data.thisMonth}
							case 2:
								return {...item, data: res.data.lastMonth}
							case 3:
								return {...item, data: res.data.lastMonthSettle}
						}
					}),
				})
				this.setState({
					index: index
				})
			}
		})
	}

	static startMe(navigation, index) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('Overview', {
				index: index
			})
		})
	}

	render() {
		return (
			<ScrollableTabView
				style={styles.container}
				tabBarUnderlineStyle={{backgroundColor: '#ff3328', height: unitWidth * 2}}
				tabBarActiveTextColor='#ff3328'
				tabBarInactiveTextColor='#333333'
				page={this.state.index}
				renderTabBar={() => <ScrollableTabBar/>}
			>
				{
					this.state.overViewList.map((item, index) => {
						return (
							item.data ?
								<View
									key={index}
									style={styles.itemContainer}
									tabLabel={item.title}>
									<View style={styles.headerContainer}>
										<Text style={styles.itemTitle}>{item.desc}</Text>
										<Text style={styles.totalValue}>¥{item.data.totalFee}</Text>
									</View>
									<View style={styles.blockContainer}>
										<View style={styles.block}/>
										<Text style={styles.blockTitle}>我的概况</Text>
									</View>
									<View style={styles.descContainer}>
										<Text style={styles.descTitle}>
											淘宝订单
											<Text style={styles.descNum}>{item.data.mineCount}</Text>
										</Text>
										<Text style={styles.descTitle}>
											效果预估
											<Text style={[styles.descValue, styles.descTitleRight]}>¥{item.data.mineFee}</Text>
										</Text>
									</View>

									<View style={styles.blockContainer}>
										<View style={styles.block}/>
										<Text style={styles.blockTitle}>直属粉丝概况</Text>
									</View>
									<View style={styles.descContainer}>
										<Text style={styles.descTitle}>
											淘宝订单
											<Text style={styles.descNum}>{item.data.levelOneCount}</Text>
										</Text>
										<Text style={styles.descTitle}>
											效果预估
											<Text style={[styles.descValue, styles.descTitleRight]}>¥{item.data.levelOneFee}</Text>
										</Text>
									</View>

									<View style={styles.blockContainer}>
										<View style={styles.block}/>
										<Text style={styles.blockTitle}>推荐粉丝概况</Text>
									</View>
									<View style={styles.descContainer}>
										<Text style={styles.descTitle}>
											淘宝订单
											<Text style={styles.descNum}>{item.data.levelTwoCount}</Text>
										</Text>
										<Text style={styles.descTitle}>
											效果预估
											<Text style={[styles.descValue, styles.descTitleRight]}>¥{item.data.levelTwoFee}</Text>
										</Text>
									</View>
								</View> :
								<View></View>
						)
					})
				}
			</ScrollableTabView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	itemContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 20
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	itemTitle: {
		color: '#333333',
		fontSize: fontscale * 23
	},
	totalValue: {
		color: '#ff3328',
		fontSize: fontscale * 23,
		padding: unitWidth * 20
	},
	block: {
		width: unitWidth * 10,
		height: unitHeight * 30,
		marginRight: unitWidth * 12,
		backgroundColor: '#333333'
	},
	blockTitle: {
		color: '#333333',
		fontSize: fontscale * 17,
		fontWeight: 'bold'
	},
	blockContainer: {
		flexDirection: 'row',
		margin: unitWidth * 12,
		fontSize: fontscale * 24,
		alignItems: 'center',
		fontWeight: 'bold'
	},
	descContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: unitWidth * 12
	},
	descTitle: {
		color: '#999999',
		fontSize: fontscale * 14,
		flex: 1
	},
	descTitleRight: {
		marginLeft: unitWidth * 30
	},
	descNum: {
		fontSize: fontscale * 14,
		marginLeft: unitWidth * 20,
		color: '#666666'
	},
	descValue: {
		fontSize: fontscale * 14,
		marginLeft: unitWidth * 20,
		color: '#ff3328'
	}
})
