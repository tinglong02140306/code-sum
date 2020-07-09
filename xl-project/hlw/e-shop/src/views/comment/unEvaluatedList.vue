<template>
    <div class="unEvaluatedListWrap">
        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
            <div class="list-wrap" v-if="load && list.length > 0">
                <div class="list-item" 
                    v-for="(item,index) in list"
                    :value="item.value"
                    :key="index"
                >
                    <span class="shop-name ell" @click="goShop(item.shop_id)">{{item.shop_name}}</span>
                    <div class="content">
                        <div class="img-wrap">
                            <van-image
                                cover
                                width="100%"
                                height="100%"
                                radius="10px"
                                :src="item.product_image"
                            />
                        </div>
                        <div class="desc-btn-wrap">
                            <div class="desc-wrap">
                                <div class="title-wrap">
                                    <p class="two-ell">{{item.product_name}}</p>
                                    <p>{{item.specs_name}}</p>
                                </div>
                                <div class="price-wrap">
                                    <p>￥{{item.price}}</p>
                                </div>
                            </div>
                            <div class="btn-wrap">
                                <van-button
                                    plain
                                    round
                                    type="info"
                                    size="small"
                                    color="#ee0a24"
                                    @click="goEvalute(item)"
                                >评价晒单</van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import {
    Toast,
    Card,
    Image,
    Button,
    List
} from "vant";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
export default {
    name: "myEvaluateWrap",
    components: {
        [Card.name]: Card,
        [Toast.name]: Toast,
        [Image.name]: Image,
        [Button.name]: Button,
        [List.name]: List
    },
    data() {
        return {
            finishedText: "",
            finished: false,
            loading: false,
            // 没有更多了
            list: [],
            page: 0,
            pageNum: 10,
            load: false
        };
    },
    methods: {
        ...mapMutations(["updateShopId"]),
        onLoad() {
            // 真实
            this.page++;
            this.getListData();
        },
        getListData() {
            let param = {
                    is_eval: false,
                    page: this.page,
                    per_num: this.pageNum
                };
            API.myCommentList(param).then(({data:data}) => {
                if(data){
                    if(this.page == 1) {
                        this.list = data;
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
                    if(list.length == 0) this.finishedText = "暂无评论";
                    if(list.length != 0 && list.length >= 10) this.finishedText = "没有更多了";
                }
                this.load = true;
            }).catch(error => {
                this.loading = false;
                this.finished = true;
                this.load = true;
            });

        },
        // 申请退款
        applyRefund(id) {
            this.$router.push({ name: "refund", params: {id:id, title: '申请退款'}});
        },
        // 去评价
        goEvalute(item) {
            let obj = {
                sub_order_id: item.sub_order_id,
                amount: item.amount,
                product_name: item.product_name,
                image: item.product_image
            }
            this.$router.push({ name: "writeComment", params: {subItem:obj}});
        },
        // 跳转到店铺
        goShop(id) {
            this.updateShopId(id)
            this.$router.push({ name: "shop"});
        },
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.unEvaluatedListWrap {
    width: 100%;
    min-height: 100vh;
    height: auto;
    background: #f2f2f2;
    font-size: 0.32rem;
    color: #323233;
    .list-wrap {
        .list-item {
            margin-top: 0.27rem;
            width: 100%;
            padding: 0 4%;
            background: #fff;
            .shop-name {
                display: inline-block;
                padding: 0.2rem 0;
                font-weight: bold;
                max-width: 50%;
            }
            .content {
                display: flex;
                padding-bottom: 0.3rem;
                .img-wrap {
                    flex: none;
                    margin-right: 0.2rem;
                    width: 2.35rem;
                    height: 2.35rem;
                }
                .desc-btn-wrap {
                    width: calc(100% - 2.37rem);
                    .desc-wrap {
                        height: 2.35rem;
                        .title-wrap {
                            display: inline-block;
                            width: 80%;
                            vertical-align: top;
                            line-height: 0.52rem;
                        }
                        .price-wrap {
                            display: inline-block;
                            width: 20%;
                            vertical-align: top;
                            text-align: right;
                        }
                    }
                    .btn-wrap {
                        text-align: right;
                        .van-button {
                            margin-right: 0.2rem;
                        }
                        .van-button--small {
                            height: 0.6rem;
                            line-height: 0.6rem;
                        }
                    }
                }
            }
        }
    }
    .no-more-hide + div {
        display: none !important;
    }
}
</style>