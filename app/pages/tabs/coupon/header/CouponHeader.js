/**
  * desc：优惠券搜索头
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	ImageBackground
} from 'react-native'
import {withNavigation} from 'react-navigation'
import Resources from "../../../../assets/Resources";
import {fontscale, height, statusBarHeight, unitWidth, width} from "../../../../utils/AdapterUtil";
import SearchPage from "../../../search/SearchPage";
import HotSearchView from "../../../../components/HotSearchView";
import WebPage from "../../../app/WebPage";

class CouponHeader extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			couponNum: 0
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.calculateCouponNum()
	}

	// 设置头部优惠券数量
	calculateCouponNum = () => {
		let startDate = new Date(2019, 1, 1)
		let leftDays = (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
		this.setState({
			couponNum: ((leftDays * 11 + 12541235) % 100000000).toFixed(0)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground
					resizeMode='cover'
					style={styles.imageBg}
					source={Resources.search_coupon_bg}
				>
					<View style={styles.couponHeader}>
						<Text style={styles.couponTitle}>淘宝/天猫优惠券</Text>
						<TouchableOpacity
							onPress={() => {
								WebPage.startMe(this.props.navigation, '搜券指南', 'http://ys.32wd.cn/html/faq/tb_search_guide.html')
							}}
							style={{
								position: 'absolute',
								right: unitWidth * 8
							}}
						>
						<Text style={styles.couponTip}>搜券指南</Text>
						</TouchableOpacity>
					</View>
					<Text style={styles.couponContainer}><Text style={styles.couponNum}>{this.state.couponNum}</Text>张隐藏优惠券</Text>
					<TouchableOpacity
						onPress={() => {
							SearchPage.startMe(this.props.navigation)
						}}
						style={styles.searchContainer}>
						<View style={styles.searchLeft}>
							<Image
								style={styles.searchIcon}
								source={Resources.search_index_mian}
							/>
							<Text style={styles.searchTip}>输入/粘贴淘宝商品标题搜隐藏券</Text>
						</View>
						<Text style={styles.searchRight}>搜索</Text>
					</TouchableOpacity>
					<Image
						source={Resources.search_tip}
						style={styles.searchPicTip}
						resizeMode='cover'
					/>
				</ImageBackground>
				<HotSearchView/>
				<Text style={styles.searchTitle}>好券推荐</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		backgroundColor: '#ffffff'
	},
	imageBg: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: height * 0.38
	},
	couponHeader: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: statusBarHeight,
		height: unitWidth * 60,
		flex: 1,
		width: '100%'
	},
	couponTitle: {
		color: '#ffffff',
		fontSize: fontscale * 15,
		position: 'relative'
	},
	couponTip: {
		color: '#ffffff',
		fontSize: fontscale * 14,
	},
	couponContainer: {
		fontSize: fontscale * 14,
		color: '#FFFFFF',
		paddingTop: unitWidth * 15
	},
	couponNum: {
		fontSize: fontscale * 30
	},
	searchContainer: {
		flexDirection: 'row',
		margin: unitWidth * 30,
		width: '90%',
		borderRadius: unitWidth * 50,
		overflow: 'hidden'
	},
	searchLeft: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 8,
		alignItems: 'center'
	},
	searchIcon: {
		width: unitWidth * 36,
		height: unitWidth * 36
	},
	searchTip: {
		fontSize: fontscale * 13,
		color: '#e2e2e2',
		marginLeft: unitWidth * 8
	},
	searchRight: {
		padding: unitWidth * 20,
		color: '#ff3328',
		fontSize: fontscale * 13,
		backgroundColor: '#ffe4c4'
	},
	searchPicTip: {
		width: '90%',
		height: width * 0.9 * 432 / 1074,
		backgroundColor: '#ffffff'
	},
	searchTitle: {
		color: '#000000',
		fontSize: fontscale * 15,
		backgroundColor: '#ffffff',
		fontWeight: 'bold',
		margin: unitWidth * 20,
		alignSelf: 'flex-start'
	}
})

export default withNavigation(CouponHeader)
