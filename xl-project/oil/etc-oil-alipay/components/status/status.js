// components/status/status.js
Component({
    /**
     * 组件的属性列表
     */
    props: {
        //1:列表为空 2:网络连接失败
        type: 1,
        url: "/assets/static/empty.png",
        text: "数据为空哦～"
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //重新加载
        onRetryClick() {
            this.props.onRetryClick()
        }
    }
})