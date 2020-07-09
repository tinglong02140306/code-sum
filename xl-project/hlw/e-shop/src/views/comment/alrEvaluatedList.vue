<template>
    <div class="alrEvaluatedListWrap">
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
                                radius="5px"
                                :src="item.product_image"
                            />
                        </div>

                        <div class="desc-btn-wrap">
                            <div class="desc-wrap">
                                <div class="title-wrap">
                                    <p class="ell">{{item.product_name}}</p>
                                    <p class="rate-wrap">
                                        <span class="text">评分</span>
                                        <van-rate
                                            v-model="item.grade"
                                            :count="5"
                                            :size="10"
                                            color="#f6390d"
                                            void-icon="star"
                                            void-color="#eee"
                                            readonly
                                        />
                                    </p>
                                </div>
                                <div class="price-wrap">
                                    <p>￥{{item.price}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comment">{{item.content}}</div>
                    <van-grid :border="false" :gutter="20" :column-num="3">
                        <van-grid-item
                            v-for="(val, pos) in item.images"
                            :key="pos"
                            :src="val"
                            alt
                        >
                            <!-- lazy-load  -->
                            <van-image :src="val" @click="imgClick(index,pos)" />
                        </van-grid-item>
                    </van-grid>
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
    Rate,
    ImagePreview,
    Grid,
    GridItem,
    List
} from "vant";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
export default {
    name: "alrEvaluatedList",
    components: {
        [Card.name]: Card,
        [Toast.name]: Toast,
        [Image.name]: Image,
        [Button.name]: Button,
        [Rate.name]: Rate,
        [ImagePreview.name]: ImagePreview,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [List.name]: List,
    },
    data() {
        return {
            finishedText: '',
            finished: false,
            loading: false,
            list: [],
            page: 0,
            pageNum: 10,
            load: false
        };
    },
    methods: {
        ...mapMutations(["updateShopId"]),
        // 获取列表数据
        getListData() {
            let param = {
                    is_eval: true,
                    page: this.page,
                    per_num: this.pageNum
                };
            API.myCommentList(param).then(({data:data}) => {
                if(data){
                    if(this.page == 1) {
                        this.list = data
                    } else {
                        this.list = [...this.list, ...data];
                    }
                } else {
                    data = [];
                    this.list = [];
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
        onLoad() {
            this.page++;
            this.getListData();
        },
        // 图片点击预览
        imgClick(index, pos) {
            ImagePreview({images: this.list[index].images, startPosition: pos});
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
.alrEvaluatedListWrap {
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
            padding: 0 4% .4rem;
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
                    width: 1.5rem;
                    height: 1.5rem;
                }
                .desc-btn-wrap {
                    width: calc(100% - 1.7rem);
                    .desc-wrap {
                        height: 1.5rem;
                        .title-wrap {
                            display: inline-block;
                            width: 80%;
                            vertical-align: top;
                            line-height: 0.4rem;
                        }
                        .price-wrap {
                            display: inline-block;
                            width: 20%;
                            vertical-align: top;
                            text-align: right;
                        }
                        .rate-wrap {
                            padding: 0.2rem 0;
                            span {
                                padding-right: 0.2rem;
                            }
                        }
                    }
                }
                
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
        }
    }
}
</style>