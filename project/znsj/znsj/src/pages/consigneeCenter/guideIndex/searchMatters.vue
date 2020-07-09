/*
 * @Author: lhqin 
 * @Date: 2018-09-28 15:51:18 
 * @Last Modified time: 2018-10-17 22:21:15 */
<template>
    <div id="searchMatters">
        <div class="search-matters">
            <tabNavigate :tabs="tabs"></tabNavigate>
            <div class="main-wrap clearfix">
                <!-- 查询条件start -->
                <Row class="search-wrap">
                    <Col span="17" :push="2" class="mr5 clearfix">
                    <Row class="clasify-guide">
                        <Col span="2" :push="5" class="col-matt">
                        <a class="all-matters" href="javascript:void(0)">事项</a>
                        </Col>
                        <Col span="3" :push="5">
                        <a class="one-matters" href="javascript:void(0)" @click="goOneMatter">一件事</a>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="5">
                        <!-- <label class="inline-block mr10">行政区划</label> -->
                        <Cascader ref="cascaderAddr" :title="xzqhValShow.substring(0,xzqhValShow.length-1)" clearable class="inline-block xzqhWt" :data="proData" :load-data="xzqhLoadData" v-model="xzqhVal" change-on-select @on-change="changeXzqh" :transfer="true"></Cascader>
                        </Col>
                        <Col span="15">
                        <Input size="large" v-model="matterName" :maxlength="100" placeholder="请输入名称进行查询">
                        </Input>
                        </Col>
                        <Col span="2" class="search-col" style="margin-left: 10px;">
                        <Button type="primary" class="search-btn" @click="searchEvt">查询</Button>
                        </Col>
                    </Row>
                    </Col>
                    <Col span="2" push="2" class="higher-search clearfix" style="margin-left: -20px;">
                    <a ref="higSearch" class="higher-search-a font-min" href="javascript:void(0)" @click="higSearchEvt">
                        <span>{{ higSerMsg }}</span>
                        <i class="iconfont" v-bind:class="{'icon-xia': xia,'icon-shang': shang}"></i>
                    </a>
                    </Col>
                    <!-- 事项箱start -->
                    <Col span="2" push="2" class="matt-box-wrap clearfix">
                    <div class="matters-box mt10" @click="mattersBoxEvt">
                        <div class="tc matter-num">{{ colectData.length }}</div>
                        <img :src="boximg" />
                        <p>事项箱</p>
                    </div>
                    <!-- 事项箱展开面板start -->
                    <Card class="met-box-panel mr10" v-if="isShowBox">
                        <p slot="title">
                            <a href="#" slot="extra" @click="isShowBox = false">
                                <i class="iconfont icon-quxiao ic-cancle"></i>
                            </a>
                        </p>
                        <ul class="panel-cont clearfix">
                            <p class="no-box-data" v-show="colectData.length == 0">暂无数据</p>
                            <li v-for="(item,index) in colectData" :key="index">
                                <span :title="item.matterName">{{ item.matterName }}</span>
                                <i class="iconfont icon-quxiao fr cursor-p" @click="removeMatt(index)"></i>
                            </li>
                        </ul>
                        <Row class="fr mt10 mr20">
                            <Button class="w100 matt-box-btn mr5" size="small" @click="clearAll">清空</Button>
                            <Button class="w100 matt-box-btn" size="small" type="primary" @click="mergeReceiveEvt" :disabled="colectData.length > 0 ? false : true">合并收件</Button>
                        </Row>
                    </Card>
                    <!-- 事项箱展开面板end -->
                    </Col>
                    <!-- 事项箱end -->
                </Row>
                <!-- 查询条件end -->

                <!-- 地区联动start -->
                <div class="mt10 clearfix" v-if="isHigRow">
                    <el-col :span="17" :push="2">
                        <el-row :gutter="10" :span="17" :push="2">
                            <el-col :span="8" :push="5">
                                <label class="inline-block mr10">所属部门</label>
                                <div class="inline-block obj-width">
                                    <Select v-model="deptVal" @on-change="deptChangeEvt" :transfer="true">
                                        <Option v-for="item in deptData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </el-col>
                            <el-col :span="7" :push="5">
                                <label class="inline-block mr10">办理对象</label>
                                <div class="inline-block obj-width">
                                    <Select v-model="themeType" @on-change="objChangeEvt" :transfer="true">
                                        <Option v-for="item in objData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </div>
                <!-- 地区联动end -->

                <!-- 导航条 -->
                <div class="tab-switch">
                    <!-- :titles="titles" :subTitle="subTitle" -->
                    <tabSwitch ref="tabSwitch" :tabState="tabState" :tabType="tabType" @tabsClickEvt="tabsClickEvt"></tabSwitch>
                </div>

                <!-- 事项列表start -->
                <div class="mt20 pb20" id="maskPanel">
                    <!-- 收藏列表 -->
                    <div ref="myColectPanel" class="panel-border" v-show="tabState == '1'">
                        <el-table :data="myFavData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="dark">
                            <!-- 展开项start -->
                            <el-table-column type="expand" prop="childs" label="" width="40">
                                <template scope="scope">
                                    <el-table :data="scope.row.childs" tooltip-effect="dark" :show-header="false">
                                        <el-table-column label="事项名称" prop="matterName" width="350" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="承诺时限" prop="commitTime" align="center" width="150">
                                        </el-table-column>
                                        <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" width="290">
                                            <template slot-scope="scope">
                                                <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                                <el-button size="mini" @click="addItemBoxEvt(scope.$index, scope.row)">加入事项箱</el-button>
                                                <el-button size="mini" type="primary" :disabled="isDisFun(scope.row)" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <!-- 展开项end -->
                            <el-table-column class-name="cursor-p" align="center" label="收藏" width="70">
                                <template slot-scope="scope">
                                    <div title="取消收藏">
                                        <i class="iconfont icon-colect-active cor-colect" @click="cancleColect(scope.row)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="事项名称" prop="matterName" width="350" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="承诺时限" prop="commitTime" align="center" width="150">
                            </el-table-column>
                            <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="290">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                    <el-button size="mini" @click="addItemBoxEvt(scope.$index, scope.row)">加入事项箱</el-button>
                                    <el-button size="mini" type="primary" :disabled="isDisFun(scope.row)" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt15">
                            <el-pagination @size-change="favSizeChange" @current-change="favCurrentChange" :current-page.sync="favCurrentPage" :page-size="favPageSize" :total="favTotal" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                    <div ref="mattPanel" class="panel-border" v-show="tabState == '2'">
                        <!-- 事项列表 -->
                        <el-table :data="mattersData" :row-class-name="getRowClass" style="width: 100%" tooltip-effect="dark">
                            <!-- 展开项start -->
                            <el-table-column type="expand" prop="childs" label="" width="40">
                                <template scope="scope">
                                    <el-table :data="scope.row.childs" tooltip-effect="dark" :show-header="false">
                                        <el-table-column label="事项名称" width="310" prop="matterName" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="承诺时限" prop="commitTime" align="center" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="所属部门" prop="deptName" width="190" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" width="290" align="center">
                                            <template slot-scope="scope">
                                                <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                                <el-button size="mini" @click="addItemBoxEvt(scope.$index, scope.row)">加入事项箱</el-button>
                                                <el-button size="mini" type="primary" :disabled="isDisFun(scope.row)" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <!-- 展开项end -->
                            <el-table-column label="收藏" width="70" class-name="cursor-p" align="center">
                                <template slot-scope="scope">
                                    <div v-bind:title="scope.row.isFav === '0' ? '添加收藏' : '已收藏' ">
                                        <i class="iconfont cor-colect" :class="scope.row.isFav === '0' ? 'icon-colect' : 'icon-colect-active' " @click="colectMatt(scope.row)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="事项名称" width="310" prop="matterName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="承诺时限" prop="commitTime" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="所属部门" prop="deptName" width="190" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="操作" width="290" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="goGuidePage(scope.$index, scope.row)">指南</el-button>
                                    <el-button size="mini" @click="addItemBoxEvt(scope.$index, scope.row)">加入事项箱</el-button>
                                    <el-button size="mini" type="primary" :disabled="isDisFun(scope.row)" @click="goCaseGuide(scope.$index, scope.row)">收件</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block fr mt15">
                            <el-pagination :total="matTotal" :page-size="matPageSize" @size-change="matSizeChange" @current-change="matCurrentChange" :current-page.sync="matCurPage" layout="total, sizes, prev, pager, next, jumper">
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
import tabSwitch from "@/components/common/tabSwitch";   // 表格头部切换
import boximg from '@/assets/images/common/matt-box.png' // 事项箱图片
export default {
    components: {
        tabNavigate: tabNavigate,
        tabSwitch: tabSwitch
    },
    data() {
        return {
            tabs: ['收件中心', '综合收件'],
            tabType: '1',
            // titles: '我的收藏',
            // subTitle: '事项',
            boximg: boximg,//事项箱图标
            tabState: '2',  // 1: 我的收藏  2：事项

            xia: true,
            shang: false,
            isHigRow: false,
            isDefault: true,
            isActive: true,

            mergeBtn: true,
            isShowBox: false,
            bNoDataHide: true,

            deptVal: '',
            themeType: '',
            matterName: '',
            higSerMsg: '高级查询',
            matTotal: 0,//事项列表总条数
            matCurPage: 1,//事项列表当前页
            matPageSize: 10,//事项列表每页条数

            favTotal: 0,//收藏列表总条数
            favCurrentPage: 1,//收藏列表当前页
            favPageSize: 10,//收藏列表每页条数
            showExpendBorder: false,
            boxnum: 0,
            //暂存行政区划
            saveXzqh: [], 
            //暂存标志
            saveFlag: true, 
            //行政区划
            proData: [],
            xzqhVal: [],
            //级联选择器的title
            xzqhValShow:"", 
            deptData: [],
            objData: [],
            myFavData: [],
            mattersData: [],
            colectData: [],
            // 解决渲染当前用户默认行政区划正常渲染
            xzqhCount: 0,  
            // 行政区划缓存 解决编辑 返回时恢复原状态 
            xzqhCacheData: [],  
            recordSearchParam: {},
            // isTrigEdit: false,
            // 解决行政区划级联 市辖区 不能选上的处理
            saveXzqhIndexData: [],
            searchTxtData: {
                matterName: ''
            },
            loading: '',  // 页面加载遮罩

        };
    },
    computed:{

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
        goOneMatter() {
            this.$router.push({
                path: "/searchOneMatter"
            });
        },
        
        /*
        ** 跳转指南页面
        */
        goGuidePage(index, row) {
            let obj = {
                matterName: row.matterName ? row.matterName : '',
                matterCode: row.matterCode ? row.matterCode : '',
                version: row.matterVersion ? row.matterVersion : '',
                type: '1'
            };
            // 解决列表页数据缓存问题
            this.recordSerParam();
            this.$store.commit('setState', {
                isTrigEdit: true
            });
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
            let that = this,
                state = '';
            if (row.isLegal == '1' && row.isPersonal == '1') {
                state = 'all';
            } else if (row.isLegal == '1') {
                state = 'fr';
            } else if (row.isPersonal == '1') {
                state = 'gr';
            }
            // 
            // 解决列表页数据缓存问题
            this.recordSerParam();
            this.$store.commit('setState', {
                isTrigEdit: true
            });
            that.$router.push(
                {
                    path: '/oddGuide/guideWrap',
                    query: {
                        matterIds: row.id,
                        type: '1',
                        matteVersion: '',
                        jointStatus: row.jointStatus,
                        state: state
                    }
                }
            );
            // unit.openNewDialog(this, '/oddGuide/guideWrap?matterIds=' + row.id + '&type=1&jointStatus=' + row.jointStatus + '&state=' + state);
        },
        /*
        ** 合并收件
        */
        mergeReceiveEvt() {
            let _that = this,
                newData = [];
            $.each(_that.colectData, function (index, item) {
                newData.push(item.id);
            });

            let state = '';
            if (_that.colectData[0].isLegal == '1' && _that.colectData[0].isPersonal == '1') {
                state = 'all';
            } else if (_that.colectData[0].isLegal == '1') {
                state = 'fr';
            } else if (_that.colectData[0].isPersonal == '1') {
                state = 'gr';
            }
            // 解决列表页数据缓存问题
            _that.recordSerParam();
            _that.$store.commit('setState', {
                isTrigEdit: true
            });
            _that.$router.push(
                {
                    path: '/majorityGuide/guideWrap',
                    query: {
                        matterIds: JSON.stringify(newData),
                        type: '2',
                        jointStatus: _that.colectData[0].jointStatus,
                        state: state
                    }
                }
            );
            // unit.openNewDialog(_that, '/majorityGuide/guideWrap?matterIds=' + JSON.stringify(newData) + '&type=2&jointStatus=' + _that.colectData[0].jointStatus + '&state=' + state);
        },
        /*
        ** 01 不置灰 02 置灰
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
        ** 显示隐藏事项箱
        */
        mattersBoxEvt() {
            this.isShowBox = this.isShowBox !== true;
        },
        /*
        ** 关闭事项箱面板
        */
        closePanel: function () {
            this.isShowBox = true;
        },
        /*
        ** 我的收藏、事项列表切换
        */
        tabsClickEvt(state) {
            let _that = this;
            _that.tabState = state;
        },
        /*
        ** 加入事项箱
        */
        addItemBoxEvt(index, row) {
            let _that = this;
            if (_that.colectData.length > 0) {
                let legal,  // = _that.colectData[_that.boxnum - 1].isLegal
                    personal,  //  = _that.colectData[_that.boxnum - 1].isPersonal
                    jointStatus;
                for (let i = 0; i < _that.colectData.length; i++) {
                    legal = _that.colectData[i].isLegal;
                    personal = _that.colectData[i].isPersonal;
                    jointStatus = _that.colectData[i].jointStatus;
                    if (legal != personal) {
                        i = _that.colectData.length;
                    }
                }
                // 加入事项箱有三种情况: A-个人事项， B-法人事项，C-同时为个人法人事项
                // 保证A和B不能同时存在，但是C可以和A和B任一个同时存在  且事项不能重复加入
                if ((legal == null || legal == '0') && personal === '1' && (row.isPersonal == null || row.isPersonal == '0') && row.isLegal === '1') {
                    _that.$Message.warning('已添加事项的办理对象为个人，请选择个人事项');
                    return;
                } else if (legal === '1' && (personal == null || personal == '0') && (row.isLegal == null || row.isLegal == '0') && row.isPersonal === '1') {
                    _that.$Message.warning('已添加事项的办理对象为法人，请选择法人事项');
                    return;
                }

                if (jointStatus == 0 && row.jointStatus == 1) {
                    _that.$Message.warning('已添加的事项不能直接受理，请选择不能直接受理的事项');
                    return;
                } else if (jointStatus == 1 && row.jointStatus == 0) {
                    _that.$Message.warning('已添加的事项可直接受理，请选择可直接受理的事项');
                    return;
                }
            }

            for (let i = 0; i < _that.colectData.length; i++) {
                if (row.id == _that.colectData[i].id) {
                    _that.$Message.warning('事项不能重复加入');
                    return;
                }
            }

            _that.bNoDataHide = false;
            _that.mergeBtn = false;
            _that.colectData.push(row);
            _that.boxnum++;
            _that.$Message.success('加入事项箱成功');
        },
        /*
        ** 移除事项箱事件
        */
        removeMatt(index) {
            this.colectData.splice(index, 1);
            // this.boxnum--;
            // if (this.boxnum == 0) {
            //     this.bNoDataHide = true;
            //     this.mergeBtn = true;
            // }
        },
        /*
        ** 清空事项箱
        */
        clearAll() {
            this.colectData = [];
            // this.boxnum = 0;
            // this.bNoDataHide = true;
            // this.mergeBtn = true;
        },
        /*
        ** 部门改变
        */
        deptChangeEvt(data) {
            let _that = this;
            _that.deptVal = data;
            _that.matCurPage = 1;
            _that.getMattData();
        },
        /*
        ** 办理对象改变
        */
        objChangeEvt(data) {
            let _that = this;
            _that.themeType = data;
            _that.matCurPage = 1;
            _that.getMattData();
        },
        /*
        ** 综合查询
        */
        searchEvt() {
            let _that = this;
            _that.xzqhVal = [_that.xzqhVal[_that.xzqhVal.length - 1]];
            _that.deptVal = _that.deptVal;
            _that.themeType = _that.themeType;
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
        /**
         * 记录查询数据
         */
        recordSerParam() {
            let _that = this,
                recordSearchParam = {},
                stateObj = _that.$store.state;
            if(stateObj.isTrigEdit) { 
                _that.matCurPage = parseInt(_that.recordSearchParam.matCurPage);
                _that.deptVal = _that.recordSearchParam.deptVal;
                _that.themeType = _that.recordSearchParam.themeType;
                for(let i = 0; i < _that.recordSearchParam.colectData.length; i++) {
                    _that.$set(_that.colectData, i, _that.recordSearchParam.colectData[i]);
                }
                _that.isShowBox = _that.recordSearchParam.isShowBox;
                _that.$store.commit('setState', {
                    isTrigEdit: false
                });
            }
            recordSearchParam = {
                matterName: _that.searchTxtData.matterName.trim(),//事项名称
                deptVal: _that.deptVal,
                themeType: _that.themeType,
                matCurPage: _that.matCurPage, //当前页
                matPageSize: _that.matPageSize, //每页数量
                colectData: _that.colectData,
                tabState: _that.tabState,
                xzqhCacheData: _that.xzqhCacheData,
                xia: _that.xia,
                shang: _that.shang,
                isHigRow: _that.isHigRow,
                isShowBox: _that.isShowBox,
                favCurrentPage: _that.favCurrentPage,
                favPageSize: _that.favPageSize
            };
            _that.$store.commit('setState', {
                recordSearchParam: recordSearchParam
            });

        },
        /*
        ** 获取事项列表数据
        */
        getMattData() {
            let _that = this,
                jsonObj = {};
            _that.recordSerParam();
            jsonObj = {
                matterName: _that.matterName.trim(),//事项名称
                adminDiv: _that.xzqhVal[_that.xzqhVal.length - 1],//行政区划编码
                deptCode: _that.deptVal === 'all' ? '' : _that.deptVal,//部门编码
                themeType: _that.themeType === 'all' ? '' : _that.themeType,//办理对象 0：个人 1：法人
                pageNum: _that.matCurPage,//当前页
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
            unit.ajaxObjPost('/znsj-web/matter/getAll', jsonObj, function (res) {
                // loading.close();
                _that.loading.close();
                let data = res.data;
                _that.matTotal = data.total;
                _that.matCurPage = data.pageNum;
                data = data.rows;
                $.each(data, function (index, item) {
                    item.matterName = (item.matterName === null || '') ? '--' : item.matterName;
                    item.commitTime = (item.commitTime === null || '') ? '--' : item.commitTime + '工作日';
                    item.deptName = (item.deptName === null || '') ? '--' : item.deptName;
                    $.each(item.childs, function (i, t) {
                        t.matterName = (t.matterName === null || '') ? '--' : t.matterName;
                        t.commitTime = (t.commitTime === null || '') ? '--' : t.commitTime + '工作日';
                        t.deptName = (t.deptName === null || '') ? '--' : t.deptName;
                    });
                });
                _that.mattersData = data;
            }, function (res) {
                // loading.close();
                _that.loading.close();
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
        ** 加入收藏
        */
        colectMatt(row) {
            let _that = this,
                obj = {
                    matterCode: row.matterCode,
                    isFav: '1',
                    userId: ''
                };
            if (row.isFav === '0') { //未收藏
                unit.ajaxMerPost('/znsj-web/matter/updateFav', obj, function (res) {
                    _that.$Message.success('收藏成功');
                    _that.getMyFavData();
                    _that.getMattData();
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
                    matterCode: row.matterCode,
                    version: row.matterVersion,
                    isFav: '0', //0 取消收藏 ，1 收藏
                    userId: ''
                };
            unit.ajaxMerPost('/znsj-web/matter/updateFav', obj, function (res) {
                _that.$Message.success('取消成功');
                _that.getMyFavData();
                _that.getMattData();
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
            unit.ajaxMerPost('/znsj-web/matter/getMyFav', obj, function (res) {
                let data = res.data,
                    alldata = data.rows;
                _that.favTotal = data.total;
                _that.favCurrentPage = data.pageNum;
                $.each(alldata, function (index, item) {
                    item.matterName = (item.matterName === null || '') ? '--' : item.matterName;
                    item.commitTime = (item.commitTime === null || '') ? '--' : item.commitTime + '工作日';
                    item.deptName = (item.deptName === null || '') ? '--' : item.deptName;
                    $.each(item.childs, function (i, t) {
                        t.matterName = (t.matterName === null || '') ? '--' : t.matterName;
                        t.commitTime = (t.commitTime === null || '') ? '--' : t.commitTime + '工作日';
                        t.deptName = (t.deptName === null || '') ? '--' : t.deptName;
                    });
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
                // $.each(res.data, function (index, item) {
                //     item.children = [];
                //     item.loading = false;
                // })
                $.each(res.data, function (i, t) {
                    if(t.hasChild == '1') {
                        t.children = [];
                        // 有下一级箭头 可加载子类
                        t.loading = false; 
                    }
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
                if(!stateObj.isTrigEdit) {
                    _that.xzqhCacheData = [];
                    for(let i = 0; i < selectedData.length; i++) {
                        _that.xzqhCacheData.push(selectedData[i].value);
                    }
                }
                
            }
            if(_that.xzqhCount > _that.saveXzqh.length) {
                setTimeout(()=>{
                    _that.getDeptData();//联动部门
                },300)  
            }
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
                    //     _that.getDeptData();//联动部门
                    //     _that.xzqhVal = item.__value && item.__value.split(',');
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
        ** 获取默认行政区划
        */
        getDefaultXzqh() {
            let that = this,
                stateObj = that.$store.state;
            if(!stateObj.isTrigEdit) {
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
                    // 联动部门
                    that.getDeptData();
                }, function (res) {
                    that.loading.close();
                    that.$Message.warning('服务端错误');
                }, that);
            }else if(stateObj.isTrigEdit){
                that.recordSearchParam = stateObj.recordSearchParam;
                that.xzqhCacheData = that.recordSearchParam.xzqhCacheData;
                that.saveXzqh = [];
                that.xzqhVal = [];
                for (let i in  that.xzqhCacheData) {
                    that.xzqhVal.push(that.xzqhCacheData[i]);
                    that.saveXzqh.push(that.xzqhCacheData[i]);
                }
                
                // 联动部门
                that.getDeptData();
            } 
        },
        /*
        ** 办理对象
        */
        getProObjData() {
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
                let data = res.data;
                if (str === 'bldx') {
                    _that.objData = data;
                    _that.objData.unshift({
                        label: '全部',
                        value: 'all'
                    });
                    _that.themeType = 'all';
                }
            }, function (res) {
                _that.$Message.warning('获取数据失败');
            }, _that);
        },
        /*
        ** 获取部门
        */
        getDeptData(type) {
            let _that = this,
                obj = {};
            if(_that.xzqhCount <= _that.saveXzqh.length) {
                obj.adminDiv = _that.saveXzqh.length > 0 ? _that.saveXzqh[_that.saveXzqh.length - 1] : ''
            }else {
                obj.adminDiv = _that.xzqhVal.length > 0 ? _that.xzqhVal[_that.xzqhVal.length - 1] : ''
            }
            if (_that.xzqhVal.length != 0) {
                unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                    _that.loading.close();
                    _that.deptData = res.data;
                    _that.deptData.unshift({
                        label: "全部",
                        value: "all"
                    });
                    _that.deptVal = 'all';
                    _that.searchEvt();
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
        /**
         * 初始化记录信息
         */
        initRecordState() {
            let that = this,
                stateObj = that.$store.state;
            if(!stateObj.isTrigEdit) {
                return
            }
            that.recordSearchParam = stateObj.recordSearchParam;
            for(let key in that.recordSearchParam) {
                if(key != 'deptVal' && key != 'themeType') {
                    that.$set(that, key, that.recordSearchParam[key]);
                    if(key == 'tabState') {
                        that.$refs.tabSwitch.titleClickEvt(that.tabState);
                    }
                }
            }
        },
        /*
        ** 初始化
        */
        init() {
            let _that = this;
            _that.initRecordState();
            _that.getXzqhTreeData();//获取行政区划
            _that.getProObjData();//获取办理对象
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
<style lang="less">
@import "../../../assets/styles/color.less";
#searchMatters {
    padding: 0px 20px 0px 20px;
    background-color: #edf0f6;
    overflow: auto;
    height: 100%;

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
                    padding-left: 110px;
                    // .el-table::before{
                    //     background-color: transparent!important;
                    //     height:0px!important;
                    // }
                    // .el-table td{
                    //     border-bottom:none!important;
                    // }
                    // .el-table tr{
                    //     padding-left:110px;
                    // }
                    // .el-table td:first-of-type{
                    //     padding-left:2em!important;
                    // }
                    // .el-table td{
                    //     padding-left:110px;
                    // }
                }
            }

            .search-wrap {
                .search-col {
                    text-align: center;

                    button {
                        width: 94px;
                        height: 35px;
                        background-color: #137ddf;
                        border-color: #137ddf;
                    }
                }
            }

            .matters-box {
                position: relative;
                width: 69px;
                height: 69px;
                padding: 12px 0;
                border-radius: 36px;
                border: 1px solid #d2d8e5;
                text-align: center;
                z-index: 7;
                cursor: pointer;

                p {
                    color: #17233d;
                }

                .matter-num {
                    display: inline-block;
                    position: absolute;
                    top: 6px;
                    right: -8px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    border-radius: 10px;
                    color: #f0edc6;
                    background-color: #f0292b;
                }
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

                a {
                    color: #2d8cf0;
                }

                a:hover {
                    color: #40a9ff;
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

                // a.one-matters {
                // color: #515a6e;s
                // }
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
                // border-color: #4096ff;
            }

            .ivu-card-head {
                // background-color: @baseColor;
                height: 32px;
                height: 36px;
                padding: 6px 16px;

                p {
                    text-align: right;
                }
            }

            .ic-cancle {
                font-size: 18px;
                color: #909399;
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
                padding: 0px 7px 0px;
                height: 25px;
                & > span {
                    vertical-align: baseline;
                }
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
                // margin-right: 10px;
                width: 95%;
                .ivu-input {
                    height: 36px;
                }
            }

            .dept-width {
                width: 79%;
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
