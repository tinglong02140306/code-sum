// pages/station/components/perferents/perferent-container/perferent-container.js
Component({
    /**
     * 组件的属性列表
     */
    props: {
        list: []
    },
    didMount() {
        this.dealData();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onCheckClick(selectIndex) {
            const list = this.props.list;
            const data = list && list.map((item, index) => {
                if (index == selectIndex) {
                    item.isCheck = !item.isCheck;
                } else {
                    item.isCheck = false;
                }
                return item;
            });
            this.setData({
                list: data
            });
            const params = {
                index: selectIndex,
                status: data[selectIndex].isCheck
            }
            this.props.onCheckPergerent(params, data);
        },
        onRuleClick(selectIndex) {
            const {
                list
            } = this.data;
            const data = list && list.map((item, index) => {
                if (index == selectIndex) {
                    item.isOpen = !item.isOpen;
                } else {
                    item.isOpen = false;
                }
                return item;
            });
            this.setData({
                list: data
            });
        },
        dealData() {
            let data = this.props.list;
            if(data.length > 0) {
                data = data && data.map(item => {
                    if(!item.isOpen) item.isOpen = false;
                    if(!item.isCheck) item.isCheck = false;
                    return item;
                });
                this.setData({
                    list: data
                });
            }
        }
    }
})