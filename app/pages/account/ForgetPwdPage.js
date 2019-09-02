/**
  * desc：忘记密码界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import Resources from "../../assets/Resources";
import {fontscale, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import CountDown from "../../components/CountDown";
import api from '../../api/index'

export default class ForgetPwdPage extends BasePage {

	static navigationOptions = {
		headerTitle: '忘记密码'
	}

	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			randomCode: '',
			password: '',
			inputEnough: false
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	static startMe(navigation) {
		navigation.navigate('ForgetPwd')
	}

	// 执行重置密码操作
	resetPassword = () => {
		if(this.state.inputEnough){
			api.account.findPassword(this.state.phone, this.state.randomCode, this.state.password).then(res => {
				if(1 === res.status){

				}else{
					this.showToast(res.message)
				}
			})
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{backgroundColor: '#ffffff', padding: unitWidth * 20}}>
					<View style={[styles.item, styles.itemFirst]}>
						<Image
							source={Resources.account}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							placeholder='请输入手机号码'
							clearButtonMode='while-editing'
							maxLength={11}
							autoFocus={true}
							onChangeText={(text) => {
								this.setState({
									phone: text,
									inputEnough: 11 === this.state.phone.length && 6 === this.state.randomCode.length && this.state.password.length > 6
								})
							}}
						/>
					</View>
					<View style={[styles.item, styles.itemSecond]}>
						<Image
							source={Resources.random_code}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							maxLength={6}
							clearButtonMode='while-editing'
							placeholder='请输入短信验证码'
							onChangeText={(text) => {
								this.setState({
									randomCode: text,
									inputEnough: 11 === this.state.phone.length && 6 === this.state.randomCode.length && this.state.password.length > 6
								})
							}}
						/>
						<CountDown style={{flex: 1}} phone={this.state.phone} type={3} showBorder={false}/>
					</View>
					<View style={[styles.item, styles.itemSecond]}>
						<Image
							source={Resources.password}
							style={styles.iconLeft}
						/>
						<TextInput
							style={styles.input}
							returnKeyType='next'
							numberOfLines={1}
							clearButtonMode='while-editing'
							placeholder='请输入6-32位新密码'
							textContentType='password'
							onChangeText={(text) => {
								this.setState({
									password: text,
									inputEnough: 11 === this.state.phone.length && 6 === this.state.randomCode.length && this.state.password.length > 6
								})
							}}
						/>
					</View>
					<TouchableOpacity
						onPress={() => {
							this.resetPassword()
						}}
					>
						<Text
							style={[
								styles.submitBtn,
								this.state.inputEnough ? styles.submitEnable : ''
							]}
						>确定</Text>
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
		marginLeft: unitWidth * 30,
		marginRight: unitWidth * 30,
		marginTop: unitWidth * 60
	},
	submitEnable: {
		backgroundColor: '#FF3328'
	}
})
