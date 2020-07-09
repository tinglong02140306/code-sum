/**
 * @description: 共用方法
 * @author：胡曦晓
 * @email: xxhu4@iflytek.com
 * @time:  2018/6/15
 */
import $ from 'jquery'
var tool = {}
// 正则
tool.regexps = {
  square: /\[(.*?)\]/g, // 匹配中括号
  int: /^(0|\+?[1-9][0-9]*)$/ // 验证大于等于0
}
// 色板预订颜色
tool.predefineColors = [ // 预订颜色
  'rgba(255, 255, 255, 0)',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]
// 判断两个对象是否相等
tool.objEqual = function (obj1, obj2) {
  for (var i in obj1) {
    if (obj1.hasOwnProperty(i) && obj2.hasOwnProperty(i)) {
      if (obj1[i] !== obj2[i]) {
        return false
      }
    }
  }
  return true
}
// 生成随机数
tool.randomNum = function (minNum, maxNum) { // 区间下限,上限
  return Math.round(Math.random() * (maxNum - minNum) + minNum)
}
// 设置模板筛选器关联图表list
tool.setAssociationChartArr = function (_this, itemType) {
  let [datasetId, datasetRelationChart, dashboardList] = [_this.columnObj.datasetInfo.dataSetId, _this.$store.state.datasetRelationChart, _this.$store.state.dashboardList]
  for (let j = 0; j < datasetRelationChart.length; j++) {
    if (datasetRelationChart[j].id === datasetId) {
      let [associationChartArr, linkageChartArr, filterArr] = [datasetRelationChart[j].children, [], tool.getDataArrayByArr(dashboardList, 'itemType', itemType)]
      filterArr.map((it) => { // 获取已关联图表的集合
        linkageChartArr = linkageChartArr.concat(it.dataConfig.LinkageChart)
      })
      associationChartArr.forEach((it) => {
        if (linkageChartArr.indexOf(it.id) === -1) { // 判断图表有没有关联其他同类筛选器
          it.disabled = true
        } else {
          it.disabled = false
        }
      })
      _this.associationChartArr = associationChartArr
    }
  }
}
// 点击数据集获取对应维度度量字段
tool.getAllField = function (_this, id) {
  _this.$api.dragControl_getFeild({dataSetId: id}).then(data => {
    if (data.flag) {
      _this.$store.commit('setColumnObj', { // 更新维度度量字段
        dimColumnInfo: data.data.dimColumnInfo,
        metColumnInfo: data.data.metColumnInfo,
        datasetInfo: data.data.dataSetInfo
      })
    } else {
      _this.$notify({title: '警告', message: data.message, type: 'warning'})
    }
  })
}
// 获取已选维度度量字段
tool.getColumns = function (obj) {
  let columns = []
  // 添加维度字段
  for (let i = 0; i < obj.selectedDimensionField.length; i++) {
    columns.push({'columnname': obj.selectedDimensionField[i].columnName, 'columntype': obj.selectedDimensionField[i].columnType, 'mord': 'd'})
  }
  // 添加度量字段
  for (let i = 0; i < obj.selectedMeasureField.length; i++) {
    columns.push({'columnname': obj.selectedMeasureField[i].columnName, 'columntype': obj.selectedMeasureField[i].columnType, 'mord': 'm'})
  }
  for (let i = 0; i < obj.selectedColorField.length; i++) {
    columns.push({'columnname': obj.selectedColorField[i].columnName, 'columntype': obj.selectedColorField[i].columnType, 'mord': 'm'})
  }
  for (let i = 0; i < obj.selectedSizeField.length; i++) {
    columns.push({'columnname': obj.selectedSizeField[i].columnName, 'columntype': obj.selectedSizeField[i].columnType, 'mord': 'm'})
  }
  return columns
}
// 更新图表数据
tool.updateChartData = function (_this, d, type, index) { // this对象,接口返回数据,图表编号,图表下标
  let [dashboardList, xyAxisArr, seriesArr, arr, series] = [_this.$store.state.dashboardList, [], [], [], []]
  if (type === '1101' || type === '1102' || type === '1102' || type === '1201' || type === '1202' || type === '1203' || type === '1102' || type === '1103' || type === '1301' || type === '1302' || type === '1303' || type === '1501') { // 坐标轴图
    if (type === '1501' && dashboardList[index].currency.selectedSizeField.length) { // 散点图 && 有尺寸字段
      for (let i = 0; i < d.columns.length - 1; i++) {
        arr = []
        for (let j = 0; j < d.rows.length; j++) {
          if (i === 0) {
            arr.push(d.rows[j][d.columns[i]])
          } else {
            arr.push([j, d.rows[j][d.columns[i]], d.rows[j][d.columns[d.columns.length - 1]]]) // 维度下标 , 度量 , 尺寸度量
          }
        }
        if (i === 0) {
          xyAxisArr = arr
        } else {
          seriesArr.push(arr)
        }
      }
      for (let k = 0; k < seriesArr.length; k++) { // 获取当前样式组装series
        series.push(Object.assign({}, dashboardList[index].options.series[0], {name: d.columns[k + 1], data: seriesArr[k], symbolSize: (val) => { return val[2] }}))
      }
      Object.assign(dashboardList[index].options.tooltip, {formatter: function (params) {
        return params[0].axisValue + '<br>' + d.columns[d.columns.length - 1] + ':' + params[0].value[2]
      }})
    } else if ((type === '1101' || type === '1201') && dashboardList[index].currency.selectedColorField.length) { // 基础柱状或条形 && 有颜色字段
      _this.$api.dashbordEdit_getFieldRange(_this.$qs.stringify({
        tmptable: dashboardList[index].currency.datasetInfo.tmpTableName,
        columnname: dashboardList[index].currency.selectedColorField[0].columnName
      })).then((data) => {
        if (data.flag) {
          let d = JSON.parse(data.data)
          Object.assign(dashboardList[index].options.visualMap, {min: d.easy.rows[0].min * 1, max: d.easy.rows[0].max * 1})
        } else {
          _this.$notify({title: '警告', message: data.message, type: 'warning'})
        }
      })
      arr = []
      for (let j = 0; j < d.rows.length; j++) {
        arr.push(d.rows[j][d.columns[0]])
      }
      xyAxisArr = arr
      let [seriesData] = [[]]
      dashboardList[index].options.visualMap.text = [d.columns[d.columns.length - 1]]
      for (let j = 0; j < d.rows.length; j++) {
        arr = [j, d.rows[j][d.columns[1]], d.rows[j][d.columns[d.columns.length - 1]]]
        seriesData.push(arr)
      }
      series.push(Object.assign({}, dashboardList[index].options.series[0], {name: d.columns[1], data: seriesData}))
    } else {
      for (let i = 0; i < d.columns.length; i++) {
        arr = []
        for (let j = 0; j < d.rows.length; j++) {
          arr.push(d.rows[j][d.columns[i]])
        }
        if (i === 0) {
          xyAxisArr = arr
        } else {
          seriesArr.push(arr)
        }
      }
      if (type === '1501') { // 还原散点图配置
        for (let k = 0; k < seriesArr.length; k++) { // 获取当前样式组装series
          series.push(Object.assign({}, dashboardList[index].options.series[0], {name: d.columns[k + 1], data: seriesArr[k], symbolSize: 10}))
        }
        if (_this.tooltipConfig) Object.assign(_this.tooltipConfig, {formatter: null})
      } else {
        for (let k = 0; k < seriesArr.length; k++) { // 获取当前样式组装series
          series.push(Object.assign({}, dashboardList[index].options.series[0], {name: d.columns[k + 1], data: seriesArr[k]}))
        }
      }
    }
    dashboardList[index].options.series = series // 图例赋值
    Object.assign(dashboardList[index].options.xyAxis, {data: xyAxisArr}) // 坐标轴赋值
    dashboardList[index].chartData = d
    // if (_this.seriesLabelConfig) _this.seriesLabelConfig = dashboardList[index].options.series[0] // 数据绑定配置
  } else if (type === '1401' || type === '1402') { // 饼图
    for (var i = 0; i < d.rows.length; i++) {
      series.push({name: d.rows[i][d.columns[0]], value: d.rows[i][d.columns[1]]})
    }
    dashboardList[index].options.series[0].data = series // 数据绑定赋值
    dashboardList[index].chartData = d // 数据赋值
  } else if (type === '1601') { // 模板
    dashboardList[index].options.series[0].data = [{value: d.rows[0][d.columns[0]], name: d.columns[0]}]
    dashboardList[index].options.series[0].name = d.columns[0]
  } else if (type === '2301') { // 列表
    let [tableList, headStyle, arr] = [[], [], []]
    for (let i = 0; i < d.columns.length; i++) {
      headStyle.push({
        width: 400 / d.columns.length,
        name: d.columns[i],
        backgroundColor: 'rgba(255, 255, 255, 0)'
      })
    }
    for (let i = 0; i < d.rows.length; i++) {
      arr = []
      for (let j = 0; j < d.columns.length; j++) {
        arr.push(d.rows[i][d.columns[j]])
      }
      tableList.push(arr)
    }
    dashboardList[index].componentConfig.tableList = tableList
    dashboardList[index].componentConfig.headStyle = headStyle
    // if (_this.headStyle) _this.headStyle = headStyle
  } else if (type === '2101' || type === '2102') { // 指标卡
    let [sum] = [0]
    for (let i = 0; i < d.rows.length; i++) {
      sum += d.rows[i][d.columns[1]] * 1
    }
    if (type === '2101') {
      dashboardList[index].componentConfig.quota.value = sum
    } else {
      dashboardList[index].componentConfig.quota.value = tool.formatNumber(sum).split('')
    }
  }
}
// 拖拽
tool.draggable = function (ele, scale, end) { // jq元素,缩放比例,回调函数
  let arr = ['el-slider__bar', 'ui-resizable-handle', 'el-slider__button', 'el-slider__button-wrapper'] // 模板拖拽黑名单class,带这些class的都不会拖拽
  ele.mousedown(function (e) {
    let $target = $(e.target || e.srcElement)
    for (var i = 0; i < arr.length; i++) {
      if ($target.hasClass(arr[i])) return
    }
    if (!$(this).hasClass('present')) return
    let [positionDiv] = [$(this).position()]
    let [distenceX, distenceY, x, y] = [e.clientX - positionDiv.left, e.clientY - positionDiv.top, positionDiv.left, positionDiv.top]
    $(document).mousemove(function (e) {
      x = (e.clientX - distenceX) / scale
      y = (e.clientY - distenceY) / scale
      if (x < 0) {
        x = 0
      } else if (x > ele.parent().outerWidth() - ele.outerWidth()) {
        x = ele.parent().outerWidth() - ele.outerWidth()
      }
      if (y < 0) {
        y = 0
      } else if (y > ele.parent().outerHeight() - ele.outerHeight()) {
        y = ele.parent().outerHeight() - ele.outerHeight()
      }
      ele.css({'left': x + 'px', 'top': y + 'px'})
    })
    $(document).mouseup(function () {
      end && end(x, y)
      $(document).off('mousemove')
      $(document).off('mouseup')
    })
  })
}
// 获取鼠标在输入框的位置
tool.getMousePosition = function (ele) { // 原生元素
  var CaretPos = 0
  if (document.selection) { // IE Support
    ele.focus()
    var Sel = document.selection.createRange()
    Sel.moveStart('character', -ele.value.length)
    CaretPos = Sel.text.length
  } else if (ele.selectionStart || ele.selectionStart === 0) { // Firefox support
    CaretPos = ele.selectionStart
  }
  return CaretPos
}
// 设置光标在输入框的位置
tool.setMousePosition = function (ele, spos) { // 原生元素 , 要在的位置的下标
  if (spos < 0) spos = ele.value.length
  if (ele.setSelectionRange) { // 兼容火狐,谷歌
    setTimeout(function () {
      ele.setSelectionRange(spos, spos)
      ele.focus()
    }, 10)
  } else if (ele.createTextRange) { // 兼容IE
    var rng = ele.createTextRange()
    rng.move('character', spos)
    rng.select()
  }
}
// 空函数调用,用于避免ESLint报错
tool.emptyFun = function () {}
// canvas生成图片下载
tool.saveImg = function (data, filename) {
  var imgUri = data.toDataURL('image/png').replace('image/png', 'image/octet-stream') // 获取生成的图片的url
  var saveLink = document.createElement('a')
  saveLink.href = imgUri
  saveLink.download = filename
  saveLink.click()
}
// 数组中寻找对应字段,有返回字段下标集合数组
tool.arrIndexOf = function (arr, str) {
  var a = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === str) {
      a.push(i)
    } else {
      continue
    }
  }
  return a
}
// 对象数组中取得指定属性值,返回属性数组
tool.getDataArrayByName = function (data, name) {
  var array = []
  for (var i = 0; i < data.length; i++) {
    array.push(data[i][name])
  }
  return array
}
// 对象数组以某个字段作为标记,配置对应项,返回对应项对象
tool.getDataArrayByObj = function (data, str, sign, flag) { // 对象数组,标记字段,查询字段,是否引用传递
  for (var i = 0; i < data.length; i++) {
    if (data[i][str] * 1 === sign * 1) {
      if (flag) {
        return data[i]
      } else {
        return tool.deepCopy(data[i])
      }
    }
  }
}
// 对象数组以某个字段作为标记,配置对应项,返回匹配的项数组
tool.getDataArrayByArr = function (data, str, sign) { // 对象数组,标记字段,查询字段
  let arr = []
  for (var i = 0; i < data.length; i++) {
    if (data[i][str] === sign) {
      arr.push(data[i])
    }
  }
  return arr
}
// 设置元素可拖拽
tool.setEleDrag = function (i, _this) {
  let [d] = [_this.$store.state.dashboardList]
  window.setTimeout(function () {
    let [dashbordItem] = [$('.dashbordItem')]
    d.forEach(function (item, j) { // 去掉所有选中状态
      item.present = false
    })
    d[i].present = true
    // setTimeout(() => {
    // d[i].chartObj = echartsObj[d[i].sign] // echarts图生成有可能有延迟
    // }, 500)
    tool.draggable(
      dashbordItem.eq(i),
      _this.$store.state.zoomValue,
      function (x, y) {
        _this.$store.state.dashboardList[i].currency.left = x
        _this.$store.state.dashboardList[i].currency.top = y
      }
    )
    dashbordItem.find('.ui-resizable-handle').hide() // 隐藏所有缩放DOM
    if (dashbordItem.eq(i).find('.ui-resizable-handle').length) {
      dashbordItem.eq(i).find('.ui-resizable-handle').show()
    } else {
      dashbordItem.eq(i).resizable({ // 添加缩放回调
        resize: (a) => {
          _this.$store.state.dashboardList[i].currency.height = a.target.clientHeight
          _this.$store.state.dashboardList[i].currency.width = a.target.clientWidth
          d[i].chartObj && d[i].chartObj.resize()
        }
      })
    }
  }, 100)
}
// 复制文本
tool.copyText = function (t) {
  let oInput = document.createElement('input')
  oInput.value = t
  document.body.appendChild(oInput)
  oInput.select() // 选择对象
  document.execCommand('Copy') // 执行浏览器复制命令
  oInput.className = 'oInput'
  oInput.style.display = 'none'
}
// 判断对象是否为空
tool.objIsEmpty = function (obj) {
  for (var i in obj) {
    return false
  }
  return true
}
// 去重函数
tool.removalRepeat = function (arr, str) { // 数组    key名单纯数组可不传
  var [obj, newArr] = [{}, []]
  if (str) {
    for (let i = 0; i < arr.length; i++) {
      if (obj[arr[i][str]]) {
        continue
      } else {
        obj[arr[i][str]] = true
        newArr.push(arr[i])
      }
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (obj[arr[i]]) {
        continue
      } else {
        obj[arr[i]] = true
        newArr.push(arr[i])
      }
    }
  }
  return newArr
}
// 对于数字每三位一个逗号 例如：123456789转成12,345,678
tool.formatNumber = function (number) {
  // 如果数据为null,则用0代替
  if (number === null || number === undefined || number === '0') {
    return '0'
  } else {
    let [b, retNum] = [parseInt(number).toString(), '']
    let absB = (b < 0 ? Math.abs(b) : b).toString()
    let len = absB.length
    if (len <= 3 && b > 0) {
      return b
    } else if (len > 3) {
      var r = len % 3
      retNum = r > 0 ? absB.slice(0, r) + ',' + absB.slice(r, len).match(/\d{3}/g).join(',') : absB.slice(r, len).match(/\d{3}/g).join(',')
      if (b < 0) {
        retNum = '-' + retNum
      }
    }
    return retNum
  }
}
// 克隆函数
tool.deepCopy = function (obj) {
  if (typeof obj === 'object' && obj) { // 去null
    var newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {} // 万能的,较复杂,Object.prototype.toString取得对象的一个内部属性[[Class]],call改变指向取当前对象
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) { // 判断i是否是对象的属性,避免本地原型扩展而引起的错误
        continue
      }
      if (typeof obj[i] === 'object' && obj[i]) { // 去null
        newObj[i] = tool.deepCopy(obj[i])
      } else {
        newObj[i] = obj[i]
      }
    }
    return newObj
  } else {
    return obj
  }
}
tool.deleteArray = function (arr, contain) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].pvalue !== '') {
      contain.push(arr[i])
    }
  }
}
tool.copyArray = function (arr) {
  return arr.map((e) => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}
tool.formatObject = function (obj) {
  for (let item in obj) {
    obj[item] = ''
  }
}
tool.funCodeList = { // 新增维度与度量函数参数统计
  oneParam: ['F00200', 'F00201', 'F00300', 'F00100', 'F00101'], // 一个参数的函数
  twoParam: ['F00202'], // 两个参数的函数
  paramsTypeIsInt: ['F00202', 'F00100', 'F00101'] // 函数参数必须为数字
}
tool.formatDate = function (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  function padLeftZero (str) {
    return ('00' + str).substr(str.length)
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
export default tool
