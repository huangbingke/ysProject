/**
  * desc：产品列表
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native'

import BasePage from '../../pages/basic/BasePage'
import ProductCell from '../../components/ProductListCell'
import api from '../../api/index'
import {fontscale, unitWidth, width} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import FilterDialog from "./component/FilterDialog";
import ScrollToTop from "../../components/ScrollToTop";
import LoadMore from "../../components/load_more/LoadMore";
import ProductListView from "../../components/ProductListView";
import RootSiblings from 'react-native-root-siblings'

let filterDialog = null
export default class ProductListPage extends BasePage {

	static navigationOptions = ({navigation}) => {
		return {
			headerTitle: navigation.getParam('cateName') ? navigation.getParam('cateName') : navigation.getParam('key')
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			currentMode: 'list',
			sort: -1,
			startPrice: 0,
			endPrice: 0,
			showCoupon: false,
			pageIndex: 1,
			cateId: '',
			cateName: '',
			key: '',
			tbkCode: '',
			link: '',
			productList: [],
			showScrollTop: false,
			loadingMode: 'loading',
			refreshing: false
		}
		this.loadData = this.loadData.bind(this)
	}

	// 从分类这里跳转过来的
	static startMeByCateId(navigation, cateId, cateName) {
		navigation.navigate('ProductList', {
			cateId: cateId,
			cateName: cateName
		})
	}

	// 从搜索界面传递key过来的
	static startMeByKey(navigation, key) {
		navigation.navigate('ProductList', {
			key: key
		})
	}

	static startMeByCode(navigation, tbkCode) {
		navigation.navigate('ProductList', {
			tbkCode: tbkCode
		})
	}

	static startMeByLink(navigation, link) {
		navigation.navigate('ProductList', {
			link: link
		})
	}

	// 综合排序
	synthesisSort = () => {
		this.setState({
			sort: -1
		})
		this.loadData(true)
	}

	// 价格排序
	priceSort = filterSort => {
		this.setState({
			sort: this.state.sort === 9 ? 10 : 9
		})
		this.loadData(true)
	}

	// 销量排序
	saleSort = filterSort => {
		this.setState({
			sort: this.state.sort === 3 ? 4 : 3
		})
		this.loadData(true)
	}

	// 切换展示模式
	changeMode = () => {
		this.setState({
			currentMode: this.state.currentMode === 'list' ? 'gallery' : 'list'
		})
	}

	// 展示筛选视图
	showFilterDialog = () => {
		filterDialog = new RootSiblings(
			<FilterDialog
				show={true}
				onCancel={() => {
					filterDialog.destroy()
				}}
				onSure={(onlyTm, startPrice, endPrice) =>
					this.sureSelect(onlyTm, startPrice, endPrice)
				}
			/>
		)
	}

	sureSelect = (onlyTm, startPrice, endPrice) => {
		filterDialog && filterDialog.destroy()
		this.loadData(true)
	}

	componentWillMount() {
		debugger
		let cateId = this.props.navigation.getParam('cateId')
		let cateName = this.props.navigation.getParam('cateName')
		if (cateId && cateName) {
			this.state.cateId = cateId
			this.state.cateName = cateName
		}

		let key = this.props.navigation.getParam('key')
		if (key) {
			this.state.key = key
		}

		let tbkCode = this.props.navigation.getParam('tbkCode')
		if (tbkCode) {
			this.state.tbkCode = tbkCode
		}

		let link = this.props.navigation.getParam('link')
		if (link) {
			this.state.link = link
		}

		this.loadData(true)
	}

	loadData(showLoading) {
		if (showLoading) {
			this.state.pageIndex = 1
			this.showLoading()
		}
		api.product.getProductList(this.state.pageIndex, this.state.key, this.state.cateId, this.state.showCoupon, this.state.sort,
			this.state.startPrice, this.state.endPrice).then(res => {
			this.hideLoading()
			if (1 === this.state.pageIndex) {
				this.state.productList = []
			}
			let tempList = this.state.productList
			tempList = tempList.concat(...res.data)
			this.setState({
				productList: tempList,
				refreshing: false,
				loadingMode: res.data.length < 20 ? 'none' : 'loading'
			})
		})
	}

	refresh = () => {
		this.setState({
			pageIndex: 1,
			refreshing: true
		})
		this.loadData(false)
	}

	loadMore = () => {
		this.state.pageIndex++
		this.loadData(false)
	}

	onScrollChange = scrollY => {
		this.setState({
			showScrollTop: scrollY > width
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.filterContainer}>
					<TouchableOpacity
						onPress={() => {
							this.synthesisSort()
						}}
						style={styles.filterItem}
					>
						<Text style={this.state.sort === -1 ? styles.filterActive : ''}>综合</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterItem}
						onPress={() => {
							this.priceSort()
						}}
					>
						<Text style={this.state.sort === 9 || this.state.sort === 10 ? styles.filterActive : ''}>券后价</Text>
						<Image
							source={this.state.sort === 9 ? Resources.list_comp_top : (this.state.sort === 10 ? Resources.list_comp_bottom : Resources.list_comp_bottom_gray)}
							style={styles.filterIcon}
							resizeMode='contain'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterItem}
						onPress={() => {
							this.saleSort()
						}}
					>
						<Text style={this.state.sort === 3 || this.state.sort === 4 ? styles.filterActive : ''}>销量</Text>
						<Image
							source={this.state.sort === 3 ? Resources.list_comp_top : (this.state.sort === 4 ? Resources.list_comp_bottom : Resources.list_comp_bottom_gray)}
							style={styles.filterIcon}
							resizeMode='contain'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this.changeMode()
						}}
						style={styles.filterItem}>
						<Image
							source={this.state.currentMode === 'list' ? Resources.switch_double : Resources.switch_single}
							style={styles.filterIcon}
							resizeMode='contain'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterAction}
						onPress={() => {
							this.showFilterDialog()
						}}
					>
						<Text>筛选</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.couponContainer}>
					<Text style={{color: '#333333', fontSize: fontscale * 15}}>仅显示优惠券商品</Text>
					<TouchableOpacity
						onPress={() => {
							this.setState({
								showCoupon: !this.state.showCoupon
							})
							this.loadData(true)
						}}
					>
						<Image
							source={this.state.showCoupon ? Resources.show_coupon : Resources.hide_coupon}
							style={{width: unitWidth * 80, height: unitWidth * 48}}
						/>
					</TouchableOpacity>
				</View>
				<ProductListView
					data={this.state.productList}
					ref={list => this.list = list}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					navigation={this.props.navigation}
					mode={this.state.currentMode}
					style={styles.productList}
					refreshing={this.state.refreshing}
					onRefresh={() => this.refresh()}
					onEndReached={() => this.loadMore()}
					onScroll={(event) => this.onScrollChange(event.nativeEvent.contentOffset.y)}
					renderItem={({item, index}) => {
						return <ProductCell item={item} index={index} navigation={this.props.navigation}/>
					}}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
				/>
				{
					this.state.showScrollTop ? <ScrollToTop
						scrollAction={() => {
							this.setState({
								showScrollTop: false
							})
							this.list.scrollToTop({
								index: 0,
								animated: true
							})
						}}
					/> : <View/>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	couponContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		padding: unitWidth * 12,
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1e1',
		backgroundColor: '#FFFFFF'
	},
	filterContainer: {
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#FFFFFF',
		borderBottomColor: '#e1e1e1',
		borderBottomWidth: 1
	},
	filterItem: {
		flex: 1,
		fontSize: fontscale * 15,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	filterAction: {
		fontSize: fontscale * 15,
		padding: unitWidth * 12,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	filterActive: {
		color: '#ff3328'
	},
	filterIcon: {
		width: unitWidth * 40
	}
});
