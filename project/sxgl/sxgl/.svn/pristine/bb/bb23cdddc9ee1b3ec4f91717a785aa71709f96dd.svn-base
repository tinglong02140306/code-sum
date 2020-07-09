/*
 * @Author: lhqin 
 * @Date: 2018-10-30 15:52:04 
 * @Last Modified by: lhqin
 * @Last Modified time: 2018-10-30 17:22:23
 */

<template>
    <div id="receiptConfig" class="pr20 pl20">
        <!-- 查询条件（基本查询）start -->
        <div class="search-wrap">
            <el-row>
                <el-col :span="6">
                    <label class="mr5">行政区划</label>
                    <div class="inline-block common-width">
                        <Cascader class="inline-block bwidth" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select filterable @on-change="changeXzqh" :transfer="true"></Cascader>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="mr5">所属部门</label>
                    <div class="inline-block common-width">
                        <el-select class="bwidth" v-model="deptVal" size="small" filterable>
                            <el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="10">
                    <label class="mr5">事项名称</label>
                    <div class="inline-block common-other-width">
                        <el-input v-model="matterNameVal" :maxlength="100" placeholder="请输入事项名称" size="small"></el-input>
                    </div>
                    <div class="inline-block ml30">
                        <el-button class="mr10 w70" type="primary" size="mini" @click="searchEvt">查询</el-button>
                        <a ref="higSearch" class="higher-search-a text-blue fz14" href="javascript:void(0)" v-bind:class="" @click="higSearchEvt">
                            <span>{{ higSerMsg }}</span>
                            <i class="iconfont icon-xia"></i>
                        </a>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 查询条件（高级查询）start -->
        <div class="search-wrap" v-bind:class="{hide:isHigRow}">
            <el-row>
                <el-col :span="6">
                    <label class="mr5">事项分类</label>
                    <div class="inline-block common-width matt-class">
                        <el-select v-model="matterClassifyVal" size="small">
                            <el-option v-for="item in matterClaData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="6">
                    <label class="mr5">事项类型</label>
                    <div class="inline-block common-width">
                        <el-select class="bwidth" v-model="matterTypeVal" size="small">
                            <el-option v-for="item in matttypeData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="10">
                    <label class="mr5">事项编码</label>
                    <div class="inline-block common-other-width">
                        <el-input v-model="matterCodeVal" :maxlength="50" placeholder="请输入事项编号" style="width: 210px" size="small" />
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="6">
                    <div class="pl20">
                        <label class="mr10">状态</label>
                        <div class="inline-block status-width">
                            <el-select class="bwidth" v-model:value="statusVal" size="small">
                                <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
            </el-row>

        </div>

        <div class="pr10">

            <!-- 事项列表start -->
            <div class="list-wrap mt30" id="maskPanel">
                <el-table :data="receiptConfigData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="light" border>
                    <!-- 展开项 -->
                    <el-table-column type="expand" prop="children" label="展/收" width="60">
                        <template scope="scope">
                            <el-table :data="scope.row.childs" tooltip-effect="light" border>
                                <el-table-column label="事项名称" show-overflow-tooltip>
                                    <template scope="scope">
                                        <a :title="scope.row.matterName" href="javascript:void(0);" class="mattLink" @click="goSituationConfig($event,scope.row)">{{scope.row.matterName}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="行政区划" width="110" show-overflow-tooltip>
                                    <template scope="scope">
                                        <span :title="scope.row.adminDivName">{{scope.row.adminDivName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="deptName" label="所属部门" show-overflow-tooltip>
                                    <template scope="scope">
                                        <span :title="scope.row.deptName">{{scope.row.deptName}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <!-- 展开项结束 -->
                    <el-table-column label="事项名称" show-overflow-tooltip>
                        <template scope="scope">
                            <a :title="scope.row.matterName" href="javascript:void(0);" class="mattLink" @click="goSituationConfig($event,scope.row)">{{scope.row.matterName}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="行政区划" width="110" show-overflow-tooltip>
                        <template scope="scope">
                            <span :title="scope.row.adminDivName">{{scope.row.adminDivName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属部门" show-overflow-tooltip>
                        <template scope="scope">
                            <span :title="scope.row.deptName">{{scope.row.deptName}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block fr mt20">
                    <el-pagination :total="total" :page-size="pageSize" @size-change="cfgSizeChange" @current-change="cfgCurrentChange" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </div>
            <!-- 事项列表end -->
        </div>

    </div>

</template>
<script>
import unit from '@/api/index';
export default {
    data() {
        return {
            isHigRow: true,
            higSerMsg: '更多',

            saveXzqh: [], // 暂存行政区划
            saveFlag: true, // 暂存标志

            xzqhVal: [], // 行政区划
            deptVal: '', // 所属部门
            matterNameVal: '', // 事项名称
            matterClassifyVal: '', // 事项分类
            matterTypeVal: '', // 事项类型
            matterCodeVal: '', // 事项编号
            statusVal: '', // 状态

            currentPage: 1,
            pageSize: 10,
            total: 0,
            receiptConfigData: [],

            proData: [],
            statusData: [],
            deptData: [],
            matterClaData: [],
            matttypeData: []
        };
    },
    methods: {
        /*
        ** 行政区划改变联动部门
        */
        changeXzqh(value, selectedData) {
            let _that = this;
            if (value.length === 0) { // 行政区划清空时部门和机构清空
                _that.deptData = [];
                _that.deptVal = '';
            } else {
                _that.xzqhVal = value;
            }
            if (!this.saveFlag) {
                _that.getDeptData();// 联动部门
            }
        },
        /*
        ** 01 禁用按钮 02 启用按钮
        */
        isDisFun(row) {
            switch (row.status) {
                case '01':
                    return false;
                case '02':
                    return true;
            }
        },
        /*
        ** 01 启用按钮 02 禁用按钮
        */
        isDisRevseFun(row) {
            switch (row.status) {
                case '01':
                    return true;
                case '02':
                    return false;
            }
        },
        /*
        ** 展/收列，类的回调
        */
        getRowClass: function (row, rowIndex) {
            if (row.row.childs == null || row.row.childs.length == 0) { // 无子项
                return 'row-expand-cover';
            }
        },
        /*
        ** 切换更多、常规
        */
        higSearchEvt(e) {
            this.isHigRow = this.isHigRow !== true;
            let iEle = $(e.target)
                .parent()
                .find('i');
            this.higSerMsg = this.higSerMsg === '更多' ? '常规' : '更多';
            iEle.hasClass('icon-xia')
                ? iEle.removeClass('icon-xia').addClass('icon-shang')
                : iEle.removeClass('icon-shang').addClass('icon-xia');
        },
        /*
        ** 获取事项配置列表数据
        */
        getConfigData() {
            let _that = this,
                jsonObj = {
                    adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1],
                    deptCode: _that.deptVal,
                    matterClassify: _that.matterClassifyVal,
                    matterCode: _that.matterCodeVal,
                    matterName: _that.matterNameVal,
                    matterType: _that.matterTypeVal,
                    status: _that.statusVal,
                    pageNum: _that.currentPage,
                    pageSize: _that.pageSize
                };
            unit.ajaxObjPost('/znsj-web/matterAllocation/getAll', jsonObj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.total = data.total;
                    _that.currentPage = data.pageNum;
                    data = data.rows;
                    $.each(data, function (index, item) {
                        item.matterName =
                            item.matterName === (null || '') ? '--' : item.matterName;
                        item.adminDivName = item.adminDivName === null ? '--' : item.adminDivName;
                        item.deptName = item.deptName === (null || '') ? '--' : item.deptName;
                    });
                    _that.receiptConfigData = data;
                } else {
                    _that.$message.warning('请求数据失败');
                }
            }, function (res) {
                _that.$message.warning('请求数据失败');
            }, _that);
        },
        /*
        ** 查询
        */
        searchEvt() {
            let _that = this;
            _that.getConfigData();
        },
        /*
        ** 事项列表每页显示数据量变更
        */
        cfgSizeChange: function (val) {
            let _that = this;
            _that.pageSize = val;
            _that.currentPage = 1;
            _that.getConfigData();
        },
        /*
        ** 事项列表页码变更
        */
        cfgCurrentChange: function (val) {
            let _that = this;
            _that.currentPage = val;
            _that.getConfigData();
        },
        /*
        ** 跳转事项配置页面
        */
        mattConfigEvt($event, row) {
            this.$router.push({
                path: '/configInfoPage',
                query: {
                    id: row.id,
                    name: row.matterName,
                    matteCode: row.matterCode,
                    matteVersion: row.matterVersion
                }
            });
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this,
                obj = {
                    value: _that.xzqhVal[0]
                };
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData.do', obj, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    });
                    _that.proData = res.data;
                    setTimeout(function () {
                        _that.getDefaultXzqh();
                    }, 0);
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 点击行政区划加载子项
        */
        xzqhLoadData(item, callback) {
            let _that = this,
                qhCode = item.value,
                itenLen = item.__value.split(',').length;
            item.loading = true;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData.do', obj, function (result) {
                    if (result.flag == true) {
                        if (itenLen < 4) {
                            if (result.data.length != 0) {
                                $.each(result.data, function (i, t) {
                                    if (t.existChild) {
                                        t.children = [];
                                        t.loading = false;
                                    }
                                });
                            }
                        }
                        item.children = result.data;
                        if (_that.saveFlag) {
                            setTimeout(function () {
                                _that.xzqhVal = _that.saveXzqh;
                                _that.getDeptData();
                                _that.saveFlag = false;
                            }, 0);
                        }
                    } else {
                        _that.$message.warning('服务端错误');
                    }
                    item.loading = false;
                    callback();
                }, function (result) {
                    _that.$message.warning('服务端错误');
                }, _that);
            }, 300);
        },
        /*
        ** 获取部门字典
        */
        getDeptData() {
            let _that = this,
                obj = {
                    adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getDeptList.do', obj, function (res) {
                if (res.flag == true) {
                    _that.deptData = res.data;
                    _that.deptData.unshift({
                        label: '全部',
                        value: ''
                    });
                    _that.deptVal = '';
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取字典值公共方法
        */
        getDictionarys(str) {
            let _that = this,
                obj = {
                    pinYinType: str
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    if (str === 'XZQH') {
                        _that.saveXzqh = [data[0].value, data[1].value]; // 暂存行政区划，供后面调用
                        _that.xzqhVal = [data[0].value, data[1].value];
                    } else if (str === 'SXFL') {
                        _that.matterClaData = data;
                        _that.matterClaData.unshift({
                            label: '全部',
                            value: ''
                        });
                        _that.matterClassifyVal = '';
                    } else if (str === 'SXLX') {
                        _that.matttypeData = data;
                        _that.matttypeData.unshift({
                            label: '全部',
                            value: ''
                        });
                        _that.matterTypeVal = '';
                    } else if(str === 'sjzt') {
                        _that.statusData = data;
                        _that.statusData.unshift({
                            label: '全部',
                            value: ''
                        });
                        _that.statusVal = '';
                    }
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取默认行政区划
        */
        getDefaultXzqh() {
            let _that = this;
            _that.getDictionarys('XZQH');
        },
        /*
        ** 事项分类字典
        */
        getMatterClaData() {
            let _that = this;
            _that.getDictionarys('SXFL');
        },
        /*
        ** 事项类型字典
        */
        getSxlxData() {
            let _that = this;
            _that.getDictionarys('SXLX');
        },
        /*
        ** 状态字典
        */
        getStatusData() {
            let _that = this;
            _that.getDictionarys('sjzt');
        },
        /*
        ** 点击列表事项名称
        */
        goSituationConfig($event, row) {
            let _that = this,
            mattName = row.matterName;
            _that.$emit('getMattName',mattName);

        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.getXzqhTreeData();// 获取行政区划
            setTimeout(function () {
                _that.getConfigData();// 事项列表
            }, 300);
            _that.getMatterClaData();// 事项分类字典
            _that.getSxlxData();// 事项类型字典
            _that.getStatusData();// 状态字典
            // 解决ie兼容性问题 requestAnimationFrame
            unit.solveAnimFrame();
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#receiptConfig {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    .el-dialog__wrapper {
        .el-dialog {
            width:75%;
            .el-dialog__header {
                background-color: #409eff;
            }
            .el-dialog__header .el-dialog__title, .el-dialog__headerbtn .el-dialog__close {
                color: #fff;
            }
            .el-dialog__body {
                padding: 10px 20px;
            }
        }
    }   

    .el-table {
        font-size: 14px;
    }

    .el-table thead td, .el-table thead th {
        padding: 8px 0;
    }

    .el-table tbody td {
        padding: 8px 0;
    }

    .el-dropdown-menu {
        width:10%;
    }
    
    .el-button--primary {
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;
    }

    .btn-groups {
        margin-top:25px;
    }
    
    .search-wrap {
        padding-left: 12px;
        margin-top: 18px;
    }

    .list-wrap .ivu-table-body {
        color: #515a6e;
    }

    .ivu-table td.matters-name {
        .ivu-table-cell {
            padding-left: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .a-color-red {
        a {
            color: #288ff4;
        }
    }

    .tab-cell-drop {
        cursor: pointer;
        margin-left: 10px;
    }

    .row-expand-cover {
        td:first-child .el-table__expand-icon {
            display: none;
        }
    }

    .common-width {
        width: 67%;
    }

    .bwidth {
        width:100%;
    }

    .common-other-width {
        width: 40%;
    }

    .matt-class {
        .el-select {
            width:100%;
        }
    }

    .status-width {
        width: 71.5%;
    }

     .mattLink {
        color: #1255B3;
    }
    
    .el-table__expanded-cell {
        .el-table {
            width: 91%;
            margin: 5px auto;
        }
    }
        
    
}
</style>
