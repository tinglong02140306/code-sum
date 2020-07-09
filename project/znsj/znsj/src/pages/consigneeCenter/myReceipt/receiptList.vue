/** 
 * @Author: kkfan2 
 * @Date: 2018-10-09 10:15:37
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-18 14:33:02
 * @description: 我的收件  
 */
<template>
    <div id="myReceipt">
        <div>
            <tabNavigate :tabs="tabs"></tabNavigate>
        </div>
        <div class="main-wrap clearfix">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="5">
                    <Form-item label="类型" prop="recordType">
                        <Radio-group v-model="formValidate.recordType" @on-change="radioTypeChange">
                            <Radio label="1">事项</Radio>
                            <Radio label="2">一件事</Radio>
                        </Radio-group>
                    </Form-item>
                    </Col>
                    <Col span="7">
                    <div class="input-wrap">
                        <FormItem label="申请人/申请单位" :label-width="100" prop="applicantName">
                            <Input v-model="formValidate.applicantName" placeholder="请输入申请人/申请单位" :maxlength="100" />
                        </FormItem>
                    </div>
                    </Col>
                    <Col span="6">
                    <FormItem label="办件名称" prop="recObjectName">
                        <Input v-model="formValidate.recObjectName" placeholder="请输入办件名称" :maxlength="100" />
                    </FormItem>
                    </Col>
                    <Col span="5" class="clearfix">
                    <Button style="float:left;" type="primary" @click="handleSubmit('formValidate', '1')" class="ml25 mr15 h30 chaxun">查询</Button>
                    <a style="float:left;line-height: 29px;" ref="higSearch" class="higher-search-a font-min" href="javascript:void(0)" @click="higSearchEvt">
                        <span>{{ textDisplayDate.advancedSearch }}</span>
                        <i class="iconfont" v-bind:class="{'icon-xia': xia,'icon-shang': shang}"></i>
                    </a>
                    </Col>
                    <Col span="1">
                    <Button style="float:right;" type="primary" @click="exportExcl()" class="ml25 h30 chaxun">导出</Button>
                    </Col>
                </Row>
                <Row v-if="!viewDisplayDate.status">
                    <Col span="6">
                    <Form-item label="证件号码" prop="cardNo">
                        <Input v-model="formValidate.cardNo" placeholder="请输入证件号码" :maxlength="30" />
                    </Form-item>
                    </Col>
                    <Col span="6">
                    <Form-item label="收件编号" prop="realRecNo">
                        <Input v-model="formValidate.realRecNo" placeholder="请输入收件编号" :maxlength="50" />
                    </Form-item>
                    </Col>
                    <Col span="8">
                    <div class="data-wrap">
                        <Form-item label="时间">
                            <Row>
                                <Col span="11">
                                <Form-item prop="beginTime">
                                    <Date-picker type="date" placeholder="开始日期" v-model="formValidate.beginTime"></Date-picker>
                                </Form-item>
                                </Col>
                                <Col span="2" style="text-align: center">-</Col>
                                <Col span="11">
                                <Form-item prop="endTime">
                                    <Date-picker type="date" placeholder="结束日期" v-model="formValidate.endTime"></Date-picker>
                                </Form-item>
                                </Col>
                            </Row>
                        </Form-item>
                    </div>
                    </Col>
                </Row>
            </Form>
            <!-- <Row>
                
            </Row> -->
            <Table :columns="tableDate.thColumns" :data="tableDate.tbDate"></Table>
            <div class="block fr mt10">
                <el-pagination :total="pageTotal" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize" @size-change="handlePageSize" @current-change="handlePage" :current-page.sync="currentPageNo" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
                <!-- <Page :total="pageDate.pageTotal" :current="pageDate.currentPageNo" :page-size="pageDate.pageSize" show-elevator show-sizer show-total placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page> -->
            </div>
        </div>

    </div>
</template>

<script>
import unit from '@/api/index';
import tabNavigate from "@/components/common/tabNavigate";   // 页签导航
import tabSwitch from "@/components/common/tabSwitch";   // 表格头部切换
export default {
    components: {
        tabNavigate: tabNavigate,
        tabSwitch: tabSwitch
    },
    data() {
        let _that = this,
            validateBeginTime = (rule, value, callback) => { // 自定义验证
                return value === '' ? callback() :
                    value.valueOf() > new Date().valueOf() ? callback(new Error('不能大于当前时间')) :
                        _that.formValidate.endTime.valueOf() === '' ? callback() :
                            value.valueOf() > _that.formValidate.endTime.valueOf() ? callback(new Error('应不大于结束时间')) : callback();

            },
            validateEndTime = (rule, value, callback) => { // 自定义验证
                return value === '' ? callback() :
                    value.valueOf() > new Date().valueOf() ? callback(new Error('不能大于当前时间')) :
                        _that.formValidate.beginTime.valueOf() === '' ? callback() :
                            value.valueOf() < _that.formValidate.beginTime.valueOf() ? callback(new Error('应不小于开始时间')) : callback();
            };
        return {
            tabs: ['收件中心', '我的收件'],
            formValidate: {       // form表单
                recordType: '1',   // 类型
                applicantName: '', // 申请人/单位
                recObjectName: '',   // 办件名称
                beginTime: '',    // 开始时间
                cardNo: '',     // 证件号码
                receiptNo: '',// 收件编号
                realRecNo: '', //真实收件编号
                endTime: '',      // 结束时间
                // currentPageNo: 1,
                // pageSize: 15,
                userId: '',  //6D6710F1611C252DE05346011FACA095
            },
            pageTotal: 0,
            currentPageNo: 1,
            pageSize: 10,
            // pageDate: {
            //     pageTotal: 0,
            //     currentPageNo: 1,
            //     pageSize: 15,
            // },
            // 解决编辑 返回时恢复原状态 
            myRecSerParam: {},
            // isMyRecTrigEdit: false,
            matterThead: [ //事项头部
                {
                    title: '收件编号',
                    key: 'realRecNo',
                    align: 'center',
                    ellipsis: 'true',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                // domProps: {
                                //     title: params.row.realRecNo
                                // }
                            }, params.row.realRecNo)
                        ])
                    }
                },
                {
                    title: '事项名称',
                    key: 'recObjectName',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    color: '#137ddf',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left',
                                },
                                domProps: {
                                    title: params.row.recObjectName.length > 20 ? params.row.recObjectName : '',
                                    id: params.row.realRecNo,
                                    click: 'openRecordView()',
                                },
                                on: {
                                    click: (e) => {
                                        // 解决列表页数据缓存问题
                                        this.recordSerParam();
                                        this.$store.commit('setState', {
                                            isMyRecTrigEdit: true
                                        });
                                        this.$router.push(
                                            {
                                                path: '/myReceipt/receiptDetails',
                                                query: {
                                                    id: params.row.id,
                                                    recriptType: params.row.type,
                                                    jointStatus: params.row.jointStatus,
                                                    receiptNo: params.row.receiptNo,
                                                    // type: '1'
                                                }
                                            }
                                        );                                        
                                        // unit.openNewDialog(this, '/myReceipt/receiptDetails?id=' + params.row.id + '&recriptType=' + params.row.type + '&jointStatus=' + params.row.jointStatus + '&receiptNo=' + (params.row.realRecNo ? params.row.realRecNo : params.row.receiptNo));
                                    }
                                }
                            }, params.row.recObjectName)
                        ])
                    }
                },
                {
                    title: '收件时间',
                    key: 'createTime',
                    align: 'center',
                    render: (h, params) => {
                        let time;
                        if (params.row.createTime != null && params.row.createTime != '') {
                            time = params.row.createTime.indexOf('.0') > 0 ? params.row.createTime.substring(0, params.row.createTime.length - 2) : params.row.createTime;
                        } else {
                            time = '';
                        }
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                // domProps: {
                                //     title: time
                                // }
                            }, time)
                        ])
                    }
                },
                {
                    title: '申请人/申请单位',
                    key: 'applicantName',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left',
                                },
                                domProps: {
                                    title: params.row.applicantName.length > 20 ? params.row.applicantName : ''
                                }
                            }, params.row.applicantName)
                        ])
                    }
                },
                {
                    title: '证件号码',
                    key: 'cardNo',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',

                                },
                                // domProps: {
                                //     title: params.row.cardNo
                                // }
                            }, params.row.cardNo)
                        ])
                    }
                }
            ],
            eventThead: [  //事件头部
                {
                    title: '收件编号',
                    key: 'receiptNo',
                    align: 'center',
                    ellipsis: 'true',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                // domProps: {
                                //     title: params.row.receiptNo
                                // }
                            }, params.row.receiptNo)
                        ])
                    }
                },
                {
                    title: '事件名称',
                    key: 'recObjectName',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    color: '#137ddf',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left',
                                },
                                domProps: {
                                    title: params.row.recObjectName.length > 20 ? params.row.recObjectName : '',
                                    id: params.row.receiptNo,
                                    click: 'openRecordView()',
                                },
                                on: {
                                    click: (e) => {
                                        // 解决列表页数据缓存问题
                                        // this.recordSerParam();
                                        // this.$store.commit('setState', {
                                        //     isMyRecTrigEdit: true
                                        // });
                                        unit.openNewDialog(this, '/myReceipt/eventDetails?id=' + params.row.id +
                                                                                        '&recriptType=3' + 
                                                                                        '&jointStatus=' + params.row.jointStatus + 
                                                                                        '&receiptNo=' + params.row.receiptNo);
                                        // this.$router.push(
                                        //     {
                                        //         path: '/myReceipt/eventDetails',
                                        //         query: {
                                        //             id: params.row.id,
                                        //             recriptType: '3',
                                        //             jointStatus: params.row.jointStatus,
                                        //             receiptNo: params.row.receiptNo,
                                        //         }
                                        //     }
                                        // );
                                    }
                                }
                            }, params.row.recObjectName)
                        ])
                    }
                },
                {
                    title: '收件时间',
                    key: 'createTime',
                    align: 'center',
                    render: (h, params) => {
                        let time;
                        if (params.row.createTime != null && params.row.createTime != '') {
                            time = params.row.createTime.indexOf('.0') > 0 ? params.row.createTime.substring(0, params.row.createTime.length - 2) : params.row.createTime;
                        } else {
                            time = '';
                        }
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                // domProps: {
                                //     title: time
                                // }
                            }, time)
                        ])
                    }
                },
                {
                    title: '申请人/申请单位',
                    key: 'applicantName',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left',
                                },
                                domProps: {
                                    title: params.row.applicantName.length > 20 ? params.row.applicantName : ''
                                }
                            }, params.row.applicantName)
                        ])
                    }
                },
                {
                    title: '证件号码',
                    key: 'cardNo',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',

                                },
                                // domProps: {
                                //     title: params.row.cardNo
                                // }
                            }, params.row.cardNo)
                        ])
                    }
                }
            ],
            ruleValidate: {       // 参数验证
                recordType: [

                ],
                applicantName: [
                    { min: 0, max: 100, message: '长度不大于100个字符', trigger: 'blur' }
                ],
                recObjectName: [
                    { max: 100, message: '长度不大于100个字符', trigger: 'blur' }
                ],
                cardNo: [
                    { max: 30, message: '长度不大于30个字符', trigger: 'blur' },
                    { pattern: '^[^\u4e00-\u9fa5]+$', message: '只能输入数字和字符', trigger: 'blur' }
                ],
                realRecNo: [
                    { max: 50, message: '长度不大于50个字符', trigger: 'blur' },
                    { pattern: '^[^\u4e00-\u9fa5]+$', message: '只能输入数字和字符', trigger: 'blur' } // '/^[0-9a-zA-Z]*$/'
                ],
                receiptNo: [
                    { max: 50, message: '长度不大于50个字符', trigger: 'blur' },
                    { pattern: '^[^\u4e00-\u9fa5]+$', message: '只能输入数字和字符', trigger: 'blur' } // '/^[0-9a-zA-Z]*$/'
                ],
                beginTime: [
                    { validator: validateBeginTime, trigger: 'blur' }
                ],
                endTime: [
                    { validator: validateEndTime, trigger: 'blur' }
                ],
            },
            viewDisplayDate: {    // 视图显示
                status: true,     // 高级搜索图标状态
                xia: status,      // 向下箭头
                shang: !status,   // 向上箭头
            },
            textDisplayDate: {    // 文本显示
                advancedSearch: '高级查询',   // 高级搜索显示文本
            },
            tableDate: {        // 表格头部data
                ttaskOffice: '', // 实现title属性内容的动态化
                tbDate: [],
                thColumns: this.matterThead,
            },
            searchTxtData: {
                applicantName: '',
                recObjectName: '',
                beginTime: '',
                endTime: '',
                cardNo: '',
                realRecNo: ''
            }
        }
    },
    computed: {
        xia: {
            get: function () {
                return this.viewDisplayDate.status;
            },
            set: function () {
                this.viewDisplayDate.xia = this.viewDisplayDate.status;
            }
        },
        shang: {
            get: function () {
                return !(this.viewDisplayDate.status);
            },
            set: function () {
                this.viewDisplayDate.xia = !(this.viewDisplayDate.status);
            }
        },
    },
    methods: {
        /**
         * 高级查询 点击
         */
        higSearchEvt() {
            this.textDisplayDate.advancedSearch = this.textDisplayDate.advancedSearch === '高级查询' ? '常规查询' : '高级查询';
            this.viewDisplayDate.status = !this.viewDisplayDate.status;
        },
        /**
         * 记录查询数据
         */
        recordSerParam() {
            let _that = this,
                myRecSerParam = {},
                stateObj = _that.$store.state;
            if(stateObj.isMyRecTrigEdit) { 
                _that.currentPageNo = parseInt(_that.myRecSerParam.currentPageNo);
                _that.$store.commit('setState', {
                    isMyRecTrigEdit: false
                });
            }
            myRecSerParam = {
                recordType: _that.formValidate.recordType,
                applicantName: _that.searchTxtData.applicantName,
                recObjectName: _that.searchTxtData.recObjectName,
                beginTime: _that.searchTxtData.beginTime,
                cardNo: _that.searchTxtData.cardNo,
                realRecNo: _that.searchTxtData.realRecNo,
                receiptNo: _that.formValidate.receiptNo,
                endTime: _that.searchTxtData.endTime,
                currentPageNo: _that.currentPageNo,
                pageSize: _that.pageSize,
                userId: _that.formValidate.userId,
                status: _that.viewDisplayDate.status
            };
            _that.$store.commit('setState', {
                myRecSerParam: myRecSerParam
            });
        },
        /**
         * 请求数据
         */
        handleSubmit(name, type) {
            let _that = this,
                flag = false,
                obj = {};
            if(type && type == '1') {
                _that.currentPageNo = 1;
            }
            _that.recordSerParam();
            _that.formValidate.currentPageNo = parseInt(_that.currentPageNo);
            _that.formValidate.pageSize = parseInt(_that.pageSize);
            // 保存查询的文本值 区别记录下拉框的值
            _that.searchTxtData = {
                applicantName: _that.formValidate.applicantName,
                recObjectName: _that.formValidate.recObjectName,
                beginTime: _that.formValidate.beginTime,
                endTime: _that.formValidate.endTime,
                cardNo: _that.formValidate.cardNo,
                realRecNo: _that.formValidate.realRecNo,
                receiptNo: _that.formValidate.receiptNo
            };
            
            _that.$refs['formValidate'].validate((valid) => {
                flag = valid;
            });
            
            // setTimeout(function() {
                // alert('flag');
                // alert(flag)
                if(!flag) {
                    return;
                }
                _that.formValidate.recordType == 2 ? _that.tableDate.thColumns = this.eventThead : _that.tableDate.thColumns = this.matterThead;
                let url = _that.formValidate.recordType == 2 ? '/znsj-web/myReceipt/recordEventList' : '/znsj-web/myReceipt/recordMattList';

                obj = Object.assign({}, _that.formValidate);
                obj.receiptNo = _that.formValidate.recordType == 2 ? obj.realRecNo : obj.receiptNo;
                obj.receiptNo = obj.receiptNo == '' ? '' : obj.receiptNo.trim();
                obj.realRecNo = obj.realRecNo == '' ? '' : obj.realRecNo.trim();
                let loading = _that.$loading({
                    lock: true,
                    text: '加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)',
                    customClass: 'el-mask'
                });
                unit.ajaxObjPost(url, obj, function (res) {
                    loading.close();
                    _that.$set(_that.tableDate, 'tbDate', res.data.rows);
                    // _that.tableDate.tbDate = res.data.rows;
                    _that.currentPageNo = res.data.pageNum;
                    _that.pageTotal = res.data.total;
                }, function (res) {
                    loading.close();
                    _that.$message.warning('服务端错误');
                }, _that);

            // }, 0);
            
        },
        /**
         * 导出
         */
        exportExcl: function () {
            let _that = this,
                flag = true,
                receiptType = '';

            this.$refs['formValidate'].validate((valid) => {
                if (!valid) {
                    _that.$Spin.hide();
                    flag = false;
                }
            });
            if (!flag) {
                return;
            }
            receiptType = _that.formValidate.recordType == 1 ? 'realRecNo' : 'receiptNo';
            let beginTime = _that.formValidate.beginTime == '' ? '' : unit.formatDate(_that.formValidate.beginTime, "yyyyMMdd") + '000000',
                endTime = _that.formValidate.endTime == '' ? '' : unit.formatDate(_that.formValidate.endTime, "yyyyMMdd") + '235959';
            var exportUrl = "/bog-receive-web/myReceipt/recordExport?recordType="
                + _that.formValidate.recordType + "&recObjectName="
                + _that.formValidate.recObjectName + "&beginTime="
                + beginTime + "&cardNo="
                + _that.formValidate.cardNo + "&"
                + receiptType
                + "="
                + _that.formValidate.realRecNo + "&endTime="
                + endTime + "&applicantName="
                + _that.formValidate.applicantName;
            exportUrl = encodeURI(exportUrl);
            window.open(exportUrl, '_self');
        },
        openRecordView: function () {
            this.$router.push(
                {
                    path: '/myReceipt/receiptList',
                    query: {
                        // id: params.row.id,
                        // type: '1'
                        id: params.row.id,
                        recriptType: params.row.type,
                        jointStatus: params.row.jointStatus,
                        receiptNo: params.row.realRecNo ? params.row.realRecNo : params.row.receiptNo,
                    }
                }
            );
            // unit.openNewDialog(this, '/myReceipt/receiptList/id=' + row.id + '&type=1');
        },
        /**
         * 当前页change
         */
        handlePage(value) {
            this.formValidate.currentPageNo = this.currentPageNo = value;
            this.handleSubmit('formValidate');
        },
        /**
         * 当前页数change
         */
        handlePageSize(value) {
            this.formValidate.pageSize = this.pageSize = value;
            this.handleSubmit('formValidate');
        },
        /**
         * 事项类型change事件
         */
        radioTypeChange() {
            this.formValidate.pageSize = this.pageSize = 10;
            this.handleSubmit('formValidate');
        },
        /**
         * 初始化记录信息
         */
        initRecordState() {
            let that = this,
                stateObj = that.$store.state;
            if(!stateObj.isMyRecTrigEdit) {
                return
            }
            that.myRecSerParam = stateObj.myRecSerParam;
            for(let key in that.myRecSerParam) {
               if(key == 'status'){
                    that.$set(that.viewDisplayDate, key, that.myRecSerParam[key]);
                }else if(key == 'currentPageNo' || key == 'pageSize') {
                    that.$set(that, key, that.myRecSerParam[key]);
                }else {
                    that.$set(that.formValidate, key, that.myRecSerParam[key]);
                }
            }
        },
    },
    /**
     * dom渲染后
     */
    mounted() {
        this.initRecordState();
        this.handleSubmit('formValidate', '1');
        unit.solveAnimFrame();
    },
    // 监听
    watch: {
        'formValidate.recordType': function (newName, oldName) {
            this.formValidate.currentPageNo = this.currentPageNo = 1;
            this.handleSubmit('formValidate');
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/styles/theme.less";
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
// .ivu-select-dropdown {
//     width: 250px;
// }
#myReceipt {
    width: 100%;
    min-width: 1100px;
    height: 100%;
    overflow: auto;
    padding: 0 25px;
    .ivu-btn-primary {
        background-color: #137ddf;
        border-color: #137ddf;
    }
    .higher-search-a {
        color: #2d8cf0;
    }
    .ivu-radio-wrapper {
        vertical-align: baseline;
    }
    .input-wrap {
        .ivu-form-item {
            .ivu-form-item-label {
                width: 120px !important;
                padding: 10px 6px 10px 0 !important;
            }
            .ivu-form-item-content {
                margin-left: 130px !important;
            }
        }
    }
    .main-wrap {
        background-color: #fff;
        padding: 20px 20px 15px 20px;
        .chaxun {
            line-height: 1;
        }
        .ivu-table-header th {
            background-color: #f4f6f9 !important;
        }
    }
    .ivu-form .ivu-form-item-label {
        padding-top: 13px;
        font-size: 12px;
    }
    // .ivu-radio-wrapper,
    // .el-pager li ,
    // .ivu-form-item-label,
    // .ivu-btn-primary,
    // .el-input__inner,
    // .el-pagination__total,
    // .el-pagination__jump {
    //     font-size: @baseSize;
    // }
    .query-wrap {
        .ivu-form-item-content {
            margin-left: 20px;
        }
    }
}
</style>
