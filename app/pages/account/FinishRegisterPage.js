/**
  * desc：完成注册界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TextInput,
	Image,
	Text, TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, getStatusBarHeight, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import CountDown from "../../components/CountDown";
import api from '../../api/index'
import {Alert} from "beeshell";

export default class FinishRegisterPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			wxCode: '',
			inviteCode: '',
			randomCode: '',
			password: ''
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let phone = this.props.navigation.getParam('phone')
		let wxCode = this.props.navigation.getParam('wxCode')
		let inviteCode = this.props.navigation.getParam('inviteCode')
		this.setState({
			phone: phone,
			wxCode: wxCode,
			inviteCode: inviteCode
		})
		if (phone) {
			this.countDown.getRandomCode(phone, 1)
		}
	}

	static startMe(navigation, phone, wxCode, inviteCode) {
		navigation.navigate('FinishRegister', {
			phone: phone,
			wxCode: wxCode,
			inviteCode: inviteCode
		})
	}

	// 最终注册的动作
	registerAction = () => {
		if (this.state.inputEnough) {
			api.account.register({
				phone: this.state.phone,
				password: this.state.password,
				code: this.state.randomCode,
				invideCode: this.state.inviteCode,
				weixinCode: this.state.wxCode,
				taobaoCode: ''
			}).then((res => {
				if (1 === res.status) {
					this.showToast('注册成功')

				} else {
					Alert.alert('温馨提示', res.message, [
						{
							text: '我知道了'
						}
					],{cancelable: true})
				}
			}))
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
					<Text style={styles.tip}>请输入验证码和密码</Text>
					<View style={[styles.item, styles.itemFirst]}>
						<Image
							source={Resources.account}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							placeholder='请输入短信验证码'
							autoFocus={true}
							clearButtonMode='while-editing'
							numberOfLines={1}
							maxLength={11}
							onChangeText={(text) => {
								this.state.randomCode = text
								this.setState({
									randomCode: text,
									inputEnough: this.state.randomCode && this.state.password
								})
							}}
						/>
						<CountDown
							ref={countDown => this.countDown = countDown}
							type={1}
							phone={this.state.phone}
						/>
					</View>
					<View style={[styles.item, styles.itemSecond]}>
						<Image
							source={Resources.account}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							placeholder='请输入6-32位密码'
							clearButtonMode='while-editing'
							numberOfLines={1}
							maxLength={11}
							onChangeText={(text) => {
								this.state.password = text
								this.setState({
									password: text,
									inputEnough: this.state.randomCode && this.state.password
								})
							}}
						/>
					</View>
					<TouchableOpacity
						onPress={() => {
							this.registerAction()
						}}
					>
						<Text
							style={[
								styles.submitBtn,
								this.state.inputEnough ? styles.submitEnable : ''
							]}
						>下一步</Text>
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
