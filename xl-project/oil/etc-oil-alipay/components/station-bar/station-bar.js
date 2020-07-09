// components/station-bar/station-bar.js
const app = getApp();
// let titleBarHeight = app.globalData.titleBarHeight;
Component({
    /**
     * 组件的属性列表
     */
    props: {
        list: ["加油", "洗车"],
        titleBarHeight: '',
        page_type: 0,
    },

    /**
     * 组件的初始数据
     */
    data: {
        height: ''
    },
    didMount() {
        this.setData({
            height: app.globalData.titleBarHeight
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onMenuClick(index) {
            this.props.onClick(index)
        }
    }
})