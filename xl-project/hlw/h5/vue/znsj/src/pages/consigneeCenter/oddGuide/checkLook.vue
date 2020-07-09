<template>
    <div class="m-wrap">
        <span class="select-a" @click="showSelect($event)">查看</span>
        <Icon v-if="showIcon" type="md-image" style="color:#2D8cF0;cursor:pointer;" @click="handleSelect($event)"/>
        <div class="select-wrap hide">
            <p v-for="(item ,index) in listData" :class="{select: item.contentAttch}" @click="jump(item)">{{index + 1}}、{{item.matterialName}}</p>
        </div>
        <div class="hover-wrap hide">
            <div>
                <ul class="clearfix tab-wrap">
                    <li class="fl ell" v-for="(item ,index) in listData" :class="{select: index==current}" @click="changeTab(index)" :title="item.matterialName">{{item.matterialName}}</li>
                </ul>
                <div class="hover-main">
                    <div v-for="(item ,index) in listData" v-if="index==current">
                        {{item.contentTxt}}
                    </div>
                </div>
            </div>
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
.hover-wrap {
    position: absolute;
    top: -88px;
    right: 79%;
    padding: 20px;
    background: #fff;
    z-index: 999999;
    text-align: left;
    border: 1px solid #ddd;
    border-radius: 10px;
}
.hover-wrap .tab-wrap {
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
}
.hover-wrap .hover-main {
    min-width: 400px;
    height: 250px;
    overflow-y: auto;
}
.tab-wrap li {
    margin-right: 20px;
    height: 25px;
    max-width: 100px;
    line-height: 25px;
    cursor: pointer;
}
.tab-wrap li.select {
    border-bottom: 1px solid #2d8cf0;
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
        'row'
    ],
    data() {
        return {
            showWrap: false,
            showSleectWrap: false,
            listData: [],
            showIcon: true,
            current: 0
        }
    },
    mounted() {
        let temp = [];
        for(let i = 0; i < this.row.length; i++) {
            if(this.row[i].contentTxt) {
                temp.push(this.row[i]);
            }
        }   
        this.listData = temp;
        let num = 0;
        for(let i=0;i<this.listData.length;i++) {
            if(this.listData[i].contentAttch) {
                num++;
            }
        }
        if(num == 0) {
            this.showIcon = false;
        }
    },
    methods: {
        changeTab(index) {
            this.current = index;
        },
        showSelect(e) {
            $(e.target).siblings('.hover-wrap').toggleClass('hide');
        },
        handleSelect(e) {
            if (this.row && this.row.length > 1) {
                $('.m-wrap .select-wrap').addClass('hide');
                $(e.target).siblings('.select-wrap').toggleClass('hide');
            } else {
                util.openFullWindow(this.row);
            }
        },
        jump(data) {
            if (data.contentAttch) {
                util.openFullWindow(data.contentAttch);
            }
        }
    }
}
</script>