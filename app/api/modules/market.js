import Rest from '../../utils/Rest'

let market = {
	// 获取资金账户
	getFinanceInfo: function () {
		return Rest.post('/v1/user/finance', {})
	},
	// 获取收益资金明细
	getSettleInfo: function () {
		return Rest.post('/v1/user/settles', {})
	},
	// 按照月份结算
	settledByMonth: function () {
		return Rest.post('/v1/user/monthSettle', {})
	},
	// 提现动作
	getCash: function (amount, code) {
		return Rest.post('/v1/user/withdraw', {
			amount: amount,
			code: code
		})
	},
	// 获取提现记录列表
	getCashRecordList: function (pageIndex) {
		return Rest.post('/v1/user/withdraw/list', {
			pageIndex: pageIndex,
			pageSize: 20
		})
	},
	// 获取收入记录列表
	getIncomingList: function (pageIndex) {
		return Rest.post('/v1/user/settles', {
			pageIndex: pageIndex,
			pageSize: 20,
			settleType: 1
		})
	},
	// 获取统计概况
	getOverview: function () {
		return Rest.post('/v1/stat/overview', {})
	},
	// 获取团队成员列表
	getTeamList: function (pageIndex, level) {
		return Rest.post('/v1/team/members', {
			pageIndex: pageIndex,
			pageSize: 20,
			level: level
		})
	},
	// 获取团队成员数量
	getTeamMemberNumber: function () {
		return Rest.post('/v1/team/statAgent', {})
	}
}

export default market
