/**
  * desc：修改昵称界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TextInput,
	Text,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import api from '../../api/index'
import WxLoginPage from "./WxLoginPage";
import {fontscale, unitWidth} from "../../utils/AdapterUtil";

export default class ModifyNickPage extends BasePage {

	static navigationOptions = {
		headerTitle: '修改昵称'
	}

	constructor(props) {
		super(props)
		this.state = {
			nickName: ''
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
		WxLoginPage.startMe(navigation, () => {
			navigation.navigate('ModifyNick')
		})
	}

	//修改昵称
	modifyNickAction = newName => {
		if (!newName) {
			this.showToast('请输入用户昵称')
			return
		}
		this.showLoading()
		api.account.modifyNick(this.state.nickName).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.showToast('修改成功')
				dao.user.setNick(this.state.nickName)
				this.props.navigation.goBack()
			} else {
				this.showToast(res.message)
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput
					style={styles.input}
					placeholder='请输入用户昵称'
					clearButtonMode='while-editing'
					onChangeText={(text) => this.setState({nickName: text})}
				/>
				<TouchableOpacity
					style={{
						marginTop: unitWidth * 30
					}}
					onPress={() => {
						this.modifyNickAction(this.state.nickName)
					}}
				>
					<Text style={styles.text}>确定</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F3F3'
	},
	input: {
		padding: unitWidth * 20,
		marginTop: unitWidth * 20,
		backgroundColor: '#FFFFFF',
		color: '#333333',
		fontSize: fontscale * 14
	},
	text: {
		color: '#FFFFFF',
		fontSize: fontscale * 16,
		textAlign: 'center',
		backgroundColor: '#ff3328',
		padding: unitWidth * 20,
		borderRadius: unitWidth * 40,
		overflow: 'hidden',
		marginLeft: unitWidth * 20,
		marginRight: unitWidth * 20,
		marginTop: unitWidth * 30
	}
})
