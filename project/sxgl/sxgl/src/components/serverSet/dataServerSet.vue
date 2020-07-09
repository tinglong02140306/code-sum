/*
 * @Author: qijiang 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-28 09:32:41
 */
<template>
    <div id="dataServerSet">
        <div class="clearfix data-template-main">
            <div class="left-wrap fl">
                <div class="template-search">
                    <el-row>
                        <el-col :span="14">
                            <div class="inline-block common-width">
                                <el-input v-model="queryName" :maxlength="10" size="small" @change="changeQueryName"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="2" class="left-13">
                            <div class="template-search-btn" @click="searchBtn(2)">
                                <i class="iconfont icon-sousuo"></i>
                            </div>
                        </el-col>
                        <el-col :span="2" class="jiahao">
                            <i class="iconfont icon-jiahao1" @click="showTree"></i>
                        </el-col>
                        <el-col :span="2" class="jianhao">
                            <i class="iconfont icon-jianhao" @click="closeTree"></i>
                        </el-col>
                    </el-row>
                </div>
                <Tree ref="treeNode" :data="dataTemplateTree" :render="renderContent"></Tree>
            </div>
            <p class="template-line"></p>
            <div class="right-wrap fr">
                <div class="list-wrap">
                    <div class="table-wrap">
                        <div class="table-form">
                            <el-table :data="tableList" tooltip-effect="light">
                                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                                <el-table-column label="数据模板名称">
                                    <template scope="scope">
                                        <span :title="scope.row.templateName">{{scope.row.templateName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数据服务" width="130" align="center">
                                    <template scope="scope">
                                        <el-button class="seted" title="未配置" type="text" size="large" @click="matterSet($event,scope.row, false)" v-if="!scope.row.serverCode">未配置</el-button>
                                        <el-button title="已配置" type="text" size="large" @click="matterSet($event,scope.row, true)" v-if="scope.row.serverCode">已配置</el-button>
                                        <el-button title="重置" type="text" size="large" @click="serverReset($event,scope.row, 0 )" :disabled="!scope.row.serverCode">重置</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="showGoBtn">
            <el-button size="small" @click="lastStep">上一步</el-button>
            <el-button type="primary" size="small" @click="nextStep">下一步</el-button>
        </div>

        <!-- 配置事项 -->
        <el-dialog :title="modelTitle" :visible.sync="modelFlag" width="1270px" :close-on-click-modal="false" :append-to-body="true">
            <dataServerSetModel v-if="modelFlag" ref='modelFlag' @closeDialog="closeDialog" :param="param"></dataServerSetModel>
        </el-dialog>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
import dataServerSetModel from "@/components/serverSet/dataServerSetModel";
export default {
    components: {
        dataServerSetModel: dataServerSetModel
    },
    props: {
        showGoBtn: { //是否显示上一步、下一步按钮
            type: Boolean,
            default: false
        },
        param: {
            type: Object
        }
    },
    data() {
        return {
            //是否显示按钮
            showBtn: false,
            subWid: '100%',
            subWrapWid: '96%',

            queryName: '',  //搜索值、模板名称
            dataTemplateTree: [ //树结构列表
                {
                    title: '数据模板',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: 'auto'
                            }
                        }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                })
                            ]);
                    },
                    children: []
                }
            ],

            // 列表数据
            tableList: [],

            modelFlag: false,
            modelTitle: '数据服务配置'
        }
    },
    methods: {
        //修复ie记忆问题
        changeQueryName(val) {
            this.queryName = val == '' ? '' : val;
        },
        //重置服务
        serverReset(e, row, type) {
            let _that = this,
                jsonObj = {
                    dataTemplateId: row.id,
                    linkId: _that.param.linkId,
                    templateType: _that.param.templateType
                };
            _that.$confirm('确定要清除已配置的服务吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                unit.ajaxObjPost('/znsj-web/data/server/clean', jsonObj, function (res) {
                    if (res.flag == true) {
                        _that.getDetailByTempId();
                    } else {
                        _that.$Message.warning(res.errMsg || '请求数据失败');
                    }
                }, function (res) {
                    _that.$Message.warning(res.data.errMsg || '请求数据失败');
                }, _that);
            }).catch(() => {

            });
        },
        //关闭树结构
        closeTree() {
            this.dataTemplateTree[0].expand = false;
        },
        //展开树结构
        showTree() {
            this.dataTemplateTree[0].expand = true;
        },
        //下拉树渲染
        renderContent(h, { root, node, data }) {
            let styleSet = {  //样式设置
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            },
                iconSet = {
                    type: 'ios-paper-outline'
                },
                that = this;
            if (node.children && node.children.length > 0) {  //有子项的样式以及图标设置
                styleSet = {
                    style: {
                        display: 'inline-block',
                        width: 'auto',
                        cursor: 'pointer'
                    }
                };
                iconSet = {
                    type: 'ios-folder-outline'
                };
            }
            return h('span', styleSet, [
                h('span', [
                    h('Icon', {
                        props: iconSet,
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                })
            ]);
        },
        /*
        ** 请求左边树的数据
        */
        getTreeData() {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    queryName: _that.queryName.trim()
                };
            unit.ajaxObjPost('/znsj-web/data/template/selectTree', jsonObj, function (res) {
                if (res.flag == true) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].children && res.data[i].children.length > 0) {
                            res.data[i].expand = true;  //数据展开
                        }
                    }
                    //赋值
                    _that.dataTemplateTree[0].children = res.data;
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        /*
        ** 获取列表数据
        */
        getDetailByTempId() {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId
                };
            unit.ajaxMerPost('/znsj-web/data/template/dateSeriveList', jsonObj, function (res) {
                if (res.flag == true) {
                    //赋值
                    _that.tableList = res.data;
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        //配置事项
        matterSet(e, row, flag) {
            this.param.name = row.templateName;
            this.param.dataTemplateId = row.id;
            this.param.flag = flag;
            this.modelFlag = true;
        },
        //搜索按钮
        searchBtn() {            ;
            //点击一次，请求一次数据
            this.getTreeData();
        },
        //下一步按钮，需要判断数据是否成立完毕
        nextStep() {
            this.$emit('go', 'next');
        },
        //上一步按钮，需要判断数据是否成立完毕
        lastStep() {
            this.$emit('go', 'last');
        },
        //关闭弹框
        closeDialog() {
            this.modelFlag = false;
            this.getDetailByTempId();
        },
        //供父事项调用
        parentHandle() {

        }
    },
    activated() {
        //请求树结构数据
        this.getTreeData();
        //获取列表数据
        this.getDetailByTempId();
    }
};
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#dataServerSet {
    .el-dialog__header {
        border-bottom: 0;
    }
    .data-template-main {
        position: relative;
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
        .el-table td {
            padding: 5px 0;
        }
        .left-wrap {
            overflow: auto;
            min-height: 600px;
            padding: 20px 10px 0 10px;
            width: 30%;
            .left-13 {
                margin-left: -13px;
                margin-right: 0;
            }
            .jiahao {
                margin-left: 20px;
                height: 32px;
                line-height: 32px;
                i {
                    font-size: 20px;
                    color: #2d8cf0;
                    cursor: pointer;
                }
            }
            .jianhao {
                height: 32px;
                line-height: 32px;
                i {
                    font-size: 20px;
                    color: #2d8cf0;
                    cursor: pointer;
                }
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
            .ivu-tree {
                & > .ivu-tree-children > li > .ivu-checkbox-wrapper {
                    display: none;
                }
                ul {
                    li {
                        width: 98%;
                    }
                }
            }
        }
        .right-wrap {
            padding: 0 10px 15px 10px;
            width: 70%;
            min-height: 600px;
            .no-data {
                height: 600px;
                line-height: 600px;
                text-align: center;
                .icon-gantanhao {
                    color: #137ddf;
                    font-size: 34px;
                    vertical-align: middle;
                }
            }
            .list-wrap {
                .nav-wrap {
                    height: 40px;
                    border-bottom: 1px solid #e4e4e4;
                    .sub-wrap {
                        overflow-x: hidden;
                        float: left;
                        height: 40px;
                        .sub-item {
                            height: 100%;
                            font-size: 0px;
                            .switch-default {
                                float: left;
                                padding: 0 20px 0 10px;
                                margin-right: 5px;
                                height: 40px;
                                max-width: 250px;
                                background-color: #f4f6f9;
                                line-height: 38px;
                                text-align: center;
                                color: #515a6e;
                                box-sizing: border-box;
                                border: 1px solid #e4e4e4;
                                cursor: pointer;
                                &.cur {
                                    background-color: #fff;
                                    border-bottom: 1px solid #fff;
                                }
                                &:last-child {
                                    margin-right: 0px;
                                }
                            }
                        }
                    }
                    .ivu-icon {
                        float: left;
                        line-height: 36px;
                        font-size: 18px;
                        cursor: pointer;
                        &.ivu-icon-ios-arrow-forward {
                            float: right;
                            position: relative;
                        }
                    }
                }
                .table-wrap {
                    margin-top: 15px;
                    width: 100%;
                    min-height: 523px;
                    .table-form {
                        border: 1px solid #e0e6f1;
                        border-bottom: none;
                        .el-table {
                            border: none;
                        }
                        //未配置
                        .seted {
                            color: #606266;
                        }
                    }
                }
            }
        }
        .template-line {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 30%;
            width: 1px;
            background: #e4e4e4;
        }
    }
}
</style>
