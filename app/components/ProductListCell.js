/**
  * desc：产品item统一组件
  * author：zhenggl
  * date： $
  */
import React, {Component} from 'react'
import {
	StyleSheet,
	View,
	TouchableHighlight,
	Image,
	Text,
	ImageBackground
} from 'react-native'
import {withNavigation} from 'react-navigation'
import {unitWidth, fontscale} from '../utils/AdapterUtil'
import Resources from '../assets/Resources'
import MediaUtils from '../utils/MediaUtils'
import ProductDetailPage from "../pages/product/ProductDetailPage";

class ProductListCell extends Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const {item} = this.props
		return (
			<TouchableHighlight onPress={() => {
				ProductDetailPage.startMe(this.props.navigation, item)
			}}>
				<View style={listStyles.container}>
					<Image
						style={listStyles.icon}
						source={{uri: MediaUtils.listQuantityScalePress(item.pictUrl)}}
					/>
					<View style={listStyles.right}>
						<Text style={listStyles.title} numberOfLines={2}>{item.title}</Text>
						<View style={listStyles.priceContainer}>
							<Text style={listStyles.priceTarget}>¥</Text>
							<Text style={listStyles.price}>{item.price}</Text>
							<Text style={listStyles.oldPrice}>
								天猫价
								¥{item.oldPrice}
							</Text>
						</View>
						<Text style={listStyles.saleNum}>销量{item.volumeStr}</Text>
						<View style={listStyles.bottomContainer}>
							<ImageBackground source={Resources.bg_coupon} style={listStyles.couponBg} resizeMode="contain">
								<Text style={listStyles.couponValue}>{item.couponAmount}</Text>
							</ImageBackground>
							<View style={listStyles.ygContainer}>
								<Text style={listStyles.ygEarn}>预估赚{item.fee}</Text>
								{
									item.upFee>0?
										<Text style={listStyles.upgradeEarn}>升级赚{item.upFee}</Text>:
										<Text/>
								}
							</View>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		)
	}
}

const listStyles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		marginRight: unitWidth * 8,
		width: '30%',
		aspectRatio: 1,
		margin: unitWidth * 8
	},
	right: {
		paddingTop: unitWidth * 8,
		marginLeft: unitWidth * 8,
		flex: 1,
		flexDirection: 'column',
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1e1'
	},
	title: {
		fontSize: fontscale * 15,
		color: '#333333',
		marginRight: unitWidth * 12,
		marginTop: unitWidth * 8
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: unitWidth * 12
	},
	priceTarget: {
		fontSize: fontscale * 14,
		color: '#ff3328',
	},
	price: {
		fontSize: fontscale * 18,
		color: '#ff3328'
	},
	oldPrice: {
		textDecorationLine: 'line-through',
		marginLeft: unitWidth * 12,
		color: '#999999',
		fontSize: fontscale * 14
	},
	saleNum: {
		fontSize: fontscale * 13,
		color: '#999999'
	},
	couponBg: {
		width: unitWidth * 97,
		height: unitWidth * 34,
		marginTop: unitWidth * 12,
	},
	couponValue: {
		color: '#FFFFFF',
		fontSize: fontscale * 12,
		textAlign: 'right',
		paddingRight: unitWidth * 12
	},
	bottomContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	ygContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: unitWidth * 12
	},
	ygEarn: {
		color: '#FF3328',
		fontSize: fontscale * 10,
		backgroundColor: '#FFEAEA',
		padding: unitWidth * 8,
		textAlign: 'center'
	},
	upgradeEarn: {
		color: '#FF3328',
		fontSize: fontscale * 10,
		backgroundColor: '#FFEAEA',
		marginLeft: unitWidth * 8,
		padding: unitWidth * 8,
		textAlign: 'center'
	}
})

export default withNavigation(ProductListCell)
