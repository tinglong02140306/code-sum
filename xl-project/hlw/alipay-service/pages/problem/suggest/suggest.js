import { hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";
import { msgTypeMap } from "../../../utils/mapUtils";


const app = getApp();
Page({
	data: {
		msgId: "", // 消息id
		msgType: "", // 消息类型  1-系统公告；2-投诉/建议;
		complaint: "业务办理结果投诉", // 投诉内容
		content: "", // 问题描述
		createTime: "",
		createYear: "",
		replyContent: "", // 回复内容
		repeplyTime: "",
		replayYear: "",
		list: {},
		loaded: false,
	},
	// 获取产品建议列表
	getSuggestList() {
		let params = {
			msg_id: this.data.msgId,
			msg_type: this.data.msgType
		};
		showLoading();
		APIs.msgInfo(params).then(({ data: { complaint } }) => {
			hideLoading();
			let createObj = this.dealDateFormate(complaint.gmt_create),
				replyObj = this.dealDateFormate(complaint.gmt_reply);
			this.setData({
				content: complaint.content,
				createTime: createObj.time,
				createYear: createObj.year,
				replyContent: complaint.reply_content,
				replyTime: replyObj.time,
				replayYear: replyObj.year,
				compType: complaint["type"] + "" + complaint["clazz"]
			});
			setTimeout(() => {
				this.setData({ loaded: true });
			}, 200);

		}).catch(err => {
			hideLoading();
			setTimeout(() => {
				this.setData({ loaded: true });
			}, 200);
			showToast(err.message);
		});
	},
	// 时间格式处理
	dealDateFormate(date) {
		let obj = {
			time: "",
			year: ""
		};
		if (date && date.length == 19) {
			obj.time = date.substring(0, 10);
			obj.year = date.substring(11, 19);
		}
		return obj;
	},
	onLoad(options) {
		this.setData({ msgTypeMap });
		const { msgId, msgType } = options;
		this.setData({ msgId, msgType });
		this.getSuggestList();
	}
});