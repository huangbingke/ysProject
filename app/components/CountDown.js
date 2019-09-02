/**
  * desc：倒计时组件
  * author：zhenggl
  * date： $
  */
/**
 * type的类型说明
 * 注册=1
 * 登录=2
 * 找回密码=3
 * 身份验证=4
 * */
import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Text
} from 'react-native'
import api from '../api/index'
import {fontscale, unitWidth} from "../utils/AdapterUtil";
import { Toast } from 'beeshell'
import { Loading } from "../components/loading"
let timer = ''
let leftTime = 60
import { debug } from '../config/index'

export default class CountDown extends React.Component {

	// 接收的属性有type，phone，showBorder
	constructor(props) {
		super(props)
		this.state = {
			normalTxt: '获取验证码',
			countDowning: false,
			showBorder: false
		}
		this.getRandomCode = this.getRandomCode.bind(this)
		this.startCountDown = this.startCountDown.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.setState({
			showBorder: this.props.showBorder
		})
	}

	// 获取短信验证码动作
	getRandomCode = (phone, type, checkFlag, callback) => {
		if(phone) {
			if(this.state.countDowning){
				return
			}
			Loading.show()
			if(callback){
				// 需要先检查手机号码是否已注册
				api.resources.checkIfRegister(phone).then(res => {
					if(callback){
						callback(112 === res.status)
					}
					this.sendCodeAction(phone, type)
				})
			}else{
				this.sendCodeAction(phone, type)
			}
		}else{
			Toast.show('请输入手机号码', '2000', 'bottom')
		}
	}

	sendCodeAction = (phone, type) => {
		api.resources.getRandomCode(phone, type).then(res => {
			Loading.hidden()
			if (1 === res.status) {
				Toast.show('发送成功', '2000', 'bottom')
				this.startCountDown()
				if(debug){
					Toast.show(res.data, '2000', 'top')
				}
			}
		})
	}

	// 开始自动倒计时动作
	startCountDown = () => {
		this.setState({
			countDowning: true
		})
		timer = setInterval(() => {
			leftTime = --leftTime
			let labelLeftTime
			if (leftTime < 10) {
				labelLeftTime = '0' + leftTime + 's后重试'
			} else {
				labelLeftTime = '' + leftTime + 's后重试'
			}
			this.setState({
				normalTxt: leftTime > 0 ? labelLeftTime : '获取验证码'
			})
			if (0 === leftTime) {
				clearInterval(timer)
				leftTime = 60
				this.setState({
					countDowning: false
				})
			}
		}, 1000)
	}

	render() {
		return (
			<TouchableOpacity
				onPress={() => {
					this.getRandomCode(this.props.phone, this.props.type, this.props.callback)
				}}
			>
				<Text style={[
					styles.container,
					this.state.showBorder ? styles.border : ''
				]}>{this.state.normalTxt}</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: unitWidth * 15,
		paddingRight: unitWidth * 15,
		paddingTop: unitWidth * 6,
		paddingBottom: unitWidth * 6,
		fontSize: fontscale * 11,
		color: '#666666'
	},
	border: {
		color: '#ff3328',
		borderRadius: unitWidth * 20,
		borderColor: '#ff3328',
		borderWidth: 1
	}
})
