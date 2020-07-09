/*
 * @Author: tinglong 
 * @Date: 2018-09-28 15:06:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-10 14:53:38
 * @description 信息填写
 */
 
<template>
    <div id="infoFill">
        <div class="nav-wrap">
                <slideNav2 :step="step" :status="navStatus" v-if="pageParamObj.type == '3'"></slideNav2>
                <slideNav :step="step" :status="navStatus" v-else></slideNav>
            </div>
        <div class="info-fill-wrap">
            <!-- 头部标题部分 -->
            <div class="head">
                <detailHead :titles="pageParamObj.title"></detailHead>
            </div>
            <!-- 主要内容 -->
            <div class="content font-min">
                <div class="row">
                    <label class="label-title font-min pr10">
                        <span class="required">*</span>申请人类型</label>
                    <RadioGroup v-model="applicantType " @on-change="applyerChange">
                        <Radio v-for="item in applyTypeList" :label="item.value" :key="item.value" :disabled="applyerDisabled">
                            <span>{{item.label}}</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <!-- 以下为个人专有字段 -->
                <div :class="{'per-info-hide': singPerActive}">
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>身份证号</label>
                            <Input v-model="perForm.cardNo" placeholder="请填写" />
                            <span class="btn-read font-min" @click="readIdCardEvt()">读取</span>
                        </div>
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>申请人姓名</label>
                            <Input v-model="perForm.applicantName" placeholder="请填写" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>申请人手机</label>
                            <Input v-model="perForm.applicantPhone" placeholder="请填写" />
                        </div>
                    </div>
                </div>
                <!-- 以上为个人专有字段 -->

                <!-- 以下为法人专有字段 -->
                <div :class="{'per-info-hide':legalPerActive}">
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>机构名称</label>
                            <Input v-model="legalPerForm.officeName" placeholder="请填写" />

                        </div>
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>统一社会信用代码</label>
                            <Input v-model="legalPerForm.officeCode" placeholder="请填写" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>委托人身份证号</label>
                            <Input v-model="legalPerForm.trustorIdCard" placeholder="请填写" />
                            <span class="btn-read font-min" @click="readIdCardEvt()">读取</span>
                        </div>
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>委托人姓名</label>
                            <Input v-model="legalPerForm.trustorName" placeholder="请填写" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>委托人电话</label>
                            <Input v-model="legalPerForm.trustorPhone" placeholder="请填写" />
                        </div>
                    </div>

                </div>
                <!-- 以上为法人专有字段 -->

                <div class="row">
                    <label class="label-title font-min pr10">
                        <span class="required">*</span>结果材料送达方式</label>
                    <RadioGroup v-model="receiceData.sendType" @on-change="smsTypeChange">
                        <Radio v-for="item in sendTypeList" :label="item.value" :key="item.value">
                            <span>{{item.label}}</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <!-- 只有送达方式为快递寄送 才展示的字段信息 -->
                <div class="sms-type-wrap" :class="{'sms-form-hide': smsFormActive}">
                    <div class="row">
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>物流公司</label>
                                 <!-- @on-change="smsComChange"  -->
                            <Select v-model="receiceData.logisticsCompany" :transfer="true">
                                <Option v-for="item in smsComList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>付费方式</label>
                            <Select v-model="receiceData.payType" :transfer="true">
                                <Option v-for="item in payList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="half-row font-min" ref="halfRow">
                            <label class="label-title pr10">
                                <span class="required">*</span>收件人姓名</label>
                            <Input v-model="receiceData.recName" placeholder="请填写" ref="inputWrap" />
                        </div>
                        <div class="half-row font-min">
                            <label class="label-title pr10">
                                <span class="required">*</span>收件人手机</label>
                            <Input v-model="receiceData.recPhone" placeholder="请填写" />
                        </div>
                    </div>
                    <div class="row sms-pick-wrap" ref="smsPickWrap">
                        <label class="label-title font-min pr10">
                            <span class="required">*</span>邮寄地址</label>
                        <div class="cascader-wrap font-min">
                            <Cascader v-model="xzqhVal" :data="xzqhTreeData" :render-format="xzqhFormat" :load-data="xzqhLoadData" change-on-select :transfer="true" @on-change="changeXzqh"></Cascader>
                        </div>
                        <div class="detail-addr font-min" ref="detailAddr" :style="{width: xzqhWidth}">
                            <Input v-model="receiceData.recAddress" placeholder="请填写详细地址" :maxlength="50" />
                        </div>
                    </div>
                    
                </div>
                <div class="row btn-wrap" :style="{paddingRight: prBtn}">
                    <!-- 按钮部分 -->
                    <div class="half-row font-min">
                        <Button class="mr10 step" @click="preEvent">上一步</Button>
                        <Button class="step" type="primary" @click="nextEvent">下一步</Button>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import slideNav from "@/components/common/slideNav";
import slideNav2 from "@/components/common/slideNav2";
import detailHead from "@/components/common/detailHead";
import unit from "@/api";
export default {
    components: {
        slideNav,
        detailHead,
        slideNav2,
    },
    data() {
        return {
            xzqhVal: [],  // 行政区划的 value值 
            tempxzqhVal: [], //行政区划暂存
            xzqhFlag: true,  //首次加载

            xzqhTreeData: [], // 行政区划数据
            xzqhLen: 0,
            id: '',  // 当前信息id
            singPerActive: false,  // 个人、法人模块隐藏显示标志
            legalPerActive: true,
            smsFormActive: true,  // 配送方式展示标志

            // 申请人类型
            applyTypeList: [],
            applicantType: '1',  // 默认为个人
            applyerDisabled: false,
            sendTypeList: [],
            
            smsComList: [],
            payList: [], // 默认快递寄送
            perForm: { // 个人 独有数据 
                applicantName: '', // 申请人姓名 50
                cardNo: '', // 身份证号
                applicantPhone: '', // 手机号
            },
            
            legalPerForm: { // 法人 独有数据
                officeName: '', // 机构名称  50
                officeCode: '', // 统一社会信用代码  
                trustorName: '', // 委托人姓名
                trustorIdCard: '', // 委托人身份证号
                trustorPhone: '', // 委托人电话
            },
            receiceData: { // 收件信息
                sendType: '01',  // 送达方式
                logisticsCompany: '01', // 物流公司 
                payType: '01',
                recName: '',  // 收件人姓名
                recPhone: '', // 收件人电话
                recAddress: ''  // 收件人详细地址 50
            },
            recXzqh: '',  // 行政区划code值
            detailAddr: '',  // 具体地址 省+市+县
            step: 3,  // 导航面板的状态
            navStatus: '1',
            pageParamObj: {}, // 传到下一页面的参数对象
            prBtn: '50px',
            xzqhWidth: '400px',
            xzqhCount: 0,  // 解决渲染当前用户默认行政区划正常渲染
            loading: ''
        }
    },
    methods: {
        /*
         * 身份证号读取
         */
        readIdCardEvt(e) {
            let that = this;
            if(unit.isIE()) {
                that.handleCardNo();
            }else {
                that.$Message.warning('您所使用的浏览器不支持身份证读取!');
                return;
            }
        },
        /*
         * 处理身份证信息
         */
        handleCardNo() {
            let that = this,
                info,
                carNo;
            info = that.$store.state.dev.getIdCardInfo();
            if(info) {
                carNo = info.cardNo;
                if(that.applicantType === '1') {
                    that.perForm.cardNo = carNo;
                }else if(that.applicantType === '2') {
                    that.legalPerForm.trustorIdCard = carNo;
                }
            }else {
                that.$Message.warning('读卡失败！');
            }   
        },
        /*
         * labels: 数组 - 邮寄地址
         * selectedData： 数组对象键值对
         * 选择后展示的函数，用于自定义显示格式
         */
        xzqhFormat(labels, selectedData) {
            let that = this;
            that.detailAddr = labels.join('');
            return labels.join('/');
        },
        /*
         * 获取默认行政区划 -邮寄地址
         */
        getDefaultXzqh() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/commer/curentUserXzqh', {
                pinYinType: 'XZQH'
            }, function (res) {
                let data = res.data;
                for (let i in data) {
                    that.xzqhVal.push(data[i].value);
                    that.tempxzqhVal.push(data[i].value);
                }
            }, function (res) {
                that.$Message.warning('服务端错误');
            }, that);
        },
        /*
         * 行政区域 - 邮寄地址
         * 获取省 市 区
         */
        getXzqhTreeData() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', {}, function (res) {
                $.each(res.data, function (index, item) {
                    item.children = [];
                    item.loading = false;
                })
                that.xzqhTreeData = res.data;
                // 获取默认行政区域
                setTimeout(function () {
                    that.getDefaultXzqh();
                }, 0);
            }, function (res) {
                that.$Message.warning('数据加载失败');
            }, that);
        },
        /*
         * 动态获取数据，数据源需标识 loading
         */
        xzqhLoadData(item, callback) {
            let that = this,
                qhCode = item.value,
                itenLen = item.__value.split(',').length;
            that.recXzqh = qhCode;
            item.loading = true;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
                    if (itenLen < 4) {
                        if (result.data.length != 0) {
                            $.each(result.data, function (i, t) {
                               if(t.hasChild == '1') {
                                    t.children = [];
                                    // 有下一级箭头 可加载子类
                                    t.loading = false; 
                                }
                            });
                        }
                    }
                    item.children = result.data;
                    if (that.xzqhCount < that.tempxzqhVal.length) {
                        setTimeout(function () {
                            that.xzqhCount = that.xzqhCount + 1;
                            that.xzqhVal = that.tempxzqhVal;
                        }, 0);
                    }
                    item.loading = false;
                    callback();
                }, function (result) {
                    that.$Message.warning('数据加载失败');
                }, that);
            }, 300);
        },
        /*
        ** 行政区划改变联动部门
        */
        changeXzqh(value, selectedData) {
            let _that = this;
            if (value.length == 0) {//行政区划清空时部门和机构清空
                _that.xzqhVal = [];
            } else {
                _that.xzqhVal = value;
            }
        },
        /*
         *  申请人类型 change事件监听
         */
        applyerChange(data) {
            // 1 个人 2 法人
            this.singPerActive = data == '1' ? false : true;
            this.legalPerActive = data == '1' ? true : false;
        },
        /*
         *  送达方式 change事件监听
         */
        smsTypeChange(data) {
            // 3 // 快递寄送
            this.smsFormActive = data == '03' ? false : true;
        },
        /*
         *  上一步点击事件
         */
        preEvent() {
            this.$emit('go', 'materialVerification', {
                flag: true
            });
        },
        /**
         * 表单字段验证规则
         */
        getFormRuleData() {
            let rule = [
                {
                    'key': 'applicantName',
                    'title': '申请人姓名',
                    'required': true,
                    'max': 50
                }, {
                    'key': 'applicantPhone',
                    'title': '申请人手机号',
                    'required': true,
                    'pattern': /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                }, {
                    'key': 'officeName',
                    'title': '机构名称',
                    'required': true,
                    'pattern': /^[0-9a-zA-Z.\u4e00-\u9fa5()（）]{1,50}$/,  // 字母数字.中英文括号 汉字
                    'max': 50
                }, {
                    'key': 'trustorName',
                    'title': '委托人姓名',
                    'required': true,
                    'max': 50
                }, {
                    'key': 'trustorPhone',
                    'title': '委托人电话',
                    'required': true,
                    'pattern': /^[1][3,4,5,6,7,8,9][0-9]{9}$|^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
                }, {
                    'key': 'recName',
                    'title': '收件人姓名',
                    'required': true,
                    'max': 50
                }, {
                    'key': 'recPhone',
                    'title': '收件人手机号',
                    'required': true,
                    'pattern': /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                }, {
                    'key': 'recAddress',
                    'title': '详细地址',
                    'required': true,
                    // 'pattern': /^[0-9a-zA-Z_.\u4e00-\u9fa5]{1,}$/,
                }
            ]; 
            return rule;
        },
        /*
         * 下一步点击事件
         */
        nextEvent() {
            let rule = this.getFormRuleData(),
                obj = {},
                sendTypeObj = {},
                idCard,  // 身份证号
                that = this;
            if (that.applicantType == '1') { // 个人
                obj = JSON.stringify(that.perForm);
                idCard = that.perForm.cardNo;
            } else if (that.applicantType == '2') { // 法人
                obj = JSON.stringify(that.legalPerForm);
                idCard = that.legalPerForm.trustorIdCard;
            }
           
            // 送达方式
            if(that.receiceData.sendType == '03') {
                sendTypeObj = JSON.stringify(that.receiceData);
                sendTypeObj = $.parseJSON(sendTypeObj);
            }else {
                sendTypeObj.sendType = that.receiceData.sendType;
            }
            obj = $.parseJSON(obj);
            // 浅拷贝
            obj = $.extend({}, { applicantType: that.applicantType }, obj, sendTypeObj);
            if (!unit.inputCheck(rule, obj, that)) {
                return;
            }
            // 拼接地址
            if (that.receiceData.sendType == '03') { // 送件方式 快递寄送 省 + 市 + 区 + 具体地址
                obj.recXzqh = that.recXzqh;  // 行政区划
                obj.recAddress = that.detailAddr + that.receiceData.recAddress;
            }
            // 检验身份证号
            if (!unit.checkCard(idCard, that)) {
                return;
            }
            // 检验 统一社会信用代码
            if (that.applicantType == '2' && !unit.CheckSocialCreditCode(that.legalPerForm.officeCode, that)) { // 法人时 统一社会信用代码
                return;
            }
            let param = this.$parent.param;
            obj = $.extend({}, obj, {
                id: param.matterIds.join(','),
                matterInfos: that.dealMatCodeVerData(),
                type: param.type,  // 收件类型 1：单事项收件 2：多事项收件 3：一件事收件 that.$parent.param.type
            });
            obj.receiptNo = param.type == '3' ? param.eventReceiptNo : param.receiptNo;
            that.loadingFun();
            unit.ajaxPost('/znsj-web/consignee/saveUserInfo', obj, ).then(function (res) {
                that.loading.close();
                let data = res.data;
                that.$Message.success(data.data);
                that.$emit('go', 'collectMaterial',{
                    idCard: idCard 
                });
            }).catch(function (error) {
                that.loading.close();
                that.$Message.error('数据请求失败!');
            });
        },
        /**
         * 事项编码 事项版本数据格式处理
         */
        dealMatCodeVerData() {
            // 请求接口参数格式处理
            let Urlparam = this.$parent.param,
                code = Urlparam.recObjectCode.split(','),   // 情形事项编码
                version = Urlparam.recObjectVersion.split(','), // 情形事项版本号
                codeVerArr = [];
            for (var i in code) {
                codeVerArr.push({
                    matterCode: code[i],
                    matterVersion: parseFloat(version[i])
                });
            }
            return codeVerArr;
        },
        /**
         * 遮罩
         */
        loadingFun() {
            this.loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
        },
        /**
         * 初始化form数据
         */
        initFormData() {
            // 申请人类型
            this.applyTypeList = [
                {
                    label: '个人',
                    value: '1'
                }, {
                    label: '法人',
                    value: '2'
                }
            ];
            // 送达方式
            this.sendTypeList = [
                { // 送达方式
                    label: '无需取件',
                    value: '01'
                }, {
                    label: '窗口取件',
                    value: '02'
                }, {
                    label: '快递寄送',
                    value: '03'
                }

            ];
            // 物流公司类型
            this.smsComList = [
                { // 物流公司类型
                    label: 'EMS',
                    value: '01'
                }, {
                    label: '顺丰',
                    value: '02'
                }
            ];
            // 付费方式 // 默认快递寄送
            this.payList = [
                { // 付费方式
                    label: '政府统一付费',
                    value: '01'
                }, {
                    label: '到付',
                    value: '02'
                }
            ]
        },
        /**
         * 初始化
         */
        init() {
            let param = this.$parent.param;
            this.pageParamObj.type = param.type;
            if(param.type == '3') {  // 一件事
                this.pageParamObj.eventReceiptNo = param.eventReceiptNo;  // 事件号
                this.pageParamObj.id = param.id;  // 一件事id
                this.step = 4;
            }else { // 单事项或者多事项
                this.pageParamObj.receiptNo = param.receiptNo;
                this.pageParamObj.matterIds = param.matterIds; // 事项id  数组
                this.step = 3;
            }
            this.pageParamObj.title = param.name;
            this.getXzqhTreeData(); // 获取省份
            // unit.solveAnimFrame(); 

            if(param.state == 'gr') {
                this.applyerChange(1);
                this.applicantType = '1';
                this.applyerDisabled = true;
            } else if (param.state == 'fr') {
                this.applyerChange(2);
                this.applicantType = '2';
                this.applyerDisabled = true;
            }
            this.prBtn = ($('.half-row').width() - (140 + $('.ivu-input-wrapper').width())) + 'px';
            this.xzqhWidth = ($('.row').width() / 2 -25) + 'px';
        }
        
    },
    mounted() {
        this.initFormData();
        this.init();
    }

}
</script>

<style lang="less">
@import "../../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#infoFill {
    width: 100%;
    height: 100%;
    // padding:20px 0 0 20px;
    // overflow: hidden;
    .info-fill-wrap {
        width: 100%;
        height: auto;
        padding: 0px 100px 20px 20px;
        background: #fff;
        // overflow-y: auto;
        // 主体内容
        .content {
            width: 100%;
            .required {
                color: red;
            }
            .per-info-hide, // 个人 法人信息显示状态
            .sms-form-hide {
                // 物流表单信息展示
                display: none;
            }
            .sms-type-wrap {
                padding-top: 15px;
                border-top: 1px dashed #ddd;
            }
            .row {
                margin-bottom: 15px;
                width: 100%;
                height: 40px;
                font-size: 0;
                label {
                    display: inline-block;
                    height: 32px;
                    // font-size: 14px;
                    color: #333;
                    line-height: 32px;
                    text-align: right;
                }
                .label-title {
                    width: 140px;
                }
                .ivu-radio-group {
                    vertical-align: top;
                }
                .half-row {
                    display: inline-block;
                    width: 50%;
                    vertical-align: top;
                    label {
                        float: left;
                    }
                    .ivu-input-wrapper {
                        width: 50%;
                        vertical-align: top;
                    }
                    // 读取按钮样式
                    .btn-read {
                        display: inline-block;
                        position: relative;
                        z-index: 10;
                        margin-left: -6px;
                        min-width: 60px;
                        height: 30px;
                        padding: 0 15px;
                        color: #fff;
                        font-weight: 400;
                        background-color: @baseColor;
                        border-color: @baseColor;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;   
                    }
                    .ivu-select {
                        width: 50%;
                    }
                }
            }
            .sms-pick-wrap {
                .cascader-wrap {
                    display: inline-block;
                    width: 25%;
                    vertical-align: top;
                }
                // 区域级联组件样式修改
                .distpicker-address-wrapper {
                    display: inline-block;
                }
                .detail-addr {
                    display: inline-block;
                    margin-left: 25px;
                    min-width: 400px;
                    vertical-align: top;
                }
            }
            .ivu-input {
                height: 30px;
                padding: 0 7px;
            }
        }
        // 按钮
        .btn-wrap {
            width: 100%;
            height: 40px;
            text-align: right;
            .btn-next {
                margin-right: 10px;
            }
            .ivu-btn {
                width: 120px;
            }
            .step{
                padding: 0;
                height: 32px;
                line-height: 1;
            }
        }
    }
}
</style>
