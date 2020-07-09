<template>
    <div class="orderWrap">
        <div class="top">
            <van-sticky>
                <commHead :title="title" :returnType="returnType" @handleClick="handleClick"></commHead>
            </van-sticky>
            <!-- 切换状态 -->
            <!-- <div class="top"> -->
                <van-tabs @click="onClick" v-model="activeName">
                    <van-tab title="全部" name="">
                    </van-tab>
                    <van-tab title="待付款" name="1">
                    </van-tab>
                    <van-tab title="待收货" name="3">
                    </van-tab>
                    <van-tab title="已完成" name="4">
                    </van-tab>
                </van-tabs>
            <!-- </div> -->           
        </div>
        <van-list 
        v-model="loading" 
        :finished="finished" 
        :finished-text="finishedText" 
        @load="onLoad">
            <section class="card">
                <div class="card-wrapper" v-for="(item, index) in list" :key="index" @click="checkOrderDetails(item)">
                    <div class="card-title">
                        <div class="title-left">
                        {{item.shop_name}}
                        </div>
                        <div v-if ="item.order_status=='1'" class="title-right">待付款</div>
                        <div v-if ="item.order_status=='2'" class="title-right">已支付</div>
                        <div v-if ="item.order_status=='3'" class="title-right">已发货</div>
                        <div v-if ="item.order_status=='4'" class="title-right">已完成</div>
                        <div v-if ="item.order_status=='99'" class="title-right">已取消</div>
                    </div>
                    <div class="card-body-box" v-for="(subItem, index) in item.sub_order_list" :key="index">
                        <div class="card-box">
                            <div class="card-body" >
                                <div class="body-left">
                                <img :src="subItem.image" alt="ETC电子标签" class="productImage">
                                </div>
                                <div class="body-middle">
                                <div class="productName">{{subItem.product_name}}</div>
                                <!-- <div class="productName van-multi-ellipsis--l2">小兔子学花钱绘本少儿财商教育系列存钱启蒙数儿童读物3-6岁幼儿园</div> -->
                                <div class="productSpecs">{{subItem.specs_name}}</div>
                                </div>
                                <div class="body-right">
                                    <div style="flex: 0 0 30px;">￥{{subItem.amount}}</div>
                                    <div style="color:#999;">x{{subItem.quantity}}</div>
                                </div>
                            </div>
                            <div class="body-footer">
                                <!-- <van-button  v-if ="subItem['refund_status']== '0'" class="footer-btn" type="default" size="small" style="border-radius: 20px;">申请售后</van-button> -->
                                <van-button  v-if ="item['order_status']=='4' && subItem['is_eval']== false" @click.stop="toEvaluate(subItem)" class="footer-btn" color="#ee0a24" plain round size="small" style="border-radius: 20px;">去评价</van-button>
                                <van-button disabled v-if ="item['order_status']=='4' && subItem['is_eval']== true" @click.stop="toEvaluate(subItem)" class="footer-btn" color="#ee0a24" plain round size="small" style="border-radius: 20px;">已评价</van-button>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <van-button v-if ="item['order_status']=='1'" @click.stop="toPay(item)" class="footer-btn" color="#ee0a24" plain round size="small" style="border-radius: 20px;">去支付</van-button>
                        <van-button  v-if ="item['order_status']=='1'"  @click.stop="toCancelOrder(item)" class="footer-btn" color="#ee0a24" plain round size="small" style="border-radius: 20px;">取消订单</van-button>
                        <van-button  v-if ="item['order_status']=='3'" @click.stop="confirmReceive(item)" class="footer-btn" color="#ee0a24" plain round size="small" style="border-radius: 20px;">确认收货</van-button>
                    </div>
                </div>
            </section>
        </van-list>
    </div>
</template>
<script>
    import {Tab, Tabs,Toast,button,Sticky,List,Dialog} from 'vant';
    import commHead from "../../components/commHead";
    import { mapState,mapMutations} from "vuex";
    import API from "@/api"
import { setTimeout } from 'timers';
export default {
    name:"order",
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Toast.name]: Toast,
        [button.name]: button,
        [Sticky.name]: Sticky,
        [List.name]: List,
        [Dialog.name]: Dialog,
        commHead
    },
    data() {
        return {
            list:[],
            finished: false,
            loading: false,
            // 没有更多了
            finishedText: "暂无更多数据",
            name: '',//点击tab选中
            activeName:"",//默认选中的tab
            title:"我的订单",
            page:0,
            returnType: 'order'
        }
    },
    mounted() {
        this.activeName = this.$route.params.name;
        console.log('activeName',this.activeName)
    },
    methods:{
        ...mapMutations(["updateMoneyAmount","updateOrderId"]),
        handleClick() {
            this.$router.push({name:'mineHome'});
        },
        onLoad() {
            this.loading = true
            this.page++;
            this.getOrderList();
        },
        onClick(name, title) {
            console.log('触发哪个name',name)
            this.page = 1
            this.finished = false
            this.list = []
            this.getOrderList();
        },
         // 获取订单列表
        getOrderList() {
            let that = this
            let params = {
                order_status: this.activeName,
                page:this.page +'',
                per_num:"10",
            }
            console.log('params',params)
            API.orderList(params).then(({ data:data }) => {
                console.log("orderList：>>>>>>>>>>>>>>>>");
                console.log('orderList',data)
                if(!data){
                    data = []
                }
                if(this.page == 1) {
                    this.list = data
                } else {
                    console.log('this.list = ', this.list)
                    // this.list = [...list, ...data];
                    this.list.push(...data)
                }
                // 数据全部加载完成
                console.log('tag', data)
                console.log('tag', data == null || data.length == null || data.length == 0 || data.length < 10)
                if(data == null || data.length == null || data.length == 0 || data.length < 10) {
                    this.finished = true;
                } else {
                    // 加载状态结束
                    setTimeout(() => {
                        that.loading = false;
                    }, 100);
                }
                    
            }).catch(error => {
                this.loading = false;
                this.finished = true;
                console.log(error);
                Toast.fail(error.message);
            });
        },
        // 去支付
        toPay(item) {
            this.updateMoneyAmount(item.total_amount);
            this.updateOrderId(item.order_id)
            this.$router.push({name:'pay'})
        },
        // 取消订单
        toCancelOrder(item) {
            Dialog.confirm({
                title: '系统提示',
                message: '请问您要取消订单么？',
            })
            .then(() => {
                // on confirm
                const params = {
                    order_id:item.order_id,
                    reason:"",
                }
                API.cancelOrder(params).then(res => {
                    console.log("cancel：>>>>>>>>>>>>>>>>");
                    console.log(res);
                    Toast.success('订单取消成功');
                    setTimeout(() => {
                        this.list = [],
                        this.page = 1
                        this.finished = false
                        this.getOrderList();
                    }, 1000);
                }).catch(error => {
                    console.log(error);
                    Toast.fail(error.message);
                });
            })
            .catch(() => {
                // on cancel
            });
        },
        // 确认收货
        confirmReceive(item) {
            const params ={
                order_id:item.order_id,
            }
            API.orderReceived(params).then(res => {
                console.log("confirm：>>>>>>>>>>>>>>>>");
                Toast.success("成功收货");
                this.page=1
                this.getOrderList()
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
        // 去评价
        toEvaluate(subItem) {
            console.log('去评价',subItem)
            this.$router.push({
                name:'writeComment',
                params:{
                    subItem: subItem
                }
            })
        },
        // 查看详情
        checkOrderDetails(item) {
            console.log('aaaaaaaaaa')
            this.updateOrderId(item.order_id)
            this.$router.push({
                name:'orderDetail',
            })
        }
    }
}
</script>
<style scoped lang="less">
.orderWrap {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #f2f2f2;
    height: calc(100vh - 1.4rem);
}
.van-tabs__wrap--scrollable .van-tab {
    flex: 0 0 20% !important;
    flex-basis: 20% !important;
}
.van-tab {
    padding: none !important;
}
.productList {
    margin-top:20px;
}
/* 产品内容 */
.card {
    height: calc(100% - 20px);
}
/* 单个订单 */
.card-wrapper{
    /* min-height: 200px; */
    margin:10px;
    background-color: white;
    padding: 15px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border: 1px solid #EEEEEE;
    border-radius: 10px;
}
.card-title{
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}
.title-left{
    display: flex;
    justify-content: center;
    align-items: center;
	font-family: 'SourceHanSansCN-Normal';
	font-weight: bold;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #3b4257;
}
.title-right{
    font-size:12px;
    color:#ee0a24;
}
.card-body-box {
    margin-bottom:10px;
}
.card-box {
    /* margin-bottom:10px; */
}
.card-body{
    flex: 1;
    display: flex;
    justify-content: flex-start;
}
.body-left{
    /* flex:80px; */
    /* flex: 1; */
    height: 100px;
    line-height: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
} 
.productImage{
    width: 100px;
    height: 100px;
}
.body-middle {
    flex: 70%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 14px;
    height: 100px;
}
.productName{
    flex: 0 0 40px;
    text-align: left;
    margin-bottom:10px;
}
.productSpecs {
    color:#999;
}
.body-right{
    flex:30%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 14px;
}
.body-footer {
    /* flex:1; */
    flex: 0 0 20px;
    display: flex;
    justify-content: flex-end;
}
.card-footer{
    flex: 0 0 20px;
    display: flex;
    justify-content: flex-end;
}
.footer-btn{
    margin-left: 10px;
} 
.van-list{
    background: #f2f2f2;
    margin-top: 2.3333rem;
    padding-top: 0.06rem;
}
.top{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index:1000;
}
</style>