/**
  * desc：分类页面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	FlatList
} from 'react-native'
import {unitWidth, width} from '../../utils/AdapterUtil'
import BasePage from '../../pages/basic/BasePage'
import CateGridView from '../../components/CateGridView'
import api from '../../api/index'


// 分类信息界面
export default class CategoryPage extends BasePage {

	constructor(props) {
		super(props);
		this.state = {
			currentIndex: 0,
			leftCategoryList: [],
			rightCategoryList: []
		}
		this._renderLeftItem = this._renderLeftItem.bind(this)
	}

	componentWillMount() {
		api.resources.getCategoryList().then(res => {
			this.setState({
				leftCategoryList: res.data,
				rightCategoryList: res.data[0].childs
			})
		})
	}

	// 渲染左边的item
	_renderLeftItem = (item, index) => {
		return (
			<TouchableOpacity
				onPress={() => {
					this.setState({
						currentIndex: index,
						rightCategoryList: this.state.leftCategoryList[index].childs
					})
				}}>
				<View key={index} style={[
					styles.leftItem,
					this.state.currentIndex === index ? styles.active : ''
				]}>
					<View style={
						this.state.currentIndex === index ? styles.leftItemBlock : ''
					}/>
					<Text style={styles.leftItemTitle}>{item.name}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.leftContainer}>
					<FlatList
						data={this.state.leftCategoryList}
						keyExtractor={(item, index) => {
							return 'index' + index + item
						}}
						renderItem={({item, index}) => this._renderLeftItem(item, index)}
					/>
				</View>
				<View style={styles.rightContainer}>
					<CateGridView
						data={this.state.rightCategoryList}
						navigation={this.props.navigation}
						cols={3}
						viewWidth={width * 0.75}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	leftContainer: {
		flex: 1
	},
	leftItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: unitWidth * 12,
		backgroundColor: '#f3f3f3'
	},
	active: {
		backgroundColor: '#FFFFFF'
	},
	leftItemBlock: {
		width: 8 * unitWidth,
		height: '50%',
		backgroundColor: '#ff3328'
	},
	leftItemTitle: {
		margin: 12
	},
	rightContainer: {
		flex: 3,
	}
});
