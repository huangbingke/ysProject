/**
  * desc：加载更多组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Text
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {fontscale, unitWidth} from "../../utils/AdapterUtil";

export default class LoadMore extends BasePage {

	constructor(props) {
		super(props)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	render() {
		let { mode } = this.props //当前加载的模式：loading代表加载中，none代表没有更多数据
		return (
			<View style={styles.container}>
				{
					mode==='loading'?
						<ActivityIndicator size="small" color="#666666"/>:
						<View></View>
				}
				<Text style={styles.loadTxt}>
					{
						mode==='loading'?'加载中...':'- 没有更多的数据了 -'
					}
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: unitWidth * 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	loadTxt: {
		color: '#666666',
		fontSize: fontscale * 15,
		marginLeft: unitWidth * 12
	}
})
