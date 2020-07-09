const animation = my.createAnimation({
    duration: 150,
    timingFunction: 'linear',
    delay: 0,
});
Component({
  mixins: [],
  data: {
    curIndexValue: [0,0],
    height: 0,
    animation: null
  },
  props: {
    show: false,
    indexValue: [0,0],
    multiArray: [],
  },
  didMount() {
  },
  methods: {
    onChange(e) {
        this.setData({
            curIndexValue: e.detail.value
        })
    },
    // 取消点击事件
    cancelEvt() {
        this.props.onConfirmClick({show: false,type: 0})
    },
    // 确认点击事件
    confirmEvt() {
        let val = this.data.curIndexValue,
            multiArray = this.props.multiArray,
            text;
        text = multiArray[0][val[0]] + multiArray[1][val[1]];
        let obj = {
            show: false, 
            indexValue: val,
            headerText: text,
            type: 1
        }
        this.props.onConfirmClick(obj)
    }
  },
});
