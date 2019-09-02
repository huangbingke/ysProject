/**
  * desc：统一登录界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TextInput,
	Text,
	Image,
	ImageBackground
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import Resources from "../../assets/Resources";
import {fontscale, getStatusBarHeight, height, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import {Card} from 'react-native-shadow-cards'
import api from '../../api/index'
import dao from '../../dao/index'
import EventManager from "../../manager/EventManager";
import WechatManager from "../../manager/WechatManager";
import CountDown from "../../components/CountDown";
import InputInviteCodePage from "./InputInviteCodePage";

export default class LoginPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			randomCode: '',
			alreadyRegisterFlag: false
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
	}

	//跳转到登录，并存入这个登录成功后目的参数
	static startMe(navigation, callback) {
		navigation.push('Login', {
			callback: callback
		})
	}

	// 执行登录动作
	phoneLogin() {
		if (!this.state.phone) {
			this.showToast('请输入手机号码')
			return
		}
		if (!this.state.randomCode) {
			this.showToast('请输入收到的短信验证码')
			return
		}
		this.showLoading()
		api.account.randomLogin(this.state.phone, this.state.randomCode).then(res => {
			this.hideLoading()
			if(1 === res.status){
				dao.user.setPhone(this.state.phone)
				dao.user.setToken(res.data.token)
				dao.user.setUserId(res.data.userId)
				EventManager.postInitAccount()
				if(this.state.alreadyRegisterFlag){
					// 号码已经注册-->直接返回上层页面
					this.props.navigation.goBack()
					if (this.props.navigation.state.params.callback) {
						this.props.navigation.state.params.callback(res)
					}
				}else{
					// 号码第一次注册，需要根据本地的邀请码来操作
					dao.user.getInvitorCode().then(invitorCode => {
						if(invitorCode){
							api.account.appendInvitorCode(invitorCode).then(res => {
								this.props.navigation.goBack()
								if (this.props.navigation.state.params.callback) {
									this.props.navigation.state.params.callback(res)
								}
							})
						}else{
							// 本地没有邀请码-->跳转到输入邀请码界面
							InputInviteCodePage.startMeWithoutCode(this.props.navigation, (res) => {
								if (this.props.navigation.state.params.callback) {
									this.props.navigation.state.params.callback(res)
								}
							})
						}
					})
				}
			} else {
				this.showToast(res.message)
			}
		})
	}

	// 微信授权登录动作
	wxAuthLogin = () => {
		WechatManager.wxAuth().then(res => {
			let wxCode = res.code
			if (wxCode) {
				this.showLoading()
				api.account.wxLogin(wxCode, '').then(res => {
					this.hideLoading()
					if (1 === res.status) {
						// 登录成功
						dao.user.setToken(res.data.token)
						dao.user.setUserId(res.data.userId)
						EventManager.postInitAccount()
						this.showToast('登录成功')
						this.props.navigation.goBack()
						if (this.props.navigation.state.params.callback) {
							this.props.navigation.state.params.callback(res)
						}
					} else if (110 === res.status || 1008 === res.status) {
						// 提示用户绑定手机号码
						this.alertBindPhone(wxCode)
					} else {
						this.showToast(res.message)
					}
				})
			}
		})
	}

	// 淘宝授权登录
	tbAuthLogin = () => {

	}

	render() {
		return (
			<ImageBackground
				resizeMode='stretch'
				source={Resources.bg_login}
				style={styles.container}
			>
				<TouchableOpacity
					style={{marginTop: getStatusBarHeight() + unitWidth * 20, marginLeft: unitWidth * 20}}
					onPress={() => {
						this.props.navigation.goBack()
					}}
				>
					<Image
						style={{width: unitWidth * 48, height: unitWidth * 48}}
						source={Resources.black_back}
					/>
				</TouchableOpacity>

				<View style={{
					flexDirection: 'row',
					width: '100%',
					alignSelf: 'center',
					justifyContent: 'center'
				}}>
					<Card
						opacity={.3}
						style={{
							flexDirection: 'column',
							padding: unitWidth * 30,
							marginLeft: unitWidth * 20,
							marginRight: unitWidth * 20,
							marginTop: height * 0.25
						}}>
						<Card style={{
							width: unitWidth * 150,
							height: unitWidth * 150,
							alignSelf: 'center',
							marginTop: -unitWidth * 75
						}}>
							<Image
								source={Resources.app_login_icon}
								style={{
									width: unitWidth * 150,
									height: unitWidth * 150,
								}}
							/>
						</Card>
						<View style={[styles.item, styles.itemFirst]}>
							<Image
								source={Resources.account}
								style={styles.iconLeft}
							/>
							<TextInput
								style={styles.input}
								returnKeyType='next'
								keyboardType="numeric"
								placeholder='请输入手机号码'
								clearButtonMode='while-editing'
								maxLength={11}
								autoFocus={true}
								onChangeText={(text) => {
									this.setState({
										phone: text
									})
								}}
							/>
						</View>

						<View style={[styles.item, styles.itemSecond]}>
							<Image
								source={Resources.password}
								style={styles.iconLeft}
							/>
							<TextInput
								style={styles.input}
								returnKeyType='next'
								placeholder='请输入短信验证码'
								maxLength={6}
								keyboardType="numeric"
								clearButtonMode='while-editing'
								multiline={false}
								onChangeText={(text) => {
									this.setState({
										randomCode: text
									})
								}}
							/>
							<CountDown
								style={{flex: 1}}
								phone={this.state.phone}
								type={2}
								showBorder={true}
								callback={(registerFlag) => {
									this.alreadyRegisterFlag = registerFlag
								}}
							/>
						</View>
						<TouchableOpacity
							style={styles.loginBtn}
							onPress={() => {
								this.phoneLogin()
							}}>
							<Text style={{color: '#FFFFFF'}}>登录</Text>
						</TouchableOpacity>

					</Card>
				</View>
				<View style={styles.thirdLoginContainer}>
					<View style={styles.headerContainer}>
						<View style={styles.loginLine}/>
						<Text style={styles.otherLogin}>其他登录方式</Text>
						<View style={styles.loginLine}/>
					</View>
					<View style={styles.loginContainer}>
						<TouchableOpacity
							onPress={() => {
								this.wxAuthLogin()
							}}
							style={styles.loginItem}>
							<Image
								source={Resources.wechat}
								style={styles.thirdIcon}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								this.tbAuthLogin()
							}}
							style={styles.loginItem}>
							<Image
								source={Resources.taobao}
								style={styles.thirdIcon}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignContent: 'center'
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: unitWidth * 12,
		backgroundColor: '#fbfbfb',
		borderRadius: unitWidth * 50
	},
	itemFirst: {
		marginTop: unitHeight * 50
	},
	itemSecond: {
		marginTop: unitHeight * 20
	},
	iconLeft: {
		width: unitWidth * 48,
		aspectRatio: 1
	},
	input: {
		flex: 1,
		marginLeft: unitWidth * 12,
		padding: unitWidth * 12
	},
	loginBtn: {
		flexDirection: 'row',
		color: '#FFFFFF',
		backgroundColor: '#ff3328',
		fontSize: fontscale * 15,
		padding: unitWidth * 25,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: unitWidth * 40,
		marginTop: unitWidth * 20,
		marginBottom: unitWidth * 20
	},
	bottomContainer: {
		flexDirection: 'row',
		marginTop: unitHeight * 20,
		justifyContent: 'space-between'
	},
	thirdLoginContainer: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%'
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	loginLine: {
		flex: 1,
		height: unitHeight * 1,
		backgroundColor: '#e2e2e2',
		marginLeft: unitWidth * 30,
		marginRight: unitWidth * 30
	},
	otherLogin: {
		color: '#666666',
		fontSize: fontscale * 14
	},
	loginContainer: {
		flexDirection: 'row',
	},
	loginItem: {
		flex: 1,
		padding: unitWidth * 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	thirdIcon: {
		width: unitHeight * 80,
		height: unitHeight * 80
	}
})
