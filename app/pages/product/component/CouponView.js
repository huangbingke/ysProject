/**
  * desc：优惠券视图
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";

export default class CouponView extends React.Component {

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
		const {productInfo} = this.props
		return (
			<View style={styles.container}>
				<LinearGradient
					colors={["#ff8874", "#ff5a5a"]}
					start={{x: 0, y: 0}} end={{x: 1, y: 0}}
					style={styles.couponContainer}>
					<View style={styles.couponLeft}>
						<Text style={styles.couponValue}>{productInfo.couponAmount}元优惠券</Text>
						<View>
							<Text style={styles.couponTime}>使用时间：{productInfo.couponStartTime}-{productInfo.couponEndTime}</Text>
						</View>
					</View>
					<View style={styles.couponSpliterLine}/>
					<View style={styles.couponRight}>
						<Text style={styles.gain}>立即</Text>
						<Text style={styles.gain}>领券</Text>
					</View>
					<View style={styles.couponLeftCircle}/>
					<View style={styles.couponRightCircle}/>
				</LinearGradient>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff'
	},
	couponContainer: {
		width: '93%',
		marginBottom: unitWidth * 12,
		marginTop: unitWidth * 12,
		marginLeft: unitWidth * 20,
		marginRight: unitWidth * 20,
		position: 'relative',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: unitWidth * 144,
		borderRadius: unitWidth * 10
	},
	couponLeft: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	couponLeftCircle: {
		left: -unitWidth*14,
		position: 'absolute',
		transform: [{translateY: -unitWidth*14}],
		top: '50%',
		width: unitWidth * 28,
		height: unitWidth * 28,
		backgroundColor: '#ffffff',
		borderRadius: unitWidth * 28
	},
	couponValue: {
		color: '#fcf7e7',
		fontSize: fontscale * 25
	},
	couponTime: {
		color: '#fcf7e7',
		fontSize: fontscale * 12
	},
	couponSpliterLine: {
		position: 'absolute',
		top: '15%',
		right: '25%',
		width: 1,
		height: '70%',
		borderLeftWidth: 1,
		borderLeftColor: '#ffffff',
	},
	couponRight: {
		color: '#fcf7e7',
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: '25%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	couponRightCircle: {
		right: -unitWidth*14,
		position: 'absolute',
		transform: [{translateY: -unitWidth*14}],
		top: '50%',
		width: unitWidth * 28,
		height: unitWidth * 28,
		backgroundColor: '#ffffff',
		borderRadius: unitWidth * 28
	},
	gain: {
		color: '#fcf7e7',
		fontSize: fontscale * 14
	}
})
