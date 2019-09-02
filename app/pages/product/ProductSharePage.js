/**
  * desc：产品分享
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	FlatList,
	Text,
	ActivityIndicator,
	ScrollView,
	takeSnapshot, Clipboard
} from 'react-native'
import BasePage from '../../pages/basic/BasePage'
import {fontscale, height, unitWidth, width} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import api from '../../api/index'
import MediaUtils from '../../utils/MediaUtils'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import ShareView from "../../components/ShareView";
import ShareImage from "./component/ShareImage";
import ShortLinkManager from "../../manager/ShortLinkManager";

export default class ProductSharePage extends BasePage {

	static navigationOptions = {
		headerTitle: '创建分享'
	}

	constructor(props) {
		super(props);
		this.state = {
			defaultShareContent: '',
			withoutYsShareContent: '',
			shareContent: '',
			productInfo: null,
			tbkPwd: '',
			checkYs: true,
			checkInviteCode: true,
			showShare: false,
			shareInfo: null,
			localShareUri: '',
			hideShareImg: false,
			checkImgArray: [],
			imageArray: [],
			shortLink: ''
		}
		this.renderIconItem = this.renderIconItem.bind(this)
	}

	static startMe(navigation, productInfo) {
		WxLoginPage.startMe(navigation, () => {
			navigation.navigate('ProductShare', {
				item: productInfo
			})
		})
	}

	componentWillMount() {
		let productInfo = this.props.navigation.getParam('item')
		this.setState({
			productInfo: productInfo,
			tbkPwd: productInfo.tbkPwd,
			checkImgArray: productInfo.smallImages.map((item) => {
				return false
			})
		})
		this.showLoading()

		api.resources.getSetting().then(res => {
			this.hideLoading()
			this.setState({
				defaultShareContent: res.data.defaultShareContent,
				withoutYsShareContent: res.data.withoutYsShareContent,
			})
			//获取短链接
			this.filterShareContent()
		})
	}

	takeShot = () => {
		takeSnapshot(this.refs.shareImg, {
			format: 'png',
			quality: 1
		}).then(uri => {
			this.setState({
				localShareUri: uri,
				hideShareImg: true,
				imageArray: this.state.imageArray.concat(uri),
				defaultShareContent: this.state.defaultShareContent.replace(/￥点击复制自动生成淘口令￥/g, this.state.productInfo.tbkPwd),
				withoutYsShareContent: this.state.withoutYsShareContent.replace(/￥点击复制自动生成淘口令￥/g, this.state.productInfo.tbkPwd)
			})
			this.filterShareContent()
		})
	}

	filterShareContent = () => {
		dao.user.getUserInfo().then(userInfo => {
			if (userInfo && userInfo.inviteCode) {
				let content = ''
				if (this.state.checkYs) {
					content = this.state.defaultShareContent
				} else {
					content = this.state.withoutYsShareContent
				}
				if (this.state.checkInviteCode) {
					let contentArray = content.split('复→制→')
					if (2 === contentArray.length) {
						content = contentArray[0] + '【注册邀请码】{InviteCode}\n【邀请链接】{InviteLink}\n————————————\n' + contentArray[1]
					}
				}
				if (this.state.shortLink) {
					this.setState({
						shareContent: content.replace(/{OldPrice}/g, this.state.productInfo.oldPrice)
							.replace(/{Price}/g, this.state.productInfo.price)
							.replace(/{Fee}/g, this.state.productInfo.fee)
							.replace(/{InviteCode}/g, userInfo.inviteCode)
							.replace(/{InviteLink}/g, this.state.shortLink)
					})
				} else {
					ShortLinkManager.generateInviteLink(this.state.productInfo).then(shortLink => {
						this.setState({
							shortLink: shortLink,
							shareInfo: {
								title: this.state.productInfo.title,
								content: '我在易省发现了一个不错的商品，快来看看，邀请好友还能赚现金哦！',
								url: shortLink,
								thumbImage: MediaUtils.listQuantityScalePress(this.state.productInfo.pictUrl)
							},
							shareContent: content.replace(/{OldPrice}/g, this.state.productInfo.oldPrice)
								.replace(/{Price}/g, this.state.productInfo.price)
								.replace(/{Fee}/g, this.state.productInfo.fee)
								.replace(/{InviteCode}/g, userInfo.inviteCode)
								.replace(/{InviteLink}/g, shortLink)
						})
					})
				}
			}
		})
	}

	// 渲染产品图标
	renderIconItem = (item, index, imageWH) => {
		return (
			<TouchableOpacity
				style={{position: 'relative', margin: unitWidth * 5}}
			>
				<Image
					source={{uri: MediaUtils.galleryQuantityScalePress(item)}}
					style={{width: imageWH, aspectRatio: 1}}
				/>
				<TouchableOpacity
					style={{position: 'absolute', top: unitWidth * 8, right: unitWidth * 8}}
					onPress={() => {
						this.setState({
							checkImgArray: this.state.checkImgArray.map((imgCheck, idx) => {
								return index === idx ? !imgCheck : imgCheck
							})
						})
					}}
				>
					<Image
						source={this.state.checkImgArray[index] ? Resources.share_img_check : Resources.share_img_no_check}
						style={{width: unitWidth * 30, height: unitWidth * 30}}
					/>
				</TouchableOpacity>
			</TouchableOpacity>
		)
	}

	// 复制分享内容
	copyTbkCode = () => {
		Clipboard.setString(this.state.tbkPwd)
		this.showToast('复制成功')
	}

	//创建淘口令
	// type：0==》复制淘口令，1==》打开分享视图
	createTbk = (type) => {
		if (this.state.productInfo.tbkPwd) {
			if (0 === type) {
				// 复制淘口令
				this.copyTbkCode()
			} else if (1 === type) {
				// 打开分享视图
				this.createShare()
			}
		} else {
			this.showLoading()
			let url = this.state.productInfo.couponShareUrl ? this.state.productInfo.couponShareUrl : this.state.productInfo.url
			if (!url.startsWith('http')) {
				url = 'https:' + url
			}
			if (!this.state.tbkPwd) {
				api.product.createTbkCode(
					this.state.productInfo.title,
					url,
					this.state.productInfo.pictUrl,
					this.state.productInfo.adzoneId,
					this.state.productInfo.itemId
				).then(res => {
					takeSnapshot(this.refs.shareImg, {
						format: 'png',
						quality: 1
					}).then((uri) => {
						this.hideLoading()
						this.setState({
							localShareUri: uri,
							hideShareImg: true,
							imageArray: this.state.imageArray.concat(uri),
							tbkPwd: res.data.model,
							productInfo: {...this.state.productInfo, tbkPwd: res.data.model},
							defaultShareContent: this.state.defaultShareContent.replace(/￥点击复制自动生成淘口令￥/g, res.data.model),
							withoutYsShareContent: this.state.withoutYsShareContent.replace(/￥点击复制自动生成淘口令￥/g, res.data.model)
						})
						if (0 === type) {
							// 复制淘口令
							this.copyTbkCode()
						} else if (1 === type) {
							// 打开分享视图
							this.createShare()
						}
					})
				})
			}
		}
	}

	// 复制分享内容
	copyShareContent = () => {
		Clipboard.setString(this.state.productInfo.title + '\n' + this.state.shareContent)
		this.showToast('复制成功')
	}

	// 创建分享
	createShare = () => {
		this.setState({
			showShare: true
		})
	}

	render() {
		const imageWH = (width / 2 - 3 * 20 * unitWidth) / 2
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container}>
					<View style={styles.ygContainer}>
						<Image
							source={Resources.money}
							style={{
								width: unitWidth * 30,
								height: unitWidth * 30
							}}
						/>
						<Text style={{
							color: '#FFFFFF',
							marginLeft: unitWidth * 10,
							fontSize: fontscale * 14,
						}}>
							奖励收益预估：¥{this.state.productInfo.fee}
						</Text>
					</View>
					<Text style={styles.title}>{this.state.productInfo.title}</Text>
					<Text style={styles.copyContent}>{
						this.state.shareContent
					}</Text>
					<View style={styles.checkContainer}>
						<TouchableOpacity
							onPress={() => {
								this.setState({
									checkYs: !this.state.checkYs
								})
								this.filterShareContent()
							}}
						>
							<View
								style={{flexDirection: 'row', alignItems: 'center', marginLeft: unitWidth * 15}}
							>
								{
									this.state.checkYs ? <Image
										style={{width: unitWidth * 35, height: unitWidth * 35}}
										resizeMode='contain'
										source={Resources.share_img_check}
									/> : <Image
										style={{width: unitWidth * 35, height: unitWidth * 35}}
										resizeMode='contain'
										source={Resources.share_img_no_check}
									/>
								}
								<Text style={{marginLeft: unitWidth * 15, color: '#333333'}}>显示收益</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								this.setState({
									checkInviteCode: !this.state.checkInviteCode
								})
								this.filterShareContent()
							}}
						>
							<View
								style={{flexDirection: 'row', alignItems: 'center', marginLeft: unitWidth * 15}}
							>
								{
									this.state.checkInviteCode ? <Image
										style={{width: unitWidth * 35, height: unitWidth * 35}}
										resizeMode='contain'
										source={Resources.share_img_check}
									/> : <Image
										style={{width: unitWidth * 35, height: unitWidth * 35}}
										resizeMode='contain'
										source={Resources.share_img_no_check}
									/>
								}
								<Text style={{marginLeft: unitWidth * 15, color: '#333333'}}>邀请码</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								this.createTbk(0)
							}}
						>
							<Text style={styles.onlyCopyPwd}>仅复制淘口令</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.iconContainer}>
						<View style={{flex: 1, position: 'relative'}}>
							<Image
								style={styles.icon}
								resizeMode="contain"
								source={{uri: this.state.localShareUri ? this.state.localShareUri : this.state.productInfo.pictUrl}}
							/>
							{
								this.state.localShareUri ? <View/> :
									<ActivityIndicator style={styles.iconLoading} size="small" color="#ff3328"/>
							}
						</View>
						<FlatList
							style={styles.iconList}
							horizontal={false}
							data={this.state.productInfo.smallImages}
							keyExtractor={(item, index) => {
								return 'index' + index + item
							}}
							numColumns={2}
							columnWrapperStyle={styles.wrapper}
							renderItem={({item, index}) => this.renderIconItem(item, index, imageWH)}
						/>
					</View>
					{
						this.state.hideShareImg ?
							<View/> :
							this.state.shortLink ?
								<ShareImage
									ref='shareImg'
									shortLink={this.state.shortLink}
									onLoadFinish={() => {
										this.takeShot()
									}}
									productInfo={this.state.productInfo}
								/> : <View/>
					}
				</ScrollView>
				<ShareView
					showDownload={true}
					show={this.state.showShare}
					shareInfo={this.state.shareInfo}
					imageArray={this.state.imageArray}
					onCancel={() => {
						this.setState({
							showShare: false
						})
					}}
				/>
				<View style={styles.bottomContainer}>
					<TouchableOpacity
						onPress={() => {
							this.copyShareContent()
						}}
						style={[styles.bottomItem, styles.copyItem]}>
						<Text style={{color: '#FFFFFF'}}>复制分享内容</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this.createTbk(1)
						}}
						style={[styles.bottomItem, styles.shareItem]}>
						<Text style={{color: '#FFFFFF'}}>立即分享</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	ygContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: unitWidth * 12,
		backgroundColor: '#ff3328',
	},
	title: {
		fontSize: fontscale * 16,
		color: '#333333',
		margin: unitWidth * 15
	},
	copyContent: {
		padding: unitWidth * 20,
		margin: unitWidth * 20,
		color: '#999999',
		fontSize: fontscale * 13
	},
	checkContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#e1e1e1',
		borderBottomWidth: unitWidth * 10,
		borderBottomColor: '#e1e1e1',
		padding: unitWidth * 10
	},
	onlyCopyPwd: {
		color: '#ff3328',
		backgroundColor: '#FFEAEA',
		borderRadius: unitWidth * 30,
		fontSize: fontscale * 14,
		overflow: 'hidden',
		padding: unitWidth * 10
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: unitWidth * 15,
		height: height * 0.5
	},
	icon: {
		flex: 1,
		width: '100%',
		height: width * 0.7,
		margin: unitWidth * 12,
		position: 'absolute',
		top: 0,
		left: 0
	},
	iconLoading: {
		position: 'absolute',
		top: '50%',
		left: '50%'
	},
	wrapper: {
		marginLeft: unitWidth * 15,
		marginTop: unitWidth * 15
	},
	iconList: {
		flex: 1,
		margin: unitWidth * 12
	},
	bottomContainer: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		flex: 1,
		flexDirection: 'row'
	},
	bottomItem: {
		flex: 1,
		color: '#FFFFFF',
		fontSize: fontscale * 15,
		padding: unitWidth * 25,
		margin: unitWidth * 15,
		borderRadius: unitWidth * 20,
		textAlign: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center'
	},
	copyItem: {
		backgroundColor: '#ffb642'
	},
	shareItem: {
		backgroundColor: '#ff5c62'
	}
});
