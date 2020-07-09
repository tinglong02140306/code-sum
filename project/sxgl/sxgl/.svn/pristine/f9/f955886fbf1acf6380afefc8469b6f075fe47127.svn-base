/*
 * @Author: tinglong 
 * @Date: 2018-10-230 08:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-13 23:35:18
 */

<template>
    <div id="matteListPage">
        <!-- 头部标题 -->
        <div class="table-head font-min">请选择一个或多个事项</div>
        <!-- 搜索条件 -->
        <div class="search-wrap">
            <!-- 基本查询条件 -->
            <div class="basic-search">
                <el-row class="mb15">
                    <el-col :span="6">
                        <label class="font-min">行政区划</label>
                        <div class="inlb">
                            <Cascader class="inlb" :data="xzqhTreeData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select filterable @on-change="changeXzqh" :transfer="true"></Cascader>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <label class="font-min">所属部门</label>
                        <div class="inlb">
                            <el-select v-model="deptVal" size="small" filterable>
                                <el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <label class="font-min">事项名称</label>
                        <div class="inlb">
                            <el-input v-model="matterNameVal" :maxlength="100" placeholder="请输入事项名称" size="small" @change="(val)=>changeInput(val, 'matterNameVal')"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="inlb ml30">
                            <el-button class="mr10 w70 h30" type="primary" size="mini" @click="searchEvt">查询</el-button>
                            <a ref="" class="text-blue fz14" href="javascript:void(0)" @click="dUpSearchEvt">
                                <span class="font-min">{{ moreMsg }}</span>
                                <!-- 引入iconfont icon-xia icon-shang 图标名称已定义死 -->
                                <i class="iconfont font-min" :class="moreMsg == '更多' ? 'icon-xia' : 'icon-shang'"></i>
                            </a>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 高级查询条件 -->
            <div class="senior-search" :class="moreMsg == '更多' ? 'hide':''">
                <el-row class="mb15">
                    <el-col :span="6">
                        <label class="font-min">事项分类</label>
                        <div class="inline-block common-width matt-class">
                            <el-select v-model="matterClassifyVal" size="small">
                                <el-option v-for="item in matteClaData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <label class="font-min">事项类型</label>
                        <div class="inline-block common-width">
                            <el-select v-model="matterTypeVal" size="small">
                                <el-option v-for="item in mattetypeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <label class="font-min">事项编码</label>
                        <div class="inline-block common-other-width">
                            <el-input v-model="matterCodeVal" :maxlength="50" placeholder="请输入事项编码" style="width: 180px" size="small" @change="(val)=>changeInput(val, 'matterCodeVal')"/>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
                <!-- <el-row class="mb15">
                    <el-col :span="6">
                        <label>状态</label>
                        <div class="inline-block status-width">
                            <el-select v-model:bind="stateVal" size="small">
                                <el-option v-for="item in stateData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col> -->
                <!-- </el-row> -->
            </div>
        </div>
        <!-- 表单部分 -->
        <div class="list-wrap">
            <el-table :data="receiptConfigData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="light">
                <el-table-column show-overflow-tooltip width="30">
                    <template scope="scope">
                        <i class="iconfont matte-checkbox f20" :class="scope.row.checked === '1' ? 'icon--fuxuankuang' : 'icon-fuxuankuang'" @click="matteCheckedEvt(scope.row, scope.$index)"></i>
                    </template>
                </el-table-column>
                <!-- 展开项 -->
                <el-table-column type="expand" prop="children" label="展/收" width="60">
                    <template scope="scope">
                        <el-table :data="scope.row.childs" tooltip-effect="light" :show-header="false">
                            <el-table-column width="40">
                                <template scope="scope">
                                    <i class="iconfont matte-checkbox f20" :class="scope.row.checked === '1' ? 'icon--fuxuankuang' : 'icon-fuxuankuang'" @click="matteCheckedEvt(scope.row, scope.$index,'child')"></i>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column width="28">
                                <template scope="scope">
                                </template>
                            </el-table-column> -->
                            <el-table-column label="事项名称" show-overflow-tooltip>
                                <template scope="scope">
                                    <a :title="scope.row.matterName" href="javascript:void(0);" class="mattLink" @click="receConClick(scope.row)">{{scope.row.matterName}}</a>
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
                        <a :title="scope.row.matterName" href="javascript:void(0);" class="mattLink" @click="receConClick(scope.row)">{{scope.row.matterName}}</a>
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
            <div class="block fr mt10">
                <el-pagination :total="total" :page-size="pageSize" :current-page="currentPage" @size-change="cfgSizeChange" @current-change="cfgCurrentChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import unit from "@/api";   // 公共工具方法
export default {
    components: {
    },
    // props: {
    //     matteChechedData: {
    //         type: Array,
    //         default: []
    //     }
    // },
    props:['matteChechedData'],
    data() {
        return {
            xzqhVal: [],  // 行政区划值
            tempxzqhVal: [], //行政区划暂存
            xzqhTreeData: [],  // 行政区划值
            xzqhFlag: true,  //首次加载  是否是第一次加载标志位
            xzqhReFirFlag: true,  // 行政区划第一次请求标志位

            deptVal: '',  // 所属部门
            deptData: [{
                label: '全部',
                value: ''
            }],  // 所属部门下拉框数据
            matterNameVal: '',  // 事项名称

            matteClaData: [],  // 事项分类
            mattetypeData: [],  // 事项类型
            // stateData: [],

            matterClassifyVal: '',  // 事项分类
            matterTypeVal: '', // 事项类型
            matterCodeVal: '',  // 事项编码
            // stateVal: '',  // 状态

            moreMsg: '更多', // 更多 常规

            receiptConfigData: [],  // 收件事项列表页数据

            total: 0,  // 总条数
            pageSize: 10, // 当前页条数
            currentPage: 1,  // 当前页
        };

    },
    methods: {
        /**
         *  修复ie记忆问题
         */
        changeInput(val,key) {
            let that = this;
            that[key] = val == '' ? '' : val;
        },
         /**
         *  事项数据处理
         */
        matteInit() {
            let that = this,
                data = that.receiptConfigData;
            that.dealMatteData(data);
        },
        /**
         *  事项数据处理
         */
        dealMatteData(data) {
            let that = this,
                indexList = [];
            // 添加 checked 标志位
            for(let i = 0; i < data.length; i++) {
                if(that.matteChechedData && that.matteChechedData.length > 0) {
                    // 遍历父项
                    for(let j = 0; j < that.matteChechedData.length; j++) {
                        if(that.matteChechedData[j].matterCode == data[i].matterCode) {
                            // 已选择数据记录
                            indexList.push([i]);  
                        }
                        // 遍历子项
                        if(data[i].childs && data[i].childs.length > 0) { 
                            for(let k = 0; k < data[i].childs.length; k++) {
                                if(that.matteChechedData[j].matterCode == data[i].childs[k].matterCode) {
                                    // 已选择数据记录
                                    indexList.push([i,k]);
                                }  
                            }
                        }
                    }
                }
                // 选择项数据  未选中状态
                if(data[i].childs && data[i].childs.length > 0) {
                    for(let m = 0; m < data[i].childs.length; m++) {
                        data[i].childs[m].checked = '0';
                        data[i].childs[m].parentIndex = i;
                    }
                }
                data[i].checked = '0';
            }
            // 已选择数据渲染
            if(indexList && indexList.length > 0) {
                for(let i = 0; i < indexList.length; i++) {
                    if(indexList[i].length == 1) {
                        data[indexList[i][0]].checked = '1';
                    }else if(indexList[i].length == 2) {
                        data[indexList[i][0]].childs[indexList[i][1]].checked = '1';
                    }  
                }
            }
            that.receiptConfigData = data;
        },
        /*
         * 事项名称  复选框事件添加
         */
        matteCheckedEvt(row,index,type) {
            let that = this,
                state,
                addInfo,
                delIndex = '';
            if(type == 'child') {
                state = that.receiptConfigData[row.parentIndex].childs[index].checked;
            }else {
                state = that.receiptConfigData[index].checked;
            }
            if(state == '1') {
                if(type == 'child') {
                    that.receiptConfigData[row.parentIndex].childs[index].checked = '0';
                }else {
                    that.receiptConfigData[index].checked = '0';
                }
                 addInfo = '0';
                // 记录数据删除位置
                for(let i = 0; i < that.matteChechedData.length; i++) {
                    if(row.matterCode == that.matteChechedData[i].matterCode) {
                        delIndex = i;
                    }
                }
            }else if(state == '0') {
                 if(type == 'child') {
                    that.receiptConfigData[row.parentIndex].childs[index].checked = '1';
                }else {
                    that.receiptConfigData[index].checked = '1';
                }
                addInfo = '1';
               
            }
            that.$emit('getMatteName', {
                data: row,
                addInfo: addInfo,
                delIndex: delIndex
            });
        },
        /*
         * 获取行政区域数据 第一次请求全部省
         */
        getXzqhTreeData() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', {}, function (res) {
                $.each(res.data, function (index, item) {
                    item.children = [];
                    item.loading = false;
                })
                that.xzqhTreeData = res.data;
                if(that.xzqhReFirFlag) {
                    // 默认
                    that.xzqhTreeData.unshift({
                        label: '全部',
                        value: ''
                    });
                    that.xzqhReFirFlag = false;
                }
                // 获取默认行政区域
                setTimeout(function () {
                    that.getDefaultXzqh();
                }, 0);
            }, function (res) {
                that.$Message.warning('数据加载失败');
            }, that);
        },
        /*
         * 获取所属部门
         */
        getDeptData() {
            let that = this,
                obj = {
                    adminDiv: that.xzqhVal[that.xzqhVal.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                that.deptData = res.data;
                that.deptData.unshift({
                    label: '全部',
                    value: ''
                });
                that.deptVal = '';
            }, function (res) {
                that.$message.warning('数据加载失败');
            }, that);
        },
        /*
         * 动态获取数据，数据源需标识 loading  根据父值 获取子值
         */
        xzqhLoadData(item, callback) {
            let that = this,
                qhCode = item.value,
                itenLen = item.__value.split(',').length;
            item.loading = true;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
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
                    if (that.xzqhFlag) {
                        setTimeout(function () {
                            that.xzqhVal = that.tempxzqhVal;
                            that.xzqhFlag = false;
                            // 联动所属部门
                            that.getDeptData();
                        }, 0);
                    }
                    item.loading = false;
                    callback();
                }, function (error) {
                    that.$Message.warning('数据加载失败');
                }, that);
            }, 300);
        },
        /*
         * 获取默认行政区划
         */
        getDefaultXzqh() {
            // let that = this;
            // // 获取行政区划默认值
            // unit.ajaxMerPost('/znsj-web/commer/curentUserXzqh', {
            //     pinYinType: 'XZQH'
            // }, function (res) {
            //     if (res.flag) {
            //         that.tempxzqhVal = [];
            //         that.xzqhVal = [];
            //         let data = res.data;
            //         for (let i in data) {
            //             that.xzqhVal.push(data[i].value);
            //             // 缓存默认值
            //             that.tempxzqhVal.push(data[i].value);
            //         }
            //         // that.getConfigData();
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
         * 事项分类字典
         */
        getMatterClaData() {
            let that = this;
            // 获取事项分类字典
            that.getDicData('SXFL', function (data) {
                that.matteClaData = [{
                    label: '全部',
                    value: ''
                }];
                for (let i in data) {
                    that.matteClaData.push(data[i]);
                }
                that.matterClassifyVal = '';
            });
        },
        /*
         * 事项类型字典
         */
        getSxlxData() {
            let that = this;
            // 获取事项类型字典
            that.getDicData('SXLX', function (data) {
                that.mattetypeData = [{
                    label: '全部',
                    value: ''
                }]
                for (let i in data) {
                    that.mattetypeData.push(data[i]);
                }
                that.matterTypeVal = '';
            });
        },
        /*
         * 行政区划change事件
         */
        changeXzqh(value, selectedData) {
            let that = this;
            if (value.length === 0) { // 行政区划清空时部门和机构清空
                that.deptData = [];
                that.deptVal = '';
            } else {
                that.xzqhVal = value;
            }
            if (!this.xzqhFlag) {
                that.getDeptData();// 联动部门
            }
        },
        /*
         * 搜索条件上拉下拉
         */
        dUpSearchEvt() {
            let that = this;
            that.moreMsg = that.moreMsg == '常规' ? '更多' : '常规';
        },
        /*
         * 查询
         */
        searchEvt() {
            let that = this;
            that.currentPage = 1;
            that.getConfigData();
        },
        /*
         * 获取字典项公共方法
         */
        getDicData(param, success) {
            let that = this;
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', { pinYinType: param }, function (res) {
                res = typeof res === 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (data && data.length > 0) {
                    success && success(data);
                }
            }, function (error) {
                that.$Message.error('数据加载失败');
            }, that);
        },
        /*
         * 获取各种字典项
         */
        getSumDictionary() {
            let that = this;
            // 获取事项分类
            that.getMatterClaData();
            // 事项类型
            that.getSxlxData();
            // 状态字典项
            // that.getStateData();
        },

        /********************************列表处理开始***************************************** */
        /*
        ** 获取事项配置列表数据
        */
        getConfigData() {
            let that = this,
                jsonObj = {
                    adminDiv: that.xzqhVal[that.xzqhVal.length - 1],
                    deptCode: that.deptVal,
                    matterClassify: that.matterClassifyVal,
                    matterCode: that.matterCodeVal,
                    matterName: that.matterNameVal,
                    matterType: that.matterTypeVal,
                    status: '01',  // 只显示启用状态 01
                    pageNum: that.currentPage,
                    pageSize: that.pageSize
                };
            unit.ajaxObjPost('/znsj-web/matterAllocation/getEventMatter', jsonObj, function (res) {
                let data = res.data;
                that.total = data.total;
                that.currentPage = data.pageNum;
                data = data.rows;
                $.each(data, function (index, item) {
                    item.matterName = item.matterName === (null || '') ? '--' : item.matterName;
                    item.adminDivName = item.adminDivName === null ? '--' : item.adminDivName;
                    item.deptName = item.deptName === (null || '') ? '--' : item.deptName;
                    item.status = item.status === (null || '') ? '--' : item.status;
                });
                that.dealMatteData(data);
                // let indexList = [];
                // // 添加 checked 标志位
                // for(let i = 0; i < data.length; i++) {
                //     if(that.matteChechedData && that.matteChechedData.length > 0) {
                //         // 遍历父项
                //         for(let j = 0; j < that.matteChechedData.length; j++) {
                //             if(that.matteChechedData[j].matterCode == data[i].matterCode) {
                //                 // 已选择数据记录
                //                 indexList.push([i]);  
                //             }
                //             // 遍历子项
                //             if(data.childs && data.childs.length > 0) { 
                //                 for(let k = 0; k < data.childs.length; k++) {
                //                     if(that.matteChechedData[j].matterCode == data[i].childs[k].matterCode) {
                //                         // 已选择数据记录
                //                         indexList.push([i,k]);
                //                     }  
                //                 }
                //             }
                //         }
                //     }
                //     // 选择项数据  未选中状态
                //     if(data[i].childs && data[i].childs.length > 0) {
                //         for(let m = 0; m < data[i].childs.length; m++) {
                //             data[i].childs[m].checked = '0';
                //             data[i].childs[m].parentIndex = i;
                //         }
                //     }
                //     data[i].checked = '0';
                //     // data[i].parentIndex = i;
                // }
                // // 已选择数据渲染
                // if(indexList && indexList.length > 0) {
                //     for(let i = 0; i < indexList.length; i++) {
                //         if(indexList[i].length == 1) {
                //             data[indexList[i][0]].checked = '1';
                //         }else if(indexList[i].length == 2) {
                //             data[indexList[i][0]].childs[indexList[i][1]].checked = '1';
                //         }  
                //     }
                // }
                // that.receiptConfigData = that.dealMatteData(data);
            }, function (res) {
                that.$message.warning('请求数据失败');
            }, that);
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
        ** 事项列表每页显示数据量变更
        */
        cfgSizeChange: function (val) {
            let that = this;
            that.pageSize = val;
            that.currentPage = 1;
            that.getConfigData();
        },
        /*
         * 事项列表页码变更
         */
        cfgCurrentChange: function (val) {
            let that = this;
            that.currentPage = val;
            that.getConfigData();
        },
        /*
         * 列表项点击事件 子组件向父组件传值
         */
        receConClick(data) {
            let that = this;
            // getMatteName  父组件上的监听方法
            that.$emit('getMatteName', data)
        },
        /*
         * 初始化数据
         */
        init() {
            let that = this;
            // 获取总的字典项
            that.getSumDictionary();
            // 获取行政区划数据 
            that.getXzqhTreeData();
            // 获取列表数据
            that.getConfigData();
            // 解决ie兼容性问题 requestAnimationFrame
            unit.solveAnimFrame();
        }
    },
    mounted() {
        let that = this;
        that.init();
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
#matteListPage {
    overflow-y: auto;
    margin: 5px;
    height: 100%;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    // 头部
    .table-head {
        width: 100%;
        background: #f9f9f9;
        font-size: 14px;
        line-height: 40px;
        text-indent: 20px;
        border-bottom: 1px solid #e4e4e4;
    }
    // 搜索条件样式
    .search-wrap {
        margin: 15px 0;
        .mb15 {
            margin-bottom: 15px;
        }
        label {
            display: inline-block;
            padding-right: 10px;
            height: 32px;
            width: 80px;
            text-align: right;
            vertical-align: top;
            line-height: 32px;
        }
        .inlb {
            display: inline-block;
            vertical-align: top;
        }
        .el-select,
        input,
        .el-input {
            width: 180px !important;
        }
    }
    .list-wrap {
        margin: 0 10px 52px 10px;
        .row-expand-cover {
            td:nth-child(2) .el-table__expand-icon {
                display: none;
            }
        }
        // 事项名称字体颜色
        .mattLink {
            color: @baseFontColor;
            cursor: default;
        }
        // table行高
        .el-table__row {
            height: 49px;
        }
        .matte-checkbox {
            font-size: 18px;
            line-height: 33px;
        }
        .icon--fuxuankuang {
            color:#409eff;
        }
        .el-table {
            border: none;
        }
        .el-table__expanded-cell[class*=cell] {
            padding: 0 0 0 40px;
            border-bottom: 0 !important;
            border: none;
            background-color: #f8f9fb !important;
        }
    }
}
</style>
