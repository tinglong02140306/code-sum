/**
 * @description: 筛选器配置
 * @author：胡曦晓
 * @email: xxhu4@iflytek.com
 * @time:  2018/7/10
 */
import common from '@/utils/common.js'
// import moment from 'moment'
export default {
  '3001': { // 数值型
    type: 3, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 38, width: 200}),
    dataConfig: { // 数据配置
      value: [0, 0], // input值
      range: [1, 100], // 范围
      defaultRange: [1, 100], // 默认范围,由后台传回数据获取
      show: true, // 是否显示默认区间
      LinkageChart: [] // 联动图表
    }
  },
  '3002': { // 日期型
    type: 3, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 38, width: 300}),
    dataConfig: { // 数据配置
      value: '', // input值
      range: [], // 范围
      defaultRange: [], // 默认范围,由后台传回数据获取
      show: true, // 是否显示默认区间
      LinkageChart: [] // 联动图表
    }
  }
}
