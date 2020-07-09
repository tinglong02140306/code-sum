<template>
  <div class="index">
    <router-view/>
    <van-tabbar v-model="active">
        <van-tabbar-item name="home" icon="home-o" @click="home()">首页</van-tabbar-item>
        <van-tabbar-item name="commodity" icon="apps-o" @click="commodity()">商品</van-tabbar-item>
        <van-tabbar-item name="cart" icon="shopping-cart-o" :badge="cartCounts" @click="cart()">购物车</van-tabbar-item>
        <van-tabbar-item name="mine" icon="user-o" @click="mine()">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {Tabbar, TabbarItem} from 'vant';
import API from "@/api";
import { mapState, mapMutations } from "vuex";
export default {
    name: "index",
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    },
    data() {
        return {}
    },
    mounted() {
        this.getCartCount();
    },
    computed: {
        ...mapState(["cartCount","activeTab"]),
        active: {
            get() {
                return this.activeTab;
            },
            set(val) {
                this.updateActiveTab(val);
            }
        },
        cartCounts: {
             get() {
                return this.cartCount;
            },
            set(val) {
                this.updateCartCount(val);
            }

        }
    },
    methods:{
        ...mapMutations(["updateCartCount","updateActiveTab"]),
        home() {
            this.$router.push({ path: "/home"});
        },
        commodity() {
            this.$router.push({ path: "/commodity"});
        },
        cart() {
            this.$router.push({ path: "/shoppingCart"});
        },
        mine() {
            this.$router.push({ path: "/mineHome"});
        },
        // 获取购物车商品数量
        getCartCount() {
            API.cartList({
                page: 1,
                per_num: 15
            }).then(({data:res}) => {
                if(res){
                    this.updateCartCount(res.total == 0 ? '': res.total)
                }
            }).catch(error => {
            });
        }
    } 
};
</script>
<style lang="less" scoped>
.index {
}
</style>
