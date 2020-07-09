<template>
    <div class="orderConfirm">
        <van-sticky>
            <commHead :title="title" :returnType="returnType" @handleClick="$router.push({name:'shoppingCart'})"></commHead>
        </van-sticky>
        <div v-if="load">
            <div class="info-wrap">
                <div class="addr-info-wrap">
                    <p class="name-phone-wrap">
                        <span class="name">{{infos.fullname}}</span>
                        <span class="phone">{{infos.link_phone}}</span>
                        <span class="default-notice" v-if="infos.is_default">默认</span>
                    </p>
                    <p class="addr-wrap">
                        <span class="addr">{{infos.province}}{{infos.city}}{{infos.area}}{{infos.address}}</span>
                        <span class="btn-change" @click="changeAddrEvt">更换</span>
                    </p>
                    <div class="deliver-time">
                        <p class="item">
                            <span class="notice">配送时间</span>
                            <span
                                class="text"
                            >{{deliverTime}}</span>
                        </p>
                        <span class="btn-change" @click="showPicker = true">更换</span>
                    </div>
                </div>
                <div class="order-wrap">
                    <p class="shop-name ell">{{list.shop_name}}</p>
                    <van-card
                        v-for="(item,index) in list.product_list"
                        :key="index"
                        :num="item.quantity"
                        :price="item.price"
                        :title="item.product_name"
                        :thumb="item.image"
                        :desc="item.specs_name"
                    >
                    </van-card>
                </div>
                <div class="total-momey detail-situ">
                    <van-cell
                        title="商品金额"
                        :value="'￥' + list.amount"
                        :border="false"
                    />
                    <van-cell
                        title="运费"
                        :value="'+￥' + list.freight"
                        value-class="font-red"
                        :border="false"
                    />
                    <van-field label="备注:" v-model="notes" :border="false" maxlength="100"/>
                    <!-- +￥ -->

                </div>
            </div>
            <van-submit-bar
                :price="parseFloat(list.total_amount) * 100"
                button-text="提交订单"
                @submit="onSubmit"
            />
        </div>
        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="columns"
                title="配送时间"
                @cancel="showPicker = false"
                @confirm="onConfirm"
                @change="onTimeChange"
            />
        </van-popup>
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
    ActionSheet,
    Picker,
    Popup,
    Field,
    Sticky
} from "vant";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
import commHead from "../../components/commHead";
export default {
    name: "orderConfirm",
    components: {
        [Card.name]: Card,
        [Button.name]: Button,
        [Cell.name]: Cell,
        [SubmitBar.name]: SubmitBar,
        [Toast.name]: Toast,
        [Dialog.name]: Dialog,
        [ActionSheet.name]: ActionSheet,
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        [Field.name]: Field,
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            title: "订单确认",
            infos: {
                fullname: '',
                link_phone: '',
                province:"",
                city:"",
                area:"",
                address:"",
                is_default: false
            },
            list: {
                total_amount: "",
                freight: "",
                shop_id: "",
                shop_name: "",
                product_list: [],
                delivery_time:[],
            },
            addrIndex: 0,
            deliverTime: "",
            show: false,
            columns: [],
            showPicker: false,
            times: {},
            notes: "",  // 备注
            addressId: "",  // 地址id  从地址编辑页面 地址列表页面返回才会有
            load: false,
            fullAddr: '',
            pageType: '',
            returnType: 'cart'
        };
    },
    computed: {
        ...mapState(["productList","note","addressInfo","moneyAmount","addresslist"])
    },
    methods: {
        ...mapMutations(["updateOrderId","updateNote","updateViewType","updateMoneyAmount","updateAddressInfo","updateAddresslist"]),
        // 地址更改点击事件
        changeAddrEvt() {
            // 地址列表直接点返回的 情况
            this.updateAddresslist(this.infos);
            this.updateViewType('addressList');
            this.$router.push({name:'addressList'});
        },
        // 配送时间配送 更改确定
        onConfirm(data) {
            this.showPicker = false;
            this.deliverTime = data.join(' ');
        },
        onTimeChange(picker, values) {
            picker.setColumnValues(1, this.times[values[0]]);
        },
        // 传给后台参数简化处理
        dealParamsData(list) {
            let data = JSON.parse(JSON.stringify(list)), // 深copy
                arr = [];
                data.forEach((item) => {
                   let obj = {};
                    obj.product_id = item.product_id;
                    obj.quantity = item.quantity;
                    obj.specs_id = item.specs_id;
                    arr.push(obj);
                });
            return arr;
        },
        onSubmit() {
            if(!this.list.is_can_delivery) {
                Toast('所选地址不在配送范围内，请重新填写地址！');
                return;
            }
            this.updateNote(this.notes);
            let obj = {
                    delivery_time: this.deliverTime,
                    notes: this.notes,
                    product_list: this.dealParamsData(this.list.product_list),
                },
                param = {};
                param = Object.assign({}, obj, this.infos);
                Toast.loading({
                    message: '加载中...',
                    duration: 0,
                    forbidClick: true,
                });
                API.orderSubmit(param).then((data) => {
                    Toast.clear();
                    if(data.code == '0000'){
                        let res = data.data;
                        this.updateAddresslist(this.infos);
                        this.updateNote('');
                        this.updateOrderId(res.order_id);
                        this.updateMoneyAmount(res.total_amount);
                        this.$router.push({name:'pay'});
                    }
                }).catch(error => {
                    Toast.clear();
                    Toast(error);
                });
        },
        // 订单信息确认
        orderConfirmInfo() {
            let productList = this.productList.length != 0 ? this.productList : [];
            // this.infos.area = '济南市';
            let param = {
                area: this.infos.area,
                product_list: productList
            };
            Toast.loading({
                message: '加载中...',
                duration: 0,
                forbidClick: true,
            });
            API.orderConfirmInfo(param).then(({data: data}) => {
                Toast.clear();
                this.load = true;
                if(data) this.list = data;
                data && this.dealTimeData(data);
                if(!data.is_can_delivery) {
                    Toast('所选地址不在配送范围内，请重新填写地址！');
                }
            }).catch(error => {
                Toast.clear();
                Toast(error);
            });
        },
        // 获取地址列表
        getAddrListData() {
            API.addressList({}).then((res) => {
                let data = res.data ? res.data : [];
                if(res.code == '0000'){
                    this.dealAddrData(data);
                }
            }).catch(error => {
                Toast(error);
            });
        },
        // 处理地址列表数据
        dealAddrData(data) {
            console.log('enter dealAddrData')
            let id = this.$route.params.id;
            console.log('id:' + id);
            if((this.pageType && this.pageType == 'editAddress')) {
                this.$set(this, 'infos', data[0]);
            } else if(this.pageType && this.pageType == 'addressList') {
                let info = data.filter((item) => {
                    return item.address_id == id
                });
                this.$set(this, 'infos', info[0]);
            } else if(!this.pageType){
                if(data.length > 0) {
                    let defInfo = data.filter((item) => {
                        return item.is_default == true;
                    });
                    this.$set(this, 'infos', defInfo.length > 0 ? defInfo[0] : data[0]);
                } else if(data.length == 0) {
                    this.popDialog()
                }
                
            }
            if(data.length > 0) this.orderConfirmInfo(); 
        },
        popDialog() {
            Dialog.confirm({
                title: '请先设置收货地址',
                message: '你还没有设置收货地址，请点击这里设置',
            }).then(() => {
                this.updateViewType('orderConfirm');
                this.$router.push({name:'editAddress'});
                // 跳转到地址编辑页面， 地址信息保存成功后，跳转到订单确认页
            }).catch(() => {
                this.$router.go(-1)
                Dialog.close();
            });
        },
        // 配送时间数据处理
        dealTimeData(list) {
            let timeArr = list.delivery_time;
            this.columns = [];
            this.times = {};
            // 某一天的时间
            for(let i = 0; i < timeArr.length; i++) {
                this.times[timeArr[i].day] = timeArr[i].hours;
            }
            let arr = Object.keys(this.times);
            console.log('88888888',arr)
            this.columns = [{values: arr}, { values: this.times[arr[0]]}];//时间滚动选择的时候
            this.deliverTime = arr[0] + this.times[arr[0]][0] ?this.times[arr[0]][0]:'';//页面组件显示的时候
        },
    },
    mounted() {
        // document.title = this.title;
        let params = this.$route.params;
        if(params && params.pageType) this.pageType = this.$route.params.pageType;
        // 重置数据
        this.updateViewType('');
        this.notes = this.note;
        
        if(Object.keys(this.addresslist).length > 0) {
            if(this.pageType && this.pageType == 'addressList') {
                this.getAddrListData();
                return;
            }
            this.$set(this, 'infos', this.addresslist);
            // 重置数据
            this.updateAddresslist({});
            this.orderConfirmInfo(); 
        } else {
            this.getAddrListData();
        }
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.orderConfirm {
    width: 100%;
    min-height: 100vh;
    background: #f2f2f2;
    overflow-x: hidden;
    .font-red {
        color: red;
    }
    .info-wrap {
        height: calc(100vh - 1.4rem);
    }
    .addr-info-wrap {
        margin: .2rem 0 0.4rem 0;
        padding: .2rem 0 .2rem 2%;
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
            .phone,
            .default-notice {
                font-size: 0.35rem;
            }
            .default-notice {
                margin-top: 0.1rem;
                height: 0.5rem;
                padding: 0 0.1rem;
                color: #ee7c3d;
                font-size: .3rem;
                border: 0.05333rem solid #ee7c3d;
                border-radius: 0.1rem;
                line-height: 0.5rem;
            }
        }
        .addr-wrap {
            line-height: 0.4rem;
            span {
                display: inline-block;
            }
            .addr {
                width: 80%;
                font-size: 0.35rem;
                background: url(../../assets/images/icon-loc.png) left top /
                    0.5rem 0.5rem no-repeat;
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
            margin-top: 0.67rem;
            font-size: 0;
            .item {
                display: inline-block;
                padding-left: 0.5rem;
                width: 80%;
                font-size: 0;
                color: @basecolor;
                span {
                    display: inline-block;
                    width: 30%;
                    font-size: 0.35rem;
                }
                .text {
                    width: 70%;
                    text-align: right;
                }
            }
            .btn-change {
                position: relative;
                top: -.05rem;
                padding-left: 0.3rem;
                font-size: 0.4rem;
                color: @basecolor;
                font-weight: bold;
                line-height: 0.67rem;
                vertical-align: top;
            }
            .pay-way {
                margin-top: 0.4rem;
            }
        }
    }
    .order-wrap {
        background: #fff;
        margin-bottom: 0.4rem;
        .shop-name {
            padding: 0.2rem 0 0 4%;
            font-size: 0.32rem;
            font-weight: bold;
        }
    }
    .total-momey {
        background: #fff;
        .item {
            font-size: 0;
            span {
                display: inline-block;
                width: 50%;
                font-size: 0.43rem;
                line-height: 1.2rem;
                vertical-align: top;
            }
            .title {
            }
            .money {
                text-align: right;
            }
            .red {
                color: red;
            }
        }
        .single {
            width: 95%;
            padding-right: 5%;
            .money {
                width: 100%;
            }
        }
    }
    // .detail-situ {
    //     margin-bottom: 2rem;
    // }
    .pay-total {
        position: fixed;
        left: 0;
        bottom: 0;
        padding: 0 4%;
        width: 92%;
        height: 2rem;
        background: #fff;
        font-size: 0;
        line-height: 2rem;
        .item {
            display: flex;
            justify-content: space-between;
            span {
                display: inline-block;
                width: 50%;
                font-size: 0.43rem;
                vertical-align: top;
            }
            .btn-wrap {
                width: 3rem;
                height: 2rem;
            }
        }
    }
    .van-button {
        margin-right: 0.2rem;
    }
    .van-button--small {
        height: 0.6rem;
        line-height: 0.49rem;
    }
    .van-submit-bar__bar {
        padding: .2rem 0;
    } 
}

</style>