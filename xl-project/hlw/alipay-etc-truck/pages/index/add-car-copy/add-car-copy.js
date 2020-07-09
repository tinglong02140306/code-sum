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
		colorFlag:false,
		userName:"",
		grossMass:"",
		axle:"",
		main:"",
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
			if (idx == "car2") {
				const params = {
					ocrType: "ocr_vehicle",
					side: "back",
					type: "4"
				};
				const { vehicle_back: car2, url } = await imgOcr(params);
                console.log(car2,133);
				if (!car2["plate_no"] || !car2["load_num"] || !car2["length"] || !car2["width"] || !car2["height"] || (!car2["load_mass"] && !car2["traction_mass"])) {
					hideLoading();
					showToast("请上传清晰的行驶证副本");
					return;
				}
				this.setData({ carBackImg: url[0], realCarBackImg: car2["back_info_url"]});
				let Number1=car2["load_num"].substring(0,car2["load_num"].length-1)
				
				let number3=Number(car2["load_mass"].substring(0,car2["load_mass"].length-2) )
				let number4=Number(car2["main_mass"].substring(0,car2["main_mass"].length-2) )
				let number5=Number(car2["gross_mass"].substring(0,car2["gross_mass"].length-2) )
				let number6=Number(car2["traction_mass"].substring(0,car2["traction_mass"].length-2) )
				this.setData({
					plateNo: car2["plate_no"] || "",
					approvedPassengerCapacity: Number1 || "",
					overallLong: car2["length"] || "",
					overallWide: car2["width"] || "",
					overallHigh: car2["height"] || "",
					tractionMass: number6 || "",
					approvedLoad: number3 || "",
					unladenMass: number4||"",
					grossMass:number5||"",
				});
				let regEn = /[+]/im;
			   if(regEn.test(this.data.approvedPassengerCapacity)){
				let number2=Number((this.data.approvedPassengerCapacity).split("+")[0]) +Number((this.data.approvedPassengerCapacity).split("+")[1])
				this.setData({approvedPassengerCapacity:number2})  
				console.log(this.data.approvedPassengerCapacity,96)
				}

				let regEno = /[+]/im;
				if(regEno.test(this.data.approvedPassengerCapacity)){
					console.log(this.data.unladenMass,this.data.approvedLoad,this.data.approvedPassengerCapacity,140)
					let main=this.data.unladenMass+this.data.approvedLoad+this.data.approvedPassengerCapacity*65+"kg"
					this.setData({main:main})
					console.log(main,116)
				}else{
					let main=Number(this.data.approvedLoad)+Number(this.data.unladenMass)+this.data.approvedPassengerCapacity*65+"kg"
					this.setData({main:main})
					console.log(main,104)
				}
				let params3={
					gross_mass:this.data.grossMass||this.data.main
				}
				console.log(params3,108)
				let {result}=await APIs.trialShaft(params3);
					this.setData({axle:result})

				//车轴数计算
				// 指核定载质量+整备质量+核定载人数*65kg。
				
			}
		} catch (error) {
			hideLoading();
			showTitledAlert(error.message);
		}
	},
	deleteImg(e) {
		const idx = e.currentTarget.dataset.idx;
		if (idx == "car2") {
			this.setData({ carBackImg: "", realCarBackImg: "" });
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
			console.log(!this.data.owner,205)
			if(!this.data.owner){
				this.setData({owner:this.data.userName})
				console.log(this.data.userName,207)
			}
			let params1 = {
				flow_sn: app.globalData.flowSn,
				plate_num: this.data.plateNo,  //this.data.plateNo车牌号
				approved_passenger_capacity: this.data.approvedPassengerCapacity,   //核定人数
				approved_load: this.data.approvedLoad||"",//核定载质量
				overall_long: this.data.overallLong, //长
				overall_wide: this.data.overallWide,  //宽
				overall_high: this.data.overallHigh,  //高
				traction_mass: this.data.tractionMass||"",  //准牵引总质量
				unladen_mass: this.data.unladenMass,  //整备质量
				gross_mass:this.data.grossMass  //总质量
			};
			if (app.globalData.appendCar) {
				
				await APIs.ocrCopySubmit(params1);
			} else {
				await APIs.ocrCopySubmit(params1);
				
			}
			let regEn = /[+]/im;
			if(regEn.test(this.data.approvedPassengerCapacity)){
				console.log(this.data.unladenMass,this.data.approvedLoad,this.data.approvedPassengerCapacity,140)
				let main=this.data.unladenMass+this.data.approvedLoad+this.data.approvedPassengerCapacity*65+"kg"
				this.setData({main:main})
				console.log(main,116)
			}else{
				let main=Number(this.data.approvedLoad)+Number(this.data.unladenMass)+this.data.approvedPassengerCapacity*65+"kg"
				this.setData({main:main})
				console.log(main,104)
			}
			let params3={
				gross_mass:this.data.grossMass||this.data.main
			}
			console.log(params3,108)
			let {result}=await APIs.trialShaft(params3);
				this.setData({axle:result})
			let params4={
				flow_sn: app.globalData.flowSn,
				shaft:result,
				traction_mass:this.data.tractionMass||""
			}
			console.log(params4,172)
			await APIs.axleShaft(params4);

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
			
			const vehicleInfo = app.globalData.vehicleInfo1 ;
			let params2 = {
				flow_sn: app.globalData.flowSn,
				vlp:this.data.plateNo,
				vlpc:  vehicleInfo["vlp_color"],   //车牌颜色
				vehicle_owner: this.data.owner,
				vc: this.data.vc,					// 车型  根据准牵引总质量或者核定载质量计算
				axle_count: this.data.axle,  //车轴数
				vehicle_color:"14", //vehicleInfo["body_color"],   //车辆颜色
				vehicle_license_copy_url: this.data.realCarBackImg,
				invite_code:this.data.retcode||""
			};
			if (app.globalData.appendCar) {
				await APIs.vehicleDataApplyAppend(params2);
				
			} else {
				await APIs.vehicleDataApply(params2);
				
			}
		
			hideLoading();
			showTitledAlert("添加成功").then(() => {
				my.navigateBack();
				// app.globalData.switchAdd="true"
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	checkBeforeAdd() {
		if (!this.data.carBackImg) {
			showToast("请上传行驶证照片");
			return false;
		}
		if (!this.data.grossMass) {
			showToast("请填写总质量");
			return false;
		}
		if (!this.data.unladenMass) {
			showToast("请填写整备质量");
			return false;
		}
		if (!this.data.approvedLoad&&!this.data.tractionMass) {
			showToast("请填写核定载质量或请填写准牵引总质量");
			return false;
		}
		if (!this.data.approvedPassengerCapacity) {
			showToast("请填写核定载人数");
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
		console.log(retcode,278)
		if (retcode) {
			this.setData({ stafflag: true })
		}
		this.setData({ vehicleInfo: app.globalData.vehicleInfo1,retcode });
		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		this.setData({ userName: username })
		console.log(this.data.userName,284)
	}
});
