<template>
    <div class="wraper">
        <div style="padding-bottom:1.33333rem">
            <!-- 轮播图 -->
            <van-swipe  :autoplay="2000">
                <van-swipe-item v-for="(image, index) in images" :key="index">
                    <img :src="image" class="image" >
                </van-swipe-item>
                <template #indicator>
                <div class="custom-indicator">
                    {{ current + 1 }}/{{images.length}}
                </div>
                </template>
            </van-swipe>
            <!-- 产品基本信息 -->
            <section class="productDetails">
                <div class="product">
                    <header class="productName">{{productInfo["productName"]}}</header>
                    <div v-if ="specsList.length =='1'" class="productPrice">￥{{productInfo.lowestPrice}}</div>
                    <div  v-if ="specsList.length >'1'" class="productPrice">￥{{productInfo.lowestPrice}}起</div>
                    <div class="saleNum">已售{{productInfo["saleAmount"]}}</div>
                </div>
                <!-- <div class="specificationsBox" @click="showCartClick">
                    <div class="speList-1">
                        <div class="speTip">规格:</div>
                        <div class="speListDetail">
                            <div v-if="!specsName" style="color: #1d1d1d;">请选择尺寸</div>
                            <div v-if="specsName">{{specsName}}</div>
                        </div>
                    </div>
                    <div class="speList-2" style="text-align: right;">
                        <van-icon name="arrow" color="#e4412c"/>
                    </div>
                </div> -->
            </section>
            <div class="refundOthers detail-situ">
                <!-- 规格 -->
                <van-field v-if="specsName && productInfo['status']==1" disabled @click="showCartClick" label="规格:" v-model="specsName"  right-icon="arrow" />
                <van-field v-if="!specsName && productInfo['status']==1" disabled @click="showCartClick" label="规格:" v-model="specsName" placeholder="请选择尺寸" right-icon="arrow" />
                <!-- 可配送区域 -->
                <div v-if ="productInfo && productInfo.deliveryArea">  
                    <van-field label="配送区域:" v-model="productInfo.deliveryArea" readonly :border="false" />
                </div>
            </div>
            <!-- 产品评价 -->
            <section class="productEval"> 
                <!-- <div class="evalTip">
                    <div class="evalTipTitle">用户评价</div>
                    <div class="evalTipOthers" @click="checkAllComment">查看全部<van-icon name="arrow"/></div>
                </div> -->
                <van-cell style="padding:0;" title="用户评价" is-link value="查看全部" @click="checkAllComment"/>
                <div class="evalContent">
                    <van-swipe v-if="commentInfo && commentInfo.length>0" :loop="false" :width="280" :show-indicators="false">
                        <van-swipe-item 
                            v-for="(item, index) in commentInfo" 
                            :key="index"  
                            @click="checkAllComment"
                            v-if= "item.content || item.images"
                        >
                            <div class ="evalBox" >
                                <div class="evalLeft">
                                    <div class="userName">{{item.nickname}}</div>
                                    <div v-if ="item && item.content" class="evalBottom van-multi-ellipsis--l2">{{item.content}}</div>
                                    <div v-if ="!item && item.content" class="evalBottom van-multi-ellipsis--l2">未填写评价内容</div>
                                </div>
                                <!-- <div class="evalRight">{{item.evalUrl}}</div> -->
                                <img v-if="item.images" :src="item.images[0]" class="evalRight" alt="">
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                    <div v-else style="text-align: center;color:#ccc;">
                        暂无评价~
                    </div>
                </div>
            </section>
            <!-- 产品图片详情 -->
            <section class="productImage" v-if="productInfo && productInfo.detail">
                <!-- 暂时注释开始 -->
                <div v-html="productInfo.detail" style="width:100vw;"></div>
                <!-- 暂时注释结束 -->
                <!-- <img style="width:100vw;" src="../assets/images/productDetail.jpg" alt=""> -->
            </section>
            <!-- 基础用法 -->
            <div class="sku-container">
                <van-sku
                    v-model="showBase"
                    :sku="skuData.sku"
                    :goods="skuData.goods_info"
                    :goods-id="skuData.goods_id"
                    :hide-stock="skuData.sku.hide_stock"
                    :initial-sku="initialSku"
                    :close-on-click-overlay="true"
                    @sku-selected="skuSelected"
                    @buy-clicked="onBuyClicked"
                    @add-cart="onAddCartClicked"
                >
                    <template #sku-header-origin-price>
                        <p class="desc">
                            <span>{{skuData.weight}}</span>
                        </p>
                    </template>
                </van-sku>
            </div>
            <!-- 商品是否下架展示 -->
            <section v-if="productInfo['status']==0" class ="soldOutBox">
                <div>商品下架啦~</div>
            </section>
        </div>
        <!-- 底部导航 -->
        <van-goods-action v-if="productInfo['status']!=0">
            <van-goods-action-icon icon="shop-o" text="店铺" @click="onClickShop(productInfo)" />
            <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartTotal" @click="onClickCart" />
            <van-goods-action-button type="warning" text="加入购物车"  @click="onClickButton" />
            <van-goods-action-button type="danger" text="立即购买"  @click="onClickButton" />
        </van-goods-action>
        <van-goods-action v-if="productInfo['status']==0">
            <van-goods-action-icon icon="shop-o" text="店铺" @click="onClickShop(productInfo)" />
            <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartTotal" @click="onClickCart" />
            <van-goods-action-button  disabled  type="warning" text="加入购物车" />
            <van-goods-action-button  disabled  type="danger" text="立即购买" />
        </van-goods-action>
    </div>
</template>
<script>
    import skuData from "../assets/js/data";
    import { mapState,mapMutations} from "vuex";
    import API from "@/api"
    import {cell,Swipe, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton,Icon,Sku,Button,Toast,field} from 'vant';
    export default {
    name:'productDetails',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Icon.name]: Icon,
        [GoodsAction.name]: GoodsAction,
        [GoodsActionIcon.name]: GoodsActionIcon,
        [GoodsActionButton.name]: GoodsActionButton,
        [Sku.name]: Sku,
        [Button.name]: Button,
        [Toast.name]: Toast,
        [field.name]: field,
        [cell.name]: cell,
    },
    data() {
        return {
            // 产品轮播图
            images:[],
            //轮播开始
            current: 0,
            // 产品基础信息
            productInfo:{},
            //评价基本信息
            commentInfo:[],
            evalImages:[],
            // 规格列表
            specs_list:[],
            specsList:[],
            // 购物车图标数量显示
            cartTotal:null,
            // 弹窗选择相关如下
            skuData: skuData,
            showBase: false,
            showCustom: false,
            showStepper: false,
            showSoldout: false,
            initialSku: {},
            //选中的规格
            specsName:"",
            //购买传参的商品列表
            productBuyList:[],
            // 控制商品选择弹框
            showSkuSelected:false,
        }
    },
    computed: {
        ...mapState(["productId","productList","token","activeTab",])
    },
    mounted() {
        console.log('productId',this.productId);
        this.getProductDetail();
        this.getComment();
        if(this.token && this.token.length !== 0){
            this.getCartTotal()
        }
    },
    methods:{
        ...mapMutations(["updateProductList","updateCartCount", "modToken","updateActiveTab","updateShopId"]),
        // 产品详情
        getProductDetail() {
            const params = { product_id: this.productId };
            API.productDetail(params).then(res => {
                console.log("产品详情：>>>>>>>>>>>>>>");
                console.log(res);
                this.updateProductList(res.data)
                const { shop_id:shopId,product_name:productName,images: images, status:status,sales_volume: saleAmount, detail: detail, lowest_price:lowestPrice,specs_list:specsList,delivery_area:deliveryArea} = res.data;
                this.productInfo = {shopId, productName, saleAmount, detail,status,lowestPrice,deliveryArea};
                console.log('productInfo',this.productInfo)
                this.images = images
                console.log('images',this.images)
                this.specsList = specsList
            }).catch(error => {
                console.log(error);
                Toast.fail('error.message');
            });
        },
        // 查看评价
        getComment() {
            const params = {
                product_id: this.productId,
                page:"1",
                per_num:"10"
            };
            API.commentList(params).then(({ data:data }) => {
                console.log("查看评价：>>>>>>>>>>>>>>");
                if(!data){
                    this.commentInfo = []
                }
                if(data){
                    this.commentInfo = data
                }
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        },
        //查看所有评价  跳转评价页面
        checkAllComment() {
            if(!this.commentInfo.length) {
                Toast('暂无任何评价')
                return
            }
            this.$router.push({
                name:'productReview',
            })
        },
        // 点击店铺图标    跳转店铺页面
        onClickShop(productInfo) {
            this.updateShopId(this.productInfo.shopId)
            this.$router.push({name:'shop'})
        },
        // 点击购物车图标  跳转购物车页面
        onClickCart() {
            this.updateActiveTab("cart")
            this.$router.push({
                path:'/shoppingCart',
            })
        },
        //点击加入购物车和立即购买  显示弹窗购物选择
        onClickButton() {
            if(this.token && this.token.length !== 0) {
                this.$set(this, 'initialSku', skuData.dealData(this.productList, 'detail'));
                this.showSkuSelected = true;
                this.showBase = true;
            }
            else {
                this.$router.push({
                    name:'mineHome',
                })
            }
        },
        // 购物车图标数量展示
        getCartTotal() {
            const params = { 
                page: "1",
                per_num:"",
            };
            API.cartList(params).then(res => {
                console.log("购物车列表：>>>>>>>>>>>>>>");
                console.log(res);
                this.cartTotal = res.data.total == 0 ? '': res.data.total
                this.updateCartCount(this.cartTotal)
            }).catch(error => {
                console.log(error);
                Toast.fail('error.message');
            });
        },
        // 弹窗选择
        // 显示商品选择弹框
        showCartClick() {
            console.log('goodselect',this.productList);
            this.$set(this, 'initialSku', skuData.dealData(this.productList, 'detail'));
            this.showSkuSelected = true;
            this.showBase = true;
        },
        onAddCartClicked(data) {
            if(this.token && this.token.length !== 0) {
                console.log("加入购物车",JSON.stringify(data));
                // 调取加入购物车的接口
                const params = { 
                    product_id: this.productId,
                    specs_id:data.selectedSkuComb.s1,
                    quantity:data.selectedNum,
                };
                console.log('加入购物车传参',params)
                API.cartAddproduct(params).then(res => {
                   
                    console.log("添加商品到购物车：>>>>>>>>>>>>>>");
                    console.log(res);
                // 添加完购物车，再次调取购物车列表
                this.getCartTotal()
                    this.showBase = false;
                }).catch(error => {
                    console.log(error);
                    Toast.fail('error.message');
                });
                return
            }
            this.$router.push({
                name:'mineHome',
            })
        },
        onBuyClicked(data) {
            if(this.token && this.token.length !== 0) {
                console.log('点击购买',JSON.stringify(data));
                this.productBuyList.push({product_id:this.productId,specs_id:data.selectedSkuComb.s1,quantity:data.selectedNum,})
                this.updateProductList(this.productBuyList)
                this.$router.push({
                    name:'orderConfirm',
                })
                return
            }
            this.$router.push({
                name:'mineHome',
            })
        },
        // 选择商品属性时触发
        skuSelected(data) {
            console.log('选择商品属性触发',data)
            if(!this.showSkuSelected) {
                return;
            }
            this.specsName = data.skuValue.name
            this.$set(this.skuData, 'weight', data.selectedSkuComb ? '重量:' + data.selectedSkuComb.weight + 'KG': "");
        },  
    },
}
</script>
<style scoped lang="less">
@import "../assets/styles/color.less";
.wraper {
    width:100vw;
    /* height: calc(100vh - 1.33333rem); */
    background-color: #F4F4F4;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
/* 推荐图片修改 */
.image {
  width: 100%;
  /* height: 206px; */
  /* height: 400px; */
  height: 200px;
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 12px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
/* 产品基本信息 */
.productDetails {
    margin-top:10px;
    width:100%;
    /* height:300px; */
    background-color: #fff;
    font-size: 16px;
}
.product {
    padding:10px 20px 10px;
    text-align: center;
}
.productName {
    font-weight: 700;
    font-size: 14px;
    color: #1d1d1d;
}
.productPrice {
    font-weight: 700;
    color:#ee0a24;
    padding-top:5px;
    font-size: 14px;
}
.saleNum {
    font-size: 12px;
    color:#bfbfbf;
    text-align: right;
}
.specificationsBox {
    color:#bfbfbf;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 20px;
}
.speList-1 {
    box-sizing: border-box;
    flex:0 0 50%; 
    display: flex;
    justify-content: left;
    align-items: left;
}
.speList-1 {
    box-sizing: border-box;
    flex:0 0 50%; 
    display: flex;
    justify-content: right;
    align-items: right;
}
.speListDetail {
    width:200px;
}
.speTip ,.speListDetail{
    box-sizing: border-box;
    flex:0 0 30%; 
}
.speTip{
    vertical-align: top;
    color:#999;
} 
/* 产品评价 */
/* 评价顶部 */
.productEval {
    margin-top: 10px;
    background-color: #fff;
    padding:10px 16px;
    /* padding: 0.26667rem 0.42667rem; */
}
.evalTip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom:10px;
    border-bottom: 1px solid #ccc;
}
.evalTipTitle {
    font-family: "PingFangSC-Medium";
    font-size: 14px;
    color: #1d1d1d;
}
.evalTipOthers {
    font-size: 12px;
    color:#ccc;
}
/* 评价内容 */
.evalContent {
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin:10px 0 ;
}
.evalBox {
    flex:0 0 50%;
    border:1px solid #ccc;
    padding:5px;
    margin-right:20px;
    /* height: 120px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 82px;
}
.evalLeft {
    font-family:"PingFangSC-Medium";
    flex-direction:column;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex:0 0 60%;
    text-align: left;
}
.userName {
    color:#999;
}
.evalBottom {
    margin-top:5px;
    color:#1d1d1d;
}
.evalRight{
    flex:0 0 30%;
    width:80px;
    height: 80px;
}
/* 产品图片详情 */
.productImage {
    margin-top:10px;
    text-align: center;
    background-color: #fff;
}
/* 商品售出 */
.soldOutBox {
    width:100%;
    position: fixed;
    bottom:50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color:#fff;
    background-color: #ccc;
}
/* 弹窗选择 */
.sku-container {
    padding: 0 15px;
}
.desc {
    color: @subcolor;
    font-size:.35rem;
}
/* 配送区域 */
.refundOthers {
    margin-top:10px;
    background: #fff;
    font-size: 12px;
}
</style>