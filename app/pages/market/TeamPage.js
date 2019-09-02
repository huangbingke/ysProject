/**
  * desc：团队成员界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import TeamContentPage from './children/TeamContentPage'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import {unitWidth} from "../../utils/AdapterUtil";

export default class TeamPage extends BasePage {

	static navigationOptions = {
		headerTitle: '会员'
	}

	// level，0->全部会员，1->直属会员，2->推荐会员
	constructor(props) {
		super(props)
		this.state = {
			pageList: [
				{
					title: '全部粉丝',
					level: 0
				},
				{
					title: '直属粉丝',
					level: 1
				},
				{
					title: '推荐粉丝',
					level: 2
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

	}

	static startMe(navigation){
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('Team')
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
						return <TeamContentPage level={item.level} key={index} tabLabel={item.title}/>
					})
				}
			</ScrollableTabView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
