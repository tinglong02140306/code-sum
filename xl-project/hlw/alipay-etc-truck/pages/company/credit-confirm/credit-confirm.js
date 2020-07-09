import APIs from "../../../apis/index";
import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast } from "../../../utils/util";


const app = getApp();
Page({
	data: {
		loaded: true,
		showModal: false,
		qrCode: "",
		nextPage: false,
		companyName: "",
		showLegal: false
	},
	async next(){
		// 跳转网商授信
		try {
			showLoading();
			let params = {
				user_id: app.companyData.companyApplyUserId,
				appply_alipay_id: app.companyData.companyApplyAliId
			};
			let { result } = await APIs.companyQrCodeBind(params);
			my.setStorageSync({ key: "curApplyType", data: "enterprise" });
			hideLoading();
			if(result.jump_credit_grant === "TRUE") {
				my.ap.navigateToAlipayPage({
					// 测试
					// path: "http://render-dev.site.alipay.net/p/h5_test/loan/www/etcIndex.html?ptdOrg=2019092001025002001983417266",
					// 生产
					path: "https://render.alipay.com/p/h5/loan/www/etcIndex.html?ptdOrg=2019092001025002090153913048",
					success: () => {
						this.setData({ nextPage: true });
					},
					fail: () => {
						this.setData({ nextPage: false });
					}
				});
				return;
			}
			app.companyData.companyIntentionProduct = result.intention_product;
			if(result.intention_product === "55") {
				my.redirectTo({
					url: "/pages/company/company-product-week/company-product-week"
				});
				return;
			}
			if(result.intention_product === "74") {
				my.redirectTo({
					url: "/pages/company/company-product-day-74/company-product-day-74"
				});
				return;
			}
			my.redirectTo({
				url: "/pages/company/company-product-day/company-product-day"
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async showImg(){
		try {
			showLoading();
			const params = {
				describe: "网商授信绑定",
				url_param: "/pages/company/credit-confirm/credit-confirm"
			};
			let { data: qrCode } = await APIs.companyQrCode(params);
			hideLoading();
			this.setData({ qrCode });
			setTimeout(() => {
				this.setData({ showModal: true });
			}, 100);
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	closeModal(){
		this.setData({ showModal: false });
		setTimeout(() => {
			my.redirectTo({
				url: "/pages/company/refresh-result/refresh-result?type=credit"
			});
		},100);
	},
	saveImg(){
		my.saveImage({
			url: this.data.qrCode,
			showActionSheet: true,
			success: () => {
				showToast("保存成功");
				setTimeout(() => {
					my.redirectTo({
						url: "/pages/company/refresh-result/refresh-result?type=credit"
					});
				},100);
			}
		});
	},
	exit(){
		const msg = "请点击右上角关闭按钮退出小程序";
		showTitledAlert(msg);
	},
	onShow(){
		// 法人就不要进行页面跳转了
		if(app.companyData.companyApplyAliId && this.data.nextPage) {
			showConfirm("是否已完成授信申请？").then(() => {
				this.setData({ loaded: false });
				const msg = "您已发起授信申请，请使用经办人支付宝继续办理";
				showTitledAlert(msg);
			}).catch(() => {
				this.setData({ nextPage: false });
			});
			return;
		}
		// 判断是否从网商返回
		if(this.data.nextPage) {
			this.setData({ nextPage: false });
			my.redirectTo({
				url: "/pages/company/credit-waiting/credit-waiting"
			});
		}
	},
	onLoad(){
		this.setData({ companyName: app.companyData.companyName });
		if(app.companyData.companyApplyAliId) {
			this.setData({ showLegal: true });
		}
	}
});
