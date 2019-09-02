import BindAliAccountPage from '../../pages/market/BindAliAccountPage'
import GetCashPage from '../../pages/market/GetCashPage'
import IncomingRecordPage from '../../pages/market/IncomingRecordPage'
import OverviewPage from '../../pages/market/OverviewPage'
import TeamPage from '../../pages/market/TeamPage'

export default {
	BindAliAccount: BindAliAccountPage,
	GetCash: GetCashPage,
	IncomingRecord: {
		screen: IncomingRecordPage,
		navigationOptions: {
			header: null
		}
	},
	Overview: OverviewPage,
	Team: TeamPage
}
