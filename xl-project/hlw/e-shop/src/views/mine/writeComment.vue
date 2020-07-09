<template>
    <div class="wraper">
        <van-sticky class="orderWrap">
            <commHead :title="title"></commHead>
        </van-sticky>
        <!-- 评价部分 -->
        <div class="content">
            <div class="productBox">
                <img class="productImg" :src="list.image" alt="">
                <div class="productName van-multi-ellipsis--l2">{{list.product_name}}</div>
            </div>
            <div class="price">￥{{list.amount}}</div>
            <!-- <div class="price">￥1000000</div> -->
            <!-- 星星 -->
            <van-rate
                class="star"
                v-model="startValue"
                :size="16"
                color="rgb(243, 58, 34)"
                void-icon="star"
                void-color="#eee"
            />
            <!-- 写评价 -->
            <van-field
                class="rate"
                v-model="commentMsg"
                rows="1"
                autosize
                type="textarea"
                maxlength="128"
                placeholder="写满10字并为商品拍买家秀，被更多人看到哦~"
            />
            <!-- 上传图片 -->
            <van-uploader
                class="uploadImage"
                :after-read="afterRead"
                v-model="commentPicList"
                multiple
                :max-count="3"
            />
        </div>
        <!-- 提交按钮 -->
        <div class="btn-wrapper">
            <van-button class="btn" size="large" block @click="submitComment">提交发布</van-button>
        </div>
    </div>
</template>
<script>
    import { Rate,Field,Uploader,Button,Toast,Dialog,sticky} from 'vant';
    import {trimAll,} from "../../utils/utils";
    import commHead from "../../components/commHead";
    import API from "@/api"
export default {
    name:"writeComment",
    components: {
        [Rate.name]: Rate,
        [Field.name]: Field,
        [Uploader.name]: Uploader,
        [Button.name]: Button,
        [Toast.name]: Toast,
        [Dialog.name]: Dialog,
        [sticky.name]: sticky,
        commHead,
    },
    data() {
        return {
            title:"发表评价",
            list:[],
            startValue: 5,//星星
            commentMsg:'',
            commentPicList: [],
            newCommentPicList:[],
        }
    },
    mounted() {
        this.list = this.$route.params.subItem
    },
    methods:{
        afterRead(file) {
            // 此时可以自行将文件上传至服务器
            console.log("file",file);
            this.newCommentPicList.push(file.content)
        },
        checkParams(){
            if(!trimAll(this.startValue)) {
                Toast('请给商家星级评分');
                return false;
            }
            return true;
	    },
        submitComment() {
            if(!this.checkParams()) {
			    return;
            }
            // this.
            const params = {
                sub_order_id:this.list.sub_order_id,
                grade:this.startValue,
                content:this.commentMsg,
                images:this.newCommentPicList,
            }
            console.log("添加评论传参",params)
            API.addComment(params).then(res => {
                console.log("addComment：>>>>>>>>>>>>>>>>");
                Toast("提交评价成功")
                // 评价成功后跳转哪里
                this.$router.push({
                    name:'order',
                })
            }).catch(error => {
                console.log(error);
                Toast.fail(error.message);
            });
        }
    }
}
</script>
<style scoped>
.wraper {
    width:100vw;
    height: 100vh;
    background-color: #f2f2f2;
    font-size: 14px;
}
.content {
    background-color: #fff;
    padding:0 10px;
}
.productBox {
    min-height: 200rpx;
    line-height: 200rpx;
    display:flex;
    justify-content:left;
    flex-wrap: wrap;
    align-items:center; 
    padding:20px 0px;
}
.productImg {
    width:100px;
    height: 100px;
    margin-right:10px;
}
.productImg {
    flex:0 0 30%;
}
.productName {
    box-sizing: border-box;
    flex:0 0 60%;
}
.price {
    font-weight: 700;
    text-align: right;  
}
.star {
    display:flex;
    justify-content:left;
    flex-wrap: wrap;
    align-items:center; 
}
.rate {
    margin-top:20px;
    background-color: #f2f2f2;
    border-radius: 3px;
    height: 150px;
}
.uploadImage {
    margin-top:20px;
    display:flex;
    justify-content:left;
    flex-wrap: wrap;
    align-items:center;
    padding-bottom:50px;
}
.btn-wrapper{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    width: 100vw;
}
.btn {
    width: 350px;
    height: 44px;
    line-height: 44px;
    margin: 13px 10px 19px;
    background-color: rgb(243, 58, 34);
    color: white;
    font-family: SourceHanSansCN-Light;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
}
</style>