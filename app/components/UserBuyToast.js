/**
  * desc：用户购买信息的toast
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Image
} from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import {fontscale, unitWidth} from "../utils/AdapterUtil";

let userToast = null
export default class UserBuyToast extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			show: false,
			userInfo: {}
		}
	}

	static show(userInfo) {
		if (userInfo) {
			userToast = new RootSiblings(
				<View style={styles.container}>
					<Image
						source={{uri: userInfo.avatar}}
						style={styles.userIcon}/>
					<Text style={styles.userDesc}>
						{userInfo.nickName}{userInfo.desc}
					</Text>
				</View>
			)
			setTimeout(() => {
				if (userToast) {
					userToast.destroy()
				}
			}, 3000)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: unitWidth * 15,
		overflow: 'hidden',
		borderRadius: unitWidth * 40,
		backgroundColor: '#000000',
		opacity: 0.8,
		zIndex: 9999,
		position: 'absolute',
		top: '10%',
		left: '10%'
	},
	userIcon: {
		width: unitWidth * 50,
		height: unitWidth * 50,
		borderRadius: unitWidth * 25
	},
	userDesc: {
		fontSize: fontscale * 14,
		color: '#ffffff',
		marginLeft: unitWidth * 12
	}
})
