<template>
    <div class="myCommentWrap">
        <van-sticky>
            <commHead :title="title"></commHead>
            <van-tabs v-model="active">
                <van-tab title="待评价"></van-tab>
                <van-tab title="已评价"></van-tab>
            </van-tabs>
        </van-sticky>
        <div class="list-warp">
            <unEvaluatedList v-if="active == 0"></unEvaluatedList>
            <alrEvaluatedList v-if="active == 1"></alrEvaluatedList>
        </div>
    </div>
</template>

<script>
import { Toast,Tab,Tabs,Sticky} from "vant";
import alrEvaluatedList from './alrEvaluatedList';
import unEvaluatedList from './unEvaluatedList';
import commHead from "../../components/commHead";
import API from "@/api";
export default {
    name: "myComment",
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Toast.name]: Toast,
        [Sticky.name]: Sticky,
        alrEvaluatedList,
        unEvaluatedList,
        commHead
    },
    data() {
        return {
            title: "我的评价",
            active: 0
        };
    },
    methods: {
    },
    mounted() {
        // document.title = this.title;
    }
};
</script>
<style scoped lang="less">
@import "../../assets/styles/color.less";
.myCommentWrap {
    width: 100%;
    height: 100vh;
    background: #f2f2f2;
}
</style>