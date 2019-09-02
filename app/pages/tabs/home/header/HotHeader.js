/**
  * desc：第一个首页的头部
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	FlatList,
	Text
} from 'react-native'
import {withNavigation} from 'react-navigation'
import api from '../../../../api/index'
import {fontscale, unitWidth, width} from "../../../../utils/AdapterUtil"
import Resources from "../../../../assets/Resources";
import ActivityJumpManager from "../../../../manager/ActivityJumpManager";
import PageScrollView from "../../../../components/PageScrollView";

const left = 20 * unitWidth
const cols = 5

class HotHeader extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			swiperShow: false,
			finish: false,
			bannerList: [],
			moduleList: []
		}
		this._renderGridItem = this._renderGridItem.bind(this)
	}

	/**
	 * 这个函数开始，就可以和 JS 其他框架交互了，例如设置计时 setTimeout 或者 setInterval，
	 * 或者发起网络请求。这个函数也是只被调用一次
	 * （能够使用setState()来改变属性 有且只有一次）
	 */
	componentDidMount() {
		api.resources.getIndexActivity().then(res => {
			if (res.status === 1) {
				let list = res.data
				list.forEach(item => {
					switch (item.template) {
						case 1:
							this.state.bannerList = item.list
							break
						case 2:
							this.state.moduleList = item.list
							break
					}
				})
				this.setState({
					swiperShow: true
				})
			}
		})
	}

	_renderGridItem = (item, index, cellWidth) => {
		return (
			<TouchableOpacity
				style={{flex: 1, flexDirection: 'row', alignContent: 'center', padding: unitWidth * 20}}
				onPress={() => {
					ActivityJumpManager.activityJump(item.url, this.props.navigation)
				}}
				key={index}
			>
				<View style={{flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
					<Image
						source={{uri: item.image}}
						style={{width: cellWidth - unitWidth * 10, aspectRatio: 1}}
					/>
					<Text style={{fontSize: fontscale * 11, color: '#333333', marginTop: unitWidth * 12}}>
						{item.title}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const imageWH = (width - (cols + 1) * left) / cols - unitWidth * 20
		return (
			<View>
				{
					this.state.swiperShow ? <View style={{width: '100%', height: width * 0.4}}>
						<PageScrollView
							infiniteInterval={5000}
							style={{width: width, height: width * 0.4}}
							datas={this.state.bannerList}
							view={(i, data) => {
								return <TouchableOpacity
									key={data.image}
									onPress={() => {
										ActivityJumpManager.activityJump(data.url, this.props.navigation)
									}}
								>
									<Image
										keyExtractor={({data, i}) => {
											return 'index' + i + data
										}}
										source={{uri: data.image}}
										resizeMode='cover'
										style={{width: width, height: width * 0.4}}
									/>
								</TouchableOpacity>
							}}
						/>
					</View> : <View/>
				}
				<View>
					<FlatList
						horizontal={false}
						numColumns={cols}
						keyExtractor={(item, index) => {
							return 'index' + index + item
						}}
						data={this.state.moduleList}
						renderItem={({item, index}) => this._renderGridItem(item, index, imageWH)}
					/>
				</View>
				<Image
					source={Resources.index_header}
					style={{width: '100%', height: width * 0.12}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({})

export default withNavigation(HotHeader)
