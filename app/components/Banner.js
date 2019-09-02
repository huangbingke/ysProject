import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Image,
	View,
	Dimensions,
	Text,
	FlatList
} from 'react-native'

import MediaUtils from '../utils/MediaUtils'

const width = Dimensions.get('window').width

export default class Banner extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentIndex: 0
		}
	}

	renderItem = (item, index, itemClickAction) => {
		return (
			<TouchableOpacity
				key={index}
				onPress={() => {
					if(itemClickAction){
						itemClickAction(index)
					}
				}}
			>
				<Image
					key={index}
					keyExtractor={({item, index}) => {
						return 'index' + index + item
					}}
					source={{uri: MediaUtils.quantityPress(item)}}
					resizeMode='cover'
					style={{width: width, aspectRatio: 1}}/>
			</TouchableOpacity>
		)
	}

	render() {
		let {data, viewHeight, itemClickAction} = this.props
		if (!viewHeight) {
			viewHeight = width
		}
		return (
			<View style={{height: viewHeight}}>
				<FlatList
					data={data}
					renderItem={({item, index}) => this.renderItem(item, index, itemClickAction)}
					pagingEnabled={true}
					horizontal={true}
					onScroll={(index) => {
						alert(index)
					}}
				/>
				<Text>
					{this.state.currentIndex}/<Text>{data.length}</Text>
				</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	images: {
		width: '100%',
	},
})
