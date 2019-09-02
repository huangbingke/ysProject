/**
  * desc：展示搜索关键词对话框
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	ImageBackground,
	Image,
	Text,
	Modal,
	TouchableOpacity
} from 'react-native'
import Resources from "../../assets/Resources";
import {fontscale, unitWidth, width} from "../../utils/AdapterUtil";
import RootSiblings from 'react-native-root-siblings'

let dialog = null

export default class KeyDialog extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			show: true,
			key: ''
		}
	}

	static show = (navigation, key, callback) => {
		dialog = new RootSiblings(
			<Modal
				visible={true}
				animationType='fade'
				transparent={true}
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
						<ImageBackground
							resizeMode='stretch'
							style={styles.dialogHeader}
							source={Resources.copy_dialog_top}
						>
							<Image
								style={styles.searchLogo}
								source={Resources.search_dialog_top_logo}
							/>
							<Text style={styles.dialogTitle}>是否搜索以下内容</Text>
						</ImageBackground>
						<Text style={styles.contentContainer}>
							{key}
						</Text>
						<View style={styles.bottomContainer}>
							<TouchableOpacity
								style={styles.bottomBtn}
								onPress={() => {
									this.hide()
								}}
							>
								<Text
									style={[styles.btnLeft]}
								>取消</Text>
							</TouchableOpacity>
							<View
								style={styles.splider}
							/>
							<TouchableOpacity
								style={styles.bottomBtn}
								onPress={() => {
									this.hide()
									if (callback) {
										callback()
									}
								}}
							>
								<Text
									style={[styles.btnRight]}

								>确定</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>)
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
		width: '80%',
		flexDirection: 'column',
		alignSelf: 'center',
		borderRadius: unitWidth * 20
	},
	dialogHeader: {
		width: unitWidth * 600,
		height: unitWidth * 200,
		justifyContent: 'center',
		alignItems: 'center',
		padding: unitWidth * 30,
	},
	searchLogo: {
		width: unitWidth * 150,
		height: unitWidth * 150,
		position: 'absolute',
		left: '50%',
		top: -60 * unitWidth,
		transform: [{translateX: -45 * unitWidth}]
	},
	dialogTitle: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: fontscale * 17,
		paddingTop: unitWidth * 50
	},
	contentContainer: {
		width: '100%',
		padding: unitWidth * 30,
		backgroundColor: '#FFFFFF'
	},
	bottomContainer: {
		flexDirection: 'row',
		borderColor: '#e1e1e1',
		borderTopWidth: 1,
		backgroundColor: '#FFFFFF',
		borderBottomLeftRadius: unitWidth * 20,
		borderBottomRightRadius: unitWidth * 20
	},
	bottomBtn: {
		flex: 1,
		padding: unitWidth * 30,
		textAlign: 'center'
	},
	btnLeft: {
		color: '#666666',
		borderBottomLeftRadius: unitWidth * 20,
		textAlign: 'center'
	},
	splider: {
		borderRightWidth: 1,
		color: '#ffffff',
		height: '100%',
		borderRightColor: '#e1e1e1'
	},
	btnRight: {
		borderBottomRightRadius: unitWidth * 20,
		color: '#ff3328',
		borderLeftWidth: 1,
		textAlign: 'center',
		borderLeftColor: '#e1e1e1'
	}
})
