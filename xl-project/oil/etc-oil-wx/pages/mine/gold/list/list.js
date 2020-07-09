// pages/person/refueling-gold/refueling-gold.js

import {getHttpPost} from "../../../../http/http";
import {accountApi} from "../../../../http/api";

const app = getApp();
let page_num = 1;
const Pagesize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty:true,
    account_balance:0.00,
    defaulted:false,
    balance_list:[],
    loadingState:'',
    isCanLoadMore:false,
    isShowBottom:false,
    last_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page_num = 1;
    this.getBalanceQuery();

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page_num = 1;
    this.getBalanceQuery();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    const {isCanLoadMore,last_list} = this.data;
    if(isCanLoadMore){//加载更多
      page_num++;
      this.setData({
        loadingState:'正在加载中...'
      });
      this.getBalanceQuery();

    }else{//已加载全部
      this.setData({
        loadingState:last_list.length>=5?'已加载全部':'',
        isShowBottom:true
      });
    }

  },
  //设置加油金
  switchChange:function () {
    let defaulted = !this.data.defaulted;
    const params = {
      defaulted: defaulted,
    };
    wx.showLoading({
      mask:true,
      title: '正在提交...',
      icon: 'none'
    });
    getHttpPost(accountApi.balanceSet,params,res=> {
      if (res.result_code === "00000") {
        wx.hideLoading();
        wx.showToast({
          title:"设置成功",
          icon:'none'
        });
        this.setData({defaulted : defaulted});
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.result_msg,
          icon: 'none'
        });

      }
    }, fail => {
      wx.hideLoading();
      wx.showToast({title:fail.msg,icon:"none"});
    })
  },

  //查询加油金列表
  getBalanceQuery:function() {
    const params = {
      page_num: page_num,
      page_size:Pagesize,
    };
    wx.showLoading({mask:true});
    getHttpPost(accountApi.balanceList,params,res=>  {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      const data = res.data;
      this.setData({
        account_balance:res.account_balance,
        defaulted:res.defaulted,
      });
      if(data&&data.length>=Pagesize){//允许加载更多
        this.setData({
          isCanLoadMore:true,
          isShowBottom:false,
        });
      }else{//不允许加载更多
        this.setData({
          isCanLoadMore:false,
          isShowBottom:true,
        });
      }
      if(page_num===1){
        this.setData({
          balance_list:data,
        });
      }else{
        const dataList = this.data.balance_list.concat(data);
        this.setData({
          balance_list:dataList,
        });
      }
      if(this.data.balance_list&&this.data.balance_list.length){
        this.setData({
          isEmpty:false,
        });
      }else {
        this.setData({isEmpty:true,})
      }

    }, fail => {
      wx.hideLoading();
      wx.showToast({title:fail.msg,icon:"none"});
    })

    // let res=respose;
    //   this.setData({
    //       account_balance:respose.account_balance,
    //       default:respose.default,
    //       balance_list:respose.data,
    //   });


  }

});


// const respose={
//     account_balance:660.00,
//     default:true,
//     data:[
//         {
//             account_log_id:1,
//             order_no:1,
//             amount:200.00,
//             flow_type:1,
//             create_time:"2019-06-25",
//         },
//         {
//             account_log_id:2,
//             order_no:1,
//             amount:100.00,
//             flow_type:1,
//             create_time:"2019-06-25",
//         },
//         {
//             account_log_id:3,
//             order_no:1,
//             amount:300.00,
//             flow_type:0,
//             create_time:"2019-06-25",
//         },
//         {
//             account_log_id:1,
//             order_no:1,
//             amount:160.00,
//             flow_type:1,
//             create_time:"2019-06-25",
//         },
//         {
//             account_log_id:1,
//             order_no:1,
//             amount:50.00,
//             flow_type:0,
//             create_time:"2019-06-25",
//         }
//     ]
// }

