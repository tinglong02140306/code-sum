import { cAjax as ajax } from "../utils/request.js";

// 8.1.APP开户
export const cLogin = data => {
	return ajax({
		url: "/login",
		method: "post",
		data
	});
};

// 1.1.申请信息查询
export const companyApplyInfoQuery = data => {
	return ajax({
		url: "/vehicle/gather/api/apply/enterprise",
		method: "post",
		data
	});
};

// 1.2.申请人资料提交
export const companyCustomerDataApply = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/customer/data",
		method: "post",
		data
	});
};

// 1.3.获取企业车辆信息
export const companyVehicles = data => {
	return ajax({
		url: "/vehicle/gather/api/apply/vehicles/screen",
		method: "post",
		data
	});
};

// 1.4.品牌型号数据提交
export const companyModelSubmit = data => {
	return ajax({
		url: "/product/common/model/data/submit",
		method: "post",
		data
	});
};

// 1.5.提交车辆信息
export const companyVehicleSubmit = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/vehicle/data",
		method: "post",
		data
	});
};

// 1.6.确认后信息提交
export const companyInfoSubmit = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/submit",
		method: "post",
		data
	});
};

// 1.7.批量提交
export const companyVehicleSubmitBatch = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/batch/vehicle/data",
		method: "post",
		data
	});
};

// 2.1.查询是否签约
export const companySignQuery = data => {
	return ajax({
		url: "/pay/accounts",
		method: "post",
		data
	});
};

// 2.2.银行卡签约
export const companyBankSign = data => {
	return ajax({
		url: "/pay/channels/channelCode/subChannel/platform/accounts",
		method: "post",
		data
	});
};

// 2.3.成功开户结果通知
export const companySignNotice = data => {
	return ajax({
		url: "/product/mybank/common/open_account/result/notice",
		method: "post",
		data
	});
};

// 2.4.调整支付顺序
export const companyConsumeSort = data => {
	return ajax({
		url: "/pay/channels/accounts/consume/sort",
		method: "post",
		data
	});
};

// 2.5.签约账户查询
export const companyConsumeQuery = data => {
	return ajax({
		url: "/pay/accounts",
		method: "post",
		data
	});
};

// 2.6.工行虚拟卡/E缴费账户签约
export const companyICBCSign = data => {
	return ajax({
		url: "/pay/channels/invented/apxl_trade/subChannel/platform/accounts",
		method: "post",
		data
	});
};

// 3.1.客户授信结果查询(加上信联额度判断)
export const companyCreditQuery = data => {
	return ajax({
		url: "/product/mybank/enterprise/credit/result/query",
		method: "post",
		data
	});
};

// 3.2.产品变更
export const companyProductIntention = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/product/intention",
		method: "post",
		data
	});
};

// 4.1.设备押金通知
export const companyAliSignNotice = data => {
	return ajax({
		url: "/product/mybank/alisign/result/notice",
		method: "post",
		data
	});
};

// 5.1.保证金列表查询
export const companyDepositQuery = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/list",
		method: "post",
		data
	});
};

// 5.2.1.保证金划拨
export const companyDepositTransfer = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/transfer",
		method: "post",
		data
	});
};

// 5.2.2.建行保证金划拨结果查询
export const companyDepositTransferQuery = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/offline/transfer/result/query",
		method: "post",
		data
	});
};

// 6.1邮寄信息列表查询
export const companyAddressQuery = data => {
	return ajax({
		url: "/product/common/address/query",
		method: "post",
		data
	});
};

// 6.2邮寄信息添加
export const companyAddressAdd = data => {
	return ajax({
		url: "/product/common/address/add",
		method: "post",
		data
	});
};

// 6.3邮寄信息修改
export const companyAddressUpdate = data => {
	return ajax({
		url: "/product/common/address/update",
		method: "post",
		data
	});
};

// 邮寄信息删除
export const companyAddressRemove = data => {
	return ajax({
		url: "/product/common/address/del",
		method: "post",
		data
	});
};

// 8.2.扫码绑定（法人按钮）
export const companyQrCodeBind = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/bind",
		method: "post",
		data
	});
};

// 8.3.个人信息查询
export const companyInfoQuery = data => {
	return ajax({
		url: "/product/mybank/apply/enterprise/customer/query",
		method: "post",
		data
	});
};

// 生成法人二维码
export const companyQrCode = data => {
	return ajax({
		url: "/finance/ali/qrcode",
		method: "post",
		data
	});
};


