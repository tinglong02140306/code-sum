/*
 * @Author: lhqin 
 * @Date: 2018-11-06 15:13:20 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-07 19:36:52
 * @Description: tab导航切换 
 */

<template>
    <div id="tabSwitch">
        <div class="guide-title">
            <p class="font-max" :class="curTabState == '1' ? 'guide-title-active' : 'guide-title-default'" title="我的收藏" @click="titleClickEvt('1')">我的收藏</p>
            <p class="font-max" :class="curTabState == '2' ? 'guide-title-active' : 'guide-title-default'" :subtitle="subtitle" @click="titleClickEvt('2')">{{subtitle}}</p>
        </div>
    </div>
</template>
<script>
export default {
    // props: ['title'],
    props: ['tabState','tabType'],
    data() {
        return {
            curTabState: this.tabState,
            subtitle: '事项'
        }
    },
    methods: {
        /**
         * tab 切换
         */
        titleClickEvt(state) {
            let _that = this;
            _that.curTabState = state;
            //     $titEle,
            //     text;
            // $titEle = $(event.target);
            // text = $titEle.text();
            // $titEle.addClass('guide-title-active');
            // $titEle.siblings().removeClass('guide-title-active').addClass('guide-title-default');
            _that.$emit('tabsClickEvt',state);
        }
    },
    mounted() {
        this.subtitle = this.tabType == '1' ? '事项' : '事件';
    }
}
</script>
<style lang="less" scoped>
@import "../../assets/styles/color.less";
#tabSwitch {
    .guide-title {
        height: 38px;
        line-height: 38px;
        border-bottom: 1px solid #ced5e3;
        padding-left: 20px;

        p {
            display: inline-block;
            width: 120px;
            height: 100%;
            margin-left: 3px;
            text-align: center;
            cursor: pointer;
        }

        .guide-title-default {
            height: 38px;
            line-height: 40px;
            background-color: #eef1f7;
            color: #788090 !important;
            border-bottom: 1px solid #e0e6f1;
        }

        .guide-title-active {
            vertical-align: top;
            line-height: 31px;
            background-color: #fff;
            color: #17233d;
            border: 1px solid #ced5e3;
            border-bottom: none;
            border-top: 3px solid #2d8cf0;
        }
    }
}
</style>
