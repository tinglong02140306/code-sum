<template>
    <div class="m-wrap">
        <span class="select-a" @click="handleSelect($event)">查看</span>
        <div class="select-wrap hide">
            <p v-for="(item ,index) in listData" :class="{select: item.sampleUrl}" @click="jump(item)">{{index + 1}}、{{item.matterialName}}</p>
        </div>
    </div>
</template>
<style>
.m-wrap {
    position: relative;
}
.select-a {
    position: relative;
    color: #2d8cf0 !important;
    cursor: pointer;
    z-index: 99;
}
.select-wrap {
    position: absolute;
    max-width: 250px;
    min-width: 150px;
    top: -20px;
    left: 72%;
    padding: 20px;
    background: #fff;
    z-index: 999999;
    text-align: left;
    border: 1px solid #ddd;
    border-radius: 10px;
}
.select-wrap .select {
    color: #2d8cf0;
    cursor: pointer;
}
</style>
<script>
import util from "@/api";
export default {
    name: 'selectLook',
    props: [
        'row', 'type', 'showWrap'
    ],
    data() {
        return {
            listData: []
        }
    },
    mounted() {
        this.listData = this.row;
    },
    methods: {
        handleSelect(e) {
            if (this.row && this.row.length > 1) {
                $('.m-wrap .select-wrap').addClass('hide');
                $(e.target).siblings('.select-wrap').toggleClass('hide');
            } else {
                util.openFullWindow(this.row);
            }
        },
        jump(data) {
            if (data.sampleUrl) {
                util.openFullWindow(data.sampleUrl);
            }
        }
    }
}
</script>