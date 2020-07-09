/**
 * Created by hlzhou3 on 2018/7/19.
 */
const vFilter = { // 转换的日期格式 ’20180709161136‘
  timestampToTime (a) { // 格式化日期
    a = a || ''
    let year = a.slice(0, 4) // 获取年
    let month = a.slice(4, 6) // 获取月
    let day = a.slice(6, 8) // 获取日
    let hour = a.slice(8, 10) // 获取时
    let minute = a.slice(10, 12) // 获取分
    let s = a.slice(12, 14) // 获取秒
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + s
  }
}
export default vFilter
