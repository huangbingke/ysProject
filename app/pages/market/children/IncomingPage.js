/**
  * desc：收入界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import api from '../../../api/index'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";
import LoadMore from "../../../components/load_more/LoadMore";
import EmptyView from "../../../components/EmptyView";

export default class IncomingPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			incomingList: [],
			loadingMode: 'loading',
			refreshing: false
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.loadData(true)
	}

	loadData = (showLoading) => {
		if (showLoading) {
			this.showLoading()
		}
		// this.setState({
		// 	refreshing: true
		// })
		api.market.getIncomingList(this.state.pageIndex).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (1 === this.state.pageIndex) {
					this.state.incomingList = []
				}
				this.setState({
					incomingList: this.state.incomingList.concat(...res.data.list),
					loadingMode: this.state.incomingList.length < 20 ? 'none' : 'loading'
				})
			}
			this.setState({
				refreshing: false
			})
		})
	}

	refresh = () => {
		this.state.pageIndex = 1
		this.loadData(false)
	}

	loadMore = () => {
		this.state.pageIndex++
		this.loadData(false)
	}

	renderIncoming = (item, index) => {
		return (
			<View style={itemStyle.container}>
				<View style={itemStyle.itemLeft}>
					<Text style={itemStyle.itemLeftTitle}>
						{
							1 === item.settleType ? '确认收货返现' : '维权扣款'
						}
					</Text>
					<Text>
						{item.createTime}
					</Text>
				</View>
				<Text style={[
					itemStyle.itemRight,
					1 === item.settleType ? itemStyle.itemRightAdd : itemStyle.itemRightMinus
				]}>
					{item.amount}
				</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.incomingList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					refreshing={this.state.refreshing}
					onRefresh={() => this.refresh()}
					onEndReached={() => this.loadMore()}
					renderItem={({item, index}) => this.renderIncoming(item, index)}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
					ListEmptyComponent={() => <EmptyView/>}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

const itemStyle = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#e1e1e1'
	},
	itemLeft: {},
	itemLeftTitle: {
		color: '#333333',
		fontSize: fontscale * 15,
		marginBottom: unitWidth * 8
	},
	itemRight: {
		fontSize: fontscale * 17
	},
	itemRightAdd: {
		color: '#56cc67'
	},
	itemRightMinus: {
		color: '#ff3a3d'
	}
})
