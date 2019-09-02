/**
  * desc：首页顶部组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	Image,
	Text,
	View,
	TouchableOpacity
} from 'react-native'
import {withNavigation} from 'react-navigation'
import {unitWidth, statusBarHeight, fontscale} from '../../utils/AdapterUtil'
import Resources from "../../assets/Resources"
import SearchPage from "../../pages/search/SearchPage";
import EventManager from "../../manager/EventManager";
import QrScanPage from "../../pages/app/QrScanPage";
import StringUtils from "../../utils/StringUtils";
import dao from "../../dao";
import RegisterPage from "../../pages/account/RegisterPage";
import WebPage from "../../pages/app/WebPage";

class IndexHeader extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	scanAction = () => {
		QrScanPage.startMe(this.props.navigation, (result) => {
			//扫描到内容了
			if(result){
				if(result.startsWith('http')){
					if(result.indexOf('ys.32wd.cn') > -1
						|| result.indexOf('m.32wd.cn') > -1){
						if(StringUtils.getParams('code', result)){
							dao.user.isLogin().then(token => {
								if(!token){
									// 还未登录，跳转到注册界面
									RegisterPage.startMe(this.props.navigation)
								}else{
									// 已经登录则忽略
								}
							})
						}else if(StringUtils.getParams('itemCode', result)){
							let itemCode = "￥" + StringUtils.getParams('itemCode', result) + "￥"
						}else {
							WebPage.startMe(this.props.navigation, '', result)
						}
					}else{
						WebPage.startMe(this.props.navigation, '', result)
					}
				}
			}
		})
	}

	render() {
		return (
			<View
				style={{backgroundColor: '#FFFFFF'}}
			>
				<View style={styles.container}>
					<TouchableOpacity
						style={{
							margin: unitWidth * 12,
							flex: 1
						}}
						onPress={() => {
							this.scanAction()
						}}
					>
						<Image
							style={styles.scanIcon}
							source={Resources.scan_normal}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							SearchPage.startMe(this.props.navigation)
						}}
					>
						<View style={styles.searchContainer}>
							<Image
								style={styles.searchIcon}
								source={Resources.search_index_mian}
							/>
							<Text style={{
								fontSize: fontscale * 14,
								color: '#999999'
							}}>粘贴宝贝标题，先领券再购买</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							margin: unitWidth * 12,
							flex: 1
						}}
						onPress={() => {
							EventManager.postEvent()
						}}
					>
						<Image
							style={styles.menuIcon}
							source={Resources.menu}
						/>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#f3f3f3',
		marginLeft: unitWidth * 12,
		marginRight: unitWidth * 12,
		marginTop: unitWidth * 12 + statusBarHeight,
		borderRadius: unitWidth * 10
	},
	scanIcon: {
		width: unitWidth * 50,
		height: unitWidth * 50
	},
	menuIcon: {
		width: unitWidth * 50,
		height: unitWidth * 50,
		alignSelf: 'flex-end'
	},
	searchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 10
	},
	searchIcon: {
		width: unitWidth * 40,
		height: unitWidth * 40
	}
})
export default withNavigation(IndexHeader)
