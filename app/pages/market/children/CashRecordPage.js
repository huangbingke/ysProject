/**
  * desc：提现记录界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Text
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import api from '../../../api/index'
import LoadMore from "../../../components/load_more/LoadMore";
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";
import EmptyView from "../../../components/EmptyView";

export default class CashRecordPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			recordList: [],
			loadingMode: 'loading'
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

	// 加载数据
	loadData = (showLoading) => {
		if (showLoading) {
			this.showLoading()
		}
		api.market.getCashRecordList(this.state.pageIndex).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (1 === this.state.pageIndex) {
					this.state.recordList = []
				}
				this.setState({
					recordList: this.state.recordList.concat(...res.data.list),
					loadingMode: res.data.list.length < 20? 'none': 'loading'
				})
			} else {
				this.showToast(res.message)
			}
		})
	}

	// 加载更多
	loadMore = () => {
		this.state.pageIndex++
		this.loadData(false)
	}

	//渲染孩子组件
	renderRecordItem = (item, index) => {
		return (
			<View style={itemStyles.container}>
				<View style={itemStyles.itemLeft}>
					<Text style={itemStyles.leftTitle}>
						提现人：
						<Text style={itemStyles.leftValue}>{item.alipayName}</Text>
					</Text>
					<Text style={itemStyles.leftTitle}>
						支付宝：
						<Text style={itemStyles.leftValue}>{item.alipayAccount}</Text>
					</Text>
					<Text style={itemStyles.createTime}>{item.applyTime}</Text>
				</View>
				<View style={itemStyles.itemRight}>
					<Text style={itemStyles.amount}>¥{item.amount.toFixed(2)}</Text>
					<Text style={[itemStyles.status, item.withdrawStatus === 2 ? itemStyles.gain : itemStyles.inLoad]}>
						{item.withdrawStatus === 2 ? '已到账' : '提现中'}
					</Text>
				</View>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.recordList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					ListEmptyComponent={() => <EmptyView loading={this.state.loadingMode === 'loading'}/>}
					renderItem={({item, index}) => this.renderRecordItem(item, index)}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
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
const itemStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: unitWidth * 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1e1'
	},
	itemLeft: {},
	leftTitle: {
		color: '#000000',
		fontSize: fontscale * 15,
		fontWeight: 'bold',
		marginTop: unitWidth * 6,
		marginBottom: unitWidth * 6
	},
	leftValue: {
		fontSize: fontscale * 14,
		fontWeight: 'normal',
		color: '#333333'
	},
	createTime: {
		fontSize: fontscale * 13,
		color: '#999999'
	},
	itemRight: {},
	amount: {
		color: '#000000',
		fontSize: fontscale * 17,
		fontWeight: 'bold',
		flex: 1
	},
	status: {
		fontSize: fontscale * 13,
		flex: 1
	},
	gain: {
		color: '#00ff00'
	},
	inLoad: {
		color: '#ff3328'
	}
})
