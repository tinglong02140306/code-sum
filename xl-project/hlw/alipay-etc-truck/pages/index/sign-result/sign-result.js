import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
    waitingTitle: "评估完成",
		waitingSubtitle: "您暂时没有获得信用额度，请前往签约日结卡",
		waitingButton: {
			mainButton: {
				buttonText: "前往签约",
			},
		},
    
		refusedButton: {
			mainButton: {
				buttonText: "前往签约"
			},
		},
		refusedTitle: "授信成功",
		refusedSubtitle: "网商银行信用额度申请成功,请前往签约周结卡",
		status: "",
		intention_product:""
	},
	// 周结产品审核通过  跳转到周结页面
	next() {
		my.navigateTo({
            url: `/pages/index/product-day/product-day?intention_product=${this.data.intention_product}`
		});
		
	},
	apply() {
		my.navigateTo({
			url: `/pages/index/product-week/product-week?intention_product=${this.data.intention_product}`
		});
	},
  async onLoad(option) {
    console.log(option,60)
    if(option.status=="day"){
       this.setData({status:"REFUSED"})
    }else{
        this.setData({status:"ACCEPTED"})
    }
	this.setData({intention_product:option.intention_product})
   }
});
