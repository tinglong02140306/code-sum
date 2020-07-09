/*
 * @Author: lhqin 
 * @Date: 2018-10-19 14:30:38 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-12 20:40:49
 */

<template>
    <!-- <EasyScrollbar style="height: 100%;"> -->
    <div id="searchOneMatter">
        <div class="searchOneMatter">
            <tabNavigate :tabs="tabs"></tabNavigate>
            <div class="main-wrap clearfix">
                <!-- 查询条件start -->
                <el-row class="search-wrap">
                    <el-col :span="17" :push="2" class="mr5">
                        <el-row class="clasify-guide">
                            <el-col :span="2" :push="5" class="col-matt">
                                <a class="all-matters" href="javascript:void(0)" @click="goSearchMatters">事项</a>
                            </el-col>
                            <el-col :span="3" :push="5" class="col-one-matt">
                                <a class="one-matters" href="javascript:void(0)">一件事</a>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <Cascader :title="xzqhValShow.substring(0,xzqhValShow.length-1)" class="inline-block xzqhWt" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select @on-change="changeXzqh" :transfer="true"></Cascader>
                            </el-col>
                            <el-col :span="15">
                                <Input size="large" :maxlength="100" v-model="matterName" placeholder="请输入名称进行查询"></Input>
                            </el-col>
                            <el-col :span="2" class="search-col" style="margin-left: 10px;">
                                <el-button type="primary" class="search-btn" @click="searchEvt">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="2" :push="2" class="higher-search" style="margin-left: -20px;">
                        <a ref="higSearch" class="higher-search-a font-min" href="javascript:void(0)" @click="higSearchEvt">
                            <span>{{ higSerMsg }}</span>
                            <i class="iconfont" v-bind:class="{'icon-xia': xia,'icon-shang': shang}"></i>
                        </a>
                    </el-col>
                </el-row>
                <!-- 查询条件end -->

                <!-- 地区联动start -->
                <div class="mt10 clearfix" v-if="isHigRow">
                    <el-col :span="17" :push="2">
                        <el-row :gutter="8">
                            <el-col :span="7" :push="5">
                                <label class="inline-block mr10">主办部门</label>
                                <div class="inline-block dept-width">
                                    <Select v-model="deptVal" @on-change="deptChangeEvt" :transfer="true">
                                        <Option v-for="item in deptData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </el-col>
                            <el-col :span="6" :push="5">
                                <label class="inline-block mr10">办理对象</label>
                                <div class="inline-block obj-width">
                                    <Select v-model="proObjVal" @on-change="objChangeEvt" :transfer="true">
                                        <Option v-for="item in objData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </el-col>
                            <el-col :span="6" :push="5">
                                <label class="inline-block mr10">事件类别</label>
                                <div class="inline-block class-width">
                                    <Select class="bwidth" v-model="themeTypeVal" @on-change="mClaChangeEvt" :transfer="true">
                                        <Option v-for="item in themeTypeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </div>
                <!-- 地区联动end -->

                <!-- 导航条 -->
                <!-- <div class="guide-title">
                        <p :ref="index" class="inline-block cursor-p guide-title-default" v-for="(item, index) of tabList" :class="{selected:selected==index}" @click="toggleTabs($event,index)">{{item.title}}</p>
                    </div> -->
                <div class="tab-switch">
                    <tabSwitch ref="tabSwitch" :tabState="tabState" :tabType="tabType" @tabsClickEvt="toggleTabs"></tabSwitch>
                </div>

                <!-- 列表start -->
                <div class="mt15 pb20" id="maskPanel">
                    <!-- 收藏列表 -->
                    <div v-show="tabState == '1'" class="panel-border">
                        <el-table :data="myFavData" style="width: 100%" tooltip-effect="light">
                            <el-table-column class-name="cursor-p" align="center" label="收藏" width="70">
                                <template slot-scope="scope">
                                    <div title="取消收藏">
                                        <i class="iconfont icon-colect-active cor-colect" @click="cancleColect(scope.row)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="事件名称" prop="eventName" width="350" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="主办部门" prop="sponsorDeptTxt" width="150" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="协办部门" prop="coopDeptTxt" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="290">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                    <el-button size="mini" type="primary" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt20">
                            <el-pagination @size-change="favSizeChange" @current-change="favCurrentChange" :current-page.sync="favCurrentPage" :page-size="favPageSize" :total="favTotal" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                    <!-- 事件列表 -->
                    <div v-show="tabState == '2'" class="panel-border">
                        <!-- 事件列表 -->
                        <el-table :data="oneMatterData" style="width: 100%" tooltip-effect="light">
                            <el-table-column label="收藏" width="70" class-name="cursor-p" align="center">
                                <template slot-scope="scope">
                                    <div v-bind:title="scope.row.isFav === '0' ? '添加收藏' : '已收藏' ">
                                        <i class="iconfont cor-colect" :class="scope.row.isFav === '0' ? 'icon-colect' : 'icon-colect-active' " @click="colectMatt(scope.row)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="事件名称" prop="eventName" width="310" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="主办部门" prop="sponsorDeptTxt" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="协办部门" prop="coopDeptTxt" width="190" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作" width="290" align="center">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.childs || scope.row.childs.length == 0">
                                        <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                        <el-button size="mini" type="primary" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt20">
                            <el-pagination :total="matTotal" :page-size="matPageSize" @size-change="matSizeChange" @current-change="matCurrentChange" :current-page.sync="matCurPage" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <!-- 事项列表end -->
            </div>
        </div>
    </div>
    <!-- </EasyScrollbar> -->

</template>
<script>
import unit from '@/api/index';
import tabNavigate from "@/components/common/tabNavigate";   // 页签导航
import tabSwitch from "@/components/common/tabSwitch";   // 表格头部切换
export default {
    components: {
        tabNavigate: tabNavigate,
        tabSwitch: tabSwitch
    },

    data() {
        return {
            tabs: ['收件中心', '综合收件'],
            xia: true,//向下箭头字体图标
            shang: false,//向上箭头字体图标
            isHigRow: false,//高级查询
            higSerMsg: '高级查询', //高级常规查询切换

            selected: 1, //tab当前选中标题“事件”
            myColectPanel: false,
            oneMattPanel: true,
            tabType: '2',
            // titles: '我的收藏',
            // subTitle: '事件',
            /* tabList: [ //tab栏标题内容
                {   title: '我的收藏',
                    content: 'myColectPanel'
                },
                {
                    title: '事件',
                    content: 'oneMattPanel'
                }
            ],*/
            // titles: '我的收藏',
            // subTitle: '事件',
            tabState: '2',  // 1: 我的收藏  事件

            matterName: '', //事件名称
            xzqhVal: [], //行政区划初值
            xzqhValShow:'',//三级联动选择器title
            deptVal: '', //主办部门
            proObjVal: '', //办理对象
            themeTypeVal: '', //事件类别

            proData: [], //行政区划数据源
            deptData: [], //部门数据源
            objData: [], //办理对象数据源
            themeTypeData: [], //事件类别数据源

            myFavData: [], //我的收藏数据源
            oneMatterData: [], //事项数据源

            matTotal: 0,//事件列表总条数
            matCurPage: 1,//事件列表当前页
            matPageSize: 10,//事件列表每页条数

            favTotal: 0,//收藏列表总条数
            favCurrentPage: 1,//收藏列表当前页
            favPageSize: 10,//收藏列表每页条数

            // titleTip:'',//事项列表title提示

            saveXzqh: [], //暂存行政区划
            saveFlag: true, //暂存标志

            themeTypeStr: '',//主题类型查询字段初值
            xzqhCount: 0, // 解决渲染当前用户默认行政区划正常渲染
            // 行政区划缓存 解决编辑 返回时恢复原状态 
            xzqhCacheData: [],  
            oneRecordSerParam: {},
            searchTxtData: {
                matterName: ''
            },
            loading: '',  // 页面加载遮罩
        };
    },
    methods: {
        /**
         * 遮罩
         */
        loadingFun() {
            let that = this;
            that.loading = that.$loading({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                customClass: 'el-mask'
            });
        },
        /*
        ** 跳转一件事页面
        */
        goSearchMatters() {
            this.$router.push({
                path: "/searchMatters"
            });
        },
        /*
        ** 请求并跳转指南页面
        */
        goGuidePage(index, row) {
            let that = this,
                obj = {
                    matterName: row.eventName ? row.eventName : '',
                    eventCode: row.eventCode ? row.eventCode : '',
                    version: row.eventVersion ? row.eventVersion : '',
                    type: '0'
                };
            // 解决列表页数据缓存问题
            that.recordSerParam();
            this.$router.push(
                {
                    path: '/affairsGuide',
                    query: {
                        params: JSON.stringify(obj)
                    }
                }
            );
            // unit.openNewDialog(this, '/affairsGuide?params=' + JSON.stringify(obj));
        },
        /*
        ** 单收件
        */
        goCaseGuide(index, row) {
            let state = '';
            if (row.isLegal == '1' && row.isPersonal == '1') {
                state = 'all';
            } else if (row.isLegal == '1') {
                state = 'fr';
            } else if (row.isPersonal == '1') {
                state = 'gr';
            }
            // 解决列表页数据缓存问题
            this.recordSerParam();
            this.$store.commit('setState', {
                isOneTrigEdit: true
            });
            this.$router.push(
                {
                    path: '/oneThingReceiveFile/guideWrap',
                    query: {
                        eventCode: row.eventCode,
                        id: row.id,
                        eventReceiptNo: row.eventCode,
                        jointStatus: row.jointStatus,
                        state: state
                    }
                }
            );
            // unit.openNewDialog(this, '/oneThingReceiveFile/guideWrap?eventCode=' + row.eventCode + '&id=' + row.id + '&eventReceiptNo=' + row.eventCode + '&jointStatus=' + row.jointStatus + '&state=' + state);
        },
        /*
        ** 切换高级查询、常规查询
        */
        higSearchEvt() {
            this.higSerMsg = this.higSerMsg === '高级查询' ? '常规查询' : '高级查询';
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
        ** 我的收藏，事件tab标题切换
        */
        toggleTabs(state) {
            let _that = this;
            _that.tabState = state;
        },
        /*
        ** 行政区划改变联动部门
        */
        changeXzqh(value, selectedData) {
            let _that = this,
                stateObj = _that.$store.state;
             _that.xzqhValShow = "";
            for(let item of selectedData){
                _that.xzqhValShow += item.label+'/'
            }
            if (value.length === 0) {//行政区划清空时部门和机构清空
                _that.xzqhVal = [];
                _that.deptData = [{
                    label: "全部",
                    value: "all"
                }];
                _that.deptVal = 'all';
            } else {
                _that.xzqhVal = value;
            }
            if(_that.xzqhCount >= _that.saveXzqh.length) {
                //  缓存行政区划
                if(!stateObj.isOneTrigEdit) {
                    _that.xzqhCacheData = [];
                    for(let i = 0; i < selectedData.length; i++) {
                        _that.xzqhCacheData.push(selectedData[i].value);
                    }
                }
                // setTimeout(()=>{
                //     _that.getDeptData();//联动部门
                // },300)  
            }
            if(_that.xzqhCount > _that.saveXzqh.length) {
                setTimeout(()=>{
                    _that.getDeptData();//联动部门
                },300)  
            }

        },
        /*
        ** 部门改变
        */
        deptChangeEvt(data) {
            let _that = this;
            _that.deptVal = data;
            _that.matCurPage = 1;
            _that.getOneMattData();
        },
        /*
        ** 办理对象改变
        */
        objChangeEvt(data) {
            let _that = this;
            if (data === '0') {//个人
                _that.themeTypeStr = 'GRZT';
            } else if (data === '1') {//法人
                _that.themeTypeStr = 'FRZT';
            } else {
                _that.themeTypeStr = 'all';
            }
            _that.matCurPage = 1;
            _that.getThemeTypeData();
            _that.getOneMattData();
        },
        /*
        ** 事件类别改变
        */
        mClaChangeEvt(data) {
            let _that = this;
            _that.themeTypeVal = data;
            _that.matCurPage = 1;
            _that.getOneMattData();
        },
        /*
        ** 综合查询
        */
        searchEvt() {
            let _that = this;
            _that.xzqhVal = [_that.xzqhVal[_that.xzqhVal.length - 1]];
            _that.deptVal = _that.deptVal;
            _that.proObjVal = _that.proObjVal;
            _that.themeTypeVal = _that.themeTypeVal;
            _that.matCurPage = 1;
            _that.getOneMattData();
        },
        /**
         * 记录查询数据
         */
        recordSerParam() {
            let _that = this,
                oneRecordSerParam = {},
                stateObj = _that.$store.state;
            if(stateObj.isOneTrigEdit) { 
                _that.matCurPage = parseInt(_that.oneRecordSerParam.matCurPage);
                _that.favCurrentPage = parseInt(_that.oneRecordSerParam.favCurrentPage);
                
                _that.deptVal = _that.oneRecordSerParam.deptVal;
                _that.proObjVal = _that.oneRecordSerParam.proObjVal;
                _that.themeTypeVal = _that.oneRecordSerParam.themeTypeVal;
                _that.$store.commit('setState', {
                    isOneTrigEdit: false
                });
            }
            oneRecordSerParam = {
                matterName: _that.searchTxtData.matterName.trim(),//事项名称
                deptVal: _that.deptVal,
                proObjVal: _that.proObjVal,
                themeTypeVal: _that.themeTypeVal,
                matCurPage: _that.matCurPage, //当前页
                matPageSize: _that.matPageSize, //每页数量
                tabState: _that.tabState,
                xzqhCacheData: _that.xzqhCacheData,
                xia: _that.xia,
                shang: _that.shang,
                isHigRow: _that.isHigRow,
                favCurrentPage: _that.favCurrentPage,
                favPageSize: _that.favPageSize

            };
            _that.$store.commit('setState', {
                oneRecordSerParam: oneRecordSerParam
            });

        },
        /*
        ** 获取事件列表数据
        */
        getOneMattData() {
            let _that = this,
                jsonObj;
            _that.recordSerParam();
            jsonObj = {
                eventName: _that.matterName.trim(),//事件名称
                adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1],//行政区划编码
                sponsorDept: _that.deptVal === 'all' ? '' : _that.deptVal,//主办部门编码
                eventClassify: _that.proObjVal === 'all' ? '' : _that.proObjVal,//办理对象 0：个人 1：法人
                eventType: _that.themeTypeVal === 'all' ? '' : _that.themeTypeVal,//事件类别
                pageNum: _that.matCurPage,//当前页
                userId: 1,
                pageSize: _that.matPageSize//每页数量
            };
            // 保存查询的文本值
            _that.searchTxtData.matterName = _that.matterName;  
            // let loading = this.$loading({
            //     lock: true,
            //     text: '加载中',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.5)',
            //     customClass: 'el-mask'
            // });
            _that.loadingFun();
            unit.ajaxObjPost('/znsj-web/eventSj/getsjAll', jsonObj, function (res) {
                _that.loading.close();
                let data = res.data;
                _that.matTotal = data.total;
                _that.matCurPage = data.pageNum;
                data = data.rows;
                $.each(data, function (index, item) {
                    item.eventName = (item.eventName === null || '') ? '--' : item.eventName;
                    item.sponsorDeptTxt = (item.sponsorDeptTxt === null || '') ? '--' : item.sponsorDeptTxt;
                    item.coopDeptTxt = (item.coopDeptTxt === null || '') ? '--' : item.coopDeptTxt;
                });
                _that.oneMatterData = data;
            }, function (res) {
                _that.loading.close();
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 事件列表每页显示数据量变更
        */
        matSizeChange: function (val) {
            let _that = this;
            _that.matPageSize = val;
            _that.matCurPage = 1;
            _that.getOneMattData();
        },
        /*
        ** 事件列表页码变更
        */
        matCurrentChange: function (val) {
            let _that = this;
            _that.matCurPage = val;
            _that.getOneMattData();
        },
        /*
        ** 加入收藏
        */
        colectMatt(row) {
            let _that = this,
                obj = {
                    eventCode: row.eventCode,
                    isFav: '1',
                    userId: ''
                };
            if (row.isFav === '0') { //未收藏
                unit.ajaxMerPost('/znsj-web/eventSj/updateFav', obj, function (res) {
                    if (res.flag == true) {
                        _that.$Message.success('收藏成功');
                        _that.getMyFavData();
                        _that.getOneMattData();
                    } else {
                        _that.$Message.warning('已加入收藏，请勿重新添加');
                    }
                }, function (res) {
                    _that.$Message.warning('获取数据失败');
                }, _that);
            } else { //已收藏
                this.$Message.warning('您已收藏过了哦');
            }
        },
        /*
        ** 取消收藏
        */
        cancleColect(row) {
            let _that = this,
                obj = {
                    eventCode: row.eventCode,
                    isFav: '0', //0 取消收藏 ，1 收藏
                    userId: ''
                };
            unit.ajaxMerPost('/znsj-web/eventSj/updateFav', obj, function (res) {
                if (res.flag == true) {
                    _that.$Message.success('取消成功');
                    _that.getMyFavData();
                    _that.getOneMattData();
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 获取收藏列表数据
        */
        getMyFavData() {
            let _that = this,
                obj = {
                    userId: '',
                    pageNum: _that.favCurrentPage,
                    pageSize: _that.favPageSize
                };
            unit.ajaxMerPost('/znsj-web/eventSj/getMyFav', obj, function (res) {
                let data = res.data,
                    alldata = data.rows;
                _that.favTotal = data.total;
                _that.favCurrentPage = data.pageNum;
                $.each(alldata, function (index, item) {
                    item.eventName = (item.eventName === null || '') ? '--' : item.eventName;
                    item.sponsorDeptTxt = (item.sponsorDeptTxt === null || '') ? '--' : item.sponsorDeptTxt;
                    item.coopDeptTxt = (item.coopDeptTxt === null || '') ? '--' : item.coopDeptTxt;
                });
                _that.myFavData = alldata;
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 收藏列表每页显示数据量变更
        */
        favSizeChange: function (val) {
            let _that = this;
            _that.favPageSize = val;
            _that.favCurrentPage = 1;
            _that.getMyFavData();
        },
        /*
        ** 收藏列表页码变更
        */
        favCurrentChange: function (val) {
            let _that = this;
            _that.favCurrentPage = val;
            _that.getMyFavData();
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this,
                obj = {
                    value: _that.xzqhVal[0]
                };
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (res) {
                $.each(res.data, function (index, item) {
                    item.children = [];
                    item.loading = false;
                });
                _that.proData = res.data;
                setTimeout(function () {
                    _that.getDefaultXzqh();
                }, 0);
            }, function (res) {
                _that.loading.close();
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
                    if (_that.xzqhCount < _that.saveXzqh.length) {
                        setTimeout(function () {
                            _that.xzqhCount = _that.xzqhCount + 1;
                            _that.xzqhVal = _that.saveXzqh;
                        }, 0);
                    }
                    // else {
                    //     _that.xzqhVal = item.__value && item.__value.split(',');
                    //     _that.getDeptData();//联动部门
                    // }
                    item.__value && (_that.xzqhCacheData = item.__value.split(','));
                    item.__label && (_that.xzqhValShow = item.__label);
                    item.loading = false;
                    callback();
                }, function (result) {
                    _that.$Message.warning('获取数据失败');
                }, _that);
            }, 50);
        },
        /*
        ** 获取部门
        */
        getDeptData() {
            let _that = this,
                obj = {};
            if(_that.xzqhCount <= _that.saveXzqh.length) {
                obj.adminDiv = _that.saveXzqh.length > 0 ? _that.saveXzqh[_that.saveXzqh.length - 1] : ''
            }else {
                obj.adminDiv = _that.xzqhVal.length > 0 ? _that.xzqhVal[_that.xzqhVal.length - 1] : ''
            }
            if (_that.xzqhVal.length != 0) {
                unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                    if (res.flag == true) {
                        _that.deptData = res.data;
                        _that.deptData.unshift({
                            label: "全部",
                            value: "all"
                        });
                        _that.deptVal = 'all';
                        _that.searchEvt();
                    } else {
                        _that.$Message.warning('获取数据失败');
                    }
                }, function (res) {
                    _that.loading.close();
                    _that.$Message.warning('获取数据失败');
                }, _that);
            }else {
                _that.deptData = [];
                _that.deptData.unshift({
                    label: "全部",
                    value: "all"
                });
                _that.searchEvt();
            }

        },
        /*
        ** 获取默认行政区划
        */
        getDefaultXzqh() {
           let that = this,
                stateObj = that.$store.state;
            if(!stateObj.isOneTrigEdit) { 
                unit.ajaxMerPost('/znsj-web/commer/curentUserXzqh', {
                    pinYinType: 'XZQH'
                }, function (res) {
                    that.saveXzqh = [];
                    that.xzqhVal = [];
                    let data = res.data;
                    for (let i in data) {
                        that.xzqhVal.push(data[i].value);
                        that.saveXzqh.push(data[i].value);
                    }
                    that.getDeptData();
                }, function (res) {
                    that.loading.close();
                    that.$Message.warning('服务端错误');
                }, that);
            }else if(stateObj.isOneTrigEdit){
                that.oneRecordSerParam = stateObj.oneRecordSerParam;
                that.xzqhCacheData = that.oneRecordSerParam.xzqhCacheData;
                that.saveXzqh = [];
                that.xzqhVal = [];
                for (let i in  that.xzqhCacheData) {
                    that.xzqhVal.push( that.xzqhCacheData[i]);
                    that.saveXzqh.push( that.xzqhCacheData[i]);
                }
                that.getDeptData();
            }
        },
        /*
        ** 办理对象字典
        */
        getBldxData() {
            let _that = this;
            _that.getDictionarys('bldx');
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
                    if (str === 'bldx') {
                        _that.objData = data;
                        _that.objData.unshift({
                            label: "全部",
                            value: "all"
                        });
                        _that.proObjVal = 'all';
                        _that.getThemeTypeData();//根据办理对象获取事件类别
                    }
                } else {
                    _that.$Message.warning('获取数据失败');
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 事件类别字典
        */
        getThemeTypeData() {
            let _that = this,
                obj = {
                    pinYinType: _that.themeTypeStr === 'all' ? '' : _that.themeTypeStr
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                let data = res.data;
                if (data) {
                    _that.themeTypeData = data;
                }
                _that.themeTypeData.unshift({
                    label: '全部',
                    value: 'all'
                });
                _that.themeTypeVal = 'all';
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
         /**
         * 初始化记录信息
         */
        initRecordState() {
            let that = this,
                stateObj = that.$store.state;
            if(!stateObj.isOneTrigEdit) {
                return
            }
            that.oneRecordSerParam = stateObj.oneRecordSerParam;
            for(let key in that.oneRecordSerParam) {
                if(key != 'deptVal' && key != 'themeTypeVal') {
                    that.$set(that, key, that.oneRecordSerParam[key])
                    if(key == 'tabState') {
                        that.$refs.tabSwitch.titleClickEvt(that.tabState);
                    }
                }
            }
            // 事件类别 参数值判断
            if (that.proObjVal === '0') {//个人
                that.themeTypeStr = 'GRZT';
            } else if (that.proObjVal === '1') {//法人
                that.themeTypeStr = 'FRZT';
            } else {
                that.themeTypeStr = 'all';
            }
        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.initRecordState();
            _that.getXzqhTreeData();// 获取行政区划
            _that.getBldxData();//办理对象字典
            _that.getMyFavData();//获取收藏列表
        }
    },
    mounted() {
        this.loadingFun();
        this.init();
        unit.solveAnimFrame();
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#searchOneMatter {
    overflow: auto;
    height: 100%;
    padding: 0px 20px 0px 20px;
    // background-color: #fff;
    background-color: #edf0f6;

    .searchOneMatter {
        height: 100%;
        background: #fff;

        .main-wrap {
            padding: 20px 20px 15px 20px;
            background-color: #fff;

            .search-wrap {
                // margin: 2% 0 0 0;
                padding-bottom: 8px;
                width: 100%;

                .search-col {
                    text-align: center;

                    button {
                        width: 94px;
                        height: 35px;
                        line-height: 0.1;
                        background-color: #137ddf;
                        border-color: #137ddf;
                    }
                }
            }
        }
    }

    .panel-border {
        border: 1px solid #e0e6f1;
        border-bottom: none;
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 0;
        border-bottom: 0 !important;
        padding-left: 70px;
    }

    .ivu-input-group-append {
        background-color: #d4efde !important;
    }

    .ivu-input-search {
        border-color: #dcebe6 !important;
    }

    .higher-search {
        margin-top: 40px;
        z-index: 7;
    }

    .higher-search-a {
        color: #2d8cf0;
    }

    .higher-search-a:hover {
        color: #40a9ff;
    }

    .my-collect, .matters {
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #7e8688;
        background-color: #e5edef;
    }

    .main-wrap .tab-switch {
        margin-top: 20px;
    }

    .guide-hover:hover {
        cursor: pointer;
    }

    .guide-title {
        height: 43px;
        // margin-top: 70px;
        line-height: 43px;
        font-size: 13px;
    }

    .clasify-guide {
        height: 35px;
        line-height: 35px;
        font-size: 16px;
    }

    .clasify-guide a.one-matters {
        font-weight: 1000;
        font-size: 17px;
        color: #2d8cf0;
    }

    .clasify-guide a.all-matters {
        // color: #1683C8;
    }

    .col-one-matt {
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
        background-color: #59adea;
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
        overflow-y: scroll;
    }

    .panel-cont li {
        margin-right: 8px;
        height: 35px;
        line-height: 35px;
        font-family: '微软雅黑';
        border-bottom: 1px solid #e0dddd;
    }

    .panel-cont li i {
        font-size: 12px;
        color: #fe0404;
        font-weight: bolder;
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

    .guide-title p {
        text-align: center;
        width: 133px;
        height: 100%;
    }

    /* .guide-title p:last-child {
        position: relative;
        left: -5px;
    } */
    .guide-title-default {
        background-color: #f2f2f2;
        color: #5e5e5e;
    }

    .selected {
        // background-color: #1683c8;
        background-color: #1255B3;
        color: #fffffc !important;
    }

    .cor-colect {
        color: #f99b0e;
    }

    .row-btn-hide {
        td:last-child button {
            visibility: hidden;
        }
    }

    .el-table td, .el-table th.is-leaf {
        border-bottom: 1px solid #e8eaec;
    }

    .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
        border-right: 1px solid #e8eaec;
    }

    // .el-table {
    // font-size: 16px;
    // }
    .xzqhWt {
        width: 95%;

        .ivu-input {
            height: 36px;
        }
    }

    .dept-width {
        // width: 64%;
        width: 71%;
    }

    .obj-width {
        width: 64%;
    }

    .class-width {
        width: 64%;
    }
}
</style>
