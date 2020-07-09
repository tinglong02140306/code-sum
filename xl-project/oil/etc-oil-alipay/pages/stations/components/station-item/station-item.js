/*
 * @Author: longting
 * @Date: 2020-05-19 
 * @LastEditors: longting
 * @LastEditTime: 2020-05-19 
 * @Description: station-list
 */
Component({
    /**
     * 组件的属性列表
     */
    props: {
        item: {},
        openid: '',
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onStationClick(e) {
            this.props.onStationClick(e.currentTarget.dataset.item);
        },
        onPayClick(e) {
            this.props.onPayClick(e.currentTarget.dataset.item)
        },
        onNavigationClick(e) {
            debugger
            this.props.onNavigationClick(e.currentTarget.dataset.item)
        }
    }
})
