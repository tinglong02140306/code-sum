/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-06 20:31:43
 * @description 单收件引导
 */
<template>
    <div id="caseGuidance" class="case-guidance-common">
        
        <!-- 头部标题部分 -->
        <div class="case-guid-head">
            <div class="nav-wrap">
                <slideNav ref="slideNav" :step="step" :status="navStatus"></slideNav>
            </div>
            <detailHead :titles="titles" :isBackShow="true"></detailHead>
        </div>
        
        <caseGuidanceCommon @next="next" @statusChange="statusChange" :tjData="matterList.preConditionList" :formDynamic="matterList" :receiptNo="receiptNo"></caseGuidanceCommon>

        
    </div>
</template>
<script>
import util from "@/api";
import slideNav from "@/components/common/slideNav";
import detailHead from "@/components/common/detailHead";   // 公共
import caseGuidanceCommon from "@/pages/consigneeCenter/guideCommon/caseGuidanceCommon";
export default {
    components: {
        slideNav,
        caseGuidanceCommon: caseGuidanceCommon,
        detailHead: detailHead
    },
    data() {
        return {
            titles: '公司变更登记',
            // 导航面板的状态
            step: 0,
            navStatus: 1,
            matterList: {
                preConditionList: [],
                situationList: []
            },
            receiptNo: ''
        }
    },
    methods: {
        next(val) {
            this.$emit('go', val, {
                receiptNo: this.receiptNo
            });
        },
        //页面导航状态改变
        statusChange() {
            let $this = this;
            this.step = 1;
            this.navStatus = 1;
            setTimeout(function () {
                if ($this.$refs.slideNav && $this.$refs.slideNav.initNav) {
                    $this.$refs.slideNav.initNav();
                }
            }, 0);
        },
        //创建事项收件（单/多事项）
        getMatter() {
            let $this = this;
            util.ajaxObjPost('/znsj-web/consignee/matter/createNew', {
                matterIds: $this.$parent.param.matterIds,
                type: $this.$parent.param.type
            }, function (res) {
                let matterList = res.data.matterList,
                    situationList = matterList[0].situationList;
                situationList = $this.handData(situationList);
                $this.receiptNo = res.data.receiptNo;
                $this.matterList = matterList[0];
                $this.titles = matterList[0].matterName;
            }, function (res) {

            }, this);
        },
        //数据处理
        handData(data) {
            var situationList = data,
                len = situationList.length;
            for (let i = 0; i < len; i++) {
                if (situationList[i].isMulti == 2) {
                    situationList[i].isMultiTrue = true;
                    situationList[i].value = [];
                    for (let j = 0; j < situationList[i].answerList.length; j++) {
                        situationList[i].value.push(situationList[i].answerList[j].situationId);
                    }
                } else {
                    if (situationList[i].isMulti == 0) {
                        for (let j = 0; j < situationList[i].answerList.length; j++) {
                            if (situationList[i].answerList[j].defaultSelect == 1) {
                                situationList[i].value = situationList[i].answerList[j].situationId;
                                situationList[i].disaAns = true;
                            }
                        }
                    } else {
                        situationList[i].value = [];
                        for (let k = 0; k < situationList[i].answerList.length; k++) {
                            if (situationList[i].answerList[k].defaultSelect == 1) {
                                situationList[i].value.push(situationList[i].answerList[k].situationId);
                                situationList[i].disaAns = true;
                            }
                        }
                    }
                    situationList[i].isMultiTrue = false;
                }
                if(situationList[i].answerClassifyList && situationList[i].answerClassifyList.length > 0) {
                    situationList[i].answerClassifyList = this.handData(situationList[i].answerClassifyList);
                }
            }
            return situationList;
        }
    },
    created() {
        this.getMatter();
    }
}
</script>
<style lang="less" scoped>
#caseGuidance {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // padding-left:20px;
    // padding-top:20px;
    .case-guid-head {
        padding: 0px 0px 0 20px;
    }
    .nav-wrap{
        margin-left:-20px;
    }

}
#caseGuidanceCommon .case-guidance-wrap .tj-content {
    padding-left: 15px; 
    font-size: 12px;
    color: #333;
    
}
</style>
