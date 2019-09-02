/**
  * desc：分类菜单
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Modal,
	Image,
	Text,
	FlatList,
	TouchableOpacity, TouchableWithoutFeedback
} from 'react-native'
import {fontscale, unitWidth, width} from "../../../utils/AdapterUtil";
import ProductListPage from "../../product/ProductListPage";

export default class CateMenu extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	renderCateItem = (item, index, imageWH, left) => {
		return (
			<TouchableOpacity
				style={{
					width: imageWH,
					marginTop: left,
					marginLeft: left
				}}
				onPress={() => {
					ProductListPage.startMeByCateId(this.props.navigation, item.id, item.name)
					if(this.props.onCancel){
						this.props.onCancel()
					}
				}}
				key={index}
			>
				<View style={styles.cellContainer}>
					<Image
						source={{uri: item.pic}}
						style={{width: imageWH * 0.8, aspectRatio: 1, padding: unitWidth * 15}}
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
		let {categoryList, show, onCancel} = this.props
		if (categoryList[0] === '全部') {
			categoryList.shift()
		}
		const cols = 4
		const left = 50 * unitWidth
		const imageWH = (width - (cols + 1) * left) / cols - unitWidth * 10
		return (
			<Modal
				style={styles.container}
				animationType='fade'
				transparent={true}
				visible={show}
			>
				<View style={{
					flex: 1,
					flexDirection: 'column-reverse',
				}}>
					<View style={{backgroundColor: '#FFFFFF', padding: unitWidth * 20}}>
						<Text
							style={{
								color: '#333333',
								fontWeight: 'bold',
								margin: unitWidth * 20
							}}
						>请选择分类</Text>
						<FlatList
							data={categoryList}
							horizontal={false}
							numColumns={cols}
							keyExtractor={(item, index) => {
								return 'index' + index + item
							}}
							renderItem={({item, index}) => this.renderCateItem(item, index, imageWH, left)}
						/>
					</View>
					<TouchableWithoutFeedback
						onPress={() => {
							if (onCancel) {
								onCancel()
							}
						}}
					>
						<View style={{
							backgroundColor: '#333333',
							opacity: 0.8,
							flex: 1
						}}/>
					</TouchableWithoutFeedback>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	cellContainer: {
		margin: unitWidth * 12,
		flex: 1,
		padding: unitWidth * 8,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
