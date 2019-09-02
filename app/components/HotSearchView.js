/**
  * desc：热门搜索词组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native'
import {fontscale, unitWidth} from "../utils/AdapterUtil";
import api from '../api/index'
import dao from "../dao";
import ProductListPage from "../pages/product/ProductListPage";
import { withNavigation } from 'react-navigation'

class HotSearchView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			hotList: [],
			colorArray: [
				'#F8E9EB',
				'#EAF7F7',
				'#F2F5EA'
			]
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		api.resources.getKeyList().then(res => {
			if (1 === res.status) {
				this.setState({
					hotList: res.data
				})
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.searchHeader}>热门搜索词</Text>
				<View style={styles.keyContainer}>
					{
						this.state.hotList.map((item, index) => {
							return (
								<TouchableOpacity
									onPress={() => {
										dao.history.addKey(item)
										ProductListPage.startMeByKey(this.props.navigation, item)
									}}
								>
									<Text
										style={[styles.keyItem, {backgroundColor: this.state.colorArray[index % this.state.colorArray.length]}]}>{item}</Text>
								</TouchableOpacity>
							)
						})
					}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		backgroundColor: '#ffffff',
		width: '100%',
		padding: unitWidth * 20
	},
	searchHeader: {
		color: '#000000',
		fontSize: fontscale * 15,
		fontWeight: 'bold'
	},
	keyContainer: {
		marginTop: unitWidth * 30,
		flexDirection: 'row',
		margin: unitWidth * 8,
		flexWrap: 'wrap'
	},
	keyItem: {
		borderRadius: unitWidth * 30,
		overflow: 'hidden',
		color: '#666666',
		paddingTop: unitWidth * 12,
		paddingBottom: unitWidth * 12,
		paddingLeft: unitWidth * 20,
		paddingRight: unitWidth * 20,
		marginRight: unitWidth * 20
	}
})
export default withNavigation(HotSearchView)
