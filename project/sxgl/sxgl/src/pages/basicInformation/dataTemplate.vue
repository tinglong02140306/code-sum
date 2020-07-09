/*
 * @Author: qijiang 
 * @Date: 2018-10-29 14:00:42 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-28 16:27:53
 */

<template>
    <div id="dataTemplate">
        <tabNavigate :tabs="tabs"></tabNavigate>
        <div class="main-wrap clearfix">
            <!-- 查询条件（基本查询）start -->
            <div class="search-wrap clearfix">
                <el-row type="flex" justify="space-between">
                    <el-col :span="6" :md="6">
                        <label class="mr5">模板类型</label>
                        <div class="inline-block common-width">
                            <el-select v-model="templateType" size="small">
                                <el-option v-for="item in templateTypeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6" :md="6">
                        <label class="mr5">模板名称</label>
                        <div class="inline-block common-width">
                            <el-input v-model="templateName" :maxlength="50" placeholder="请输入模板名称" size="small" @change="changeTemplateName"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="6" :md="6">
                        <div class="fl">
                            <el-button class="w70" type="primary" size="mini" @click="searchEvt">查询</el-button>
                        </div>
                    </el-col>
                    <el-col :span="6" :md="6">
                        <div class="fr mr10">
                            <el-button class="w60" size="mini" type="primary" @click="addMattCaseEvt('add','')">新增</el-button>
                            <el-button class="w60" size="mini" type="danger" @click="delEve('delAll','')">删除</el-button>
                        </div>
                    </el-col>

                </el-row>
            </div>
            <div class="pr10">
                <!-- 事项列表start -->
                <div class="list-wrap panel-border mt20 " id="maskPanel">
                    <el-table :data="templateData" tooltip-effect="light" @selection-change="changeFun">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <!-- 展开项结束 -->
                        <el-table-column label="模板名称" width='200'>
                            <template scope="scope">
                                <span :title="scope.row.templateName">{{scope.row.templateName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="模板属性">
                            <template scope="scope">
                                <span :title="scope.row.tempAttr">{{scope.row.tempAttr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="模板类型" width='110'>
                            <template scope="scope">
                                <span :title="scope.row.templateTypeTxt">{{scope.row.templateTypeTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="230">
                            <template slot-scope="scope">
                                <el-button title="编辑" type="text" size="large" @click="addMattCaseEvt('edit',scope.row.id)">编辑</el-button>
                                <el-button title="删除" type="text" size="large" @click="delEve('del',scope.row.id)">删除</el-button>
                                <el-button title="配置事项" type="text" size="large" :disabled="scope.row.templateType == '01' ? true : false" @click="matterSet($event,scope.row.id)">配置事项</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block fr mt10">
                        <el-pagination :total="total" :page-size="pageSize" @size-change="cfgSizeChange" @current-change="cfgCurrentChange" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
                <!-- 事项列表end -->
            </div>

            <!-- 新增弹框 -->
            <!-- 新增数据模板 -->
            <el-dialog :title="guideTitle" :visible.sync="addCaseDialog" width="800px" class="add-template" :close-on-click-modal="false">
                <addDataTemplate v-if="addCaseDialog" ref='addCaseDialog' :mblxData="templateTypeChildData" :idS="idS" :sjlxData="sjlxEditData" @closeDialog="closeDialog"></addDataTemplate>
            </el-dialog>

            <!-- 编辑数据模板 -->
            <el-dialog :title="guideTitle" :visible.sync="editCaseDialog" width="800px" class="add-template" :close-on-click-modal="false">
                <editDataTemplate v-if="editCaseDialog" ref='editCaseDialog' :mblxData="templateTypeChildData" :idS="idS" :sjlxData="sjlxEditData" @closeDialog="closeDialog"></editDataTemplate>
            </el-dialog>

            <!-- 配置事项 -->
            <el-dialog :title="matterTitle" :visible.sync="matterFlag" width="1270px" class="matter" :close-on-click-modal="false">
                <templateMatters v-if="matterFlag" ref='matterFlag' :idS="idS" @closeDialog="closeDialog"></templateMatters>
            </el-dialog>
        </div>

    </div>
</template>
<script>
import unit from '@/api/index';
import addDataTemplate from '@/pages/basicInformation/addDataTemplate';  //新增数据模板
import editDataTemplate from '@/pages/basicInformation/editDataTemplate';  //编辑数据模板
import templateMatters from '@/pages/basicInformation/templateMatters';  //配置事项模板
import tabNavigate from "@/components/common/tabNavigate";   // 页签导航
export default {
    components: {
        addDataTemplate: addDataTemplate,
        tabNavigate: tabNavigate,
        editDataTemplate: editDataTemplate,
        templateMatters: templateMatters
    },
    data() {
        return {
            tabs: ['基础信息管理', '数据模板管理'],
            selectId: [],  //复选框选中id,删除用
            templateType: '', // 模板类型

            templateTypeData: [{ //模板类型数据源
                label: '全部',
                value: ''
            }],
            templateTypeChildData: [],//模板类型子页面数据源
            templateName: '', // 模板名称
            sjlxData: [{     //数据类型数据源
                label: '全部',
                value: ''
            }],
            sjlxEditData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            templateData: [],  //列表数据

            //新增弹窗
            addCaseDialog: false, // 弹框状态
            editCaseDialog: false, //编辑弹框状态

            type: 'add',
            idS: '',  //数据主键
            guideTitle: '新增数据模板',

            //配置事项弹窗
            matterFlag: false,
            matterTitle: '配置事项'
        };
    },
    methods: {
        //修复ie记忆问题
        changeTemplateName(val) {
            this.templateName = val == '' ? '' : val;
        },
        //获取复选框数据
        changeFun(val) {
            this.selectId = val;
        },
        //关闭弹窗
        closeDialog() {
            this.addCaseDialog = false;
            this.editCaseDialog = false;
            this.matterFlag = false;
            //刷新数据
            this.getTemplateData();
        },
        /*
        ** 打开弹窗
        */
        addMattCaseEvt(type, id) {
            let _that = this;
            _that.idS = id;
            if (id) {
                _that.guideTitle = "编辑数据模板";
            } else {
                _that.guideTitle = "新增数据模板";
            }

            if (type == 'edit') {
                _that.editCaseDialog = true;
            } else {
                _that.addCaseDialog = true;
            }
        },
        //配置事项弹窗
        matterSet(e, id) {
            let _that = this;
            _that.idS = id;
            _that.matterFlag = true;
        },
        //删除事件
        delEve(type, ids) {
            let that = this,
                id = '',
                tips = '确定要删除这条记录吗？';
            if (type == 'delAll') {
                for (let i = 0; i < that.selectId.length; i++) {
                    id += that.selectId[i].id + ',';
                }
                if (!id) {
                    tips = '请选择要删除的记录！';
                    that.$Message.warning(tips);
                    return;
                }
                id = id.substring(0, id.length - 1);
                tips = '确定要删除选中的记录吗？';
            } else {
                id = ids;
            }

            that.$confirm(tips, '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                that.delData(id);
            }).catch(() => {

            });
        },
        //删除接口调用
        delData(ids) {
            let _that = this,
                jsonObj = {
                    ids: ids
                };
            unit.ajaxMerPost('/znsj-web/data/template/delete', jsonObj, function (res) {
                if (res.flag == true) {
                    _that.$Message.success('删除成功');
                    _that.getTemplateData(); //刷新列表
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
                _that.getTemplateData(); //刷新列表
            }, _that);
        },
        /*
        ** 获取列表数据
        */
        getTemplateData() {
            let _that = this,
                jsonObj = {
                    templateType: _that.templateType,
                    templateName: _that.templateName.trim(),
                    pageNum: _that.currentPage,
                    pageSize: _that.pageSize
                };
            unit.ajaxObjPost('/znsj-web/data/template/list', jsonObj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.total = data.total;
                    _that.currentPage = data.pageNum;
                    data = data.rows;
                    if (_that.currentPage != 1 && data.length == 0) { //处理最后一页数据的删除，页数减一
                        _that.currentPage--;
                        _that.getTemplateData(); //刷新列表
                    } else {
                        _that.templateData = data;
                    }
                } else {
                    _that.$Message.warning('请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning('请求数据失败');
            }, _that);
        },
        /*
        ** 查询
        */
        searchEvt() {
            let _that = this;
            _that.currentPage = 1;
            _that.getTemplateData();
        },
        /*
        ** 事项列表每页显示数据量变更
        */
        cfgSizeChange: function (val) {
            let _that = this;
            _that.pageSize = val;
            _that.currentPage = 1;
            _that.getTemplateData();
        },
        /*
        ** 事项列表页码变更
        */
        cfgCurrentChange: function (val) {
            let _that = this;
            _that.currentPage = val;
            _that.getTemplateData();
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
                    if (str === 'mblx') {
                        _that.templateTypeChildData = JSON.parse(JSON.stringify(data));
                        _that.templateTypeData = data;
                        _that.templateTypeData.unshift({
                            label: '全部',
                            value: ''
                        });
                        _that.templateType = '';
                    } else if (str === 'yssjlx') {
                        _that.sjlxData = JSON.parse(JSON.stringify(data));
                        _that.sjlxEditData = JSON.parse(JSON.stringify(data));
                        _that.sjlxData.unshift({
                            label: '全部',
                            value: ''
                        });
                    }
                } else {
                    _that.$Message.warning('服务端错误');
                }
            }, function (res) {
                _that.$Message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 模板类型字典
        */
        getMblxData() {
            let _that = this;
            _that.getDictionarys('mblx');
        },
        /*
        ** 数据类型字典
        */
        getSjlxData() {
            let _that = this;
            _that.getDictionarys('yssjlx');
        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.getMblxData();// 模板类型字典
            _that.getSjlxData();// 数据类型字典
            _that.searchEvt();
        }
    },
    mounted() {
        this.init();
        // this.$nextTick(function(){
        //     unit.JPlaceHolder();
        // }); 
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
.v-modal {
    z-index: 999 !important;
}

#dataTemplate {
    overflow: auto;
    height: 100%;
    padding: 0 20px 0 20px;
    background-color: #edf0f6;

    .el-dialog__body {
        padding: 30px 20px;
    }

    .footer {
        margin: 15px 0 0 0;
        height: 58px;
        text-align: right;
        background-color: #fff;
        line-height: 58px;

        .button {
            height: 32px !important;
        }
    }

    .main-wrap {
        padding: 20px 20px 15px 20px;
        background-color: #fff;
    }

    .el-dialog__wrapper {
        z-index: 1000 !important;

        .el-dialog {
            width: 75%;

            .el-dialog__header {
                border-bottom: 1px solid #e8eaec;
            }

            .el-dialog__body {
                padding-top: 10px;
                overflow-y: auto;
            }
        }
    }

    .add-template {
        .el-dialog__body {
            overflow-y: visible;
        }
    }

    .el-table td {
        padding: 4px 0;
    }

    .el-table td .cell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .panel-border {
        border: 1px solid #e0e6f1;
        border-bottom: none;
    }

    .el-dropdown-menu {
        width: 10%;
    }

    .clear:after {
        content: '';
        display: table;
        clear: both;
        zoom: 1;
    }

    .higher-search-a {
        float: right;
        margin: 0 15px 0 10px;
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 0;
        border-bottom: 0 !important;
        padding-left: 50px;
        background-color: #f8f9fb !important;
    }

    .btn-groups {
        margin-top: 25px;
    }

    .search-wrap {
        padding-left: 12px;
        margin-top: 18px;

        .el-button--primary {
            color: #fff;
            background-color: #2d8cf0;
            border-color: #2d8cf0;
            height: 32px;
        }

        .el-button--danger {
            color: #fff;
            background-color: #ed3f14;
            border-color: #ed3f14;
            height: 32px;
        }
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

        .el-select {
            width: 100%;
        }
    }

    .xzqhWt {
        width: 100%;
    }

    .common-other-width {
        width: 40%;
        vertical-align: middle;
    }

    .matt-class {
        .el-select {
            width: 100%;
        }
    }

    .status-width {
        width: 67.2%;
    }
}
</style>
