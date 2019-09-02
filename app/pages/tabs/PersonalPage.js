/**
  * desc：个人中心
  * author：zhenggl
  * date： $
  */
import React from 'react';
import {
	StyleSheet,
	View,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Text,
	Image, Clipboard
} from 'react-native';
import BasePage from '../../pages/basic/BasePage'
import {fontscale, getStatusBarHeight, unitWidth, width} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import LoginPage from "../account/LoginPage";
import OverviewPage from "../market/OverviewPage";
import SettingPage from "../account/SettingPage";
import TbOrderPage from "../order/TbOrderPage";
import TeamPage from "../market/TeamPage";
import ShareFriendPage from "../app/ShareFriendPage";
import CollectionPage from "../account/CollectionPage";
import IncomingRecordPage from "../market/IncomingRecordPage";
import WebPage from "../app/WebPage";
import AboutUsPage from "../app/AboutUsPage";
import api from '../../api/index'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import constant from "../../config/constant";
import FriendRecommendPage from "../account/FriendRecommendPage";
import EventManager from "../../manager/EventManager";

export default class PersonalPage extends BasePage {

	constructor(props) {
		super(props);
		this.state = {
			overViewInfo: null,
			userInfo: null,
			marketList: [
				{
					title: '提现',
					icon: Resources.cash_record,
					action: () => IncomingRecordPage.startMe(this.props.navigation)
				},
				{
					title: '团队管理',
					icon: Resources.team,
					action: () => TeamPage.startMe(this.props.navigation)
				},
				{
					title: '淘宝订单',
					icon: Resources.taobao_order,
					action: () => TbOrderPage.startMe(this.props.navigation)
				}
			],
			serviceList: [
				{
					title: '邀请好友',
					icon: Resources.share_qrcode,
					action: () => ShareFriendPage.startMe(this.props.navigation)
				},
				{
					title: '我的收藏',
					icon: Resources.my_favourite,
					action: () => CollectionPage.startMe(this.props.navigation)
				},
				{
					title: '好友推荐',
					icon: Resources.friend_recommend,
					action: () => FriendRecommendPage.startMe(this.props.navigation)
				},
				{
					title: '帮助中心',
					icon: Resources.help_center,
					action: () => WebPage.startMe(this.props.navigation, '', constant.mallUrlInfo.faqUrl)
				},
				{
					title: '关于我们',
					icon: Resources.about_us,
					action: () => AboutUsPage.startMe(this.props.navigation)
				}
			]
		}
		this.renderServiceItem = this.renderServiceItem.bind(this)
	}

	componentDidMount() {
		dao.user.isLogin().then(token => {
			if (token) {
				this.initAccount()
			}
		})
		this.initAccountListener = EventManager.registerListener(EventManager.INIT_ACCOUNT, () => {
			this.initAccount()
		})
		this.logoutListener = EventManager.registerListener(EventManager.LOG_OUT, () => {
			this.setState({
				userInfo: null,
				overViewInfo: null
			})
		})
	}

	initAccount = () => {
		api.account.getUserInfo().then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.setState({
					userInfo: res.data
				})
				dao.user.setUserInfo(res.data)
			}
		})
		api.market.getOverview().then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.setState({
					overViewInfo: res.data
				})
			}
		})
	}

	componentWillUnmount() {
		this.logoutListener && this.logoutListener.remove()
		this.initAccountListener && this.initAccountListener.remove()
	}

	// 渲染服务的grid-item项目
	renderServiceItem = (item, index, imageWH, left, top) => {
		return (
			<TouchableOpacity
				onPress={item.action}
				key={index}
				style={{
					width: imageWH,
					height: imageWH,
					marginLeft: left,
					marginTop: top,
					flexDirection: 'column',
					alignItems: 'center',
					alignContent: 'center',
					padding: unitWidth * 20
				}}
			>
				<Image
					resizeMode='cover'
					style={{width: unitWidth * 80, height: unitWidth * 80, padding: unitWidth * 15}}
					source={item.icon}/>
				<Text
					style={{
						color: '#333333',
						fontSize: fontscale * 15,
						marginTop: unitWidth * 10
					}}
				>{item.title}</Text>
			</TouchableOpacity>
		)
	}

	// 复制邀请码
	copyInviteCode = inviteCode => {
		Clipboard.setString(inviteCode)
		this.showToast('复制成功')
	}

	render() {
		const cols = 4
		const left = 20 * unitWidth
		const imageWH = (width - (cols + 1) * left) / cols
		return (
			<ScrollView style={styles.container}>
				<ImageBackground
					source={Resources.mine_bg}
					style={{flex: 1}}
				>
					<View style={{flex: 1, flexDirection: 'row-reverse', padding: unitWidth * 12}}>
						<TouchableOpacity onPress={() => {
							SettingPage.startMe(this.props.navigation)
						}}>
							<Text
								style={{
									color: '#FFFFFF',
									fontSize: fontscale * 16,
									padding: unitWidth * 12,
									marginTop: getStatusBarHeight()
								}}>
								设置
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.iconContainer}>
						<TouchableOpacity
							onPress={() => {
								WxLoginPage.startMe(this.props.navigation, () => {
									// 登录成功的回调

								})
							}}>
							<Image
								source={this.state.userInfo && this.state.userInfo.avatar ? {uri: this.state.userInfo.avatar} : Resources.user_default_icon}
								style={[styles.userIcon, this.state.userInfo && this.state.userInfo.avatar ? styles.userIconBorder : '']}
							/>
						</TouchableOpacity>
						{
							this.state.userInfo ?
								<View style={{
									flexDirection: 'column',
									justifyContent: 'center'
								}}>
									<TouchableOpacity
										style={styles.headerTxt}
										onPress={() => {
											SettingPage.startMe(this.props.navigation)
										}}
									>
										<Text style={{color: '#FFFFFF', fontSize: fontscale * 13,}}>
											{this.state.userInfo.nickName ? this.state.userInfo.nickName : this.state.userInfo.phone}
										</Text>
										<Image
											source={Resources.identity_agent}
											style={{width: unitWidth * 100, height: unitWidth * 100 * 40 / 144}}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.copyInviteCode(this.state.userInfo.inviteCode)
										}}
										style={[styles.headerTxt, {marginTop: unitWidth * 20}]}>
										<Text style={{color: '#FFFFFF', fontSize: fontscale * 13,}}>
											邀请码：{this.state.userInfo && this.state.userInfo.inviteCode}
										</Text>
										<Text style={{color: '#FFFFFF', fontSize: fontscale * 13, marginLeft: unitWidth * 12}}>
											复制
										</Text>
									</TouchableOpacity>
								</View> :
								<TouchableOpacity
									onPress={() => {
										WxLoginPage.startMe(this.props.navigation, () => {})
									}}
								>
									<Text
										style={{color: '#FFFFFF', fontSize: fontscale * 14}}
									>请登录</Text>
								</TouchableOpacity>
						}
					</View>
					<View style={styles.overContainer}>
						<TouchableOpacity
							style={styles.overItemContainer}
							onPress={
								() => {
									OverviewPage.startMe(this.props.navigation, 0)
								}
							}>
							{
								this.state.overViewInfo ?
									<View style={{marginLeft: unitWidth * 20}}>
										<Text style={styles.overItem}>今日预估 ></Text>
										<Text
											style={[styles.overItem, {marginLeft: unitWidth * 30}]}>¥{this.state.overViewInfo.today.totalFee.toFixed(2)}</Text>
									</View> : <View/>
							}
						</TouchableOpacity>
						<TouchableOpacity style={styles.overItemContainer} onPress={
							() => {
								OverviewPage.startMe(this.props.navigation, 1)
							}
						}>
							{
								this.state.overViewInfo ?
									<View style={{marginLeft: unitWidth * 20}}>
										<Text style={styles.overItem}>本月预估 ></Text>
										<Text
											style={[styles.overItem, {marginLeft: unitWidth * 30}]}>¥{this.state.overViewInfo.thisMonth.totalFee.toFixed(2)}</Text>
									</View> : <View/>
							}
						</TouchableOpacity>
					</View>
					<View style={styles.overContainer}>
						<TouchableOpacity style={styles.overItemContainer} onPress={
							() => {
								OverviewPage.startMe(this.props.navigation, 2)
							}
						}>
							{
								this.state.overViewInfo ?
									<View style={{marginLeft: unitWidth * 20}}>
										<Text style={styles.overItem}>上月预估 ></Text>
										<Text
											style={[styles.overItem, {marginLeft: unitWidth * 30}]}>¥{this.state.overViewInfo.lastMonth.totalFee.toFixed(2)}</Text>
									</View> : <View/>
							}
						</TouchableOpacity>
						<TouchableOpacity style={styles.overItemContainer} onPress={
							() => {
								OverviewPage.startMe(this.props.navigation, 3)
							}
						}>
							{
								this.state.overViewInfo ?
									<View style={{marginLeft: unitWidth * 20}}>
										<Text style={styles.overItem}>上月结算 ></Text>
										<Text
											style={[styles.overItem, {marginLeft: unitWidth * 30}]}>¥{this.state.overViewInfo.lastMonthSettle.totalFee.toFixed(2)}</Text>
									</View> : <View/>
							}
						</TouchableOpacity>
					</View>
				</ImageBackground>
				<Text style={styles.menuTitle}>合伙人</Text>
				<View style={styles.marketContainer}>
					{
						this.state.marketList.map((item, index) => {
							return (
								<TouchableOpacity
									style={styles.marketItem}
									onPress={item.action}
									key={index}>
									<Image style={styles.marketItemIcon} source={item.icon}/>
									<Text style={styles.marketItemTitle}>{item.title}</Text>
								</TouchableOpacity>
							)
						})
					}
				</View>
				<View style={styles.splider}/>
				<Text style={styles.menuTitle}>我的服务 </Text>
				<FlatList
					data={this.state.serviceList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					horizontal={false}
					numColumns={cols}
					renderItem={({item, index}) => this.renderServiceItem(item, index, imageWH, left, left)}
				/>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	userIcon: {
		width: unitWidth * 100,
		height: unitWidth * 100,
		marginLeft: unitWidth * 30,
		marginRight: unitWidth * 20
	},
	userIconBorder: {
		borderRadius: unitWidth * 50,
		borderWidth: unitWidth * 4,
		borderColor: '#ffffff'
	},
	headerTxt: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	overContainer: {
		flex: 1,
		flexDirection: 'row',
		padding: unitWidth * 20
	},
	overItemContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	overItem: {
		flex: 1,
		color: '#FFFFFF',
		fontSize: fontscale * 15
	},
	marketContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	marketItem: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		padding: unitWidth * 15,
		alignItems: 'center'
	},
	marketItemIcon: {
		width: unitWidth * 60,
		height: unitWidth * 60
	},
	marketItemTitle: {
		color: '#333333',
		fontSize: fontscale * 15,
		marginTop: unitWidth * 8
	},
	splider: {
		backgroundColor: '#f3f3f3',
		height: unitWidth * 15
	},
	menuTitle: {
		color: '#333333',
		fontWeight: 'bold',
		fontSize: fontscale * 16,
		padding: unitWidth * 20
	}
});
