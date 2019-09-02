/**
  * desc：绑定阿里账号界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import api from '../../api/index'
import CountDown from "../../components/CountDown";
import WebPage from "../app/WebPage";
import constant from "../../config/constant";

export default class BindAliAccountPage extends BasePage {

	static navigationOptions = {
		headerTitle: '绑定支付宝'
	}

	constructor(props) {
		super(props)
		this.state = {
			aliName: '',
			aliAccount: '',
			phone: '',
			randomCode: '',
			inputEnough: ''
		}
		this.bindAction = this.bindAction.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('BindAliAccount')
		})
	}

	//绑定支付宝账号信息
	bindAction = () => {
		if (this.state.inputEnough) {
			this.showLoading()
			api.account.bindAliAccount(this.state.aliName,
				this.state.aliAccount, this.state.randomCode).then(res => {
					this.hideLoading()
					if(1 === res.status){
						this.showToast(res.message)
						// 更新一下本地的支付宝账号相关
						this.props.navigation.goBack()
					}else{
						Alert.alert('温馨提示', res.message, [
							{
								text: '取消'
							},
							{
								text: '我知道了'
							}
						])
					}
			})
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.inputCell}>
					<Text style={styles.label}>姓名</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入姓名'
						clearButtonMode='while-editing'
						multiline={false}
						maxLength={6}
						onChangeText={text => this.setState({
							aliName: text,
							inputEnough: this.state.aliName && this.state.aliAccount && this.state.phone && this.state.randomCode
						})}
					/>
				</View>
				<View style={styles.inputCell}>
					<Text style={styles.label}>支付宝号</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入支付宝号'
						clearButtonMode='while-editing'
						multiline={false}
						onChangeText={text => this.setState({
							aliAccount: text,
							inputEnough: this.state.aliName && this.state.aliAccount && this.state.phone && this.state.randomCode
						})}
					/>
				</View>
				<View style={styles.inputCell}>
					<Text style={styles.label}>手机号码</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入号码'
						clearButtonMode='while-editing'
						multiline={false}
						maxLength={11}
						onChangeText={text => this.setState({
							phone: text,
							inputEnough: this.state.aliName && this.state.aliAccount && this.state.phone && this.state.randomCode
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
								inputEnough: this.state.aliName && this.state.aliAccount && this.state.phone && this.state.randomCode
							})
						}}
					/>
					<CountDown style={{flex: 1}} phone={this.state.phone} type={4} showBorder={true}/>
				</View>
				<TouchableOpacity
					onPress={() => {
						WebPage.startMe(this.props.navigation, '查看支付宝号', constant.mallUrlInfo.watchAliAccountUrl)
					}}
				>
					<Text style={styles.tip}>如何查看支付宝号？</Text>
				</TouchableOpacity>
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
	},
	tip: {
		color: '#666666',
		fontSize: fontscale * 13,
		margin: unitWidth * 30
	}
})
