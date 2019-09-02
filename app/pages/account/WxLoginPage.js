/**
  * desc：微信登录界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Alert,
	Image,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import LoginPage from "./LoginPage";
import dao from "../../dao";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import WechatManager from "../../manager/WechatManager";
import api from '../../api/index'
import BindPhonePage from "./BindPhonePage";
import EventManager from "../../manager/EventManager";
import WebPage from "../app/WebPage";
import constant from "../../config/constant";

export default class WxLoginPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			agreeProtocal: true,
			inviteCode: ''
		}
	}

	static startMe(navigation, callback) {
		dao.user.isLogin().then(token => {
			if (token) {
				callback && callback()
			} else {
				navigation.navigate('WxLogin', {
					callback: callback
				})
			}
		})
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		dao.user.getInvitorCode().then(inviteCode => {
			this.setState({
				inviteCode: inviteCode
			})
		})
	}

	// 微信授权登录动作
	wxAuthLogin = () => {
		WechatManager.wxAuth().then(res => {
			let wxCode = res.code
			if (wxCode) {
				this.showLoading()
				api.account.wxLogin(wxCode, this.state.inviteCode).then(res => {
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
					} else if (100 === res.status) {
						// 未注册，先绑定手机号码
						BindPhonePage.startMeWithWxCode(this.props.navigation, wxCode, 'no_register', () => {
							this.props.navigation.goBack()
						})
					} else if(101 === res.status){
						// 已注册但未绑定手机号码，只需要绑定手机号码即可
						BindPhonePage.startMeWithWxCode(this.props.navigation, wxCode, 'already_register', () => {
							this.props.navigation.goBack()
						})
					}else{
						this.showToast(res.message)
					}
				})
			}
		})
	}

	// 提示用户绑定手机号码
	alertBindPhone = (wxCode) => {
		Alert.alert(
			'温馨提示',
			'您好，请绑定手机号码',
			[
				{
					text: '再考虑下'
				},
				{
					text: '去绑定',
					onPress: () => {
						BindPhonePage.startMe(this.props.navigation, wxCode, res => {
							this.props.navigation.goBack()
							this.props.navigation.state.params.callback(res)
						})
					}
				}
			],
			{
				cancelable: true
			}
		)
	}

	// 跳转到用户协议界面
	jumpAgreement = () => {
		WebPage.startMe(this.props.navigation, '', constant.mallUrlInfo.registerAgreement)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.bottomContainer}>
					<TouchableOpacity
						style={styles.btnContainer}
						onPress={() => {
							this.wxAuthLogin()
						}}
					>
						<Image
							source={Resources.wx_white}
							style={styles.wxIcon}
						/>
						<Text style={styles.wxBtn}>微信登录</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							LoginPage.startMe(this.props.navigation, res => {
								this.props.navigation.goBack()
								this.props.navigation.state.params.callback(res)
							})
						}}
					>
						<Text style={styles.phoneLogin}>手机登录></Text>
					</TouchableOpacity>
					<View style={styles.protocalContainer}>
						<TouchableOpacity
							onPress={() => {
								this.setState({
									agreeProtocal: !this.state.agreeProtocal
								})
							}}
						>
							<Image
								style={{
									width: unitWidth * 38,
									height: unitWidth * 38
								}}
								source={this.state.agreeProtocal ? Resources.share_img_check : Resources.share_img_no_check}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								this.jumpAgreement()
							}}
						>
							<Text
								style={{color: '#999999', marginLeft: unitWidth * 20}}
							>我已阅读并同意《易省CPS营销协议》</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#FFFFFF'
	},
	bottomContainer: {
		justifyContent: 'center',
		position: 'absolute',
		bottom: '10%',
		left: 0,
		right: 0,
		width: '100%'
	},
	btnContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#56cc67',
		borderRadius: unitWidth * 10,
		overflow: 'hidden',
		marginLeft: '30%',
		marginRight: '30%',
		paddingTop: unitWidth * 16,
		paddingBottom: unitWidth * 16,
		paddingLeft: unitWidth * 20,
		paddingRight: unitWidth * 20
	},
	wxIcon: {
		width: unitWidth * 48,
		height: unitWidth * 38
	},
	wxBtn: {
		color: '#ffffff',
		marginLeft: unitWidth * 12,
		fontSize: fontscale * 15,
	},
	phoneLogin: {
		textAlign: 'center',
		margin: unitWidth * 30,
		color: '#999999'
	},
	protocalContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	}
})
