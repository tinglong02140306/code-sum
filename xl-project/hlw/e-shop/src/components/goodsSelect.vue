<template>
    <div class="goodsSelectWrap">
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
                        <!-- <span>编号:1000000S297</span> -->
                    </p>
                </template>
            </van-sku>
            <van-button block type="primary" @click="showCartClick">xxxx</van-button>
        </div>
    </div>
</template>
<script>
import skuData from "../assets/js/data";
import { Sku, Button } from "vant";
export default {
    name: 'goodsSelect',
    components: {
        [Sku.name]: Sku,
        [Button.name]: Button,
    },
    data() {
        return {
            skuData: skuData,
            showBase: false,
            showCustom: false,
            showStepper: false,
            showSoldout: false,
            initialSku: {},
            productList: {
                cart_id: "1000000000002",
                product_id: "P1000000000001",
                title: "xxxxxxxxxx",
                image: require("@/assets/images/1.png"),
                quantity: 1,
                specs: [{
                    specs_id: "100001",
                    specs_name: "6寸",
                    price: "100.10",
                    weight: "1200",
                    is_selected: false
                }, {
                    specs_id: "100002",
                    specs_name: "3寸",
                    price: "50.10",
                    weight: "500",
                    is_selected: true
                }]
            },

            productLists: {
                product_name:"奶油巧克力蛋糕",
                images:[require("@/assets/images/1.png"),require("@/assets/images/1.png")],
                sales_volume:100,
                lowest_price:"100.10",
                status:"1",
                specs_list:[{
                    specs_id:"100001",
                    specs_name:"6寸",
                    price:"100.10",
                    weight:"1000"
                },{
                    specs_id:"100002",
                    specs_name:"12寸",
                    price:"180.10",
                    weight:"1500"
                }]
            }
            
        };
    },

    methods: {
        // 显示商品选择弹框
        showCartClick() {
            console.log('goodselect',this.productList);
            this.$set(this, 'initialSku', skuData.dealData(this.productLists, 'detail'));
            this.showBase = true;

        },
        onBuyClicked(data) {
            this.$toast("buy:" + JSON.stringify(data));
            console.log(JSON.stringify(data));
        },
        onAddCartClicked(data) {
            this.$toast("add cart:" + JSON.stringify(data));
        },
        // 选择商品属性时触发
        skuSelected(data) {
            this.$set(this.skuData, 'weight', data.selectedSkuComb ? '重量:' + data.selectedSkuComb.weight + 'KG': "");
            // this.$set(this.skuData, 'weight', data.selectedSkuComb.weight);
        },
    }
};
</script>

<style lang="less">
@import "../assets/styles/color.less";
.goodsSelectWrap {
    .sku-container {
        padding: 0 15px;
    }
    .desc {
        color: @subcolor;
        font-size: .35rem;
    }
}
</style>