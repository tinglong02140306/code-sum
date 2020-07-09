import configDev from './dev.config'
import configPre from './pre.config'
import configPro from './pro.config'

let config

// console.log('环境', process.env.PROJECT_BUILD_ENV)
switch (process.env.PROJECT_BUILD_ENV) {
    // 开发环境
    case 'dev':
        config = configDev
        break
        // 预发布环境
    case 'pre':
        config = configPre
        break
        // 生产环境
    case 'pro':
        config = configPro
        break
}

// 定义为不可修改对象
const conf = config
export default conf