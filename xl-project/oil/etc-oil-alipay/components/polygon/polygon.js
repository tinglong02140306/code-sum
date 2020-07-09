// pages/activity/component/polygon/polygon.js
Component({
    /**
     * 组件的属性列表
     */
    props: {
        type: 0
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onTabClick(e) {
            this.setData({
                type: e.currentTarget.dataset.type
            })
        }
    }
})