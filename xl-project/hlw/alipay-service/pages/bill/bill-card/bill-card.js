import APIs from "../../../apis/index";
import { showToast, fmtCardNo, showLoading, hideLoading } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		loaded: false,
		cardList: []
	},
	onShow(){
		showLoading();
		APIs.getCards().then(res => {
			hideLoading();
			res = res.data || [];
			let list = [];
			if(res.length > 0) {
				list = res.map(item => {
					item.card_id = fmtCardNo(item.card_id);
					return item;
				});
			}
			this.setData({ cardList: list, loaded: true });
		}).catch(err => {
			hideLoading();
			this.setData({ loaded: true });
			showToast(err.message);
		});
	},
	bindCard(){
		my.navigateTo({
			url: "/pages/bill/bind-etc-card/bind-etc-card"
		});
	},
	openDetail(e){
		let cardInfo = e.currentTarget.dataset.item;
		app.globalData.billInfo = {
			cardId: cardInfo.card_id.split(" ").join(""),
			plateNo: cardInfo["plate_no"]
		};
		my.navigateTo({ url: "/pages/bill/traffic-bill-day/traffic-bill-day" });
	}
});
