const app = getApp();
Page({
    data: {
        list: [{
            text: '本期账单',
        }, {
            text: '未出账单',
        }, {
            text: '历史账单',
        }, {
            text: '消费明细',
        }]
    },
    onItemClick(e) {
        let index = e.detail.index,
            url = '';
        switch (index) {
            case 0:
                url = "/pages/bill/current-bill/current-bill?type=current";
                break;
            case 1:
                url = "/pages/bill/current-bill/current-bill?type=unpaid";
                break;
            case 2:
                url = "/pages/bill/history-bill/history-bill";
                break;
            case 3:
                url = "/pages/bill/bill-detail/bill-detail";
                break;
            default:
                break;
        }
        my.navigateTo({
            url: url
        });
    },
    async onShow() {},
    async onLoad() {}
});