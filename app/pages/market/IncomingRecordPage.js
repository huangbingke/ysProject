/**
  * desc：收入记录界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Alert
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, statusBarHeight, unitWidth} from "../../utils/AdapterUtil";
import CashRecordPage from "./children/CashRecordPage";
import IncomingPage from "./children/IncomingPage";
import dao from "../../dao";
import api from '../../api/index'
import WxLoginPage from "../account/WxLoginPage";
import Resources from "../../assets/Resources";
import GetCashPage from "./GetCashPage";
import BindAliAccountPage from "./BindAliAccountPage";

export default class IncomingRecordPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			totalAmount: 0,
			pageList: [
				{
					title: '提现记录',
					component: <CashRecordPage tabLabel='提现记录'/>
				},
				{
					title: '收入',
					component: <IncomingPage tabLabel='收入'/>
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
		this.loadData()
	}

	loadData = () => {
		api.market.getFinanceInfo().then(res => {
			if(1 === res.status){
				this.setState({
					totalAmount: res.data.total
				})
			}
		})
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('IncomingRecord')
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.goBack()
						}}
						style={{
							marginTop: statusBarHeight
						}}
					>
						<Image
							source={Resources.back_white}
							resizeMode='center'
							style={{
								marginLeft: unitWidth * 15,
								width: unitWidth * 60
							}}
						/>
					</TouchableOpacity>
					<View style={styles.tipContainer}>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<Text style={{
								color: '#FFFFFF'
							}}>
								可提现金额（元）
							</Text>
							<TouchableOpacity
								onPress={() => {
									Alert.alert('温馨提示',
										'每月25日可提现\n当月收入须到次月25日才可提现',
										[{
											text: '我知道了', onPress: () => {
											}
										}],
										{cancelable: true})
								}}
							>
								<Image
									style={{
										width: unitWidth * 30,
										height: unitWidth * 30
									}}
									source={Resources.faq_white_small}
								/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							onPress={() => {
								dao.user.getUserInfo().then(userInfo => {
									if(userInfo && userInfo.alipayAccount){
										// 有绑定支付宝，直接跳转去提现界面
										GetCashPage.startMe(this.props.navigation, this.state.totalAmount, () => {
											this.loadData()
										})
									}else{
										// 未绑定支付宝，先跳转到绑定支付宝界面
										BindAliAccountPage.startMe(this.props.navigation)
									}
								})
							}}
						>
							<Text style={styles.getCashBtn}>立即提现</Text>
						</TouchableOpacity>
					</View>
					<Text style={styles.money}>
						{this.state.totalAmount}
					</Text>
				</View>
				<ScrollableTabView
					style={styles.pageContainer}
					tabBarUnderlineStyle={{backgroundColor: '#ff3328', height: unitWidth * 2}}
					tabBarActiveTextColor='#ff3328'
					tabBarInactiveTextColor='#333333'
					initialPage={0}
					renderTabBar={() => <ScrollableTabBar/>}
				>
					{
						this.state.pageList.map((item, index) => {
							return item.component
						})
					}
				</ScrollableTabView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	headerContainer: {
		backgroundColor: '#ff3328',
		width: '100%',
		height: '25%'
	},
	tipContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: unitWidth * 20
	},
	money: {
		color: '#FFFFFF',
		fontSize: fontscale * 28,
		fontWeight: 'bold',
		marginTop: unitWidth * 20,
		marginLeft: unitWidth * 20
	},
	getCashBtn: {
		color: '#ff3328',
		backgroundColor: '#FFFFFF',
		marginRight: unitWidth * 20,
		padding: unitWidth * 20,
		borderRadius: unitWidth * 35,
		overflow: 'hidden'
	},
	pageContainer: {}
})
