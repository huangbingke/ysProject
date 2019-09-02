/**
  * desc：单纯的Tab
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
import {withNavigation} from 'react-navigation'
import {getStatusBarHeight, unitHeight, unitWidth, width} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";

class Tab extends React.Component {

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
		let {tabs, currentIndex, onChangeTab, productIcon, shareClick, changingHeight} = this.props
		return (
			<View style={styles.container}>
				<View
					style={[styles.backgroundView, {opacity: Math.floor(changingHeight / width)}]}
				/>
				<View style={styles.headerContainer}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.goBack()
						}}
					>
						<Image
							source={Math.floor(changingHeight / width) >= 1 ? Resources.black_back : Resources.detail_back}
							style={styles.headerLeft}
						/>
					</TouchableOpacity>
					{
						Math.floor(changingHeight / width) >= 1 ? <Image
							source={{uri: productIcon}}
							style={styles.middleIcon}
						/> : <View/>
					}
					<TouchableOpacity
						onPress={() => {
							if (shareClick) {
								shareClick()
							}
						}}
					>
						<Image
							source={Math.floor(changingHeight / width) >= 1 ? Resources.share_white : Resources.share}
							style={styles.headerRight}
						/>
					</TouchableOpacity>
				</View>
				{
					Math.floor(changingHeight / width) >= 1 ? <View style={styles.tabContainer}>
						{
							tabs.map((item, index) => {
								return (
									<TouchableOpacity
										onPress={() => {
											if (onChangeTab) {
												onChangeTab(index)
											}
										}}
										style={styles.tabItem}>
										<Text style={[styles.tabTxt, {color: currentIndex === index ? '#ff3328' : '#333333'}]}>{item}</Text>
										<View style={currentIndex === index ? styles.underLine : ''}/>
									</TouchableOpacity>
								)
							})
						}
					</View> : <View/>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		left: 0,
		height: unitHeight * 305,
		paddingTop: getStatusBarHeight(),
		zIndex: 100
	},
	backgroundView: {
		backgroundColor: '#ffffff',
		position: 'absolute',
		width: '100%',
		left: 0,
		right: 0,
		paddingTop: getStatusBarHeight(),
		height: '100%',
	},
	headerContainer: {
		padding: unitWidth * 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerLeft: {
		width: unitWidth * 40,
		height: unitWidth * 40
	},
	middleIcon: {
		width: unitWidth * 60,
		height: unitWidth * 60,
		borderRadius: unitWidth * 10
	},
	headerRight: {
		width: unitWidth * 40,
		height: unitWidth * 40
	},
	tabContainer: {
		paddingTop: unitWidth * 10,
		paddingBottom: unitWidth * 10,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		borderTopWidth: 1,
		borderTopColor: '#f2f2f2'
	},
	tabItem: {
		position: 'relative',
		flex: 1,
	},
	tabTxt: {
		color: '#333333',
		textAlign: 'center',
		padding: unitWidth * 20
	},
	underLine: {
		position: 'absolute',
		bottom: 0,
		left: '42%',
		height: unitWidth * 4,
		backgroundColor: '#ff3328',
		width: unitWidth * 40,
	}
})

export default withNavigation(Tab)
