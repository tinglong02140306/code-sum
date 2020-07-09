/*
 * @Author: tinglong 
 * @Date: 2018-12-12 10:34:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-26 19:26:07
 * @description 导航面板
 */
<template>
    <div id="serverSetCommon">
        <Steps :current="step">
            <Step title="数据模板配置"></Step>
            <Step title="数据服务配置"></Step>
            <Step title="功能服务配置"></Step>
        </Steps>
        <keep-alive>
            <component :is="tabView" @go="go" :param="param" :showGoBtn="showGoBtn" @closeDialog="closeDialog"></component>
        </keep-alive>
    </div>
</template>
<script>
import dataTemplateSet from "@/components/serverSet/dataTemplateSet";   // 数据模板配置
import dataServerSet from "@/components/serverSet/dataServerSet";   // 数据服务配置
import functionServerSet from "@/components/serverSet/functionServerSet";   // 功能服务配置

export default {
    props: {
        param: {
            type: Object
        }
    },
    components: {
        dataTemplateSet: dataTemplateSet,
        dataServerSet: dataServerSet,
        functionServerSet: functionServerSet
    },
    data() {
        return {
            showGoBtn: true,//是否显示上一步、下一步按钮

            step: 0,  //当前步骤

            tabView: 'dataTemplateSet',
            handleParam: {},

            jumpFlag: false //判断是否有数据，支持跳转
        }
    },
    methods: {
        go(type) {
            if (type == 'next') {
                this.step++;
                this.switchFun(this.step, true);
            } else {
                this.step--;
                this.switchFun(this.step, true);
            }
        },
        switchFun(index, flag) {
            let that = this;
            if (!this.jumpFlag) {  //判断树结构是否有数据
                return false;
            }
            if (!flag) {    //判断是否直接点击步骤条
                let $dom = $(index.target),
                    $index = $dom.closest('.ivu-steps-item').index();
                index = $index;
            }
            setTimeout(function () {
                that.step = index;
                if (that.step == 0) {
                    that.tabView = 'dataTemplateSet';
                } else if (that.step == 1) {
                    that.tabView = 'dataServerSet';
                } else {
                    that.tabView = 'functionServerSet';
                }
            }, 20);
        },
        bindEvnet() {
            $('#serverSetCommon').on('click', '.ivu-steps-head, .ivu-steps-title', this.switchFun);
        },
        closeDialog() {
            this.$emit('closeDialog');
        }
    },
    mounted() {
        this.bindEvnet();
    }
}
</script>
<style lang="less">
#serverSetCommon {
    .el-row {
        padding: 0;
    }
    .ivu-steps {
        margin: 15px 0px 15px 23px;
        width: auto;
        .ivu-steps-head {
            top: -2px;
            cursor: pointer;
        }
        .ivu-steps-title {
            cursor: pointer;
        }
    }
    .ivu-tree-children {
        overflow: visible !important;
        height: auto !important;
        font-size: 14px;
    }
    .el-table td .cell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .el-table th {
        background-color: #fff;
    }
    .ivu-tree-arrow-open i {
        -ms-transform: rotate(90deg);
    }
    .ivu-tree-arrow i {
        -ms-transition: all 0.2s ease-in-out;
    }
    // 弹框按钮样式覆盖
    .footer {
        padding-right: 30px;
        background: #fff;
        text-align: right;
        line-height: 50px;
        border: none;
        .el-button {
            padding: 8px 15px;
            width: 120px;
        }
    }
}
</style>
