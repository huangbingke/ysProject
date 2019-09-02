import AboutUsPage from '../../pages/app/AboutUsPage'
import ShareFriendPage from '../../pages/app/ShareFriendPage'
import WebPage from '../../pages/app/WebPage'
import PicBrowsePage from '../../pages/app/PicBrowsePage'
import QrScanPage from '../../pages/app/QrScanPage'
import KeyDialog from '../../pages/app/KeyDialog'
import SingleProductDialog from '../../pages/app/SingleProductDialog'

export default {
	AboutUs: AboutUsPage,
	ShareFriend: ShareFriendPage,
	Web: WebPage,
	PicBrowse: PicBrowsePage,
	QrScan: {
		screen: QrScanPage,
		navigationOptions: {
			header: null
		}
	},
	KeyDialog: {
		screen: KeyDialog,
		mode: 'card'
	},
	SingleProduct: SingleProductDialog
}
