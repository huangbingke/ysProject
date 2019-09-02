import React from 'react'
import {
	DeviceEventEmitter
} from 'react-native'

export default class EventManager{

	static DROP_MENU = 'drop_menu'
	static INIT_ACCOUNT = 'init_account'	// 初始化账号信息
	static ACCOUNT_TIME_OUT = 'account_time_out'	// 登录超时，需要重新跳转到登录界面
	static CHANGE_TAB = 'change_tab'	// 切换tab选项卡动作
	static LOG_OUT = 'log_out'		//注销动作

	static registerListener(action, callback){
		return DeviceEventEmitter.addListener(action, callback)
	}

	static postEvent(){
		DeviceEventEmitter.emit(this.DROP_MENU, 'toggle')
	}

	static postInitAccount(){
		DeviceEventEmitter.emit(this.INIT_ACCOUNT, 'login_success')
	}

	static postAccountTimeOut(){
		DeviceEventEmitter.emit(this.ACCOUNT_TIME_OUT, 'account_time_out')
	}

	static postChangeTab(tabName){
		DeviceEventEmitter.emit(this.CHANGE_TAB, tabName)
	}

	static postLogout(){
		DeviceEventEmitter.emit(this.LOG_OUT, '')
	}

}
