/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-15 16:53:30
 * @description 收件引导公共部分
 */
<template>
    <div id="caseGuidanceCommon">
        <div class="case-guidance-wrap">
            <!-- 头部标题部分 -->
            <div ref="slideClose" class="head">
                <detailHead :subTitle="tjSubTitle" :isClick="headIsClick" @iconClick="iconClick"></detailHead>
            </div>
            <!-- 受理条件内容 -->
            <div id="tjTable" class="tj-content">
                <div class="table-wrap">
                    <Table border :columns="tjTable" :data="tjData"></Table>
                </div>
            </div>
            <!-- 头部标题部分 -->
            <div style="margin-top: 10px;" class="head" v-if="formDynamic.situationList.length !=0">
                <detailHead :subTitle="qxSubTitle"></detailHead>
            </div>
            <!-- 情形引导内容 -->
            <div class="qx-content" v-if="formDynamic.situationList.length !=0" @mouseover="getDom($event)">
                <Form ref="formDynamic" :model="formDynamic" label-position="top">
                    <formItemNew :formData="formDynamic.situationList" @eventChange="eventChange"></formItemNew>
                </Form>
            </div>
            <!-- 按钮部分 -->
            <div class="btn-wrap">
                <i-button class="step mr10" @click="handleLast" v-show="showLastBtn">上一步</i-button>
                <i-button class="step" type="primary" @click="handleSubmit('formDynamic')">下一步</i-button>
            </div>
        </div>
    </div>
</template>
<script>
import util from "@/api";
import slideNav from "@/components/common/slideNav";
import detailHead from "@/components/common/detailHead";   // 公共头部
import formItemNew from "@/pages/consigneeCenter/guideCommon/formItemNew";
export default {
    props: {
        tjData: {
            type: Array,
            default: [{
                judgeCond: '完成网报（涉及变更股东及注册资本的不用网报），涉及名称调整的完成网上名称核准',
                judgeStd: '浙江省工商全全程电子化登记平台（http://www.wsdj.zjaic.gov.cn/)—登记注册—立即注册账号（个人用户登录）—企业登记-企业变更—在页面选择相对应的业务（填写完毕后保存并提交）'
            }]
        },
        formDynamic: {
            type: Object,
            default: {
                situationList: []
            }
        },
        showLastBtn: {
            type: Boolean,
            default: false
        },
        receiptNo: {
            type: String,
            default: ''
        }
    },
    components: {
        slideNav,
        detailHead,
        formItemNew
    },
    data() {
        return {
            domScrollFlag: true,
            curDom: '',   //当前dom

            formData: [],
            checkboxData: '',  //缓存复选框的值
            showMes: false,
            tjSubTitle: '受理条件',
            qxSubTitle: '情形引导',
            headIsClick: true,
            nowLen: [],
            currentId: '',
            tjTable: [
                {
                    type: 'index',
                    title: '序号',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '判断条件',
                    key: 'judgeCond',
                    width: 560
                },
                {
                    title: '判断标准',
                    key: 'judgeStd',
                    minWidth: 560
                }
            ]
        }
    },
    methods: {
        //列表收缩事件
        iconClick(e, val) {
            $(e.currentTarget).closest('.head').next().slideToggle();
        },
        getDom(e) {
            this.curDom = $(e.currentTarget);
        },
        //下一步提交
        handleSubmit(name) {
            let flag = this.verFrom(this.formDynamic.situationList);
            if (flag) {
                let obj = this.saveDataHandle();
                if (obj.matterList[0].situationList.length > 0) {
                    this.saveCond(obj);
                } else {
                    this.$emit('next', 'materialVerification')
                }
            }
        },
        //上一步
        handleLast() {
            this.$emit('last');
        },
        // 表单递归校验
        verFrom(form) {
            let i,
                len = form.length;
            for (i = 0; i < len; i++) {
                if (typeof form[i].value == 'object' && form[i].value.length == 0) {
                    this.$Message.error('请选择' + form[i].classifyName);
                    return false;
                } else if (typeof form[i].value == 'string' && form[i].value == '') {
                    this.$Message.error('请选择' + form[i].classifyName);
                    return false;
                } else if (form[i].value == undefined) {
                    this.$Message.error('请选择' + form[i].classifyName);
                    return false;
                }
                if (form[i].answerClassifyList && form[i].answerClassifyList.length != 0) {
                    let selectFlag = this.verFrom(form[i].answerClassifyList);
                    if (!selectFlag) {
                        return false;
                    }
                }
            }
            return true;
        },
        //点击答案返回的情形数据进行处理，处理全选、选中的效果
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
                if (situationList[i].answerClassifyList && situationList[i].answerClassifyList.length > 0) {
                    situationList[i].answerClassifyList = this.handData(situationList[i].answerClassifyList);
                }
            }
            return situationList;
        },
        //点击答案的时候触发的事件
        classAnsList(obj, index) {
            obj.answerObj = '';
            if (typeof obj.value != 'object') {
                obj.answerObj = obj.value;
            } else {
                for (let i = 0; i < obj.value.length; i++) {
                    obj.answerObj += obj.value[i] + ',';
                }
                obj.answerObj = obj.answerObj.substring(0, obj.answerObj.length - 1);
            }
            if (!obj.answerObj) {
                this.getSituationId(obj, this.formDynamic.situationList, []);
            } else {
                this.getAnswer(obj);
            }
        },
        //给situationId相同层级的数据，赋请求到答案的值
        getSituationId(obj, situationListData, data) {
            let $this = this,
                situationList = situationListData;
            for (let i = 0; i < situationList.length; i++) {
                if (situationList[i].situationId == obj.situationId) {
                    // situationList[i].answerClassifyList = data;
                    if (data.length == 0 || !situationList[i].answerClassifyList || situationList[i].answerClassifyList.length == 0) {
                        situationList[i].answerClassifyList = data;
                    } else {
                       situationList[i].answerClassifyList = this.checkBoxHandle(situationList[i].answerClassifyList, data);
                    }
                    return false;
                }
                if (situationList[i].answerClassifyList && situationList[i].answerClassifyList.length != 0) {
                    this.getSituationId(obj, situationList[i].answerClassifyList, data);
                }
            }
        },
        // 处理复选框点击事件
        checkBoxHandle(answerClassifyList, data) {
            let len = answerClassifyList.length,
                dataLen = data.length,
                dataTemp = [],
                temp = 0;
            for (let j = 0; j < dataLen; j++) {
                for (let i = 0; i < len; i++) {
                    if (answerClassifyList[i].situationId == data[j].situationId) {
                        dataTemp.push(JSON.parse(JSON.stringify(answerClassifyList[i])));
                    }
                }
            }
            for(let k = 0; k < dataLen; k++) {
                let numFlag = 0;
                for (let i = 0; i < len; i++) {
                    if (answerClassifyList[i].situationId != data[k].situationId) {
                        numFlag++;
                    }
                }
                if(numFlag >= len) {
                    dataTemp.push(data[k]);
                }
            }
            return dataTemp;
        },
        //点击答案进行的请求
        getAnswer(obj) {
            let $this = this;
            util.ajaxObjPost('/znsj-web/situation/classAnsListNew', {
                "callsifyCode": obj.code,
                "objectCode": obj.objectCode,
                "objectVersion": obj.objectVersion,
                "situationId": obj.answerObj,
                "type": "1"
            }, function (res) {
                let situationList = res.data;
                situationList = $this.handData(situationList);
                $this.getSituationId(obj, $this.formDynamic.situationList, situationList);
            }, function (res) {

            }, this);
        },
        //保存情形引导递归处理
        saveDataObj(situationListTemp) {
            let dataObj = JSON.parse(JSON.stringify(situationListTemp)),
                len = situationListTemp.length;
            for (let i = 0; i < len; i++) {  //处理答案数据
                dataObj[i].callsifyCode = situationListTemp[i].code;
                dataObj[i].situationId = situationListTemp[i].situationId;
                dataObj[i].sortNo = i;
                dataObj[i].answerList = [];
                if (typeof situationListTemp[i].value == 'object') {
                    for (let j = 0; j < situationListTemp[i].value.length; j++) {
                        for (let k = 0; k < situationListTemp[i].answerList.length; k++) {
                            if (situationListTemp[i].answerList[k].situationId == situationListTemp[i].value[j]) {
                                dataObj[i].answerList.push({
                                    situationId: situationListTemp[i].value[j],
                                    answerCode: situationListTemp[i].answerList[k].answerCode,
                                    isSelect: 1
                                });
                            }
                        }
                    }
                } else {
                    for (let k = 0; k < situationListTemp[i].answerList.length; k++) {
                        if (situationListTemp[i].answerList[k].situationId == situationListTemp[i].value) {
                            dataObj[i].answerList.push({
                                situationId: situationListTemp[i].value,
                                answerCode: situationListTemp[i].answerList[k].answerCode,
                                isSelect: 1
                            });
                        }
                    }
                }
                if (situationListTemp[i].answerClassifyList && situationListTemp[i].answerClassifyList.length != 0) {
                    dataObj[i].answerClassifyList = this.saveDataObj(situationListTemp[i].answerClassifyList);
                }
            }
            return dataObj;
        },
        //保存情形引导数据处理
        saveDataHandle() {
            let obj = {},
                situationList = [];
            obj.receiptNo = this.receiptNo;
            situationList = this.saveDataObj(this.formDynamic.situationList);
            obj.matterList = [{  //处理事件数据
                id: this.formDynamic.id,
                matterCode: this.formDynamic.matterCode,
                matterVersion: this.formDynamic.matterVersion,
                situationList: situationList
            }];

            return obj;
        },
        //保存情形引导
        saveCond(obj) {
            let $this = this;
            util.ajaxObjPost('/znsj-web/consignee/matter/saveCondNew', obj, function (res) {
                $this.$emit('next', 'materialVerification')
            }, function (res) {
                $this.$Message.error(res.data.errMsg);
            }, this);
        },
        eventChange(data, e) {
            debugger
            this.classAnsList(data);
            this.curDom.closest('.case-guidance-wrap').children('.head').eq(0).next().slideUp();
            if (this.domScrollFlag) {
                this.curDom.closest('.case-guidance-common').scrollTop(0);
                this.domScrollFlag = false;
            }
            this.$emit('statusChange');
        }
    },
    mounted() {
        this.domScrollFlag = true;
    }
}
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.ivu-table-hide {
    opacity: 1;
}
#caseGuidanceCommon {
    .case-guidance-wrap {
        width: 100%;
        height: 100%;
        padding: 0 100px 20px 20px;
        overflow-x: hidden;
        background: #fff;
        .head {
            overflow: hidden;
            margin-bottom:-1px;
        }

        // 前置条件-主体内容
        .tj-content {
            // padding-left: 21px;
            // margin-left:-21px;
            font-size: 12px;
            color: #333;
            .table-wrap {
                margin-bottom: 10px;
                width: 100%;
            }
        }
        //情形引导-主体内容
        .qx-content {
            // padding-left: 15px;
            font-size: 12px;
            color: #333;
            .ivu-form {
                padding: 15px;
                border: 1px solid #dcdee2;
                border-top:none;
                .ivu-form-item {
                    // padding-bottom: 10px;
                    margin-bottom: 0px;
                    // border-bottom: 1px dashed #dcdee2;
                    // &:last-child {
                    //     padding-bottom: 0;
                    //     margin-bottom: 0;
                    //     border-bottom: 0;
                    // }
                }
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
            .ivu-btn {
                width: 120px;
            }
            .step {
                padding: 0;
                height: 32px;
                line-height: 1;
            }
        }
        table {
            width: auto !important;
        } 
        .ivu-table th{
            text-align: center!important;
        }
    }
}
</style>
