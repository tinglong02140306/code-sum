<template>
    <div class="orderDetail">
        <van-sticky>
            <commHead :title="title" :returnType="returnType" @handleClick="$router.push({name:'mineHome'})"></commHead>
        </van-sticky>
        <div :class="list.order_status && (list.order_status == '1' || list.order_status == '3') ? 'set-botom' : ''" v-if="load">
            <div class="order-state-wrap">
                <div>
                    <span class="text1">{{ getPayStateText(list.order_status) }}</span>
                    <div class="cut-down-wrap">
                        <!-- 取消付款倒计时 -->
                        <div class="" v-if="list.order_status && list.order_status == '1' && list.time_remaining > 0">
                            <van-count-down :time="list.time_remaining" format="HH 时 mm 分" @finish="payFinishEvt">
                                <template v-slot="timeData">
                                    <span>剩</span>
                                    <span class="item" v-if="timeData.hours">{{ timeData.hours }}时</span>
                                    <span class="item">{{ timeData.minutes }}分自动关闭</span>
                                </template>
                            </van-count-down>
                        </div>
                        <!-- 自动确认收货倒计时 -->
                         <div class="" v-if="list.order_status && list.order_status == '3' && list.time_remaining > 0">
                            <van-count-down :time="list.time_remaining" format="DD 天 HH 时" @finish="recFinishEvt">
                                <template v-slot="timeData">
                                    <span>还剩</span>
                                    <span class="item" v-if="timeData.days">{{ timeData.days }}天</span>
                                    <span class="item">{{ timeData.hours }}分自动确认收货</span>
                                </template>
                            </van-count-down>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="addr-info-wrap">
                <p class="name-phone-wrap">
                    <span class="name">{{list.fullname}}</span>
                    <span class="phone">{{list.link_phone}}</span>
                </p>
                <p class="addr-wrap">
                    <span class="addr">{{list.address}}</span>
                </p>
                <div class="deliver-time">
                    <p class="item">
                        <span class="notice">配送时间</span>
                        <span class="text">{{list.delivery_time}}</span>
                    </p>
                    <div v-if="list.pay_list && list.pay_list.length > 0">
                        <p class="item pay-way pay-way-title"><span>支付方式</span></p>
                        <p class="item pay-way" v-for="(item,index) in list.pay_list" :key="index">
                            <span class>{{item.pay_type == '1' ? '信联卡支付': '微信支付'}}</span>
                            <span class="text">￥{{item.pay_amount}}</span>
                        </p>
                    </div>
                    
                </div>
            </div>
            <div class="order-wrap">
                <p class="shop-name ell" @click="goShop(list.shop_id)">{{list.shop_name}}</p>
                <van-card
                    v-for="(item,index) in list.sub_order_list"
                    :key="index"
                    :num="item.quantity"
                    :price="item.price"
                    :title="item.product_name"
                    :desc="item.specs_name"
                    :thumb="item.image"
                    @click="goProductDetail(item.product_id)"
                >
                    <template #footer>
                        <div class="btn-wrap" v-if="list.order_status && (list.order_status == '2' || list.order_status == '3' || list.order_status == '4')">
                            <van-button plain round type="info" size="small" color="#ee0a24" @click.stop="applyRefund(item)">{{getRefundText(item.refund_status)}}</van-button>
                            <van-button v-if="list.order_status && (list.order_status == '4') && !item.is_eval" plain round type="info" size="small" color="#ee0a24" @click.stop="goEvalute(item)">评价</van-button>
                        </div>
                    </template>
                </van-card>
            </div>
            <div class="total-momey detail-situ">
                <van-cell title="商品金额" :value="'￥' + list.total_amount" :border="false" />
                <van-cell title="运费" :value="'+￥' + list.freight" value-class="font-red" :border="false" />
                <p class="item single">
                    <span class="money">实付款：￥{{list.total_amount}}</span>
                </p>
                <van-cell title="订单编号" :value="list.order_id" :border="false" />
                <van-cell title="订单创建时间" :value="list.gmt_create" :border="false" v-if="list.gmt_create"/>
                <van-cell title="订单确认时间" :value="list.gmt_received" :border="false" v-if="list.gmt_received"/>
                 <van-cell title="物流公司" :value="list.express_cron" :border="false" v-if="list.express_cron"/>
                  <van-cell title="物流单号" :value="list.express_no" :border="false" v-if="list.express_no"/>
            </div>
        </div>
        <div class="bottom-btn-wrap" v-if="list.order_status && (list.order_status == '1' || list.order_status == '3')">
            <div class="wrap">
                <van-button plain round type="info" size="small" color="#ee0a24
                
                
                
                " v-if="list.order_status && (list.order_status == '1')" @click="cancelPayEvt">取消付款</van-button>
                <van-button plain round type="info" size="small" color="#ee0a24" v-if="list.order_status && (list.order_status == '1')" @click="goPay">付款</van-button>
                <van-button plain round type="info" size="small" color="#ee0a24" v-if="list.order_status && (list.order_status == '3')" @click="confirmRecEvt">确认收货</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Card,
    Button,
    Cell,
    SubmitBar,
    Toast,
    Dialog,
    CountDown,
    Sticky
} from "vant";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
import commHead from "../../components/commHead";
export default {
    name: "orderDetail",
    components: {
        [Card.name]: Card,
        [Button.name]: Button,
        [Cell.name]: Cell,
        [SubmitBar.name]: SubmitBar,
        [Toast.name]: Toast,
        [Dialog.name]: Dialog,
        [CountDown.name]: CountDown,
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            title: "订单详情",
            list: {},
            load: false,
            returnType: "detail"
        };
    },
    computed: {
        ...mapState(["orderId"])
    },
    methods: {
        ...mapMutations(["updateProductId","updateOrderList","updateOrderId","updateMoneyAmount","updateShopId"]),
        // 查看商品详情
        goProductDetail(productId) {
            this.updateProductId(productId);
            this.$router.push({ name: "productDetails"});
        },
        // 跳转到店铺
        goShop(id) {
            this.updateShopId(id)
            this.$router.push({ name: "shop"});
        },
        // 申请售后
        applyRefund(item) {
            if(item.refund_status != '0') return;
            this.$router.push({ name: "refund", params: {itemList : item}});
        },
        // 取消付款
        cancelPayEvt() {
            let param = {
                order_id: this.list.order_id,
                reason: ''
            }
            Dialog.confirm({
                title: '',
                message: '确定取消此订单？',
            }).then(() => {
                this.load = false;
                API.cancelOrder(param).then(({data:data}) => {
                    // 刷新状态
                    this.getData();
                }).catch(error => {
                    Toast(error);
                });
            }).catch(() => {
                Dialog.close();
            });
        },
        // 付款
        goPay() {
            this.updateOrderId(this.list.order_id);
            this.updateMoneyAmount(this.list.total_amount);
            this.$router.push({name:'pay'});
        },
        // 确认收货
        confirmRecEvt() {
            let param = {
                order_id: this.list.order_id
            }
            this.load = false;
            API.orderReceived(param).then(({data:data}) => {
                // 刷新状态
                this.getData();
            }).catch(error => {
                Toast(error);
            });
        },
        // 去评价
        goEvalute(item) {
            let obj = {
                sub_order_id: item.sub_order_id,
                amount: item.amount,
                product_name: item.product_name,
                image: item.image
            }
            this.$router.push({ name: "writeComment", params: {subItem:obj}});
        },
        // 自动取消付款倒计时结束触发
        payFinishEvt() {
            // 取消订单
            this.cancelPayEvt();
        },
        // 自动确认收货倒计时
        recFinishEvt() {
            this.confirmRecEvt();
        },
        // 获取订单数据
        getData() {
            let param = {
                order_id: this.orderId
            };
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0,
            });
            API.orderDetail(param).then(({data:data}) => {
                Toast.clear();
                this.dealdata(data)
                this.load = true;
            }).catch(error => {
                Toast.clear();
                this.load = true;
                Toast(error);
            });
        },
        // 数据格式处理
        dealdata(data) {
            if(Object.keys(data).length > 0) {
                if(data.time_remaining <= 0) {
                    this.list = data;
                    setTimeout(()=> {
                        if(data.order_status == '1') {
                            this.cancelPayEvt();
                        } else if(data.order_status == '3') {
                            this.confirmRecEvt();
                        }
                    })
                    
                } else {
                    data.time_remaining = parseInt(data.time_remaining) * 1000;
                    this.list = data;
                }  
            }
            this.list = data;
        },
        // 文字显示
        getPayStateText(state) {
            let str = '';
            switch(state) {
                case '1':
                    str = '等待买家付款';
                    break;
                case '2':
                    str = '买家已付款';
                    break;
                case '3': 
                    str = '卖家已发货';
                    break;
                case '4': 
                    str = '交易成功';
                    break;
                case '99': 
                    str = '订单已取消';
                    break;
                default:
                    break;
            }
            return str;
        },
        // 售后状态 文字显示
        getRefundText(state) {
            // refund_status
             let str = '';
            switch(state) {
                case '0':
                    str = '申请售后';
                    break;
                case '1':
                    str = '售后中';
                    break;
                case '2':
                    str = '商家拒绝';
                    break;
                case '3': 
                    str = '商家通过';
                    break;
                case '4': 
                    str = '退款失败';
                    break;
                case '5': 
                    str = '退款完成';
                    break;
                case '99': 
                    str = '退款申请撤销';
                    break;
                default:
                    break;
            }
            return str;

        }

    },
    mounted() {
        this.getData(); 
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.orderDetail {
    width: 100%;
    min-height: 100%;
    background: #f2f2f2;
    .font-red {
        color: red;
    }
    .order-state-wrap {
        display: flex;
        align-items: center;
        padding-left: 4%;
        width: 100%;
        height: 2.8rem;
        background: rgb(238, 10, 36);
        span {
            display: inline-block;
            padding: .1rem 0;
            color: #fff;
            font-size: .35rem;
        }
        .text1 {
            width: 100%;
            font-size: .45rem;
        }
        .text2 {
            width: 100%;
            font-size: .35rem;
        }
    }
    .addr-info-wrap {
        margin-bottom: 0.4rem;
        padding: 0 0 .2rem 4%;
        width: 100%;
        color: @basecolor;
        border: 1px solid #f2f2f2;
        border-left: none;
        border-right: none;
        background: #fff;
        .name-phone-wrap {
            padding-left: 0.6rem;
            height: 0.8rem;
            line-height: 0.8rem;
            span {
                display: inline-block;
                margin-right: 0.27rem;
                vertical-align: top;
            }
            .name {
                font-size: 0.35rem;
            }
            .phone {
                font-size: 0.35rem;
            }
        }
        .addr-wrap {
            // margin-top: 0.2rem;
            line-height: 0.4rem;
            padding-bottom: .2rem;
            span {
                display: inline-block;
            }
            .addr {
                width: 80%;
                font-size: 0.35rem;
                background: url(../../assets/images/icon-loc.png) left top / 0.5rem
                    0.5rem no-repeat;
                padding-left: 0.6rem;
                line-height: .6rem;
            }
            .btn-change {
                padding-left: 0.3rem;
                font-size: 0.4rem;
                color: @basecolor;
                font-weight: bold;
                line-height: 0.67rem;
                vertical-align: top;
            }
        }
        .deliver-time {
            font-size: 0;
            .item {
                display: inline-block;
                padding: 0 .2rem;
                width: 100%;
                font-size: 0;
                color: @basecolor;
                span {
                    display: inline-block;
                    width: 30%;
                    font-size: 0.37rem;
                }
                .text {
                    text-align: right;
                    width: 70%;
                }
            }
            .btn-change {
                padding-left: 0.3rem;
                font-size: 0.4rem;
                color: @basecolor;
                font-weight: bold;
                line-height: 0.67rem;
                vertical-align: top;
            }
            .pay-way {
                // margin-top: 0.4rem;
            }
            .pay-way-title {
                padding: .1rem .2rem;
                margin-top: .2rem;
                width: 100%;
                font-weight: bold;
                font-size: .37rem; 
            }
        }
    }
    .order-wrap {
        margin-bottom: 0.4rem;
        background: #fff;
        .shop-name {
            padding: 0.2rem 0 0 4%;
            font-size: 0.32rem;
            font-weight: bold;
        }
    }
    .total-momey {
        background: #fff;
        // padding: 0 4%;
        // width: 92%;
        .item {
            font-size: 0;
            width: 100%;
            padding-right: 5%;
            span {
                display: inline-block;
                width: 50%;
                font-size: 0.37rem;
                line-height: 1.2rem;
                vertical-align: top;
            }
            .money {
                width: 100%;
                text-align: right;
            }
            .red {
                color: red;
            }
        }
    }
    .van-card {
        background: #fff;
    }
    .btn-wrap {
        text-align: right;
        .van-button {
            margin-right: 0.2rem;
        }
        .van-button--small {
            height: 0.6rem;
            line-height: 0.49rem;
        }
    }
    .bottom-btn-wrap {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.2rem;
        border-top: .01rem solid #f2f2f2;
        background: #fff;
        .wrap {
            display: flex;
            padding: 0 4%;
            width: 100%;
            height: 100%;
            align-items: center;
            text-align: right;
            justify-content: flex-end;
            .van-button {
                margin-right: 0.2rem;
            }
            .van-button--small {
                padding: 0;
                height: 0.6rem;
                width: 1.8rem;
                line-height: 0.49rem;
            }
        }
        
    }
    .set-botom {
        margin-bottom: 1.3rem;
    }
}
</style>