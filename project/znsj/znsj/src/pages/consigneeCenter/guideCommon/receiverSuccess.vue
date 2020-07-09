/*
* @Author: zyjiang2
* @Date: 2018-09-28 15:06:00
* @Last Modified by: zyjiang2
* 收件成功页面
*/
<template>
    <div id="receiverSuccess" class="wrap" style="height:100%;padding: 40px;">
        <!-- 头部标题部分 -->
        <div class="head-title">
            <p v-bind:title="title" class="font-max ell">{{title}}</p>
        </div>
        <Card :bordered="true" style="background:#eef1f7">
            <div class="info-show clearfix tc">
                <div class="tip-pic inline-block tc">
                    <!-- <Icon type="md-checkmark-circle" size="100" color="#61bf4b" /> -->
                    
                    收件成功
                    <!-- <span class="font-max">收件成功！</span> -->
                </div>
                <div class="tip-box">
                    <div class="item font-min">
                        <p class="word-ell" v-bind:title="messageInfo.mettaName">办理事项：{{ showMatterName.length>60?showMatterName.substring(0,60)+'...':showMatterName }}</p>
                        <!-- <p v-bind:title="messageInfo.mettaName">办理事项：{{ messageInfo.mettaName }}</p> -->

                    </div>
                    <div class="item font-min"  v-if="messageInfo.applicantType === '1'">
                        <p v-bind:title="messageInfo.applicantName">申请人/单位：{{ messageInfo.applicantName }}</p>
                    </div>
                    <div class="item font-min"  v-if="messageInfo.applicantType === '1'">
                        <p v-bind:title="messageInfo.cardNo">证件号码：{{ messageInfo.cardNo }} </p>
                    </div>
                    <div class="item font-min" v-if="messageInfo.applicantType === '2'">
                        <p v-bind:title="messageInfo.applicantName">机构名称：{{ messageInfo.applicantName }}</p>
                    </div>
                    <div class="item font-min" v-if="messageInfo.applicantType === '2'">
                        <p v-bind:title="messageInfo.cardNo">统一社会信用代码：{{ messageInfo.cardNo }} </p>
                    </div>
                </div>
            </div>
            
        </Card>
        <div class="btn-wrap mt10 mb10 tc">
                <i-button class="btn mr10 step5" @click="printReceipt">打印回执单</i-button>
                <i-button class="btn mr10 step5" @click="printCirculation">打印流转单</i-button>
                <i-button class="btn mr10 step5" @click="goToNew">返回</i-button>
                <i-button class="btn step2" type="primary" @click="receiptEvt" v-if="jointStatus == '1'" :disabled="receipBtnState">受理</i-button>
        </div>
    </div>
</template>
<script>
import util from "@/api";
export default {
    data() {
        return {
            showMatterName:'',
            messageInfo: {},
            type: '',
            id: '',
            title: '',
            buttonSize: 'large',
            receiptNo: '', // 收件no
            jointStatus: '', // 当前事项未/已配置与运行系统 1：已 0：未
            receipBtnState: false,
        }
    },
    methods: {
        getMatter() {
            let that = this;
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            util.ajaxMerPost('/znsj-web/consignee/getReceiptResult', {
                type: that.type,
                id: that.id
            }, function (res) {
                loading.close();
                let data = res.data;
                for (let key in data) {
                    that.$set(that.messageInfo, key, data[key]);
                }
                //把事件名赋值给显示的事件名
                that.showMatterName = that.messageInfo.mettaName;
            }, function (res) {
                loading.close();
                that.$Message.error(data.data || '数据加载失败！');
            }, that);
        },
        // 打印回执单
        printReceipt: function (e) {
            let that = this;
            let url = this.$store.state.path + '/consignee/printReceipt?id=' + that.id + '&type=' + that.type;
            util.openFullWindow(url, '');
        },
        // 打印流转单
        printCirculation: function () {
            let that = this;
            let url = this.$store.state.path + '/consignee/printFlow?id=' + that.id + '&type=' + that.type;
            util.openFullWindow(url, '');
        },
        // 登记另一个  改为返回跳转到主页面
        goToNew: function () {
            let that = this;
            that.$router.push(
                {
                    path: '/searchMatters',
                    query: {}
                }
            );
            // window.location.href = '/bog-receive-web/index.html#/searchMatters';
            // if (that.type == 1) {
            //     window.location.href = '/bog-receive-web/index.html#/oddGuide/guideWrap?matterIds=' + that.$route.params.matterIds[0] + '&type=1' + '&jointStatus=' + that.jointStatus + '&state=' + that.state;
            // } else if (that.type == 2) {
            //     window.location.href = '/bog-receive-web/index.html#/majorityGuide/guideWrap?matterIds=' + JSON.stringify(that.$route.params.matterIds) + '&type=2' + '&jointStatus=' + that.jointStatus + '&state=' + that.state;
            // } else {
            //     window.location.href = '/bog-receive-web/index.html#/oneThingReceiveFile/guideWrap?eventReceiptNo=' + that.eventCode + '&id=' + that.eventId + '&eventCode=' + that.eventCode + '&jointStatus=' + that.jointStatus + '&state=' + that.state;
            // }
        },
        /**
         * 受理
         */
        receiptEvt() {
            let that = this,
                param = that.$route.params,
                receiptNo; // 收件号
            let loading = that.$loading({
                lock: true,
                text: '受理中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            util.ajaxMerPost('/znsj-web/acceptReceipt/getMatterLibraryAddress', {
                userCode: 'sadmin',
                receiptNo: param.type == '3' ? param.eveReceiptNo : param.receiptNo
            }, function(res) {
                loading.close();
                that.receipBtnState = true;
                let data = res.data;
                window.open(data.url, '_blank');
            },function(error) {
                loading.close();
                that.$Message.error(error.data.errMsg || '数据请求失败');
            }, that);
        }
    },
    mounted() {
        let that = this,
            params = that.$route.params;
        that.type = params.type;
        if (that.type == '3') {  // 一件事
            that.eventCode = params.eventCode;
            that.eventId = params.id;

            that.eventReceiptNo = params.eventReceiptNo; 
            that.id = params.eventReceiptNo;
        }else {
            that.id = params.receiptNo;
        }
        that.title = params.title;
        that.jointStatus = params.jointStatus;
        that.state = params.state;
        that.getMatter();
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
#receiverSuccess {
    background: #fff;
    width: 100%;
    overflow-y: auto;
    .head-title {
        display: inline-block;
        width: 100%;
        height: 40px;
        font-weight: 700;
        line-height: 40px;
        p {
            margin-top: 7.5px;
            width: 100%;
            max-width:800px;
            height: 25px;
            color: #333;
            border-left: 7px solid #0099ff;
            line-height: 25px;
            text-indent: 10px;
        }
    }
    .info-show {
        margin: 0 auto;
        padding: 50px 15px 100px 15px;
        max-width: 800px;
        .tip-pic {
            position:relative;
            margin: 0 20px 10px 0;
            height: 70px;
            background: url(../../../assets/images/common/icon-success.png) no-repeat;
            background-position: top center;
            background-size: 57px;
            font-weight:700;
            font-size: 20px;
            vertical-align: top;
            line-height: 160px;
        }
        .tip-box{
            display:inline-block;
            vertical-align: bottom;
            max-width: 300px;
            .item {
                text-align: left;
                p {
                    display: inline-block;
                    min-width: 300px;
                    text-align: left;
                    word-break:normal;
                }
            }
        }
        .word-ell {
            word-wrap: break-word;
            overflow: hidden;
            word-break: break-all;
        }
    }
}
</style>
