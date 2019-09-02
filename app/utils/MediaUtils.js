import { width } from "./AdapterUtil"

function generateGallerySize() {
	let target = ''
	if(width <= 720){
		target = '400x400'
	}else if(width < 1280){
		target = '600x600'
	}else{
		target = '800x800'
	}
	return target
}

function generateListSize() {
	let target = ''
	if(width <= 720){
		target = '200x200'
	}else if(width < 1280){
		target = '300x300'
	}else{
		target = '400x400'
	}
	return target
}

let GALLERY_CELL_WIDTH = generateGallerySize()
let LIST_CELL_WIDTH = generateListSize()

let MediaUtils = {
	galleryQuantityScalePress: function (picLink) {
		let result = ''
		if(!picLink){
			return result
		}else{
			if(picLink.indexOf('alicdn') !== -1){
				result = picLink + '_' + GALLERY_CELL_WIDTH + 'Q50s50.jpg'
			}else{
				result = picLink
			}
			return result
		}
	},
	listQuantityScalePress: function (picLink) {
		let result = ''
		if(!picLink){
			return result
		}else{
			if(picLink.indexOf('alicdn') !== -1){
				result = picLink + '_' + LIST_CELL_WIDTH + 'Q50s50.jpg'
			}else{
				result = picLink
			}
			return result
		}
	},
	quantityPress: function (picLink) {
		let result = ''
		if(!picLink){
			return result
		}else{
			if(picLink.indexOf('http') === -1){
				picLink = 'https:' + picLink
			}
			if(picLink.indexOf('alicdn') !== -1){
				result = picLink + '_Q50s50.jpg'
			}else{
				result = picLink
			}
			return result
		}
	},
	descQuantityPress: function (picLink) {
		let result = ''
		if(!picLink){
			return result
		}else {
			if (picLink.indexOf('http') === -1) {
				picLink = 'https:' + picLink
			}
			if (picLink.indexOf('alicdn') !== -1) {
				result = picLink + '_800x800Q50s50.jpg'
			} else {
				result = picLink
			}
			return result
		}
	}
}

export default MediaUtils
