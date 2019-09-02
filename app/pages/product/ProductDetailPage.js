/**
  * desc：产品详情
  * author：zhenggl
  * date： 2019-04-12$
  */
import React, {Component} from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image,
	ImageBackground,
	TouchableOpacity,
	ScrollView,
	findNodeHandle,
	UIManager
} from 'react-native'
import BasePage from '../../pages/basic/BasePage'
import {fontscale, unitHeight, unitWidth, width} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import {WebView} from 'react-native-webview'
import LinearGradient from 'react-native-linear-gradient'
import ProductSharePage from "./ProductSharePage";
import api from '../../api/index'
import dao from "../../dao";
import PicBrowsePage from "../app/PicBrowsePage";
import ShareView from "../../components/ShareView";
import MediaUtils from "../../utils/MediaUtils";
import ScrollToTop from "../../components/ScrollToTop";
import ShortLinkManager from "../../manager/ShortLinkManager";
import RelateProductView from "./component/RelateProductView";
import ShopInfoView from "./component/ShopInfoView";
import DescView from "./component/DescView";
import UserImpressView from "./component/UserImpressView";
import BottomRelateView from "./component/BottomRelateView";
import ShopScoreView from "./component/ShopScoreView";
import Tab from "./Tab";
import UserBuyToast from "../../components/UserBuyToast";
import CouponView from "./component/CouponView";
import PageScrollView from "../../components/PageScrollView";
import WxLoginPage from "../account/WxLoginPage";

let userTimer = null
export default class ProductDetailPage extends BasePage {

	constructor(props) {
		super(props);
		this.state = {
			masterPicArray: [],
			productInfo: null,
			descList: [],
			relateProductList: [],
			shopInfo: null,
			swiperShow: false,
			showScrollTop: false,
			inCollection: false,
			scrollHeight: 0,
			descHeight: 0,
			relateHeight: 0,
			currentIndex: 0,	// 当前选中的下标
			showShare: false,		// 是否展示分享视图
			shareInfo: null,			// 分享的内容
			userIndex: 0
		}
	}

	static startMe(navigation, productInfo) {
		navigation.navigate('ProductDetail', {
			item: JSON.stringify(productInfo)
		})
	}

	// 允许同时有多个详情界面存在
	static pushMe(navigation, productInfo) {
		navigation.push('ProductDetail', {
			item: JSON.stringify(productInfo)
		})
	}

	static startMeWithItemId(navigation, itemId) {
		navigation.navigate('ProductDetail', {
			itemId: itemId
		})
	}

	static startMeWithTbkCode(navigation, tbkCode) {
		navigation.navigate('ProductDetail', {
			tbkCode: tbkCode
		})
	}

	componentWillMount() {
		const item = this.props.navigation.getParam('item')
		if (item) {
			let tempProduct = JSON.parse(item)
			if (!tempProduct.smallImages) {
				if(tempProduct.smallImages[0] !== tempProduct.pictUrl) {
					tempProduct.smallImages = [].concat(tempProduct.pictUrl)
				}
			} else {
				tempProduct.smallImages.unshift(tempProduct.pictUrl)
			}
			this.setState({
				masterPicArray: tempProduct.smallImages,
				productInfo: tempProduct
			})
			this.addToFootHistory(tempProduct.itemId)
			this.checkIfInCollection(tempProduct.itemId)
			this.getProductDetailByItemId(tempProduct.itemId)
			this.getRelateProduct(tempProduct.itemId)
			this.getVisualUser()
		}
	}

	componentWillUnmount() {
		userTimer && clearInterval(userTimer)
	}

	// 获取虚拟用户列表
	getVisualUser = () => {
		api.account.getVisualUserList().then(res => {
			if (1 === res.status) {
				this.state.userIndex = 0
				userTimer = setInterval(() => {
					let userInfo = res.data[this.state.userIndex]
					UserBuyToast.show(userInfo)
					this.state.userIndex = (this.state.userIndex + 1) % res.data.length
				}, 10000)
			}
		})
	}

	// 获取关联推荐商品
	getRelateProduct = itemId => {
		api.product.getRelateProduct(itemId).then(res => {
			if (1 === res.status) {
				this.setState({
					relateProductList: res.data
				})
				const relateHandle = findNodeHandle(this.refs.relateView)
				UIManager.measure(relateHandle, (x, y, width, height, pageX, pageY) => {
					this.setState({
						relateHeight: pageY
					})
				})
			}
		})
	}

	// 检查该产品是否已经被收藏了
	checkIfInCollection = itemId => {
		dao.user.isLogin().then(token => {
			if (token) {
				api.product.isProductInCollection(itemId).then(res => {
					if (1 === res.status) {
						this.setState({
							inCollection: res.data
						})
					}
				})
			}
		})
	}

	// 将商品添加到浏览足迹中
	addToFootHistory = itemId => {
		dao.user.isLogin().then(token => {
			if(token){
				api.product.addToFoot(itemId)
			}
		})
	}

	// 将商品添加到收藏夹中
	addToCollection = itemId => {
		dao.user.isLogin().then(token => {
			if(token){
				this.showLoading()
				this.addToCollectionAction(itemId)
			}else{
				WxLoginPage.startMe(this.props.navigation, () => {
					this.addToCollectionAction(itemId)
				})
			}
		})
	}

	addToCollectionAction = itemId => {
		api.product.addToCollection(itemId).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.showToast('收藏成功')
				this.setState({
					inCollection: true
				})
			} else {
				this.showToast(res.message)
			}
		})
	}

	// 将商品从收藏夹中取消收藏
	removeFromCollection = itemId => {
		this.showLoading()
		api.product.removeFromCollection(itemId).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				this.showToast('取消收藏成功')
				this.setState({
					inCollection: false
				})
			} else {
				this.showToast(res.message)
			}
		})
	}

	// 接收从H5传递过来的信息
	onGetMessage = (data) => {
		if (data) {
			let jsAction = JSON.parse(data)
			if ('getDesc' === jsAction.action) {
				let descArray = JSON.parse(jsAction.data)
				this.setState({
					descList: descArray
				})
			}
		}
	}

	// 滚动监听
	onScrollChange = scrollY => {
		this.setState({
			showScrollTop: scrollY >= width,
			scrollHeight: scrollY,
			currentIndex: scrollY >= this.state.relateHeight ? 2 : scrollY >= this.state.descHeight ? 1 : 0
		})
	}

	// 获取产品详情
	getProductDetailByItemId = itemId => {
		if (itemId) {
			this.showLoading()
			api.product.getProductDetail(itemId).then(res => {
				if (1 === res.status) {
					this.setState({
						productInfo: res.data,
						shopInfo: res.data.seller
					})
					const descHandle = findNodeHandle(this.refs.descView)
					UIManager.measure(descHandle, (x, y, width, height, pageX, pageY) => {
						this.setState({
							descHeight: pageY
						})
					})
				}
				this.hideLoading()
			})
		}
	}

	// 分享商品动作
	shareProduct = () => {
		this.showLoading()
		ShortLinkManager.generateProductShareLink(this.state.productInfo).then(shortLink => {
			this.hideLoading()
			this.setState({
				showShare: true,
				shareInfo: {
					title: this.state.productInfo.title,
					content: '我在易省发现了一个不错的商品，快来看看，邀请好友还能赚现金哦！',
					url: shortLink,
					thumbImage: MediaUtils.listQuantityScalePress(this.state.productInfo.pictUrl)
				}
			})
		})
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<ScrollView
					ref={scroller => this.scroller = scroller}
					scrollEventThrottle={200}
					onScroll={(event) => this.onScrollChange(event.nativeEvent.contentOffset.y)}
					style={styles.container}>
					<PageScrollView
						infiniteInterval={5000}
						style={{width: width, height: width}}
						datas={this.state.masterPicArray}
						view={(i, data) => {
							return <TouchableOpacity
								key={i}
								onPress={() => {
									PicBrowsePage.startMe(this.props.navigation, this.state.masterPicArray, i)
								}}
							>
								<Image
									source={{uri: MediaUtils.quantityPress(data)}}
									resizeMode='cover'
									style={{width: width, aspectRatio: 1}}/>
							</TouchableOpacity>
						}}
					/>
					<Text style={styles.title}>
						<Image
							resizeMode='contain'
							source={Resources.s_tm}
							style={styles.titleTarget}
						/>
						{this.state.productInfo.shortTitle ? this.state.productInfo.shortTitle : this.state.productInfo.title}
					</Text>
					<View style={styles.priceContainer}>
						<View style={styles.priceLeftContainer}>
							<Image
								resizeMode='contain'
								source={Resources.detail_coupon}
								style={styles.priceIcon}
							/>
							<Text style={styles.price}>¥{this.state.productInfo.price}</Text>
							<Text style={styles.oldPrice}>¥{this.state.productInfo.oldPrice}</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								if (this.state.inCollection) {
									this.removeFromCollection(this.state.productInfo.itemId)
								} else {
									this.addToCollection(this.state.productInfo.itemId)
								}
							}}
							style={styles.priceRightContainer}>
							<Image source={
								this.state.inCollection ? Resources.collection_press : Resources.collection_normal
							}/>
							{
								this.state.inCollection ?
									<Text style={{color: '#ff3328', fontSize: fontscale * 12}}>已收藏</Text> :
									<Text style={{color: '#666666', fontSize: fontscale * 12}}>收藏</Text>
							}
						</TouchableOpacity>
					</View>
					<View style={styles.saleContainer}>
						<Text>已售{this.state.productInfo.volumeStr}</Text>
						<View style={styles.ygContainer}>
							<Text style={styles.ygEarn}>预估赚{this.state.productInfo.fee}</Text>
							{
								this.state.productInfo.upFee > 0 ?
									<Text style={styles.upgradeEarn}>升级赚{this.state.productInfo.upFee}</Text> : <Text/>
							}
						</View>
					</View>
					{
						this.state.productInfo.appraisal ? <ShopScoreView appraisal={this.state.productInfo.appraisal}/> : <View/>
					}
					{
						this.state.productInfo.couponAmount > 0 ?
							<CouponView productInfo={this.state.productInfo}/> : <View/>
					}
					{
						this.state.shopInfo ? <ShopInfoView sellerInfo={this.state.shopInfo}/> : <View/>
					}
					{
						this.state.productInfo.tags ? <UserImpressView tagList={this.state.productInfo.tags}/> : <View/>
					}
					{
						this.state.relateProductList ? <RelateProductView productList={this.state.relateProductList}/> : <View/>
					}
					{
						this.state.descList ? <DescView ref="descView" descList={this.state.descList}/> : <View/>
					}
					<WebView
						source={{
							uri: 'http://test-ys.32wd.cn/html/product/desc.html?t=123475&itemId=' + this.state.productInfo.itemId,
							headers: {'Cache-Control': 'no-cache'}
						}}
						originWhitelist={['https://*', 'http://*']}
						style={{height: 0}}
						mixedContentMode='always'
						allowUniversalAccessFromFileURLs={true}
						onMessage={event => {
							this.onGetMessage(event.nativeEvent.data)
						}}
					/>
					{
						this.state.relateProductList ?
							<BottomRelateView ref="relateView" productList={this.state.relateProductList}/> : <View/>
					}
				</ScrollView>
				<Tab
					currentIndex={this.state.currentIndex}
					productIcon={this.state.productInfo.pictUrl}
					changingHeight={this.state.scrollHeight}
					tabs={['宝贝', '详情', '推荐']}
					onChangeTab={(index) => {
						this.setState({
							currentIndex: index
						})
						switch (index) {
							case 0:
								this.scroller.scrollTo({x: 0, y: 0, animated: true})
								break
							case 1:
								this.scroller.scrollTo({x: 0, y: this.state.descHeight, animated: true})
								break
							case 2:
								this.scroller.scrollTo({x: 0, y: this.state.relateHeight, animated: true})
								break
						}
					}}
					shareClick={() => {
						dao.user.isLogin().then(token => {
							if(token){
								this.shareProduct()
							}else{
								WxLoginPage.startMe(this.props.navigation, () => {
									this.shareProduct()
								})
							}
						})
					}}
				/>
				<View style={bottomStyles.container}>
					<TouchableOpacity
						style={bottomStyles.shareContainer}
						onPress={() => {
							ProductSharePage.startMe(this.props.navigation, this.state.productInfo)
						}}
					>
						<LinearGradient
							style={{
								flex: 1, flexDirection: 'row', justifyContent: 'center', height: unitWidth * 90,
								alignItems: 'center'
							}}
							colors={["#ffb642", "#fd9520"]}
							start={{x: 0, y: 0}} end={{x: 1, y: 0}}
						>
							<Image
								style={{width: unitWidth * 40, height: unitWidth * 40}}
								source={Resources.product_share}
							/>
							<Text
								style={{marginLeft: unitWidth * 12, fontSize: fontscale * 15, color: '#FFFFFF'}}
							>分享</Text>
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity
						style={bottomStyles.buyContainer}
					>
						<LinearGradient
							style={{
								flex: 1, flexDirection: 'row', justifyContent: 'center', height: unitWidth * 90,
								alignItems: 'center',
							}}
							colors={["#ff5c62", "#fe2a2c"]}
							start={{x: 0, y: 0}} end={{x: 1, y: 0}}
						>
							<Image
								style={{width: unitWidth * 40, height: unitWidth * 40}}
								source={Resources.get_coupon}
							/>
							<Text
								style={{marginLeft: unitWidth * 12, fontSize: fontscale * 15, color: '#FFFFFF'}}
							>领券</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
				<ShareView
					shareInfo={this.state.shareInfo}
					show={this.state.showShare}
					showDownload={false}
					onCancel={() => {
						this.setState({
							showShare: false
						})
					}}
				/>
				{
					this.state.showScrollTop ? <ScrollToTop
						scrollAction={() => {
							// 滚动到顶部
							this.scroller.scrollTo({x: 0, y: 0, animated: true})
							this.setState({
								showScrollTop: false
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
		width: '100%',
		marginBottom: unitWidth * 90,
	},
	banner: {
		width: '100%',
		height: 300
	},
	titleTarget: {
		width: unitWidth * 30,
		height: unitHeight * 30
	},
	title: {
		margin: unitWidth * 12,
		alignItems: 'flex-end',
		fontSize: fontscale * 17
	},
	priceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: unitWidth * 12,
		marginRight: unitWidth * 12
	},
	priceLeftContainer: {
		flexDirection: 'row'
	},
	priceRightContainer: {},
	priceIcon: {
		width: unitWidth * 80,
		height: unitHeight * 40
	},
	price: {
		fontSize: fontscale * 18,
		color: '#ff3328'
	},
	oldPrice: {
		textDecorationLine: 'line-through',
		marginLeft: unitWidth * 12,
		color: '#999999',
		fontSize: fontscale * 14
	},
	saleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: unitWidth * 12,
		marginRight: unitWidth * 12,
		marginTop: unitHeight * 12
	},
	ygContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	ygEarn: {
		color: '#FF3328',
		fontSize: fontscale * 10,
		backgroundColor: '#FFEAEA',
		padding: unitWidth * 8,
		textAlign: 'center'
	},
	upgradeEarn: {
		color: '#FF3328',
		fontSize: fontscale * 10,
		backgroundColor: '#FFEAEA',
		marginLeft: unitWidth * 8,
		padding: unitWidth * 8,
		textAlign: 'center'
	},
	destTitle: {
		color: '#333333',
		fontSize: fontscale * 14,
		marginTop: unitWidth * 20
	}
});
const bottomStyles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0
	},
	shareContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		height: unitWidth * 90,
		alignItems: 'center',
		color: '#FFFFFF'
	},
	buyContainer: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'center',
		height: unitWidth * 90,
		alignItems: 'center',
		color: '#FFFFFF'
	}
})
