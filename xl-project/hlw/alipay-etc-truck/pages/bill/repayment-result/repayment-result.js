import { formatDate } from "../../../utils/util";

const app = getApp();


Page({
	data: {
		status: ""
	},
	onLoad(options) {
		const { status } = options;
		this.setData({ status });
	}
});
