import {storage} from '../../utils/StorageUtil'

const SEARCH_KEY = 'searchKeyList'

function save(keyList){
	storage.save(SEARCH_KEY, keyList)
}

let history = {
	addKey: function (key) {
		this.getAllKey().then(keyList => {
			if(keyList.indexOf(key) === -1){
				keyList.push(key)
				save(keyList)
			}
		})
	},
	clearKey: function () {
		storage.remove(SEARCH_KEY)
	},
	getAllKey: function () {
		return new Promise((resolve, reject) => {
			storage.load(SEARCH_KEY, data => {
				if(data){
					resolve(data)
				}else{
					resolve([])
				}
				reject([])
			})
		})
	}
}

export default history
