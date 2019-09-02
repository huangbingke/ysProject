/**
  * desc：过滤对话框
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	Modal,
	Text,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	View,
} from 'react-native'
import {fontscale, unitWidth, width} from "../../../utils/AdapterUtil";
import Resources from "../../../assets/Resources";

export default class FilterDialog extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			onlyTm: false,
			startPrice: 0,
			endPrice: 0,
			priceArray: [
				{
					title: '0 - 10',
					startPrice: 0,
					endPrice: 10,
					check: false
				},
				{
					title: '20 - 25',
					startPrice: 20,
					endPrice: 25,
					check: false
				},
				{
					title: '25 - 50',
					startPrice: 25,
					endPrice: 50,
					check: false
				},
				{
					title: '50 - 80',
					startPrice: 50,
					endPrice: 80,
					check: false
				},
				{
					title: '80以上',
					startPrice: 80,
					endPrice: 9999,
					check: false
				}
			]
		}
	}

	// 清除全部
	cleanAll = () => {
		this.setState({
			onlyTm: false,
			startPrice: 0,
			endPrice: 0,
			priceArray: this.state.priceArray.map((item) => {
				return {...item, check: false}
			})
		})
	}

	render() {
		let {show, onCancel, onSure} = this.props
		return (
			<Modal
				style={styles.container}
				animationType='fade'
				transparent={true}
				visible={show}
			>
				<View style={{
					flex: 1,
					flexDirection: 'column-reverse'
				}}>
					<View
						style={styles.bodyContainer}
					>
						<View style={styles.titleContainer}>
							<Text style={{fontWeight: 'bold', color: '#333333'}}>筛选</Text>
							<TouchableOpacity
								onPress={() => {
									this.cleanAll()
								}}
							>
								<Text style={{color: '#ff3328'}}>全部清除</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.titleHeader}>商家类型</Text>
						<TouchableOpacity
							onPress={() => {
								this.setState({
									onlyTm: !this.state.onlyTm
								})
							}}
							style={{flexDirection: 'row', marginLeft: unitWidth * 15, alignItems: 'center'}}>
							<Image
								source={this.state.onlyTm ? Resources.share_img_check : Resources.share_img_no_check}
								style={{width: unitWidth * 40, aspectRatio: 1, padding: unitWidth * 10}}
							/>
							<Text>仅看天猫</Text>
						</TouchableOpacity>
						<Text style={styles.titleHeader}>价格区间</Text>
						<View style={styles.priceContainer}>
							<TextInput
								style={styles.input}
								placeholder='最低价'
								onChangeText={text => {
									this.setState({
										startPrice: text
									})
								}}
								numberOfLines={1}
								value={this.state.startPrice + ''}
							/>
							<Text> - </Text>
							<TextInput
								style={styles.input}
								placeholder='最高价'
								onChangeText={text => {
									this.setState({
										endPrice: text
									})
								}}
								numberOfLines={1}
								value={this.state.endPrice + ''}
							/>
						</View>
						<View style={styles.quickContainer}>
							{
								this.state.priceArray.map((item, index) => {
									return (
										<TouchableOpacity
											onPress={() => {
												this.setState({
													priceArray: this.state.priceArray.map((item, idx) => {
														return index !== idx ? {...item, check: false} : {...item, check: !item.check}
													})
												})
												this.setState({
													startPrice: item.startPrice,
													endPrice: item.endPrice
												})
											}}
										>
											<Text style={[
												styles.quickItem,
												item.check ? styles.quickActiveItem : ''
											]}>{item.title}</Text>
										</TouchableOpacity>
									)
								})
							}
						</View>
						<TouchableOpacity
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								margin: unitWidth * 30
							}}
							onPress={() => {
								if (onSure) {
									onSure(this.state.onlyTm, this.state.startPrice, this.state.endPrice)
								}
							}}
						>
							<Text style={styles.sure}>确定</Text>
						</TouchableOpacity>
					</View>
					<TouchableWithoutFeedback
						onPress={() => {
							if (onCancel) {
								onCancel()
							}
						}}
					>
						<View style={{
							backgroundColor: '#333333',
							opacity: 0.8,
							flex: 1
						}}/>
					</TouchableWithoutFeedback>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF'
	},
	bodyContainer: {
		backgroundColor: '#FFFFFF'
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: unitWidth * 30,
		backgroundColor: '#e1e1e1'
	},
	titleHeader: {
		margin: unitWidth * 15
	},
	priceContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: unitWidth * 15
	},
	input: {
		padding: unitWidth * 12,
		color: '#333333',
		fontSize: fontscale * 14,
		textAlign: 'center',
		borderRadius: unitWidth * 8,
		borderWidth: 1,
		borderColor: '#e1e1e1',
		flex: 1
	},
	quickContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	quickItem: {
		padding: unitWidth * 15,
		color: '#333333',
		backgroundColor: '#ffffff',
		borderRadius: unitWidth * 8,
		borderWidth: 1,
		borderColor: '#e1e1e1',
		margin: unitWidth * 20
	},
	quickActiveItem: {
		borderColor: '#ff3328',
		color: '#ff3328'
	},
	sure: {
		color: '#FFFFFF',
		paddingTop: unitWidth * 15,
		paddingBottom: unitWidth * 15,
		paddingLeft: unitWidth * 40,
		paddingRight: unitWidth * 40,
		borderRadius: unitWidth * 10,
		backgroundColor: '#ff3328'
	}
})
