// pages/mine/invoice/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 加油消费开票
   */
  oilInvoiceClick() {
    my.navigateTo({
      url: '/pages/mine/invoice/consume/consume'
    })
  },

  /**
   * 开票历史
   */
  invoiceHistoryClick() {
    my.navigateTo({
      url: '/pages/mine/invoice/history/history'
    })
  },
  
  
})