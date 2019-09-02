/**
  * desc：单选按钮
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
} from 'react-native'
import {fontscale, unitWidth} from "../../../../utils/AdapterUtil";

export default class RadioButton extends React.Component {

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

	render() {
		let {title, index, check, pressAction} = this.props
		return (
			<TouchableOpacity
				onPress={() => {
					if (pressAction) {
						pressAction(index)
					}
				}}
			>
				<Text style={[styles.normal, check ? styles.active : '']}>{title}</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	normal: {
		fontSize: fontscale * 15,
		color: '#333333',
		padding: unitWidth * 18,
		backgroundColor: '#FFFFFF',
		borderRadius: unitWidth * 30,
		overflow: 'hidden'
	},
	active: {
		color: '#FF3328'
	}
})
