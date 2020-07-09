// 车辆类型
export const vehicleTypeMap = {
	"11": "货一",
	"12": "货二",
	"13": "货三",
	"14": "货四",
	"15": "货五",
	"16": "货六",
};

// 产品
export const productMap = {
	"19": "周结",
	"54": "周结",
	"52": "日结"
};

// 车牌颜色
export const plateColorMap = {
	"1": "黄色",
	"0": "蓝色",
  "4":"渐变绿"
};

// 还款通道
export const channelCodeMap = {
	"ap_xl_union_pay": "银联",
	"ap_xl_spd": "浦发",
	"ap_xl_alipay": "支付宝",
	"apxl_trade": "交易中心",
	"ap_xl_icbc_wallet": "二类户"
};

// 账单状态
export const billStateMap = {
	"ENABLED": "未结算",
	"CLEARED": "已结清",
	"OVERDUE": "逾期",
	"TRANSFORMED": "已生成对应的账单"
};

// 发货状态
export const deliveryStateMap = {
	"WAIT": "待发货",
	"SEND": "已发货",
	"RECEIVE": "已收货"
};

// 车辆轴数
export const axlesMap = {
	"2": "两轴",
	"3": "三轴",
	"4": "四轴",
	"5": "五轴",
	"6": "六轴"
};

// 联行卡号映射
export const accBankMap = {
	"102100099996": "中国工商银行",
	"104100000004": "中国银行",
	"301290000007": "交通银行",
};

export const receiving={
	"1": "邮寄",
	"2": "现场领卡",
}
