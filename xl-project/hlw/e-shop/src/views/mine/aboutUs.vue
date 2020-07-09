<template>
    <div class="aboutus-wrap">
        <van-sticky>
            <commHead :title="title"></commHead>
        </van-sticky>
        <div class="content-wrap">
            <img :src="imgUrl" alt />
            <p>{{description}}</p>
        </div>
    </div>
</template>

<script>
import { Sticky } from "vant";
import commHead from "../../components/commHead";
export default {
    name: "aboutUs",
    components: {
        [Sticky.name]: Sticky,
        commHead
    },
    data() {
        return {
            title: "关于我们",
            imgUrl: "https://img.yzcdn.cn/vant/cat.jpeg",
            description:
                "这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。这五个阶段中前四个阶段可以通过商品详情页面文案及设计来处理解决，特别是中间三个阶段。而最后一个阶段则更多是靠产品体验超出预期、售后运营手法来达成。"
        };
    },
    methods: {
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.aboutus-wrap {
    .content-wrap {
        width: 100%;
        padding: 0 4%;
        img {
            margin-top: 0.4rem;
            width: 100%;
            height: 4rem;
        }
        p {
            padding-bottom: 0.5rem;
            margin-top: 0.4rem;
            color: @basecolor;
            font-size: 0.35rem;
            line-height: .6rem;
            text-indent: 0.8rem;
            text-align: left;
        }
    }
}
</style>