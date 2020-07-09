const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: app.globalData.isIphoneX,
        etc_card_no: "", //ETC卡号
        bill_order_no: "", //消费订单号
        invoice_title: "", //发票抬头
        invoice_detail: "", //发票内容 汽油90#
        invoice_total_money: "", //发票金额
        invoice_create_time: "", //申请时间
        invoice_pdf_url: '', //PDF地址
        accept_mobile: "", //接收手机号
        buyer_address: "", //购买方地址
        bank_name: "", //开户行
        bank_account: "", //z账户
        image_path: "", //发票地址
        accept_email: "", //邮箱地址
        is_show_redaction: false, //重新开发票
        is_show_redaction_hint: false, //红冲提示
        is_show_repeat: false, //重复申请
        allow_red: false, //是否允许红冲
        redaction: null,
        details: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            const details = JSON.parse(decodeURIComponent(options.details));
            const {
                etc_card_no,
                invoice_title,
                invoice_detail,
                invoice_total_money,
                invoice_create_time_str_s,
                image_path,
                accept_mobile,
                buyer_address,
                bank_name,
                bank_account,
                allow_red,
                accept_email,
                bill_order_no
            } = details;
            const redaction = {
                invoice_create_time: invoice_create_time_str_s,
                invoice_detail: invoice_detail,
                invoice_total_money: invoice_total_money
            }
            this.setData({
                bill_order_no: bill_order_no || "",
                etc_card_no: etc_card_no || "",
                invoice_title: invoice_title || "",
                invoice_detail: invoice_detail || "",
                invoice_total_money: invoice_total_money || "",
                invoice_create_time: invoice_create_time_str_s || "",
                image_path: image_path || "",
                accept_mobile: accept_mobile || "",
                buyer_address: buyer_address || "",
                bank_name: bank_name || "",
                bank_account: bank_account || "",
                accept_email: accept_email || "",
                allow_red: allow_red,
                redaction: redaction,
                details: details
            });
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    /**
     * 发票信息有误 申请重开
     */
    onRedactionClick: function () {
        const {
            allow_red
        } = this.data; //判断是否已重开过发票
        this.setData({
            is_show_redaction: allow_red,
            is_show_repeat: !allow_red
        });
    },

    /**
     * 申请重开
     */
    onRedactionModalClick: function () {
        this.setData({
            is_show_redaction: false,
            is_show_redaction_hint: true
        });
    },

    /**
     * 重开发票 Modal 确认按钮
     */
    onRedactionInfoModalClick: function () {
        const {
            invoice_total_money,
            etc_card_no,
            invoice_detail,
            bill_order_no
        } = this.data;
        const params = {
            from: 2,
            invoice_total_money: invoice_total_money,
            etc_card_no: etc_card_no,
            invoice_detail: invoice_detail,
            order_no: bill_order_no,
        }
        const details = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: "/pages/mine/invoice/create/create?details=" + details
        });
    },

    /**
     * 重复申请 Modal 确认按钮
     */
    onRepeatClick: function () {
        this.setData({
            is_show_repeat: false
        });
    },

    /**
     *  重发邮件
     */
    onResendClick: function () {
        const {
            bill_order_no
        } = this.data;
        const params = {
            bill_order_no: bill_order_no,
        }
        const details = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: "/pages/mine/invoice/resend/resend?details=" + details
        })
    },

    /**
     * 查看电子发票
     */
    onSeeInvoiceClick: function () {
        my.previewImage({
            urls: [this.data.image_path] // 需要预览的图片http链接列表
        })
    }


})