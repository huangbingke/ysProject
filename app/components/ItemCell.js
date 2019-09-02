/**
  * desc：设置item组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Image
} from 'react-native'
import Resources from "../assets/Resources";
import {fontscale, unitWidth} from "../utils/AdapterUtil";

export default class ItemCell extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		let {title, rightTitle, link, marginTop, top, bottom, onCellClick} = this.props
		return (
			<TouchableOpacity
				onPress={() => {
					if (onCellClick) {
						onCellClick()
					}
				}}
				style={{
					marginTop: marginTop
				}}
			>
				<View style={[
					styles.container,
					top ? styles.topBorder : '',
					bottom ? styles.bottomBorder : ''
				]}>
					<Text style={styles.title}>
						{title}
					</Text>
					<View style={styles.right}>
						<Text>{rightTitle}</Text>
						{
							link ? <Image source={Resources.right_gray_arrow}/> : ''
						}
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		paddingLeft: unitWidth * 25,
		paddingTop: unitWidth * 25,
		paddingBottom: unitWidth * 25,
		alignItems: 'center',
	},
	title: {
		color: '#333333',
		fontSize: fontscale * 16
	},
	right: {
		flexDirection: 'row',
		color: '#999999',
		fontSize: fontscale * 12,
		alignItems: 'center',
		marginRight: unitWidth * 12,
		textAlign: 'center'
	},
	topBorder: {
		borderTopWidth: 1,
		borderTopColor: '#e1e1e1'
	},
	bottomBorder: {
		borderBottomWidth: 1,
		borderBottomColor: '#e1e1e1'
	}
})
