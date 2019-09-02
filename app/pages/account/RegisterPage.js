/**
  * desc：注册界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TextInput,
	Image,
	Text,
	TouchableOpacity,
	Alert
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, getStatusBarHeight, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import constant from "../../config/constant";
import WebPage from "../app/WebPage";
import FinishRegisterPage from "./FinishRegisterPage";
import api from '../../api/index'
import LoginPage from "./LoginPage";

export default class RegisterPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			wxCode: '',
			inviteCode: '',
			phone: '',
			inputEnough: false
		}
	}

	static startMe(navigation) {
		navigation.navigate('Register')
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let wxCode = this.props.navigation.getParam('wxCode')
		let inviteCode = this.props.navigation.getParam('inviteCode')
	}

	// 检查手机号是否已注册
	checkIsExist = () => {
		if (this.state.inputEnough) {
			this.showLoading()
			api.account.checkIfRegister(this.state.phone).then(res => {
				this.hideLoading()
				if (111 === res.status) {
					FinishRegisterPage.startMe(this.props.navigation,
						this.state.phone, this.state.wxCode, this.state.inviteCode)
				} else if (112 === res.status) {
					// 号码已经被注册了
					Alert.alert('温馨提示', '该手机号已被注册', [
						{
							text: '我知道了'
						},
						{
							text: '直接登录',
							onPress: () => {
								LoginPage.startMe(this.props.navigation, 'Home')
							}
						}
					])
				}
			})
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
					<Text style={styles.tip}>请输入手机号码</Text>
					<View style={[styles.item, styles.itemFirst]}>
						<Image
							source={Resources.account}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							placeholder='请输入手机号'
							autoFocus={true}
							clearButtonMode='while-editing'
							numberOfLines={1}
							maxLength={11}
							onChangeText={(text) => {
								this.state.phone = text
								this.setState({
									phone: text,
									inputEnough: text.length === 11
								})
							}}
						/>
					</View>
					<TouchableOpacity
						onPress={() => {
							if (this.state.inputEnough) {
								this.checkIsExist()
							}
						}}
					>
						<Text
							style={[
								styles.submitBtn,
								this.state.inputEnough ? styles.submitEnable : ''
							]}
						>下一步</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							marginTop: unitWidth * 30
						}}
						onPress={() => {
							WebPage.startMe(this.props.navigation, '易省App用户协议', constant.mallUrlInfo.userAgreement)
						}}
					>
						<Text style={{fontSize: fontscale * 14}}>注册代表您已同意
							<Text style={{color: '#ff3328'}}>《易省App用户协议》</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3'
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
	iconLeft: {
		width: unitWidth * 48,
		aspectRatio: 1
	},
	input: {
		flex: 1,
		marginLeft: unitWidth * 12,
		padding: unitWidth * 12
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
		marginTop: unitWidth * 60
	},
	submitEnable: {
		backgroundColor: '#FF3328'
	}
})
