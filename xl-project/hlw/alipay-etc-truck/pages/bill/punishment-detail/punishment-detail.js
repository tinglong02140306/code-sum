import { formatDate, hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();


Page({
	data: {
		punishInfo: {}
	},
	onLoad(options) {
		const { id } = options;
		showLoading();
		APIs.accountStatement({category: "PUNISH",flow_level: "2",bill_account_statement_id: id}).then(res => {
			hideLoading();
			this.setData({punishInfo: res.result});
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	}
});
