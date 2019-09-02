/**
  * desc：分享视图，传递属性有：visible:是否展示，downloadFlag:是否展示下载图标
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Modal,
	FlatList,
	Image,
	Text,
	CameraRoll,
	TouchableOpacity, TouchableWithoutFeedback
} from 'react-native'
import { Toast } from "beeshell";
import Resources from "../assets/Resources";
import {fontscale, unitWidth, width} from "../utils/AdapterUtil";
import WechatManager from "../manager/WechatManager";

const left = 50 * unitWidth
export default class ShareView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			shareList: [
				{
					icon: Resources.wechat,
					title: '微信好友',
					value: 'wx_friend',
					enabled: true,
					action: (shareInfo) => {
						this.shareAction('wx_friend', shareInfo)
					}
				},
				{
					icon: Resources.wechat_friend_circle,
					title: '微信朋友圈',
					value: 'wx_moment',
					enabled: true,
					action: (shareInfo) => {
						this.shareAction('wx_moment', shareInfo)
					}
				},
				{
					icon: Resources.download,
					title: '下载到本地',
					value: 'download',
					enabled: true,
					action: (imageArray) => {
						this.downloadAction(imageArray)
					}
				}
			]
		}
		this.renderShareItem = this.renderShareItem.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
	}

	// 渲染分享item组件
	renderShareItem = (item, index, imageWH, imageArray, shareInfo, onCancel) => {
		{
			return item.enabled ? <TouchableOpacity
				style={styles.itemContainer}
				onPress={() => {
					if(onCancel){
						onCancel()
					}
					if('download' === item.value){
						item.action(imageArray)
					}else{
						item.action(shareInfo)
					}
				}}
			>
				<Image
					source={item.icon}
					style={{width: imageWH * 0.6, height: imageWH * 0.6, padding: unitWidth * 10}}
				/>
				<Text
					style={styles.itemText}
				>{item.title}</Text>
			</TouchableOpacity> : <View></View>
		}
	}

	// 下载到本地
	downloadAction = (imageArray) => {
		if(imageArray){
			imageArray.forEach(item => {
				CameraRoll.saveToCameraRoll(item, 'photo').then(res => {
					if(res){
						Toast.show('保存成功', '2000', 'bottom')
					}
				})
			})
		}
	}

	// 分享动作
	shareAction = (type, shareInfo) => {
		if(shareInfo) {
			switch (type) {
				case 'wx_friend':
					// 分享微信好友
					WechatManager.shareFriend(shareInfo.title, shareInfo.content,
						shareInfo.url, shareInfo.thumbImage)
					break
				case 'wx_moment':
					// 分享到微信朋友圈
					WechatManager.shareFriendCircle(shareInfo.title, shareInfo.content,
						shareInfo.url, shareInfo.thumbImage)
					break
				case 'sina':
					// 新浪微博
					break
			}
		}
	}

	render() {
		let {show, onCancel, showDownload, imageArray, shareInfo } = this.props
		let cols = this.state.shareList.length
		const imageWH = (width - (cols + 1) * left) / cols - unitWidth * 10
		this.state.shareList = this.state.shareList.map((item, index) => {
			return item.title === '下载到本地' ? {...item, enabled: showDownload} : item
		})
		return (
			<Modal
				style={styles.container}
				animationType='fade'
				transparent={true}
				visible={show}
			>
				<View style={{
					flex: 1,
					flexDirection: 'column-reverse',
				}}>
					<View
						style={{
							backgroundColor: '#FFFFFF',
							padding: unitWidth * 30
						}}
					>
						<FlatList
							horizontal={false}
							numColumns={cols}
							keyExtractor={(item, index) => {
								return 'index' + index + item
							}}
							data={this.state.shareList}
							renderItem={({item, index}) => this.renderShareItem(item, index, imageWH, imageArray, shareInfo, onCancel)}
						/>
						<TouchableOpacity
							style={{
								borderTopWidth: 1,
								borderTopColor: '#e1e1e1',
								marginTop: unitWidth * 8,
								marginBottom: unitWidth * 8
							}}
							onPress={() => {
								if (onCancel) {
									onCancel()
								}
							}}
						>
							<Text style={styles.cancel}>取消</Text>
						</TouchableOpacity>
					</View>
					<TouchableWithoutFeedback
						onPress={() => {
							if (onCancel) {
								onCancel()
							}
						}}
					>
						<View style={{
							backgroundColor: '#333333',
							opacity: 0.8,
							flex: 1
						}}/>
					</TouchableWithoutFeedback>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	cancel: {
		color: '#333333',
		backgroundColor: '#FFFFFF',
		padding: unitWidth * 50,
		textAlign: 'center'
	},
	itemContainer: {
		alignItems: 'center',
		flex: 1
	},
	itemText: {
		color: '#333333',
		fontSize: fontscale * 14,
		marginTop: unitWidth * 12
	}
})
