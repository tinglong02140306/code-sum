/*
 * @Author: tinglong 
 * @Date: 2018-09-29 08:34:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-10-10 16:18:13
 * @description 导航面板
 */
<template>
	<div id="slideNav">
        <a href="javascript:;" class="nav-title item">导航</a>
        <div class="itme-list" v-for="(one,index) in navList" :key="index">
            <a href="javascript:;" class="item item-step">
                <i class="icon" :class="{'icon-underway': one.status=='1', 'icon-complate': one.status=='2', 'icon-nothandle':one.status=='3'}"></i>
                <span v-text="one.title"></span>
            </a>
            <!-- <a href="javascript:;" class="item item-step">
                <i class="icon icon-nothandle"></i>
                <span>填问卷</span>
            </a>
            <a href="javascript:;" class="item item-step">
                <i class="icon icon-underway"></i>
                <span>核材料</span>
            </a>
            <a href="javascript:;" class="item item-step">
                <i class="icon icon-underway"></i>
                <span>填信息</span>
            </a>
            <a href="javascript:;" class="item item-step border-none">
                <i class="icon icon-nothandle"></i>
                <span>收材料</span>
            </a> -->
        </div>        
	</div>
</template>
<script>
export default {

    // step 第几步 status  当前状态
    // 0:看条件, 1: 填问卷, 2:核材料, 3:填信息, 4：收材料
    // 状态 1：正在办理， 2：已完成， 3: 尚未办理
    props: ['step', 'status'],  
	data() {
		return {  
            navList: [],
		}
    },
    methods: {
        initNav: function() {
            var title;
            this.step = typeof this.step == 'string' ? parseInt(this.step) : this.step;
            this.navList=[];
            for(var i = 0; i < 5; i++) {
                title = this.judgeCurState(i);
                if(i == this.step) { // 当前状态   区别看条件
                    this.navList.push({
                        title: title,
                        status: this.status
                    });
                }else if(i < this.step){
                    // 已完成状态
                    this.navList.push({
                        title: title,
                        status: '2'
                    });
                }else if(i > this.step) {
                    // 尚未办理状态
                    this.navList.push({
                        title: title,
                        status: '3'
                    });
                }
            }
        },
        judgeCurState: function(step) {
            var title;
            switch(step) {
                case 0:
                    title = '看条件';
                    break;
                case 1:
                    title ='填问卷';
                    break;
                case 2:
                    title = '核材料';
                    break;
                case 3:
                    title = '填信息';
                    break;
                case 4:
                    title ='收材料';
                    break;
                default:
                break; 
            }
            return title;
        }
    },

    // 初始化完页面后 自动调用
    mounted() {
        this.initNav();
    }
}
</script>
<style lang="less" scoped>
#slideNav {
    position: fixed;
    // top: 40px;
    top: 104px;
    right: 20px;
    width: 68px;
    min-height: 300px;
    border-radius: 6px;
    border: 1px solid #e4e4e4;
    .item {
        display: inline-block;
        height: 74px;
        width: 100%;
        background: #fff;
        text-align: center;
    }
    .nav-title {
        font-size: 16px;
        color: #fff;
        font-weight: 700;
        background: #ff8414;
        border-radius: 6px 6px 0 0;
        line-height: 64px;
        text-align: center;    
    }
    .item-step {
        border: 4px solid transparent;
        border-top: none;
        border-bottom: 1px solid #e4e4e4;
        span,
        i {
            display: inline-block;
            width: 100%;
        }
        span {
            font-size: 13px;
            color: #333;
        }
        .icon {
            height: 45px;
        }
        .icon-underway {
            background: url(../../assets/images/panel/icon-underway.png) no-repeat;
            background-position: center bottom;
            background-size: 30px 30px;
        }
        .icon-complate {
            background: url(../../assets/images/panel/icon-complate.png) no-repeat;
            background-position: center bottom;
            background-size: 30px 30px;
        }
        .icon-nothandle {
            background: url(../../assets/images/panel/icon-nothandle.png) no-repeat;
            background-position: center bottom;
            background-size: 30px 30px;
        }
    }
    .border-none {
        border: none;
    }
    
}
</style>
