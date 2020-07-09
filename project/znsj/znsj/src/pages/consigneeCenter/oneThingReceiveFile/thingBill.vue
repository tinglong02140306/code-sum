/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-10 15:30:47
 * @description 一件事收件-事项清单
 */
<template>
    <div id="materialVerification">
        <br>
        <div class="nav-wrap">
            <slideNav :step="step" :status="navStatus"></slideNav>
        </div>
        <div class="material-verification-wrap thing-bill-wrap">
            <div class="form-item">
                <!-- 头部标题部分 -->
                <div class="head">
                    <detailHead :titles="titles"></detailHead>
                </div>
                <!-- 主要内容 -->
                <div class="content">
                    <div class="table-wrap">
                        <Table border :columns="verTable" :data="verData"></Table>
                    </div>
                </div>
            </div>

            <!-- 按钮部分 -->
            <div class="btn-wrap">
                <i-button class="step mr10" @click="handleLast">上一步</i-button>
                <i-button class="step" type="primary" @click="handleNext">下一步</i-button>
            </div>
        </div>
        <!-- <div class="nav-wrap">
            <slideNav :step="step" :status="navStatus"></slideNav>
        </div> -->
    </div>
</template>
<script>
import util from "@/api";
import slideNav from "@/components/common/slideNav2";
import detailHead from "@/components/common/detailHead";   // 公共头部
export default {
    param: {
        type: Object,
        default: {}
    },
    components: {
        slideNav,
        detailHead
    },
    data() {
        return {
            titles: '',
            // 导航面板的状态
            step: 0,
            navStatus: 1,
            verTable: [
                {
                    type: 'index',
                    title: '序号',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '事项名称',
                    key: 'matterName'
                },
                {
                    title: '部门',
                    key: 'deptName'
                },
                {
                    title: '承诺时限',
                    key: 'commitTime'
                }
            ],
            verData: [

            ]
        }
    },
    methods: {
        init() {
            this.matterialList();
        },
        handleNext() {
            this.$emit('go', 'caseGuidance',{flag: false, initCaseFlag: true});
        },
        handleLast() {
            this.$emit('go', 'oneThingGuidance');
        },
        //创建事项收件（单/多事项）
        matterialList() {
            let $this = this;
            util.ajaxMerPost('/znsj-web/consignee/event/selectMatterList', {
                eventReceiptNo: this.$parent.param.eventReceiptNo
            }, function (res) {
                let matterList = res.data;
                $(matterList).each(function(iddex, obj){
                    if(obj.commitTime && obj.commitTime != '即办') {
                        obj.commitTime = obj.commitTime + '工作日';
                    } else {
                        obj.commitTime = '即办';
                    }
                });
                $this.verData = matterList;
            }, function (res) {

            }, this);
        }
    },
    mounted() {
        this.titles = this.$parent.param.eventsTitle;
        this.matterialList();
    }
}
</script>
<style lang="less">
#materialVerification {
    width: 100%;
    min-width: 1000px;
    // height: 100%;
    // padding-left:20px;
    overflow-x: hidden;
    br {
        display: none !important;
    }
    .thing-bill-wrap {
        padding: 0px 100px 20px 20px !important;
    }
    .material-verification-wrap {
        width: 100%;
        height: 100%;
        
        background: #fff;
        overflow-y: auto;
        overflow-x: hidden;
        .head {
            overflow: hidden;
        }
        // 主体内容
        .content {
            width: 100%;
            // padding-left: 15px;
            font-size: 12px;
            color: #333;
            .verification-tips {
                text-align: right;
                color: #169bd5;
            }
        }

        // 按钮部分
        .btn-wrap {
            width: 100%;
            height: 60px;
            text-align: right;
            line-height: 60px;
            .btn-prev {
                margin-right: 15px;
                color: #666;
                background-color: #d7d7d7;
                border-color: #d7d7d7;
            }
        }
    }

}
</style>
