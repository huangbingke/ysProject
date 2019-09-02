/**
  * desc：
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	TextInput,
	Image,
	Text,
	FlatList,
	TouchableOpacity
} from 'react-native'
import BasePage from '../../pages/basic/BasePage.js'
import api from '../../api/index'
import {fontscale, getStatusBarHeight, statusBarHeight, unitWidth} from "../../utils/AdapterUtil";
import ProductListPage from "../product/ProductListPage";
import Resources from "../../assets/Resources";
import dao from "../../dao";

let suggestTop = 0	// 控制建议关键词列表的位置
export default class SearchPage extends BasePage {

	constructor(props) {
		super(props)
		this.state = {
			key: '',
			suggestList: [],
			hotList: [],
			historyList: []
		}
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		this.getHistory()
		this.searchAction('')
		setTimeout(this.measureSearchView.bind(this))

	}

	measureSearchView(){
		this.keyContainer.measure((x, y, width, height, pageX, pageY) => {
			suggestTop = pageY + height
		})
	}

	static startMe(navigation) {
		navigation.navigate('Search')
	}

	getHistory = () => {
		dao.history.getAllKey().then(keyList => {
			this.setState({
				historyList: keyList
			})
		})
	}

	// 根据关键词搜索
	searchAction = key => {
		if (!key) {
			this.showLoading()
		}
		api.resources.getKeyList(key).then(res => {
			this.hideLoading()
			if (1 === res.status) {
				if (!key) {
					this.setState({
						hotList: res.data
					})
				} else {
					this.setState({
						suggestList: res.data
					})
				}
			}
		})
	}

	renderListItem = (item, index) => {
		return (
			<TouchableOpacity
				onPress={() => {
					this.execSearchAction(item)
				}}
			>
				<Text style={styles.historyItem}>{item}</Text>
			</TouchableOpacity>
		)
	}

	// 渲染建议列表的item
	renderSuggestListItem = (item, index) => {
		return <TouchableOpacity
			onPress={() => {
				this.execSearchAction(item)
				this.setState({
					suggestList: []
				})
			}}
		>
			<Text style={styles.suggestItem}>{item}</Text>
		</TouchableOpacity>
	}

	// 执行搜索动作
	execSearchAction = (item) => {
		dao.history.addKey(item)
		ProductListPage.startMeByKey(this.props.navigation, item)
		this.getHistory()
	}

	// 清除本地历史
	cleanHistory = () => {
		this.setState({
			historyList: []
		})
		dao.history.clearKey()
	}

	render() {
		return (
			<View style={styles.container}>
				<View
					ref={keyContainer => this.keyContainer = keyContainer}
					style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						multiline={false}
						blurOnSubmit={true}
						clearButtonMode='while-editing'
						placeholder='请输入搜索关键词'
						onChangeText={text => {
							if (text) {
								this.setState({
									key: text
								})
								this.searchAction(text)
							} else {
								this.setState({
									suggestList: []
								})
							}
						}}
						onSubmitEditing={(event) => {
							this.execSearchAction(event.nativeEvent.text)
						}}
					/>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.goBack()
						}}
					>
						<Text style={styles.cancel}>取消</Text>
					</TouchableOpacity>
				</View>
				{
					this.state.hotList ?
						<View>
							<View style={styles.hotContainer}>
								<Text style={styles.hotTitle}>热搜关键词</Text>
							</View>
							<View style={styles.historyBody}>
								{
									this.state.hotList.map((item, index) => {
										return (
											<TouchableOpacity
												key={index}
												onPress={() => {
													dao.history.addKey(item)
													ProductListPage.startMeByKey(this.props.navigation, item)
												}}
											>
												<Text style={styles.hotItem}>{item}</Text>
											</TouchableOpacity>
										)
									})
								}
							</View>
						</View>
						: <View/>
				}
				{
					this.state.historyList ?
						<View>
							<View style={styles.hotContainer}>
								<Text style={styles.hotTitle}>历史关键词</Text>
								<TouchableOpacity
									style={{marginRight: unitWidth * 20}}
									onPress={() => {
										// 清除本地搜索历史
										this.cleanHistory()
									}}
								>
									<Image
										source={Resources.delete}
										resizeMode='contain'
										style={{width: unitWidth * 30, padding: unitWidth * 15}}
									/>
								</TouchableOpacity>
							</View>
							<FlatList
								data={this.state.historyList}
								keyExtractor={(item, index) => {
									return 'index' + index + item
								}}
								renderItem={({item, index}) => this.renderListItem(item, index)}
							/>
						</View>
						: <View/>
				}
				{
					this.state.suggestList ?
						<FlatList
							style={[styles.suggest, {top: suggestTop}]}
							data={this.state.suggestList}
							keyExtractor={(item, index) => {
								return 'index' + index + item
							}}
							renderItem={({item, index}) => this.renderSuggestListItem(item, index)}
						/> : <View/>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3',
	},
	inputContainer: {
		backgroundColor: '#f3f3f3',
		padding: unitWidth * 12,
		marginTop: statusBarHeight,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: unitWidth * 15
	},
	input: {
		backgroundColor: '#FFFFFF',
		borderRadius: unitWidth * 30,
		padding: unitWidth * 20,
		fontSize: fontscale * 15,
		flex: 1,
		color: '#333333'
	},
	cancel: {
		padding: unitWidth * 12,
		marginLeft: unitWidth * 12
	},
	hotContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	hotTitle: {
		fontSize: fontscale * 16,
		padding: unitWidth * 10
	},
	hotBody: {
		flex: 1,
		flexDirection: 'row'
	},
	historyBody: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	hotItem: {
		padding: unitWidth * 15,
		color: '#333333',
		backgroundColor: '#e1e1e1',
		marginLeft: unitWidth * 15,
		marginRight: unitWidth * 15,
		marginTop: unitWidth * 15,
		borderRadius: unitWidth * 5
	},
	historyItem: {
		padding: unitWidth * 20,
		color: '#333333'
	},
	suggestItem: {
		padding: unitWidth * 30,
		fontSize: fontscale * 15,
		color: '#333333'
	},
	suggest: {
		position: 'absolute',
		flex: 1,
		backgroundColor: '#FFFFFF',
		left: 0,
		right: 0
	}
})
