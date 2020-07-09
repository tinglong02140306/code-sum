// components/status/status.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title_name:{
            type:String,
            value:'',//抬头名称
        },
        tax_register_no:{
            type:String,
            value:'',//纳税人识别号
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        //点击选择
        onSelectClick:function(){
            this.triggerEvent('select');
        }
    }
})
