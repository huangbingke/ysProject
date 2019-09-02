/**
  * desc：生成的分享视图组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
	ImageBackground
} from 'react-native'
import QRCode from "react-native-qrcode-svg";
import {fontscale, height, unitWidth, width} from "../../../utils/AdapterUtil";
import Resources from "../../../assets/Resources";
import MediaUtils from "../../../utils/MediaUtils";
import ShortLinkManager from "../../../manager/ShortLinkManager";

export default class ShareImage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {}

	render() {
		let {productInfo, onLoadFinish, shortLink} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<Image
						resizeMode='contain'
						style={styles.titleIcon}
						source={productInfo.shopType === 1 ? Resources.sheep_tmail_icon : Resources.sheep_taobao_icon}
					/>
					<Text
						style={styles.title}
						numberOfLines={2}
					>{productInfo.shortTitle ? productInfo.shortTitle : productInfo.title}</Text>
				</View>
				<View style={styles.couponContainer}>
					<Text style={styles.couponPrice}>券后价：¥{productInfo.fee}</Text>
					{
						productInfo.couponAmount ?
							<ImageBackground
								resizeMode='contain'
								style={{width: unitWidth * 83, height: unitWidth * 60, alignItems: 'center', justifyContent: 'center'}}
								source={Resources.share_quan}
							>
								<Text style={styles.couponAmount}>{productInfo.couponAmount}</Text>
							</ImageBackground> :
							<View/>
					}
				</View>
				<Text style={styles.oldPrice}>原价¥{productInfo.oldPrice}</Text>
				<Image
					source={{uri: MediaUtils.galleryQuantityScalePress(productInfo.pictUrl)}}
					style={{width: '100%', aspectRatio: 1}}
					onLoad={() => {
						if (onLoadFinish) {
							setTimeout(() => {
								onLoadFinish()
							}, 500)
						}
					}}
				/>
				<View style={styles.qrContainer}>
					<QRCode
						size={width * 0.25}
						value={shortLink}
						logo={Resources.ic_launcher}
					/>
					<View style={styles.iconContainer}>
						<Image
							source={Resources.ic_launcher}
							style={styles.icon}
						/>
						<Text style={styles.iconTip}>长按图片，扫描领取优惠券</Text>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 20,
		position: 'absolute',
		top: height,
		left: width
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	titleIcon: {
		width: unitWidth * 56,
		height: unitWidth * 26
	},
	title: {
		color: '#333333',
		fontSize: fontscale * 13
	},
	couponContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: unitWidth * 20
	},
	couponPrice: {
		color: '#ff3328',
		fontSize: fontscale * 15
	},
	couponAmount: {
		color: '#FFFFFF',
		fontSize: fontscale * 13,
		padding: unitWidth * 8
	},
	oldPrice: {
		color: '#999999',
		fontSize: fontscale * 14,
		textDecorationLine: 'line-through'
	},
	iconContainer: {
		padding: unitWidth * 20,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center'
	},
	qrContainer: {
		flexDirection: 'row-reverse',
		marginLeft: unitWidth * 20,
		marginRight: unitWidth * 10,
		marginBottom: unitWidth * 20,
		marginTop: unitWidth * 30
	},
	icon: {
		width: unitWidth * 80,
		height: unitWidth * 80
	},
	iconTip: {
		color: '#999999',
		borderTopWidth: 1,
		borderTopColor: '#e1e1e1',
		marginTop: unitWidth * 20,
		padding: unitWidth * 20
	}
})
