/**
  * desc：淘宝订单界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import OrderListPage from './children/OrderListPage'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import {unitWidth} from "../../utils/AdapterUtil";

export default class TbOrderPage extends BasePage {

	static navigationOptions = {
		headerTitle: '淘宝订单'
	}

	constructor(props) {
		super(props)
		this.state = {
			pageList: [
				{
					title: '我的订单',
					level: 0
				},
				{
					title: '直属订单',
					level: 1
				},
				{
					title: '推荐订单',
					level: 2
				}
			]
		}
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('TbOrder')
		})
	}

	render() {
		return (
			<ScrollableTabView
				tabBarUnderlineStyle={{backgroundColor: '#ff3328', height: unitWidth * 2}}
				tabBarActiveTextColor='#ff3328'
				tabBarInactiveTextColor='#333333'
				initialPage={0}
				renderTabBar={() => <ScrollableTabBar/>}
				style={styles.container}>
				{
					this.state.pageList.map((item, index) => {
						return <OrderListPage level={item.level} key={index} tabLabel={item.title}/>
					})
				}
			</ScrollableTabView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	}
})
