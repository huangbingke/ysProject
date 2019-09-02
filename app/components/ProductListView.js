/**
  * desc：产品列表组件-可切换展示模式
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	FlatList, TouchableOpacity, Image, Text
} from 'react-native'
import ProductCell from "./ProductListCell";
import {fontscale, unitWidth, width} from "../utils/AdapterUtil";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import MediaUtils from "../utils/MediaUtils";
import EmptyView from "./EmptyView";

export default class ProductListView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
		this.scrollToTop = this.scrollToTop.bind(this)
	}

	renderListItem = (item, index) => {
		return <ProductCell item={item} keyExtractor={(index) => index} index={index}/>
	}

	renderGridItem = (item, index, imageWH) => {
		return (
			<TouchableOpacity
				style={[itemGridStyle.container, {
					width: imageWH - unitWidth * 24,
					marginRight: index % 2 === 1 ? unitWidth * 12 : 0
				}]}
				onPress={() => {
					ProductDetailPage.pushMe(this.props.navigation, item)
				}}
			>
				<View style={[itemGridStyle.iconContainer, {width: imageWH, justifyContent: 'center'}]}>
					<Image
						source={{uri: MediaUtils.galleryQuantityScalePress(item.pictUrl)}}
						style={[itemGridStyle.icon, {width: imageWH - unitWidth * 12, height: imageWH - unitWidth * 12}]}
					/>
					{
						item.couponAmount ? <Text style={itemGridStyle.coupon}>{item.couponAmount}元券</Text> : <View/>
					}
				</View>
				<Text
					numberOfLines={2}
					style={[itemGridStyle.title, {width: imageWH - unitWidth * 12}]}>
					{item.shortTitle ? item.shortTitle : item.title}
				</Text>
				<View style={itemGridStyle.priceContainer}>
					<Text style={itemGridStyle.priceTarget}>¥</Text>
					<Text style={itemGridStyle.price}>{item.price}</Text>
					<Text style={itemGridStyle.oldPrice}>¥{item.oldPrice}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	scrollToTop(config) {
		this.refs.list.scrollToIndex(config)
	}

	render() {
		// mode有list、gallery
		const {mode} = this.props
		const props = {...this.props}
		delete props.renderItem
		const left = 20 * unitWidth
		const imageWH = (width - 3 * left) / 2
		return (
			<FlatList
				ref="list"
				{...props}
				style={{backgroundColor: mode === 'list' ? '#ffffff' : '#f2f2f2'}}
				key={mode === 'list' ? 'list' : 'gallery'}
				numColumns={mode === 'list' ? 1 : 2}
				ListEmptyComponent={() => <EmptyView/>}
				renderItem={({item, index}) => {
					if (mode === 'list') {
						return this.renderListItem(item, index)
					} else {
						return this.renderGridItem(item, index, imageWH)
					}
				}}
			/>
		)
	}
}

const itemGridStyle = StyleSheet.create({
	container: {
		padding: unitWidth * 12,
		flex: 1,
		backgroundColor: '#ffffff',
		marginBottom: unitWidth * 12,
		marginLeft: unitWidth * 12,
	},
	iconContainer: {
		position: 'relative'
	},
	icon: {},
	coupon: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		color: '#ffffff',
		fontSize: fontscale * 11,
		borderRadius: unitWidth * 20,
		overflow: 'hidden',
		backgroundColor: '#ff3328',
		paddingTop: unitWidth * 4,
		paddingBottom: unitWidth * 4,
		paddingLeft: unitWidth * 15,
		paddingRight: unitWidth * 15,
		borderBottomWidth: 1,
		borderColor: '#ffffff'
	},
	title: {
		color: '#333333',
		fontSize: fontscale * 14,
		marginTop: unitWidth * 20
	},
	priceContainer: {
		flexDirection: 'row',
		marginTop: unitWidth * 12,
		alignItems: 'baseline'
	},
	priceTarget: {
		color: '#ff3328',
		fontSize: fontscale * 10
	},
	price: {
		color: '#ff3328',
		fontSize: fontscale * 14,
	},
	oldPrice: {
		textDecorationLine: 'line-through',
		marginLeft: unitWidth * 12,
		color: '#999999',
		fontSize: fontscale * 12
	}
})
