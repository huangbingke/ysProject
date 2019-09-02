/**
  * desc：底部关联商品视图
  * author：zhenggl
  * date： $
  */
import React from 'react'
import { withNavigation } from 'react-navigation'
import {
	StyleSheet,
	View,
	FlatList,
	Text,
	TouchableOpacity,
	Image
} from 'react-native'
import {fontscale, unitWidth, width} from "../../../utils/AdapterUtil";
import ProductDetailPage from "../ProductDetailPage";
import LoadMore from "../../../components/load_more/LoadMore";

class BottomRelateView extends React.Component {

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

	// 渲染底部item控件
	renderGridItem = (item, index, imageWH) => {
		return (
			<TouchableOpacity
				style={[itemStyle.container, {width: imageWH-unitWidth*24, marginRight: index%2===1?unitWidth*12:0}]}
				onPress={() => {
					ProductDetailPage.pushMe(this.props.navigation, item)
				}}
			>
				<View style={[itemStyle.iconContainer, {width: imageWH, justifyContent: 'center'}]}>
					<Image
						source={{uri: item.pictUrl}}
						style={[itemStyle.icon, {width: imageWH-unitWidth*12, height: imageWH-unitWidth*12}]}
					/>
					{
						item.couponAmount?<Text style={itemStyle.coupon}>{ item.couponAmount }元券</Text>:<View/>
					}
				</View>
				<Text
					numberOfLines={2}
					style={[itemStyle.title, {width: imageWH-unitWidth*12}]}>
					{item.shortTitle ? item.shortTitle : item.title}
				</Text>
				<View style={itemStyle.priceContainer}>
					<Text style={itemStyle.priceTarget}>¥</Text>
					<Text style={itemStyle.price}>{item.price.toFixed(2)}</Text>
					<Text style={itemStyle.oldPrice}>¥{item.oldPrice}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const left = 20 * unitWidth
		let { productList } = this.props
		const imageWH = (width - 3 * left) / 2
		return (
			<View style={styles.container}>
				<View style={styles.splider}/>
				<Text style={styles.header}>推荐商品</Text>
				<FlatList
					data={productList}
					horizontal={false}
					style={styles.productContainer}
					numColumns={2}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => this.renderGridItem(item, index, imageWH)}
					ListFooterComponent={<LoadMore mode="none"/>}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
	},
	splider: {
		height: unitWidth * 12,
		backgroundColor: '#f2f2f2'
	},
	header: {
		fontSize: fontscale * 14,
		fontWeight: 'bold',
		margin: unitWidth * 20
	},
	productContainer: {
		backgroundColor: '#f2f2f2'
	}
})

const itemStyle = StyleSheet.create({
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
	icon: {
	},
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

export default withNavigation(BottomRelateView)
