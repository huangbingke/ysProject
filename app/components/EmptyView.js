/**
  * desc：列表空视图组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
} from 'react-native'
import Resources from "../assets/Resources";

export default class EmptyView extends React.Component {

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
		let {loading=true} = this.props
		return (
			<View style={styles.container}>
			<Image
				style={styles.image}
				resizeMode='contain'
				source={loading ? Resources.loading : Resources.nodata}
			/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: '50%'
	}
})
