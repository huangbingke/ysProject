/**
  * desc：用户印象
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Text
} from 'react-native'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";

export default class UserImpressView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		let {tagList} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.splider}/>
				<Text style={styles.header}>用户印象</Text>
				<View style={styles.impressContainer}>
					{
						tagList.map((item, index) => {
							return <Text style={styles.impressItem} key={index}>{ item }</Text>
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
	header: {
		fontSize: fontscale * 14,
		fontWeight: 'bold',
		margin: unitWidth * 20
	},
	impressContainer: {
		margin: unitWidth * 20,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	impressItem: {
		color: '#333333',
		fontSize: fontscale * 12,
		paddingTop: unitWidth * 8,
		paddingBottom: unitWidth * 8,
		paddingLeft: unitWidth * 15,
		paddingRight: unitWidth * 15,
		marginRight: unitWidth * 20,
		marginBottom: unitWidth * 20,
		backgroundColor: '#FFEAEA',
		borderRadius: unitWidth * 8,
		overflow: 'hidden'
	}
})
