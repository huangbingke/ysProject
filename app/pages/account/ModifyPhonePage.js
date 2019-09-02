/**
  * desc：修改手机号
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import api from '../../api/index'
import dao from "../../dao";
import WxLoginPage from "./WxLoginPage";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import CountDown from "../../components/CountDown";

export default class ModifyPhonePage extends BasePage {

	static navigationOptions = {
		headerTitle: '修改手机号'
	}

	constructor(props) {
		super(props)
		this.state = {
			oldCode: '',
			phone: '',
			randomCode: '',
			inputEnough: false
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.setState({
			oldCode: this.props.navigation.getParam('oldCode')
		})
	}

	static startMe(navigation, oldCode) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('ModifyPhone', {
				oldCode: oldCode
			})
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.inputCell}>
					<Text style={styles.label}>新手机号</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入新手机号'
						maxLength={11}
						clearButtonMode='while-editing'
						onChangeText={text => this.setState({
							phone: text
						})}
					/>
				</View>
				<View style={styles.randomContainer}>
					<Text style={styles.label}>短信验证码</Text>
					<TextInput
						style={{
							flex: 2
						}}
						clearButtonMode='while-editing'
						placeholder='请输入手机验证码'
						maxLength={6}
						onChange={text => {
							this.setState({
								randomCode: text,
								inputEnough: this.state.phone && this.state.randomCode
							})
						}}
					/>
					<CountDown style={{flex: 1}} phone={this.state.phone} type={4} showBorder={true}/>
				</View>
				<TouchableOpacity
					onPress={() => {
						if (this.state.inputEnough) {
							this.showLoading()
							api.account.modifyPhone(this.state.phone, this.state.oldCode, this.state.randomCode).then(res => {
								this.hideLoading()
								if(1 === res.status){
									this.showToast(res.message)
									this.props.navigation.goBack('ValidatePhone')
								}
							})
						}
					}}
				>
					<Text style={[
						styles.submitBtn,
						this.state.inputEnough ? styles.submitEnable : ''
					]}>确定绑定</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f3f3f3',
		flex: 1
	},
	inputCell: {
		backgroundColor: '#FFFFFF',
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
		backgroundColor: '#FFFFFF',
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
