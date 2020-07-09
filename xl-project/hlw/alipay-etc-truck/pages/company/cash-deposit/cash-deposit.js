import APIs from "../../../apis/index";
import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import { vehicleTypeMap } from "../../../utils/mapUtils";


const app = getApp();
Page({
	data: {
		loaded: true,
		companyName: "",
		total: 0,
		vehicles: [],
		vehicleIds: ""
	},
	async next(){
		try {
			showLoading();
			const vehicles = this.data.vehicles;
			let vehicleIds = "";
			vehicles.forEach(vehicle => vehicleIds += `${vehicle["vehicle_id"]},`);
			app.companyData.companyVehicleIds = vehicleIds;
			let params = {
				bank_code: app.companyData.companyBankCode,
				transfer_type: "open_account",
				vehicle_ids: app.companyData.companyVehicleIds
			};
			let res = await APIs.companyDepositTransferQuery(params);
			res = res.result;
			if(res.transfer_state === "INIT") {
				hideLoading();
				const msg = "保证金划拨中，请稍后查询";
				await showTitledAlert(msg);
				my.redirectTo({
					url: "/pages/company/refresh-result/refresh-result?type=deposit"
				});
				return;
			}
			if(res.transfer_state === "SUCCESS") {
				hideLoading();
				my.redirectTo({
					url: "/pages/company/company-apply-complete/company-apply-complete?target=day"
				});
				return;
			}
			params = {
				...params,
				transfer_deposit: this.data.total,
			};
			let { result } = await APIs.companyDepositTransfer(params);
			hideLoading();
			if(result.transferState === "SUCCESS") {
				my.redirectTo({
					url: "/pages/company/company-apply-complete/company-apply-complete?target=day"
				});
				return;
			}
			my.redirectTo({
				url: "/pages/company/refresh-result/refresh-result?type=deposit"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	async onLoad(){
		this.setData({ companyName: app.companyData.companyName, vehicleTypeMap });
		try {
			showLoading();
			let { result: { vehicles } } = await APIs.companyDepositQuery();
			let total = 0;
			vehicles.forEach(vehicle => total += parseFloat(vehicle.deposit));
			this.setData({ loaded: true, vehicles, total });
			hideLoading();
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	}
});
