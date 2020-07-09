App({
	onLaunch(options){
		if(options && options.query) {
			my.setStorageSync({ "key": "mechanismId", data: options.query.mechanismId });
			my.setStorageSync({ "key": "staffId", data: options.query.InvitationCode });
			my.setStorageSync({ "key": "source", data: options.query.source });//options.query.source   渠道来源
			my.setStorageSync({ "key": "areaCode", data: options.query.areaCode });
			my.setStorageSync({ "key": "retcode", data: options.query.retcode });//营销推荐码
			my.setStorageSync({ "key": "proxyuserid", data: options.query.proxyuserid });//营销人员唯一编号（暂时不用）
			my.setStorageSync({ "key": "city", data: options.query.city });//城市
			my.setStorageSync({ "key": "province", data: options.query.province });//省
			my.setStorageSync({ "key": "channelUserId", data: options.query.channelUserId });//璐哥过来的用户编号
		}
		const updateManager = my.getUpdateManager();
		updateManager.onCheckForUpdate((res) => {
			// 请求完新版本信息的回调
			if(res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					my.alert({
						title: "更新提示",
						content: "新版本已经准备好，立即重启完成更新",
						success: () => {
							updateManager.applyUpdate();
						}
					});
				});
			}
			updateManager.onUpdateFailed(() => {
				my.alert({
					title: "更新提示",
					content: "网络错误！"
				});
			});
		});
	},
	onShow(options){
		if(options.referrerInfo && options.referrerInfo.extraData) {
			const extraData = options.referrerInfo.extraData;
			const channel = extraData.channel;
			my.setStorageSync({ "key": "source", data: channel });
			my.setStorageSync({ "key": "retcode", data: channel.retcode });//营销推荐码
		} else if(options && options.query) {
			// 法人扫码授信
			if(options.query.applyId && options.query.userId) {
				this.companyData.companyApplyAliId = options.query.applyId;
				this.companyData.companyApplyUserId = options.query.userId;
			}
		}
	},
	globalData: {
		extraUrl: "",      // webview页面地址
		productType: "",  // 产品 日结day52 周结week54
		applierInfo: "",    // 申请时人员信息  userName, userId
		flowSn: "",       // 查询车辆返回的流水号
		vehicleInfo: {},  //车辆查询接口返回的车联信息
		needFile: false,      // 车辆是否需要上传征信....
		vehicleLicenseCopyUrl: "",    // 行驶证副本图片
		vehicleLicenseFrontUrl: "",   // 行驶证正本图片
		uuidAddress: "",    // 当前选择的收货地址唯一id及详细地址信息
		billDetail: "",     // 账单列表到详情保存的数据
		appendCar: false,     // 当前流程是否是追加车辆
		aheadPayList: [],       // 提前还款的列表
		uploadInfo: {},         // 上传银行流水页面需要的行驶证 正副本信息
		signedId: "",           // 查询客户信息返回的用户签约id
		serialno: "",            //支付宝用户编号
		back_code: "",           //银行标识
		information: {},
		carList: "", //车辆集合
		sign_str: "",
		plateNo: "",
		address: "",
		carInfo: "",
		vehicleInfo1: "",
		loaded: "",
		invitecode: "",
		inviteorg: "",
		city: "",
		switchAdd: "",
		activeInfo: "",       // 激活需要用到的车辆信息
	},
	// 用来存储企业流程的全局数据 其他数据不要往这个对象里存  其他流程原则上也不要使用这个对象里的变量！！
	companyData: {
		companyName: "",      // 用户录入的企业名称
		companyAddress: "",   // 企业地址1.4接口使用
		companyIdNum: "",       // 证件号  2.1查询签约需要
		companyUuidAddress: "",
		companySignId: "",      // 企业签约ID
		companyVehicleIds: "",       // 保证金划拨结果查询接口需要的车辆ID  用,分割
		companyIntentionProduct: "",    // 授信结果查询返回的应办理产品
		companyCreditLimit: 0,       // 周结授信额度
		companyApplyAliId: "",     // 申请人支付宝id
		companyApplyUserId: "",     // 经办人用户ID
	}
});
