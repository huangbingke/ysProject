/**
  * desc：分类头部
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	FlatList,
	Text,
	Image,
	TouchableOpacity, View
} from 'react-native'
import { withNavigation } from 'react-navigation'
import {fontscale, unitWidth, width} from "../../../../utils/AdapterUtil";
import ProductListPage from "../../../product/ProductListPage";

class CateHeader extends React.Component {

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

	renderItem = (item, index, cellWidth) => {
		return (
			<TouchableOpacity
				style={{flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', padding: unitWidth * 20}}
				onPress={() => {
					ProductListPage.startMeByCateId(this.props.navigation, item.id, item.name)
				}}
				key={index}
			>
				<View style={{flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
					<Image
						source={{uri: item.pic}}
						style={{width: cellWidth - unitWidth * 30, aspectRatio: 1}}
					/>
					<Text style={{fontSize: fontscale * 12, color: '#333333', marginTop: unitWidth * 12}}>
						{item.name}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		let { cateList } = this.props
		const cols = 4
		const left = 20 * unitWidth
		const imageWH = (width - (cols + 1) * left) / cols - unitWidth * 20
		return (
			<FlatList
				data={cateList.slice(0, cols*2)}
				horizontal={false}
				numColumns={cols}
				style={styles.container}
				renderItem={({item, index}) => this.renderItem(item, index, imageWH)}
				keyExtractor={(item, index) => {
					return 'index' + index + item
				}}
			/>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1e1'
	}
})

export default withNavigation(CateHeader)
