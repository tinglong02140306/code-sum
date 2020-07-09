<template>
    <div class="shoppingCartWrap">
        <van-sticky>
            <commHead :title="title" :isShow="true" @deleteEvt="deleteEvt"></commHead>
        </van-sticky>
        <!-- 购物车有内容 -->
        <div class="shop-list-wrap" v-if="cartList.length > 0">
            <!-- <van-list v-model="loading" :finished="finished" :finished-text="cartList.length > 10 ? '没有更多了' : ''" @load="onLoad"> -->
            <!-- 一个店铺 -->
            <div class="list-wrap" v-for="(shop,pos) in cartList" :key="pos" :name="shop">
                <!-- 商铺名字 -->
                <div class="shop-name">
                    <van-checkbox
                        icon-size="18px"
                        v-model="shop.selected"
                        @click.stop="shopSelectEvt(shop.selected, pos)"
                    >
                        <span @click.stop="goShop(shop.shop_id)">{{shop.shop_name}}</span>
                    </van-checkbox>
                </div>
                <!-- 该商铺下的商品 -->
                <div class="list-item" v-for="(item,index) in shop.product_list" :key="index" :name="item" :class="index != shop.product_list.length -1 ? 'border-bottom': ''">
                    <div class="item-wrap">
                        <!-- 选择框 -->
                        <div class="check-wrap">
                            <van-checkbox
                                icon-size="18px"
                                :checked="true"
                                :name="item"
                                v-model="item.selected"
                                @change="tradeChange(item.selected,pos,index)"
                            ></van-checkbox>
                        </div>
                        <!-- 内容 -->
                        <div class="content-wrap">
                            <div class="img-wrap" @click="goProductDetail(item.product_id)">
                                <van-image width="2.6rem" height="2.6rem" radius="5px" fit="cover" :src="item.image" />
                            </div>
                            <div class="desc-wrap">
                                <p class="title two-ell" @click="goProductDetail(item.product_id)">{{item.product_name}}</p>
                                <p @click="goProductDetail(item.product_id)">
                                    <span class="text-wrap" @click.stop="showSelectClick(pos,index)" :class="item.specs_name ? '': 'hide'">
                                        <span class="text ell">{{item.specs_name}}</span>
                                        <i></i>
                                    </span>
                                </p>
                                <div class="step-wrap">
                                    <span class="price" @click="goProductDetail(item.product_id)" :class="item.price ? '': 'hide'">￥{{item.price}}</span>
                                    <span class="step">
                                        <van-stepper
                                            v-model="item.quantity"
                                            step="1"
                                            integer
                                            min="1"
                                            max="100"
                                            @change="onStepChange(pos,index,item.cart_id,item.specs_id,item)"
                                        />
                                    </span>
                                </div>
                                
                            </div> 
                        </div>
                    </div>
                    <p class="fail-notice" v-if="item.status == '0'">该宝贝已失效</p>
                </div>
            </div>
            <!-- </van-list> -->
        </div>
        <!-- 购物车为空 -->
        <div class="empty-wrap" v-if="emptyFlag">
            <div class="content">
                <i class="icon"></i>
                <p class="text1">购物车竟然是空的</p>
                <p class="text2">再忙，也要记得买点东西犒赏自己~</p>
            </div>
        </div>
        <!-- 底部全选去结算 -->
        <van-submit-bar :price="totalPrice" :button-text="productCount" @submit="onSubmit" :class="payBtnGreyFlag ? 'btn-grey' : ''">
            <template #default>
                <van-checkbox icon-size="18px" v-model="selectedAll" @click="allSelectEvt(selectedAll)">全选</van-checkbox>
                <span class="price-tips" v-if="totalPrice > 0">不含运费</span>
            </template>
        </van-submit-bar>
        <!-- 商品选择 -->
        <van-sku
            v-model="showBase"
            :sku="skuData.sku"
            :goods="skuData.goods_info"
            :goods-id="skuData.goods_id"
            :hide-stock="skuData.sku.hide_stock"
            :initial-sku="initialSku"
            :close-on-click-overlay="true"
            :buy-text="btnText"
            :show-add-cart-btn="false"
            @sku-selected="skuSelected"
            @buy-clicked="onAddCartClicked"
        >
        <template #sku-header-origin-price>
            <p class="desc">
                <span>{{skuData.weight}}</span>
                <!-- <span>编号:1000000S297</span> -->
            </p>
        </template>
        </van-sku>
    </div>
</template>

<script>
import skuData from "../assets/js/data";
import API from "@/api";
import { mapState, mapMutations } from "vuex";
import commHead from "../components/commHead";
import {
    CheckboxGroup,
    Checkbox,
    Stepper,
    SwipeCell,
    SubmitBar,
    Card,
    Button,
    Sku,
    Toast,
    List,
    Dialog,
    Image,
    Sticky
} from "vant";
export default {
    name: "shoppingCart",
    components: {
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Stepper.name]: Stepper,
        [SwipeCell.name]: SwipeCell,
        [SubmitBar.name]: SubmitBar,
        [Card.name]: Card,
        [Button.name]: Button,
        [Sku.name]: Sku,
        [Toast.name]: Toast,
        [List.name]: List,
        [Dialog.name]: Dialog,
        [Image.name]: Image,
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            title: "购物车",
            loading: false,   // 滚动到加载位置置为true
            finished: false, // 数据加载完毕 置为true
            btnText: "确定",
            checked: false,
            cartList: [],
            selectedAll: false,
            skuData: skuData,
            showBase: false,
            initialSku: {},
            shopCount: [],
            payBtnGreyFlag: true,  // 结算按钮是否置灰 默认和选择多家店铺 置灰
            productCount: '去结算(0)',
            totalPrice: 0,  // 总金额 单位是分
            // 点击规格的标志位
            curSpesc: {
                pos: 0,
                index: 0,
                quantity: 0,
                specsId: ''
            },
            page: 1,
            pageNum: 15,
            emptyFlag: false,
            failCount: 0,
            // cartList: [{
            //     shop_id: "S1000000001",
            //     shop_name: "京东自营",
            //     // selected: false,
            //     product_list: [
            //         {
            //             cart_id: "",
            //             product_id: "1323234",
            //             id: "13",
            //             image: 'https://img.yzcdn.cn/vant/cat.jpeg',
            //             product_name:
            //                 "标题标题标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标",
            //             // specs_name: "",
            //             quantity: 1,
            //             // price: "67.00",
            //             // selected: false,
            //             status: '0',
            //             lowest_price: '50.10',
            //             specs_list: [{
            //                 specs_id: "100001",
            //                 specs_name: "3寸",
            //                 price: "100.10",
            //                 weight: "1000",
            //                 is_selected: false
            //             }, {
            //                 specs_id: "100004",
            //                 specs_name: "6寸",
            //                 price: "50.10",
            //                 weight: "1200",
            //                 is_selected: true
            //             }]
            //         },
            //         {
            //             cart_id: "",
            //             product_id: "565676879",
            //             id: "13",
            //             image: 'https://img.yzcdn.cn/vant/cat.jpeg',
            //             product_name:
            //                 "标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标标题标题标题标",
            //             // specs_name: "",
            //             quantity: 1,
            //             // price: "67.00",
            //             // selected: false,
            //             status: '1',
            //             lowest_price: '50.10',
            //             specs_list: [{
            //                 specs_id: "100001",
            //                 specs_name: "3寸",
            //                 price: "60.10",
            //                 weight: "1000",
            //                 is_selected: false
            //             }, {
            //                 specs_id: "100005",
            //                 specs_name: "5寸",
            //                 price: "100.10",
            //                 weight: "1000",
            //                 is_selected: true
            //             }]
            //         }
            //     ]
            // }],

            // pageTotal: 0
        };
    },
    methods: {
        ...mapMutations(["updateProductList","updateCartCount","updateProductId","updateViewType","updateShopId","updateActiveTab"]),
       
        onLoad() {
            // 真实
            this.page++;
            this.getDataList();
        },
        // 获取购物车列表
        getDataList(type) {
            let param = {
                    page: this.page,
                    per_num: this.pageNum // 条数及商品数
                };
            Toast.loading({
                message: '加载中...',
                duration: 0,
                forbidClick: true,
            });
            API.cartList(param).then(({data:res}) => {
                Toast.clear();
                if(res){
                    this.updateCartCount(res.total == 0 ? '': res.total);
                    this.pageTotal = res.total / this.pageNum;
                    if(res.cart_list) {
                        this.page == 1 ? (this.cartList = res.cart_list) : (this.cartList = [...this.cartList, ...res.cart_list]);
                    } else {
                        this.cartList = [];

                    }
                    // 数据处理
                    this.dealListData(this.cartList, res.total, type);
                }
                // 加载状态结束
                this.loading = false;
                // 数据全部加载完成
                if(res.length == 0 || res.length < this.pageNum) this.finished = true;
            }).catch(error => {
                Toast.clear();
                this.loading = false;
                this.finished = true;
                Toast.fail(error);
            });

        },
        // 跳转到商品详情页
        goProductDetail(productId) {
            this.updateProductId(productId);
            this.$router.push({ name: "productDetails"});
        },
        // 跳转到店铺
        goShop(id) {
            this.updateShopId(id)
            this.$router.push({ name: "shop"});
        },
        // 商品规格弹框显示
        showSelectClick(pos, index) {
            let curSpesc = this.curSpesc,
                list = this.list[pos].product_list[index];
            this.showBase = true;
            this.$set(curSpesc, 'pos', pos);
            this.$set(curSpesc, 'index', index);
            curSpesc.quantity = list.quantity;
            this.$set(this, 'initialSku', skuData.dealData(list, 'cart'));
            curSpesc.specsId = list.specs_id
        },

        // 添加购物车点击事件
        onAddCartClicked(data) {
            let specsId = data.selectedSkuComb.s1,
                curSpesc = this.curSpesc,
                list = this.list[curSpesc.pos].product_list[curSpesc.index],
                specsList = list.specs_list;
            list.quantity = data.selectedNum;
            specsList.forEach((item) => {
                if(item.specs_id == specsId) {
                    list.specs_name = item.specs_name + ';';
                    list.specs_id = item.specs_id;
                    list.price = item.price;
                }else {
                    item.is_selected = false;
                }
            });
            this.showBase = false;

            if(list.selected && !this.payBtnGreyFlag) {
                this.calcSelectedPrice(this.curSpesc.pos); //  需要重新计算金额
                this.productCount = `去结算(${this.countSelectedNum().count})`;
            }
            if(specsId == curSpesc.specsId && data.selectedNum == curSpesc.quantity) return;
            // 当规格或者数量发生变化时 调用更改接口
            // 逻辑更改
            let param = {
                cart_id: list.cart_id,
                specs_id: data.selectedSkuComb.s1,
                quantity: data.selectedNum
            }
            this.updateCartItem(param);
        },
        // 步长变化
        onStepChange(pos, index, cartId, specsId, items) {
            // console.log('onStepChange',items);
            let item = this.list[pos].product_list[index];
            if(item.selected && !this.payBtnGreyFlag) {
                this.calcSelectedPrice(pos);
                this.productCount = `去结算(${this.countSelectedNum().count})`;
            }
            // 记录但不刷新列表数据
            let param = {
                cart_id: cartId,
                specs_id: specsId,
                quantity: item.quantity
            }
            this.updateCartItem(param);
        },
        // 选择商品属性时触发
        skuSelected(data) {
            this.$set(this.skuData, 'weight', data.selectedSkuComb ? '重量:' + data.selectedSkuComb.weight + 'KG': "");
        },
        // 更改购物车选择项
        updateCartItem(param) {
            // 测试数据
            param = param || {
                cart_id: '',
                specs_id: '',
                quantity: ''
            };
            API.cartUpdateProduct(param).then((data) => {
            }).catch(error => {
                Toast(error)
            });
        },
        
        // 商品删除点击事件
        deleteEvt() {
            if(this.cartList.length <= 0) return;
            let obj = this.countSelectedNum(),
                    count = obj.count,
                    ids = obj.ids;
            if (count == 0) {
                Toast("请选择需要删除项！");
                return;
            }
            this.popDialog(ids);
            
        },
        popDialog(ids) {
            Dialog.confirm({
                title: '',
                message: `确定将这${this.countSelectedNum().count}个宝贝删除？`,
            }).then(() => {
                // 调用删除接口
                this.deleteItem(ids);
            }).catch(() => {
                Dialog.close();
            });
        },
        // 删除购物车 商品
        deleteItem(ids) {
            this.updateCartCount();
            ids = ids || []
           let param = {
                    cart_id: ids
                };
            API.cartDelProduct(param).then((data) => {
                if(data.code == '0000'){ 
                    // 再次请求列表数据
                    this.getDataList('del');
                }
            }).catch(error => {
                Toast(error);
            });
        },
        // 到这里
        // 统计已选中数
        countSelectedNum() {
            // console.log('countSelectedNum')
            let cartList = this.cartList,
                itemList,
                count = 0,
                ids = [];
            for (let i = 0; i < cartList.length; i++) {
                itemList = cartList[i].product_list;
                for (let j = 0; j < itemList.length; j++) {
                    if (itemList[j].selected) {
                        // count += parseInt(itemList[j].quantity);
                        count++;
                        ids.push(itemList[j].cart_id);   //ids就是选中商品的购物车card_id数组
                    }
                    if ((i == cartList.length - 1) && (j == itemList.length -1)) {
                        return {
                            count: count,
                            ids: ids
                        };
                    }
                }
            }
        },
        // 判断用户是否选择多个店铺
        judgeMutiShop(val,pos) {
            let arr = this.shopCount,
                count = 0,
                curPos = 0;
            if(val) {
                arr[pos]++;
            } else {
                // console.log('arr[pos]',arr[pos]);
                arr[pos] > 0 && arr[pos]--;
            }
            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] != 0) {
                        count++;
                        curPos = i;
                    }
                }
            }
            // console.log('count', count)
            this.payBtnGreyFlag = (count == 1 && this.failCount == 0) ? false : true;
            if(this.payBtnGreyFlag) {
                this.totalPrice = 0;//两个店铺的时候价格不计算，结算数量计算
            } else {
                // 遍历 第curPos + 1家店铺
                this.calcSelectedPrice(curPos);
            }
        },
        // 计算已选商品价格  选择框和步长变化的时候都会重新计算价格
        calcSelectedPrice(pos) {
            // 某个商铺的商品列表
            let list = this.list[pos].product_list,
                totalPrice = 0;
                
            for(let i = 0; i < list.length; i++) {
                if(list[i].selected) {
                    totalPrice += parseFloat(list[i].price) * parseInt(list[i].quantity);
                } 
            }
            this.totalPrice = totalPrice * 100;
        },
        // 全选控制处理 包含商铺全选和底部购物车内全部商品的全选
        dealAllSelectedState(itemList, key) {
            let flag = true;
            itemList.forEach((item) => {
                if(item.selected == false) {
                    flag = false;
                }
            });
            return flag;
        },
        // 商店选择点击事件 pos: 第几家店
        shopSelectEvt(val, pos) {
            this.cartList[pos].product_list.forEach((item) => {
                item.selected = !val;
            });
        },
        // 商品选择 第pos店铺的第index个商品
        tradeChange(val, pos, index) {
            // console.log(8900,val,pos,index)
            let shopList = this.cartList[pos],
                itemList = shopList.product_list,
                shopFlag = true,
                allFlag = true;
            if (!val) {
                this.selectedAll = val;
                shopList.selected = val;
                // true
            } else {
                // 先考虑当前店铺
                if (this.dealAllSelectedState(shopList.product_list))
                    shopList.selected = val;
                // 再考虑全选情况
                if (this.dealAllSelectedState(this.cartList))
                    this.selectedAll = val;
            }
            if(shopList.product_list[index].status == '0') {
                if(val) {
                    this.failCount++;
                } else {
                    this.failCount && this.failCount--;
                }
            }

            // 控住结算按钮置灰控制
            this.judgeMutiShop(val,pos);
            this.productCount = `去结算(${this.countSelectedNum().count})`;  
        },
        // 全选 点击事件
        allSelectEvt(val) {
            this.cartList.forEach((item) => {
                item.selected = !val;
                item.product_list.forEach((productItem) => {
                    productItem.selected = !val;
                });
            });
        },
        // list数据处理 加 selected字段
        dealListData(list, total, type) {
            let productList,
                specsList;
            if((type && type == 'del') || total == 0) {
                this.productCount = `去结算(${0})`;
                this.$set(this, 'selectedAll', false);
                this.$set(this, 'totalPrice', 0);
                if(total == 0) {
                    this.emptyFlag = true;
                    this.payBtnGreyFlag = true;
                    return;
                }
            }
            this.emptyFlag = false;
            for(let i = 0; i < total; i++) {
                this.shopCount[i] = 0;
            }
            list.forEach((shopItem) => {
                this.$set(shopItem, 'selected', false);
                let productArr = shopItem.product_list;
                productArr.forEach((productItem) => {
                    this.$set(productItem, 'selected',false);
                    let specsArr = productItem.specs_list.filter((specsItem) => {
                        return specsItem.is_selected == true;
                    })
                    if(specsArr.length == 0) this.$set(productItem, 'status','0');
                    this.$set(productItem, 'specs_name', specsArr.length > 0 ? (specsArr[0].specs_name + ';') : '');
                    this.$set(productItem, 'specs_id', specsArr.length > 0 ? specsArr[0].specs_id : '');
                    this.$set(productItem, 'price', specsArr.length > 0 ? specsArr[0].price : '');
                    
                });
            })
            this.list = list;
        },
        // 商品数据处理  传给后台  删减数据结构   订单确认接口传参数据处理
        dealParamsData(list) {
            let data = JSON.parse(JSON.stringify(list)), // 深copy
                arr = [];
                data.forEach((item) => {
                    if(item.selected) {
                        let obj = {};
                        obj.product_id = item.product_id;
                        obj.quantity = item.quantity;
                        item.specs_list.forEach((specsItem) => {
                            if(specsItem.is_selected) {
                                obj.specs_id = specsItem.specs_id;
                                arr.push(obj);
                            }
                        });
                    }
                });
            return arr;
        },
        // 结算点击事件
        onSubmit() {
            // 按钮置灰不可点击
            if(this.payBtnGreyFlag) return;
            let index = 0;
            for(let i = 0; i < this.shopCount.length; i++) {
                if(this.shopCount[i] != 0) index = i;
            }
            this.updateProductList(this.dealParamsData(this.cartList[index].product_list));
            this.$router.push({name:'orderConfirm'});
        },
    },
    mounted() {
        // document.title = this.title;
        // 重置数据
        this.updateViewType('');
        this.updateActiveTab('cart')
        this.getDataList();
        // this.dealListData(this.cartList)
    }
};
</script>
<style scoped lang="less">
@import "../assets/styles/color.less";
.shoppingCartWrap {
    .van-submit-bar {
        bottom: 1.33rem;
        // bottom: 50px;
    }
    width: 100%;
    min-height: calc(100vh - 2.7rem);
    height: auto;
    background: #f2f2f2;
    .btn-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 0.27rem;
        background: #fff;
        text-align: right;
        height: 1.2rem;
        span {
            display: inline-block;
            margin-right: .4rem;
            padding: 0.2rem 0.4rem;
            font-size: 0.32rem;
            // line-height: 0.8rem;
            color: #323233;
            background-color: #fff;
            border:0.02667rem solid #ebedf0;
            // vertical-align: middle;
        }
    }
    
    .shop-list-wrap {
        margin-bottom: 2.7rem;
        .list-wrap {
            margin-bottom: 0.27rem;
            padding: 0.27rem 0 0 4%;
            width: 100%;
            background: #fff;
            .shop-name {
                padding: 0.2rem 0;
                font-size: 0.4rem;
                color: @basecolor;
                font-weight: bold;
            }
            .border-bottom {
                border-bottom: 2px solid #f2f2f2;
            }
            .list-item {
                padding: .2rem 0;
                width: 100%;
                // 更新
                .item-wrap {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    .content-wrap {
                        display: flex;
                        margin-left: .2rem;
                        width: 92%;
                        font-size: .32rem;
                        .desc-wrap {
                            margin-left: .2rem;
                            width: calc(100% - 2.8rem);
                            .title {
                                line-height: .5rem;
                            }
                            .text-wrap {
                                display: inline-block;
                                margin-top: .2rem;
                                width: 40%;
                                font-size: 0;
                                background: #f2f2f2;
                                .text {
                                    display: inline-block;
                                    padding-right: 0.07rem;
                                    width: calc(95% - 0.5rem);
                                    font-size: 0.32rem;
                                    height: 0.5rem;
                                    vertical-align: top;
                                    line-height: 0.5rem;
                                    text-indent: .2rem;
                                }
                                i {
                                    display: inline-block;
                                    width: 0.5rem;
                                    height: .5rem;
                                    background: url(../assets/images/icon-arrow-down.png)
                                        center center / 0.27rem 0.27rem no-repeat;
                                    vertical-align: top;
                                }
                            }
                            .step-wrap {
                                margin-top: .2rem;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                height: 0.8rem;
                                overflow: hidden;
                                .price {
                                    display: inline-block;
                                    width: 55%;
                                    height: .8rem;
                                    color: red;
                                    font-weight: 700;
                                    font-size: .4rem;
                                    line-height: .8rem;
                                }
                            }
                        }
                        
                    }

                }
                .fail-notice {
                    padding-left: .6rem;
                    font-size: .32rem;
                    color: red;
                }
            }
        }
    }
    .btn-grey {
        .van-button--danger {
            background: #bbbfd2 !important;
        }
    }
    .desc {
        color: @subcolor;
        font-size: .35rem;
    }
    .price-tips {
        position: relative;
        top: .02rem;
        left: .2rem;
        color: @subcolor;
        font-size: .28rem;
    }
    .van-submit-bar__price--integer {
        font-size: .32rem;
    }
    .van-list {
        background: #fff;
        .van-card {
            background: #fff;
        }
    }
    .hide {
        visibility: hidden;
    }

    .empty-wrap {
        width: 100%;
        height: calc(100vh - 2.66rem);
        background: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        .content {
            i {
                display: inline-block;
                height: 2rem;
                width: 100%;
                background: url(../assets/images/icon-empty.png) center center /
                        1rem 1rem no-repeat;
            }
            p {
                padding: .2rem 0;
                text-align: center;
            }
            .text1 {
                color: @basecolor;
                font-size: .42rem;
            }
            .text2 {
                color: @subcolor;
                font-size: .32rem;
            }

        }
        
    }
}
</style>