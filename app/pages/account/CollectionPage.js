/**
  * desc：收藏界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Image,
	ImageBackground
} from 'react-native'
import Swipeout from 'react-native-swipeout'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import api from '../../api/index'
import {fontscale, unitHeight, unitWidth} from "../../utils/AdapterUtil";
import MediaUtils from "../../utils/MediaUtils";
import Resources from "../../assets/Resources";
import WxLoginPage from "./WxLoginPage";
import EditComponent from "./header_component/EditComponent";
import LoadMore from "../../components/load_more/LoadMore";
import ScrollToTop from "../../components/ScrollToTop";

export default class CollectionPage extends BasePage {

	static navigationOptions = ({navigation}) => {
		return {
			headerTitle: '我的收藏',
			headerRight: (<EditComponent onEditAction={(mode) => {
				navigation.state.params.navigationPress(mode)
			}}/>)
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			pageIndex: 1,
			mode: 'normal',// 代表当前组件处于何种模式：edit代表编辑，normal代表处于常态
			chooseAll: false,
			collectionList: [],
			loadingMode: 'loading'
		}
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation, () => {
			navigation.navigate('Collection')
		})
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.props.navigation.setParams({
			navigationPress: this.toggleMode
		})
		this.loadData(true)
	}

	toggleMode = (mode) => {
		this.setState({
			mode: mode
		})
	}

	loadData = (showLoading) => {
		if (showLoading) {
			this.showLoading()
		}
		api.account.getCollectionList(this.state.pageIndex).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (1 === this.state.pageIndex) {
					this.state.collectionList = []
				}
				this.setState({
					collectionList: this.state.collectionList.concat(...res.data.list).map((item, index) => {
						return {...item, check: false}
					}),
					loadingMode: res.data.list.length < 20 ? 'none' : 'loading'
				})
			}
		})
	}

	loadMore = () => {
		this.state.pageIndex++
		this.loadData(false)
	}

	//渲染收藏item
	renderCollectionItem = (item, index) => {
		return (
			<Swipeout
				autoClose={true}
				right={[{
					text: '删除',
					backgroundColor: '#ff3328',
					onPress: () => {
						api.product.removeFromCollection(item.itemId + '').then(res => {
							this.showToast(res.message)
							if (1 === res.status) {
								this.loadData(true)
							}
						})
					}
				}]}
			>
				<TouchableOpacity
					style={styles.itemStyle}
				>
					<View style={itemStyle.container}>
						<Image
							style={itemStyle.icon}
							source={{uri: MediaUtils.listQuantityScalePress(item.pictUrl)}}
						/>
						<View style={itemStyle.right}>
							<Text style={itemStyle.title} numberOfLines={2}>{item.title}</Text>
							<View style={itemStyle.priceContainer}>
								<Text style={itemStyle.priceTarget}>¥</Text>
								<Text style={itemStyle.price}>{item.price}</Text>
								<Text style={itemStyle.oldPrice}>
									天猫价
									¥{item.oldPrice}
								</Text>
							</View>
							<Text style={itemStyle.saleNum}>销量{item.volumeStr}</Text>
							<View style={itemStyle.bottomContainer}>
								<ImageBackground source={Resources.bg_coupon} style={itemStyle.couponBg}>
									<Text style={itemStyle.couponValue}>{item.couponAmount}</Text>
								</ImageBackground>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</Swipeout>
		)
	}

	renderDeleteAction = () => {
		return (
			<TouchableOpacity
				onPress={() => {
				}}
				style={{
					flex: 1,
					alignItems: 'flex-end',
					justifyContent: 'center',
					width: '100%',
					elevation: 5
				}}
			>
				<Text style={itemStyle.deleteContainer}>删除</Text>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					ref={collectionList => this.collectionList = collectionList}
					style={this.state.mode==='edit'?styles.collectList:''}
					data={this.state.collectionList}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
					renderItem={({item, index}) =>
						this.renderCollectionItem(item, index)
					}
					onEndReached={() => {
						this.loadMore()
					}}
				/>
				{
					this.state.mode === 'normal' ?
						<View style={bottomStyle.container}>
							<TouchableOpacity
								style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<Image
									source={this.state.chooseAll ? Resources.share_img_check : Resources.share_img_no_check}
									style={bottomStyle.checkIcon}
								/>
								<Text>全选</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									height: '100%',
									backgroundColor: '#ff3328',
									padding: unitWidth * 30,
									alignItems: 'center',
									color: '#FFFFFF',
								}}
								onPress={() => {

								}}
							>
								<Text style={bottomStyle.delete}>删除</Text>
							</TouchableOpacity>
						</View> : <View/>
				}
				<ScrollToTop
					scrollAction={() => {
						this.collectionList.scrollToIndex({
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
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	collectList: {
		marginBottom: unitHeight * 80
	}
})

const itemStyle = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		padding: 8,
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		flex: 1,
		marginRight: unitWidth * 8,
		aspectRatio: 1
	},
	right: {
		flex: 3
	},
	title: {
		fontSize: fontscale * 15,
		color: '#333333',
		paddingRight: unitWidth * 12
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: unitWidth * 12
	},
	priceTarget: {
		fontSize: fontscale * 14,
		color: '#ff3328',
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
	saleNum: {
		fontSize: fontscale * 13,
		color: '#999999'
	},
	couponBg: {
		width: unitWidth * 80,
		marginTop: unitWidth * 12,
	},
	couponValue: {
		color: '#FFFFFF',
		fontSize: fontscale * 13,
		textAlign: 'right',
		paddingRight: unitWidth * 12
	},
	deleteContainer: {
		color: '#FFFFFF',
		fontSize: fontscale * 14,
		padding: unitWidth * 12,
	}
})

const bottomStyle = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#FFFFFF',
		height: unitHeight * 80,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0
	},
	checkIcon: {
		width: unitWidth * 30,
		height: unitWidth * 30,
		marginLeft: unitWidth * 20,
		marginRight: unitWidth * 20
	},
	delete: {
		color: '#FFFFFF',
		padding: unitWidth * 12,
	}
})
