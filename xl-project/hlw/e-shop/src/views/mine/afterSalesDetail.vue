<template>
    <div class="refundDetailWrap">
        <van-sticky class="orderWrap">
            <commHead :title="title" @backEvt="backEvt"></commHead>
        </van-sticky>
        <div class="refundStatus" v-if ="item.refund_status=='1'"> 已申请退款</div>
        <div class="refundStatus" v-if ="item.refund_status=='2'"> 商家拒绝</div>
        <div class="refundStatus" v-if ="item.refund_status=='3'"> 申请通过</div>
        <div class="refundStatus" v-if ="item.refund_status=='4'"> 退款失败</div>
        <div class="refundStatus" v-if ="item.refund_status=='5'"> 退款成功</div>
        <div class="refundStatus" v-if ="item.refund_status=='99'"> 退款撤销</div>
        <div class="refundReason" v-if ="item.refund_status=='2'">
            <div class="refundReasonTitle">商家拒绝原因</div>
            <div class="refundReasonContent">{{item.reject_reason}}</div>
        </div>
        <div class="refundOthers detail-situ">
            <van-field label="退款原因:" v-model="item.refund_reason" readonly :border="false" />
            <van-field label="退款金额:" v-model="'￥' + item.refund_amount" v-if ="item.refund_status=='3'" readonly :border="false" />
            <van-field label="退款单号:" v-model="item.serial_no" readonly :border="false" />
        </div>
    </div>
</template>
<script>
    import {Sticky,field} from 'vant';
    import commHead from "../../components/commHead";
    export default {
        name:"afterSalesDetail",
        components: {
            [Sticky.name]: Sticky,
            [field.name]: field,
            commHead,
        },
        data () {
            return {
                title:"退款详情",
                item:{},
            }
        },
        mounted() {
            this.item = this.$route.params.item
            console.log('收item',this.item)
        },
        methods:{
            // 返回上一页点击事件
            backEvt() {
                this.$router.go(-1);
            },
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/styles/color.less";
.refundDetailWrap {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100vh;
    background: #f2f2f2;
}
.refundStatus {
    background-color: #e2250c;
    color:#fff;
    padding:0 20px;
    height: 120px;
    font-size: 16px;
    line-height: 120px;
}
.refundReason {
    margin-top:10px;
    background-color: #fff;
    padding:10px;
}
.refundReasonTitle {
    font-size:16px ;
    margin-bottom:10px;
    font-weight: 700;
}
.refundReasonContent {
    font-size:12px ;
}
.refundOthers {
    margin-top:10px;
    background: #fff;
}
/* .van-cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.van-cell_title {
    -webkit-box-flex: 0 0 20%;
    -webkit-flex: 0 0 20%;
    flex:0 0 20%;
} */
</style>