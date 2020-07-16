// 店铺状态
export const shopStatusMap = {
	"": "全部",
	"1": "启用",
	"0": "停用",
};

// 店铺选项
export const shopStatusOptions = [
	{ key: "1", display_name: "启用" },
	{ key: "0", display_name: "停用" }
];

// 产品选项
export const productStatusOptions = [
	{ key: "1", display_name: "上架" },
	{ key: "0", display_name: "下架" },
	{ key: "", display_name: "全部" }
];

export const productStatusMap = {
	"": "全部",
	"0": "下架",
	"1": "上架"
};

// 包邮选项
export const shipStatusOptions = [
	{ key: "1", display_name: "包邮" },
	{ key: "0", display_name: "不包邮" }
];

export const shipStatusMap = {
	"1": "包邮",
	"0": "不包邮"
};

// 审核状态
export const auditStatusMap = {
	"1": "审核驳回",
	"0": "待审核",
	"2": "审核通过"
};

export const auditStatusOptions = [
	{ key: "", label: "全部" },
	{ key: "0", label: "待审核" },
	{ key: "1", label: "审核驳回" },
	{ key: "2", label: "审核通过" }
];

export const recommendMap = {
	"1": "是",
	"0": "否",
};

export const orderStatusMap = {
	"1": "提交成功",
	"2": "待发货",
	"3": "已发货",
	"4": "系统确认收货",
	"5": "用户确认收货",
	"99": "订单取消"
};

export const orderOptions = [
	{ key: "", label: "全部" },
	{ key: "1", label: "提交成功" },
	{ key: "2", label: "待发货" },
	{ key: "3", label: "已发货" },
	{ key: "4", label: "系统确认收货" },
	{ key: "99", label: "订单取消" },
];

export const salesStatusMap = {
	"1": "售后中",
	"2": "商家拒绝",
	"3": "商家通过",
	"4": "退款失败",
	"5": "退款完成",
	"99": "退款申请撤销"
};

export const salesOptions = [
	{ key: "", label: "全部" },
	{ key: "1", label: "售后中" },
	{ key: "2", label: "商家拒绝" },
	{ key: "3", label: "商家通过" },
	{ key: "4", label: "退款失败" },
	{ key: "5", label: "退款完成" },
	{ key: "99", label: "退款申请撤销" },
];

export const memberStatusMap = {
	"0": "禁用",
	"1": "有效"
};

export const imageStatusMap = {
	"0": "禁用",
	"1": "启用"
};
