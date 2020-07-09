Component({
    properties: {
        showKeyBord:{
            type:Boolean,
            value:true,
        },
        password:{
            type:String,
            value:'',
        },
        value:{
            type:String,
            value:'',
        },

    },

    /**
     * 组件的初始数据
     */
    data: {
        focusIndex: 0, // 光标所在位置
        value: '', // 实际输入的值
        focus: true, // 是否获得焦点
        password: '', //替换显示的值*
    },
    /**
     * 组件的方法列表
     */
    methods: {
        setValue (e) {
            // 设置光标
            let value = e.detail.value
            this.setData({
                value: value,
                focusIndex: value.length,
                focus: value.length < 6,
                password: value,
            })
        },
        inputBlur (e) {
            if (e.detail.value.length === 6) {
                this.triggerEvent('complated', {value: e.detail.value})
            }
        }
    }
})