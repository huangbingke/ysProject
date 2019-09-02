/**
  * desc：团队成员列表
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../../pages/basic/BasePage.js'
import ScrollToTop from '../../../components/ScrollToTop'
import api from '../../../api/index'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";
import Resources from "../../../assets/Resources";
import LoadMore from "../../../components/load_more/LoadMore";
import dao from "../../../dao";

export default class TeamContentPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			teamList: [],
			refreshing: false,
			loadingMode: 'loading',
			invitorName: ''	// 引荐人
		}
		this.teamItemReader = this.teamItemReader.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.loadData(true)
		dao.user.getUserInfo().then(userInfo => {
			if (userInfo && userInfo.parent) {
				this.setState({
					invitorName: userInfo.parent.nickName
				})
			}
		})
	}

	loadData = (showLoading) => {
		if (showLoading) {
			this.showLoading()
		}
		this.setState({
			refreshing: true
		})
		api.market.getTeamList(this.state.pageIndex, this.props.level).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (1 === this.state.pageIndex) {
					this.state.teamList = []
				}
				this.setState({
					teamList: this.state.teamList.concat(...res.data.list).map((item, index) => {
						return {...item, check: index === 0}
					}),

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

	loadNext = () => {
		if (this.state.loadingMode === 'loading') {
			this.state.pageIndex++
			this.loadData(false)
		}
	}

	// 将好友給渲染出来
	teamItemReader = (item, index) => {
		return (
			<View style={itemStyle.container}>
				<TouchableOpacity
					onPress={() => {
						this.setState({
							teamList: this.state.teamList.map((item, idx) => {
								return index === idx ? {...item, check: !item.check} : item
							})
						})
					}}
				>
					<View style={itemStyle.headerContainer}>
						<View style={itemStyle.headerLeft}>
							<Image
								source={
									item.avatar ? {uri: item.avatar} : Resources.user_default_icon
								}
								style={{
									width: unitWidth * 70,
									height: unitWidth * 70,
									borderRadius: unitWidth * 35,
									marginRight: unitWidth * 12
								}}
							/>
							<View>
								<Text
									style={{
										fontSize: fontscale * 12,
										color: '#666666'
									}}
								>
									{item.phone}
									<Text
										style={{
											fontSize: fontscale * 11,
											color: '#ff3328',
											borderColor: '#ff3328',
											borderWidth: 1,
											borderRadius: unitWidth * 12,
											padding: unitWidth * 6
										}}
									>普通会员</Text>
								</Text>
								<Text style={{
									fontSize: fontscale * 12,
									marginTop: unitWidth * 12
								}}>{item.nickName}</Text>
							</View>
						</View>
						<View style={itemStyle.headerRight}>
							<View style={itemStyle.headerRightOne}>
								<Text style={itemStyle.totalTip}>今日我的预估奖励</Text>
								<Text style={itemStyle.totalPrice}>¥{item.todayPreFee.toFixed(2)}</Text>
							</View>
							<Image
								resizeMode='contain'
								style={itemStyle.headerRightTwo}
								source={item.check ? Resources.top_gray : Resources.down_gray}
							/>
						</View>
					</View>
				</TouchableOpacity>
				{
					item.check ? <View style={itemStyle.bodyContainer}>
						<View style={itemStyle.cellContainer}>
							<Text style={itemStyle.cellLeft}>今日预估</Text>
							<View style={itemStyle.cellRight}>
								<View>
									<Text style={itemStyle.cellRightHeader}>淘宝订单</Text>
									<Text style={itemStyle.cellRightNum}>{item.todayCount}</Text>
								</View>
								<View>
									<Text style={itemStyle.cellRightHeader}>我的预估奖励</Text>
									<Text style={itemStyle.cellRightPrice}>¥{item.todayPreFee.toFixed(2)}</Text>
								</View>
							</View>
						</View>
						<View style={itemStyle.cellContainer}>
							<Text style={itemStyle.cellLeft}>本月预估</Text>
							<View style={itemStyle.cellRight}>
								<View>
									<Text style={itemStyle.cellRightHeader}>淘宝订单</Text>
									<Text style={itemStyle.cellRightNum}>{item.thisMonthCount}</Text>
								</View>
								<View>
									<Text style={itemStyle.cellRightHeader}>我的预估奖励</Text>
									<Text style={itemStyle.cellRightPrice}>¥{item.thisMonthPreFee.toFixed(2)}</Text>
								</View>
							</View>
						</View>
						<View style={itemStyle.cellContainer}>
							<Text style={itemStyle.cellLeft}>上月预估</Text>
							<View style={itemStyle.cellRight}>
								<View>
									<Text style={itemStyle.cellRightHeader}>淘宝订单</Text>
									<Text style={itemStyle.cellRightNum}>{item.lastMonthCount}</Text>
								</View>
								<View>
									<Text style={itemStyle.cellRightHeader}>我的预估奖励</Text>
									<Text style={itemStyle.cellRightPrice}>¥{item.lastMonthPreFee.toFixed(2)}</Text>
								</View>
							</View>
						</View>
						<View style={itemStyle.cellContainer}>
							<Text style={itemStyle.cellLeft}>上月结算</Text>
							<View style={itemStyle.cellRight}>
								<View>
									<Text style={itemStyle.cellRightHeader}>淘宝订单</Text>
									<Text style={itemStyle.cellRightNum}>{item.lastMonthSettleCount}</Text>
								</View>
								<View>
									<Text style={itemStyle.cellRightHeader}>我的结算奖励</Text>
									<Text style={itemStyle.cellRightPrice}>¥{item.lastMonthSettleFee.toFixed(2)}</Text>
								</View>
							</View>
						</View>
					</View> : <View></View>
				}
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.tip}>
					<Image
						style={{
							width: unitWidth * 30,
							height: unitWidth * 30,
							marginLeft: unitWidth * 12
						}}
						resizeMode='cover'
						source={Resources.notice_knock}
					/>
					<Text style={{
						marginLeft: unitWidth * 12,
						fontSize: fontscale * 14,
						color: '#ff3328'
					}}>
						因计算有四舍五入，预估奖励与概况预估可能会存在0.01元的差距，实际结算以概况预估为准
					</Text>
				</View>
				<View style={{
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					alignContent: 'center',
					padding: unitWidth * 15
				}}><Text>共有粉丝<Text style={{color: '#ff3328'}}>{this.state.teamList.length}</Text>人</Text></View>
				<FlatList
					ref={(teamList) => this.teamList = teamList}
					refreshing={this.state.refreshing}
					data={this.state.teamList}
					onRefresh={() => this.refresh()}
					onEndReached={() => this.loadNext()}
					ItemSeparatorComponent={() => <View style={{height: unitWidth * 15, backgroundColor: '#f3f3f3'}}></View>}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => this.teamItemReader(item, index)}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
				/>
				{
					this.state.invitorName ?
						<Text style={{textAlign: 'center', padding: unitWidth * 12}}>
							我的引荐人：{ this.state.invitorName }
						</Text> :
						<View></View>
				}

				<ScrollToTop
					scrollAction={() => {
						// 执行滚动到顶部的操作
						this.teamList.scrollToItem({
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
	tip: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: '#ffd66b',
		padding: unitWidth * 12
	}
})

const itemStyle = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	headerContainer: {
		padding: unitWidth * 15,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	headerLeft: {
		flexDirection: 'row'
	},
	headerRight: {
		flexDirection: 'row'
	},
	headerRightOne: {
		marginRight: unitWidth * 12,
		fontSize: fontscale * 12,
	},
	totalTip: {
		color: '#999999'
	},
	totalPrice: {
		color: '#ff3328',
		alignSelf: 'flex-end',
		marginTop: unitWidth * 12
	},
	headerRightTwo: {
		width: unitWidth * 30,
		alignSelf: 'center'
	},
	bodyContainer: {},
	cellContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: unitWidth * 20,
	},
	cellLeft: {
		flex: 1
	},
	cellRight: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		color: '#999999'
	},
	cellRightOne: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cellRightTwo: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cellRightHeader: {
		color: '#999999',
		marginBottom: unitWidth * 6
	},
	cellRightNum: {
		color: '#999999',
		alignSelf: 'center'
	},
	cellRightPrice: {
		color: '#ff3328',
		alignSelf: 'center'
	}
})
