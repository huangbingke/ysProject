/**
  * desc：对店铺的印象
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

export default class ShopScoreView extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		let {appraisal} = this.props
		return (
			<View style={styles.container}>
				{
					appraisal.map((item, index) => {
						return <Text style={styles.scoreItem} key={index}>{ item }</Text>
					})
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		margin: unitWidth * 15
	},
	scoreItem: {
		color: '#666666',
		backgroundColor: '#f2f2f2',
		fontSize: fontscale * 12,
		paddingTop: unitWidth * 4,
		paddingBottom: unitWidth * 4,
		paddingLeft: unitWidth * 10,
		paddingRight: unitWidth * 10,
		marginRight: unitWidth * 20,
		marginBottom: unitWidth * 15
	}
})
