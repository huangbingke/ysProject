/**
  * desc：优惠券界面
  * author：zhenggl
  * date： $
  */
import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	FlatList
} from 'react-native';
import ProductCell from '../../components/ProductListCell'
import BasePage from "../basic/BasePage"
import api from '../../api/index'
import ScrollToTop from "../../components/ScrollToTop";
import LoadMore from "../../components/load_more/LoadMore";
import CouponHeader from "./coupon/header/CouponHeader";
import UserBuyToast from "../../components/UserBuyToast";
import EventManager from "../../manager/EventManager";
import EmptyView from "../../components/EmptyView";

let userTimer = null
export default class CouponPage extends BasePage {

	constructor(props) {
		super(props);
		this.state = {
			userIndex: 0,
			pauseFlag: false,
			pageIndex: 1,
			productList: [],
			loadingMode: 'loading',
			refreshing: false
		}
	}

	componentDidMount() {
		this.loadData(true)
		api.account.getVisualUserList().then(res => {
			if(1 === res.status){
				this.state.userIndex = 0
				this.state.pauseFlag = true
				userTimer = setInterval(() => {
					if(this.state.pauseFlag) {
						let userInfo = res.data[this.state.userIndex]
						UserBuyToast.show(userInfo)
						this.state.userIndex = (this.state.userIndex + 1) % res.data.length
					}
				}, 10000)
			}
		})
		this.listener = EventManager.registerListener(EventManager.CHANGE_TAB, (tabName) => {
			if('Category' === tabName){
				//恢复了
				this.resume()
			}else{
				this.pause()
			}
		})
	}

	pause() {
		this.setState({
			pauseFlag: false
		})
	}

	resume() {
		this.setState({
			pauseFlag: true
		})
	}

	componentWillUnmount(): void {
		userTimer && clearInterval(userTimer)
		this.listener && this.listener.remove()
	}

	loadData = (showLoading) => {
		if (showLoading) {
			this.showLoading()
		}
		api.product.getCouponProductList(this.state.pageIndex).then(res => {
			this.hideLoading()
			if (1 === this.state.pageIndex) {
				this.state.productList = []
			}
			this.setState({
				productList: this.state.productList.concat(...res.data),
				loadingMode: res.data.length < 20 ? 'none' : 'loading',
				refreshing: false
			})
		})
	}

	refresh = () => {
		this.setState({
			refreshing: true,
			pageIndex: 1
		})
		this.loadData(false)
	}

	loadNext = () => {
		this.state.pageIndex++
		this.loadData(false)
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					ref={couponList => this.couponList = couponList}
					data={this.state.productList}
					keyExtractor={(item, index) => {
						return 'index' + index + item
					}}
					renderItem={({item, index}) => {
						return <ProductCell index={index} navigation={this.props.navigation} item={item}/>
					}}
					refreshing={this.state.refreshing}
					onRefresh={() => this.refresh()}
					onEndReached={() => this.loadNext()}
					ListHeaderComponent={() => <CouponHeader/>}
					ListFooterComponent={() => <LoadMore mode={this.state.loadingMode}/>}
					ListEmptyComponent={() => <EmptyView/>}
				/>
				<ScrollToTop
					scrollAction={() => {
						this.couponList.scrollToIndex({
							index: 0,
							animated: true
						})
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
