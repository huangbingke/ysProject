/**
  * desc：单一一个H5界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text, TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {WebView} from 'react-native-webview'
import Resources from "../../assets/Resources";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import ProductSharePage from "../product/ProductSharePage";
import LinearGradient from "react-native-linear-gradient";
import api from '../../api/index'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";

export default class WebPage extends BasePage {

	static navigationOptions = ({navigation}) => {
		return {
			headerTitle: navigation.getParam('title'),
			headerRight: (
				<TouchableOpacity
					onPress={() => {
						navigation.state.params.webRefresh()
					}}
				>
					<Image
						source={Resources.refresh}
						resizeMode='contain'
						style={{
							witdh: unitWidth * 40, height: unitWidth * 40
						}}
					/>
				</TouchableOpacity>
			)
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			title: '',
			url: '',
			productInfo: null,
			isProduct: false
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.props.navigation.setParams({
			webRefresh: this.refresh
		})
		let title = this.props.navigation.getParam('title')
		let url = this.props.navigation.getParam('url')
		this.setState({
			title: title,
			url: url
		})
	}

	// 刷新页面
	refresh = () => {
		this.webview.reload()
	}

	static startMe(navigation, title, url) {
		navigation.push('Web', {
			title: title,
			url: url
		})
	}

	intercept = (request) => {
		console.info(request)
		if (request.url.startsWith('tbopen')) {
			console.info('tbopen')
			return false
		} else if (request.url.indexOf('uland.taobao.com/coupon/edetail') !== -1) {
			// TODO 跳转到优惠券
			console.info('uland')
			return false
		}
		// else {
		// 	WebPage.startMe(this.props.navigation, request.title, request.url)
		// 	console.info('WebPage')
		// 	return false
		// }
		return true
	}

	loadEnd = (syntheticEvent) => {
		console.info('页面加载成功')
		const {nativeEvent} = syntheticEvent
		console.info(nativeEvent)
		this.props.navigation.setParams({
			title: nativeEvent.title
		})
		if (nativeEvent.url.indexOf('detail.m.tmall.com/item.htm') > -1
			|| nativeEvent.url.indexOf('item.taobao.com/item.htm') > -1
			|| nativeEvent.url.indexOf('detail.m.liangxinyao.com/item.htm') > -1
			|| nativeEvent.url.indexOf('h5.m.taobao.com/awp/core/detail.htm') > -1) {
			// 访问到了淘宝商品
			this.setState({
				url: nativeEvent.url,
				isProduct: true
			})
		}
	}

	navigationChange = navState => {
		console.info(navState)
		if (navState.url.startsWith('tbopen')) {
			console.info('tbopen')
		} else if (navState.url.indexOf('uland.taobao.com/coupon/edetail') !== -1) {
			// TODO 跳转到优惠券
			console.info('uland')
		} else {
			// WebPage.startMe(this.props.navigation, navState.title, navState.url)
			// console.info('WebPage')
		}
	}

	// 获取产品信息
	getProductInfo = () => {
		this.showLoading()
		api.product.parseTbkCode(this.state.url).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.setState({
					isProduct: false,
					productInfo: res.data
				})
			}
		})
	}

	//购买动作
	gotoBuy = () => {
		dao.user.isLogin().then(token => {
			if (token) {
				dao.user.getUserInfo().then(userInfo => {
					if (userInfo) {
						if (userInfo.taobaoUserId) {
							let url = this.state.productInfo.couponShareUrl ? this.state.productInfo.couponShareUrl : this.state.productInfo.url
							api.product.createTbkCode(this.state.productInfo.title, url, this.state.productInfo.pictUrl,
								this.state.productInfo.adzoneId, this.state.productInfo.itemId)
						} else {
							// TODO 跳转到淘宝授权界面
						}
					}
				})
			} else {
				WxLoginPage.startMe(this.props.navigation,() => {
					this.props.navigation.navigate('Web')
				})
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<WebView
					ref={webview=>this.webview=webview}
					source={{uri: this.state.url}}
					startInLoadingState={true}
					automaticallyAdjustContentInsets={true}
					onLoadEnd={(request) => {
						this.loadEnd(request)
					}}
					onNavigationStateChange={(request) => {
						this.navigationChange(request)
					}}
					// onShouldStartLoadWithRequest={(request) => {this.intercept(request)}}
				/>
				{
					this.state.isProduct ?
						<TouchableOpacity
							onPress={() => {
								this.getProductInfo()
							}}
							style={styles.searchContainer}>
							<LinearGradient
								style={{
									flex: 1, flexDirection: 'row', justifyContent: 'center', height: unitWidth * 90,
									alignItems: 'center'
								}}
								colors={["#ffb642", "#fd9520"]}
								start={{x: 0, y: 0}} end={{x: 1, y: 0}}
							>
								<Image
									source={Resources.search_white}
									style={{
										width: unitWidth * 40,
										aspectRatio: 1
									}}
								/>
								<Text style={{color: '#FFFFFF', marginLeft: unitWidth * 15}}>搜券查收益</Text>
							</LinearGradient>
						</TouchableOpacity> : <View></View>
				}
				{
					this.state.productInfo ? <View style={bottomStyles.container}>
						<TouchableOpacity
							style={bottomStyles.shareContainer}
							onPress={() => {
								ProductSharePage.startMe(this.props.navigation, this.state.productInfo)
							}}
						>
							<LinearGradient
								style={{
									flex: 1, flexDirection: 'row', justifyContent: 'center', height: unitWidth * 90,
									alignItems: 'center'
								}}
								colors={["#ffb642", "#fd9520"]}
								start={{x: 0, y: 0}} end={{x: 1, y: 0}}
							>
								<Image
									style={{width: unitWidth * 40, height: unitWidth * 40}}
									source={Resources.product_share}
								/>
								<Text
									style={{marginLeft: unitWidth * 12, fontSize: fontscale * 15, color: '#FFFFFF'}}
								>预估收益¥{this.state.productInfo.fee}</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity
							style={bottomStyles.buyContainer}
							onPress={() => {
								this.gotoBuy()
							}}
						>
							<LinearGradient
								style={{
									flex: 1, flexDirection: 'row', justifyContent: 'center', height: unitWidth * 90,
									alignItems: 'center',
								}}
								colors={["#ff5c62", "#fe2a2c"]}
								start={{x: 0, y: 0}} end={{x: 1, y: 0}}
							>
								<Image
									style={{width: unitWidth * 40, height: unitWidth * 40}}
									source={Resources.get_coupon}
								/>
								<Text
									style={{marginLeft: unitWidth * 12, fontSize: fontscale * 15, color: '#FFFFFF'}}
								>直接下单</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View> : <View></View>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	searchContainer: {
		width: '100%',
		flexDirection: 'row',
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0
	}
})
const bottomStyles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0
	},
	shareContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: unitWidth * 90,
		alignItems: 'center',
		color: '#FFFFFF'
	},
	buyContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: unitWidth * 90,
		alignItems: 'center',
		color: '#FFFFFF'
	}
})
