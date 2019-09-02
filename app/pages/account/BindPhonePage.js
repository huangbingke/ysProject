/**
  * desc：绑定手机号码
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet, Text, TextInput, TouchableOpacity,
	View,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import CountDown from "../../components/CountDown";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import api from '../../api/index'
import dao from "../../dao";
import EventManager from "../../manager/EventManager";
import InputInviteCodePage from "./InputInviteCodePage";

export default class BindPhonePage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			inputEnough: false,
			phone: '',
			randomCode: '',
			phoneRegisterFlag: false,
			wxCode: '',
			tbCode: '',
			registerFlag: '',	//注册的标志：no_register-->该账号尚未注册,already_register-->该账号已经注册，差绑定
		}
	}

	static startMeWithWxCode(navigation, wxCode, registerFlag, callback) {
		navigation.navigate('BindPhone', {
			wxCode: wxCode,
			registerFlag: registerFlag,
			callback: callback
		})
	}

	static startMeWithTbCode(navigation, tbCode, registerFlag, callback) {
		navigation.navigate('BindPhone', {
			tbCode: tbCode,
			registerFlag: registerFlag,
			callback: callback
		})
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.state.wxCode = this.props.navigation.getParam('wxCode')
		this.state.tbCode = this.props.navigation.getParam('tbCode')
		this.state.registerFlag = this.props.navigation.getParam('registerFlag')
	}

	// 绑定手机动作
	bindAction = () => {
		if (this.state.inputEnough) {
			this.showLoading()
			if ('no_register' === this.state.registerFlag) {
				// 微信号未注册
				if (this.state.phoneRegisterFlag) {
					// 手机号码已经注册-->直接绑定完成登录
					this.bindDirectly()
				} else {
					dao.user.getInvitorCode().then(inviteCode => {
						if (inviteCode) {
							// 本地有邀请码，直接追加邀请码
							this.bindDirectly()
							this.appendInviteCode(inviteCode)
						}else{
							// 本地无邀请码，跳转去输入邀请码界面
							if(this.state.wxCode){
								InputInviteCodePage.startMeWithWxCode(this.props.navigation, this.state.wxCode)
							}else if(this.state.tbCode){
								InputInviteCodePage.startMeWithTbCode(this.props.navigation, this.state.tbCode)
							}
						}
					})
				}
			} else {
				// 微信号已注册且手机号已注册，直接完成登录操作
				this.bindDirectly()
			}
		}
	}

	// 直接绑定并登录
	bindDirectly = () => {
		if(this.state.wxCode){
			// 微信绑定
			api.account.wxLogin(
				this.state.wxCode,
				'',
				this.state.phone,
				this.state.randomCode
			).then(res => {
				this.loginCallback(res)
			})
		}else if(this.state.tbCode){
			// 淘宝绑定
			api.account.taobaoLogin(
				this.state.wxCode,
				'',
				this.state.phone,
				this.state.randomCode
			).then(res => {
				this.loginCallback(res)
			})
		}
	}

	loginCallback = res => {
		this.hideLoading()
		if (1 === res.status) {
			dao.user.setPhone(this.state.phone)
			dao.user.setToken(res.data.token)
			dao.user.setUserId(res.data.userId)
			EventManager.postInitAccount()
			this.showToast('登录成功')
			this.props.navigation.goBack()
			if (this.props.navigation.state.params.callback) {
				this.props.navigation.state.params.callback(res)
			}
		} else {
			this.showToast(res.message)
		}
	}

	// 追加邀请码
	appendInviteCode = (inviteCode) => {
		api.account.appendInviteCode(inviteCode)
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.tip}>输入手机号码</Text>
				<View style={styles.inputCell}>
					<Text style={styles.label}>手机号码</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入手机号码'
						clearButtonMode='while-editing'
						multiline={false}
						maxLength={11}
						onChangeText={text => this.setState({
							phone: text,
							inputEnough: this.state.phone && this.state.randomCode
						})}
					/>
				</View>
				<View style={styles.randomContainer}>
					<Text style={styles.label}>短信验证码</Text>
					<TextInput
						style={{
							flex: 2
						}}
						placeholder='请输入手机验证码'
						clearButtonMode='while-editing'
						maxLength={6}
						onChangeText={text => {
							this.setState({
								randomCode: text,
								inputEnough: this.state.phone && this.state.randomCode
							})
						}}
					/>
					<CountDown
						style={{flex: 1}}
						phone={this.state.phone}
						type={2}
						showBorder={true}
						callback={registerFlag => {
							this.setState({
								phoneRegisterFlag: registerFlag
							})
						}}
					/>
				</View>
				<TouchableOpacity
					onPress={() => {
						this.bindAction()
					}}
				>
					<Text
						style={[
							styles.submitBtn,
							this.state.inputEnough ? styles.submitEnable : ''
						]}
					>立即绑定</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	tip: {
		color: '#333333',
		fontSize: fontscale * 30,
		margin: unitWidth * 50
	},
	inputCell: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#e1e1e1',
		padding: unitWidth * 25
	},
	label: {
		flex: 1,
		color: '#666666',
		fontSize: fontscale * 13
	},
	input: {
		flex: 3,
		fontSize: fontscale * 13,
		color: '#333333'
	},
	randomContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: unitWidth * 25,
		borderBottomWidth: 1,
		borderColor: '#e1e1e1'
	},
	submitBtn: {
		backgroundColor: '#999999',
		fontSize: fontscale * 16,
		color: '#FFFFFF',
		padding: unitWidth * 25,
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: unitWidth * 40,
		overflow: 'hidden',
		marginLeft: unitWidth * 30,
		marginRight: unitWidth * 30,
		marginTop: unitWidth * 60
	},
	submitEnable: {
		backgroundColor: '#FF3328'
	}
})
