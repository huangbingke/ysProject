/**
  * desc：验证原本手机号
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import CountDown from "../../components/CountDown";
import WxLoginPage from "./WxLoginPage";
import dao from "../../dao";
import ModifyPhonePage from "./ModifyPhonePage";

export default class ValidatePhonePage extends BasePage {

	static navigationOptions = {
		headerTitle: '修改手机号'
	}

	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			randomCode: '',
			inputEnough: false
		}
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('ValidatePhone')
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.inputCell}>
					<Text style={styles.label}>原手机号</Text>
					<TextInput
						style={styles.input}
						placeholder='请输入手机号'
						clearButtonMode='while-editing'
						maxLength={11}
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
						placeholder='请输入手机验证码'
						clearButtonMode='while-editing'
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
						if(this.state.inputEnough){
							ModifyPhonePage.startMe(this.props.navigation)
						}
					}}
				>
					<Text style={[
						styles.submitBtn,
						this.state.inputEnough ? styles.submitEnable : ''
					]}>验证后绑定新手机</Text>
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
	},
})
