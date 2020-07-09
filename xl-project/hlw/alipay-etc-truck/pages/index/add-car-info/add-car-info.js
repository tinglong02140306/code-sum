import {
	ftCarColor,
	hideLoading,
	imgOcr,
	showLoading,
	showTitledAlert,
	showToast,
	trimAll,
	ftPlateColor
} from "../../../utils/util";
import APIs from "../../../apis/index";
const app = getApp();
Page({
	data: {

		vehicleType: "",
		owner: "",
		carFaceImg: "",
		realCarFaceImg: "",
		carBackImg: "",
		realCarBackImg: "",
		needFile: "",
		plateNo: "",
		vc: "",					// 车型
		model: "",  		// 品牌型号
		vin: "",			// 识别代码
		address: "",			// 地址
		registerDate: "",			// 注册日期
		issueDate: "",			// 发证日期
		approvedPassengerCapacity: "",				// 核定载人数
		approvedLoad: "",							// 核定载质量
		overallLong: "",					// 长
		overallWide: "",					// 宽
		overallHigh: "",					// 高
		tractionMass: "",					// 准牵引总质量
		unladenMass: "",					// 整备质量
		colorFlag: false,
		userName: "",
		axle: "",
		retcode:"",
		stafflag:false
		
	},
	onItemInput(e) {
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	async uploadAndOcr(e) {

		const idx = e.currentTarget.dataset.idx;
		if (idx == "car1" && this.data.carFaceImg) {
			this.imgPreview(this.data.carFaceImg);
			return;
		}
		if (idx == "car2" && this.data.carBackImg) {
			this.imgPreview(this.data.carBackImg);
			return;
		}
		try {
			showLoading("识别中...");
			if (idx == "car1") {
				const params = {
					ocrType: "ocr_vehicle",
					side: "face",
					type: "3"
				};
				const { vehicle_face: car1, url } = await imgOcr(params);
				console.log("+++++++++++++++++++++++++++++");
				console.info(car1, 104);
				if (!car1["owner"] || !car1["plate_no"] || !car1["register_date"] || !car1["issue_date"] || !car1["brand"] || !car1["vin"] || !car1["address"]) {
					hideLoading();
					showToast("请上传清晰的行驶证正本");
					return;
				}
				this.setData({ carFaceImg: url[0], realCarFaceImg: car1["face_info_url"], });
				this.setData({
					plateNo: car1["plate_no"] || "",
					vehicleType: car1["vehicle_type"] || "",
					owner: car1["owner"] || "",
					model: car1["brand"] || "",
					vin: car1["vin"] || "",
					useCharacter: car1["use_character"] || "",
					engineNo: car1["engine_no"] || "",
					address: car1["address"] || "",
					registerDate: car1["register_date"],
					issueDate: car1["issue_date"]
				});
				hideLoading();
				return;
			}
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	deleteImg(e) {
		const idx = e.currentTarget.dataset.idx;
		if (idx == "car1") {
			this.setData({ carFaceImg: "", realCarFaceImg: "" });
			return;
		}
	},
	imgPreview(idx) {
		const urls = [idx];
		my.previewImage({
			urls
		});
	},
	async addCar() {
		// 检查
		if (!this.checkBeforeAdd()) {
			return;
		}
		
		try {
			showLoading();
			console.log(!this.data.owner, 205)
			if (!this.data.owner) {
				this.setData({ owner: this.data.userName })
				console.log(this.data.userName, 207)
			}
			const params1 = {
				flow_sn: app.globalData.flowSn,
				veh_owner: this.data.owner, //?姓名
				vlp: this.data.plateNo,
				vehicle_type: this.data.vehicleType,
				register_date: this.data.registerDate, //?注册日期
				engine_num: this.data.engineNo,   //发动机型号
				issue_date: this.data.issueDate,
				use_character: this.data.useCharacter,
				model: this.data.model,//?品牌型号
				vin: this.data.vin,
				addr: this.data.address   //?地址
			};
			console.log(params1,128)
			if (app.globalData.appendCar) {
				await APIs.ocrSubmit(params1);
			} else {
				await APIs.ocrSubmit(params1);
			}
			const brandPrand = {
				flow_sn: app.globalData.flowSn,
				model: this.data.model
			}
			// 品牌型号数据查询
			let { result } = await APIs.brandQuery(brandPrand);
			this.setData({ axle: result['axle_count'] })
			if (result.state == true) {
				const params = {
					flow_sn: app.globalData.flowSn,
					total_approved: result['total_approved'],
					traction_mass: result['traction_mass'],
					approved_load: result['approved_load'],
					axle_count: result['axle_count']
				}
				// 品牌型号数据提交
				await APIs.brandSubmit(params);
				if (this.data.axle == "2") {
						const vehicleInfo = app.globalData.vehicleInfo1;
						console.log(vehicleInfo,170)
						if (vehicleInfo["vlp_color"] == "0") {
							this.setData({ vc: "11" })
						} else if (vehicleInfo["vlp_color"] == "1") {
							this.setData({ vc: "12" })
							console.log(this.data.vc,175)
						}else{
							this.setData({ vc: "12" })
						}
					} else if (this.data.axle == "3") {
						this.setData({ vc: "13" })
					} else if (this.data.axle == "4") {
						this.setData({ vc: "14" })
					}else if (this.data.axle == "5") {
						this.setData({ vc: "15" })
					}else if (this.data.axle == "6") {
						this.setData({ vc: "16" })
					}
					const vehicleInfo = app.globalData.vehicleInfo1;
					console.log(vehicleInfo, 144)
					let params2 = {
						flow_sn: app.globalData.flowSn,
						vlp: this.data.plateNo,
						vlpc: vehicleInfo["vlp_color"],    //车牌颜色
						vehicle_owner: this.data.owner,
						vc: this.data.vc,					// 车型  根据准牵引总质量或者核定载质量计算
						axle_count: this.data.axle,  //车轴数
						vehicle_color: "14", //vehicleInfo["body_color"],   //车辆颜色
						vehicle_license_front_url: this.data.realCarFaceImg,
						invite_code:this.data.retcode||""
					};
					console.log(params2, 236)
				if (app.globalData.appendCar) {  
					await APIs.vehicleDataApplyAppend(params2);
				} else {
					await APIs.vehicleDataApply(params2);
				}
				hideLoading();
				showTitledAlert("添加成功").then(() => {
					// app.globalData.switchAdd="true"
					my.navigateBack();
				});
				return;
			} else {
				my.redirectTo({
					url: "/pages/index/add-car-copy/add-car-copy"
				});
				return;
			}
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	checkBeforeAdd() {
		if (!this.data.carFaceImg) {
			showToast("请上传行驶证照片");
			return false;
		}
		if (!this.data.model) {
			showToast("请填写品牌型号");
			return false;
		}
		if (this.data.plateNo!==this.data.vehicleInfo["vehicle_no"]) {
			showTitledAlert(`当前车牌号${this.data.plateNo}与录入车牌号${this.data.vehicleInfo["vehicle_no"]}不一致`);
			return;
		}
		if(!this.data.retcode){
			
		}else{
			const pattern = /^[0-9]{10,12}$/;
			if (!pattern.test(this.data.retcode)) {
				showToast('业务推广码格式不正确');
				return;
			}
		}
		return true;
	},
	onLoad() {
		let {data: retcode} =my.getStorageSync({"key":"retcode"});
		console.log(retcode,240)
		if (retcode) {
			this.setData({ stafflag: true })
		}
		this.setData({ vehicleInfo: app.globalData.vehicleInfo1,retcode });
		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		this.setData({ userName: username })
		console.log(this.data.userName, 284)
	}
});
