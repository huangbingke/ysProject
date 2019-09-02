/**
  * desc：自动测量的图片组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	Image,
} from 'react-native'
import {width, height} from "../utils/AdapterUtil";

export default class AutoMeasureImage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			path: '',
			width: 0,
			height: 0
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		let {src} = this.props
		Image.getSize(src, (w, h) => {
			this.setState({
				width: width,
				height: Math.floor(width*h/w)
			})
		})
	}

	render() {
		let {src} = this.props
		return (
			<Image
				source={{uri: src}}
				resizeMode='contain'
				style={{
					width: this.state.width,
					height: this.state.height
				}}
			/>
		)
	}
}

const styles = StyleSheet.create({})
