/**
  * desc：解析淘口令展示的单个商品
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	Modal,
	TouchableOpacity,
	Text,
	Image,
	View,
	Clipboard
} from 'react-native'
import {fontscale, unitWidth} from "../../utils/AdapterUtil";
import Resources from "../../assets/Resources";
import MediaUtils from "../../utils/MediaUtils";
import RootSiblings from 'react-native-root-siblings'

let dialog = null
export default class SingleProductDialog extends React.Component {

	constructor(props) {
		super(props)
	}

	static show = (navigation, productInfo, callback) => {
		dialog = new RootSiblings(
			<Modal
				animationType='fade'
				transparent={true}
				visible={true}
			>
				<View style={styles.container}>
					<TouchableOpacity
						onPress={() => {
							this.hide()
						}}
						style={{
							backgroundColor: '#333333',
							opacity: 0.8,
							flex: 1,
							position: 'absolute',
							width: '100%',
							height: '100%'
						}}
					/>
					<View style={styles.bodyContainer}>
						<TouchableOpacity
							style={{
								position: 'absolute',
								top: unitWidth * 20,
								right: unitWidth * 20
							}}
							onPress={() => {
								this.hide()
							}}
						>
							<Image
								source={Resources.close}
								style={styles.closeIcon}
							/>
						</TouchableOpacity>
						<Text style={styles.headerTitle}>您可能想买</Text>
						<Image
							source={{uri: MediaUtils.listQuantityScalePress(productInfo.pictUrl)}}
							style={styles.icon}
						/>
						<Text style={styles.productTitle} numberOfLines={1}>{productInfo.title}</Text>
						<Text style={styles.buyTip}>立即抢购</Text>
						<View style={styles.priceContainer}>
							<Text style={styles.priceTip}>折扣价</Text>
							<Text style={styles.priceValue}>¥{productInfo.price}</Text>
						</View>
						<View style={styles.bottomContainer}>
							<TouchableOpacity
								style={styles.bottomLeft}
								onPress={() => {
									this.hide()
									Clipboard.setString('')
								}}
							>
								<Text
									style={{
										fontSize: fontscale * 15,
										color: '#ff3328',
										textAlign: 'center'
									}}
								>再考虑下</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.bottomRight}
								onPress={() => {
									this.hide()
									Clipboard.setString('')
									callback(productInfo)
								}}
							>
								<Text style={{
									fontSize: fontscale * 15,
									color: '#ffffff',
									textAlign: 'center'
								}}>立即查看</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.checkContainer}>
							<Image
								source={Resources.dialog_check_press}
								style={styles.checkIcon}
							/>
							<Text style={{
								color: '#ff3328',
								fontSize: fontscale * 12
							}}>清除口令</Text>
						</View>
					</View>
				</View>
			</Modal>
		)
	}

	static hide = () => {
		if (dialog) {
			dialog.destroy()
		}
	}

}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		flex: 1
	},
	bodyContainer: {
		position: 'relative',
		width: '80%',
		flexDirection: 'column',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: unitWidth * 8
	},
	headerTitle: {
		color: '#ff3328',
		fontSize: fontscale * 16,
		textAlign: 'center',
		margin: unitWidth * 20
	},
	closeIcon: {
		width: unitWidth * 40,
		height: unitWidth * 40
	},
	title: {
		color: '#ff3328',
		fontSize: fontscale * 15
	},
	icon: {
		width: '50%',
		aspectRatio: 1,
		borderRadius: unitWidth * 15,
		margin: unitWidth * 20
	},
	productTitle: {
		color: '#333333',
		fontSize: fontscale * 15,
		width: '80%',
		marginTop: unitWidth * 16
	},
	buyTip: {
		color: '#ff3328',
		borderColor: '#ff3328',
		borderWidth: 1,
		borderRadius: unitWidth * 10,
		fontSize: fontscale * 12,
		paddingTop: unitWidth * 4,
		paddingBottom: unitWidth * 4,
		paddingLeft: unitWidth * 8,
		paddingRight: unitWidth * 8,
		marginTop: unitWidth * 16
	},
	priceContainer: {
		flexDirection: 'row',
		marginTop: unitWidth * 16
	},
	priceTip: {
		color: '#FF3328',
		fontSize: fontscale * 12
	},
	priceValue: {
		color: '#FF3328',
		fontWeight: 'bold',
		fontSize: fontscale * 16
	},
	bottomContainer: {
		flexDirection: 'row',
		padding: unitWidth * 20,
		marginTop: unitWidth * 16
	},
	bottomLeft: {
		flex: 1,
		borderColor: '#ff3328',
		borderRadius: fontscale * 20,
		borderWidth: 1,
		padding: unitWidth * 20,
		margin: unitWidth * 12,
		backgroundColor: '#ffffff'
	},
	bottomRight: {
		flex: 1,
		borderRadius: fontscale * 20,
		padding: unitWidth * 20,
		overflow: 'hidden',
		margin: unitWidth * 12,
		backgroundColor: '#FF3328'
	},
	checkContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#e6e6e6',
		padding: unitWidth * 14,
		borderBottomLeftRadius: unitWidth * 8,
		borderBottomRightRadius: unitWidth * 8
	},
	checkIcon: {
		width: unitWidth * 25,
		height: unitWidth * 25
	}
})
