/**
  * desc：修改密码界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import WxLoginPage from "./WxLoginPage";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";

export default class ModifyPwdPage extends BasePage {

	static navigationOptions = {
		headerTitle: '修改密码'
	}

	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			oldPassword: '',
			newPassword: '',
			inputEnough: false
		}
	}

	static startMe(navigation){
		WxLoginPage.startMe(navigation,() => {
			navigation.navigate('ModifyPwd')
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{backgroundColor: '#FFFFFF'}}>
					<View style={styles.cellContainer}>
						<Image
							source={Resources.account}
							style={styles.cellIcon}
						/>
						<TextInput
							style={styles.cellInput}
							onChangeText={text => {
								this.setState({
									phone: text
								})
							}}
							clearButtonMode='while-editing'
							placeholder='请输入手机号'
							maxLength={11}
						/>
					</View>
					<View style={styles.cellContainer}>
						<Image
							source={Resources.account}
							style={styles.cellIcon}
						/>
						<TextInput
							style={styles.cellInput}
							onChangeText={text => {
								this.setState({
									phone: text
								})
							}}
							clearButtonMode='while-editing'
							placeholder='请输入手机号'
							maxLength={11}
						/>
					</View>
					<View style={styles.cellContainer}>
						<Image
							source={Resources.account}
							style={styles.cellIcon}
						/>
						<TextInput
							style={styles.cellInput}
							onChangeText={text => {
								this.setState({
									phone: text
								})
							}}
							clearButtonMode='while-editing'
							placeholder='请输入手机号'
							maxLength={11}
						/>
					</View>
					<TouchableOpacity>
						<Text
							style={[
								styles.submitBtn,

							]}
						>提交</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3',
		padding: unitWidth * 20
	},
	cellContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: unitWidth * 80,
		overflow: 'hidden',
		padding: unitWidth * 12,
		marginTop: unitWidth * 20,
		alignItems: 'center',
		alignContent: 'center'
	},
	cellIcon: {
		width: unitWidth * 40,
		height: unitWidth * 50,
		marginRight: unitWidth * 20,
		marginLeft: unitWidth * 20
	},
	cellInput: {
		fontSize: fontscale * 16,
		color: '#333333'
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
