/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-14 20:41:35
 * @description 单、多收件-材料核查
 */
<template>
    <div id="materialVerification" @click="refreshData($event)">
        <div class="material-verification-wrap">
            <div class="nav-wrap" style="margin-left:-20px">
                <slideNav :step="step" :status="navStatus"></slideNav>
            </div>
            <div class="content-box">
                <div class="form-item" v-for="(item ,index) in verData" @mouseover="mouse(index)">
                    <!-- 头部标题部分 -->
                    <div class="head">
                        <detailHead :titles="item.matterName"></detailHead>
                    </div>
                    <!-- 主要内容 -->
                    <div class="content">
                        <p class="verification-tips" v-if="showTip">提示：表格底色相同的材料，请根据实际情况选择1个或多个进行核查</p>
                        <div class="table-wrap">
                            <Table border :columns="verTable" :data="item.matterialList" :row-class-name="tableRowClassName"></Table>
                        </div>
                    </div>
                </div>

                <!-- 按钮部分 -->
                <div class="btn-wrap">
                    <i-button class="mr10 step6" @click="printMatterial">打印收件材料清单</i-button>
                    <i-button class="mr10 step" @click="handleLast">上一步</i-button>
                    <i-button type="primary" class="step" @click="handleNext">下一步</i-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import util from "@/api";
import slideNav from "@/components/common/slideNav2";
import detailHead from "@/components/common/detailHead";   // 公共头部
import selectLook from '@/pages/consigneeCenter/oddGuide/selectLook';
import checkLook from '@/pages/consigneeCenter/oddGuide/checkLook';
import selectLook1 from '@/pages/consigneeCenter/oddGuide/selectLook1';
export default {
    param: {
        type: Object,
        default: {}
    },
    components: {
        slideNav,
        detailHead,
        selectLook,
        selectLook1,
        checkLook
    },
    data() {
        return {
            isClick: true,
            
            obj: {}, //缓存or关系数据
            showTip: false,
            titles: '',
            //缓存当前复选框index
            index: '',
            // 导航面板的状态
            step: 3,
            navStatus: 1,
            checkAll: false,
            verTable: [
                {
                    type: 'index',
                    title: '序号',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '材料名称',
                    // width: 280,
                    width: 200,
                    key: 'matterialName'
                },
                {
                    title: '来源渠道',
                    width: 100,
                    key: 'source',
                    align: 'center'
                },
                {
                    title: '材料形式及份数',
                    // width: 200,
                    width: 150,
                    key: 'formTxt'
                },
                {
                    title: '审查要点',
                    key: 'data4',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        let $this = this,
                            html = [h("p", params.row.contentTxt)];
                        if (params.row.groupMatterialList && params.row.groupMatterialList.length > 1) {
                            if (!params.row.contentTxtFlag) {
                                return h('span', '/');
                            } else {
                                return h(checkLook, {
                                    props: {
                                        row: params.row.groupMatterialList
                                    }
                                });
                            }
                        } else {
                            if (params.row.contentAttch && params.row.contentTxt) {
                                return h('Tooltip', {
                                    props: {
                                        placement: 'left',
                                        transfer: true
                                    },
                                    style: {
                                        'white-space': 'normal'
                                    }
                                }, [
                                        h('a', {
                                            style: {
                                                color: '#2D8cF0'
                                            },
                                            attrs: {
                                                target: '_blank'
                                            },
                                            domProps: {
                                                innerHTML: '查看'
                                            }
                                        }),
                                        h('Icon', {
                                            props: {
                                                type: 'md-image'
                                            },
                                            style: {
                                                // verticalAlign: 'top',
                                                color: '#2b85e4',
                                                cursor: 'pointer'
                                            },
                                            on: {
                                                'click': (e) => {
                                                    util.openFullWindow(params.row.contentAttch);
                                                }
                                            }
                                        }),
                                        h('div', {
                                            slot: 'content'
                                        }, html),
                                    ])
                            } else if (params.row.contentAttch) {
                                return h('span',
                                    [
                                        h('a', {
                                            style: {
                                                color: '#2D8cF0'
                                            },
                                            attrs: {
                                                target: '_blank'
                                            },
                                            domProps: {
                                                innerHTML: '查看'
                                            }
                                        }),
                                        h('Icon', {
                                            props: {
                                                type: 'md-image'
                                            },
                                            style: {
                                                // verticalAlign: 'top',
                                                color: '#2b85e4',
                                                cursor: 'pointer'
                                            },
                                            on: {
                                                'click': (e) => {
                                                    util.openFullWindow(params.row.contentAttch);
                                                }
                                            }
                                        })
                                    ])
                            } else if (params.row.contentTxt) {
                                return h('Tooltip', {
                                    props: {
                                        placement: 'left',
                                        transfer: true
                                    },
                                    style: {
                                        'white-space': 'normal'
                                    }
                                }, [
                                        h('a', {
                                            style: {
                                                color: '#2D8cF0'
                                            },
                                            attrs: {
                                                target: '_blank'
                                            },
                                            domProps: {
                                                innerHTML: '查看'
                                            }
                                        }),
                                        h('div', {
                                            slot: 'content'
                                        }, html)
                                    ])
                            } else {
                                return h('span', '/');
                            }
                        }
                    }
                },
                {
                    title: '必要性',
                    key: 'isNeedTxt',
                    align: 'center',
                },
                {
                    title: '示例',
                    key: 'data6',
                    align: 'center',
                    render: (h, params) => {
                        let $this = this;
                        if (params.row.groupMatterialList && params.row.groupMatterialList.length > 1) {
                            if (!params.row.sampleUrlFlag) {
                                return h('span', '/');
                            } else {
                                return h(selectLook1, {
                                    props: {
                                        row: params.row.groupMatterialList,
                                        type: 'sampleUrl'
                                    }
                                });
                            }
                        } else {
                            if (params.row.sampleUrl) {
                                return h('a', {
                                    style: {
                                        color: '#2D8cF0'
                                    },
                                    attrs: {
                                        target: '_blank'
                                    },
                                    domProps: {
                                        innerHTML: '查看'
                                    },
                                    on: {
                                        'click': (e) => {
                                            util.openFullWindow(params.row.sampleUrl);
                                        }
                                    }
                                })
                            } else {
                                return h('span', '/');
                            }
                        }
                    }
                },
                {
                    title: '空表',
                    key: 'data7',
                    align: 'center',
                    render: (h, params) => {
                        let $this = this;
                        if (params.row.groupMatterialList && params.row.groupMatterialList.length > 1) {
                            if (!params.row.blankFormFlag) {
                                return h('span', '/');
                            } else {
                                return h(selectLook, {
                                    props: {
                                        row: params.row.groupMatterialList,
                                        type: 'blankForm',
                                        showWrap: params.row.showWrap
                                    }
                                });
                            }
                        } else {
                            if (params.row.blankForm) {
                                return h('a', {
                                    style: {
                                        color: '#2D8cF0'
                                    },
                                    attrs: {
                                        target: '_blank'
                                    },
                                    domProps: {
                                        innerHTML: '查看'
                                    },
                                    on: {
                                        'click': (e) => {
                                            util.openFullWindow(params.row.blankForm);
                                        }
                                    }
                                })
                            } else {
                                return h('span', '/');
                            }
                        }
                    }
                },
                {
                    title: '材料确认',
                    key: 'formTxt',
                    // width: 150,
                    width: 140,
                    render: (h, params) => {
                        let $this = this;
                        return h('Checkbox', {
                            props: {
                                'value': params.row.check
                            },
                            on: {
                                'on-change': (val) => {
                                    $this.findData('id', params, val);
                                }
                            }
                        }, [
                                h('span', '符合')
                            ])
                    },
                    renderHeader: (h, params) => {
                        let $this = this;
                        return h('Checkbox', {
                            props: {
                                'value': $this.checkAll
                            },
                            on: {
                                'on-change': (val) => {
                                    if ($this.isClick) {
                                        $($this.verData[$this.index].matterialList).each(function (index, obj) {
                                            obj.check = val;
                                        });
                                    }
                                }
                            }
                        }, [
                                h('span', '材料确认')
                            ])
                    }
                }
            ],
            verData: [

            ]
        }
    },
    methods: {
        refreshData(e) {
            let $ele = $(e.target).closest('.m-wrap');
            if ($ele.length == 0) {
                $('.m-wrap .select-wrap').addClass('hide');
                $('.m-wrap .hover-wrap').addClass('hide');
            }

        },
        tableRowClassName(row, rowIndex) {
            if (row.selectType == 1) {
                return 'select';
            } else {
                return '';
            }
        },
        init() {
            let $this = this;
            $this.checkAll = true;
            setTimeout(function () {
                $this.checkAll = false;
            }, 0);

            this.matterialList();
        },
        printMatterial() {
            let url = this.$store.state.path + '/consignee/printMatterial?receiptNo=' + this.$parent.param.receiptNo;
            util.openFullWindow(url, '');
        },
        mouse(index) {
            this.index = index;
        },
        handleNext() {
            let flag = this.checkData();
            if (flag) {
                this.saveData();
            }
        },
        handleLast() {
            this.$emit('go', 'caseGuidance');
        },
        //数据保存
        saveData() {
            let $this = this,
                obj = this.saveDataHandle(),
                recObjectVersion = '',
                id = '',
                recObjectCode = '',
                name = '';
            if (obj.matterList && obj.matterList.length > 0) {
                for (let i = 0; i < obj.matterList.length; i++) {
                    recObjectVersion += obj.matterList[i].matterVersion + ',';
                    id += obj.matterList[i].id + ',';
                    recObjectCode += obj.matterList[i].matterCode + ',';
                    name += obj.matterList[i].matterName + ',';
                }
                recObjectVersion = recObjectVersion.substring(0, recObjectVersion.length - 1);
                id = id.substring(0, id.length - 1);
                recObjectCode = recObjectCode.substring(0, recObjectCode.length - 1);
                name = name.substring(0, name.length - 1);
            }
            util.ajaxObjPost('/znsj-web/consignee/matter/saveMatterial', obj, function (res) {
                $this.$emit('go', 'infoFill', {
                    recObjectVersion: recObjectVersion,
                    // id: id,
                    recObjectCode: recObjectCode,
                    name: name,
                    type: 3,
                    flag: true
                });
            }, function (res) {
                $this.$Message.error(res.data.errMsg);
            })
        },
        //保存数据处理
        saveDataHandle() {
            let param = {},
                matterList = this.verData,
                len = matterList.length;
            param.receiptNo = this.$parent.param.receiptNo,
                param.matterList = [];
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < matterList[i].matterialList.length; j++) {
                    if (matterList[i].matterialList[j].check) {
                        matterList[i].matterialList[j].matterialCheck = 1;
                    } else {
                        matterList[i].matterialList[j].matterialCheck = 0;
                    }
                    matterList[i].matterialList[j].matterialCode = matterList[i].matterialList[j].code;
                }
            }
            param.matterList = matterList;
            return param;
        },
        //数据校验
        checkData() {
            let matterList = this.verData,
                len = matterList.length,
                k = 0,
                temp = this.obj;
            for (let j = 0; j < len; j++) {
                k = 0;
                for (let i = 0; i < matterList[j].matterialList.length; i++) {
                    if (matterList[j].matterialList[i].selectType == 1 && temp[matterList[j].matterialList[i].asscGroupId] > 0 && !matterList[j].matterialList[i].check) {
                        k++;
                        if (temp[matterList[j].matterialList[i].asscGroupId] == k) {
                            this.$Message.error('请核查选中区域');
                            return false;
                        }
                    } else if (matterList[j].matterialList[i].isNeed == 1 && !matterList[j].matterialList[i].check) {
                        this.$Message.error(matterList[j].matterialList[i].matterialName + '未核查');
                        return false;
                    }
                }
            }
            return true;
        },
        //找到或关系的数据
        handleDataMore(data) {
            let $this = this,
                matterList = data,
                len = matterList.length,
                temp = {},
                arr = [];
            for (let j = 0; j < len; j++) {
                for (let i = 0; i < matterList[j].matterialList.length; i++) {
                    if (matterList[j].matterialList[i].selectType == 1) {
                        temp[matterList[j].matterialList[i].asscGroupId] = 0;
                    }
                }
            }
            for (let j = 0; j < len; j++) {
                for (let i = 0; i < matterList[j].matterialList.length; i++) {
                    if (matterList[j].matterialList[i].selectType == 1 && temp[matterList[j].matterialList[i].asscGroupId] >= 0) {
                        temp[matterList[j].matterialList[i].asscGroupId]++;
                    }
                }
            }
            this.obj = temp;
        },
        // 数据查找
        findData(attr, data, val) {
            let $this = this,
                matterList = this.verData,
                len = matterList.length,
                $index = 0,
                num = 0;
            for (let j = 0; j < len; j++) {
                for (let i = 0; i < matterList[j].matterialList.length; i++) {
                    if (matterList[j].matterialList[i][attr] == data.row[attr]) {
                        $this.verData[j].matterialList[i].check = val;
                        $index = j;
                    }
                }
            }


            for (let i = 0; i < matterList[$index].matterialList.length; i++) {
                if ($this.verData[$index].matterialList[i].check) {
                    num++;
                }
            }

            this.isClick = false;
            let className = $('.ivu-table-wrapper .ivu-table-header th .ivu-checkbox').eq($index).attr('class');
            if (num == matterList[$index].matterialList.length && className.indexOf('ivu-checkbox-checked') == -1) {
                $('.ivu-table-wrapper .ivu-table-header th input').eq($index).click();
            } else if (num < matterList[$index].matterialList.length && className.indexOf('ivu-checkbox-checked') != -1) {
                $('.ivu-table-wrapper .ivu-table-header th input').eq($index).click();
            }
            this.isClick = true;
        },
        //创建事项收件（单/多事项）
        matterialList() {
            let $this = this;

            util.ajaxObjPost('/znsj-web/consignee/matter/matterialList', {
                receiptNo: $this.$parent.param.receiptNo,
                isBack: "0"  //是否上一步 0:否  1：是
            }, function (res) {
                let matterList = res.data.matterList,
                    matterLen = matterList.length;

                for (let j = 0; j < matterLen; j++) {

                    if (matterList[j].matterialList && matterList[j].matterialList.length > 0) {
                        for (let i = 0; i < matterList[j].matterialList.length; i++) {
                            if (matterList[j].matterialList[i].groupMatterialList && matterList[j].matterialList[i].groupMatterialList.length > 0) {
                                matterList[j].matterialList[i].sampleUrlFlag = $this.handlePop(matterList[j].matterialList[i], 'sampleUrl');
                                matterList[j].matterialList[i].blankFormFlag = $this.handlePop(matterList[j].matterialList[i], 'blankForm');
                                matterList[j].matterialList[i].contentTxtFlag = $this.handlePop(matterList[j].matterialList[i], 'contentTxt');
                            }

                            matterList[j].matterialList[i].check = false;

                        }
                    } else {
                        matterList[j].matterialList = [];
                    }

                }
                $this.verData = matterList;
                $this.handleDataMore(matterList);
            }, function (res) {

            }, this);
        },
        // 处理材料提示
        handlePop(data, id) {
            let num = 0;
            for (let k = 0; k < data.groupMatterialList.length; k++) {
                if (!data.groupMatterialList[k][id]) {
                    num++;
                }
            }
            if (num == data.groupMatterialList.length) {
                return false;
            } else {
                return true;
            }
        }
    },
    mounted() {
        this.matterialList();
    }
}
</script>
<style lang="less">
@import "../../../assets/styles/color.less";
#materialVerification {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    // padding-left: 20px;
    overflow-x: hidden;
    br {
        display: none !important;
    }
    .material-verification-wrap {
        width: 100%;
        height: 100%;
        padding: 0px 0px 20px 20px;
        background: #fff;
        overflow-y: auto;
        overflow-x: hidden;
        .content-box {
            padding-right: 100px;
        }
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
            .ivu-btn {
                // width: 128px;
            }
            .step6 {
                padding-left: 20px;
                padding-right: 20px;
            }
        }
    }
    .ivu-table-row.select td {
        background: #eab593;
    }
    .ivu-table-hide {
        opacity: 1;
    }
    .ivu-table,
    .ivu-table-cell {
        overflow: visible;
    }
    .ivu-tooltip-inner p {
        white-space: normal;
    }
}
</style>
