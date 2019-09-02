import common from './modules/common'
import activity from './modules/activity'
import app from './modules/app'
import account from './modules/account'
import market from './modules/market'
import order from './modules/order'
import product from './modules/product'

let RouterConfig = Object.assign(app, activity, common, account, market, order, product)

export default RouterConfig
