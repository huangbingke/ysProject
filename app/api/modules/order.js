import Rest from '../../utils/Rest'

let order = {
	// 获取淘宝订单列表
	getTbOrderList: function (pageIndex, tkStatus, level) {
		return Rest.post('/v1/order/list', {
			pageIndex: pageIndex,
			pageSize: 20,
			tkStatus: tkStatus,
			level: level
		})
	}
}

export default order
