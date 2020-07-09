
Component({
    props:{
        label:"标题",
        labelStyle:"",
        inputStyle:"",
        //输入框为空时占位符
        placeholder:"请输入",
        //输入框的内容
        value:"",
        //input 的类型
        type:"text",
        //是否是密码类型
        password:false,
        //是否禁用
        disabled:false,
        //最大输入长度，设置为 -1 的时候不限制最大长度
        maxlength:140,
        //获取焦点
        focus: false,
        //光标起始位置，自动聚集时有效，需与selection-end搭配使用
        selectionStart:-1,
        //光标结束位置，自动聚集时有效，需与selection-start搭配使用
        selectionEnd: -1,
        //1:input 0 :textarea
        input_type:1
    },
    // behaviors: ['a://form-field'],//使自定义组件有类似于表单控件的行为
    data:{},
    methods:{
        //键盘输入时触发
        bindInput:function(e){
            let value = e.detail.value;
            this.setData({value:value});
            this.props.onInputObserver(value);
        },
        //item点击事件
        bindItemClick:function(){
            this.props.onInputObserver('');
        }
    }
})