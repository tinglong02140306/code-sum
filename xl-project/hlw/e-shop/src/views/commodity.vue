<template>
    <div class="Categories-wrap">
        <van-sticky>
            <commHead :title="title"></commHead>
            <!-- 搜索框 -->
            
            <form action="/">
                <van-search
                    v-model="productName"
                    shape="round"
                    background="#fff"
                    @search="onSearch"
                    @cancel="onCancel"
                    placeholder="请输入搜索关键词"
                />
            </form>
            <!-- 价格销量升序降序 -->
            <div class="order-wrap">
                <!-- 1 升序 2降序 -->
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
        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
            <div class="list-wrap">
                <div
                    class="list-item"
                    v-for="(item,index) in list"
                    :key="index"
                    @click="goProductDetail(item.product_id)"
                >
                    <div class="img-wrap">
                        <van-image
                            cover
                            width="100%"
                            height="100%"
                            radius="5px"
                            :src="item.image"
                        />
                    </div>
                    <!-- <img :src="item.image" alt /> -->
                    <p class="trade-name two-ell">{{item.product_name}}</p>
                    <p class="sales-volume">销量 &nbsp;{{item.sales_volume}}</p>
                    <p class="money">￥{{item.price}}</p>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import commHead from "../components/commHead.vue";
import { Search, List, Sticky, Toast, Loading, Image } from "vant";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
import  { getUrlParam } from '../utils/utils';
export default {
    name: "commodity",
    props: {},
    components: {
        [Search.name]: Search,
        [List.name]: List,
        [Sticky.name]: Sticky,
        [Toast.name]: Toast,
        [Loading.name]: Loading,
        [Image.name]: Image,
        commHead
    },
    data() {
        return {
            title: "",
            list: [],
            loading: false,   // 滚动到加载位置置为true
            finished: false, // 数据加载完毕 置为true
            finishedText: "",
            productName: "",
            // 1 升序 2 降序
            saleSort: '1',
            priceSort: '2',
            sortField: "",//排序字段 1-销量；2-价格
            orderType: "",// 顺序方式 1-正序；2-倒序；
            page: 0,
            pageNum: 10,
            pageTotal: 0,
            show: false,
            load: false
        };
    },
    computed: {
        ...mapState(['token'])
    },
    methods: {
        ...mapMutations(["updateProductId","updateActiveTab"]),
        // 价格排序点击事件 1 升序 2降序
        saleSortEvt() {
            let sort = this.saleSort;
            sort = sort == '1' ? '2': '1';
            this.$set(this, 'saleSort', sort);
            this.sortField = '1'; //排序字段
            this.orderType =  sort;// 顺序方式
            this.getProductList();
        },
        // 销量排序点击事件
        priceSortEvt() {
            let sort = this.priceSort;
            this.priceSort = sort = sort == '1' ? '2': '1';
            this.$set(this, 'priceSort', sort);
            this.sortField = '2';
            this.orderType =  sort;
            this.getProductList();
        },
        onLoad() {
            this.page++;
            this.getProductList();
        },
        getProductList() {
            let param = {
                product_name: this.productName,
                sort_field: this.sortField,  // 排序字段  1-销量；2-价格；
                order_type: this.orderType,  // 顺序字段 1 正序 2降序
                page: this.page,
                per_num: this.pageNum
            };
            // 排序字段：1-销量；2-价格；
            // 顺序方式：1-正序；2-倒序；
            API.productList(param).then(({data:data}) => {
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
                this.load = true;
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
                this.load = true;
                this.loading = false;
                this.finished = true;
            });
        },
        // 查看商品详情
        goProductDetail(productId) {
            this.updateProductId(productId);
            this.$router.push({ name: "productDetails"});
        },
        // 输入框搜索
        onSearch(val) {
            // 重置数据
            this.page = 1;
            this.saleSort = 1;//？？？应该是字符串
            this.priceSort = 2;
            this.sortField = "";
            this.orderType = "";
            this.getProductList(val);
        },
        // 搜索取消
        onCancel() {
            console.log('取消');
        },
    },
    mounted() {
        this.updateActiveTab('commodity')
        // document.title = this.title;
    }
};
</script>

<style scoped lang="less">
@import "../assets/styles/color.less";
.Categories-wrap {
    width: 100%;
    min-height: 100vh;
    height: auto;
    background: #fff;
    .order-wrap {
        display: flex;
        margin-top: -1px;
        width: 100%;
        height: 1rem;
        background: #fff;
        font-size: 0;
        align-items: center;
        p {
            display: inline-block;
            width: 50%;
            font-size: 0.35rem;
            color: @basecolor;
            text-align: center;
        }
        .sale,
        .price {
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
    .list-wrap {
        // position: relative;
        // top: -.6rem;
        display: inline-block;
        margin: 0 2%;
        width: 96%;
        // min-height: (100vh - 5.55rem);
        min-height: 4rem;
        // background: red;
        font-size: 0;
        text-align: left;
        margin-bottom: 1.33rem;
        .list-item {
            display: inline-block;
            margin: 0 2.5% 0.4rem;
            width: 45%;
            min-height: 3rem;
            vertical-align: top;
            // background: pink;
            .img-wrap {
                display: inline-block;
                width: 4rem;
                height: 3rem;
                // height: 2.14rem;
                // border-radius: 0.4rem 0.4rem 0 0;
            }
            p {
                line-height: .6rem;
            }
            .trade-name {
                font-size: 0.37rem;
                color: @basecolor;
                // font-weight: bold;
                line-height: .6rem;
            }
            .sales-volume {
                font-size: 0.29rem;
                color: @subcolor;
            }
            .money {
                font-size: 0.43rem;
                color: red;
            }
        }
    }
}
</style>
