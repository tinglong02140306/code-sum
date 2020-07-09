
import { hideLoading, showLoading, showTitledAlert, showToast, trimAll, ftCarColor } from "../../../utils/util";
import APIs from "../../../apis/index";
import { vehicleTypeMap, plateColorMap, axlesMap } from "../../../utils/mapUtils";

const app = getApp();
const axles = ["两轴", "三轴", "四轴", "五轴", "六轴"];
const colors = ["白色", "黑色", "蓝色", "黄色", "渐变绿色", "黄绿双拼色蓝色", "蓝白渐变色", "灰色", "青色", "银色", "红色", "棕色", "紫色"];

Page({
	data: {
		needFile: false,		// 是否需要上传征信
		selectedCarIdx: "",
		carInfo: {},
		axle: "",
		carColor: "",
		owner: "",
		axlesRange: [],
		userName:"",
		totalApproved:"",
		tractionMass:"",
		approvedLoad:"",
		axleCount:"",
		flag:true,
		traction_mass:"",
		stafflag:false

	},
	selectCarColor() {
		my.showActionSheet({
			title: "选择车辆颜色",
			items: colors,
			success: (res) => {
				console.log(res);
				this.setData({
					carColor: colors[res.index],
				});
			},
		});
	},
	onItemInput(e) {
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onClear(e) {
		this.setData({
			[e.target.dataset.field]: '',
		});
	},
	async addCar() {
		if(!this.data.retcode){
			
		}else{
			const pattern = /^[0-9]{10,12}$/;
			if (!pattern.test(this.data.retcode)) {
				showToast('业务推广码格式不正确');
				return;
			}
		}
		if (!this.data.axle) {
			showToast("请选择车辆轴数");
			return;
		}
		const vehicleInfo = app.globalData.vehicleInfo;
		console.log(vehicleInfo, 66);
		showLoading();
		if(!this.data.owner){
			this.setData({owner:this.data.userName})
			console.log(this.data.userName,207)
		}
		const params1 = {
			flow_sn: app.globalData.flowSn,
			total_approved:this.data.carInfo['total_approved'],
			traction_mass:this.data.tractionMass||"",
			approved_load:this.data.carInfo['approved_load'],
			axle_count:this.data.carInfo['axle_count']
		};
		if(this.data.carInfo['axle_count']=="2"){	
			if(this.data.vehicleInfo["vlp_color"]=="0"){
				this.setData({vc:"11"})
			}else if(this.data.vehicleInfo["vlp_color"]=="1"){
				this.setData({vc:"12"})
			}else{
				this.setData({ vc: "12" })
			}
		}else if(this.data.carInfo['axle_count']=="3"){
			this.setData({vc:"13"})
		}else if(this.data.carInfo['axle_count']=="4"){
			this.setData({vc:"14"})
		}else if (this.data.axle == "5") {
			this.setData({ vc: "15" })
		}else if (this.data.axle == "6") {
			this.setData({ vc: "16" })
		}

		const params = {
			flow_sn: app.globalData.flowSn,
			vlp: this.data.vehicleInfo["vehicle_no"],
			vlpc: this.data.vehicleInfo["vlp_color"],
			vehicle_owner: this.data.vehicleInfo["owner"] || this.data.owner,
			vc: this.data.vc,// 车型类型
			axle_count: this.data.carInfo['axle_count'],
			vehicle_color:"14",//this.data.vehicleInfo["body_color"]
			invite_code:this.data.retcode||""
		};
		console.log(params);
		try {
			if (app.globalData.appendCar) {
				await APIs.brandSubmit(params1);
				await APIs.vehicleDataApplyAppend(params);
			} else {
				await APIs.brandSubmit(params1);
				await APIs.vehicleDataApply(params);
			}
			hideLoading();
			showTitledAlert("添加成功").then(() => {
				// app.globalData.switchAdd="true"
				my.navigateBack();
			});
		} catch (error) {
			hideLoading();
			console.log(error);
			showToast(error.message);
		}
	},
	onLoad() {

		let {data: retcode} =my.getStorageSync({"key":"retcode"});
		if (retcode) {
			this.setData({ stafflag: true })
		}

		const carInfo = app.globalData.carInfo;
		const vehicleInfo = app.globalData.vehicleInfo1;
        
		console.log(vehicleInfo,carInfo,116)
		console.log(carInfo, 98)
		this.setData({
			carInfo,
			vehicleInfo,
			vehicleTypeMap,
			plateColorMap,
			axlesMap,
			retcode
		});
		this.setData({
			totalApproved:carInfo['total_approved'],
			tractionMass:carInfo['traction_mass']||"",
			approvedLoad:carInfo['approved_load'],
			axleCount:carInfo['axle_count']
		})

		if(this.data.tractionMass){
			this.setData({flag:false})
		}
		// 如果轴数是0  让用户自己选择
		console.log(app.globalData.vehicleInfo);
		if (carInfo["axle_count"]) {
			if (carInfo["axle_count"] == "0") {
				this.setData({ showAxle: true, axlesRange: axles });
			} else {
				this.setData({ axle: carInfo["axle_count"], axlesRange: [axles[parseInt(carInfo["axle_count"]) - 2]] });
			}
		}
		const { data: username } = my.getStorageSync({ key: "idName" });//姓名
		this.setData({ userName: username })
		console.log(this.data.userName,284)
	}
});
