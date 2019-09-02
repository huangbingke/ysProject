/**
  * desc：关于我们
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'

export default class AboutUsPage extends BasePage {

	static navigationOptions = {
		headerTitle: '关于我们'
	}

	constructor(props) {
		super(props)
		this.state = {}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	static startMe(navigation){
		navigation.navigate('AboutUs')
	}

	render() {
		return (
			<View>

			</View>
		)
	}
}

const styles = StyleSheet.create({})
