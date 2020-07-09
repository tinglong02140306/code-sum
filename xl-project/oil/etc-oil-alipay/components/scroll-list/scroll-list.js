/*
 * @Author: sunmingmao
 * @Date: 2020-03-26 14:44:21
 * @LastEditors: longting
 * @LastEditTime: 2020-04-14 14:47:17
 * @Description: 
 */
// components/scroll-list/scroll-list.js
Component({
    /**
     * 组件的属性列表
     */
    props: {
        width: "100vw",
        height: "100vh",
        //设置自定义下拉刷新阈值
        refresher_threshold: 45,
        //设置自定义下拉刷新默认样式 black | white | none
        refresher_default_style: "black",
        //设置自定义下拉刷新区域背景颜色
        refresher_background: "#f8f8f8",
        //当前下拉刷新状态
        refresher_triggered: false,
        //0: 已加载完成 1:正在加载中 2:已加载全部
        load_status: 0,
        //是否显示已加载全部
        show_finish: true
    },

    /**
     * 组件的初始数据
     */
    data: {},
    /**
     * 组件的方法列表
     */
    methods: {
        //下拉刷新被触发  -- 支付宝好像没有下拉刷新功能
        onRefresh() {
            this.props.onRefresh()
        },
        //上拉加载被触发
        onLoadMore() {
            if (this.props.load_status != 2) {
                this.props.onLoadMore()
            }
        }
    }
})