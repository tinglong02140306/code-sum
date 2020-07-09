/*
 * @Author: lhqin
 * @Date: 2018-10-30 10:17:01
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-13 23:30:15
 */

<template>
    <!-- <EasyScrollbar style="height: 100%;"> -->
        <div id="oneCaseConfig">
            <tabNavigate :tabs="tabs"></tabNavigate>
            <div class="main-wrap clearfix">
                    <!-- 查询条件（基本查询）start -->
                <div class="search-wrap clearfix">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="6" :md="6">
                            <label class="mr5">行政区划</label>
                            <div class="inline-block common-width">
                                <Cascader class="inline-block bwidth" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select filterable @on-change="changeXzqh" :transfer="true"></Cascader>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <label class="mr5">主办部门</label>
                            <div class="inline-block common-width">
                                <el-select class="bwidth" v-model="deptVal" size="small" filterable>
                                    <el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <label class="mr5">事件名称</label>
                            <div class="inline-block common-width">
                                <el-input v-model="eventNameVal" :maxlength="100" placeholder="请输入事件名称" size="small" @change="changeMatterName"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <div class="fl">
                                <el-button class="w70 h30" type="primary" size="mini" @click="searchEvt">查询</el-button>
                                <a ref="higSearch" class="higher-search-a text-blue fz14" href="javascript:void(0)" @click="higSearchEvt">
                                    <span>{{ higSerMsg }}</span>
                                    <i class="iconfont icon-xia"></i>
                                </a>
                            </div>
                            <div class="fr mr10">
                                <el-button class="w60 h30" type="primary" size="mini" @click="addOneCaseEvt()">新增</el-button>
                            </div>
                        </el-col>
                        <!-- <el-col :span="6" :md="6">
                            <div>
                                <el-button class="w70" type="primary" size="mini" @click="searchEvt">查询</el-button>
                                <a ref="higSearch" class="higher-search-a text-blue fz14" href="javascript:void(0)" v-bind:class="" @click="higSearchEvt">
                                    <span>{{ higSerMsg }}</span>
                                    <i class="iconfont icon-xia"></i>
                                </a>
                            </div>
                        </el-col> -->
                    </el-row>
                </div>

                <!-- 查询条件（高级查询）start -->
                <div class="search-wrap clearfix" v-bind:class="{hide:isHigRow}">
                    <el-row class="clearfix" type="flex" justify="space-between">
                        <el-col :span="6" :md="6">
                            <label class="mr5">办理对象</label>
                            <div class="inline-block common-width matt-class">
                                <Select v-model="proObjVal" @on-change="objChangeEvt" :transfer="true">
                                    <Option v-for="item in proObjData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <!-- 数据是主题类型的数据，为了便于理解，所以是事件类别 -->
                            <label class="mr5">事件类别</label>
                            <div class="inline-block common-width">
                                <Select class="bwidth" v-model="themeTypeVal" :transfer="true">
                                    <Option v-for="item in themeTypeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6">
                            <label class="mr5">事件编码</label>
                            <div class="inline-block common-width">
                                <el-input v-model="matterCodeVal" :maxlength="100" placeholder="请输入事件编码" size="small"  @change="changeMatterCodeVal"/>
                                </el-input>
                            </div>
                        </el-col>
                        <el-col :span="6" :md="6"></el-col>
                    </el-row>
                    <el-row class="mt20 clearfix" type="flex" justify="space-between">
                        <el-col :span="6" :md="6">
                            <div class="">
                                <label class="mr5">情形状态</label>
                                <div class="inline-block status-width">
                                    <Select class="bwidth" v-model="statusVal" :transfer="true">
                                        <Option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="18" :md="18"></el-col>
                    </el-row>

                </div>

                <div class="pr10">
                    <!-- <div class="btn-groups clearfix">
                        <div class="inline-block fr">
                            <el-button class="mr5 w60" size="small" type="primary" @click="addOneCaseEvt()">新增</el-button>
                        </div>
                    </div> -->

                    <!-- 事件列表start -->
                    <div class="list-wrap mt20 panel-border" id="maskPanel">
                        <el-table :data="oneMerData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="light">
                            <el-table-column label="事件名称" >
                                <template scope="scope">
                                    <span :title="scope.row.eventName">{{scope.row.eventName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="行政区划" width="130" >
                                <template scope="scope">
                                    <span :title="scope.row.adminDivName">{{scope.row.adminDivName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="主办部门" width="250">
                                <template scope="scope">
                                    <span :title="scope.row.sponsorDeptTxt">{{scope.row.sponsorDeptTxt}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="情形状态" width="110">
                                <template scope="scope">
                                    <span :title="scope.row.situStatus === '1' ? '启用':'停用'">{{scope.row.situStatus === '1' ? '启用':'停用'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="230">
                                <template slot-scope="scope">
                                    <el-button type="text" size="large" @click="isEnableEvt($event,scope.row)">
                                        <span :title="scope.row.situStatus === '1' ? '启用':'停用'">{{scope.row.situStatus === '1' ? '停用':'启用'}}</span>
                                    </el-button>
                                    <!-- <el-button title="复制" type="text" size="large"  @click="caseCfgEvt($event,scope.row)">复制</el-button> -->
                                    <el-button title="情形配置" type="text" size="large"  :disabled="scope.row.situStatus == '1' ? true : false" @click="caseCfgEvt($event,scope.row)">情形配置</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt10">
                            <el-pagination :total="total" :page-size="pageSize" @size-change="cfgSizeChange" @current-change="cfgCurrentChange" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                    <!-- 事件列表end -->
                </div>

                <!-- 新增弹框 -->
                <el-dialog title="请选择事件" :visible.sync="addOneCaseDialog">
                    <one-case ref='addOneCaseDialog'></one-case>
                </el-dialog>
            </div>

        </div>
    <!-- </EasyScrollbar> -->

</template>
<script>
import unit from '@/api/index';
import addOneCase from '@/pages/thingSetting/configuration/addOneCase';
import tabNavigate from "@/components/common/tabNavigate";   // 页签导航
export default {
    data() {
        return {
            tabs: ['情形配置', '一件事配置'],
            isHigRow: true,
            higSerMsg: '更多',

            saveXzqh: [], // 暂存行政区划
            saveFlag: true, // 暂存标志
            xzqhReFirFlag: true,  // 行政区划第一次请求标志位

            xzqhVal: [], // 行政区划
            deptVal: '', // 主办部门
            eventNameVal: '', // 事件名称
            proObjVal: '', // 办理对象
            themeTypeVal: '', // 主题类型
            matterCodeVal: '', // 事件编号
            statusVal: '',  // 状态

            currentPage: 1,
            pageSize: 10,
            total: 0,
            oneMerData: [],

            proData: [],
            deptData: [{
                label: '全部',
                value: ''
            }],
            statusData: [],
            proObjData: [],
            themeTypeData: [],

            addOneCaseDialog: false, // 选择事件弹窗
            themeTypeStr:'',//主题类型查询字段初值
        };
    },
    methods: {
        //修复ie记忆问题
        changeMatterName(val) {
            this.eventNameVal = val == '' ? '' : val;
        },
        //修复ie记忆问题
        changeMatterCodeVal(val) {
            this.matterCodeVal = val == '' ? '' : val;
        },

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
        ** 跳转事件页面
        */
        addOneCaseEvt() {
            let _that = this;
            _that.addOneCaseDialog = true;
            // _that.$nextTick(() => { // 延迟执行，保证每次打开弹框都请求数据
            //     _that.$refs.addOneCaseDialog.init();
            // });
        },
        /*
        ** 点击列表中的按钮跳转相应操作
        */
        goMattDetail($event, row, type) {
            let _that = this,
            obj = {
                id: row.id,
                matteCode: row.matterCode ? row.matterCode : '', // row.matteCode
                matteVersion: row.matterVersion ? row.matterVersion : '' // row.matteVersion
            };
            if (type === 'detail') {
                obj.type = 'detail';
            } else if (type === 'edit') {
                obj.type = 'edit';
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
        ** 获取事件配置列表数据
        */
        getConfigData() {
            let _that = this,
                jsonObj;
            if(_that.$store.state.editCurPage != 0) {
                _that.currentPage = _that.$store.state.editCurPage;
                _that.$store.commit('setState', {
                    editCurPage: 0
                });
                localStorage.editCurPage = 0;
            }
            jsonObj = {
                adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1], // 行政区划
                sponsorDept: _that.deptVal, // 主办部门
                eventName: _that.eventNameVal.trim(), // 事件名称
                eventClassify: _that.proObjVal === 'all' ? '' : _that.proObjVal, // 办理对象
                eventType: _that.themeTypeVal === 'all' ? '' : _that.themeTypeVal, // 主题类型
                eventCode: _that.matterCodeVal.trim(), // 事件编码
                type: '1',
                status:'',
                situStatus: _that.statusVal === 'all' ? '' : _that.statusVal, // 状态
                pageNum: _that.currentPage, // 当前页
                pageSize: _that.pageSize// 每页数量
            };
            unit.ajaxObjPost('/qxpz/event/getAll', jsonObj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.total = data.total;
                    _that.currentPage = data.pageNum;
                    data = data.rows;
                    $.each(data, function (index, item) {
                        item.eventName =
                            (item.eventName === null || '') ? '--' : item.eventName;
                        item.adminDivName = (item.adminDivName === null || '') ? '--' : item.adminDivName;
                        item.sponsorDeptTxt = (item.sponsorDeptTxt === null || '') ? '--' : item.sponsorDeptTxt;
                    });
                    _that.oneMerData = data;
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
            if (_that.themeTypeVal && !_that.proObjVal) { // 勾选主题类型未勾选办理对象
                _that.$message.warning('请先选择办理对象');
                return;
            }
            _that.currentPage = 1;
            _that.getConfigData();
        },
        /*
        ** 事件列表每页显示数据量变更
        */
        cfgSizeChange: function (val) {
            let _that = this;
            _that.pageSize = val;
            _that.currentPage = 1;
            _that.getConfigData();
        },
        /*
        ** 事件列表页码变更
        */
        cfgCurrentChange: function (val) {
            let _that = this;
            _that.currentPage = val;
            _that.getConfigData();
        },
        /*
        ** 启用停用
        */
        isEnableEvt($event, row) { // str判断是否是父项
            let _that = this;
            // if (type === 'edit') {
            _that.$store.commit('setState', {
                editCurPage: _that.currentPage
            });
            localStorage.editCurPage = _that.currentPage;
            // }
            if (row.situStatus === '1') { // 停用
                _that.$confirm('确定停用当前一件事的情形?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'fr ml10',
                    type: 'warning'
                }).then(() => {
                    let obj = {
                        eventCode: row.eventCode,
                        version: row.eventVersion,
                        situStatus: '0'
                    };
                    unit.ajaxMerPost('/qxpz/situation/updateStatus', obj, function (res) {
                        _that.$message({
                            type: 'success',
                            message: '停用成功!'
                        });
                        _that.getConfigData();
                    }, function (res) {
                        _that.$message.warning('服务端错误');
                    }, _that);
                }).catch(() => { });
            } else if (row.situStatus === '0') { // 启用
                _that.$confirm('确定启用当前一件事的情形?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'fr ml10',
                    type: 'warning'
                }).then(() => {
                    let obj = {
                        eventCode: row.eventCode,
                        version: row.eventVersion,
                        situStatus: '1'
                    };
                    unit.ajaxMerPost('/qxpz/situation/updateStatus', obj, function (res) {
                        _that.$message({
                            type: 'success',
                            message: '启用成功!'
                        });
                        _that.getConfigData();
                    }, function (res) {
                        _that.$message.warning('服务端错误');
                    }, _that);
                }).catch(() => { });
            }
        },
        /*
        ** 跳转一件事情形配置页面
        */
        caseCfgEvt($event, row) {
            this.$router.push({
                path: '/thingSetting/oneThingSituationConfigInfos',
                query: {
                    id: row.id,
                    name: row.eventName,
                    eventCode: row.eventCode,
                    eventVersion: row.eventVersion
                }
            });
        },
        /*
        ** 删除
        */
        cancleEvt($event, row) {
            let _that = this;
            _that.$confirm('删除后不可恢复，确定删除此记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                let obj = {
                    id: row.id,
                    matterCode: row.matterCode,
                    version: row.matterVersion
                };
                unit.ajaxMerPost('/qxpz/event/deleteEvent', obj, function (res) {
                    if (res.flag == true && res.data === '删除成功') {
                        _that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        _that.getConfigData();
                    } else {
                        _that.$message.warning('服务端错误');
                    }
                }, function (res) {
                    _that.$message.warning('服务端错误');
                }, _that);
            }).catch(() => { });
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this,
                obj = {
                    value: _that.xzqhVal[0]
                };
            unit.ajaxMerPost('/qxpz/commer/getXzqhTreeData', obj, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    });
                    _that.proData = res.data;
                    if(_that.xzqhReFirFlag) {
                        // 默认
                        _that.proData.unshift({
                            label: '全部',
                            value: ''
                        });
                        _that.xzqhReFirFlag = false;
                    }

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
                unit.ajaxMerPost('/qxpz/commer/getXzqhTreeData', obj, function (result) {
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
            unit.ajaxMerPost('/qxpz/commer/getDeptList', obj, function (res) {
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
            unit.ajaxMerPost('/qxpz/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    if (str === 'XZQH') {
                        _that.saveXzqh = [data[0].value, data[1].value]; // 暂存行政区划，供后面调用
                        _that.xzqhVal = [data[0].value, data[1].value];
                        _that.getConfigData();// 事件列表,防止行政区划接口慢，导致获取列表数据不传行政区划
                    } else if (str === 'bldx') {
                        _that.proObjData = data;
                        _that.proObjData.unshift({
                            label: '全部',
                            value: 'all'
                        });
                        _that.proObjVal = 'all';
                        _that.getThemeTypeData();// 获取主题类型
                    }  else if (str === 'qxzt') {
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
        ** 办理对象改变
        */
        objChangeEvt(data) {
            let _that = this;
            if(data === '0') {//个人
                _that.themeTypeStr = 'GRZT';
            } else if(data === '1') {//法人
                _that.themeTypeStr = 'FRZT';
            } else {
                _that.themeTypeStr = '';
            }
            _that.getThemeTypeData();
        },
        /*
        ** 获取事件类型
        */
        getThemeTypeData() {
            let _that = this,
                obj = {
                    pinYinType: _that.themeTypeStr
                };
            unit.ajaxMerPost('/qxpz/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.themeTypeData = data;
                    _that.themeTypeData.unshift({
                        label: '全部',
                        value: 'all'
                    });
                    _that.themeTypeVal = 'all';
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
            // let that = this;
            // unit.ajaxMerPost('/znsj-web/commer/curentUserXzqh', {
            //     pinYinType: 'XZQH'
            // }, function (res) {
            //     if (res.flag) {
            //         that.saveXzqh = [];
            //         that.xzqhVal = [];
            //         let data = res.data;
            //         for (let i in data) {
            //             that.xzqhVal.push(data[i].value);
            //             that.saveXzqh.push(data[i].value);
            //         }
            //         that.getConfigData();
            //     } else {
            //         that.$Message.warning('服务端错误');
            //     }
            // }, function (res) {
            //     that.$Message.warning('服务端错误');
            // }, that);
            // 改成默认选择全部
            let that = this;
            that.saveXzqh = [];
            that.xzqhVal = [];
            that.xzqhVal.push('');
            that.saveXzqh.push('');
            that.getConfigData();
        },
        /*
        ** 办理对象字典
        */
        getproObjData() {
            let _that = this;
            _that.getDictionarys('bldx');
        },
        /*
        ** 主题类型字典
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
            _that.getDictionarys('qxzt');
        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.getStatusData();  // 获取字典项
            _that.getXzqhTreeData();// 获取行政区划
            _that.getproObjData();// 办理对象字典
            // 解决ie兼容性问题 requestAnimationFrame
            unit.solveAnimFrame();
            unit.solveIviewTable();
        }
    },
    components: {
        'one-case': addOneCase,// 注入新增弹窗组件
        tabNavigate: tabNavigate
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="less">
.v-modal {
    z-index: 999 !important;
}
#oneCaseConfig {
    overflow: auto;
    height:100%;
    padding: 0 20px 0 20px;
    background-color: #edf0f6;
    .main-wrap{
        padding: 20px 20px 15px 20px;
        background-color: #fff;
    }
    
    .el-dialog__wrapper {
        z-index: 1000 !important;
        .el-dialog {
            width:75%;
            border-radius: 3px;
            .el-dialog__header {
                border-bottom: 1px solid #ddd;
            }
            .el-dialog__body{
                padding-top: 10px;
            }
        }
    }

    // .el-table {
    //     // font-size: 16px;
    // }
      .el-table td{
        padding:4px 0;
    }
    .el-table td .cell{
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }
    .panel-border{
        border: 1px solid #e0e6f1;
        border-bottom: none;
    }
    .el-dropdown-menu {
        width:10%;
    }
      .clear:after{
        content:'';
        display:table;
        clear:both;
        zoom:1;
    }
    .el-button--primary {
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;
        // height:32px;
        float:left;
    }
    .higher-search-a{
        margin: 0 15px 0 10px;
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

    .tab-cell-drop {
        cursor: pointer;
        margin-left: 10px;
    }

    .row-expand-cover {
        td:first-child .el-table__expand-icon {
            display: none;
        }
    }

    .mattLink {
        color: #409EFF;
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
        width: 67.5%;
    }


}
</style>
