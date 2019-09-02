/**
  * desc：滚动到顶部的组件
  * author：zhenggl
  * date： $
  */
import React, {Component} from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Image
} from 'react-native'
import Resources from "../assets/Resources";
import {unitWidth} from "../utils/AdapterUtil";

export default class ScrollToTop extends Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		let {scrollAction, bottomHeight} = this.props
		return (
			<TouchableOpacity
				style={[styles.container, {marginBottom: bottomHeight}]}
				onPress={() => {
					if (scrollAction) {
						scrollAction()
					}
				}}
			>
				<Image
					source={Resources.scroll_to_top}
					style={{width: unitWidth * 80, height: unitWidth * 80}}
				/>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		zIndex: 1000,
		position: 'absolute',
		bottom: unitWidth * 120,
		right: unitWidth * 20
	}
})
