// pages/mine/invoice/create/create.js
import { getHttpPost } from "../../../../http/http";
import { billApi, invoiceApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
import {checkBankNo, checkMobile} from "../../../../utils/util";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: false,
        from: 1, //1:账单开票；2：发票历史重开
        invoice_title_type: 0, //抬头类型（0：单位，1：个人）
        more: false,
        icon_select: 'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon-payment-select1577433055460.png',
        icon_un_select: 'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/icon-payment-un-select.png',
        push: 'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/apply-invoice-push1570766099041.png',
        pull: 'https://oilmag.etcsd.com.cn/oilcoreserver/static/resource/apply-invoice-pull1570766088707.png',
        etc_card_no: '', //ETC卡号
        bill_order_no: '', //消费订单号(重开发票)
        invoice_title: '', //发票抬头
        invoice_detail: '', //发票内容
        invoice_tax_no: '', //税号
        accept_email: '', //邮箱地址
        buyer_mobile: '', //购买方手机号
        buyer_address: '', //购买方地址
        bank_name: '', //开户行
        bank_account: '', //账户
        form_id: '',
        titleList: [],
        isShowTitle: true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            const params = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                from: params.from,
                invoice_total_money: params.invoice_total_money,
                etc_card_no: params.etc_card_no,
                invoice_detail: params.invoice_detail,
                bill_order_no: params.order_no,
            });
        } catch (error) {
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    //抬头类型
    onChangeType(e) {
        const {
            disabled
        } = this.data;
        if (!disabled) {
            const invoice_title_type = e.currentTarget.dataset.item;
            this.setData({
                invoice_title_type: invoice_title_type
            });
        }
    },

    //选择发票抬头
    goSelectTitle(e) {
        const that = this;
        my.chooseInvoiceTitle({
            success: (res) => {
                // 这里可以拿到 dynamicCode   --- 用户选择的抬头动态码，目前有效期限制1小时，需尽快使用
                // 将 dynamicCode 传给服务端，服务端再调用openapi 获取真实的发票抬头     
                this.queryTitle(res.result.dynamicCode);
                // my.alert({
                //     title: 'ok', // alert 框的标题
                //     content: JSON.stringify(res.result.dynamicCode),
                // });
            },
            fail: (res) => {
                // my.alert({
                //     title: 'fail', // alert 框的标题
                //     content: JSON.stringify(res),
                // });
            },
        });
    },
    // 查询抬头
    queryTitle(bar_code) {
        const params = {
            bar_code: bar_code
        }
        getHttpPost(invoiceApi.queryTitle, params, res => {
            this.setData({
                invoice_title_type:res.title_type||'',
                invoice_title:res.title_name||'',
                invoice_tax_no:res.tax_register_no||'',
                buyer_address:res.user_address||'',
                buyer_mobile:res.user_mobile||'',
                bank_name:res.open_bank_name||'',
                bank_account:res.open_bank_account||'',
            });
        }, fail => {});
    },

    //更多收起
    onChangeMore(e) {
        let isMore = this.data.more;
        this.setData({
            more: !isMore
        })
    },

    /**
     * 发票内容监听事件
     */
    onInvoiceTitleClick(value) {
        if(!value) return;
        this.setData({
            invoice_title: value
        });
        if (this.data.invoice_title_type === 0) {
            if (value.length >= 4) {
                this.getCompanyInvoice(value);
            }
        }
    },

    onInvoiceDetailClick(value) {
        if(!value) return;
        this.setData({
            invoice_detail: value
        });
    },
    onInvoiceTaxNoClick(value) {
        if(!value) return;
        this.setData({
            invoice_tax_no: value
        });
    },
    onBuyerAddressClick(value) {
        if(!value) return;
        this.setData({
            buyer_address: value
        });
    },
    onBuyerMobileClick(value) {
        if(!value) return;
        this.setData({
            buyer_mobile: value
        });
    },
    onBankNameClick(value) {
        if(!value) return;
        this.setData({
            bank_name: value
        });
    },
    onBankAccountClick(value) {
        if(!value) return;
        this.setData({
            bank_account: value
        });
    },
    onAcceptEmailClick(value) {
        if(!value) return;
        this.setData({
            accept_email: value
        });
    },

    // 提交开票
    openInvoice() {
        const {
            from,
            bill_order_no,
            invoice_title,
            invoice_detail,
            bank_name,
            bank_account,
            buyer_mobile,
            form_id
        } = this.data;
        let title = "";
        if (!bill_order_no) {
            title = "订单号为空";
        } else if (!invoice_title) {
            title = "请添加发票抬头";
        } else if (!invoice_detail) {
            title = "请添加发票内容";
        } else if (bank_account && !checkBankNo(bank_account)) {
            title = "请输入正确的开户账号";
        } else if (buyer_mobile && (!checkMobile(buyer_mobile))) {
            title = "请输入正确的购买方电话";
        }

        if (title) {
            showToast(title);
        } else {
            if (from === 2) {
                this.getInvoiceOff(bill_order_no);
            } else {
                this.getApplyInvoice();
            }
        }
    },

    /**
     * 申请发票 网络请求
     */
    getApplyInvoice() {
        const {
            from,
            etc_card_no,
            invoice_title,
            invoice_detail,
            invoice_tax_no,
            accept_email,
            buyer_mobile,
            buyer_address,
            bank_name,
            bank_account,
            form_id,
            bill_order_no
        } = this.data;
        const params = {
            bill_order_no: bill_order_no,
            invoice_title: invoice_title,
            invoice_tax_no: invoice_tax_no,
            accept_email: accept_email,
            buyer_mobile: buyer_mobile,
            buyer_address: buyer_address,
            bank_name: bank_name,
            bank_account: bank_account,
            etc_card_no: etc_card_no,
            invoice_detail: invoice_detail,
            form_id: form_id,
        }
        showLoading("正在申请...");
        getHttpPost(invoiceApi.invoiceOpen, params, res => {
            hideLoading();
            const result = {
                isSuccess: true,
                bill_order_no: this.data.bill_order_no,
                image_path: res.image_path,
                is_apply_invoice: true
            }
            my.redirectTo({
                url: '/pages/mine/invoice/result/result?result=' + encodeURIComponent(JSON.stringify(result))
            });

        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    /**
     * 企业发票抬头查询
     */
    getCompanyInvoice(key_word) {
        const params = {
            key_word: key_word
        }
        getHttpPost(invoiceApi.invoiceTitle, params, res => {
            const data = res.data;
            this.setData({
                titleList: data,
                isShowTitle: data.length ? true : false
            });
        }, fail => {});
    },
    /**
     * 发票抬头选择
     */
    onTitleClick(e) {
        this.setData({
            isShowTitle: false,
            invoice_title: e.currentTarget.dataset.item.title_name,
            invoice_tax_no: e.currentTarget.dataset.item.tax_register_no,
        })
    },

    /**
     * 发票冲红
     */
    getInvoiceOff(bill_order_no) {

        const params = {
            bill_order_no: bill_order_no,
        }
        showLoading("正在冲红...");
        getHttpPost(invoiceApi.invoiceOff, params, res => {
            hideLoading();
            this.getApplyInvoice();
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

})