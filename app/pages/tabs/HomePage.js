/**
  * desc：首页
  * author：zhenggl
  * date： $
  */
import React from 'react';
import {
	AppState,
	StyleSheet,
	Clipboard,
	View
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import BasePage from '../basic/BasePage.js'
import HotPage from './home/HotPage'
import CatePage from './home/CatePage'
import SplashScreen from 'react-native-splash-screen'

import api from '../../api/index'
import {unitWidth} from "../../utils/AdapterUtil";
import EventManager from "../../manager/EventManager";
import CateMenu from "./home/CateMenu";
import WechatManager from "../../manager/WechatManager";
import dao from "../../dao";
import KeyDialog from '../app/KeyDialog'
import SingleProductDialog from "../app/SingleProductDialog";
import ProductListPage from "../product/ProductListPage";
import ProductDetailPage from "../product/ProductDetailPage";
import StringUtils from "../../utils/StringUtils";
import RootSiblings from 'react-native-root-siblings'
import WxLoginPage from "../account/WxLoginPage";

let cateMenuDialog = null
export default class Homepage extends BasePage {

	constructor(props) {
		super(props);
		this.isAppActive = false // app是否处于前台的标志
		this.state = {
			categoryList: [],
			pageIndex: 1,
			productList: []
		}
	}

	componentDidMount() {
		SplashScreen.hide();

		WechatManager.registerApp()	// 注册微信app
		this.showLoading()
		api.resources.getCategoryList().then(res => {
			this.hideLoading()
			this.setState({
				categoryList: res.data
			})
		})
		this.addListener()
	}

	// 添加监听动作
	addListener = () => {
		AppState.addEventListener('change', nextAppState => {
			if (nextAppState != null && nextAppState === 'active') {
				if (this.isAppActive) {
					// 从后台到前台
					Clipboard.getString().then(content => {
						if (content) {
							//这里需要解析邀请人的邀请码，存入到本地中
							if (StringUtils.getInvitorCode(content)) {
								dao.user.setInvitorCode(StringUtils.getInvitorCode(content))
							}
							api.product.parseTbkCode(content).then(res => {
								if (1 === res.status && res.data) {
									// 剪贴板中的内容可以搜索到单个产品详情
									SingleProductDialog.show(this.props.navigation, res.data, () => {
										// 跳转到搜索到的产品详情
										ProductDetailPage.startMe(this.props.navigation, res.data)
									})
								} else {
									KeyDialog.show(this.props.navigation, content, () => {
										// 搜索不到内容了，则直接跳转到产品列表界面
										ProductListPage.startMeByKey(this.props.navigation, content)
									})
								}
							})
						}
					})
				}
				this.isAppActive = false
			} else if (nextAppState != null && nextAppState === 'background') {
				this.isAppActive = true
			}
		})

		this.dropListener = EventManager.registerListener(EventManager.DROP_MENU,
			() => this.dropMenu())
		this.initAccountListener = EventManager.registerListener(EventManager.INIT_ACCOUNT,
			() => {
				api.account.getUserInfo().then(res => {
					if (1 === res.status) {
						dao.user.setUserInfo(res.data)
					}
				})
			})
		this.logoutListener = EventManager.registerListener(EventManager.ACCOUNT_TIME_OUT,
			(msg) => {
				WxLoginPage.startMe(this.props.navigation, 'Home')
			})
	}

	// 展示下拉开关
	dropMenu = () => {
		cateMenuDialog = new RootSiblings(
			<CateMenu
				navigation={this.props.navigation}
				show={true}
				categoryList={this.state.categoryList}
				onCancel={() => {
					cateMenuDialog.destroy()
				}}
			/>
		)
	}

	componentWillUnmount() {
		this.dropListener && this.dropListener.remove()
		this.initAccountListener && this.initAccountListener.remove()
		this.logoutListener && this.logoutListener.remove()
	}

	render() {
		this.state.categoryList.splice(0, 0, '全部')
		return (
			<View style={{flex: 1}}>
				<ScrollableTabView
					tabBarUnderlineStyle={{backgroundColor: '#ff3328', height: unitWidth * 2}}
					tabBarActiveTextColor='#ff3328'
					tabBarInactiveTextColor='#333333'
					style={styles.container}
					initialPage={0}
					renderTabBar={() => <ScrollableTabBar/>}
				>
					{
						this.state.categoryList.map((item, index) => {
							if (0 === index && typeof item === 'string') {
								return <HotPage key='hot' style={{flex: 1}} tabLabel={item}/>
							} else {
								return <CatePage style={{flex: 1}} navigation={this.props.navigation} tabLabel={item.name}
																 cateList={item.childs}
																 cateId={item.id} key={index}/>
							}
						})
					}
				</ScrollableTabView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
