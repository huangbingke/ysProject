/**
  * desc：大图浏览界面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	CameraRoll,
	StyleSheet,
	View
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import ImageViewer from 'react-native-image-zoom-viewer'
import {Toast} from "beeshell";

export default class PicBrowsePage extends BasePage {

	static navigationOptions = {
		headerTitle: '图片浏览'
	}

	constructor(props) {
		super(props)
		this.state = {
			imageArray: []
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	static startMe(navigation, imageArray, index){
		if(imageArray){
			navigation.navigate('PicBrowse', {
				imageArray: imageArray,
				index: index
			})
		}
	}

	render() {
		let imgArray = this.props.navigation.getParam('imageArray')
		imgArray = imgArray.map((item) => {
			return {
				url: item
			}
		})
		return (
			<View style={styles.container}>
				<ImageViewer
					imageUrls={imgArray}
					enableSwipeDown={true}
					enablePreload={true}
					menuContext={{ "saveToLocal": "保存到相册", "cancel": "取消" }}
					backgroundColor='white'
					onSave={url => {
						CameraRoll.saveToCameraRoll(url, 'photo').then(res => {
							if(res){
								Toast.show('保存成功', '2000', 'bottom')
							}
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
	}
})
