<template>
    <div class="pay-home">
        <!-- <header class ="header-title">信联收银台</header> -->
        <van-sticky class="orderWrap">
            <commHead :title="title" @backEvt="backEvt"></commHead>
        </van-sticky>
        <div class="content">
            <div class="price">{{productMoneyAmount}}</div>
            <div class="pay-tips">
                <div class="pay-tips-text">信联卡支付</div>
                <div class="amount-price">可用总余额 <span>{{totalBalance}}</span></div>
            </div>
            <van-checkbox-group 
                @change="groupChange"
                v-model="result" 
                checked-color="#f33a22"
            >
                <div class="card-wrapper" v-for="(item, index) in cardList" :key="index">
                    <div class="card-left">
                        <img src="@/assets/images/card.png" class="elogo-img" alt=""/>
                    </div>
                    <div class="card-middle">
                        <div>信联卡 ({{item.card_no}})</div>
                        <div style="color:#999999;">余额（{{item.balance}}）</div>
                    </div>
                    <div class="card-right">
                        <van-checkbox 
                            :name="item"  
                            v-if ="item.card_status=='7'|| item.card_status=='9' || item.balance=='0.00'" 
                            disabled
                        >
                        </van-checkbox>
                        <van-checkbox v-else :name="item" :disabled="checkedCardNo.indexOf(item.card_no) < 0 && checkedMoneySum >= parseFloat(productMoneyAmount)"></van-checkbox>
                    </div>
                </div>
            </van-checkbox-group>
            <div class="bindOther" @click="bindOtherCard">
                <div>绑定其他信联卡</div>
            </div>
        </div>
        <div class="btn-wrapper">
            <van-button class="btn" block  @click="topay">信联卡支付</van-button>
        </div>
    </div>
</template>
<script>
    import { Checkbox, CheckboxGroup,Cell,CellGroup,Field,Button,Toast,Sticky } from 'vant';
    import { mapState,mapMutations } from "vuex";
    import commHead from "../components/commHead";
    import API from "@/api"
export default {
    name:"pay",
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Field.name]: Field,
        [Button.name]: Button,
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        commHead,
    },
    data() {
        return {
            title:"信联收银台",
            // 产品总金额
            productMoneyAmount:"",
            //可用总金额
            totalBalance:0,
            cardList: [],
            result: [],
            value: '',
            // 选中的checkbox
            checkedCardList:[],
            // 选中的checkbox的卡号
            checkedCardNo:[],
            checkedMoneySum:0,
        }
    },
    computed: {
        ...mapState(["moneyAmount","orderId"])
    },
    mounted() {
        this.getCardList()
        this.productMoneyAmount = this.moneyAmount
    },
    methods:{
        // 返回上一页点击事件
        backEvt() {
            this.$router.go(-1);
        },
        // 目前订单中已没有可用于充抵的金额
        // 每多选中一张卡的时候都判断一下选中卡总额和产品总金额
        groupChange(val) {
            console.log('val = ', val)
            this.checkedMoneySum = 0
            this.checkedCardNo = []
            if(val && val.length > 0) {
                val.forEach(item => {
                    this.checkedMoneySum += parseInt(item.balance)
                    this.checkedCardNo.push(item.card_no)
                })
            }
        },
        getCardList() {
            API.cardList().then(res => {
                console.log("cardList：>>>>>>>>>>>>>>>>");
                console.log(res);
                this.totalBalance = res.data.total_balance
                this.cardList = res.data.card_list
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
        // 绑定其他信联卡
        bindOtherCard() {
            if(this.cardList.length ==3) {
                Toast("很抱歉，您最多可绑定三张信联卡");
                return;
            }
            this.$router.push({
                path:'/addCardNo',
            })
        },
        // 去支付
        topay(){
            if(this.checkedMoneySum) {
                console.log('this.checkedMoneySum',this.checkedMoneySum)
                if(this.checkedMoneySum < this.productMoneyAmount) {
                    Toast("金额不足");
                    return;
                }
            }
            if(!this.checkedMoneySum) {
                Toast("请选择信联卡");
                return;
            }
            // 选中金额=可用金额
            const params ={
                order_id:this.orderId,//从订单确认页面或者中途支付的订单页面传过来一个订单id
                card_no:this.checkedCardNo,
            }
            console.log('支付params',params)
            // return;
            API.orderPay(params).then(res => {
                console.log("orderPay：>>>>>>>>>>>>>>>>");
                console.log(res.data);
                // if(res.data.is_wx_pay){
                    // 微信支付处理
                    // API.getpay(这里是后端要你传的参数).then((data) => {
                    //     var args = data
                    //     wx.ready(function(){
                    //         wx.chooseWXPay({
                    //             timestamp: args.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    //             nonceStr: args.nonceStr, // 支付签名随机串，不长于 32 位
                    //             package: args.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    //             signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    //             paySign: args.paySign, // 支付签名
                    //             success: function (res) {
                    //                 //  这里写成功后的动作 我试过跳转路由好像不灵 或者是执行太快后端处理订单未变化呢 我改成了这个   
                    //                 window.location.href="你所要跳转的页面";
                    //             },
                    //             cancel: function (res) {
                    //                 alert('已取消支付');
                    //             },
                    //             fail: function (res) {
                    //                 alert('购买失败，请重新创建订单')
                    //             }
                    //         });
                    //     });
                    // }) 
                // }else{
                    Toast("支付成功");
                    // 信联卡全部支付完毕
                    setTimeout(() => {
                        this.$router.push({name:'orderDetail'})
                    }, 2000);
                // }
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
    }
}
</script>
<style scoped>
.pay-home {
    background-color: #f5f5f5;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
}
.header-title {
    font-size: 14px;
    font-weight: 700;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
}
.price {
    margin-top: 10px;
    color:#f43d25;
    font-weight: 700;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
}
.content {
    background-color: #fff; 
}
.pay-tips {
    background-color: #f7dedb;
    display: flex;
	justify-content: space-between;
	align-items: center;
    font-size: 14px;
    padding:0 30px;
    height: 40px;
    line-height: 40px;
    color:#f43d25;
    font-weight: 700;
}
.card-wrapper{
    width: 100vw;
    background-color: white;
    /* min-height: 100px; */
    box-sizing: border-box;
    padding :10px;
    display:flex;
    justify-self: center;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid #e6e6e6;
}
.card-left{
    flex: 0 0 60px;
    height: 60px;
    display :flex;
    justify-content: center;
    align-items: center;
}
.left-img{
    width :50px;
    height: 50px;
    padding :15px;
    border-radius :10px;
    border: 1px solid rgb(166, 31, 35) ;
}
.elogo-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.card-middle{
    /* flex: 1; */
    flex: 0 0 200px;
    height: 60px;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30px;
}
.middle-desc{
    color:#999999;
}
.card-right{
    /* flex: 0 0 100px; */
    flex: 0 0 80px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.right-img{
    width: 50px;
    height: 50px;
}
.card-right-item{
    flex: 1;
    display:flex;
    justify-content: center;
    align-items: center;
    color: #999999;
}
.btn-wrapper{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: white;
    width: 100vw;
}
.btn{
    width: 350px;
    height: 44px;
    margin: 13px 10px 19px;
    background-color: rgb(243, 58, 34);
    color: white;
    font-family: SourceHanSansCN-Light;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
}
.bindOther {
    font-size: 12px;
    text-align: right;
    vertical-align: center;
    padding:5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>