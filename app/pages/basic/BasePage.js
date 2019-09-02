/**
  * desc：基类页面
  * author：zhenggl
  * date： $
  */
import React from 'react'
import {Toast} from 'beeshell'
import {Loading} from "../../components/loading"
import {fontscale, unitWidth, unitHeight, width, height} from '../../utils/AdapterUtil'
import KeyDialog from "../app/KeyDialog";

export default class BasePage extends React.Component {

	showToast(msg) {
		Toast.show(msg, '2000', 'bottom')
	}

	showLoading() {
		Loading.show()
	}

	hideLoading() {
		Loading.hidden()
	}

	// 统一设置字体大小
	setSize(fontSize) {
		return fontscale * fontSize
	}

	// 统一设置宽度
	setWidth(width) {
		return unitWidth * width
	}

	// 统一设置高度
	setHeight(height) {
		return unitHeight * height
	}

	getScreenWidth() {
		return width
	}

	getScreenHeight() {
		return height
	}

	constructor(props) {
		super(props);
		this.state = {}
	}

}
