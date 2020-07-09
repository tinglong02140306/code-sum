import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
  data: {
    waitingButton: {
      mainButton: {
        buttonText: "刷新页面"
      },
    },
    waitingTitle: "信用额度评估中",
    waitingSubtitle: "请耐心等待",
	bankCode:""
  },
  // 周结产品审核通过  跳转到周结页面
  next() {
    APIs.creditQuery().then((res) => {
      hideLoading();
      if (res.result.credit_result === "ACCEPTED") {
        my.navigateTo({
          url: `/pages/index/sign-result/sign-result?status=week&intention_product=${res.result.intention_product}`
        });
        return;
      } else if (res.result.credit_result === "REFUSED") {
		 if(this.data.bankCode=="CCB"){
			  	my.navigateTo({
					url: `/pages/index/sign-result/sign-result?status=day&intention_product=${res.result.intention_product}`
				});
		   }else{
			my.navigateTo({
				url: `/pages/index/sign-result/sign-result?status=day&intention_product=${res.result.intention_product}`
			});
		   }
        return;
      }
      this.setData({
        status: res.result.credit_result
      })
    }).catch(error => {
      hideLoading();
      console.log(error);
      showToast(error.message);
    });
  },
async onShow() {
	let { result } = await APIs.customerQuery();
      	this.setData({bankCode:result.bank_code})
    
	}
});
