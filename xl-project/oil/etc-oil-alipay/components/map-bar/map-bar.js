// components/map-bar/map-bar.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    props: {
        list:["加油","洗车"],
        selected_index: 0
    },

    /**
     * 组件的初始数据
     */
    data: {
        height:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //返回按钮
        onBackClick:function(){
            my.navigateBack();
        },
        onMenuClick:function(index){
            this.props.onMenuClick(index)
        }
    },
    didMount() {
        // 标题栏高度
        let {titleBarHeight} = app.globalData;
        this.setData({
            height: titleBarHeight
        })
    }
})
