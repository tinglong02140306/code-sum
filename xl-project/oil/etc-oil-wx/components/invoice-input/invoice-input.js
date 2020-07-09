
Component({
    properties:{
        label:{
            value:"标题",
            type:String
        },
        labelStyle:String,
        inputStyle:String,
        placeholder:{//输入框为空时占位符
            value:"请输入",
            type:String
        },
        value:String,//输入框的内容
        type:{//input 的类型
            value:"text",
            type:String
        },
        password:{//是否是密码类型
            value:false,
            type:Boolean
        },
        disabled:{//是否禁用
            value:false,
            type:Boolean
        },
        maxlength:{//最大输入长度，设置为 -1 的时候不限制最大长度
            value:140,
            type:Number
        },
        focus:{//获取焦点
            value:false,
            type:Boolean
        },
        selectionStart:{//光标起始位置，自动聚集时有效，需与selection-end搭配使用
            value:-1,
            type:Number
        },
        selectionEnd:{//光标结束位置，自动聚集时有效，需与selection-start搭配使用
            value:-1,
            type:Number
        },
        input_type:{
            value:1,//1:input 0 :textarea
            type:Number
        }
    },
    behaviors: ['wx://form-field'],//使自定义组件有类似于表单控件的行为
    data:{
        // valueInput:""
    },
    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    methods:{
        //键盘输入时触发
        bindInput:function(e){
            let value = e.detail.value;
            this.setData({value:value})
            this.triggerEvent('inputObserver',value)
        },
        //item点击事件
        bindItemClick:function(){
            this.triggerEvent('ItemClick', {})
        }
    }
})