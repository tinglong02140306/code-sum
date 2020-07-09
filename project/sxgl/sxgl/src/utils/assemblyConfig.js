/**
 * @description: echarts配置
 * @author：胡曦晓
 * @email: xxhu4@iflytek.com
 * @time:  2018/6/15
 */
// 1101基础柱形图   1102簇型柱形图    1103堆积柱形图
// 1201基础条形图   1202簇型条形图    1203堆积条形图
// 1301基础折线图   1302面积图            1303堆积面积图
// 1401基础饼图       1402丁格尔玫瑰图
// 1501散点图
// 1601仪表图
import chart from '@/utils/chart.js'
import filter from '@/utils/filter.js'
import smallComponent from '@/utils/smallComponent.js'
import componentLibrary from '@/utils/componentLibrary.js'
export default {
  // 组件库
  'all': componentLibrary.all,
  // 图表
  '1101': chart['1101'],
  '1102': chart['1102'],
  '1103': chart['1103'],
  '1201': chart['1201'],
  '1202': chart['1202'],
  '1203': chart['1203'],
  '1301': chart['1301'],
  '1302': chart['1302'],
  '1303': chart['1303'],
  '1401': chart['1401'],
  '1402': chart['1402'],
  '1501': chart['1501'],
  '1601': chart['1601'],
  // 小组件
  '2101': smallComponent['2101'],
  '2102': smallComponent['2102'],
  '2201': smallComponent['2201'],
  '2202': smallComponent['2202'],
  '2301': smallComponent['2301'],
  '2401': smallComponent['2401'],
  '2501': smallComponent['2501'],
  // 筛选器
  '3001': filter['3001'],
  '3002': filter['3002']
}
