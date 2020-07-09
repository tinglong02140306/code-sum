/*
 * @Author: lhqin 
 * @Date: 2018-11-06 19:41:21 
 * @Last Modified by: tinglong
 * @Last Modified time: 2018-11-09 11:09:22
 * @Description: 页签导航 
 */

<template>
    <div id="tabNavigate">
        <ul class="tab-nav clearfix">
            <li class="font-min" v-for="(item, index) in tabs" :label="index" :key="index">
                <span :title="item" :class="{'fw': index == tabs.length - 1}">{{ item }}</span>
                <i class="font-min icon" :class="{'hide': index == tabs.length - 1}">/</i>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        tabs: {
            type: Array
        }
    },
    data() {
        return {}
    },
    methods: {

    }
}
</script>
<style lang="less" scoped>
#tabNavigate {
    .tab-nav {
        padding-left: 10px;
        height: 42px;
        color: #464c5b;
        background: #edf0f6;
        line-height: 42px;
        li {
            display: inline-block;
        }
        .icon {
            margin: 0 8px 0 4px;
        }
        .fw {
            font-weight: 700;
        }
    }
}
</style>
