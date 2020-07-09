/*
 * @Author: qijiang 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-16 17:20:06
 */
<template>
    <div id="templateMatters" class="clearfix">
        <!-- 待选事项列表 -->
        <div class="left-wrap fl">
            <div class="tempate-table-wrap">
                <p class="template-title">
                    待选事项
                </p>
                <div class="table-form-content clearfix">
                    <div class="template-search">
                        <el-row>
                            <el-col :span="7">
                                <div class="inline-block common-width" :title="xzqhTitle">
                                    <Cascader placeholder="请选择行政区划" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select filterable @on-change="changeXzqh" :transfer="true"></Cascader>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="inline-block common-width">
                                    <el-select placeholder="请选择部门" v-model="deptVal" size="small" filterable clearable>
                                        <el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="inline-block common-width">
                                    <el-input v-model="selectedMatterNameVal" :maxlength="100" placeholder="请输入事项名称" size="small" @change="changeSelectedMatterNameVal"></el-input>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="template-search-btn" @click="searchBtn(1)">
                                    <i class="iconfont icon-sousuo"></i>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-form">
                        <el-table :data="selectedData" tooltip-effect="light" @selection-change="selectedFunc">
                            <el-table-column type="selection" width="45">
                            </el-table-column>
                            <!-- 展开项结束 -->
                            <el-table-column label="事项编号" width="290">
                                <template scope="scope">
                                    <span :title="scope.row.matterCode">{{scope.row.matterCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="事项名称">
                                <template scope="scope">
                                    <span :title="scope.row.matterName">{{scope.row.matterName}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block page-wrap mt10 clearfix">
                        <el-pagination :total="selectedTotal" :page-size="selectedPageSize" @size-change="selectedSizeChange" @current-change="selectedCurrentChange" :current-page.sync="selectedCurrentPage" pager-count="5" layout="sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 操作 -->
        <div class="opt-wrap fl">
            <div class="icon-btn">
                <div class="moveRight" @click="addMatter"></div> <br>
                <div class="moveLeft" @click="removeMatter"></div>
                <!-- <i class="iconfont icon-jiantouyou" @click="addMatter"></i>
                <i class="iconfont icon-jiantouzuo" @click="removeMatter"></i> -->
            </div>
        </div>
        <!-- 已选事项列表 -->
        <div class="right-wrap fr">
            <div class="tempate-table-wrap">
                <p class="template-title">
                    已选事项
                </p>
                <div class="table-form-content clearfix">
                    <div class="template-search">
                        <el-row>
                            <el-col :span="7">
                                <div class="inline-block common-width">
                                    <el-input v-model="selectingmatterNameVal" :maxlength="100" placeholder="请输入事项名称" size="small" @change="changeSelectingmatterNameVal"></el-input>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="template-search-btn" @click="searchBtn(2)">
                                    <i class="iconfont icon-sousuo"></i>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="table-form">
                        <el-table :data="selectingData" tooltip-effect="light" @selection-change="selectingFunc">
                            <el-table-column type="selection" width="45">
                            </el-table-column>
                            <!-- 展开项结束 -->
                            <el-table-column label="事项编号" width="290">
                                <template scope="scope">
                                    <span :title="scope.row.matterCode">{{scope.row.matterCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="事项名称">
                                <template scope="scope">
                                    <span :title="scope.row.matterName">{{scope.row.matterName}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block page-wrap mt10 clearfix">
                        <el-pagination :total="selectingTotal" :page-size="selectingPageSize" @size-change="selectingSizeChange" @current-change="selectingCurrentChange" :current-page.sync="selectingCurrentPage" pager-count="5" layout="sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
export default {
    props: {
        idS: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            xzqhTitle: '',
            saveSelectedList: [],   //存储待选穿梭的数据
            saveSelectingList: [],   //存储待选穿梭的数据

            selectedData: [],  //待选数据
            selectedCurrentPage: 1, //待选当前页
            selectedPageSize: 10,   //待选页数
            selectedTotal: 0,       //待选总数

            selectingData: [],  //已选数据
            selectingCurrentPage: 1, //已选当前页
            selectingPageSize: 10,   //已选页数
            selectingTotal: 0,       //已选总数

            proData: [], // 行政区划数据源
            xzqhVal: [], // 行政区划
            deptData: [],  //部门数据数据源,
            selectedMatterNameVal: '', //待选事项名称
            selectingmatterNameVal: '', //已选事项名称
            deptVal: '', // 所属部门
            labelPosition: 'right'
        };
    },
    methods: {
        //修复ie记忆问题
        changeSelectedMatterNameVal(val) {
            this.selectedMatterNameVal = val == '' ? '' : val;
        },
        //修复ie记忆问题
        changeSelectingmatterNameVal(val) {
            this.selectingmatterNameVal = val == '' ? '' : val;
        },
        //复选框点击事件-待选
        selectedFunc(val) {
            this.saveSelectedList = val;
        },
        //复选框点击事件-已选
        selectingFunc(val) {
            this.saveSelectingList = val;
        },
        //新增已选
        addMatter() {
            let that = this,
                param = {
                    matterList: that.saveSelectedList,
                    templateId: that.idS
                };
            unit.ajaxObjPost('/znsj-web/matter/template/add', param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.getData(1);  //获取待选数据
                    that.getData(2);  //获取已选数据
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (res) {
                that.$Message.error(res.data.errMsg || '数据加载失败！');
                that.getData(1);  //获取待选数据
                that.getData(2);  //获取已选数据
            }, that);
        },
        //去除已选
        removeMatter() {
            let that = this,
                param = {
                    matterList: that.saveSelectingList,
                    templateId: that.idS
                };
            unit.ajaxObjPost('/znsj-web/matter/template/delete', param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.getData(1);  //获取待选数据
                    that.getData(2);  //获取已选数据
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (res) {
                that.$Message.error(res.data.errMsg || '数据加载失败！');
                that.getData(1);  //获取待选数据
                that.getData(2);  //获取已选数据
            }, that);
        },
        //关闭弹窗
        closeDialog() {
            this.$emit('closeDialog');
        },
        //搜索按钮
        searchBtn(type) {
            if (type == 1) {
                this.selectedCurrentPage = 1;
            } else {
                this.selectingCurrentPage = 1;
            }
            this.getData(type);
        },
        /*
         * 获取列表数据
         * type 1待选 2已选
         */
        getData(type) {
            let that = this,
                url = '/matter/template/list',
                param = {},
                adminDiv = '', //行政区划
                deptCode = '', //部门
                matterName = '', //事项名称
                pageNum = that.selectedCurrentPage,  //待选当前页
                pageSize = that.selectedPageSize; //待选选页数
            if (type == 2) {  //已选
                pageNum = that.selectingCurrentPage;
                pageSize = that.selectingPageSize;
                matterName = that.selectingmatterNameVal;
            } else { //待选
                matterName = that.selectedMatterNameVal;
                adminDiv = that.xzqhVal[that.xzqhVal.length - 1];
                deptCode = that.deptVal;
            }
            param = {
                adminDiv: adminDiv,
                deptCode: deptCode,
                matterName: matterName.trim(),
                pageNum: pageNum,
                pageSize: pageSize,
                templateId: that.idS,
                type: type
            };
            unit.ajaxObjPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    if (type == 2) {
                        that.selectingTotal = data.total;
                        that.selectingCurrentPage = data.pageNum;
                        if (that.selectingCurrentPage != 1 && data.rows.length == 0) { //处理最后一页数据的删除，页数减一
                            that.selectingCurrentPage--;
                            that.getData(2); //刷新列表
                        } else {
                            that.selectingData = data.rows;
                        }
                    } else {
                        that.selectedTotal = data.total;
                        that.selectedCurrentPage = data.pageNum;
                        if (that.selectedCurrentPage != 1 && data.rows.length == 0) { //处理最后一页数据的删除，页数减一
                            that.selectedCurrentPage--;
                            that.getData(1); //刷新列表
                        } else {
                            that.selectedData = data.rows;
                        }
                    }
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(res.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 清空表单数据
         */
        clearFormData() {
            let that = this;
            // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
            if (that.$refs['addData'] !== undefined) {
                that.$refs['addData'].resetFields();
                for (var key in that.addData) {
                    that.addData[key] = '';
                }
            }
        },
        /*
         * 行政区划改变联动部门
         */
        changeXzqh(value, selectedData) {
            let _that = this;
            if (value.length === 0) { // 行政区划清空时部门和机构清空
                _that.deptData = [];
                _that.deptVal = '';
            } else {
                _that.xzqhVal = value;
                _that.getDeptData();
            }
        },
        /*
        ** 获取部门字典
        */
        getDeptData() {
            let _that = this,
                obj = {
                    adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                if (res.flag == true) {
                    _that.deptData = res.data;
                    // _that.deptData.unshift({
                    //     label: '全部',
                    //     value: ''
                    // });
                    _that.deptVal = '';
                } else {
                    _that.$Message.warning('服务端错误');
                }
            }, function (res) {
                _that.$Message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this;
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', {}, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    });
                    _that.proData = res.data;
                    // _that.proData.unshift({
                    //     label: '全部',
                    //     value: ''
                    // });
                } else {
                    _that.$Message.warning('服务端错误');
                }
            }, function (res) {
                _that.$Message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 点击行政区划加载子项
        */
        xzqhLoadData(item, callback) {
            let _that = this,
                qhCode = item.value;
            item.loading = true;
            _that.xzqhTitle = item.__label;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
                    if (result.flag == true) {
                        $.each(result.data, function (i, t) {
                            if (t.existChild) {
                                t.children = [];
                                t.loading = false;
                            }
                        });
                        item.children = result.data;
                    } else {
                        _that.$Message.warning('服务端错误');
                    }
                    item.loading = false;
                    callback();
                }, function (result) {
                    _that.$Message.warning('服务端错误');
                }, _that);
            }, 300);
        },

        selectingSizeChange(val) {
            let _that = this;
            _that.selectingPageSize = val;
            _that.selectingCurrentPage = 1;
            _that.getData(2);
        },
        selectingCurrentChange(val) {
            let _that = this;
            _that.selectingCurrentPage = val;
            _that.getData(2);
        },

        selectedSizeChange(val) {
            let _that = this;
            _that.selectedPageSize = val;
            _that.selectedCurrentPage = 1;
            _that.getData(1);
        },
        selectedCurrentChange(val) {
            let _that = this;
            _that.selectedCurrentPage = val;
            _that.getData(1);
        },
        /*
         *  初始化页面数据
         */
        init() {
            let that = this;
            that.getXzqhTreeData();
            that.getData(1);  //获取待选数据
            that.getData(2);  //获取已选数据
        },
    },
    mounted() {
        let that = this;
        if (that.idS) {  //根据id获取数据
            that.init();
        }
    }
};
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#templateMatters {
    width: 100%;
    .el-pager {
        max-width: 240px;
        text-align: left;
    }
    .el-table td {
        padding: 12px 0;
    }
    .el-table th {
        background-color: #fff;
    }
    .el-pagination__sizes {
        margin: 0;
    }
    .el-pagination__jump {
        margin: 0;
    }
    .left-wrap,
    .right-wrap {
        width: 47%;
        .tempate-table-wrap {
            border: 1px solid #ced5e3;
            border-radius: 5px;
            .template-title {
                height: 40px;
                background-color: #f4f6f9;
                border-bottom: 1px solid #ced5e3;
                line-height: 40px;
                font-size: 16px;
                text-align: left;
                text-indent: 15px;
                border-radius: 5px 5px 0 0;
            }
            .table-form-content {
                padding: 10px;
                min-height: 631px;
                .table-form {
                    border: 1px solid #e0e6f1;
                    border-bottom: none;
                }
            }
            .el-row {
                margin-bottom: 13px;
                .el-col {
                    margin-right: 10px;
                    &:last-child {
                        margin-left: -13px;
                        margin-right: 0;
                    }
                    .common-width {
                        width: 100%;
                    }
                    .template-search-btn {
                        position: relative;
                        height: 32px;
                        width: 32px;
                        background-color: #f4f6f9;
                        line-height: 32px;
                        border-radius: 0 5px 5px 0;
                        border: 1px solid #e0e6f1;
                        z-index: 99;
                        cursor: pointer;
                        text-align: center;
                        i {
                            font-size: 20px;
                        }
                    }
                }
            }
            .page-wrap {
                overflow: hidden;
                width: 100%;
                height: 40px;
                text-align: right;
            }
        }
    }
    .opt-wrap {
        padding: 0 10px;
        width: 6%;
        .icon-btn {
            margin-top: 270px;
            .moveRight,
            .moveLeft {
                display: inline-block;
                width: 38px;
                height: 38px;
                border: 1px solid #ddd;
                border-radius: 50%;
                cursor: pointer;
            }
            .moveRight {
                margin-top: 50%;
                margin-bottom: 10px;
                background: url(../../assets/images/common/right-icon.png)
                    center center no-repeat;
            }
            .moveLeft {
                background: url(../../assets/images/common/left-icon.png) center
                    center no-repeat;
            }
            // i {
            //     font-size: 43px;
            //     color: #137ddf;
            //     cursor: pointer;
            // }
        }
    }
}
</style>
