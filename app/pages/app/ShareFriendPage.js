/**
  * desc：分享好友界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	ImageBackground,
	Clipboard,
	takeSnapshot
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import dao from "../../dao";
import WxLoginPage from "../account/WxLoginPage";
import Resources from "../../assets/Resources";
import api from '../../api/index'
import PageScrollView from "../../components/PageScrollView";
import {unitWidth, width, height, fontscale} from "../../utils/AdapterUtil";
import QRCode from "react-native-qrcode-svg";
import ShareView from "../../components/ShareView";
import constant from "../../config/constant";
import ShortLinkManager from "../../manager/ShortLinkManager";

export default class ShareFriendPage extends BasePage {

	static navigationOptions = {
		headerTitle: '邀请好友'
	}

	constructor(props) {
		super(props)
		this.state = {
			currentIndex: 0,
			inviteCode: '',
			qrCodeLink: '',
			shareContent: '',
			showShare: false,
			uri: '',
			resourceList: [
				Resources.cover_1,
				Resources.cover_2,
				Resources.cover_3
			],
			imageArray: []
		}
		this.copyInviteCode = this.copyInviteCode.bind(this)
		this.shareMyPicture = this.shareMyPicture.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		dao.user.getUserInfo().then(userInfo => {
			this.setState({
				qrCodeLink: constant.mallUrlInfo.appShareUrl + '?code=' + userInfo.inviteCode,
				inviteCode: userInfo.inviteCode
			})
			api.account.getUserShareInfo(userInfo.inviteCode).then(res => {
				if (1 === res.status) {
					this.setState({
						shareContent: res.data,
					})
				}
			})
		})
	}

	static startMe(navigation) {
		WxLoginPage.startMe(navigation, () => {
			navigation.navigate('ShareFriend')
		})
	}

	// 复制邀请码
	copyInviteCode = () => {
		Clipboard.setString(this.state.shareContent)
		this.showToast('复制成功')
	}

	// 分享专属推广图片
	shareMyPicture = () => {
		takeSnapshot(this['view' + this.state.currentIndex], {
			format: 'png', quality: 1
		}).then(
			(uri) => {
				let tempArray = []
				tempArray.push(uri)
				this.setState({
					showShare: true,
					imageArray: tempArray,
					uri: uri,
				})
			}
		)
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<PageScrollView
					style={styles.container}
					infiniteInterval={10000}
					datas={this.state.resourceList}
					view={(i, data) => {
						return (
							<ImageBackground
								ref={view => {
									this['view' + i] = view
								}}
								style={styles.itemContainer}
								source={data}
							>
								<View
									style={styles.qrCode}
								>
									{
										this.state.qrCodeLink ?
											<QRCode
												size={width * 0.2}
												value={this.state.qrCodeLink}
											/> :
											<View></View>
									}
								</View>
								<Text
									style={{
										color: '#FFFFFF',
										marginBottom: unitWidth * 10,
										fontSize: fontscale * 17,
										textShadowOffset: {width: 1, height: 1},
										textShadowColor: '#e1e1e1',
										textShadowRadius: 3,
									}}
								>---邀请码---</Text>
								<Text
									style={{
										color: '#333333',
										marginBottom: unitWidth * 20,
										textShadowOffset: {width: 1, height: 1},
										textShadowColor: '#FFFFFF',
										textShadowRadius: 3,
										fontSize: fontscale * 17
									}}
								>{this.state.inviteCode}</Text>
							</ImageBackground>
						)
					}}
					ifShowPointerView={false}
					currentPageChangeFunc={(currentPage) => {
						this.setState({
							currentIndex: currentPage
						})
					}}
				/>
				<View style={styles.bottomContainer}>
					<TouchableOpacity
						style={{flex: 1}}
						onPress={() => {
							this.copyInviteCode()
						}}
					>
						<Text style={[
							styles.itemButton,
							styles.leftButton
						]}>复制邀请码</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{flex: 1}}
						onPress={() => {
							this.shareMyPicture()
						}}
					>
						<Text style={[
							styles.itemButton, styles.rightButton
						]}>分享专属海报</Text>
					</TouchableOpacity>
				</View>
				<ShareView
					show={this.state.showShare}
					showDownload={true}
					imageArray={this.state.imageArray}
					onCancel={() => {
						this.setState({
							showShare: false
						})
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: width,
		height: height,
	},
	itemContainer: {
		width: width,
		height: height*0.8,
		flexDirection: 'column-reverse',
		alignItems: 'center'
	},
	qrCode: {
		padding: unitWidth * 15,
		backgroundColor: '#FFFFFF',
		borderRadius: unitWidth * 10,
		marginBottom: unitWidth * 30
	},
	bottomContainer: {
		width: '100%',
		flexDirection: 'row',
		padding: unitWidth * 15,
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0
	},
	itemButton: {
		color: '#FFFFFF',
		padding: unitWidth * 20,
		margin: unitWidth * 15,
		fontSize: fontscale * 14,
		borderRadius: unitWidth * 10,
		overflow: 'hidden',
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	leftButton: {
		backgroundColor: '#ffa500'
	},
	rightButton: {
		backgroundColor: '#FF3328'
	}
})
