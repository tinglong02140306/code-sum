/**
 * @description: 小组件配置
 * @author：胡曦晓
 * @email: xxhu4@iflytek.com
 * @time:  2018/7/10
 */
import common from '@/utils/common.js'
export default {
  '2101': { // 面板指标卡
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 100, width: 300}),
    animation: common.animation,
    componentConfig: { // 组件配置
      title: Object.assign({}, common.fontObj, {
        name: '标题', // 标题名称
        background: 'rgba(255, 255, 255, 0)', // 标题背景
        letterSpacing: 0, // 文字间距
        lineHeight: 36, // 文字行高
        textAlign: 'center', // 文字水平位置
        color: '#fff'
      }),
      quota: Object.assign({}, common.fontObj, { // 指标
        background: '', // 指标背景
        lineHeight: 36, // 文字行高
        textAlign: 'center', // 文字水平位置
        letterSpacing: 0, // 文字间距
        value: 123456, // 指标值
        color: '#00e4ff'
      }),
      unit: Object.assign({}, common.fontObj, {name: '单位', color: '#fff'}) // 单位
    }
  },
  '2102': { // 面板指标卡
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 50, width: 350}),
    animation: common.animation,
    componentConfig: { // 组件配置
      title: Object.assign({}, common.fontObj, {
        name: '标题', // 标题名称
        background: 'rgba(255, 255, 255, 0)', // 标题背景
        letterSpacing: 0, // 文字间距
        lineHeight: 50 // 文字行高
      }),
      quota: Object.assign({}, common.fontObj, {
        background: '', // 指标背景
        textAlign: 'center', // 文字水平位置
        marginVal: 5, // 指标文字间隔
        color: '#000',
        value: ['1', '2', '3', ',', '4', '5'] // 指标值
      }), // 指标
      unit: Object.assign({}, common.fontObj, {name: '单位', color: '#666'}) // 单位
    }
  },
  '2201': { // 文本
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 50, width: 100}),
    componentConfig: { // 组件配置
      title: Object.assign({}, common.fontObj, {
        text: '内容', // 内容
        background: 'rgba(255, 255, 255, 0)', // 标题背景
        letterSpacing: 0, // 文字间距
        lineHeight: 20, // 文字行高
        fontSize: 14,
        textAlign: 'left',
        textIndent: 0 // 首行缩进
      })
    }
  },
  '2202': { // 文本
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 50, width: 100}),
    componentConfig: { // 组件配置
      title: Object.assign({}, common.fontObj, {
        text: '内容', // 内容
        background: 'rgba(255, 255, 255, 0)', // 标题背景
        letterSpacing: 0, // 文字间距
        lineHeight: 20, // 文字行高
        fontSize: 14,
        textAlign: 'left',
        textIndent: 0
      })
    }
  },
  '2301': { // 列表
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 100, width: 400}),
    animation: common.animation,
    swiperOption: { // 配置链接http://www.swiper.com.cn/api/
      autoplay: {
        disableOnInteraction: false, // 是否用户操作以后停止自动切换
        delay: 3000 // 切换间隔时间
      },
      slidesPerView: 'auto', // 轮播条数
      // loop: true, // 是否循环
      direction: 'vertical', // 竖向切换vertical   横向为horizontal
      speed: 100 // 切换过渡时间
    },
    componentConfig: { // 组件配置
      tableList: [ // 列表内容
        ['1', '东湖', '1111', '20'],
        ['2', '磨山', '1111', '20'],
        ['3', '绿道', '1111', '20'],
        ['4', '园博园', '1111', '20'],
        ['5', '东湖', '1111', '20'],
        ['6', '东湖', '1111', '20'],
        ['7', '东湖', '1111', '20'],
        ['8', '东湖', '1111', '20'],
        ['9', '东湖', '1111', '20'],
        ['10', '东湖', '1111', '20'],
        ['11', '东湖', '1111', '20'],
        ['12', '东湖', '1111', '20']
      ],
      headStyle: [ // 列样式及表头名称
        {
          width: 400 / 4, // 表头宽,表格总宽除以列数
          name: '排名', // 表头名称
          backgroundColor: 'rgba(255, 255, 255, 0)' // 列的背景色 ,在行的优先级之上
        },
        {
          width: 400 / 4, // 表头宽,表格总宽除以列数
          name: '景点名称', // 表头名称
          backgroundColor: 'rgba(255, 255, 255, 0)' // 列的背景色
        },
        {
          width: 400 / 4, // 表头宽,表格总宽除以列数
          name: '人数', // 表头名称
          backgroundColor: 'rgba(255, 255, 255, 0)' // 列的背景色
        },
        {
          width: 400 / 4, // 表头宽,表格总宽除以列数
          name: '负荷度', // 表头名称
          backgroundColor: 'rgba(255, 255, 255, 0)' // 列的背景色
        }
      ],
      cellStyle: { // 单元格
        head: Object.assign({}, common.fontObj, { // 表头
          backgroundColor: 'rgba(255, 255, 255, 0)', // 背景
          lineHeight: 20, // 文字行高
          textAlign: 'center',
          fontSize: 14,
          color: '#55c8fe'
        }),
        body: Object.assign({}, common.fontObj, { // 内容
          lineHeight: 20, // 文字行高
          fontSize: 14,
          textAlign: 'center'
        }),
        margin: { // 单元格外边距
          h: 1,
          w: 1
        },
        row: { // 单元格奇偶行背景色
          odd: 'rgba(144, 238, 144, 1)',
          even: 'rgba(255, 69, 0, 0.68)'
        }
      }
    }
  },
  '2401': { // 时间轴
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 60, width: 500}),
    componentConfig: { // 组件配置
      title: Object.assign({}, common.fontObj, { // 内容字体
        background: 'rgba(255, 255, 255, 0)', // 内容背景
        letterSpacing: 0, // 文字间距
        lineHeight: 20, // 文字行高
        fontSize: 14
      }),
      line: { // 轴线
        borderStyle: 'solid', // 边框样式  点:dotted 实:solid 虚:dashed
        borderColor: '#000', // 边框颜色
        borderWidth: 2, // 边框线宽
        nodeSize: 10, // 节点大小
        backgroundColor: '#000' // 节点颜色
      },
      data: [
        {time: '2018-06-25', text: '事件1'},
        {time: '2018-06-26', text: '事件2'},
        {time: '2018-06-27', text: '事件3'},
        {time: '2018-06-28', text: '事件4'},
        {time: '2018-06-29', text: '事件5'},
        {time: '2018-06-30', text: '事件6'},
        {time: '2018-07-01', text: '事件7'}
      ]
    }
  },
  '2501': { // 时间控件
    type: 2, // 1图表   2小组件  3筛选器   4素材    5主题
    currency: Object.assign({}, common.currency, {height: 30, width: 370}),
    componentConfig: { // 组件配置
      quota: Object.assign({}, common.fontObj, {
        background: '', // 指标背景
        textAlign: 'center', // 文字水平位置
        marginVal: 1, // 指标文字间隔
        color: 'rgba(93, 202, 248, 1)',
        value: ['2', '0', '1', '8', '-', '0', '8', '-', '0', '6', ' ', '1', '0', ':', '0', '0', ':', '0', '0'] // 时间
      })
    }
  }
}
