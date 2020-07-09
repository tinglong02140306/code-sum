import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import { plateColorMap } from "../../../utils/mapUtils";

const mode = ["邮寄", "现场领取"];

const app = getApp();
Page({
	data: {
		companyName: "",
		loaded: false,
		vehicles: [],
		receiveMode: ""
	},
	commitVehicle(vehicleInfo){
		const receiveMode = this.data.receiveMode;
		let params = {};
		return new Promise(async (resolve, reject) => {
			try {
				params = {
					...vehicleInfo,
					addr: app.companyData.companyAddress,
					owner: app.companyData.companyName,
					axle_count: vehicleInfo["axle_num"]
				};
				await APIs.companyModelSubmit(params);
				params = {
					flow_sn: vehicleInfo["flow_sn"],
					vlp: vehicleInfo["vlp"],
					vlpc: vehicleInfo["vlpc"],
					receive_mode: receiveMode === "邮寄" ? "1" : "2",
					vc: vehicleInfo["vclass"],
					vehicle_owner: app.companyData.companyName,
					axle_count: vehicleInfo["axle_num"],
					vehicle_color: vehicleInfo["vehicle_color"] || "14",
					invite_code: vehicleInfo["market_code"]
				};
				resolve(await APIs.companyVehicleSubmit(params));
			} catch (error) {
				reject(error);
			}
		});
	},
	async next(){
		const receiveMode = this.data.receiveMode;
		if(!receiveMode) {
			showToast("请选择领取方式");
			return;
		}
		const vehicles = this.data.vehicles;
		let ids = [];
		vehicles.forEach(item => ids.push(item["id"]));
		try {
			showLoading();
			let params = {};
			params = {
				addr: app.companyData.companyAddress,
				ids,
				receive_mode: receiveMode === "邮寄" ? "1" : "2"
			};
			await APIs.companyVehicleSubmitBatch(params);
			params = {
				receive_mode: receiveMode === "邮寄" ? "1" : "2",
				invite_code: vehicles[0]["market_code"] || ""
			};
			await APIs.companyInfoSubmit(params);
			hideLoading();
			my.redirectTo({
				url: "/pages/company/sign-account/sign-account"
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	async next0(){
		showLoading();
		const vehicles = this.data.vehicles;
		try {
			const promises = vehicles.map(x => this.commitVehicle(x));
			for(const promise of promises) {
				await promise;
			}
			// 循环结束后 调用确认信息提交
			const params = {
				receive_mode: "1",
				invite_code: vehicles[0]["market_code"] || ""
			};
			await APIs.companyInfoSubmit(params);
			hideLoading();
			my.redirectTo({
				url: "/pages/company/sign-account/sign-account"
			});
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	onPickerTap(){
		my.showActionSheet({
			title: "选择领取方式",
			items: mode,
			success: (res) => {
				this.setData({
					receiveMode: mode[res.index],
				});
			},
		});
	},
	async onLoad(){
		this.setData({ companyName: app.companyData.companyName, plateColorMap });
		try {
			showLoading();
			let { result: vehicles } = await APIs.companyVehicles({ name: app.companyData.companyName });
			hideLoading();
			if(vehicles && vehicles.length) {
				this.setData({ vehicles, loaded: true });
			} else {
				this.setData({ loaded: true });
				const msg = "车辆数据在批量系统未处理";
				showTitledAlert(msg);
			}
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	}
});
