/**
  * desc：设置界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	Alert
} from 'react-native'
import ItemCell from '../../components/ItemCell'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import dao from "../../dao";
import WxLoginPage from "./WxLoginPage";
import api from '../../api/index'
import ModifyNickPage from "./ModifyNickPage";
import BindAliAccountPage from "../market/BindAliAccountPage";
import ModifyPwdPage from "./ModifyPwdPage";
import ValidatePhonePage from "./ValidatePhonePage";
import EventManager from "../../manager/EventManager";
import WechatManager from "../../manager/WechatManager";
import ImagePicker from 'react-native-image-picker';

export default class SettingPage extends BasePage {

	static navigationOptions = {
		headerTitle: '设置'
	}

	constructor(props) {
		super(props)
		this.state = {
			userInfo: {},
			localIconPath: ''
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.showLoading()
		api.account.getUserInfo().then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.setState({
					userInfo: res.data
				})
				dao.user.setUserInfo(res.data)
			}
		})
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation, () => {
			navigation.navigate('Setting')
		})
	}

	// 绑定与解绑支付宝
	aliAccountAction = () => {
		if (this.state.userInfo.alipayAccount) {
			Alert.alert(
				'温馨提示',
				'是否要解绑支付宝账号?',
				[
					{
						text: '取消',
					},
					{
						text: '解绑',
						onPress: () => {
							this.showLoading()
							api.account.unBindAliAccount().then(res => {
								this.hideLoading()
								if (1 === res.status) {
									// TODO 设置界面数据+设置本地数据
								}
								this.showToast(res.message)
							})
						}
					}
				],
				{}
			)
		} else {
			BindAliAccountPage.startMe(this.props.navigation)
		}
	}

	// 绑定与解绑微信
	wxAction = () => {
		dao.user.getUserInfo().then(userInfo => {
			if (userInfo) {
				if (1 === userInfo.isWeixin) {
					// 已绑定-->提示解绑对话框
					Alert.alert(
						'温馨提示',
						'是否要解绑微信账号？',
						[
							{
								text: '取消'
							},
							{
								text: '解绑',
								onPress: () => {
									this.showLoading()
									api.account.unBindWxAccount().then(res => {
										this.hideLoading()
										if (1 === res.status) {
											this.showToast('解绑成功')
											// TODO 设置界面数据+设置本地数据
										}
									})
								}
							}
						],
						{cancelable: true}
					)
				} else {
					// 未绑定，在当前页面直接唤起微信绑定动作
					WechatManager.wxAuth().then(res => {
						let wxCode = res.code
						if (wxCode) {
							this.showLoading()
							api.account.bindWxAccount(wxCode).then(res => {
								this.hideLoading()
								if (1 === res.status) {
									this.showToast('绑定成功')
									// TODO 设置界面数据+设置本地数据
								}
							})
						}
					})
				}
			}
		})
	}

	// 注销
	logout = () => {
		Alert.alert(
			'温馨提示',
			'你确定要注销吗？',
			[
				{
					text: '取消',
					onPress: () => {
					}
				},
				{
					text: '确定',
					onPress: () => {
						// 执行注销动作
						this.showLoading()
						api.account.logout().then(res => {
							this.hideLoading()
							this.showToast(res.message)
							EventManager.postLogout()
							dao.user.logout()
							this.props.navigation.goBack()
						})
					}
				}
			]
		)
	}

	// 绑定淘宝账号
	tbAction = () => {

	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<TouchableOpacity
					onPress={() => {
						ImagePicker.showImagePicker({
							title: '请选择操作',
							cancelButtonTitle: '取消',
							takePhotoButtonTitle: '拍照上传',
							chooseFromLibraryButtonTitle: '从本地相册中选择',
							storageOptions: {
								skipBackup: true,
								path: 'images'
							}
						}, res => {
							if(res.error){
								this.showToast(res.error)
							}else if(res.uri){
								this.setState({
									localIconPath: res.uri
								})
							}
						})
					}}
					style={styles.iconContainer}>
					<Image
						style={styles.icon}
						source={this.state.localIconPath?{uri: this.state.localIconPath}:Resources.user_default_icon}
					/>
				</TouchableOpacity>
				<ItemCell
					title='昵称'
					rightTitle='修改'
					bottom={true}
					top={true}
					onCellClick={() => {
						ModifyNickPage.startMe(this.props.navigation)
					}}
					link={true}
				/>
				<ItemCell
					title='支付宝绑定'
					bottom={true}
					rightTitle={this.state.userInfo.alipayAccount ? '已绑定' : '未绑定'}
					onCellClick={() => {
						this.aliAccountAction()
					}}
					link={true}
				/>
				<ItemCell
					title='淘宝授权'
					bottom={true}
					rightTitle={this.state.userInfo.taobaoUserId ? '已绑定' : '未绑定'}
					onCellClick={() => {

					}}
					link={true}
				/>
				<ItemCell
					title='微信绑定'
					bottom={true}
					rightTitle={this.state.userInfo.isWeixin === 1 ? '已绑定' : '未绑定'}
					onCellClick={() => {
						this.wxAction()
					}}
					link={true}
				/>
				<ItemCell
					title='修改手机号'
					rightTitle='修改'
					bottom={true}
					onCellClick={() => {
						ValidatePhonePage.startMe(this.props.navigation)
					}}
					link={true}
				/>
				{/*<ItemCell*/}
				{/*	title='修改密码'*/}
				{/*	rightTitle='修改'*/}
				{/*	bottom={true}*/}
				{/*	onCellClick={() => {*/}
				{/*		ModifyPwdPage.startMe(this.props.navigation)*/}
				{/*	}}*/}
				{/*	link={true}*/}
				{/*/>*/}
				<TouchableOpacity
					style={{
						marginTop: unitWidth * 80
					}}
					onPress={() => {
						this.logout()
					}}
				>
					<Text style={styles.logout}>注销</Text>
				</TouchableOpacity>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f3f3f3'
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: unitWidth * 40,
		marginBottom: unitWidth * 40
	},
	icon: {
		width: unitWidth * 200,
		height: unitWidth * 200,
		borderRadius: unitWidth * 100,
		overflow: 'hidden'
	},
	logout: {
		color: '#FF3328',
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 25,
		fontSize: fontscale * 15,
		textAlign: 'center'
	}
})
