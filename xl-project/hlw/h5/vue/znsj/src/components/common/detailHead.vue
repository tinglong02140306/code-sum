/*
 * @Author: tinglong 
 * @Date: 2018-09-30 14:28:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-03 20:28:54
 * @description 公共头部
 */
<template>
    <div id="detailHead">
        <span class="font-max title ell inline-block" v-if="titles" :title="titles">{{titles}}</span>
        <span class="btn-group ml10 inline-block" v-if="isBackShow">
            <Button size="small" class="cursor-p w80" @click="$router.back(-1)">
                <i class="iconfont icon-back"></i>
                <span class="font-min">返回</span>
            </Button>
        </span>
        <p class="font-min" :class="['sub-title', isClick ? 'isClick' : '']" v-if="subTitle">
            {{subTitle}}
            <Icon :type="iconType" :name="iconType" v-if="isClick" @click="iconClick"/>
        </p>
    </div>
</template>
<script>
export default {
    props: ['titles', 'subTitle', 'isClick','isBackShow'],
    data() {
        return {
            iconType: 'ios-arrow-down'
        }
    },
    methods: {
        iconClick(e) {
            let _name = e.currentTarget.getAttribute('name');
            if(_name == 'ios-arrow-down') {
                this.iconType = 'ios-arrow-up';
            } else {
                this.iconType = 'ios-arrow-down';
            }
            this.$emit('iconClick', e, _name);
        }
    }
}
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
#detailHead {
    display: inline-block;
    width: 100%;
    p {
        width: 100%;
    }
    .title {
        margin: 7.5px 0;
        height: 25px;
        max-width: 800px;
        font-weight: 700;
        color: #333;
        border-left: 7px solid #2d8cf0;
        line-height: 25px;
        text-indent: 10px;
    }
    .sub-title {
        // margin: 0 0 10px 0px;
        height: 30px;
        font-size: 13px;
        color: #515a6e;
        font-weight: 700;
        background: #f3f3f3;
        border:1px solid #ddd;
        line-height: 30px;
        text-indent: 10px;   
    }
    .btn-group {
        margin-top: 5px;
        vertical-align: top;

    }
    .sub-title.isClick {
        // margin-bottom:10px;
        .ivu-icon {
            cursor: pointer;
        }
    }
}
</style>
