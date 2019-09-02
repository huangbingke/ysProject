/**
  * desc：淘宝订单列表
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	FlatList,
	Text,
	View,
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import api from '../../../api/index'
import RadioButton from './component/RadioButton'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";
import LoadMore from "../../../components/load_more/LoadMore";
import ScrollToTop from "../../../components/ScrollToTop";

export default class OrderListPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			refreshing: false,
			pageIndex: 1,
			tkStatus: 0,
			totalPrice: 0,
			totalPreFee: 0,
			total: 0,
			orderList: [],
			loadingMode: 'loading',
			filterList: [
				{
					title: '所有订单',
					status: 0,
					check: true
				},
				{
					title: '已付款',
					status: 12,
					check: false
				},
				{
					title: '已结算',
					status: 3,
					check: false
				},
				{
					title: '已失效',
					status: 13,
					check: false
				}
			]
		}
		this.renderOrderItem = this.renderOrderItem.bind(this)
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
		api.order.getTbOrderList(this.state.pageIndex, this.state.tkStatus, this.props.level).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (1 === this.state.pageIndex) {
					this.setState({
						refreshing: true
					})
					this.state.orderList = []
				}
				this.setState({
					total: res.data.total,
					totalPrice: res.data.totalPrice,
					totalPreFee: res.data.totalPreFee,
					orderList: this.state.orderList.concat(...res.data.list),
					loadingMode: res.data.list.length < 20 ? 'none' : 'loading'
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

	// 渲染订单item项
	renderOrderItem = (item, index) => {
		return (
			<View style={itemStyles.container} key={index}>
				<View style={itemStyles.orderNumContainer}>
					<Text style={[
						itemStyles.state,
						item.tkStatus === 3 ? itemStyles.stateSuccess : '',
						item.tkStatus === 12 || item.tkStatus === 14 ? itemStyles.statePayed : '',
						item.tkStatus === 13 ? itemStyles.stateFailed : ''
					]}>
						{
							item.tkStatus === 3 ? '已结算' : ''
						}
						{
							item.tkStatus === 12 || item.tkStatus === 14 ? '已付款' : ''
						}
						{
							item.tkStatus === 13 ? '已失效' : ''
						}
					</Text>
					<Text style={{color: '#666666'}}>
						订单编号：{item.tradeId}
					</Text>
				</View>
				<Text style={itemStyles.title} numberOfLines={2}>{item.itemTitle}</Text>
				<View style={itemStyles.bottomContainer}>
					<View style={itemStyles.bottomLeftContainer}>
						<Text style={itemStyles.txtPadding}>付款金额</Text>
						<Text style={[itemStyles.txtPadding, {color: '#000000'}]}>¥{item.alipayTotalPrice.toFixed(2)}</Text>
						<Text style={[itemStyles.txtPadding, {color: '#999999'}]}>{item.createTime} 创建</Text>
					</View>
					<View style={itemStyles.bottomRightContainer}>
						<Text style={itemStyles.txtPadding}>效果预估</Text>
						<Text style={[itemStyles.txtPadding, {color: '#ff3328'}]}>¥{item.preFee.toFixed(2)}</Text>
						<Text style={[itemStyles.txtPadding, {color: '#999999'}]}>
							{
								item.tkStatus === 3 ? '已结算' : ''
							}
							{
								item.tkStatus === 12 || item.tkStatus === 14 ? '已付款' : ''
							}
							{
								item.tkStatus === 13 ? '已失效' : ''
							}
						</Text>
					</View>
				</View>
			</View>
		)
	}

	// 点击订单类型动作-->切换订单类型
	clickTypeAction = (item, index) => {
		const statusList = [...this.state.filterList]
		this.setState({
			filterList: statusList.map((item, idx) => {
				return idx === index ? {...item, check: !item.check} : {...item, check: false}
			})
		})
		this.state.tkStatus = item.status
		this.loadData(true)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.filterHeader}>
					{
						this.state.filterList.map((item, index) => {
							return (
								<View style={styles.filterItem}>
									<RadioButton title={item.title} index={index} check={item.check} pressAction={(cIndex) => {
										this.clickTypeAction(item, cIndex)
									}}/>
								</View>
							)
						})
					}
				</View>
				<View style={styles.overViewContainer}>
					<View style={styles.overViewItem}>
						<Text style={styles.overViewHeader}>订单数</Text>
						<Text>{this.state.total}</Text>
					</View>
					<View style={styles.overViewItem}>
						<Text style={styles.overViewHeader}>付款金额</Text>
						<Text>¥{this.state.totalPrice}</Text>
					</View>
					<View style={styles.overViewItem}>
						<Text style={styles.overViewHeader}>效果预估</Text>
						<Text style={{color: '#ff3328'}}>¥{this.state.totalPreFee.toFixed(2)}</Text>
					</View>
				</View>
				<FlatList
					ref={orderList => this.orderList = orderList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					refreshing={this.state.refreshing}
					onRefresh={() => this.refresh}
					onEndReached={() => this.loadMore()}
					data={this.state.orderList}
					renderItem={({item, index}) => this.renderOrderItem(item, index)}
					ItemSeparatorComponent={() => <View style={{backgroundColor: '#f3f3f3', height: unitWidth * 20}}/>}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
				/>
				<ScrollToTop
					scrollAction={() => {
						this.orderList.scrollToIndex({
							animated: true,
							index: 0
						})
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	filterHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#f3f3f3',
		paddingTop: unitWidth * 30,
		paddingBottom: unitWidth * 30
	},
	filterItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	overViewContainer: {
		paddingTop: unitWidth * 15,
		paddingBottom: unitWidth * 15,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	overViewItem: {
		flex: 1,
		textAlign: 'center',
		alignItems: 'center'
	},
	overViewHeader: {
		color: '#333333',
		fontSize: fontscale * 15,
		marginBottom: unitWidth * 6
	},
})
const itemStyles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 12,
		marginTop: unitWidth * 12
	},
	orderNumContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	state: {
		color: '#FFFFFF',
		fontSize: fontscale * 14,
		padding: unitWidth * 8,
		marginTop: unitWidth * 8,
		marginBottom: unitWidth * 8
	},
	stateFailed: {
		backgroundColor: '#999999'
	},
	statePayed: {
		backgroundColor: '#3a58f0'
	},
	stateSuccess: {
		backgroundColor: '#56cc67'
	},
	orderNum: {
		color: '#666666',
		fontSize: fontscale * 14
	},
	title: {
		fontSize: fontscale * 15,
		color: '#333333',
		marginTop: unitWidth * 8,
		marginBottom: unitWidth * 12
	},
	bottomContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	txtPadding: {
		marginTop: unitWidth * 12,
	}
})
