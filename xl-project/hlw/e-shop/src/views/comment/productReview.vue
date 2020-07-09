<template>
    <!-- 商品评价列表 -->
    <div class="comment-wrap">
        <van-sticky>
            <commHead :title="title"></commHead>
        </van-sticky>
        <!-- list列表 -->
        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
            <div class="list-wrap" v-if="load">
                <div
                    class="list-item"
                    v-for="(item,index) in list"
                    :key="index"
                >
                    <p class="user-wrap">
                        <i>
                            <van-image
                                cover
                                round
                                width="0.8rem"
                                height="0.8rem"
                                :src="item.avatar"
                            />
                        </i>
                        <span>{{item.nickname}}</span>
                    </p>
                    <p class="rate-date-wrap">
                        <span>
                            <van-rate
                                v-model="item.grade"
                                :count="5"
                                :size="10"
                                color="#f6390d"
                                void-icon="star"
                                void-color="#eee"
                                readonly
                            />
                        </span>
                        <span>{{item.gmt_create}}</span>
                    </p>
                    <p class="descript">{{item.content}}</p>
                    <van-grid :border="false" :gutter="20" :column-num="3">
                        <van-grid-item v-for="(val, pos) in item.images" :key="pos" :src="val" alt>
                            <!-- lazy-load  -->
                            <van-image :src="val" :data-index="index" :data-pos="pos" @click="imgClick(index,pos)"/>
                        </van-grid-item>
                    </van-grid>
                    <p class="goods-attr">{{item.sku_desc}}</p>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import {
    List,
    Rate,
    ImagePreview,
    Grid,
    GridItem,
    Image,
    Lazyload,
    Toast,
    Sticky
} from "vant";
import API from "@/api";
import { mapState } from "vuex";
import commHead from "../../components/commHead";
export default {
    name: "productReview",
    props: {},
    components: {
        [List.name]: List,
        [Rate.name]: Rate,
        [ImagePreview.name]: ImagePreview,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Image.name]: Image,
        [Lazyload.name]: Lazyload,
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            title: "",
            list: [],
            finishedText: "",
            loading: false,
            finished: false,
            page: 0,
            pageNum: 10,
            load: false,
            // 待删
            testData: [
                {
                    avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
                    nickname: "poly783",
                    gmt_create: "2020-09-08",
                    grade: 3.5,
                    content:
                        "东西质量非常好，与卖家描述的完全一致，非常满意,真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物",
                    sku_desc: "商品属性商品属性商品属性商品属性商品属性",
                    images: [
                        "https://img.yzcdn.cn/vant/apple-1.jpg",
                        "https://img.yzcdn.cn/vant/apple-2.jpg",
                        "https://img.yzcdn.cn/vant/apple-3.jpg"
                    ]
                },
               {
                    avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
                    nickname: "poly783",
                    gmt_create: "2020-09-08",
                    grade: 3.5,
                    content:
                        "东西质量非常好，与卖家描述的完全一致，非常满意,真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物",
                    sku_desc: "商品属性商品属性商品属性商品属性商品属性",
                    images: [
                        "https://img.yzcdn.cn/vant/apple-1.jpg",
                        "https://img.yzcdn.cn/vant/apple-2.jpg",
                        "https://img.yzcdn.cn/vant/apple-3.jpg"
                    ]
                },
            ],
           
        };
    },
    computed: {
        ...mapState(["productId"])
    },
    methods: {
        onLoad() {
            this.page++;
            this.getCommentList();
        },
        // 获取评论 list 数据
        getCommentList() {
            let param = {
                    product_id: this.productId,
                    page: this.page,
                    per_num: this.pageNum
                };
            API.commentList(param).then(({data:data}) => {
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
                const list = this.list;
                // 数据全部加载完成
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
        imgClick(index, pos) {
            ImagePreview({images: this.list[index].images, startPosition: pos});
        }
    },
    mounted() {
        // document.title = this.title;
    }
};
</script>

<style scoped lang="less">
@import "../../assets/styles/color.less";
@basefontSize: 0.35rem;
.comment-wrap {
    width: 100%;
    background: #f2f2f2;
    min-height: 100vh;
    height: auto;
    .wrapmar {
        padding: 0 4%;
        width: 100%;
    }
    .list-wrap {
        .list-item {
            .wrapmar();
            margin-bottom: .2rem;
            padding-bottom: 0.5rem;
            background: #fff;
            .user-wrap {
                padding: 0.2rem 0;
                height: 0.8rem;
                line-height: 0.8rem;
                text-align: left;
                i,
                span {
                    display: inline-block;
                    height: 100%;
                    line-height: 0.8rem;
                    vertical-align: top;
                }
                span {
                    margin-left: 0.2rem;
                    height: 0.8rem;
                    font-size: @basefontSize;
                    color: @basecolor;
                }
            }
            .rate-date-wrap {
                display: flex;
                height: 0.8rem;
                justify-content: space-between;
                align-content: center;
                font-size: @basefontSize;
                span {
                    line-height: 0.8rem;
                }
            }
            .descript {
                color: @basecolor;
                font-size: @basefontSize;
                text-align: left;
            }
            .img-wrap {
                margin-top: 0.4rem;
                font-size: 0;
                text-align: left;
                img {
                    display: inline-block;
                    margin: 0 0.26rem 0.4rem 0;
                    width: 2.8rem;
                    height: 2.8rem;
                }
            }
            .goods-attr {
                font-size: @basefontSize;
                color: @subcolor;
                text-align: left;
            }
        }
    }
}
</style>
