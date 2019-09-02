/**
  * desc：自定义的GridView
  * author：zhenggl
  */
import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	Text,
	FlatList
} from 'react-native'

import {fontscale, unitWidth} from '../utils/AdapterUtil'
import ProductListPage from "../pages/product/ProductListPage";

// 拥有几个属性
// 整个gridview的宽度viewWidth,viewWidth，cols列数，数据集合data
const left = 20 * unitWidth

export default class CateGridView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
		this._renderItem = this._renderItem.bind(this)
	}

	_renderItem = (item, index, cellWidth, navigation, left) => {
		return (
			<TouchableOpacity
				style={{
					width: cellWidth,
					marginTop: left,
					marginLeft: left
				}}
				onPress={() => {
					ProductListPage.startMeByCateId(navigation, item.id, item.name)
				}}
				key={index}
			>
				<View style={styles.cellContainer}>
					<Image
						source={{uri: item.pic}}
						style={{width: cellWidth * 0.6, aspectRatio: 1, padding: unitWidth * 15}}
					/>
					<Text style={{
						fontSize: fontscale * 13,
						color: '#333333',
						marginTop: unitWidth * 6
					}}>
						{item.name}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const {data, viewWidth, cols, navigation} = this.props
		const imageWH = (viewWidth - (cols + 1) * left) / cols
		return (
			<FlatList
				horizontal={false}
				numColumns={cols}
				keyExtractor={(item, index) => {
					return 'index' + index + item
				}}
				data={data}
				renderItem={({item, index}) => this._renderItem(item, index, imageWH, navigation, left)}
			/>
		)
	}
}

const styles = StyleSheet.create({
	cellContainer: {
		margin: unitWidth * 12,
		flex: 1,
		padding: unitWidth * 8,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
