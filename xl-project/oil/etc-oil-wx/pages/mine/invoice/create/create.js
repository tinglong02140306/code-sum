// pages/mine/invoice/create/create.js
import {getHttpPost} from "../../../../http/http";
import {billApi, invoiceApi} from "../../../../http/api";
const app = getApp();
import {checkBankNo, checkMobile} from "../../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:app.globalData.isIphoneX,
    from:1,//1:账单开票；2：发票历史重开
    invoice_title_type:0,//抬头类型（0：单位，1：个人）
    more:false,
    icon_select:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/icon-payment-select1577433055460.png',
    icon_un_select:'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon-payment-un-select.png',
    push:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/apply-invoice-push1570766099041.png',
    pull:'https://oilmag.etcsd.com.cn/oilcoreserver/static//resource/apply-invoice-pull1570766088707.png',
    etc_card_no:'',//ETC卡号
    order_no:'',//订单号
    bill_order_no:'',//消费订单号(重开发票)
    invoice_title:'',//发票抬头
    invoice_detail:'',//发票内容
    invoice_tax_no:'',//税号
    accept_email:'',//邮箱地址
    buyer_mobile:'',//购买方手机号
    buyer_address:'',//购买方地址
    bank_name:'',//开户行
    bank_account:'',//账户
    form_id:'',
    titleList:[],
    isShowTitle:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
     const params = JSON.parse(decodeURIComponent(options.details));
      this.setData({
          from:params.from,
          invoice_total_money:params.invoice_total_money,
          etc_card_no:params.etc_card_no,
          invoice_detail:params.invoice_detail,
          order_no:params.order_no,
        bill_order_no:params.bill_order_no,
      });
    } catch (error) {
      wx.switchTab({url: '/pages/home/index/index'});
    }
  },

  //抬头类型
  onChangeType: function (e) {
    const {disabled} = this.data;
    if(!disabled){
      const invoice_title_type = e.currentTarget.dataset.item;
      this.setData({
        invoice_title_type:invoice_title_type,
        // invoice_title:invoice_title_type==0?"个人":""
      });
    }
  },

  //选择发票抬头
  goSelectTitle: function (e) {
    const that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        that.setData({
          invoice_title_type:res.type||'',
          invoice_title:res.title||'',
          invoice_tax_no:res.taxNumber||'',
          buyer_address:res.companyAddress||'',
          buyer_mobile:res.telephone||'',
          bank_name:res.bankName||'',
          bank_account:res.bankAccount||'',
        })
      }
    })
  },

  //更多收起
  onChangeMore: function (e) {
    let isMore = this.data.more;
    this.setData({
      more:!isMore
    })
  },

  /**
   * 发票内容监听事件
   */
  onInvoiceTitleClick:function(e){
    const value = e.detail;
    this.setData({
      invoice_title:value
    });
    if (this.data.invoice_title_type === 0){
      if (value.length>=4){
        this.getCompanyInvoice(value);
      }
    }
  },

  onInvoiceDetailClick:function(e){
    const value = e.detail;
    this.setData({
      invoice_detail:value
    });
  },
  onInvoiceTaxNoClick:function(e){
    const value = e.detail;
    this.setData({
      invoice_tax_no:value
    });
  },
  onBuyerAddressClick:function(e){
    const value = e.detail;
    this.setData({
      buyer_address:value
    });
  },
  onBuyerMobileClick:function(e){
    const value = e.detail;
    this.setData({
      buyer_mobile:value
    });
  },
  onBankNameClick:function(e){
    const value = e.detail;
    this.setData({
      bank_name:value
    });
  },
  onBankAccountClick:function(e){
    const value = e.detail;
    this.setData({
      bank_account:value
    });
  },
  onAcceptEmailClick:function(e){
    const value = e.detail;
    this.setData({
      accept_email:value
    });
  },

  // 提交开票
  openInvoice:function () {
    const {from,order_no,invoice_title,invoice_detail,bank_name,bank_account,buyer_mobile,form_id} = this.data;
    let title = "";
    if (!order_no){
      title= "订单号为空";
    }else if (!invoice_title){
      title= "请添加发票抬头";
    }else if (!invoice_detail){
      title= "请添加发票内容";
    }else if(bank_account&&!checkBankNo(bank_account)){
      title= "请输入正确的开户账号";
    }else if(buyer_mobile&&(!checkMobile(buyer_mobile))){
      title= "请输入正确的购买方电话";
    }

    if(title){
      wx.showToast({
        title:title,
        icon:'none'
      });
    }else{
        if (from === 2){
            this.getInvoiceOff(order_no);
        }else {
            this.getApplyInvoice(this.data);
        }
    }
  },

  /**
   * 申请发票 网络请求
   */
  getApplyInvoice:function(){

    const {from,etc_card_no,order_no,invoice_title,invoice_detail,invoice_tax_no,accept_email,buyer_mobile,buyer_address,bank_name,bank_account,form_id,bill_order_no} = this.data;
    let order_number = '';
    if (from === 2){
      order_number = bill_order_no;
    }else {
      order_number = order_no;
    }
    const params = {
      // etc_card_no:etc_card_no,
      bill_order_no:order_number,
      invoice_title:invoice_title,
      invoice_detail:invoice_detail,
      invoice_tax_no:invoice_tax_no,
      accept_email:accept_email,
      buyer_mobile:buyer_mobile,
      buyer_address:buyer_address,
      bank_name:bank_name,
      bank_account:bank_account,
      form_id:form_id,
    }
    wx.showLoading({
      title:'正在申请...',
      mask:true
    });
    getHttpPost(invoiceApi.invoiceOpen,params,res=>{
      wx.hideLoading();
      const result = {
        isSuccess:true,
        order_no:this.data.order_no,
        image_path:res.image_path,
        is_apply_invoice:true
      }
      wx.redirectTo({
        url:'/pages/mine/invoice/result/result?result='+encodeURIComponent(JSON.stringify(result))
      });

    },err=>{
      wx.hideLoading();
      wx.showToast({
        title:err.msg,
        icon:'none'
      });
    });
  },

  /**
   * 企业发票抬头查询
   */
  getCompanyInvoice:function(key_word){
    const params = {
      key_word:key_word
    }
    getHttpPost(invoiceApi.invoiceTitle,params,res=>{
      const data = res.data;
      this.setData({
        titleList:data,
        isShowTitle:data.length?true:false
      })
    },fail=>{});
  },
  /**
   * 发票抬头选择
   */
  onTitleClick:function (e) {
    this.setData({
      isShowTitle:false,
      invoice_title:e.currentTarget.dataset.item.title_name,
      invoice_tax_no:e.currentTarget.dataset.item.tax_register_no,
    })
  },

  /**
   * 发票冲红
   */
  getInvoiceOff:function(order_no){

    const params = {bill_order_no:order_no,}
    wx.showLoading({
      title:'正在冲红...',
      mask:true
    });
    getHttpPost(invoiceApi.invoiceOff,params,res=>{
      wx.hideLoading();
      this.getApplyInvoice();
    },err=>{
      wx.hideLoading();
      wx.showToast({
        title:err.msg,
        icon:'none'
      });
    });
  },

})