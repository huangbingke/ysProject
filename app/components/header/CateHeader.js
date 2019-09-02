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
import SearchPage from '../../pages/search/SearchPage'

class CateHeader extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {

	}

	render() {
		return (
			<View style={{backgroundColor: '#FFFFFF'}}>
				<TouchableOpacity
					style={styles.container}
					onPress={
						() => {
							SearchPage.startMe(this.props.navigation)
						}
					}>
					<View style={styles.searchContainer}>
						<TouchableOpacity>
							<Image
								style={styles.searchIcon}
								source={Resources.search_index_mian}
							/>
						</TouchableOpacity>
						<Text style={{
							marginLeft: unitWidth * 12,
							fontSize: fontscale * 14,
							color: '#999999'
						}}>粘贴宝贝标题，先领券再购买</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginTop: statusBarHeight,
		marginLeft: unitWidth * 8,
		marginRight: unitWidth * 8,
		borderRadius: unitWidth * 10
	},
	searchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#f3f3f3',
		margin: unitWidth * 12,
		padding: unitWidth * 18,
		alignItems: 'center',
		flex: 10
	},
	searchIcon: {
		width: unitWidth * 40,
		height: unitWidth * 40
	}
})

export default withNavigation(CateHeader)
