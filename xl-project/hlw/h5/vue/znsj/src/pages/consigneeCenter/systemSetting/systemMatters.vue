/*
 * @Author: lhqin 
 * @Date: 2018-09-28 15:51:18 
 * @Last Modified time: 2018-10-17 22:21:15 */
<template>
    <div id="systemMatters">
        <div class="search-matters">
            <tabNavigate :tabs="tabs"></tabNavigate>
            <div class="main-wrap clearfix">
                <!-- 查询条件start -->
                <Row class="search-wrap">
                    <Col span="3">
                    <Radio-group v-model="recordType" @on-change="radioChange">
                        <Radio label="1">事项</Radio>
                        <Radio label="2">一件事</Radio>
                    </Radio-group>
                    </Col>
                    <Col span="5">
                    <label class="inline-block mr10">行政区划</label>
                    <Cascader class="inline-block xzqhWt" :title="xzqhValShow.substring(0,xzqhValShow.length-1)" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select @on-change="changeXzqh" :transfer="true"></Cascader>
                    </Col>
                    <Col :span="5">
                    <label class="inline-block mr10">所属部门</label>
                    <div class="inline-block dept-width">
                        <Select v-model="deptVal" :transfer="true" filterable>
                            <Option v-for="item in deptData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    </Col>
                    <Col :span="5">
                    <label class="inline-block mr10">事项名称</label>
                    <div class="inline-block obj-width">
                        <el-input v-model="matterName" :maxlength="100" placeholder="请输入事项名称" size="small" @change="changeMatterName"></el-input>
                    </div>
                    </Col>
                    <Col span="4" style="float: left;" class="clearfix">
                    <Button style="float: left;" type="primary" class="chaxun" @click="searchEvt">查询</Button>
                    <a ref="higSearch" style="margin-left: 15px;float: left;line-height: 29px;" class="higher-search-a font-min" href="javascript:void(0)" @click="higSearchEvt">
                        <span>{{ higSerMsg }}</span>
                        <i class="iconfont" v-bind:class="{'icon-xia': xia,'icon-shang': shang}"></i>
                    </a>
                    </Col>
                </Row>
                <!-- 查询条件end -->

                <!-- 地区联动start -->
                <div class="mt10 clearfix" v-if="isHigRow">
                    <Row>
                        <Col :span="3">
                        <span style="visibility:hidden;">占位</span>
                        </Col>
                        <Col :span="5">
                        <label class="inline-block mr10">事项分类</label>
                        <div class="inline-block obj-width">
                            <Select v-model="matterClassifyVal" :transfer="true">
                                <Option v-for="item in matterClaData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        </Col>
                        <Col :span="5">
                        <label class="inline-block mr10">事项类型</label>
                        <div class="inline-block obj-width">
                            <Select v-model="matterTypeVal" :transfer="true">
                                <Option v-for="item in matttypeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        </Col>
                        <Col :span="5">
                        <label class="inline-block mr10">事项编码</label>
                        <div class="inline-block obj-width">
                            <el-input v-model="matterCodeVal" :maxlength="50" placeholder="请输入事项编码" size="small" @change="changeMatterCodeVal" />
                            </el-input>
                        </div>
                        </Col>
                    </Row>
                    <Row class="mt10 clearfix">
                        <Col :span="3">
                        <span style="visibility:hidden;">占位</span>
                        </Col>
                        <Col :span="5">
                        <label class="inline-block mr10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态</label>
                        <div class="inline-block obj-width">
                            <Select class="bwidth" v-model="statusVal" :transfer="true">
                                <Option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        </Col>
                    </Row>
                </div>
                <!-- 地区联动end -->

                <!-- 事项列表start -->
                <div class="mt20 pb20" id="maskPanel">
                    <div ref="mattPanel" class="panel-border">
                        <!-- 事项列表 -->
                        <el-table :data="mattersData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="dark">
                            <!-- 展开项start -->
                            <el-table-column type="expand" prop="childs" label="" width="40">
                                <template scope="scope">
                                    <el-table :data="scope.row.childs" tooltip-effect="dark" :show-header="false">
                                        <el-table-column label="事项名称" width="310" prop="matterName" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="行政区划" prop="adminDivName" align="center" width="140" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="对接状态" prop="jointStatusTxt" align="center" width="140" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" width="290" align="center">
                                            <template slot-scope="scope">
                                                <el-button class="theme-color" size="mini" type="primary" @click="goCaseGuide(scope.$index, scope.row)" v-if="scope.row.jointStatus==0">启用</el-button>
                                                <el-button size="mini" @click="goCaseGuide(scope.$index, scope.row)" v-else>停用</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column label="事项名称" width="310" prop="matterName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="行政区划" prop="adminDivName" align="center" width="140" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="对接状态" prop="jointStatusTxt" align="center" width="140" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作" width="290" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="goCaseGuide(scope.$index, scope.row)" v-if="scope.row.jointStatus==0">启用</el-button>
                                    <el-button size="mini" @click="goCaseGuide(scope.$index, scope.row)" v-else>停用</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt15">
                            <el-pagination :total="matTotal" :page-size="matPageSize" @size-change="matSizeChange" @current-change="matCurrentChange" :current-page="matCurPage" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <!-- 事项列表end -->
            </div>
        </div>
    </div>
</template>
<script>
import unit from '@/api/index';
import tabNavigate from "@/components/common/tabNavigate";   // 页签导航

export default {
    components: {
        tabNavigate: tabNavigate
    },
    data() {
        return {
            tabs: ['系统设置'],

            xia: true,
            shang: false,
            isHigRow: false,

            recordType: '1',
            deptVal: 'all',
            xzqhVal: [''],
            xzqhValShow:"", //级联选择器的title
            matterName: '',
            matterClassifyVal: '',
            matterTypeVal: '', // 事项类型
            matterCodeVal: '',
            statusVal: '', // 状态
            higSerMsg: '更多',

            matTotal: 0,//事项列表总条数
            matCurPage: 1,//事项列表当前页
            matPageSize: 10,//事项列表每页条数

            proData: [],//行政区划
            deptData: [{
                label: "全部",
                value: "all"
            }],
            matterClaData: [],
            matttypeData: [],
            statusData: [],
            objData: [],
            mattersData: []
        };
    },
    methods: {
        //修复ie记忆问题
        changeMatterName(val) {
            this.matterName = val == '' ? '' : val;
        },
        //修复ie记忆问题
        changeMatterCodeVal(val) {
            this.matterCodeVal = val == '' ? '' : val;
        },

        /*
        ** 跳转一件事页面
        */
        radioChange() {
            this.$router.push({
                path: "/systemOneMatter"
            });
        },
        /*
        ** 行政区划改变联动部门
        */
        changeXzqh(value, selectedData) {
            let _that = this;
            _that.xzqhValShow = "";
            for(let item of selectedData){
                _that.xzqhValShow += item.label+'/'
            }
            if (value.length === 0 || value[0] == '') {//行政区划清空时部门和机构清空
                _that.deptData = [{
                    label: "全部",
                    value: "all"
                }];
                _that.deptVal = 'all';
            } else {
                _that.xzqhVal = value;
                _that.getDeptData();
            }
            _that.searchEvt();
        },

        /*
        ** 启用事件
        */
        goCaseGuide(index, row) {
            let _that = this,
                jointStatus = 0;
            if (row.jointStatus == 0) {
                jointStatus = 1;
            } else {
                jointStatus = 0;
            }
            unit.ajaxObjPost('/znsj-web/sysConfig/updateJointStatus', {
                id: row.id,
                jointStatus: jointStatus,
                type: 1
            }, function (res) {
                if (res.flag == true) {
                    let text = '启用成功';
                    text = row.jointStatus == 0 ? '启用成功' : '停用成功';
                    _that.$Message.success(text);
                    _that.xzqhVal = [_that.xzqhVal[_that.xzqhVal.length - 1]];
                    _that.getMattData();
                } else {
                    _that.$Message.warning(res.errMsg);
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg);
            }, _that);
        },
        /*
        ** 切换高级查询、常规查询
        */
        higSearchEvt() {
            this.higSerMsg = this.higSerMsg === '更多' ? '常规' : '更多';
            this.isHigRow = !this.isHigRow;
            if (this.xia) {
                this.xia = false;
                this.shang = true;
            } else {
                this.xia = true;
                this.shang = false;
            }
        },
        /*
        ** 综合查询
        */
        searchEvt() {
            let _that = this;
            _that.xzqhVal = [_that.xzqhVal[_that.xzqhVal.length - 1]];
            _that.matCurPage = 1;
            _that.getMattData();
        },
        /*
        ** 事项列表无子项不展开
        */
        getRowClass: function (row, rowIndex) {
            if (row.row.childs == null || row.row.childs.length == 0) {// 无子项
                return "row-expand-cover";
            }
        },
        /*
        ** 获取事项列表数据
        */
        getMattData() {
            let _that = this,
                jsonObj;
            jsonObj = {
                type: '1',
                queryName: _that.matterName.trim(),//事项名称
                adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1],//行政区划编码
                deptCode: _that.deptVal === 'all' ? '' : _that.deptVal,//部门编码
                matterClassify: _that.matterClassifyVal === 'all' ? '' : _that.matterClassifyVal,
                code: _that.matterCodeVal.trim(),
                matterType: _that.matterTypeVal === 'all' ? '' : _that.matterTypeVal,
                jointStatus: _that.statusVal === 'all' ? '' : _that.statusVal, // 状态
                pageNum: _that.matCurPage,//当前页
                pageSize: _that.matPageSize//每页数量
            };
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            unit.ajaxObjPost('/znsj-web/sysConfig/list', jsonObj, function (res) {
                loading.close();
                let data = res.data;
                _that.matTotal = data.total;
                _that.matCurPage = data.pageNum;
                data = data.rows;
                $.each(data, function (index, item) {
                    item.matterName = (item.matterName === null || '') ? '--' : item.matterName;
                    item.commitTime = (item.commitTime === null || '') ? '--' : item.commitTime + '日';
                    item.deptName = (item.deptName === null || '') ? '--' : item.deptName;
                    $.each(item.childs, function (i, t) {
                        t.matterName = (t.matterName === null || '') ? '--' : t.matterName;
                        t.commitTime = (t.commitTime === null || '') ? '--' : t.commitTime + '日';
                        t.deptName = (t.deptName === null || '') ? '--' : t.deptName;
                    });
                });
                _that.mattersData = data;
            }, function (res) {
                loading.close();
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 事项列表每页显示数据量变更
        */
        matSizeChange: function (val) {
            let _that = this;
            _that.matPageSize = val;
            _that.matCurPage = 1;
            _that.getMattData();
        },
        /*
        ** 事项列表页码变更
        */
        matCurrentChange: function (val) {
            let _that = this;
            _that.matCurPage = val;
            _that.getMattData();
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this,
                obj = {
                };
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    })
                    _that.proData = res.data;
                    _that.proData.unshift({
                        label: '全部',
                        value: ''
                    });
                    _that.searchEvt();
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
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
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
                    if (result.data.length != 0) {
                        $.each(result.data, function (i, t) {
                            if(t.hasChild == '1') {
                                t.children = [];
                                // 有下一级箭头 可加载子类
                                t.loading = false; 
                            }
                        });
                    }
                    item.children = result.data;
                    item.loading = false;
                    callback();
                }, function (result) {
                    _that.$Message.warning('获取数据失败1');
                }, _that);
            }, 50);
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
            _that.getDictionarys('djzt');
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
                    if (str === 'SXFL') {
                        _that.matterClaData = data;
                        _that.matterClaData.unshift({
                            label: '全部',
                            value: 'all'
                        });
                        _that.matterClassifyVal = 'all';
                    } else if (str === 'SXLX') {
                        _that.matttypeData = data;
                        _that.matttypeData.unshift({
                            label: '全部',
                            value: 'all'
                        });
                        _that.matterTypeVal = 'all';
                    } else if (str === 'djzt') {
                        _that.statusData = data;
                        _that.statusData.unshift({
                            label: '全部',
                            value: 'all'
                        });
                        _that.statusVal = 'all';
                    }
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取部门
        */
        getDeptData() {
            let _that = this,
                obj = {
                    adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                if (res.flag == true) {
                    _that.deptData = res.data;
                    _that.deptData.unshift({
                        label: "全部",
                        value: "all"
                    });
                    _that.deptVal = 'all';
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.getXzqhTreeData();//获取行政区划
            _that.getMatterClaData();// 事项分类字典
            _that.getStatusData();// 状态字典
            _that.getSxlxData();// 事项类型字典
        }
    },
    mounted() {
        this.init();
        unit.solveAnimFrame();
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/color.less";
#systemMatters {
    padding: 0px 20px 0px 20px;
    background-color: #edf0f6;
    overflow: auto;
    height: 100%;
    .ivu-btn-primary {
        background-color: #137ddf;
        border-color: #137ddf;
    }
    .ivu-col {
        margin-left: 15px;
    }
    .ivu-radio-group {
        height: 32px;
        line-height: 26px;
    }
    .search-matters {
        height: 100%;
        background-color: #fff;
        .main-wrap {
            padding: 20px 20px 15px 20px;
            background-color: #fff;

            .panel-border {
                border: 1px solid #e0e6f1;
                border-bottom: none;
            }

            .el-table {
                .el-table__expanded-cell[class*="cell"] {
                    padding: 0;
                    border-bottom: 0 !important;
                    padding-left: 40px;
                }
            }

            .search-wrap {
                .search-btn {
                    float: left;
                    padding: 4px 15px 6px;
                    width: 94px;
                    height: 32px;
                    background-color: #137ddf;
                    border-color: #137ddf;
                }
            }

            .ivu-input-group-append {
                background-color: #d4efde !important;
            }

            .ivu-input-search {
                border-color: #dcebe6 !important;
            }

            .higher-search-a {
                color: #137ddf;
                &:hover {
                    color: #137ddf;
                }
            }

            .my-collect,
            .matters {
                text-align: center;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #7e8688;
                background-color: #e5edef;
            }

            .guide-hover:hover {
                cursor: pointer;
            }

            .clasify-guide {
                height: 35px;
                line-height: 35px;
                font-size: 16px;

                a.all-matters {
                    color: #2d8cf0;
                    font-weight: 1000;
                    font-size: 18px;
                }
            }

            .col-matt {
                line-height: 31px;
            }

            .ivu-input-wrapper-large .ivu-input-icon {
                font-weight: 1000;
            }

            .ivu-page-options-sizer {
                position: absolute;
                left: 20px;
            }

            .ivu-page-total {
                position: absolute;
                left: 102px;
            }

            .matt-box-wrap {
                position: relative;
            }

            .met-box-panel {
                position: absolute;
                margin-top: 15px;
                padding-bottom: 10px;
                right: 0px;
                width: 350px;
                z-index: 7;
                border-color: #4096ff;
            }

            .ivu-card-head {
                background-color: @baseColor;
                height: 32px;
                height: 36px;
                padding: 6px 16px;

                p {
                    text-align: right;
                }
            }

            .ic-cancle {
                font-size: 18px;
                color: #fff;
            }

            .ivu-card-body {
                padding: 2px 0px 16px 0;
            }

            .panel-cont {
                max-height: 140px;
                padding-left: 16px;
                overflow-y: auto;
            }

            .panel-cont {
                li {
                    margin-right: 8px;
                    height: 35px;
                    line-height: 35px;
                    font-family: "微软雅黑";
                    border-bottom: 1px solid #e0dddd;

                    span {
                        display: inline-block;
                        max-width: 290px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    i {
                        font-size: 12px;
                        color: #fe0404;
                        font-weight: bolder;
                    }
                }
            }

            .panel-cont .no-box-data {
                text-align: center;
                color: #909399;
                height: 26px;
                line-height: 36px;
            }

            .matt-box-btn {
                height: 25px;
            }

            .tab-switch {
                margin-top: 20px;
            }

            .cor-colect {
                color: #f99b0e;
            }

            .row-expand-cover {
                td:nth-child(1) .el-table__expand-icon {
                    visibility: hidden;
                }
            }

            .row-btn-hide {
                td:last-child button {
                    visibility: hidden;
                }
            }

            .xzqhWt {
                width: 70%;
            }

            .dept-width {
                width: 70%;
            }

            .obj-width {
                width: 70%;
            }

            body .ivu-modal .ivu-select-dropdown {
                position: fixed !important;
            }
        }
    }
}
</style>
