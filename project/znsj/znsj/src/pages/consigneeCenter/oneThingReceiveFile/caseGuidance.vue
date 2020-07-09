/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-15 16:58:13
 * @description 一件事收件-情形引导
 */
<template>
    <div id="caseGuidance" class="case-guidance-common">
        <!-- 头部标题部分 -->
        
        <div class="radio-wrap">
            <div class="nav-wrap">
                <slideNav :step="step" :status="navStatus" ref="slideNav"></slideNav>
            </div>
            <div class="radio-group switch-navigate mt10" style="margin-left:20px">
                <Icon type="ios-arrow-back" @click="scrollLast" v-if="showBtn" />
                <div class="radio-sub-wrap" :style="{width: subWrapWid}" style="margin-right:-15px">
                    <div class="radio-sub" :style="{width: subWid + 100}">
                        <span class="switch-default ell font-max" v-for="(tab ,index) in matterList" :class="{cur:iscur==index, last: index+1==matterList.length}" :title="tab.matterName">{{tab.matterName}}</span>
                    </div>
                </div>
                <Icon type="ios-arrow-forward" @click="scrollNext" v-if="showBtn" />
            </div>
            <div class="mtb10"></div>
            <div>
                <caseGuidanceCommon v-for="(tab ,index) in matterList" v-show="iscur==index" @next="next" @last="last" @statusChange="statusChange" :tjData="matterList[index].preConditionList" :formDynamic="matterList[index]" :showLastBtn="showLastBtn" :receiptNo="receiptNo"></caseGuidanceCommon>
            </div>
        </div>
        
    </div>
</template>
<script>
import util from "@/api";
import slideNav from "@/components/common/slideNav2";
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
            //是否显示按钮
            showBtn: false,
            // 是否显示上一步按钮
            showLastBtn: true,

            distance: 0,
            tabView: 'caseGuidanceCommon',
            titles: '公司变更登记',
            // 导航面板的状态
            step: 1,
            navStatus: '1',
            subWid: '100%',
            subWrapWid: '96%',
            iscur: 0,
            matterList: [{
                preConditionList: [],
                situationList: []
            }],
            receiptNo: ''
        }
    },
    methods: {
        // 下一步
        next(val) {
            let len = this.matterList.length;
            if (this.iscur < len - 1) {
                this.iscur++;
            } else {
                this.$emit('go', val, {
                    receiptNo: this.receiptNo
                });
            }
        },
        //上一步
        last() {
            if (this.iscur > 0) {
                this.iscur--;
            } else {
                this.$emit('go', 'thingBill');
            }
        },
        //页面导航状态改变
        statusChange() {
            let $this = this;
            this.step = 2;
            this.navStatus = 1;
            setTimeout(function () {
                if($this.$refs.slideNav && $this.$refs.slideNav.initNav) {
                    $this.$refs.slideNav.initNav();
                }  
            }, 0);
        },
        tabChange: function () {
            this.tabView = 'caseGuidanceCommon';
        },
        scrollLast() {
            this.distance -= 100;
            $('.radio-sub-wrap').scrollLeft(this.distance);
            if (this.distance < 0) {
                this.distance = 0;
            }
        },
        scrollNext() {
            let maxWid = this.subWid.substr(0, this.subWid.length - 2) - this.subWrapWid.substr(0, this.subWid.length - 2);
            this.distance += 100;
            $('.radio-sub-wrap').scrollLeft(this.distance);
            if (this.distance > maxWid) {
                this.distance = maxWid;
            }
        },
        cupWidth() {
            let len = this.matterList.length,
                distanceRight = 0,
                allWid = $('.radio-group').length > 0 ? $('.radio-group')[0].offsetWidth : 0,
                subWrapWid = 0,
                subWid = 0,
                $dom = $('.switch-default');
            for (let i = 0; i < len; i++) {
                subWid +=  $($dom[i]).length > 0 ? $dom[i].offsetWidth : 0;
                distanceRight += 5;
            }
            if (subWid > allWid) {
                this.showBtn = true;
                subWrapWid = allWid - 36;
            } else {
                this.showBtn = false;
                subWrapWid = allWid;
            }
            this.subWrapWid = subWrapWid + 'px';
            this.subWid = subWid + 1 + distanceRight - 5 + 'px';

        },
        //创建事项收件（单/多事项）
        getMatter() {
            let $this = this;
            util.ajaxMerPost('/znsj-web/consignee/event/situtionGuidListNew', {
                eventReceiptNo: this.$parent.param.eventReceiptNo
            }, function (res) {
                let matterList = res.data.matterList,
                    len = matterList.length;
                for (let k = 0; k < len; k++) {
                    matterList[k].situationList = $this.handData(matterList[k].situationList);
                }
                $this.receiptNo = res.data.receiptNo;
                $this.matterList = matterList;
                setTimeout(() => {
                    $this.$nextTick(function() {
                        $this.cupWidth();
                    });
                }, 0);
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
        },
        initData() {
            // tinglong 点击下一步不请求 不重新请求数据
            this.getMatter();
        },
    },

    mounted() {
        let $this = this;
        window.onresize = () => {
            $this.$nextTick(function() {
                $this.cupWidth();
            });
        }
    },
    created() {
        this.getMatter();
    }
}
</script>
<style lang="less">
#caseGuidance {
    * {
        box-sizing: border-box;
    }
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
    .radio-group {
        margin: 15px 100px 0 20px;
        font-size: 0;
        .switch-default {
            padding: 0 10px;
            margin-right: 5px;
            display: inline-block;
            height: 35px;
            max-width: 250px;
            background-color: #eef1f7;
            line-height: 35px;
            text-align: center;
            cursor: pointer;
            color: #515a6e;
            box-sizing: border-box;
            &.cur {
                margin-bottom: -1px;
                background-color: #fff;
                border-top: 3px solid #2d8cf0;
                border-left: 1px solid #e4e4e4;
                border-right: 1px solid #e4e4e4;
                line-height: 33px;
                color: #515a6e;
            }
            &.last {
                margin-right: 0px;
            }
        }
        .ivu-icon {
            float: left;
            line-height: 36px;
            font-size: 18px;
            cursor: pointer;
            &.ivu-icon-ios-arrow-forward {
                float: right;
            }
        }
        .radio-sub-wrap {
            float: left;
            display: inline-block;
            overflow: hidden;
            height: 36px;
        }
        &.switch-navigate {
            // overflow: hidden;
            height: 36px;
            line-height: 36px;
            border-bottom: 1px solid #e4e4e4;
        }
    }
    .mtb10 {
        margin: 10px 0;
    }
}
</style>
