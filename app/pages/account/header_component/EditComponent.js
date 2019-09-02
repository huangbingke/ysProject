/**
  * desc：标题右上角编辑组件
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	TouchableOpacity,
	Text
} from 'react-native'
import {fontscale, unitWidth} from "../../../utils/AdapterUtil";

export default class EditComponent extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			mode: 'normal'
		}
	}

	render() {
		const {onEditAction} = this.props
		return (
			<TouchableOpacity
				style={{
					paddingRight: unitWidth * 20
				}}
				onPress={
					() => {
						if (onEditAction) {
							onEditAction(this.state.mode)
						}
						if('edit' === this.state.mode){
							this.setState({
								mode: 'normal'
							})
						}else{
							this.setState({
								mode: 'edit'
							})
						}
					}
				}
			>
				{
					'normal' === this.state.mode ? <Text>编辑</Text> : <Text>完成</Text>
				}
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		color: '#FFFFFF',
		fontSize: fontscale * 15,
		padding: unitWidth*15
	}
})
