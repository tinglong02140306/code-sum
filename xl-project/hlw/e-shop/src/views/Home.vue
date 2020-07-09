<template>
  <div class="home">
    <!-- 轮播图 -->
    <van-swipe class="goods-swipe" :autoplay="2000">
      <van-swipe-item 
        v-for="(adList, index) in bannerList" 
        :key="index" 
        @click="showProductDetails(adList)"
      >
      <!-- <van-swipe-item 
        v-for="(adList, index) in images" 
        :key="index" 
        @click="showProductDetails(adList)"
      > -->
        <img :src="adList.image" class="image" >
      </van-swipe-item>
    </van-swipe>
    <!-- 推荐列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :class="{'border-bottom' : list.length > 4}"
    >
      <section class="goodsListBox">
        <header class="goodsListTitle">推荐好物</header>
        <div class ="goodsList travel_bscroll" >
            <div 
              class ="list bscroll-container" 
              v-for="(adList, index) in list" 
              :key="index" 
              @click="showProductDetails(adList)"
            >
              <img class= "goodsImage" :src="adList.image" alt="">
              <header class="productName van-ellipsis">{{adList.product_name}}</header>
              <div class="price">￥{{adList.price}}</div>
            </div>
        </div>
      </section>
    </van-list>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Swipe, SwipeItem,Tabbar, TabbarItem,PullRefresh,Toast,List } from 'vant';
import API from "@/api"

export default {
  name: "Home",
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [PullRefresh.name]: PullRefresh,
    [Toast.name]: Toast ,
    [List.name]: List ,
  },
  data() {
    return {
      images:[
      {
          "image":"https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/39343/4/1551/48272/5cbd71f4E329401dc/579b33f530a1402d.jpg!cr_1125x549_0_72!q70.jpg.dpg",
          "title":"苹果9",
          "price":"8999.00",
          "product_id":"P100000001"
        },
        {
          "image":"https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/39343/4/1551/48272/5cbd71f4E329401dc/579b33f530a1402d.jpg!cr_1125x549_0_72!q70.jpg.dpg",
          "title":"苹果9",
          "price":"8999.00",
          "product_id":"P100000002"
        },
        {
          "image":"https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/34869/14/3703/113972/5cb953c1E4294d8ea/b73c538710f5c462.jpg!cr_1125x549_0_72!q70.jpg.dpg",
          "title":"苹果9",
          "price":"8999.00",
          "product_id":"P100000003"
        },
        {
          "image":"https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/39343/4/1551/48272/5cbd71f4E329401dc/579b33f530a1402d.jpg!cr_1125x549_0_72!q70.jpg.dpg",
          "title":"苹果9",
          "price":"8999.00",
          "product_id":"P100000004"
        },
        {
          "image":"https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/39343/4/1551/48272/5cbd71f4E329401dc/579b33f530a1402d.jpg!cr_1125x549_0_72!q70.jpg.dpg",
          "title":"苹果9",
          "price":"8999.00",
          "product_id":"P100000005"
        },
      ],
      bannerList:[],//首页banner
      // images:[],
      page: 0,
      size: "10",
      //首页普通广告
      list:[],
      // 默认选中图标
      // active:'home',
      loading: false,
      finished: false
    }
  },
  created() {
  },
  mounted() {
    //广告banner
    this.getAd();
    this.getAdList()
    this.updateActiveTab('home')
  },
  methods:{
    ...mapMutations(["updateProductId","updateActiveTab" ]),
    onLoad() {
      console.log('waaa', 'loading = ' + this.loading)
    },
    // 获取广告位内容
    getAd() {
      const params1 = {
        type:'1'
      }
				API.addList(params1).then(res => {
					console.log("bannner：>>>>>>>>>>>>>>>>");
					console.log(res);
          this.bannerList = res.data || [];
				}).catch(error => {
					console.log(error);
          Toast.fail(error.message);
				});
    },
    // 获取普通广告
    getAdList() {
      const params2 = {
        type:'2'
      }
      this.loading = true
				API.addList(params2).then(res => {
					console.log("bannner：>>>>>>>>>>>>>>>>");
					console.log(res);
          this.list = res.data || [];
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if(res || res.data || res.data.length == 0 || res.data.length < res.data.pageNum) {
              this.finished = true;
          }
				}).catch(error => {
          this.loading = false;
          this.finished = true;
					console.log(error);
          Toast.fail(error.message);
				});
    },
    // 展示产品详情
    showProductDetails(adList){
      const productId = adList["product_id"]
      this.updateProductId(productId)
      this.$nextTick(() => {
					this.$router.push("/productDetails");
				});
    },
  } 
};
</script>
<style lang="less" scoped>
  @import "../assets/styles/color.less";
.home {
  width:100vw;
  height: 100vh;
  background-color: #e6e6e6;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.image {
  /* width: 750px;
  height: 206px; */
  width: 375px;
  height: 200px;
}
.goodsListBox {
  margin-top:20px;
  /* background-color: #fff; */
  background-color: #e6e6e6;
  /* height:calc(100vh - 340px); */
}
.goodsListTitle {
  font-family: PingFangSC-Medium !important;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
  line-height: 30px;
  line-height: 30px;
	letter-spacing: 0px;
	color: #1d1d1d;
  background-color: #fff;
}
.goodsList {
  margin-top: 10px;
  width:690rpx;
  min-height: 200rpx;
  line-height: 200rpx;
  display:flex;
  justify-content:flex-start;
  flex-wrap: wrap;
  align-items:center; 
  padding:0px 10px;
  
}
.list {
  box-sizing: border-box;
  /* flex:0 0 50%; */
  flex:0 0 48%;
  padding:10px;
  /* background: #f5f5f5; */
  background: #ffff;
  margin-bottom:10px;
}
.list:nth-child(odd){
  margin-right:10px;
}

/* 推荐图片尺寸修改 */
.goodsImage {
  width:100%;
  /* height: 130px; */
  height: 84px;
}
.productName {
  font-size:14px;
  text-align: left;
  color:#1d1d1d;
}
.price {
  color:#ee0a24;
  font-size:14px;
  text-align: left;
  /* color: #1d1d1d; */
}
.border-bottom {
  margin-bottom: 1.33333rem;
}
</style>
