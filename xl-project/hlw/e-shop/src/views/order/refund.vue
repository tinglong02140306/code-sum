<template>
    <div class="refundWrap">
        <van-sticky>
            <commHead :title="title"></commHead>
        </van-sticky>
        <div class="img-wrap">
            <van-card
                :desc="list.specs_name"
                :title="list.product_name"
                :thumb="list.image"
            />
        </div>
        <div class="infos-wrap">
            <van-field v-model="list.price" label="退款金额:" value="输入框只读" readonly :border="false" />
            <van-field label="退款说明:" v-model="reason" :border="false" />
        </div>
        <div class="upload-wrap">
            <p>上传凭证</p>
            <van-uploader v-model="images" multiple :max-count="3" :after-read="afterRead" />
        </div>
        <div class="btn-wrap" @click="submit">提交</div>
    </div>
</template>

<script>
import { Toast, Sticky, Card, Field, Uploader } from "vant";
import commHead from "../../components/commHead";
import { mapState, mapMutations } from "vuex";
import API from "@/api";
export default {
    name: "refund",
    components: {
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        [Card.name]: Card,
        [Field.name]: Field,
        [Uploader.name]: Uploader,
        commHead
    },
    data() {
        return {
            title: "申请退款",
            reason: "", // 退款原因
            images: [],
            imagesBase64: [],
            list:{
                product_name: '',
                specs_name: '',
                price: '',
                image: ''
            }
        };
    },
    methods: {
        ...mapMutations(["updateActiveTab"]),
        // 图片上传成功后获取到 file对象
        afterRead(file) {},
        // 提交退款申请
        submit() {
            if(!this.reason){
                Toast("请填写退款原因！");
                return;
            }
            let param,
                imagesBase64 = [];
            for(let i = 0; i <this.images.length; i++) {
                imagesBase64.push(this.images[i].content)
            }
            param = {
                sub_order_id: this.list.sub_order_id, // 子订单号
                reason: this.reason,
                images: imagesBase64
            };
            // let toast = Toast.loading({
            //     message: '加载中...',
            //     duration: 0,
            //     forbidClick: true,
            // });
            API.applyRefund(param).then(({data:data}) => {
                // toast.clear();
                // 申请退款后 跳转到 订单列表页面
                this.$router.go(-1);
            }).catch(error => {
                // toast.clear();
                Toast(error);
            });
        }
    },
    mounted() {
        // Toast.allowMultiple();
        let params = this.$route.params;
        if(params && params.itemList) {
            this.list = params.itemList;
            this.$set(this.list, 'price', '￥' + this.list.amount + '元');
        }
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.refundWrap {
    min-height: 100vh;
    width: 100%;
    background: #f2f2f2;
    overflow: hidden;
    .img-wrap {
        margin: 0.27rem 0;
        .van-card__thumb {
            width: 2rem;
            height: 2rem;
        }
        .van-card__thumb img {
            border-radius: none;
        }
        .van-card__content {
            min-height: 2rem;
        }
    }
    .upload-wrap {
        margin-top: 0.27rem;
        background: #fff;
        width: 100%;
        padding: 0.2rem 4%;
        font-size: 0.35rem;
        p {
            padding: 0.2rem 0;
        }
    }
    .btn-wrap {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.2rem;
        background: #ee0a24;
        color: #fff;
        font-size: 0.4rem;
        line-height: 1.2rem;
        text-align: center;
    }
}
</style>