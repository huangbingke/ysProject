/**
  * desc：店铺视图控件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
} from 'react-native'
import {fontscale, unitHeight, unitWidth, width} from "../../../utils/AdapterUtil";
import Resources from "../../../assets/Resources";

export default class ShopInfoView extends React.Component {

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
		let {sellerInfo} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.splider}/>
				<View style={styles.iconContainer}>
					<Image
						style={styles.shopIcon}
						source={{uri: sellerInfo.shopIcon}}
					/>
					<View>
						<Text style={styles.shopName}>{sellerInfo.shopName}</Text>
						<Image
							resizeMode='contain'
							source={Resources.s_tm}
							style={styles.titleTarget}
						/>
					</View>
				</View>
				<View style={styles.scoreContainer}>
					{
						sellerInfo.evaluates.map((item, index) => {
							return (
								<Text style={styles.scoreItem} key={index}>
									<Text>{item.title}</Text>
									<Text>{item.score}</Text>
									<Text style={{color: item.levelText==='高'?'#ff3328':'#666666'}}>{item.levelText}</Text>
								</Text>
							)
						})
					}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff'
	},
	splider: {
		height: unitWidth * 12,
		backgroundColor: '#f2f2f2'
	},
	iconContainer: {
		flexDirection: 'row',
		margin: unitWidth * 30
	},
	shopIcon: {
		width: width * 0.2,
		height: width * 0.2,
		borderRadius: unitWidth * 10
	},
	shopName: {
		color: '#000000',
		fontSize: fontscale * 15,
		marginLeft: unitWidth * 20
	},
	titleTarget: {
		width: unitWidth * 30,
		height: unitHeight * 30,
		marginLeft: unitWidth * 20,
		marginTop: unitWidth * 20
	},
	scoreContainer: {
		flexDirection: 'row',
		marginTop: unitWidth * 20,
		marginLeft: unitWidth * 30,
		marginBottom: unitWidth * 30
	},
	scoreItem: {
		flex: 1,
		color: '#666666',
		fontSize: fontscale * 14,
		justifyContent: 'center'
	}
})
