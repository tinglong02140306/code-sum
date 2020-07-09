import { formatDate, getDates, hideLoading, showLoading, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();
const animationShowHeight = -300;


Page({
	data: {
		animationData: "",
		showMenu: false,
		cars: [],
		car: "",
		startDate: "",
		endDate: "",
		list: [],
		type: "",
		flow: "",
		flag:false
	},
	toggleMenu() {
		let showMenu = this.data.showMenu;
		if (!showMenu) {
			var animation = my.createAnimation({
				duration: 500,
				timingFunction: "ease",
				delay: 0
			});
			this.animation = animation;
			animation.translateY(animationShowHeight).step();
			this.setData({
				animationData: animation.export(),
				showMenu: true //显示遮罩层
			});
			setTimeout(function() {
				animation.translateY(0).step();
				this.setData({
					animationData: animation.export()
				});
			}.bind(this), 1);
		} else {
			var animation = my.createAnimation({
				duration: 500,
				timingFunction: "ease",
				delay: 0
			});
			this.animation = animation;
			animation.translateY(animationShowHeight).step();
			this.setData({
				animationData: animation.export(),
			});
			setTimeout(function() {
				animation.translateY(0).step();
				this.setData({
					animationData: animation.export(),
					showMenu: false
				});
			}.bind(this), 200);
		}
	},
	select(e) {
		const car = e.currentTarget.dataset.car;
		this.setData({ car });
	},
	selectDate(e) {
		// const date = e.detail.value;
		// const idx = e.currentTarget.dataset.idx;
		// this.setData({ [idx]: date });
		// console.log(this.setData({ [idx]: date }),68)
		const idx = e.currentTarget.dataset.idx;
		my.datePicker({
			success: (res) => {
				this.setData({ [idx]: res.date });
			},
			fail: () => {
				this.setData({ [idx]: "" });
			}
		});
	},
	showDetail(e) {
		const idx = e.currentTarget.dataset.idx;
		app.globalData.billDetail = this.data.list[idx];
		my.navigateTo({
			url: `/pages/bill/pass-record/pass-record`
		});
	},
	//查询单个日账单对应的通信费明细
	loadData() {
		showLoading();
		const params = {
			flow: this.data.flow,
			booked_date_start: this.data.startDate,
			booked_date_end: this.data.endDate,
			category: "ETC",
			vlp: this.data.car
		};
		APIs.billListQuery(params).then(res => {
			hideLoading();
			res = res.result;
			res.map(item => {
				item["amount"] = Number(item["amount"]).toFixed(2).toString();
				item["title"] = item["title"].split("|");
				return item;
			});
			this.setData({ list: res });

			console.log(this.data.list,107)
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},

	async onLoad(options) {
		console.log(options, 101)
		const { type, flow } = options;
		if (type) {
			this.setData({ type });
		}
		if (flow) {
			this.setData({ flow });
		}
		if (type && type === "week") {
			// let arr = getDates();
			// this.setData({ startDate: arr[0], endDate: arr[arr.length - 1] });
			console.log("123")
			this.setData({ startDate: options["start"], endDate: options["end"] });
		} else if (type && type === "history") {
			console.log("345")
			this.setData({ startDate: options["start"], endDate: options["end"] });
		} else {
			console.log("78910")
			const nowDate = formatDate(new Date(), "-");
			this.setData({ startDate: nowDate, endDate: nowDate });
			showLoading();
			try {
				let { result } = await APIs.userVehicles({ query_type: 4 });
				console.log(result);
				let res = result.map(item => {
					return item["vlp"];
				});
				this.setData({ cars: res });
				if (res.length === 1) {
					this.setData({ car: res[0] });
					this.setData({flag:true})
				}
			} catch (error) {
				console.log(error);
				showToast(error.message);
			}
		}
		this.loadData();
	}
});
