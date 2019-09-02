/**
  * desc：个人中心头部
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text,
} from 'react-native'
import {fontscale, getStatusBarHeight, unitWidth} from "../../utils/AdapterUtil";

export default class PersonalHeader extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.setting}>
					设置
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row-reverse',
		marginTop: getStatusBarHeight() + unitWidth*20,
		backgroundColor: 'transparent'
	},
	setting: {
		color: '#FFFFFF',
		fontSize: fontscale*15,
		margin: unitWidth * 12
	}
})
