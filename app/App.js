/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createAppContainer, createBottomTabNavigator, createStackNavigator, TabBarBottom} from 'react-navigation'
import RouterConfig from './router/index'
import HomePage from './pages/tabs/HomePage'
import CategoryPage from './pages/tabs/CategoryPage'
import CouponPage from './pages/tabs/CouponPage'
import PersonalPage from './pages/tabs/PersonalPage'
import IndexHeader from './components/header/IndexHeader'
import CateHeader from './components/header/CateHeader'
import TabBarItem from './pages/tabs/home/TabBarItem'
import Resources from "./assets/Resources";
import EventManager from "./manager/EventManager";

// 创建一个tab路由器
const FrameStack = createBottomTabNavigator(
	{
		Home: {
			screen: HomePage,
			navigationOptions: {
				tabBarLabel: '首页',
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
						normalImage={Resources.home_normal}
						selectedImage={Resources.home_press}
					/>
				)
			}
		},
		Category: {
			screen: CategoryPage,
			navigationOptions: {
				tabBarLabel: '分类',
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
						normalImage={Resources.category_normal}
						selectedImage={Resources.category_press}
					/>
				)
			}
		},
		Coupon: {
			screen: CouponPage,
			navigationOptions: {
				tabBarLabel: '优惠券',
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
						normalImage={Resources.coupon_normal}
						selectedImage={Resources.coupon_press}
					/>
				)
			}
		},
		Personal: {
			screen: PersonalPage,
			navigationOptions: {
				tabBarLabel: '个人中心',
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
						normalImage={Resources.personal_normal}
						selectedImage={Resources.personal_press}
					/>
				)
			}
		}
	},
	{
		defaultNavigationOptions: ({navigation}) => {
			return {
				lazyLoad: true,
				tabBarComponent: TabBarBottom,
				tabBarPosition: 'bottom',
				tabBarOptions: {
					activeTintColor: '#ff3328',
					inactiveTintColor: '#666666',
				},
				tabBarOnPress: ({navigation, defaultHandler}) => {
					tabChangeListener(navigation)
					defaultHandler()
				}
			}
		}
	}
)
let finalRouter = Object.assign({
	Home: {
		screen: FrameStack,
		navigationOptions: ({navigation}) => {
			let { key } = navigation.state.routes[navigation.state.index]
			switch (key){
				case 'Home':
					return {
						header: <IndexHeader/>
					}
				case 'Category':
					return {
						header: <CateHeader/>
					}
				case 'Coupon':
					return {
						header: null
					}
				case 'Personal':
					return {
						header: null
					}
			}
		}
	},
}, RouterConfig)
// 创建全局路由堆栈
const RootStack = createStackNavigator(
	finalRouter,
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#ffffff'
			},
			headerTintColor: '#333333',
			headerBackTitle: null
		}
	}
)

const tabChangeListener = (navigation) => {
	EventManager.postChangeTab(navigation.state.routeName)
	// switch (navigation.state.routeName) {
	// 	case 'Home':
	// 		break
	// 	case 'Category':
	// 		break
	// 	case 'Coupon':
	// 		break
	// 	case 'Personal':
	// 		break
	// }
}

export default createAppContainer(
	RootStack
)
