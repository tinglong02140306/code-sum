/** 
 * @Author: tinglong 
 * @Date: 2018-12-24 16:41:00
 * @Last Modified by: tinglong
 * @Last Modified time: 2018-12-24 16:41:00
 * @description: 统计  
 */
<template>
    <div id="statisticList">
        <tabNavigate :tabs="tabs"></tabNavigate>
        <div class="main-wrap">
            <!-- 搜索条件 -->
            <div class="search-wrap clearfix">
                <el-row type="flex" justify="space-between">
                    <el-col :span="4" :md="4">
                        <div class="mt5">
                            <label class="mr5 fz12">类型</label>
                            <el-radio-group v-model="type" size="mini" @change="typeChange">
                                <el-radio :label="1">事项</el-radio>
                                <el-radio :label="2" class="ml10">一件事</el-radio>
                            </el-radio-group>
                        </div>
                    </el-col>
                    <el-col :span="6" :md="6">
                        <label class="mr5 ml10 fz12">行政区划</label>
                        <div class="inline-block" style="width: 70%">
                            <!-- :render-format="xzqhFormat" -->
                            <Cascader v-model="xzqhVal" :data="xzqhTreeData" :title="xzqhValShow.substring(0,xzqhValShow.length-1)" :load-data="xzqhLoadData" change-on-select :transfer="true" @on-change="changeXzqh"></Cascader>
                        </div>
                    </el-col>
                    <el-col :span="4" :md="4">
                        <label class="mr5 fz12">统计日期</label>
                        <div class="inline-block" style="width: 60%;">
                            <el-select v-model="period" placeholder="请选择" size="small">
                                <el-option
                                    v-for="item in periodOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="4" :md="4">
                        <div class="inline-block ml5 date-wrap" v-show="period == '1'">
                            <Date-picker 
                                type="date" 
                                placeholder="选择日期" 
                                size="large" 
                                style="width: 100%;" 
                                v-model="dayDate"
                                format="yyyy-MM-dd"
                                @on-change="(val)=>dateChange(val,'1')">
                            </Date-picker>
                            <!-- <el-date-picker
                                v-model="dayDate"
                                type="date"
                                size="small"
                                style="width: 100%;"
                                value-format="yyyy-MM-dd"
                                popper-class="date-wrap"
                                @change="(val)=> dateChange(val,'1')">
                            </el-date-picker> -->
                        </div>
                        <div class="inline-block ml5 date-wrap" v-show="period == '2'">
                            <Date-picker 
                                type="month" 
                                placeholder="选择日期" 
                                size="large" 
                                style="width: 100%;" 
                                v-model="monthDate"
                                format="yyyy-MM"
                                @on-change="(val)=>dateChange(val,'2')">
                            </Date-picker>
                            <!-- <el-date-picker
                                v-model="monthDate"
                                type="month"
                                style="width: 100%;"
                                size="small"
                                value-format="yyyy-MM"
                                popper-class="date-wrap"
                                @change="(val)=> dateChange(val,'2')">
                            </el-date-picker> -->
                        </div>
                        <div class="inline-block ml5 date-wrap" v-show="period == '3'">
                            <Date-picker 
                                type="year" 
                                placeholder="选择日期" 
                                size="large" 
                                style="width: 100%;" 
                                v-model="yearDate"
                                format="yyyy"
                                @on-change="(val)=>dateChange(val,'3')">
                            </Date-picker>
                            <!-- <el-date-picker
                                v-model="yearDate"
                                type="year"
                                style="width: 100%;"
                                size="small"
                                value-format="yyyy"
                                popper-class="date-wrap"
                                @on-change="(val)=> dateChange(val,'3')">
                            </el-date-picker> -->
                        </div>
                    </el-col>
                    <el-col :span="2" :md="2">
                        <el-button type="primary" size="small" class="ml5 w70 h30 stat-btn" @click="searchEvent">查询</el-button>
                    </el-col>
                    <el-col :span="4" :md="4">
                        <el-button type="primary" size="small" class="fr w70 h30 stat-btn" @click="exportEvent">导出</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="list-wrap mt20 mb50" :class="isIE9 ? 'ie9-sort-style': ''">
                <el-table :data="listData" style="width: 100%" @sort-change='sortChange' ref="sortTable">
                    <el-table-column type="index" align="center" width="60" label="序号" >
                    </el-table-column>
                    <el-table-column prop="orgName" label="部门名称" show-overflow-tooltip>
                        <!-- <template scope="scope">
                            <span :title="scope.row.orgName" href="javascript:void(0);" class="mattLink wper100 ell">{{scope.row.orgName}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="receiveNum" align="center" width="200" label="收件量" sortable show-overflow-tooltip>
                        <!-- <template scope="scope">
                           <span :title="scope.row.receiveNum == null ? 0: scope.row.receiveNum">{{scope.row.receiveNum == null ? 0: scope.row.receiveNum}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="totalReceiveNum" align="center" width="200" label="累计收件量" sortable show-overflow-tooltip>
                        <!-- <template scope="scope">
                           <span :title="scope.row.totalReceiveNum == null ? 0: scope.row.totalReceiveNum">{{scope.row.totalReceiveNum == null ? 0: scope.row.totalReceiveNum}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="advisoryNum" align="center" width="200" label="咨询打印量" sortable show-overflow-tooltip>
                        <!-- <template scope="scope">
                           <span :title="scope.row.advisoryNum == null ? 0: scope.row.advisoryNum">{{scope.row.advisoryNum == null ? 0: scope.row.advisoryNum}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="totalAdvisoryNum" align="center" width="200" label="累计咨询打印量" sortable show-overflow-tooltip>
                        <!-- <template scope="scope">
                           <span :title="scope.row.totalAdvisoryNum == null ? 0: scope.row.totalAdvisoryNum">{{scope.row.totalAdvisoryNum == null ? 0: scope.row.totalAdvisoryNum}}</span>
                        </template> -->
                    </el-table-column>
                </el-table>
                <div class="block fr mt20 mb20">
                    <el-pagination :total="total" :page-size="pageSize" @size-change="cfgSizeChange" @current-change="cfgCurrentChange" :current-page.sync="currentPage" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
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
            tabs: ['事项管理', '统计分析'],
            // 1：事项 2：一件事
            type: 1, 
            // 行政区划的 value值 
            xzqhVal: [],  
            //行政区划暂存
            saveXzqhVal: [], 
            //首次加载
            xzqhFlag: true,  
            // 行政区划数据
            xzqhTreeData: [], 
            // 行政区划title
            xzqhValShow: '',
            // 周期
            period: '1', 
            // 日期
            yearDate: new Date(),
            monthDate: new Date(),
            dayDate: new Date(),
            defDate: '',
            periodOptions: [{
                label: '日',
                value: '1'
            },{
                label: '月',
                value: '2'
            },{
                label: '年',
                value: '3'
            }],
            // 列表数据
            listData: [],
            // 排序字段 默认按收件量降序
            column: 'receiveNum',
            order: 'desc',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            isIE9: false,
            xzqhCount: 0 // 解决渲染当前用户默认行政区划正常渲染
        }
    },
    methods: {
        /*
         * 获取默认行政区划 -邮寄地址
         */
        getDefaultXzqh() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/commer/curentUserXzqh', {
                pinYinType: 'XZQH'
            }, function (res) {
                if (res.flag) {
                    let data = res.data;
                    that.defXzqhLen = data.length;
                    for (let i in data) {
                        that.xzqhVal.push(data[i].value);
                        that.saveXzqhVal.push(data[i].value);
                    }
                    that.searchEvent();
                } else {
                    that.$Message.warning('服务端错误');
                }
            }, function (res) {
                that.$Message.warning('服务端错误');
            }, that);
        },
        /*
         * 行政区域 - 邮寄地址
         * 获取省 市 区
         */
        getXzqhTreeData() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', {}, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    })
                    that.xzqhTreeData = res.data;
                    // 获取默认行政区域
                    setTimeout(function () {
                        that.getDefaultXzqh();
                    }, 0);
                } else {
                    that.$Message.warning('服务端错误');
                }
            }, function (res) {
                that.$Message.warning('服务端错误');
            }, that);
        },
        /*
         * 动态获取数据，数据源需标识 loading
         */
        xzqhLoadData(item, callback) {
            let that = this,
                qhCode = item.value,
                itenLen = item.__value.split(',').length;
            that.recXzqh = qhCode;
            item.loading = true;
            setTimeout(() => {
                let obj = {
                    value: qhCode
                };
                unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (result) {
                    if (itenLen < 4) {
                        if (result.data.length != 0) {
                            $.each(result.data, function (i, t) {
                                if(t.hasChild == '1') {
                                    t.children = [];
                                    // 有下一级箭头 可加载子类
                                    t.loading = false; 
                                }
                            });
                        }
                    }
                    item.children = result.data;
                    if (that.xzqhCount < that.saveXzqhVal.length) {
                        setTimeout(function () {
                            that.xzqhCount = that.xzqhCount + 1;
                            that.xzqhVal = that.saveXzqhVal;
                        }, 0);
                    }
                    item.__label && (that.xzqhValShow = item.__label);
                    // else {
                    //     that.xzqhVal = item.__value && item.__value.split(',');
                    //     that.getDeptData();//联动部门
                    // }
                    item.loading = false;
                    callback();
                }, function (result) {
                    that.$Message.warning('数据加载失败');
                }, that);
            }, 300);
        },
        /*
        ** 行政区划 change事件
        */
        changeXzqh(value, selectedData) {
            let that = this;
            that.xzqhValShow = "";
            for(let item of selectedData){
                that.xzqhValShow += item.label+'/'
            }
            if (value.length === 0) {
                that.xzqhVal = [];
            } else {
                that.xzqhVal = value;
            }
            if(that.xzqhCount > that.saveXzqhVal.length) {
                that.searchEvent();
            }
        },
        /**
         * 类型 change事件
         */
        typeChange() {
            let that = this;
            that.pageSize = 10;
            that.searchEvent();
        },
        /*
        ** 列表每页显示数据量变更
        */
        cfgSizeChange: function (val) {
            let that = this;
            that.pageSize = val;
            that.currentPage = 1;
            that.getListData();
        },
        /*
        ** 列表页码变更
        */
        cfgCurrentChange: function (val) {
            let that = this;
            that.currentPage = val;
            that.getListData();
        },
        /*
        ** 请求列表数据
        */
        getListData() {
            let that = this,
                date = that.dateFormate(),
                param = {
                    type: that.type, // 1:事项,2:一件事 ,
                    column: that.column,
                    order: that.order,  // desc: 降序 asc 升序
                    period: that.period,
                    date: date,
                    pageNum: that.currentPage,
                    pageSize: that.pageSize,
                    xzqh: that.xzqhVal[that.xzqhVal.length -1]  // 行政区划
                };
            if(that.xzqhCount <= that.saveXzqhVal.length) {
                param.xzqh = that.saveXzqhVal.length > 0 ? that.saveXzqhVal[that.saveXzqhVal.length - 1] : ''
            }else {
                param.xzqh = that.xzqhVal.length > 0 ? that.xzqhVal[that.xzqhVal.length - 1] : ''
            }
            
            if(!date || date == 'null') {
                that.$Message.warning('请选择日期');
                return;
            }
            let loading = this.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
            unit.ajaxObjPost('/znsj-web/statisticsAnalys/getResByDept', param, function (res) {
                loading.close();
                let data = res.data;
                that.listData = data.rows;
                that.total = data.total;
            }, function (res) {
                loading.close();
                that.$message.warning('请求数据失败');
            }, that);
        },
        sortChange(val) {
            let that = this;
            // 升序
            if(val.order == 'ascending') {
                that.order = 'asc';
                that.column = val.prop;
            // 降序
            }else if(val.order == 'descending') {
                that.order = 'desc';
                that.column = val.prop;
            }
            // 刷新列表
            that.getListData();
        },
        /*
        ** 查询
        */
        searchEvent() {
            let that = this;
            that.currentPage = 1;
            // 刷新列表
            that.getListData();
        },
        /**
         * 导出
         */
        exportEvent() {
            let that = this,
                date = that.dateFormate(),
                path = that.$store.state.path; // that.$store.state.path  http://10.5.41.199:8885/bog-receive-web
            if(!date || date == 'null') {
                that.$Message.warning('请选择日期');
                return;
            }
            window.location.href = path +  '/statisticsAnalys/exportData?date='
                                    + date + 
                                    '&period='+ that.period+ 
                                    '&type=' + that.type +
                                    '&xzqh=' + that.xzqhVal[that.xzqhVal.length -1];
        },
         
        /**
         * 获取当前时间
         */
        getCurDate() {
            let that = this,
                curDate = new Date(),
                dateObj = {};
            dateObj.year = curDate.getFullYear();
            dateObj.month = that.numFormate(curDate.getMonth() + 1);
            dateObj.day = that.numFormate(curDate.getDate());
            that.defDate = dateObj.year + '-'+ dateObj.month + '-' + dateObj.day;
        },
        /**
         * 数字格式转换
         */
        numFormate(val) {
            return val = val < 10 ? '0' + val : val;
        },
         /**
         * 年月日 时间格式处理
         */
        dateFormate() {
           let that = this,
               dealDate;
            if(that.period == 1) {
                dealDate = that.dayDate + '';
                dealDate = dealDate.length > 15 ? that.defDate.substring(0,10) : dealDate;
            }else if(that.period == 2) {
                dealDate = that.monthDate + '';
                dealDate = dealDate.length > 15 ? that.defDate.substring(0,7) : dealDate;
           }else if(that.period == 3) {
                dealDate = that.yearDate + '';
                dealDate = dealDate.length > 15 ? that.defDate.substring(0,4) : dealDate;
           }
           return dealDate;
        },
        /**
         * 时间 change
         */
        dateChange(val,type) {
            let that = this;
            if(type == '3') {
                that.yearDate = val;
            }else if(type == '2') {
                that.monthDate = val;
            }else if(type == '1') {
                that.dayDate = val;
            }
        },
        init() {
            let that = this;
            that.getCurDate()
            that.getXzqhTreeData(); // 获取省份
            that.isIE9 = unit.isIE9();
        }
    },
    mounted() {
        let that = this;
        that.init();
    }
}
</script>

<style lang="less">
@import "../../../assets/styles/theme.less";
.el-select-dropdown__item {
    font-size: 12px;
}
#statisticList {
    padding: 0 25px;
    width: 100%;
    min-width: 1100px;
    height: 100%;
    overflow: auto;
    .el-input--small {
        font-size: 12px;
    }
    .main-wrap {
        padding: 20px 20px 15px 20px;
        height: auto;
        background-color: #fff;
        .el-radio+.el-radio {
            margin-left: 10px;
        }
        .el-radio__label {
            font-size: 12px;
        }
        .list-wrap {
            border: 1px solid #dcdee2;
            border-bottom: none;
            a.mattLink:hover {
                color: #464c5b;
            }
            .wper100 {
                width: 100%;
            }
        }
        .stat-btn span {
            position: relative;
            top: -1px;
        }
        // ie9兼容性问题
        .ie9-sort-style .el-table .descending.sort-caret {
            bottom: -8px !important;
        }
        .ie9-sort-style .el-table .caret-wrapper {
            top: -5px !important;
        }
        .date-wrap {
            .ivu-input-wrapper-large .ivu-input-icon {
                height: 32px !important;
                line-height: 32px !important;
            }
            .ivu-input-large {
                font-size: 12px !important;
                height: 32px !important;
            }
        }
    } 
}
</style>
