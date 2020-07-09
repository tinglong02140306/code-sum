//支持申办的ETC卡类型
export const SUPPORT_TYPE = [
    {
        name: "鲁通卡",
        address: "山东",
        province:"鲁",
        province_code: "37",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon_lutongka.png",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-shandong.png",
        card_issuers: "山东省交通运输厅高速公路收费结算中心发行",
        num_color: "#cf7e22",
        bg_color:"#424A81"
    },
    {
        name: "速通卡",
        address: "天津",
        province:"津",
        province_code: "12",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-tianjin.png",
        card_issuers: "天津市高速公路电子收费管理中心发行",
        num_color: "#dddb3c",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon_sutongka1.png",
        bg_color:"#39868C"
    },
    {
        name: "蒙通卡",
        address: "内蒙古",
        province:"蒙",
        province_code: "15",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon_mengtongka.png",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-neimenggu.png",
        card_issuers: "内蒙古自治区交通运输厅",
        num_color: "#e32518",
        bg_color:"#C9566B"

    },
    {
        name: "吉通卡",
        address: "吉林",
        province:"吉",
        province_code: "22",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon_jitongka.png",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-jilin.png",
        card_issuers: "吉林省高速公路管理局",
        num_color: "#ffd352",
        bg_color:"#424A81"
    },
    {
        name: "苏通卡",
        address: "江苏",
        province:"苏",
        province_code: "32",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon-sutongka.png",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-jiangsu.png",
        card_issuers: "江苏高速公路联网运营管理有限公司",
        num_color: "#1a2377",
        bg_color:"#39868C"

    },
    {
        name: "通渝卡",
        address: "重庆",
        province:"渝",
        province_code: "50",
        icon: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon_tongyuka.png",
        bg_img: "https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/bg-img-chongqing.png",
        card_issuers: "通 · 渝 · 路 · 生 · 活",
        num_color: "#fffc24",
        bg_color:"#C9566B"
    },
    {
        name: "速通卡",
        address: "北京",
        province:"京",
        province_code: "11",
        bg_color:"#424A81"
    },
    {
        name: "低碳畅行卡",
        address: "河北",
        province:"冀",
        province_code: "13",
        bg_color:"#C9566B"
    },
    {
        name: "快通卡",
        address: "山西",
        province:"晋",
        province_code: "14",
        bg_color:"#39868C"
    },
    {
        name: "辽通卡",
        address: "辽宁",
        province:"辽",
        province_code: "21",
        bg_color:"#39868C"
    },
    {
        name: "龙通卡",
        address: "黑龙江",
        province:"黑",
        province_code: "23",
        bg_color:"#C9566B"
    },
    {
        name: "沪通卡",
        address: "上海",
        province:"沪",
        province_code: "31",
        bg_color:"#424A81"
    },
    {
        name: "货车支付卡",
        address: "浙江",
        province:"浙",
        province_code: "33",
        bg_color:"#424A81"
    },
    {
        name: "慧易通",
        address: "安徽",
        province:"皖",
        province_code: "34",
        bg_color:"#C9566B"
    },
    {
        name: "闽通卡",
        address: "福建",
        province:"闽",
        province_code: "35",
        bg_color:"#39868C"
    },
    {
        name: "赣通卡",
        address: "江西",
        province:"赣",
        province_code: "36",
        bg_color:"#424A81"
    },
    {
        name: "中原通",
        address: "河南",
        province:"豫",
        province_code: "41",
        bg_color:"#39868C"
    },
    {
        name: "通衢卡",
        address: "湖北",
        province:"鄂",
        province_code: "42",
        bg_color:"#C9566B"
    },
    {
        name: "湘通卡",
        address: "湖南",
        province:"湘",
        province_code: "43",
        bg_color:"#C9566B"
    },
    {
        name: "粤通卡",
        address: "广东",
        province:"粤",
        province_code: "44",
        bg_color:"#39868C"
    },
    {
        name: "八桂行卡",
        address: "广西",
        province:"桂",
        province_code: "45",
        bg_color:"#424A81"
    },
    {
        name: "高速通卡",
        address: "四川",
        province:"川",
        province_code: "51",
        bg_color:"#424A81"
    },
    {
        name: "黔通卡",
        address: "贵州",
        province:"黔",
        province_code: "52",
        bg_color:"#39868C"
    },
    {
        name: "云通卡",
        address: "云南",
        province:"滇",
        province_code: "53",
        bg_color:"#C9566B"
    },
    {
        name: "三秦通",
        address: "陕西",
        province:"陕",
        province_code: "61",
        bg_color:"#C9566B"
    },
    {
        name: "陇通卡",
        address: "甘肃",
        province:"甘",
        province_code: "62",
        bg_color:"#39868C"
    },
    {
        name: "青通卡",
        address: "青海",
        province:"青",
        province_code: "63",
        bg_color:"#424A81"
    },
    {
        name: "宁通卡",
        address: "宁夏",
        province:"宁",
        province_code: "64",
        bg_color:"#C9566B"
    },
    {
        name: "天山行卡",
        address: "新疆",
        province:"新",
        province_code: "65",
        bg_color:"#39868C"
    }
]