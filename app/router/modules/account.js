import BindPhonePage from '../../pages/account/BindPhonePage'
import CollectionPage from '../../pages/account/CollectionPage'
import FriendRecommendPage from '../../pages/account/FriendRecommendPage'
import ForgetPwdPage from '../../pages/account/ForgetPwdPage'
import InputInviteCodePage from '../../pages/account/InputInviteCodePage'
import LoginPage from '../../pages/account/LoginPage'
import WxLogin from '../../pages/account/WxLoginPage'
import ModifyNickPage from '../../pages/account/ModifyNickPage'
import ValidatePhonePage from '../../pages/account/ValidatePhonePage'
import ModifyPhonePage from '../../pages/account/ModifyPhonePage'
import ModifyPwdPage from '../../pages/account/ModifyPwdPage'
import RegisterPage from '../../pages/account/RegisterPage'
import FinishRegisterPage from '../../pages/account/FinishRegisterPage'
import SettingPage from '../../pages/account/SettingPage'

export default {
	BindPhone: BindPhonePage,
	Collection: CollectionPage,
	ForgetPwd: ForgetPwdPage,
	InputInviteCode: {
		screen: InputInviteCodePage,
		navigationOptions: {
			header: null
		}
	},
	WxLogin: {
		screen:WxLogin,
		mode: 'modal'
	},
	Login: {
		screen: LoginPage,
		mode: 'modal',
		navigationOptions: {
			header: null
		}
	},
	FriendRecommend: FriendRecommendPage,
	ModifyNick: ModifyNickPage,
	ValidatePhone: ValidatePhonePage,
	ModifyPhone: ModifyPhonePage,
	ModifyPwd: ModifyPwdPage,
	Register: {
		screen: RegisterPage,
		navigationOptions: {
			header: null
		}
	},
	FinishRegister: {
		screen: FinishRegisterPage,
		navigationOptions: {
			header: null
		}
	},
	Setting: SettingPage
}
