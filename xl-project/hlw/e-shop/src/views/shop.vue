<template>
    <div class="shopWrap">
        <van-sticky>
            <commHead :title="title"></commHead>
            <div class="shop-instro" v-if="shopInfoFlag">
                <img :src="shopInfo.cover_image" alt />
                <div class="shop-info-wrap">
                    <p class="shop-name">店铺名称：{{shopInfo.shop_name}}</p>
                    <p class="link-phone">联系电话：{{shopInfo.link_phone}}</p>
                    <p class="address">店铺地址：{{shopInfo.address}}</p>
                    <p class="free-price">包邮价格：￥{{shopInfo.free_delivery}}</p>
                    <p class="open-time">营业时间：{{shopInfo.open_time}}-{{shopInfo.close_time}}</p>
                </div>
            </div>
            <div class="order-wrap">
                <p class="sale">
                    <span>销量</span>
                    <i data-sort="1" @click="saleSortEvt"></i>
                </p>
                <p class="price">
                    <span>价格</span>
                    <i data-sort="2" @click="priceSortEvt"></i>
                </p>
            </div>
        </van-sticky>

        <!-- list列表 -->
        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
            <div class="list-wrap" v-if="listFlag">
                <div class="item" v-for="(item,index) in list" :value="item.value" :key="index" @click="goProductDetail(item.product_id)">
                    <div class="img-wrap">
                        <img :src="item.image" alt />
                    </div>
                    <div class="info-wrap">
                        <p class="two-ell title">{{item.product_name}}</p>
                        <p class="price">￥{{item.price}}</p>
                        <p class="sales-cart-wrap">
                            <span class="text">{{item.sales_volume}}人已付款</span>
                            <i class="icon"></i>
                        </p>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import commHead from "../components/commHead.vue";
import { List, Sticky, Card,Toast } from "vant";
import { mapState, mapMutations } from "vuex";
import API from "@/api";

export default {
    name: "shop",
    props: {},
    components: {
        [List.name]: List,
        [Sticky.name]: Sticky,
        [Card.name]: Card,
        [Toast.name]: Toast,
        [commHead.name]: commHead
    },
    data() {
        return {
            title: "",
            shopInfo: {
                shop_id:"",
                shop_name:"",
                cover_image:'',
                link_phone:"",
                address:"",
                free_delivery:"",  // 包邮价格
                open_time:"",  // 营业时间起
                close_time:""  // 营业时间止
            },
            shopInfoFlag: false,
            shopName: '',
            // shopId: '',
            list: [],
            listFlag: false,
            loading: false,
            finished: false,
            finishedText: "",
            // 1 升序 2 降序
            saleSort: '1',
            priceSort: '2',
            sortField: "",
            orderType: "",
            page: 0,
            pageNum: 10,
        };
    },
    computed: {
        ...mapState(["shopId"])
    },
    methods: {
        ...mapMutations(["updateProductId"]),
        // 价格排序点击事件 1 升序 2降序
        saleSortEvt() {
            let sort = this.saleSort;
            sort = sort == '1' ? '2': '1';
            this.$set(this, 'saleSort', sort);
            this.sortField = '1';
            this.orderType =  sort;
            this.getProductList();
        },
        // 销量排序点击事件
        priceSortEvt() {
            let sort = this.priceSort;
            sort = sort == '1' ? '2': '1';
            this.$set(this, 'priceSort', sort);
            this.sortField = '2';
            this.orderType =  sort;
            this.getProductList();
        },
        onLoad() {
            this.page++;
            this.getProductList();
        },
        // 店铺信息请求
        getShopInfo() {
            API.shopInfo({shop_id : this.shopId}).then(({data:data}) => {
                data && (this.shopInfo = data);//？？？？？
                this.shopInfoFlag = true;
            }).catch(error => {
                this.shopInfoFlag = false;
                Toast(error);
            });
        },
        getProductList() {
            let param = {
                    shop_id: this.shopId,  // 跟商品列表的区别
                    product_name: this.productName,
                    sort_field: this.sortField,  // 排序字段  1-销量；2-价格；
                    order_type: this.orderType,  // 顺序字段 1 正序 2降序
                    page: this.page,
                    per_num: this.pageNum
                };
            // 排序字段：1-销量；2-价格；
            // 顺序方式：1-正序；2-倒序；
            API.productList(param).then(({data:data}) => {
                this.listFlag = true;
                if(data){
                    if(this.page == 1) {
                        this.list = data
                    } else {
                        this.list = [...this.list, ...data];
                    }
                } else {
                    data = [];
                    this.list = []
                }
                // 加载状态结束
                this.loading = false;
                // 数据全部加载完成
                const list = this.list;
                if(data.length == 0 || data.length < this.pageNum) {
                    this.finished = true;
                    if(list.length == 0) this.finishedText = "暂无商品";
                    if(list.length != 0 && list.length >= 10) this.finishedText = "没有更多了";
                }
            }).catch(error => {
                this.listFlag = false;
                this.loading = false;
                this.finished = true;
            });
        },
        // 查看商品详情
        goProductDetail(productId) {
            this.updateProductId(productId);
            this.$router.push({ name: "productDetails"});
        },
    },
    mounted() {
        this.getShopInfo();
    }
};
</script>
<style scoped lang="less">
@import "../assets/styles/color.less";
.shopWrap {
    width: 100%;
    min-height: 100vh;
    height: auto;
    background: #f2f2f2;
    .shop-instro {
        display: flex;
        width: 100%;
        padding: 0.4rem 4%;
        background: #fff;
        // height: 1.6rem;
        img {
            display: inline-block;
            width: 3rem;
            height: 3rem;
        }
        .shop-info-wrap {
            padding-left: .5rem;
            p {
                font-size: .32rem;
                color: @basecolor;
                line-height: .6rem;
            }

        }
    }
    .order-wrap {
        padding: 0.2rem 0;
        margin-top: -0.02667rem;
        width: 100%;
        background: #f2f2f2;
        font-size: 0;
        p {
            display: inline-block;
            width: 25%;
            font-size: 0.35rem;
            color: @basecolor;
        }
        .sale,
        .price {
            text-align: center;
            span {
                display: inline-block;
                height: 0.6rem;
                line-height: 0.6rem;
                vertical-align: top;
            }
            i {
                display: inline-block;
                margin-left: 0.2rem;
                height: 0.6rem;
                width: 0.6rem;
                background: url(../assets/images/icon-up-down.png) left center /
                    0.4rem 0.4rem no-repeat;
                vertical-align: top;
            }
        }
    }
    .icon-shop-cart {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        background: url(../assets/images/icon-shop-cart.png) center center /
            0.47rem 0.47rem no-repeat;
    }
    .list-wrap {
        min-height: 4rem;
        .item {
            display: flex;
            padding: 0.2rem 4%;
            margin-bottom: 0.27rem;
            width: 100%;
            justify-content: space-between;
            background: #fff;
            .img-wrap {
                width: 30%;
                img {
                    width: 2.67rem;
                    height: 2.67rem;
                    border-radius: .21rem;
                }
            }
            .info-wrap {
                width: 65%;
                .title {
                    // text-indent: 0.8rem;
                    font-size: 0.32rem;
                    line-height: .5rem;
                }
                .price {
                    margin-top: .2rem;
                    font-size: 0.35rem;
                    color: red;
                    font-weight: bold;
                }
            }
            .sales-cart-wrap {
                margin-top: 0.21rem;
                display: flex;
                height: 0.8rem;
                // background: pink;
                line-height: 0.8rem;
                justify-content: space-between;
                .text {
                    font-size: 0.32rem;
                    color: @subcolor;
                }
                span,
                i {
                    display: inline-block;
                    vertical-align: top;
                }
                i {
                    width: 0.8rem;
                    height: 0.8rem;
                    background: url(../assets/images/icon-shop-cart.png) center
                        center / 0.47rem 0.47rem no-repeat;
                }
            }
        }
    }
}
</style>