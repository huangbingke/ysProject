/**
  * desc：
  * author：zhenggl
  * date： $
  */
import React, {Component} from 'react'
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Dimensions
} from 'react-native'
import RootSlblings from 'react-native-root-siblings'

const width = Dimensions.get('window').width
const height= Dimensions.get('window').height

var sibling;
const Loading = {
	show: () => {
		sibling = new RootSlblings(
			<View style={styles.maskStyle}>
				<View style={styles.backViewStyle}>
					<ActivityIndicator size="large" color="white" />
				</View>
			</View>
		)
	},
	hidden: () => {
		if(sibling instanceof RootSlblings){
			sibling.destroy()
		}
	}
}

const styles = StyleSheet.create({
	maskStyle: {
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		width: width,
		height: height,
		alignItems: 'center',
		justifyContent: 'center'
	},
	backViewStyle: {
		backgroundColor: '#111',
		width: 120,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	}
})

export {Loading}
