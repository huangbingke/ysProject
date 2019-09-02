/**
  * desc：关联推荐商品
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList
} from 'react-native'
import {fontscale, unitWidth, width} from "../../../utils/AdapterUtil";
import ProductDetailPage from "../ProductDetailPage";
import { withNavigation } from 'react-navigation'

class RelateProductView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	renderProduct = (item, index) => {
		return (
			<TouchableOpacity
				style={itemStyle.container}
				onPress={() => {
					ProductDetailPage.pushMe(this.props.navigation, item)
				}}
			>
				<View style={itemStyle.iconContainer}>
					<Image
						style={itemStyle.icon}
						source={{uri: item.pictUrl}}
					/>
					{
						item.couponAmount?<Text style={itemStyle.coupon}>{ item.couponAmount }元券</Text>:<View/>
					}
				</View>
				<Text
					numberOfLines={2}
					style={itemStyle.title}
				>{item.shortTitle ? item.shortTitle : item.title}</Text>
				<View style={itemStyle.priceContainer}>
					<Text style={itemStyle.priceTarget}>¥</Text>
					<Text style={itemStyle.price}>{item.price.toFixed(2)}</Text>
					<Text style={itemStyle.oldPrice}>{item.oldPrice}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		let {productList} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.splider}/>
				<Text style={styles.header}>相关推荐</Text>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={styles.listContainer}
					data={productList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => this.renderProduct(item, index)}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff'
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
	listContainer: {
		margin: unitWidth * 30
	}
})
const itemStyle = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
		width: width*0.25,
		marginRight: unitWidth * 30
	},
	iconContainer: {
		position: 'relative'
	},
	icon: {
		width: width * 0.25,
		height: width * 0.25,
		borderRadius: unitWidth * 10
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

export default withNavigation(RelateProductView)
