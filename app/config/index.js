let environment = 'test'
let debugFlag = true
let apiHost = 'http://test-tbk.32wd.cn'
switch (environment){
	case 'test':
		apiHost = 'http://test-tbk.32wd.cn'
		debugFlag = true
		break
	case "product":
		apiHost = 'http://tbk.32wd.cn'
		debugFlag = false
		break
}

export const host = apiHost
export const debug = debugFlag

