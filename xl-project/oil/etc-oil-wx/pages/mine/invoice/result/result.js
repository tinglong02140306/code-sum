// pages/mine/invoice/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result_image:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/apply-invoice-s1570766157958.png',
    result:"开具成功",
    isSuccess:false,
    order_no:'',
    image_path:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try{
      if(options&&options.result){
        const {isSuccess,order_no,is_apply_invoice,image_path} = JSON.parse(decodeURIComponent(options.result));
        if(isSuccess){
          this.setData({
            result_image:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/apply-invoice-s1570766157958.png',
            result:"开具成功",
            isSuccess:true,
            order_no:order_no,
            image_path:image_path
          });
          this.dealPrePageData(order_no,is_apply_invoice,image_path);
        }else{
          this.setData({
            result_image:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/apply-invoice-fail1570766119624.png',
            result:"开具失败",
            isSuccess:false
          });
        }
      }
    }catch (e) {
      wx.switchTab({url: '/pages/home/index/index'});
    }

  },

  //开具发票成功 修改账单列表中的数据
  dealPrePageData:function(order_no,is_apply_invoice,image_path){
    const pages = getCurrentPages();
    if(pages.length>=2){
      const prePage = pages[pages.length-2];
      if(prePage.route=="pages/bills/list/list"){
        const {bill_list} = prePage.data;
        for (const item of bill_list) {
          if(item.order_no==order_no){
            item.is_apply_invoice=is_apply_invoice;
            item.image_path = image_path
            break;
          }
        }
        prePage.setData({bill_list:bill_list});
      }else if (prePage.route == "pages/bills/details/details") {
        prePage.setData({
          image_path:image_path,
          is_apply_invoice:true
        });
        const listPage = pages[pages.length-3];
        const {bill_list} = listPage.data;
        for (const item of bill_list) {
          if(item.order_no==order_no){
            item.is_apply_invoice=is_apply_invoice;
            item.image_path = image_path
            break;
          }
        }
        listPage.setData({bill_list:bill_list});
      }
    }
  },

  //查看发票
  onSeeInvoiceClick:function(){
    const {image_path} = this.data;
    wx.previewImage({
      urls:[image_path]
    });
  },

  //返回重开
  onResendClick:function(){
    wx.navigateBack();
  },

  //开票历史
  onHistoryClick:function(){
    wx.navigateTo({
      url: '/pages/mine/invoice/history/history'
    });
  },


})