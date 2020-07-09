import address from "../../../utils/address";
import APIs from "../../../apis/index";
import { showToast, showLoading, hideLoading, trimAll,ftDate } from "../../../utils/util";

const app = getApp();

Page({
	data: {
		activeIndex: 1,
		items: [{
			title: "个人信息",
		}, {
			title: "车辆信息",
		}, {
			title: "银行服务",
		}, {
			title: "在线签约",
		}],
		idName: "",//姓名
		detailAddress: "",//详细地址
		idNumber: "",//身份证号
		mobile: "",//手机号码
		receiver: "",//收件人
		address: [],
		region: [],
		staffId: '',
		stafflag: false,
		flag: false,
		mechanismId: '',
		endDate:"",
		startDate: "",	//身份证起始日期
		invalidDate:"",//身份证结束日期
		firm:"",//工作单位名称
		inCome:"",//本人年收入
		signOrganize:"",//身份证签发机关
		CreditCard:false,
		areaCode:"",
		inviteorg:"",
		invitecode:"",
		city:""
	},
	onItemInput(e) {
		this.setData({
			[e.target.dataset.field]: e.detail.value,
		});
	},
	onClear(e) {
		this.setData({
			[e.target.dataset.field]: "",
		});
	},
	selectAddress() {
		my.navigateTo({
			url: "/pages/index/address-list/address-list"
		});
	},
	next() {
		const pattern = /^[a-zA-Z0-9]{0,20}$/;
		if (!pattern.test(this.data.staffId)) {
			showToast('工作人员编号字段格式不正确');
			return;
		}
		// source  根据来源确定66-网商 67-工商 68-农行 69-支付宝  暂时写死
		
		let source = "66";
		const channel = my.getStorageSync({ "key": "source" }) || "";
		if (channel) {
			if (channel.data === "alipay") {
				source = "69"  //支付宝
			} else if (channel.data == "67") {
				source = "67"  //工商
				let characters = /^[\u4e00-\u9fa5]+$/;
				if (!this.data.firm) {
					showToast("请填写工作单位名称");
					return false;
				};
				if (!characters.test(trimAll(this.data.firm) )) {
					showToast('工作单位名称不能含有特殊字符');
					return false;
				};
				let charactersNumber = /^[0-9]*$/;
					if (!this.data.inCome) {
					showToast("请填写本人年收入");
					return false;
				};
				if(!charactersNumber.test(trimAll(this.data.inCome)) ){
					showToast('请输入正确的阿拉伯数字');
					return false;
				}
					if (!this.data.signOrganize) {
					showToast("请填身份证签发机关");
					return false;
				};
				if (!characters.test(trimAll(this.data.signOrganize) )) {
					showToast('身份证签发机关不能含有特殊字符');
					return false;
				};
				if(!this.data.startDate){
					showToast('请选择证件签发日期');
					return false;
				}
			} else if (channel.data == "68") {
				source = "68" //农行
			} else if (channel.data == "73") {
				source = "73"  //建行
			}else if (channel.data == "77") {
				source = "77"  //信联地推
			}else if (channel.data == "75") {
				source = "75"  //中石化
			}else if (channel.data == "76") {
				source = "76"  //中石油
			}else if (channel.data == "74") {
				source = "74"  //路歌
			}else if (channel.data == "5") {
				source = "5"  //满意网
			}else if (channel.data == "79") {
				source = "79"  //信联代理
			}else if (channel.data == "80") {
				source = "80"  //信联代理
			}else if (channel.data == "81") {
				source = "81"  //新疆etc
				}else if (channel.data == "82") {
					source = "82"  //新疆etc工行
				}else if (channel.data == "83") {
					source = "83"  //新疆etc建行
            }else if (channel.data == "85") {
				source = "85"  //天津etc
				}else if (channel.data == "86") {
					source = "86"  //天津etc工行
				}else if (channel.data == "87") {
					source = "87"  //天津etc建行   
			}else if (channel.data == "14") {
                source = "14"  //高速etc  
			}else if (channel.data == "100") {
                source = "100"  //跨度
			}else if (channel.data == "91") {
                source = "91"  //云南总码
				}else if (channel.data == "92") {
                source = "92"  //云南工行
				}else if (channel.data == "93") {
                source = "93"  //云南建行
			}else if (channel.data == "94") {
                source = "94"  //河北总码
				}else if (channel.data == "95") {
                source = "95"  //河北工行
				}else if (channel.data == "96") {
                source = "96"  //河北建行
			}else if (channel.data == "88") {
                source = "88"  //内蒙总码
				}else if (channel.data == "89") {
                source = "89"  //内蒙工行
				}else if (channel.data == "90") {
                source = "90"  //内蒙建行
			}else if (channel.data == "97") {
                source = "97"  //广西总码
				}else if (channel.data == "98") {
                source = "98"  //广西工行
				}else if (channel.data == "99") {
                source = "99"  //广西建行
			}else if (channel.data == "101") {
				 source = "101"  //网商红包
			}else{ 
				source = "66";  //网商
//上线注意这修改
			}
		}
		showLoading();
		const params = {
			source: source,
			user_name: this.data.idName,
			user_certificate_no: this.data.idNumber,
			address: app.globalData.uuidAddress["address"],
			uuid_address: app.globalData.uuidAddress["uuid_address"],
			// invite_code: trimAll(this.data.staffId) || "",
			// mechanism_code: this.data.mechanismId || "",
			invite_code:this.data.invitecode||this.data.staffId||"",
			mechanism_code:this.data.inviteorg||"",
			marketer_region_code:this.data.city||"",
			firm:trimAll(this.data.firm)||"",
			in_come:trimAll(this.data.inCome)||"",
			sign_organize:trimAll(this.data.signOrganize)||"",
			start_date: this.data.startDate.split("-").join("")||"",
            invalid_date: this.data.endDate.split("-").join("") ? this.data.endDate.split("-").join("") : "长期",
            channel_user_id:this.data.channelUserId||""
		};
		console.log(params,88);
		APIs.customerDataApply(params).then(() => {
			hideLoading();
			my.navigateTo({
				url: "/pages/index/car-info/car-info"
			});
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	selectDate(e) {
		const idx = e.currentTarget.dataset.idx;
		my.datePicker({
			startDate: '1990-10-9',
			currentDate: this.data.item_time,
			endDate: '2099-10-9',
			success: (res) => {
				this.setData({ [idx]: res.date });
			},
			fail: () => {
				this.setData({ [idx]: "" });
			}
		});
	},
	onLoad() {
        const {data:channelUserId}=my.getStorageSync({ "key": "channelUserId"});
		const { data: idName } = my.getStorageSync({ "key": "idName"});
		const { data: idNumber } = my.getStorageSync({ "key": "idNumber" });
		const { data: staffIdXin } = my.getStorageSync({ "key": "staffId" });
		const staffId=app.globalData.invitecode||staffIdXin;
        console.log(staffId,169)
		const { data: mechanismId } = my.getStorageSync({ key: "mechanismId" });
		const channel = my.getStorageSync({ "key": "source" }) || "";
		//  const staffId="123456789"
		this.setData({ idName, idNumber, staffId, mechanismId,channelUserId});
		if (staffId) {
			this.setData({ stafflag: true })
		}
		if(channel.data == "67"){
			this.setData({CreditCard:true})
			console.log("123456")
		}
		//   this.setData({CreditCard:true})
	},
	onShow() {
		let item_time = ftDate()
		item_time = `${item_time.slice(0, 4)}-${item_time.slice(4, 6)}-${item_time.slice(6, 8)}`
		this.setData({ item_time: item_time })
		const address = app.globalData.uuidAddress;
		const city = app.globalData.city;
		const invitecode= app.globalData.invitecode;
		const inviteorg=app.globalData.inviteorg;
        this.setData({invitecode,inviteorg,city})
		if (address) {
			this.setData({
				flag: true,
				receiver: address["addressee"],
				mobile: address["addressee_mobile"],
				region: [address["receive_province"], address["receive_city"], address["receive_area"]],
				detailAddress: address["receive_address"]
			});
		}
	}
});
