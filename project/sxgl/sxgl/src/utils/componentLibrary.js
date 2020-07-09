/**
 * @description: 模板组件库列表
 * @author：胡曦晓
 * @email: xxhu4@iflytek.com
 * @time:  2018/7/10
 */
export default {
  all: [
    {
      name: '图表',
      icon: 'fa-area-chart',
      color: '#409eff',
      show: true,
      type: 1,
      list: [
        {name: '基础柱形图', code: '1101', icon: 'icon-jichuzhuxingtu'},
        {name: '簇型柱形图', code: '1102', icon: 'icon-cuxingzhuxingtu'},
        {name: '堆积柱形图', code: '1103', icon: 'icon-duijixingzhuxingtu'},
        {name: '基础条形图', code: '1201', icon: 'icon-jichutiaoxingtu'},
        {name: '簇型条形图', code: '1202', icon: 'icon-cuxingtiaoxingtu'},
        {name: '堆积条形图', code: '1203', icon: 'icon-duijixingtiaoxingtu'},
        {name: '基础折线图', code: '1301', icon: 'icon-zhexiantu'},
        {name: '面积图', code: '1302', icon: 'icon-mianjitu'},
        {name: '堆积面积图', code: '1303', icon: 'icon-duijimianjitu'},
        {name: '基础饼图', code: '1401', icon: 'icon-shanxingtu2'},
        {name: '丁格尔玫瑰图', code: '1402', icon: 'icon-shanxingtu1'},
        {name: '散点图', code: '1501', icon: 'icon-sandiantu'},
        {name: '仪表图', code: '1601', icon: 'icon-yibiaopan'}
      ]
    }, {
      name: '小组件',
      icon: 'fa-cubes',
      color: '#06eba7',
      show: true,
      type: 2,
      list: [
        {
          name: '指标卡',
          code: '2100',
          list: [
            {name: '面板指标卡', code: '2101', icon: 'icon-fangxingzhibiaoqia'},
            {name: '数值指标卡', code: '2102', icon: 'icon-tiaoxingzhibiaoqia'}
          ]
        }, {
          name: '文本',
          code: '2200',
          list: [
            {name: '水平文本', code: '2201', icon: 'icon-hengpaiwendang'},
            {name: '垂直文本', code: '2202', icon: 'icon-shupaiwendang'}
          ]
        }, {
          name: '列表',
          code: '2300',
          list: [
            {name: '排行榜', code: '2301', icon: 'icon-liebiao'}
          ]
        }, {
          name: '时间轴',
          code: '2400',
          list: [
            {name: '时间轴', code: '2401', icon: 'icon-hengxiangshijianzhou1'}
          ]
        }, {
          name: '时间控件',
          code: '2500',
          list: [
            {name: '时间控件', code: '2501', fa: 'fa-clock-o'}
          ]
        }
      ]
    }, {
      name: '筛选器',
      icon: 'fa-filter',
      color: '#fc7079',
      show: true,
      type: 3,
      list: [
        {name: '数值型', code: '3001', icon: 'icon-shuzhixing'},
        {name: '时间日期型', code: '3002', icon: 'icon-shijianriqixing'}
      ]
    }, {
      name: '素材',
      icon: 'fa-puzzle-piece',
      color: '#43fde9',
      show: false,
      type: 4,
      list: [
        {name: '素材1'},
        {name: '素材2'}
      ]
    }, {
      name: '主题',
      icon: 'fa-image',
      color: '#fff496',
      show: false,
      type: 5,
      list: [
        {name: '主题1'}
      ]
    }
  ]
}
