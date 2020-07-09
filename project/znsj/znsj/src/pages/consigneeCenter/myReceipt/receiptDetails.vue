/*
 * @Author: kkfan2 
 * @Date: 2018-10-22 14:52:45 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-14 15:50:52
 * @description: 收件详情
 */
<template>
    <div id="receiptDetails">
        <div class="container">
            <!-- <div class="detail-title text-one" :title="res.recObjectName">{{res.recObjectName}}</div> -->
            <div class="detail-title text-one">
                <span class="inline-block detail-title-font ell" :title="res.recObjectName"> {{res.recObjectName}} </span>
                <div class="btn-group ml10 inline-block">
                    <Button size="small" class="cursor-p w80" @click="$router.back(-1)">
                        <i class="iconfont icon-back"></i>
                        <span class="font-min">返回</span>
                    </Button>
                </div>
                <div class="btn-wrap inline-block h30 fr mr10">
                     <!-- v-if="jointStatus == '1'" -->
                    <el-button class="btn h30 step2"  @click="receiptEvt" v-if="jointStatus == '1'">受理</el-button>
                    <el-button class="btn h30 step5" @click="printReceipt">打印回执单</el-button>
                    <el-button class="btn mr10 h30 step5" @click="printCirculation">打印流转单</el-button>
                </div>
            </div>
            <div class="matter">
                <div class="item situation" v-if="res.classifyList != undefined && res.classifyList.length >0">
                    <div class="item-title">办事情形</div>
                    <div class="item-content">
                        <!-- 循环办事情形列表 -->
                        <Form ref="formDynamic" :model="formDynamic" label-position="top">
                            <formItemNew :formData="res.classifyList"></formItemNew>
                        </Form>
                    </div>
                </div>
            </div>
            <div class="item basic-info">
                <div class="item-title">基本信息</div>
                <div class="item-content-wrap">
                    <div class="item-content" v-if="res.applicantType != '1'">
                        <Row class="row">
                            <Col span="10">
                            <Label for="">机构名称：</Label>
                            <span class="text2" :title="res.applicantName">{{res.applicantName}}</span>
                            </Col>
                            <Col span="10">
                            <Label for="">统一社会信用代码：</Label>
                            <span class="text2" :title="res.cardNo">{{res.cardNo}}</span>
                            </Col>
                        </Row>
                        <Row class="row">
                            <Col span="10">
                                <Label for="">委托人身份证号：</Label>
                                <span class="text2" :title="res.trustorIdCard">{{res.trustorIdCard}}</span>
                            </Col>
                            <Col span="10">
                                <Label for="">委托人姓名：</Label>
                                <span class="text2" :title="res.trustorName">{{res.trustorName}}</span>
                            </Col>
                        </Row>
                        <Row class="row">
                            <Col span="10">
                            <Label for="">委托人电话：</Label>
                            <span class="text2" :title="res.trustorPhone">{{res.trustorPhone}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="item-content" v-else>
                        <Row class="row">
                            <Col span="10">
                                <Label for="">申请人证件号码：</Label>
                                <span class="text2" :title="res.cardNo">{{res.cardNo}}</span>
                            </Col>
                            <Col span="10">
                                <Label for="">申请人姓名：</Label>
                                <span class="text2" :title="res.applicantName">{{res.applicantName}}</span>
                            </Col>
                        </Row>
                        <Row class="row">
                            <Col span="10">
                                <Label for="">申请人手机：</Label>
                                <span class="text2" :title="res.applicantPhone">{{res.applicantPhone}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="item-content item-content1">
                        <Row class="row">
                            <Col span="10">
                            <Label for="">结果材料送达方式：</Label>
                            <span class="text2" :title="res.sendtypeName">{{res.sendtypeName}}</span>
                            </Col>
                        </Row>
                        <Row class="row" v-if="res.sendType == '03'">
                            <Col span="10">
                            <Label for="">物流公司：</Label>
                            <span class="text2" :title="res.logisticsCompanyName">{{res.logisticsCompanyName}}</span>
                            </Col>
                            <Col span="10">
                            <Label for="">付费方式：</Label>
                            <span class="text2" :title="res.payTypeName">{{res.payTypeName}}</span>
                            </Col>
                        </Row>
                        <Row class="row" v-if="res.sendType == '03'">
                            <Col span="10">
                            <Label for="">收件人姓名：</Label>
                            <span class="text2" :title="res.recName">{{res.recName}}</span>
                            </Col>
                            <Col span="10">
                            <Label for="">收件人手机：</Label>
                            <span class="text2" :title="res.recPhone">{{res.recPhone}}</span>
                            </Col>
                        </Row>
                        <Row class="row" v-if="res.sendType == '03'">
                            <Col span="10">
                            <Label for="">邮寄地址：</Label>
                            <span class="text2" :title="res.recAddress">{{res.recAddress}}</span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="item situation-condition" v-if="res.matterialRecInfoList != null">
                <div class="item-title">办事材料</div>
                <div class="item-content">
                    <!-- <div class="info-flag clearfix">
                        <button class="btn btn1">必&nbsp;&nbsp;要</button>
                        <span>必须收取</span>
                        <button class="btn btn2">非必要</button>
                        <span>根据情况收取</span>
                        <button class="btn btn3">容&nbsp;&nbsp;缺</button>
                        <span>容缺后补</span>
                    </div> -->
                    <div v-for="(item, index) in res.matterialRecInfoList" :key="index" class="matter">
                        <div class="matter-item">
                            <div class="matterial-name-title">
                                <span class="state-head icon-no-need" v-if="item.isNeed == '0'">非必要</span>
                                <span class="state-head icon-need" v-if="item.isNeed == '1'">必要</span>
                                <span class="state-head icon-lack" v-if="item.isNeed == '2'">容缺</span>
                                <div class="item-content-collect">
                                    <p>
                                        <span class="mark ell font-max" :title="item.matterialName"> {{item.matterialName}}</span>
                                        <i class="icon-dobut" v-if="item.contentTxt" :title="item.contentTxt"></i>
                                    </p>
                                    <!-- 原件、复印件、上传照片展示的内容 -->
                                    <div class="upload-detail font-min">
                                        <!-- 原件 -->
                                        <div class="origin-files" v-if="item.originCheck == 1">
                                            <label>原件</label>
                                            <span class="file-num">收取份数：{{item.originRecNum}}份</span>
                                            <span class="file-opinion">意见：{{item.originView}}</span>
                                        </div>

                                        <!-- 复印件 -->
                                        <!-- 01：电子 02：原件 03复印件 -->
                                        <div class="copy-files" v-if="item.copiesCheck == 1">
                                            <label>复印件</label>
                                            <span class="file-num">收取份数：{{item.copiesRecNum}}份</span>
                                            <span class="file-opinion">意见：{{item.copiesView}}</span>
                                        </div>

                                        <!-- 电子照 -->
                                        <div class="elec-photo elec-photo11" v-if="item.elecEdition != null && item.elecEdition !=''">
                                            <label>电子件</label>
                                            <div class="file-list-wrap">
                                                <div class="file-list" v-for="(ele,index) in item.uploadFileList" :value="ele.value" :key="index">
                                                    <a href="javascript:;">
                                                        <span class="file-name" :data-path="ele.elecUrl" :title="ele.fileName" @click="previewFileEvt">{{ele.fileName.length > 20 ? ele.fileName.substring(0,20) + '...' : ele.fileName}}</span>
                                                    </a>
                                                    <p class="time-max">
                                                        <span class="pr10 time">{{ele.uploadTime}}</span>
                                                        <span>{{ele.fileSize}}</span>
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import unit from '@/api/index';
import formItemNew from "@/pages/consigneeCenter/guideCommon/formItemNew";
export default {
    components: {
        formItemNew
    },
    data() {
        return {
            title: '开办酒店',
            formItem: {     // 办理对象
                objectItems: [{
                    label: '自然人',
                    value: '01',
                },
                {
                    label: '法人',
                    value: '02',
                }],
                applicantTypes: [{    //申请人
                    label: '本人/法人',
                    value: '01',
                },
                {
                    label: '委托人',
                    value: '02',
                }],
            },
            valueItem: {
                objectItem: '自然人', // 办理对象
                applicantType: '委托人', //申请人
            },
            res: '',
            formDynamic: {},
            jointStatus: '', // 当前事项未/已配置与运行系统 1：已 0：未

        }
    },
    computed: {
    },
    methods: {
        /**
         * 受理
         */
        receiptEvt() {
            let that = this,
                param = that.$route.query,
                receiptNo = param.receiptNo; // 收件号
            let loading = that.$loading({
                lock: true,
                text: '受理中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            unit.ajaxMerPost('/znsj-web/acceptReceipt/getMatterLibraryAddress', {
                userCode: 'sadmin',
                receiptNo: param.receiptNo
            }, function(res) {
                loading.close();
                let data = res.data;
                window.open(data.url, '_blank');
            },function(error) {
                loading.close();
                that.$Message.error(error.data.errMsg || '数据请求失败');
            }, that);

        },
        /**
         * 打印回执单
         */
        printReceipt() {
            let that = this,
                param = that.$route.query,
                url = that.$store.state.path + '/consignee/printReceipt?id=' + param.receiptNo + '&type=' + param.recriptType;
            unit.openFullWindow(url, '');
        },
        /**
         * 打印流转单
         */
        printCirculation() {
            let that = this,
                param = that.$route.query,
                url = this.$store.state.path + '/consignee/printFlow?id='  + param.receiptNo + '&type=' + param.recriptType;
            unit.openFullWindow(url, '');
        },
        /*
         * 图片预览  暂时路径跳转
         */
        previewFileEvt(e) {
            let self = $(e.currentTarget),
                path = self.data('path');  // 文件路径
            if (!path) {
                return;
            }
            window.open(path, '_blank');
        },
        urlClick(url) {
            unit.openNewDialog(this, url);
        },
        handleData(data) {
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
                            if (situationList[i].answerList[j].isSelect == 1) {
                                situationList[i].value = situationList[i].answerList[j].situationId;
                                situationList[i].disaAns = true;
                            }
                        }
                    } else {
                        situationList[i].value = [];
                        for (let k = 0; k < situationList[i].answerList.length; k++) {
                            if (situationList[i].answerList[k].isSelect == 1) {
                                situationList[i].value.push(situationList[i].answerList[k].situationId);
                                situationList[i].disaAns = true;
                            }
                        }
                    }
                    situationList[i].isMultiTrue = true;
                }
                if (situationList[i].answerClassifyList && situationList[i].answerClassifyList.length > 0) {
                    situationList[i].answerClassifyList = this.handleData(situationList[i].answerClassifyList);
                }
            }
            return situationList;
        },
        handleSubmit(name) {
            let _that = this,
                url = '/znsj-web/myReceipt/recordDetails';
            const loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });

            unit.ajaxMerPost(url, name, function (res) {
                loading.close();
                let sitMatterList = res.data.classifyList;
                if(!res.data.classifyList) {
                    sitMatterList = [];
                }
                let len = sitMatterList.length;
                res.data.classifyList = _that.handleData(sitMatterList);
                if (res.flag) {
                    _that.res = res.data;
                }
                return;
            }, function (res) {
                loading.close();
                _that.$message.warning('服务端错误');
                return;
            }, _that);
        },
    },
    // dom渲染后
    mounted: function () {
        let params = this.$route.query || {},
            id = params.id,
            recriptType = params.recriptType;
        this.jointStatus = params.jointStatus ? params.jointStatus : '';
        let data = {
            id: id,
            recriptType: recriptType,
        };
        this.handleSubmit(data);
    },
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/theme.less";
#receiptDetails {
    overflow: auto;
    min-width: 900px;
    height: 100%;
    background-color: #fff;
    padding: 15px 0 0 25px;
    .container {
      padding-right: 30px;
    }
    .text-one {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 80%;
        text-align: left;
        vertical-align: middle;
    }
    .text2 {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 50%;
        text-align: left;
        vertical-align: middle;
    }
    .text1 {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 50%;
        text-align: left;
        vertical-align: middle;
    }
    .row {
        margin-bottom: 8px;
    }
    .radio-group {
        margin-bottom: 10px;
        margin-top: 5px;
    }
    .detail-title {
        margin: 15px 0;
        padding-left: 5px;
        height: 32px;
        width: 100%;
        .detail-title-font {
            height: 24px;
            max-width: 400px;
            color: #333;
            font-weight: 600;
            border-left: 5px solid #09f;
            text-indent: 8px;
            line-height: 24px;
        }
        .btn-group {
            position: relative;
            z-index: 10;
            top: -4px;
        }
    }
    .matter-title {
        width: 90%;
    }
    .item {
        // border: 1px solid #e4e4e4;
        margin: 0 20px;
        margin-left:0;
        margin-bottom: 20px;
        border: 1px solid #dcdee2;
        .item-title {
            font-weight: normal;
            height: 30px;
            line-height: 30px;
            padding-left: 8px;
            background-color: #f4f6f9;
            // color: #515a6e;
            color: #333;
            font-weight: 700;
            border-bottom: 1px solid #e4e4e4;
            margin-bottom:10px;

        }
        .info-flag {
            // padding-bottom: 12px;
            border-bottom: 1px dashed #ddd;
            padding-left: 6px;
            // height: 35px;

            span {
                display: inline-block;
                // padding: 1px 5px;
                height: 35px;
                line-height: 35px;
            }
        }
        .btn {
            padding: 1px 5px;
            position: relative;
            top: 4px;
            border: none;
            border-radius: 3px;
            margin: 0 5px 0 10px;
            vertical-align: top;
            color: #fff;
        }
        .btn1 {
            background-color: #ff7a45;
        }
        .btn2 {
            background-color: #2d8cf0;
        }
        .btn3 {
            background-color: #00c0c7;
        }
        .receipt-info {
            margin-left: 25px;
        }
    }
    .item-content-wrap {
        padding: 10px;
    }
    .item-content {
        // padding: 14px 0;
        .ivu-radio-group {
            margin-top: -3px;
        }
        .item-child {
            border: 1px solid #e4e4e4;
            // margin: 0 20px 20px 20px;
            padding: 20px;
        }
        .radio-group {
            label {
                width: 200px;
            }
        }
        label {
            display: inline-block;
            // text-align: right;
            // margin-right: 10px;
            // min-width:100px;
            vertical-align: top;
        }
    }
    .item-content1 {
        // border-top: 1px dashed #e4e4e4;
    }
    .matter-item {
        margin: 10px;
        // padding: 10px 15px;
        border: 1px solid #e1e6f0;
        background: #f8f9fc;
        .matterial-name-title {
            .state-head {
                display: inline-block;
                margin-bottom: 10px;
                height: 18px;
                width: 51px;
                font-size: 12px;
                color: #fff;
                line-height: 18px;
                text-align: center;
            }
            // 必要
            .icon-need {
                background: url(../../../assets/images/common/bg-title1.png)
                    no-repeat;
                background-position: top left;
                background-size: 51px 18px;
            }
            // 非必要
            .icon-no-need {
                background: url(../../../assets/images/common/bg-title2.png)
                    no-repeat;
                background-position: top left;
                background-size: 51px 18px;
            }
            // 容缺
            .icon-lack {
                background: url(../../../assets/images/common/bg-title3.png)
                    no-repeat;
                background-position: top left;
                background-size: 51px 18px;
            }
            .item-content-collect {
                padding-left: 15px;
                .mark {
                    padding: 0;
                    margin: 10px 0;
                    max-width: 90%;
                    font-weight: 550;
                    vertical-align: middle;
                }
                // 备注信息
                .icon-dobut {
                    display: inline-block;
                    width: 20px;
                    height: 24px;
                    background: url(../../../assets/images/common/icon-dobut.png)
                        no-repeat;
                    background-position: center center;
                    background-size: 16px;
                    vertical-align: middle;
                }
                // 原件、复印件、上传照片展示的内容
                .upload-detail {
                    color: #515a6e;
                    label {
                        display: inline-block;
                        padding: 0;
                        width: 50px;
                        height: 20px;
                        line-height: 20px;
                        text-align: right;
                    }
                    span {
                        display: inline-block;
                        padding-right: 15px;
                        height: 20px;
                        line-height: 20px;
                        vertical-align: top;
                    }
                    .file-opinion {
                        padding-right: 0px;
                    }
                    .file-num {
                        margin-left: 15px;
                        // vertical-align: bottom;

                    }
                    .origin-files,
                    .copy-files {
                        margin-bottom: 10px;
                    }
                    // .origin-files{
                    //     font-weight:700;
                    // }
                    .elec-photo {
                        .file-list-wrap {
                            display: inline-block;
                            margin-left: 15px;
                            max-width: 90%;
                            vertical-align: top;
                            .file-list {
                                display: inline-block;
                                margin: 0 80px 10px 0;
                                .time-max {
                                    height: 20px;
                                    span {
                                        display: inline-block;
                                        height: 20px;
                                        line-height: 20px;
                                    }
                                    .time {
                                        padding-right: 10px;
                                    }
                                }
                                .file-name {
                                    color: #2d8cf0;
                                }
                            }
                        }
                        a {
                            display: inline-block;
                            padding-right: 10px;
                            height: 25px;
                            margin-top: 4px;
                        }
                        span {
                            padding: 0;
                        }
                    }
                    a {
                        text-decoration: none;
                    }
                    a:hover {
                        color: #333;
                    }
                    i {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background: url(../../../assets/images/common/icon-del.png)
                            no-repeat;
                        background-position: center;
                        background-size: 12px;
                        cursor: pointer;
                    }
                }
            }
        }
        span {
            display: inline-block;
            vertical-align: top;
        }
        .matterial-name {
            max-width: 70%;
            height: 30px;
            line-height: 30px;
        }
    }
    .sel {
        border-bottom: none;
    }
    .receipt-info a {
        color: #017dfc;
    }
    .receipt-info label {
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 8px;
    }
    .receipt-info span {
        margin-right: 15px;
    }
}
</style>