/*
 * @Author: tinglong 
 * @Date: 2018-09-30 14:28:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-10-02 10:41:51
 * @description 公共头部
 */
<template>
    <div id="detailHead">
        <p class="title" v-if="titles">{{titles}}</p>
        <p :class="['sub-title', isClick ? 'isClick' : '']" v-if="subTitle">
            {{subTitle}}
            <Icon :type="iconType" :name="iconType" v-if="isClick" @click="iconClick"/>
        </p>
    </div>
</template>
<script>
export default {
    props: ['titles', 'subTitle', 'isClick'],
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
<style lang="less" scoped>
#detailHead {
    display: inline-block;
    width: 100%;
    p {
        width: 100%;
        text-indent: 10px;
    }
    .title {
        margin: 7.5px 0;
        height: 25px;
        font-size: 14px;
        font-weight: 700;
        color: #333;
        border-left: 7px solid #0099ff;
        line-height: 25px;
    }
    .sub-title {
        margin: 0 0 10px 15px;
        height: 30px;
        font-size: 13px;
        color: #515a6e;
        font-weight: 700;
        background: #f3f3f3;
        line-height: 30px;
    }
    .sub-title.isClick {
        .ivu-icon {
            cursor: pointer;
        }
    }
}
</style>
