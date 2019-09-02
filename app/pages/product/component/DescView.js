/**
  * desc：图文详情视图
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList, ScrollView
} from 'react-native'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";
import AutoMeasureImage from "../../../components/AutoMeasureImage";
import MediaUtils from "../../../utils/MediaUtils";

export default class DescView extends React.Component {

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

	// 渲染详情图片
	renderDescItem = (item, index) => {
		return (item ?
			<AutoMeasureImage
				key={index}
				src={MediaUtils.descQuantityPress(item)}
			/>:<View/>)
	}

	render() {
		let { descList } = this.props
		return (
			<View style={styles.container}>
				<View style={styles.splider}/>
				<Text style={styles.header}>图文详情</Text>
				<FlatList
					style={styles.destList}
					data={descList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => this.renderDescItem(item, index)}
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
	destList: {
		marginLeft: unitWidth * 12,
		marginRight: unitWidth * 12
	}
})
