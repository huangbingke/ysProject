/**
  * desc：输入邀请码界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity, TextInput
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, getStatusBarHeight, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import api from '../../api/index'
import RegisterPage from "./RegisterPage";
import dao from "../../dao";
import QrScanPage from "../app/QrScanPage";
import EventManager from "../../manager/EventManager";

export default class InputInviteCodePage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			inviteCode: '',
			wxCode: '',
			tbCode: '',
			phone: '',
			code: '',
			inputEnough: false,
			inviteInfo: null
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let wxCode = this.props.navigation.getParam('wxCode')
		let tbCode = this.props.navigation.getParam('tbCode')
		let phone = this.props.navigation.getParam('phone')
		let code = this.props.navigation.getParam('code')

		dao.user.getInvitorCode().then(inviteCode => {
			if (inviteCode) {
				this.setState({
					inviteCode: inviteCode
				})
				this.getInviteInfoByCode(inviteCode)
			}
		})
		this.setState({
			wxCode: wxCode,
			tbCode: tbCode,
			phone: phone,
			code: phone
		})
	}

	// 普通注册登录追加邀请人邀请码
	static startMeWithoutCode(navigation, callback){
		navigation.navigate('InputInviteCode', {
			callback: callback
		})
	}

	// 携带微信授权码code
	static startMeWithWxCode(navigation, wxCode, phone, code, callback) {
		navigation.navigate('InputInviteCode', {
			wxCode: wxCode,
			phone: phone,
			code: code,
			callback: callback
		})
	}

	// 携带淘宝授权码code
	static startMeWithTbCode(navigation, tbCode, phone, code, callback){
		navigation.navigate('InputInviteCode', {
			tbCode: tbCode,
			phone: phone,
			code: code,
			callback: callback
		})
	}

	// 根据邀请码获取分享者信息
	getInviteInfoByCode = inviteCode => {
		if (inviteCode) {
			api.account.getUserInfoByCode(inviteCode).then(res => {
				this.hideLoading()
				if (1 === res.status) {
					this.setState({
						inviteInfo: res.data,
						inputEnough: true
					})
				} else {
					this.setState({
						inviteInfo: null,
						inputEnough: false
					})
				}
			})
		}
	}

	// 跳转到扫一扫动作
	scanAction = () => {
		QrScanPage.startMe(this.props.navigation, result => {
			if(result){
				this.getInviteInfoByCode(result)
			}
		})
	}

	// 完成最终的操作
	finishAction = () => {
		this.showLoading()
		if(this.state.wxCode){
			api.account.wxLogin(
				this.state.wxCode,
				this.state.inviteCode,
				this.state.phone,
				this.state.code
			).then(res => {
				this.finishCallback(res)
			})
		}else if(this.state.tbCode){
			api.account.taobaoLogin(
				this.state.tbCode,
				this.state.inviteCode,
				this.state.phone,
				this.state.code
			).then(res => {
				this.finishCallback(res)
			})
		}else {
			this.appendInviteCode(this.state.inviteCode)
		}
	}

	appendInviteCode = (inviteCode) => {
		api.account.appendInviteCode(inviteCode).then(res => {
			if(1 === res.status){
				EventManager.postInitAccount()
				this.showToast('登录成功')
				this.props.navigation.goBack()
				if (this.props.navigation.state.params.callback) {
					this.props.navigation.state.params.callback(res)
				}
			}
		})
	}

	finishCallback = res => {
		if(1 === res.status) {
			dao.user.setPhone(this.state.phone)
			dao.user.setToken(res.data.token)
			dao.user.setUserId(res.data.userId)
			EventManager.postInitAccount()
			this.showToast('登录成功')
			this.props.navigation.goBack()
			if (this.props.navigation.state.params.callback) {
				this.props.navigation.state.params.callback(res)
			}
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={{marginTop: getStatusBarHeight(), marginLeft: unitWidth * 20}}
					onPress={() => {
						this.props.navigation.goBack()
					}}
				>
					<Image
						style={{width: unitWidth * 48, height: unitWidth * 48}}
						source={Resources.black_back}
					/>
				</TouchableOpacity>
				<View style={{margin: unitWidth * 50}}>
					<Text style={styles.tip}>输入邀请信息</Text>
					<View style={[styles.item, styles.itemFirst]}>
						<TextInput
							style={styles.input}
							returnKeyType='go'
							placeholder='请输入邀请码'
							autoFocus={true}
							clearButtonMode='while-editing'
							numberOfLines={1}
							onChangeText={(text) => {
								this.state.inviteCode = text
								if (text.length >= 6) {
									this.getInviteInfoByCode(text)
								}
							}}
						/>
						<TouchableOpacity
							onPress={() => {
								this.scanAction()
							}}
						>
							<Image
								source={Resources.scan_normal}
								style={styles.iconRight}
							/>
						</TouchableOpacity>
					</View>
					{
						this.state.inviteInfo ?
							<View style={styles.inviteContainer}>
								<Image
									style={styles.invitorIcon}
									source={this.state.inviteInfo.avatar ? {uri: this.state.inviteInfo.avatar} : Resources.user_default_icon}
								/>
								<View>
									<Text style={styles.invitorNick}>木有昵称</Text>
									<Text style={styles.invitorTip}>邀请您加入易省App</Text>
								</View>
							</View> :
							<View/>
					}
					<TouchableOpacity
						onPress={() => {
							this.finishAction()
						}}
					>
						<Text
							style={[
								styles.submitBtn,
								this.state.inputEnough ? styles.submitEnable : ''
							]}
						>输入正确邀请码</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	tip: {
		color: '#333333',
		fontSize: fontscale * 30
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
	iconRight: {
		width: unitWidth * 40,
		height: unitWidth * 40
	},
	input: {
		flex: 1,
		marginLeft: unitWidth * 12,
		padding: unitWidth * 12
	},
	inviteContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: unitWidth * 30,
		backgroundColor: '#ffffff',
		borderRadius: unitWidth * 10,
		borderWidth: 1,
		borderColor: '#e1e1e1',
		marginTop: unitWidth * 30
	},
	invitorIcon: {
		width: unitWidth * 90,
		height: unitWidth * 90,
		borderRadius: unitWidth * 8,
		marginRight: unitWidth * 20
	},
	invitorNick: {
		color: '#333333',
		flex: 1,
		fontSize: fontscale * 16,
	},
	invitorTip: {
		flex: 1,
		color: '#999999',
		fontSize: fontscale * 14
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
