/**
  * desc：扫一扫界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Animated,
	Text,
	Easing,
	TouchableOpacity, Image
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import {RNCamera} from 'react-native-camera'
import {getStatusBarHeight, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";

export default class QrScanPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			moveAnim: new Animated.Value(0),
			data: ''
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.startAnimation()
	}

	// 开始中间动画
	startAnimation = () => {
		this.state.moveAnim.setValue(0)
		Animated.timing(
			this.state.moveAnim,
			{
				toValue: -200,
				duration: 1000,
				easing: Easing.linear
			}
		).start(() => this.startAnimation())
	}

	onScanCode = (data, type) => {
		this.showToast(data)
		this.props.navigation.state.params.callback(data)
			this.props.navigation.goBack()
	}

	static startMe(navigation, callback) {
		navigation.navigate('QrScan', {
			callback: callback
		})
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<TouchableOpacity
					style={{marginTop: getStatusBarHeight(), marginLeft: unitWidth * 20}}
					onPress={() => {
						this.props.navigation.goBack()
					}}
				>
					<Image
						style={{width: unitWidth * 48, height: unitWidth * 48}}
						source={Resources.black_back}
					/>
				</TouchableOpacity>
				<View style={styles.container}>
					<RNCamera
						ref={camera => this.camera = camera}
						style={styles.preview}
						type={RNCamera.Constants.Type.back}
						onBarCodeRead={({data, type}) => this.onScanCode(data, type)}
					>
						<View style={styles.rectangleContainer}>
							<View style={styles.rectangle}/>
							<Animated.View
								style={[
									styles.border,
									{
										transform: [{translateY: this.state.moveAnim}]
									}
								]}
							/>
							<Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
						</View>
					</RNCamera>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	rectangleContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	rectangle: {
		height: 200,
		width: 200,
		borderWidth: 1,
		borderColor: '#e1e1e1',
		backgroundColor: 'transparent'
	},
	rectangleText: {
		flex: 0,
		color: '#fff',
		marginTop: 10
	},
	border: {
		flex: 0,
		width: 200,
		height: 2,
		backgroundColor: '#00FF00',
	}
})
