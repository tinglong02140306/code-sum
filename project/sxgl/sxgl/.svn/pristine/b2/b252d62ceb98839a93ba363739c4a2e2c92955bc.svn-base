/*
 * @Author: qijiang 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-15 15:57:18
 */
<template>
    <div id="dataTemplateSet">
        <div class="clearfix data-template-main">
            <div class="left-wrap fl">
                <div class="template-search">
                    <el-row>
                        <el-col :span="14">
                            <div class="inline-block common-width">
                                <el-input v-model="templateName" :maxlength="10" size="small" @change="changeTemplateName"></el-input>
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
                <Tree ref="treeNode" :data="dataTemplateTree" show-checkbox @on-select-change="treeClick" @on-check-change="checkClick"></Tree>
            </div>
            <p class="template-line"></p>
            <div class="right-wrap fr">
                <p class="no-data" v-show="shouNoData">
                    <i class="iconfont icon-gantanhao"></i>
                    请在左侧选择一个或多个数据模板
                </p>
                <div class="list-wrap" v-show="!shouNoData">
                    <div class="nav-wrap clearfix">
                        <Icon type="ios-arrow-back" @click="scrollLast" v-if="showBtn" />
                        <div class="sub-wrap clearfix" :style="{width: subWrapWid}">
                            <div class="sub-item" :style="{width: subWid}">
                                <span class="switch-default clearfix" v-for="(views ,index) in tableList" :class="{cur:iscur==index}" :title="views.templateName">
                                    <span @click="navClick(index)" class="ell font-max">{{views.templateName}}</span>
                                    <i @click="delTree(views)" class="iconfont icon-fork"></i>
                                </span>
                            </div>
                        </div>
                        <Icon type="ios-arrow-forward" @click="scrollNext" v-if="showBtn" />
                    </div>
                    <div class="table-wrap">
                        <div class="table-form" v-for="(views ,index) in tableList" v-if="iscur==index">
                            <el-table :data="views.listAttr" tooltip-effect="light">
                                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                                <el-table-column label="数据模板名称">
                                    <template scope="scope">
                                        <span :title="scope.row.templateName">{{scope.row.templateName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="要素名称">
                                    <template scope="scope">
                                        <span :title="scope.row.attrName">{{scope.row.attrName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="要素标识">
                                    <template scope="scope">
                                        <span :title="scope.row.attrCode">{{scope.row.attrCode}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数据类型">
                                    <template scope="scope">
                                        <span :title="scope.row.attrTypeTxt">{{scope.row.attrTypeTxt}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度">
                                    <template scope="scope">
                                        <span :title="scope.row.attrLength">{{scope.row.attrLength}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="showGoBtn">
            <el-button id="templateSetBtn" type="primary" size="small" @click="nextStep" :disabled="shouNoData">下一步</el-button>
        </div>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
export default {
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
            shouNoData: true, //空数据标志位
            //是否显示按钮
            showBtn: false,
            subWid: '100%',
            subWrapWid: '96%',
            iscur: 0, //当前选中列表

            distance: 0, //左右移动距离

            templateName: '',  //搜索值、模板名称
            dataTemplateTree: [   //树结构列表
                {
                    title: '数据模板',
                    expand: true,
                    children: []
                }
            ],
            tempData: [  //中间值存储
                {
                    title: '数据模板',
                    expand: true,
                    children: []
                }
            ],
            // 列表数据
            tableList: []
        }
    },
    methods: {
        //修复ie记忆问题
        changeTemplateName(val) {
            this.templateName = val == '' ? '' : val;
        },
        //关闭树结构
        closeTree() {
            this.dataTemplateTree[0].expand = false;
        },
        //展开树结构
        showTree() {
            this.dataTemplateTree[0].expand = true;
        },
        /*
        ** 请求左边树的数据
        ** ids 搜索时有用，排除已选中的id
        ** isFirst 搜索时0，第一次进入为1
        */
        getTreeData() {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    matterCode: _that.param.matterCode,
                    matterVersion: _that.param.matterVersion,
                    isFirst: 1,
                    templateName: _that.templateName.trim()
                };
            unit.ajaxObjPost('/znsj-web/data/template/tree', jsonObj, function (res) {
                if (res.flag == true) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].children.length > 0) {
                            res.data[i].expand = true;  //数据展开
                            $(res.data[i].children).each(function (index, obj) {
                                if (obj.linkId) {  //判断数据是否选中
                                    obj.checked = true;  //数据选中
                                }
                            });
                        }
                    }
                    //赋值
                    _that.dataTemplateTree[0].checked = false;
                    _that.dataTemplateTree[0].children = res.data;
                    _that.tempData[0].children = JSON.parse(JSON.stringify(res.data));

                    //根据树结构，请求列表数据
                    let ids = _that.getCheckedId();
                    if (ids) {
                        _that.shouNoData = false;
                        _that.$parent.jumpFlag = true; //有数据，步骤条可以点击
                        _that.getDetailByTempId(ids);
                    } else {
                        _that.$parent.jumpFlag = false; //无数据，步骤条不可以点击
                        _that.shouNoData = true; //无数据，展示无数据
                    }
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        /*
        ** 获取列表数据
        ** ids 根据已选中的id获取列表
        */
        getDetailByTempId(ids) {
            let _that = this,
                jsonObj = {
                    templateIds: ids,
                };
            unit.ajaxMerPost('/znsj-web/data/temp/attr/getDetailByTempId', jsonObj, function (res) {
                if (res.flag == true) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].listAttr.length > 0) {
                            $(res.data[i].listAttr).each(function (index, obj) {
                                obj.templateName = res.data[i].templateName;  //去外层数据给内层
                            });
                        }
                    }
                    //赋值
                    _that.tableList = res.data;

                    if(res.data.length != 0 && _that.iscur >= res.data.length) {
                        _that.iscur = res.data.length - 1;
                    }
                    setTimeout(function () {
                        _that.cupWidth();  //计算导航宽度，自适应
                    }, 0);
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        //树文本的点击事件--暂时没用
        treeClick(node) {

        },
        //树复选框的点击事件
        checkClick(node) {
            let flag = this.getDelData();
            if (flag) {
                this.getSaveData();
            }
        },
        //获取删除的数据
        getDelData() {
            let firstData = this.tempData[0].children,
                secondData = this.dataTemplateTree[0].children,
                ids = '';
            for (let i = 0; i < firstData.length; i++) {
                $(firstData[i].children).each(function (index, obj) {
                    if (obj.checked && !secondData[i].children[index].checked) {
                        ids += obj.id + ',';
                    }
                });
            }
            ids = ids.substring(0, ids.length - 1);

            if (ids != '') {
                this.delTree('', ids);
                return false;
            } else {
                return true;
            }
        },
        //获取保存的数据
        getSaveData() {
            let firstData = this.tempData[0].children,
                secondData = this.dataTemplateTree[0].children,
                ids = '';
            for (let i = 0; i < firstData.length; i++) {
                $(firstData[i].children).each(function (index, obj) {
                    if (!obj.checked && secondData[i].children[index].checked) {
                        ids += obj.id + ',';
                    }
                });
            }
            ids = ids.substring(0, ids.length - 1);

            if (ids != '') {
                this.saveData(ids);
            }
        },
        //获取选中的数据
        getCheckedId() {
            let ids = '',
                data = this.dataTemplateTree[0].children,
                len = data.length;
            for (let i = 0; i < len; i++) {
                $(data[i].children).each(function (index, obj) {
                    if (obj.checked) {
                        ids += obj.id + ',';
                    }
                });
            }

            ids = ids.substring(0, ids.length - 1);
            return ids;
        },
        //导航点击切换
        navClick(index) {
            this.iscur = index;
        },
        //计算导航滚动宽度
        cupWidth() {
            let len = this.tableList.length,  //导航个数
                distanceRight = 0,   //距右边距离
                allWid = $('.nav-wrap')[0].offsetWidth,  //容器宽度
                subWrapWid = 0,
                subWid = 0,
                $dom = $('.sub-wrap .switch-default');  //每个导航
            for (let i = 0; i < len; i++) {
                subWid += $dom[i].offsetWidth + 2;
                distanceRight += 5;
            }

            if (subWid > allWid) {
                this.showBtn = true;
                subWrapWid = allWid - 36;
            } else {
                this.showBtn = false;
                subWrapWid = allWid;
            }
            if (subWid < 276) {
                subWid = 276;
            }
            this.subWrapWid = subWrapWid + 'px';
            this.subWid = subWid + distanceRight - 2 + 'px';
        },
        //向左滚动
        scrollLast() {
            this.distance -= 50;
            $('.sub-wrap').scrollLeft(this.distance);
            if (this.distance < 0) {
                this.distance = 0;
            }
        },
        //向右滚动
        scrollNext() {
            let maxWid = this.subWid.substr(0, this.subWid.length - 2) - this.subWrapWid.substr(0, this.subWrapWid.length - 2);
            this.distance += 50;
            $('.sub-wrap').scrollLeft(this.distance);
            if (this.distance > maxWid) {
                this.distance = maxWid;
            }
        },
        //搜索按钮
        searchBtn() {
            let ids = this.getCheckedId(),
                idsArray = [];
            if (ids) {
                idsArray = ids.split(',');
            }
            //点击一次，请求一次数据
            this.getTreeData();
        },
        //保存树选中数据
        saveData(ids) {
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    selectTempIds: ids.split(',')
                };
            unit.ajaxObjPost('/znsj-web/link/template/add', jsonObj, function (res) {
                if (res.flag == true) {
                    _that.getTreeData();
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        //删除树选中数据
        delTree(views, ids) {
            if (views != '') {
                ids = views.id;
            }
            let _that = this,
                jsonObj = {
                    linkId: _that.param.linkId,
                    selectTempIds: ids.split(',')
                };
            unit.ajaxObjPost('/znsj-web/link/template/delete', jsonObj, function (res) {
                if (res.flag == true) {
                    _that.getTreeData();
                } else {
                    _that.$Message.warning(res.errMsg || '请求数据失败');
                }
            }, function (res) {
                _that.getTreeData();
                _that.$Message.warning(res.data.errMsg || '请求数据失败');
            }, _that);
        },
        //下一步按钮，需要判断是否有数据
        nextStep() {
            //保存成功，跳转下一步
            this.$emit('go', 'next');
        },
        //供父事项调用
        parentHandle() {
            
        }
    },
    mounted() {
        //请求树结构数据
        this.getTreeData();
    }
};
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#dataTemplateSet {
    .data-template-main {
        position: relative;
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
        .el-table td {
            padding: 12px 0;
        }
        .left-wrap {
            overflow: auto;
            padding: 20px 10px 0 10px;
            width: 30%;
            min-height: 600px;
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
            }
        }
        .right-wrap {
            padding: 20px 10px 15px 10px;
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
                                margin-right: 5px;
                                background-color: #f4f6f9;
                                height: 40px;
                                line-height: 38px;
                                text-align: center;
                                color: #515a6e;
                                box-sizing: border-box;
                                border: 1px solid #e4e4e4;
                                cursor: pointer;
                                span {
                                    float: left;
                                    padding: 0 10px;
                                    height: 38px;
                                    max-width: 250px;
                                }
                                i {
                                    float: left;
                                    padding-right: 10px;
                                    font-size: 14px;
                                }
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
