/**
  * desc：提现界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TextInput,
	Text,
	TouchableOpacity,
	Image
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import Resources from "../../assets/Resources";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import CountDown from "../../components/CountDown";
import api from '../../api/index'

export default class GetCashPage extends BasePage {

	static navigationOptions = {
		headerTitle: '提现'
	}

	constructor(props) {
		super(props)
		this.state = {
			trueName: '',
			aliAccount: '',
			phone: '',
			gainAmount: 0,
			amount: 0,
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
		let amount = this.props.navigation.getParam('amount')
		this.setState({
			amount: amount
		})
		dao.user.getUserInfo().then(userInfo => {
			if (userInfo) {
				this.setState({
					phone: userInfo.phone,
					trueName: userInfo.alipayName,
					aliAccount: userInfo.alipayAccount
				})
			}
		})
	}

	static startMe(navigation, amount, callback) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('GetCash', {
				amount: amount,
				callback: callback
			})
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.iconHeader}>
					<Image
						resizeMode='contain'
						style={{
							width: '35%'
						}}
						source={Resources.bind_hs_ali}
					/>
				</View>
				<View style={styles.inputCell}>
					<Text style={styles.label}>真实姓名</Text>
					<TextInput
						style={styles.input}
						value={this.state.trueName}
						placeholder='请输入真实姓名'
						clearButtonMode='while-editing'
						multiline={false}
						onChangeText={text => {
							this.setState({
								trueName: text,
								inputEnough: text && this.state.aliAccount && this.state.gainAmount && this.state.randomCode && 6 === this.state.randomCode.length
							})
						}}
					/>
				</View>
				<View style={styles.inputCell}>
					<Text style={styles.label}>到账支付宝</Text>
					<TextInput
						style={styles.input}
						value={this.state.aliAccount}
						placeholder='请输入支付宝号'
						clearButtonMode='while-editing'
						multiline={false}
						enabled={false}
						onChangeText={text => {
							this.setState({
								inputEnough: text && this.state.trueName && this.state.gainAmount && this.state.randomCode && 6 === this.state.randomCode.length
							})
						}}
					/>
				</View>
				<View style={styles.inputCell}>
					<Text style={styles.label}>提现金额</Text>
					<TextInput
						style={styles.input}
						value={this.state.gainAmount}
						placeholder='请输入提现金额'
						clearButtonMode='while-editing'
						multiline={false}
						enabled={false}
						onChangeText={text => {
							this.setState({
								inputEnough: text && this.state.aliAccount && this.state.trueName && this.state.randomCode && 6 === this.state.randomCode.length,
								gainAmount: text
							})
						}}
					/>
				</View>
				<View style={styles.cashTip}>
					<Text>可用余额¥{this.state.amount}</Text>
					<Text>最低提现金额为1元</Text>
				</View>
				<Text style={styles.warning}>*每月25号后可提现上个月内确认收货的订单收益</Text>
				<View style={styles.randomContainer}>
					<Text style={styles.label}>短信验证码</Text>
					<TextInput
						style={{
							flex: 2
						}}
						value={this.state.randomCode}
						clearButtonMode='while-editing'
						placeholder='请输入手机验证码'
						maxLength={6}
						onChangeText={text => {
							this.setState({
								randomCode: text,
								inputEnough: this.state.aliAccount && this.state.trueName && text && 6 === text.length,
							})
							this.state.randomCode = text
						}}
					/>
					<CountDown style={{flex: 1}} phone={this.state.phone} type={4} showBorder={true}/>
				</View>
				<TouchableOpacity
					onPress={() => {
						// 提交提现申请
						if(this.state.gainAmount < 1){
							this.showToast('提现金额至少为1块钱')
							return
						}
						if(this.state.gainAmount >= this.state.amount){
							this.showToast('提现金额不得超过可提金额')
							return
						}
						this.showLoading()
						if(this.state.inputEnough){
							api.market.getCash(this.state.gainAmount, this.state.randomCode).then(res => {
								this.hideLoading()
								this.showToast(res.message)
								if(1 === res.status){
									this.props.navigation.state.params.callback()
									this.props.navigation.goBack()
								}
							})
						}
					}}
				>
					<Text style={[
						styles.submitBtn,
						this.state.inputEnough ? styles.submitEnable : ''
					]}>提交申请</Text>
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
	iconHeader: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: unitWidth * 20
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
	cashTip: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: unitWidth * 25,
		fontSize: fontscale * 12,
		color: '#999999'
	},
	warning: {
		color: '#ff3328',
		fontSize: fontscale * 12,
		marginLeft: unitWidth * 25,
		marginTop: unitWidth * 40,
		marginBottom: unitWidth * 40
	},
	randomContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: unitWidth * 25,
		marginTop: unitWidth * 30
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
		margin: unitWidth * 30
	},
	submitEnable: {
		backgroundColor: '#FF3328'
	}
})
