<template>
  <div>
    <van-sticky class="orderWrap">
      <commHead :title="title"></commHead>
    </van-sticky>
    <div class="unEvaluatedListWrap">
      <van-list 
        v-model="loading" 
        :finished="finished" 
        :finished-text="finishedText" 
        @load="onLoad"
      >
        <div 
          class="list-wrap"
          v-if ="list && list.length>0" 
        >
          <div class="list-item" 
            v-for="(item,index) in list"
            :value="item.value"
            :key="index"
          >
            <div style="display: flex;justify-content: space-between;align-items: center;">
              <p class="shop-name ell">{{item.shop_name}}</p>
              <p class="shop-name ell" style="text-align: right;color:#8a8a8a;">{{item.serial_no}}</p>
            </div>
            <div class="content">
                <div class="img-wrap">
                    <van-image
                      cover
                      width="100%"
                      height="100%"
                      radius="10px"
                      :src="item.image"
                    />
                </div>
                <div class="desc-btn-wrap">
                    <div class="desc-wrap">
                        <div class="title-wrap">
                          <p class="two-ell">{{item.product_name}}</p>
                          <p>{{item.specs_name}}</p>
                          <p>申请金额：￥{{item.sub_order_amount}}</p>
                          <p v-if ="item.refund_status=='3'">退款金额：￥{{item.refund_amount}}</p>
                          <p>退款原因：{{item.refund_reason}}</p>
                        </div>
                        <!-- <div class="price-wrap">
                            <p>￥{{item.refund_amount}}</p> -->
                            <!-- <p>×{{item.quantity}}</p> -->
                        <!-- </div> -->
                    </div>
                    <div class="btn-wrap">
                      <van-button v-if ="item.refund_status=='1'" disabled plain round type="info" size="small" color="#ee0a24">
                        已申请退款
                      </van-button>
                      <van-button v-if ="item.refund_status=='2'" disabled plain round type="info" size="small" color="#ee0a24">
                        商家拒绝
                      </van-button>
                      <van-button v-if ="item.refund_status=='3'" disabled plain round type="info" size="small" color="#ee0a24">
                        申请通过
                      </van-button>
                      <van-button v-if ="item.refund_status=='4'" disabled plain round type="info" size="small" color="#ee0a24">
                        退款失败
                      </van-button>
                      <van-button v-if ="item.refund_status=='5'" disabled plain round type="info" size="small" color="#ee0a24">
                        退款成功
                      </van-button>
                      <van-button v-if ="item.refund_status=='99'"disabled plain round type="info" size="small" color="#ee0a24">
                        退款撤销
                      </van-button>
                      <van-button  plain round type="info" size="small" color="#ee0a24" @click="checkAfterSalesDetail(item)">
                        查看详情
                      </van-button>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <!-- <div v-else class="no-list">
          暂无更多数据~
        </div> -->
      </van-list>
    </div>
  </div>
</template>
<script>
import {
  Toast,
  Card,
  Image,
  Button,
  List,
  Sticky,
} from 'vant';
import API from "@/api"
import commHead from "../../components/commHead";
export default {
  name: "afterSales",
  components: {
    [Card.name]: Card,
    [Toast.name]: Toast,
    [Image.name]: Image,
    [Button.name]: Button,
    [List.name]: List,
    [Sticky.name]: Sticky,
    commHead,
  },
  data() {
    return {
      title:"退款/售后",
      finished: false,
      loading: false,
      // 没有更多了
      finishedText: "",
      list: [],
      testData: [{
        "shop_id":"S10000000000001",
        "shop_name":"店铺名称",
        "title":"商品名称",
        "image":"https://img.yzcdn.cn/vant/apple-1.jpg",
        "specs_name":"dddd",
        "serial_no":"R10000000001",
        "refund_amount":"10.1",
        "refund_status":"1",
        "refund_reason":"xxxxxxxxxxxxx",
        "reject_reason":"xxxxxxxxxxxxxxx"
      },{
        "shop_id":"S10000000000002",
        "shop_name":"店铺名称",
        "title":"商品名称",
        "image":"https://img.yzcdn.cn/vant/apple-1.jpg",
        "specs_name":"dddd",
        "serial_no":"R10000000001",
        "refund_amount":"10.1",
        "refund_status":"1",
        "refund_reason":"xxxxxxxxxxxxx",
        "reject_reason":"xxxxxxxxxxxxxxx"
      }],
      page:0,
      pageNum: "10",
    };
  },
  mounted() {
  },
  methods: {
    onLoad() {
      this.loading = true
      this.page++;
      this.getAfterSalesList();
    },
    getAfterSalesList() {
      const param = {
        page: this.page + '',
        per_num: this.pageNum
      };
      API.refundList(param).then(({data:data}) => {
        if(!data){
            data = []
        }
        if(data){
          if(this.page == 1) {
              this.list = data
          } else {
              this.list = [...list, ...data];
          }
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if(data.length == null || data.length == 0 || data.length < data.pageNum) {
          this.finished = true;
        }
      }).catch(error => {
        this.loading = false;
        this.finished = true;
      });
    },
    // 查看退款详情
    checkAfterSalesDetail(item) {
      console.log('传item',item)
      this.$router.push({
        name:'afterSalesDetail',
        params:{
          item:item
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
  @import "../../assets/styles/color.less";
  .unEvaluatedListWrap {
      width: 100%;
      height: 100vh;
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
                  padding: 0.2rem 0;
                  font-weight: bold;
                  width: 50%;
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
                              /* line-height: 0.52rem; */
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
                              line-height: 0.49rem;
                          }
                      }
                  }
              }
          }
      }
      .no-list {
        width:100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.32rem;
      }
      .no-more-hide + div {
          display: none !important;
      }
      
  }
  </style>
  