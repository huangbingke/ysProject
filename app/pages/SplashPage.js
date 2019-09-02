/**
  * desc：闪屏页面
  * author：zhenggl
  * date： $
  */
import React, {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	InteractionManager
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

export default class SplashPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	static propTypes = {}

	/**
	 * 初始化了状态之后，在第一次绘制 render() 之前
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentWillMount() {

	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.timer = setTimeout(() => {
			InteractionManager.runAfterInteractions(() => {
				// SplashScreen.hide()
				this.props.navigation.replace('Home')
			})
		}, 500)

	}


	/**
	 * 组件要被从界面上移除的时候，就会调用 componentWillUnmount()
	 * （不能够使用setState()来改变属性 有且只有一次调用）
	 */
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer)
	}

	render() {
		return (
			<View>
				<Text>欢迎界面，你好吗</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({

});
