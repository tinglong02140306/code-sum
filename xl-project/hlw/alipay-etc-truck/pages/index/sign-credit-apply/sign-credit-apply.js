import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();

Page({
  data: {
    skipTo: false,
    flagOne:false,
	source:""
  },
  next() {
    my.navigateTo({
      url: "/pages/index/sign-credit-waiting/sign-credit-waiting"
    });
  },
  // 跳转到网商授信页面  从授信完成 跳转到等待页面

  async creditApply() {
    //给后台一个通知
    try {
      showLoading();
      let { result } = await APIs.customerQuery();
      let bank_code = app.globalData.bank_code;
      if(!bank_code){
        bank_code = result.bank_code;
      }
      app.globalData.serialno = result.serialno;
	  
      const params  = {
        bank_code:bank_code,
        origin_signed_id:result.serialno,
        signed_id:result.signed_id, 
      };
	  console.log(params,35)
      await APIs.signedNotice(params);
      my.ap.navigateToAlipayPage({
        // 测试
       // path: "http://render-dev.site.alipay.net/p/h5_test/loan/www/etcIndex.html?ptdOrg=2019092001025002001983417266",
        //  生产
        path:`https://render.alipay.com/p/h5/loan/www/etcIndex.html?ptdOrg=2019092001025002090153913048`,
        success: res => {
          console.log("跳转网商授信页面-成功");
          hideLoading();
          this.setData({flagOne:true});
        },
        fail: error => {
          hideLoading();
          this.setData({flagOne:false})
          console.log("跳转网商授信页面-失败");
        }
      });
    } catch (error) {
      hideLoading();
      console.log(error);
      showToast(error.message);
    }
  },
onLoad(){
   	const { data: source } = my.getStorageSync({ key: "source" });//工作人员编号
	this.setData({ source })
}
  
  
});
