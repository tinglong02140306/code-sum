/*
 * @Author: tinglong 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-28 20:03:09
 */
<template>
    <div id="linkConfig">
        <!-- 指南配置列表 -->
        <div class="list-wrap">
            <el-table :data="guideData" @selection-change="linkSelectChange">
                <el-table-column class="font-max" align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="linkName" label="环节名称">
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="linkTime" label="环节时限">
                </el-table-column>
                <el-table-column class="font-max" align="left" prop="dealUserName" label="办理人">
                    <template slot-scope="scope">
                        <span class="cell el-tooltip" :title="scope.row.dealUserName">{{scope.row.dealUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="font-max" align="left" prop="userDetpName" label="所属单位">
                    <template slot-scope="scope">
                        <span class="cell el-tooltip" :title="scope.row.userDetpName">{{scope.row.userDetpName}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="font-max" align="left" prop="dealRoleName" label="办理角色">
                    <template slot-scope="scope">
                        <span class="cell el-tooltip" :title="scope.row.dealRoleName">{{scope.row.dealRoleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="lastLinkName" label="上一环节">
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="nextLinkName" label="下一环节">
                </el-table-column>
                <el-table-column class="font-max" align="center" label="服务配置">
                    <template slot-scope="scope">
                        <span style="cursor:pointer" class="blue" @click="showServerSet(scope.row.id)" v-if="scope.row.isServerConfigured==true">已配置</span>
                        <span style="cursor:pointer" v-else @click="showServerSet(scope.row.id)">未配置</span>
                        <span style="cursor:pointer" class="blue" @click="resetConfig(scope.row.id)" v-if="scope.row.isServerConfigured==true">重置</span>
                        <el-button type="text" v-else disabled>重置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button class="font-max" type="text" size="small" @click="editLinkEvt(guideData[scope.$index])">编辑</el-button>
                        <el-button class="font-max" type="text" size="small" @click="deleteLink(guideData[scope.$index])">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 新增环节配置列表 -->
        <el-dialog :close-on-click-modal="false" @closed="clearFormData" :title="guideTitle" :visible.sync="guideAddVis" width="800px" height="600px">
            <el-form :model="formData" :rules="guideRules" ref="guideForm" label-width="80px" :label-position="labelPosition" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="环节名称" prop="linkCode">
                            <el-select v-model="formData.linkCode" placeholder="请选择">
                                <el-option v-for="(item,index) in linkNames" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="环节时限" prop="linkTime">
                            <el-input class="worktime" v-model="formData.linkTime" @change="(val)=>changeLinkTime(val)"></el-input>&nbsp;工作日
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="上一环节" prop="lastLink">
                            <el-select v-model="formData.lastLinkCode" placeholder="请选择" :clearable="true">
                                <el-option v-for="(item,index) in linkNames" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="下一环节" prop="nextLink">
                            <el-select v-model="formData.nextLinkCode" placeholder="请选择" :clearable="true">
                                <el-option v-for="(item,index) in linkNames" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="font-min" label="办理角色" prop="dealRoleCode">
                            <el-select :popper-append-to-body="false" :automatic-dropdown="false" v-model="formData.dealRoleName" class="chouseCharacter" @focus="chouseCharacter">
                                <el-option v-for="(item,index) in formData.characterChouseShow" :key="index" :label="item.dealRoleName" :value="item.dealRoleCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="right">
                            <el-button type="primary" size="small" @click="chouseTransactor">新增</el-button>
                            <el-button size="small" type="danger" @click="deleteTransactor(Transactor.selectSels)">删除</el-button>
                        </div>
                        <el-table ref="selectTransactorOut" :data="Transactor.chousenCharacterShow.data" @row-click="(row)=>changeTransactorOn(row,'selectTransactorOut')" @selection-change="selsChangeRight">
                            <el-table-column type="selection" class="font-max" align="center" width="55">
                            </el-table-column>
                            <el-table-column class="font-max" label="姓名" align="left" prop="dealUserName">
                            </el-table-column>
                            <el-table-column class="font-max" label="身份证号" align="left" prop="dealUserSfzh">
                                <template slot-scope="scope">
                                    <span :title="scope.row.dealUserSfzh" class="cell el-tooltip">{{scope.row.dealUserSfzh}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class="font-max" label="所属单位" align="left" prop="userDeptName">
                                <template slot-scope="scope">
                                    <span :title="scope.row.userDeptName" class="cell el-tooltip">{{scope.row.userDeptName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class="font-max" label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button class="font-max" type="text" size="small" @click.stop="deleteTransactor([scope.row])">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="pagination" small @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5]" :page-size="5" layout="total,sizes,prev,pager,next, jumper" :total="parseInt(Transactor.chousenCharacterShow.count)">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!-- 指南内容 -->
                <div class="footer">
                    <el-button type="primary" size="small" @click="editLink">确 定</el-button>
                    <el-button size="small" @click="guideAddVis = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 选角色列表 -->
        <el-dialog ref="chouseDialog" :close-on-click-modal="false" @closed="clearCharacterData" :title="'选择角色'" :visible.sync="showCharacter" width="1300px">
            <el-row>
                <el-col :span="13" style="position:relative">
                    <el-col :span="22" class="border-b table-600">
                        <div class="chouse-header">
                            <div class="title">待选角色</div>
                            <div class="select">
                                <el-select :clearable="true" v-model="Character.chouseDeptName.label" class="w150" placeholder="请选择所属应用" filterable>
                                    <el-option v-for="(item,index) in Character.deptName" :key="index" :label="item.label" :value="item.value" :title="item.label">
                                    </el-option>
                                </el-select>
                                <el-input placeholder="请输入角色名称" v-model="characterOnChouse.label" maxlength="20" @change="(val)=>changeInputLeft(val)"></el-input>&nbsp;
                                <el-button @click="searchLeft">查询</el-button>
                            </div>
                        </div>
                        <div class="chouse-content">
                            <el-table ref="selectCharacter" @row-click="(row)=>changeCharacterOn(row)" :data="Character.selectCharacter.data" tooltip-effect="dark" style="width: 100%">
                                <el-table-column prop="id" width="55" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="radioOnChouse" :label="scope.$index">&nbsp;</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="'角色名称'" align="left">
                                    <template slot-scope="scope">
                                        <span :title="scope.row.dealRoleName" class="cell el-tooltip">{{scope.row.dealRoleName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="dialogType=='Transactor'?'所属单位':'所属应用'" align="left">
                                    <template slot-scope="scope">
                                        <span :title="scope.row.sysName " class="cell el-tooltip">{{scope.row.sysName }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination :pager-count="5" small @size-change="handleSizeChangeLeft" @current-change="handleCurrentChangeLeft" :current-page="Character.currentPageLeft" :page-sizes="[10,20,30,40,50,100]" :page-size="Character.pagesizeLeft" layout="sizes,prev,pager,next,jumper" :total="parseInt(Character.selectCharacter.count)">
                            </el-pagination>
                        </div>
                    </el-col>
                    <el-col :span="2" class="switch-box">
                        <div class="moveRight" @click="moveRight(Character.chousenSels)"></div> <br>
                        <div class="moveLeft" @click="moveLeft(Character.selectSels)"></div>
                    </el-col>
                </el-col>
                <el-col :span="11" class="border-b table-600">
                    <div class="chouse-header">
                        <div class="title">已选角色</div>
                        <div class="select">
                            <div v-if="dialogType == 'Transactor'">
                                <el-input placeholder="请输入姓名" v-model="transactorHasChouse.label" maxlength="20" @change="(val)=>changeInputRight(val)"></el-input>&nbsp;
                                <el-button @click="searchRight">查询</el-button>
                            </div>
                            <div v-if="dialogType == 'Character'">
                                <el-input placeholder="请输入角色名称" v-model="characterHasChouse.label" maxlength="20" @change="(val)=>changeInputRight(val)"></el-input>&nbsp;
                                <el-button @click="searchRight">查询</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="chouse-content">
                        <el-table ref="chousenCharacter" @row-click="(row)=>changeCharacterHas(row)" :data="Character.chousenCharacter.data" tooltip-effect="dark" style="width: 100%">
                            <el-table-column v-if="dialogType == 'Character'" prop="id" width="55" align="center">
                                <template slot-scope="scope">
                                    <el-radio v-model="radioHasChouse" :label="scope.$index">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column :label="'角色名称'" align="left">
                                <template slot-scope="scope">
                                    <span :title="dialogType=='Transactor'?scope.row.dealUserName:scope.row.dealRoleName" class="cell el-tooltip">{{dialogType=="Transactor"?scope.row.dealUserName:scope.row.dealRoleName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="'所属应用'" align="left">
                                <template slot-scope="scope">
                                    <span :title="dialogType=='Transactor'?scope.row.userDeptName:scope.row.sysName " class="cell el-tooltip">{{dialogType=="Transactor"?scope.row.userDeptName:scope.row.sysName }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="pagination" :pager-count="5" small @size-change="handleSizeChangeRight" @current-change="handleCurrentChangeRight" :current-page="Character.currentPageRight" :page-sizes="[10,20,30,40,50,100]" :page-size="Character.pagesizeRight" layout="sizes,prev,pager,next, jumper" :total="parseInt(Character.chousenCharacter.count)">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 办理人列表 -->
        <el-dialog ref="chouseDialog" :close-on-click-modal="false" @closed="clearCharacterData" :title="'选择办理人'" :visible.sync="showTransactor" width="1300px">
            <el-row>
                <el-col :span="13" style="position:relative">
                    <el-col :span="22" class="border-b table-600">
                        <div class="chouse-header">
                            <div class="title">待选人员</div>
                            <div class="select">
                                <div v-if="dialogType == 'Transactor'">
                                    <el-select :clearable="true" v-model="Transactor.chouseDeptName.label" class="w150" placeholder="请选择所属单位" filterable>
                                        <el-option v-for="(item,index) in Transactor.deptName" :key="index" :label="item.label" :value="item.value" :title="item.label">
                                        </el-option>
                                    </el-select>
                                    <el-input placeholder="请输入姓名" v-model="transactorOnChouse.label" maxlength="20" @change="(val)=>changeInputLeft(val)"></el-input>&nbsp;
                                    <el-button @click="searchLeft">查询</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="chouse-content">
                            <el-table ref="selectTransactorLeft" :data="Transactor.selectCharacter.data" @row-click="(row)=>changeTransactorOn(row,'selectTransactorLeft')" @selection-change="selsChangeLeft" tooltip-effect="dark" style="width: 100%">
                                <el-table-column v-if="dialogType == 'Transactor'" type="selection" prop="id" width="55" align="center">
                                </el-table-column>
                                <el-table-column :label="'姓名'" align="left">
                                    <template slot-scope="scope">
                                        <span :title="scope.row.dealUserName" class="cell el-tooltip">{{scope.row.dealUserName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="'所属单位'" align="left">
                                    <template slot-scope="scope">
                                        <span :title="scope.row.userDeptName" class="cell el-tooltip">{{scope.row.userDeptName}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination :pager-count="5" small @size-change="handleSizeChangeLeft" @current-change="handleCurrentChangeLeft" :current-page="Transactor.currentPageLeft" :page-sizes="[10,20,30,40,50,100]" :page-size="Transactor.pagesizeLeft" layout="sizes,prev,pager,next,jumper" :total="parseInt(Transactor.selectCharacter.count)">
                            </el-pagination>
                        </div>
                    </el-col>
                    <el-col :span="2" class="switch-box">
                        <div class="moveRight" @click="moveRight(Transactor.chousenSels)"></div> <br>
                        <div class="moveLeft" @click="moveLeft(Transactor.selectSels)"></div>
                    </el-col>
                </el-col>
                <el-col :span="11" class="border-b table-600">
                    <div class="chouse-header">
                        <div class="title">已选人员</div>
                        <div class="select">
                            <div v-if="dialogType == 'Transactor'">
                                <el-input placeholder="请输入姓名" v-model="transactorHasChouse.label" maxlength="20" @change="(val)=>changeInputRight(val)"></el-input>&nbsp;
                                <el-button @click="searchRight">查询</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="chouse-content">
                        <el-table ref="selectTransactorRight" :data="Transactor.chousenCharacter.data" @row-click="(row)=>changeTransactorOn(row,'selectTransactorRight')" @selection-change="selsChangeRight" tooltip-effect="dark" style="width: 100%">
                            <el-table-column v-if="dialogType == 'Transactor'" type="selection" width="55" align="center">
                            </el-table-column>
                            <el-table-column :label="'姓名'" align="left">
                                <template slot-scope="scope">
                                    <span :title="scope.row.dealUserName" class="cell el-tooltip">{{scope.row.dealUserName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="dialogType=='Transactor'?'所属单位':'所属应用'" align="left">
                                <template slot-scope="scope">
                                    <span :title="scope.row.userDeptName" class="cell el-tooltip">{{scope.row.userDeptName}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="pagination" :pager-count="5" small @size-change="handleSizeChangeRight" @current-change="handleCurrentChangeRight" :current-page="Transactor.currentPageRight" :page-sizes="[10,20,30,40,50,100]" :page-size="Transactor.pagesizeRight" layout="sizes,prev,pager,next, jumper" :total="parseInt(Transactor.chousenCharacter.count)">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 已配置弹出框 -->
        <el-dialog :close-on-click-modal="false" title="服务配置" :visible.sync="matterFlag" width="1100px" class="matter" @close="closeDialog">
            <serverSetCommon v-if="matterFlag" :param="this.param" @closeDialog="closeDialog"></serverSetCommon>
        </el-dialog>
        <!-- <ShottleTable :dialogType="this.dialogType" :ShottleData="this.ShottleData"></ShottleTable> -->

    </div>
</template>

<script>
import unit from "@/api";   // 公共工具方法
import UE from '@/components/UE/ue.vue';
import serverSetCommon from "@/components/serverSet/serverSetCommon";
// import ShottleTable from "@/components/ShottleTable/ShottleTable";

import axios from 'axios';
import $ from "jquery";
export default {
    components: {
        UE: UE,
        serverSetCommon: serverSetCommon,
        //   ShottleTable:ShottleTable
    },
    data() {
        return {
            loading: '',
            matterFlag: false,//显示配置组件弹窗
            editType: '',
            // 指南列表数据
            guideData: [],
            linkSels: [],    //最外层表格选中
            formData: {
                createTime: "",
                dealRoleCode: "",
                dealRoleName: "",
                dealUserAccount: "",
                dealUserName: "",
                id: "",
                isDelete: "",
                isServerConfigured: "",
                lastLinkCode: "",
                lastLinkName: '',
                linkCode: "",
                linkName: '',
                linkTime: '',
                matterCode: "",
                matterVersion: '',
                nextLinkCode: "",
                nextLinkName: '',
                userDeptCode: "",
                userDetpName: "",
            },
            Transactor: {    //办理人表格参数
                pageData: [],    //
                currentPageLeft: 1,  //左表格当前页
                pagesizeLeft: 10,    //左表格一页条目数
                currentPageRight: 1, //右表格当前页
                pagesizeRight: 10,   //右表格一页条目数
                selectSels: [],//已选角色已选中
                chousenSels: [],//候选角色已选中
                chousenCharacterShow: {
                    count: 0,
                    data: []
                },//办理角色显示
                chouseShow: [],//办理角色el-select绑定的数组
                selectCharacter: {//候选人物
                    count: 0,
                    data: []
                },
                chousenCharacter: {//已选人物
                    count: 0,
                    data: []
                },
                deptName: [],    //所属单位下拉框
                chouseDeptName: {    //所属单位下拉框绑定
                    label: '',
                    value: ''
                }
            },
            currentPage: 1,
            radioOnChouse: -1,
            radioHasChouse: -1,
            Character: {    //办理人表格参数
                pageData: [],    //
                currentPageLeft: 1,  //左表格当前页
                pagesizeLeft: 10,    //左表格一页条目数
                currentPageRight: 1, //右表格当前页
                pagesizeRight: 10,   //右表格一页条目数
                selectSels: [],//已选角色已选中
                chousenSels: [],//候选角色已选中
                chousenCharacterShow: [],//办理角色显示
                chouseShow: [],//办理角色el-select绑定的数组
                selectCharacter: {//候选人物
                    count: '',
                    data: []
                },
                chousenCharacter: {//已选人物
                    count: '',
                    data: []
                },
                deptName: [],//所属单位下拉框
                chouseDeptName: {//所属单位下拉框绑定
                    label: '',
                    value: ''
                }
            },
            transactorOnChouse: {
                label: '',
                value: ''
            },
            transactorHasChouse: {
                label: "",
                value: ''
            },
            characterOnChouse: {
                label: '',
                value: ''
            },
            characterHasChouse: {
                label: '',
                value: ''
            },
            dialogType: '',
            showCharacter: false,//选择角色窗口显示
            showTransactor: false,//选择办理人窗口显示
            characterDeleting: false,    //禁用角色选择器
            transactorDeleting: false,   //禁用人员选择器
            value: '',
            linkNames: [{           //3个下拉框的数据
                value: '',
                label: ''
            }],
            // 测试数据
            version: 1.1,
            code: 'px-s2e-s',

            guideAddVis: false, // 新增环节配置弹框标志位 
            uuid: '',//获取的uuid
            guideTitle: '新增环节配置',
            isSubmit: false, //判断是点击确定按钮还是单纯关闭弹框
            // 环节表单数据
            guideFormData: {
                guideTitle: '',  // 指南名称
                guideDsc: '' // 指南内容
            },
            // 验证规则
            guideRules: {
                linkCode: [
                    { required: true, message: '请选择环节名称', trigger: 'change' },
                ],
                linkTime: [
                    { required: true, message: '请输入环节时限', trigger: 'blur' },
                    { pattern: /^(?!0[0-9])(?:[0-9]{1,3}|999)$/, message: "请输入0到999的正整数", trigger: 'blur' }
                ],
                lastLink: [
                    { required: false, message: '请选择上一环节', trigger: 'change' }
                ],
                nextLink: [
                    { required: false, message: '请选择下一环节', trigger: 'change' }
                ],
                dealRoleCode: [
                    { required: true, message: '请选择办理角色', trigger: 'change' }
                ],
                dealUserAccount: [
                    { required: false, message: '请选择办理人员', trigger: 'change' }
                ],
            },
            labelPosition: 'right',
            param: {
                linkId: "",
                matterCode: '',
                templateType: '1',
                matterVersion: ''
            },
            ShottleData: {
                linkId: '',
                version: '',
                code: '',
                showDialog: false
            }
        };

    },
    methods: {
        /**
         * 显示配置页面
         */
        showServerSet(id) {
            let that = this;
            that.param.linkId = id
            that.matterFlag = true;
        },
        /** 重置配置 */
        resetConfig(id) {
            let that = this;
            that.$confirm("确定要清除已配置的服务吗?", "提示", {
                confirmButtonText: "确 定",
                cancelButtonText: "取 消",
                cancelButtonClass: 'fr ml10',
                type: "warning"
            })
                .then(() => {
                    var url = '/data/server/cleanAll';
                    unit.ajaxMerPost('/znsj-web' + url, {
                        id: id,
                        type: "1"
                    }, function (res) {
                        res = typeof res == 'string' ? JSON.parse(res) : res;
                        that.$Message.success('重置成功！');
                        if (res.errMsg == 'success') {
                            that.getGuideData();
                        }
                    }, function (error) {
                        that.$Message.error(error.errMsg || '数据加载失败！');
                    }, that);
                })
                .catch(() => { });
        },
        /**
         * 关闭配置页面
         */
        closeDialog() {
            let that = this;
            that.getGuideData();
            that.matterFlag = false;
        },
        /**
         * 显示左右穿梭框页面
         */
        showShottle(id, type) {
            let that = this;
            that.ShottleData.id = linkId
            that.dialogType = type
        },
        /**
         * 已选角色pagesize变化
         */
        handleSizeChangeRight(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.pagesizeRight = val;
                that.Transactor.currentPageRight = 1;
                that.getChousenCharacter();
            } else if (that.dialogType == "Character") {
                that.Character.pagesizeRight = val;
                that.Character.currentPageRight = 1;
                that.getChousenCharacter();
            }
        },
        /**
         * 候选角色pagesize变化
         */
        handleSizeChangeLeft(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.pagesizeLeft = val;
                that.Transactor.currentPageLeft = 1;
                that.getSelectCharacter(1)
            } else if (that.dialogType == "Character") {
                that.Character.pagesizeLeft = val;
                that.Character.currentPageLeft = 1;
                that.getSelectCharacter(1)
            }
        },
        /**
         * 已选角色当前页变化
         */
        handleCurrentChangeRight(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.currentPageRight = val;
                that.getChousenCharacter(that.Transactor.currentPageRight);
            } else if (that.dialogType == "Character") {
                that.Character.currentPageRight = val;
                that.getChousenCharacter(that.Transactor.currentPageRight);
            }
        },
        /**
         * 候选角色当前页变化
         */
        handleCurrentChangeLeft(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.currentPageLeft = val;
                that.getSelectCharacter(that.Transactor.currentPageLeft)
            } else if (that.dialogType == "Character") {
                that.Character.currentPageLeft = val;
                that.getSelectCharacter(that.Character.currentPageLeft)
            }
        },
        /**
         * 已选人员外层表格当前页变化
         */
        handleCurrentChange(val) {
            let that = this;
            that.currentPage = val
            that.getTransactorTable()
        },
        /**
         * 环节配置表格选中
         */
        linkSelectChange(sels) {
            let that = this;
            that.linkSels = sels;
        },
        /**
         * 候选角色选中
         */
        selsChangeLeft(sels) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.chousenSels = sels;
            } else if (that.dialogType == "Character") {
                that.Character.chousenSels = sels;
            }
        },
        /**
         * 候选角色的某一行点击
         */
        changeCharacterOn(row) {
            let that = this;
            that.Character.chousenSels = [row];
            that.radioOnChouse = that.Character.selectCharacter.data.indexOf(row)
        },
        /**
         * 已选角色某一行点击
         */
        changeCharacterHas(row) {
            let that = this;
            that.Character.selectSels = [row];
            that.radioHasChouse = that.Character.chousenCharacter.data.indexOf(row)
        },
        /**
         * 人员表格某一行点击
         */
        changeTransactorOn(row, ref) {
            let that = this;
            that.$refs[ref].toggleRowSelection(row)
        },
        /**
         * 已选角色选中
         */
        selsChangeRight(sels) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.Transactor.selectSels = sels;
            } else if (that.dialogType == "Character") {
                that.Character.selectSels = sels;
            } else {
                that.Transactor.selectSels = sels;  //外层表格选中
            }
        },
        /**
         * 外层已选人员删除
         */
        deleteTransactor(sel) {
            let that = this;
            if (sel.length == 0) {
                that.$Message.error("请选择办理人")
                return
            }
            // if(sel.length == 1){
            //     let row = sel[0];
            //     that.$refs['selectTransactorOut'].toggleRowSelection(row,true);
            // }
            that.$confirm("确定删除选中的人员吗?", "提示", {
                confirmButtonText: "确 定",
                cancelButtonText: "取 消",
                cancelButtonClass: 'fr ml10',
                type: "warning"
            })
                .then(() => {
                    var url = '/dept/user/leftRemoveLinkUserByUserAccounts';
                    var select = '';
                    if (Array.isArray(sel)) {
                        for (var item of sel) {
                            if (item.dealUserAccount) {
                                select += item.dealUserAccount + ',';
                            }
                        }
                        select = select.substring(0, select.length - 1);
                    } else {
                        select = sel
                    }
                    var param = {
                        accounts: select,
                        linkId: that.uuid
                    };
                    unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                        res = typeof res == 'string' ? JSON.parse(res) : res;
                        var data = res.data;
                        if (res.flag) {
                            // that.currentPage = 1;
                            that.getTransactorTable();
                            that.addCharacter()
                        } else {
                            that.$Message.error(res.data.errMsg || '数据加载失败！');
                        }
                    }, function (error) {
                        that.$Message.error(error.data.errMsg || '数据加载失败！');
                    }, that);
                })
                .catch(() => { });
        },
        //左移
        moveLeft(sel) {
            let that = this;
            if (!sel) {
                that.$Message.error("请选择角色")
                return
            }
            if (that.dialogType == "Transactor") {
                var url = '/dept/user/leftRemoveLinkUserByUserAccounts';
                var select = '';

                if (Array.isArray(sel)) {
                    for (var item of sel) {
                        if (item.dealUserAccount) {
                            select += item.dealUserAccount + ',';
                        }
                    }
                    select = select.substring(0, select.length - 1);
                } else {
                    select = sel
                }
                var param = {
                    accounts: select,
                    linkId: that.uuid
                };
                that.loading = this.$loading({
                    lock: true,
                    text: "操作中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.5)",
                    customClass: "el-mask"
                });
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    var data = res.data;
                    if (res.flag) {
                        that.loading.close();
                        if (that.Transactor.chousenSels) {
                            that.Transactor.chousenSels = unit.removeAaary(that.Transactor.chousenSels, sel);
                        }
                        if (that.Character.chousenSels) {
                            that.Character.chousenSels = unit.removeAaary(that.Character.chousenSels, sel);
                        }
                        that.Character.selectSels = null;

                        that.getSelectCharacter(that.Transactor.currentPageLeft);
                        that.getChousenCharacter(that.Transactor.currentPageRight);
                        that.addCharacter()
                    } else {
                        that.loading.close();
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            } else if (that.dialogType == "Character") {
                var url = '/deal/role/leftRemoveLinkRoleByRoleIds';
                var select = '';
                select = sel[0].dealRoleCode
                // select = sel[0].dealRoleName;
                var param = {
                    // roleIds:select,
                    roleCodes: select,
                    linkId: that.uuid
                };
                that.loading = this.$loading({
                    lock: true,
                    text: "操作中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.5)",
                    customClass: "el-mask"
                });
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    var data = res.data;

                    if (res.flag) {
                        that.loading.close();
                        if (that.Character.chousenSels) {
                            that.Character.chousenSels = unit.removeAaary(that.Character.chousenSels, sel);
                        }
                        if (that.Transactor.chousenSels) {
                            that.Transactor.chousenSels = unit.removeAaary(that.Transactor.chousenSels, sel);
                        }
                        that.Character.selectSels = null;

                        that.getSelectCharacter(that.Character.currentPageLeft);
                        that.getChousenCharacter(that.Character.currentPageRight);
                        that.addCharacter();
                        that.radioOnChouse = -1;//把候选角色的单选清空
                        that.radioHasChouse = -1;//把已选角色的单选清空
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.loading.close();
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }

        },
        //右移
        moveRight(sel) {
            let that = this;
            if (!sel) {
                that.$Message.error("请选择角色")
                return
            }
            if (that.dialogType == "Transactor") {
                let url = '/dept/user/rightAddLinkUserByAccounts';
                if (that.formData.dealUserAccount.length + sel.length > 1000) {
                    that.$Message.error("最多可添加1000个办理人")
                    return
                }
                let chouse = '';//获取id组成的字符串
                for (let item of sel) {
                    if (item.dealUserAccount) {
                        chouse += item.dealUserAccount + ',';
                    } else {
                        chouse += item + ',';
                    }
                }
                chouse = chouse.substring(0, chouse.length - 1);
                let param = {
                    accounts: chouse,
                    linkId: that.uuid
                };
                that.loading = this.$loading({
                    lock: true,
                    text: "操作中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.5)",
                    customClass: "el-mask"
                });
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.loading.close();
                        if (that.Transactor.chousenSels) {
                            that.Transactor.chousenSels = unit.removeAaary(that.Transactor.chousenSels, sel);
                        }
                        if (that.Character.chousenSels) {
                            that.Character.chousenSels = unit.removeAaary(that.Character.chousenSels, sel);
                        }
                        that.Character.chousenSels = null;
                        that.getSelectCharacter(that.Transactor.currentPageLeft);
                        that.getChousenCharacter(that.Transactor.currentPageRight);
                        that.addCharacter()
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.loading.close();
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            } else if (that.dialogType == "Character") {
                let url = '/deal/role/rightAddLinkRoleByRoleIdss';
                if (that.formData.dealRoleCode.length + sel.length > 1) {
                    that.$Message.error("只能选择一个角色");
                    return
                }
                let chouse = '';//获取id组成的字符串
                for (let item of sel) {
                    if (item.dealRoleCode) {
                        chouse += item.dealRoleCode + ',';
                    } else {
                        chouse += item + ',';
                    }
                }
                chouse = chouse.substring(0, chouse.length - 1);
                let param = {
                    // roleIds:chouse,
                    roleCodes: chouse,
                    linkId: that.uuid
                };
                that.loading = this.$loading({
                    lock: true,
                    text: "操作中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.5)",
                    customClass: "el-mask"
                });
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.loading.close();
                        if (that.Character.chousenSels) {
                            that.Character.chousenSels = unit.removeAaary(that.Character.chousenSels, sel);
                        }
                        if (that.Transactor.chousenSels) {
                            that.Transactor.chousenSels = unit.removeAaary(that.Transactor.chousenSels, sel);
                        }
                        that.Character.chousenSels = null;

                        that.getSelectCharacter(that.Character.currentPageLeft);
                        that.getChousenCharacter(that.Character.currentPageRight);
                        that.addCharacter();
                        that.radioOnChouse = -1;
                        that.radioHasChouse = -1;
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.loading.close();
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }


        },
        //确定添加选中的用户
        addCharacter() {
            let that = this;
            if (that.dialogType == "Transactor") {
                let url = '/dept/user/getAllLinkUserByLinkId';
                let param = {
                    linkId: that.uuid
                }
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.formData.transactorChouseShow = data //选中的对象
                        // that.formData.transactorChouseShow = data
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            } else if (that.dialogType == "Character") {
                let url = '/deal/role/getAllLinkUserByLinkId';
                let param = {
                    linkId: that.uuid
                }
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.formData.dealRoleName = '';
                        that.formData.dealRoleCode = '';
                        let item = data[0];
                        if (item) {
                            that.formData.characterChouseShow = [{
                                label: item.dealRoleName,
                                value: item.dealRoleCode
                            }];
                            that.formData.dealRoleName = item.dealRoleName || '';
                            that.formData.dealRoleCode = item.dealRoleCode || '';
                        }
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }
        },
        /**
         * 获取候选角色/人员
         */
        getSelectCharacter(pageNum) {
            let that = this;
            if (that.dialogType == "Transactor") {
                let url = '/dept/user/getUnSelectedLinkUser';
                let param = {
                    matteCode: that.code,  // 事件版本
                    matterVersion: that.version,  // 事件code
                    pageNum: pageNum,
                    pageSize: that.Transactor.pagesizeLeft,
                    linkId: that.uuid,
                    roleSystem: '',
                    userName: that.transactorOnChouse.value,
                    // userDept:that.Transactor.chouseDeptName.value,
                    userDeptCode: that.Transactor.chouseDeptName.value,
                    // userDeptName: that.Transactor.chouseDeptName.label,
                };
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.Transactor.selectCharacter = res.data;
                        if (res.data.data.length == 0 && pageNum > 1) {
                            pageNum -= 1;
                            that.handleCurrentChangeLeft(pageNum)
                            return
                        }
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);

            } else if (that.dialogType == "Character") {
                let url = '/deal/role/getUnSelectedLinkUser';
                let param = {
                    matteCode: that.version,  // 事件版本
                    matterVersion: that.code,  // 事件code
                    pageNum: pageNum,
                    pageSize: that.Character.pagesizeLeft,
                    linkId: that.uuid,
                    roleName: that.characterOnChouse.value,
                    roleSystem: '',
                    // sysName:that.Character.chouseDeptName.value,
                    userDept: '',
                    sysCode: that.Character.chouseDeptName.value,
                    // sysName: that.Character.chouseDeptName.label,
                };
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.Character.selectCharacter = res.data;
                        if (res.data.data.length == 0 && pageNum > 1) {
                            pageNum -= 1;
                            that.handleCurrentChangeLeft(pageNum)
                            return
                        }
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }

        },
        /**
         * 获取已选角色/人员
         */
        getChousenCharacter(pageNum) {
            let that = this;
            if (that.dialogType == "Transactor") {
                let url = '/dept/user/getSelectedLinkUser';
                let param = {
                    matteCode: that.code,  // 事件版本
                    matterVersion: that.version,  // 事件code
                    pageNum: pageNum,
                    pageSize: that.Transactor.pagesizeRight,
                    linkId: that.uuid,
                    roleName: '',
                    roleSystem: '',
                    userName: that.transactorHasChouse.value,
                    userDept: "",
                }
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.Transactor.chousenCharacter = res.data;
                        if (res.data.data.length == 0 && pageNum > 1) {
                            pageNum -= 1;
                            that.handleCurrentChangeRight(pageNum)
                            return
                        }
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            } else if (that.dialogType == "Character") {
                let url = '/deal/role/getSelectedLinkUser';
                let param = {
                    matteCode: that.version,  // 事件版本
                    matterVersion: that.code,  // 事件code
                    pageNum: pageNum,
                    pageSize: that.Character.pagesizeRight,
                    linkId: that.uuid,
                    roleName: that.characterHasChouse.value,
                    roleSystem: '',
                    userName: '',
                    userDept: '',
                }
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.Character.chousenCharacter = res.data;
                        if (res.data.data.length == 0 && pageNum > 1) {
                            pageNum -= 1;
                            that.handleCurrentChangeRight(pageNum)
                            return
                        }
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }
        },
        /**
         * 搜索候选
         */
        searchLeft() {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.transactorOnChouse.value = that.transactorOnChouse.label;
                that.Transactor.chouseDeptName.value = that.Transactor.chouseDeptName.label
                that.handleCurrentChangeLeft(1);
                that.getSelectCharacter(1)
            } else if (that.dialogType == "Character") {
                that.characterOnChouse.value = that.characterOnChouse.label
                that.Character.chouseDeptName.value = that.Character.chouseDeptName.label
                that.handleCurrentChangeLeft(1);
                that.getSelectCharacter(1)
            }
        },
        /**
         * linkTime框ie记忆问题
         */
        changeLinkTime(val) {
            let that = this;
            that.formData.linkTime = val == "" ? "" : val;
        },
        /**
         * 搜索候选框ie记忆问题
         */
        changeInputLeft(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.transactorOnChouse.label = val == "" ? "" : val
            } else if (that.dialogType == "Character") {
                that.characterOnChouse.label = val == "" ? "" : val
            }
        },
        /**
         * 搜索已选框ie记忆问题
         */
        changeInputRight(val) {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.transactorHasChouse.label = val == "" ? "" : val
            } else if (that.dialogType == "Character") {
                that.characterHasChouse.label = val == "" ? "" : val
            }
        },
        /**
         * 搜索已选
         */
        searchRight() {
            let that = this;
            if (that.dialogType == "Transactor") {
                that.transactorHasChouse.value = that.transactorHasChouse.label
                that.handleCurrentChangeRight(1)
                that.getChousenCharacter(1)
            } else if (that.dialogType == "Character") {
                that.characterHasChouse.value = that.characterHasChouse.label
                that.handleCurrentChangeRight(1)
                that.getChousenCharacter(1)
            }
        },
        /**
         * 改动人员选项
         */
        removeTagTransator(sel) {
            let that = this;
            that.transactorDeleting = true
            var url = '/dept/user/leftRemoveLinkUserByUserAccounts';
            var param = {
                accounts: sel,
                linkId: that.uuid
            };
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                var data = res.data;
                if (res.flag) {
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
                that.transactorDeleting = false
            }, function (error) {
                that.transactorDeleting = false
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 请求初始数据
         */
        getGuideData() {
            let that = this,
                url = '/link/list',
                param = {
                    matteVersion: that.version,  // 事件版本
                    matteCode: that.code  // 事件code
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                that.guideData = data
            }, function (error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /**
         * 获取已选人员外层表格数据
         */
        getTransactorTable() {
            let that = this;
            let url = '/dept/user/getSelectedLinkUser';
            let param = {
                matteCode: that.code,  // 事件版本
                matterVersion: that.version,  // 事件code
                pageNum: that.currentPage,
                pageSize: 5,
                linkId: that.uuid,
                roleName: '',
                roleSystem: '',
                userName: "",
                userDept: "",
            }
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.Transactor.chousenCharacterShow = res.data;
                    if (that.Transactor.chousenCharacterShow.data.length > 0) {
                        for (let item of that.Transactor.chousenCharacterShow.data) {
                            item.dealUserSfzh = item.dealUserSfzh.slice(0, 6) + "********" + item.dealUserSfzh.slice(-4)
                        }
                    }

                    if (res.data.data.length == 0 && that.currentPage > 1) {
                        that.currentPage--;
                        that.getTransactorTable()
                        return
                    }
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 办理角色窗口显示
         */
        chouseCharacter() {
            let that = this;
            that.dialogType = "Character";
            setTimeout(function () {
                that.showCharacter = true;
            }, 500);
            that.getSelectCharacter(1);
            that.getChousenCharacter(1);
            let url = "/deal/role/getAllUnselectedSysName";
            let param = {
                linkId: that.uuid
            }
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = {
                    sysCode: res.data.sysCode.split(','),
                    sysName: res.data.sysName.split(','),
                }
                if (res.flag) {
                    var item = {
                        label: '',
                        value: '',
                    }
                    that.Character.deptName = [];
                    for (let i in data.sysName) {
                        item.label = data.sysName[i];
                        item.value = data.sysCode[i]
                        var deepCloneItem = JSON.parse(JSON.stringify(item))//深拷贝
                        that.Character.deptName.push(deepCloneItem)
                    }
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /**
         * 办理人窗口显示
         */
        chouseTransactor() {
            let that = this;
            that.dialogType = "Transactor";
            setTimeout(function () {
                that.showTransactor = true;
            }, 500);
            that.getSelectCharacter(1);
            that.getChousenCharacter(1);
            //获取下拉框数据
            let url = "/dept/user/getAllUnselectedDeptName";
            let param = {
                linkId: that.uuid
            }
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = {
                    deptName: res.data.deptName.split(','),
                    deptCode: res.data.deptCode.split(','),
                }
                if (res.flag) {
                    var item = {
                        label: '',
                        value: '',
                    }
                    that.Transactor.deptName = [];
                    for (let i in data.deptName) {
                        item.label = data.deptName[i];
                        item.value = data.deptCode[i]
                        var deepCloneItem = JSON.parse(JSON.stringify(item))//深拷贝
                        that.Transactor.deptName.push(deepCloneItem)
                    }
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.data.errMsg);
            }, that);
        },
        /*
         * 编辑、新增
         */
        editLinkEvt(row) {
            let that = this
            that.guideAddVis = true;
            that.Transactor.chousenCharacterShow.count = 0;
            that.Transactor.chousenCharacterShow.data = [];
            if (row) {
                that.guideTitle = '编辑环节配置';
                that.editType = 'update'
                let url = '/link/detail';
                let param = {
                    id: row.id
                };
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.formData = res.data;
                        that.formData.characterChouseShow = [{
                            label: that.formData.dealRoleName,
                            value: that.formData.dealRoleCode
                        }]
                        that.uuid = that.formData.id;
                        that.getTransactorTable();
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            } else {
                that.guideTitle = '新增环节配置';
                that.editType = 'add'
                let url = '/link/uuid'
                let param = {}
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.uuid = res.data;
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }
            let url1 = '/dic/getDictionarys';   //获取字典
            let param1 = {
                pinYinType: "HJMC"
            }
            unit.ajaxMerPost('/znsj-web' + url1, param1, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.linkNames = res.data;
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /**
         * 提交表单
         */
        editLink() {
            let that = this;
            that.$refs["guideForm"].validate((valid) => {
                if (valid) {
                    //提交的时候提交字符串
                    if (that.formData.dealUserAccount.length > 0 && Array.isArray(that.formData.dealUserAccount)) {
                        that.formData.dealUserAccount = that.formData.dealUserAccount.join(',')
                        that.formData.dealUserName = that.formData.dealUserName.join(',')
                    }
                    let obj = {
                        dealRoleCode: that.formData.dealRoleCode,//角色的id
                        dealRoleName: that.formData.dealRoleName, //角色名称
                        dealUserAccount: that.formData.dealUserAccount,    //办理人id
                        dealUserName: that.formData.dealUserName, //办理人名称
                        linkCode: that.formData.linkCode,     //当前环节code
                        lastLinkCode: that.formData.lastLinkCode,    //上一环节code
                        nextLinkCode: that.formData.nextLinkCode,    //下一环节code
                        linkTime: that.formData.linkTime,    //时限
                        matterVersion: that.version,   //  版本
                        matterCode: that.code, //code
                        id: that.uuid,   //uuid
                    };
                    if (that.editType == 'update') {
                        let url = '/link/update';
                        unit.ajaxObjPost('/znsj-web' + url, obj, function (res) {
                            res = typeof res == 'string' ? JSON.parse(res) : res;
                            let data = res.data;
                            if (res.flag) {
                                that.getGuideData()
                                that.guideAddVis = false;
                                that.isSubmit = true;
                                setTimeout(() => {    //恢复未提交的状态
                                    that.isSubmit = false;
                                }, 1000)
                            } else {
                                that.$Message.error(res.data.errMsg || '数据加载失败！');
                            }
                        }, function (error) {
                            that.$Message.error(error.data.errMsg || '数据加载失败！');
                        }, that);

                    } else if (that.editType == 'add') {
                        let url = '/link/add';
                        unit.ajaxObjPost('/znsj-web' + url, obj, function (res) {
                            res = typeof res == 'string' ? JSON.parse(res) : res;
                            let data = res.data;
                            if (res.flag) {
                                that.getGuideData()
                                that.guideAddVis = false;
                                that.isSubmit = true;
                                setTimeout(() => {    //恢复未提交的状态
                                    that.isSubmit = false;
                                }, 1000)
                            } else {
                                that.$Message.error(res.data.errMsg);
                            }
                        }, function (error) {
                            that.$Message.error(error.data.errMsg || '数据加载失败！');
                        }, that);
                    }

                } else {
                    return false;
                }
            });

        },
        /**
         * 获取删除提示
         */
        deleteCheck(row) {
            let that = this;
            let url = '/link/deleteCheck';
            let ids = "";

        },
        /**
         * 删除
         */
        deleteLink(row) {
            let that = this;
            if (!row && that.linkSels.length <= 0) {
                that.$Message.warning("请选择要删除的记录！")
                return
            }
            let url = '/link/deleteCheck';
            let ids = "";
            if (that.linkSels.length > 0) {
                for (let item of that.linkSels) {
                    ids += item.id + ','
                }
            } else {
                ids = row.id
            }
            let param = {
                ids: ids
            }
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    let url1 = '/link/delete';
                    that.$confirm(data, "提示", {
                        confirmButtonText: "确 定",
                        cancelButtonText: "取 消",
                        cancelButtonClass: 'fr ml10',
                        type: "warning"
                    })
                        .then(() => {
                            unit.ajaxMerPost('/znsj-web' + url1, param, function (res) {
                                res = typeof res == 'string' ? JSON.parse(res) : res;
                                let data = res.data;
                                if (res.flag) {
                                    that.getGuideData()
                                } else {
                                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                                }
                            }, function (error) {
                                that.$Message.error(error.data.errMsg || '数据加载失败！');
                            }, that);
                        })
                        .catch(() => { });
                } else {
                    that.$Message.error(res.data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 初始化数据
         */
        init() {
            let that = this;
            that.getGuideData();
        },
        /**
         * 清空表单
         */
        clearFormData() {
            let that = this;
            let url = "/link/cancel";//消除脏数据
            let param = {
                id: that.uuid
            }
            if (that.isSubmit == false) {
                unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        that.getGuideData()
                    } else {
                        that.$Message.error(res.data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                    that.$Message.error(error.data.errMsg || '数据加载失败！');
                }, that);
            }
            that.formData = {
                createTime: "",
                dealRoleCode: "",
                dealRoleName: "",
                dealUserAccount: "",
                dealUserName: "",
                id: "",
                isDelete: "",
                isServerConfigured: "",
                lastLinkCode: "",
                lastLinkName: '',
                linkCode: '',
                linkName: '',
                linkTime: '',
                matterCode: "",
                matterVersion: '',
                nextLinkCode: "",
                nextLinkName: '',
                userDeptCode: "",
                userDetpName: "",
            };
            that.Transactor.chousenCharacter = ""//已选中的人员数据清空
            that.Transactor.chousenCharacterShow.data = [];//已选中的人员外层表格数据清空
            that.$refs['guideForm'].resetFields();
            that.uuid = '';
            that.currentPage = 1;
        },
        /**
         * 关闭角色窗口,清空角色信息
         */
        clearCharacterData() {
            let that = this;

            //清空角色,人员的输入框,下拉框
            that.transactorOnChouse = {
                label: '',
                value: ''
            };
            that.transactorHasChouse = {
                label: '',
                value: ''
            };
            that.characterOnChouse = {
                label: '',
                value: ''
            };
            that.characterHasChouse = {
                label: '',
                value: ''
            };
            that.Transactor.chouseDeptName = {
                label: '',
                value: ''
            }
            that.Character.chouseDeptName = {
                label: '',
                value: ''
            }
            //刷新已选人员外层表格
            that.getTransactorTable();
            that.Transactor.currentPageLeft = 1;
            that.Transactor.currentPageRight = 1;
            that.Character.currentPageLeft = 1;
            that.Character.currentPageRight = 1;
            that.Character.chouseDeptName.label = '';
            that.radioOnChouse = -1;
            that.radioHasChouse = -1;
        }
    },
    mounted() {
        let that = this,
            parent;
        if (that.$parent && that.$parent.param) {
            parent = that.$parent.param;
            that.code = parent.matterCode ? parent.matterCode : '';
            that.version = parent.matterVersion ? parseFloat(parent.matterVersion) : 0;

            that.param.matterCode = that.code;
            that.param.matterVersion = that.version;
        }
        that.init();
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
.el-button {
    font-size: 14px;
}
#linkConfig {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;

    .el-select {
        width: 100%;
    }
    .el-table {
        border-top: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        overflow: hidden;
        th {
            height: 40px;
            padding: 0;
            font-weight: bold;
            color: #515a6e;
        }
    }
    .el-table__body-wrapper {
        overflow: hidden;
    }
    // 弹框样式
    .el-dialog__body {
        padding: 30px 0;
        padding-top: 0;
    }
    .el-row {
        padding: 10px 20px;
    }
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }

    .edui-editor-iframeholder {
        height: 321px !important;
    }
    // }
    // 弹框按钮样式覆盖
    .footer {
        padding: 10px 30px 0 0;
        // height: 50px;
        background: #fff;
        text-align: right;
        line-height: 50px;
        border-top: 1px solid #ddd;
    }
    .hide {
        display: none;
    }
    .editor-label {
        float: left;
        padding-right: 10px;
        width: 80px;
        height: 28px;
        line-height: 28px;
        text-align: right;
        vertical-align: top;
        .required {
            display: inline-block;
            padding: 0 3px;
            color: red;
        }
    }
    .editor-containers {
        display: inline-block;
        vertical-align: top;
        margin-bottom: 30px;
        width: 675px;
    }
    .worktime {
        width: auto !important;
    }
    .right {
        text-align: right;
        margin-bottom: 5px;
    }
    .proxy {
        border: 1px solid #ddd;
        height: 30px;
        .man {
            margin-top: 3px;
            height: 25px;
            line-height: 25px;
            position: relative;
            display: inline-block;
            padding: 0 6px;
            border-radius: 6px 6px 0 0;
            border: 1px solid #ddd;
            background: #ddd;
        }
    }
    .table-600 {
        min-height: 600px;
    }
    .switch-box {
        position: absolute;
        right: 0;
        top: 0%;
        left: auto;
        text-align: center;
        margin-top: 260px;
        .moveRight,
        .moveLeft {
            width: 38px;
            height: 38px;
            display: inline-block;
            border: 1px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
        }
        .moveRight {
            margin-top: 50%;
            margin-bottom: 10px;
            background: url(../../../assets/images/common/right-icon.png) center
                center no-repeat;
        }
        .moveLeft {
            background: url(../../../assets/images/common/left-icon.png) center
                center no-repeat;
        }
    }
    .chouse-header {
        .title {
            background: #f2f2f2;
            padding: 10px;
            border: 1px solid#E4E4E4;
        }
        .select {
            padding: 10px 5px;
            .el-input {
                width: auto;
            }
            .el-button {
                background: #137ddf;
                color: #fff;
            }
        }
    }
    .el-pagination {
        margin-top: 10px;
    }
    .border-b {
        border: 1px solid #e4e4e4;
        padding: 10px;
    }
    .no-padding {
        padding: 0;
    }
    .left {
        background: #fff;
        padding-left: 10px;
        border-right: 1px solid #ddd;
        .search-box {
            padding-top: 10px;
            div {
                display: inline-block;
                vertical-align: top;
            }
            .el-input {
                height: 34px;
                width: auto;
                input {
                    width: 107px;
                    padding: 0 5px;
                    height: 100%;
                    border-radius: 4px 0 0 4px;
                }
            }
            .el-button {
                width: 50px;
                border-left: none;
                border-radius: 0;
                height: 34px;
                padding: 0;
                background-image: url(../../../assets/images/common/search.png);
                background-position: center center;
                background-repeat: no-repeat;
                background-color: #ddd;
            }
            .out,
            .back {
                width: 15px;
                height: 15px;
                background: blue;
                margin-top: 10px;
            }
        }
        .ivu-tree {
            height: 100%;
            .ivu-tree-arrow {
                i {
                    border: 1px solid #ddd;
                    width: 14px;
                    height: 14px;
                    background: url(../../../assets/images/common/back.png)
                        center center no-repeat;
                }
                i:before {
                    content: "";
                }
            }
            .ivu-tree-arrow-open {
                i {
                    transform: none;
                    background: url(../../../assets/images/common/out.png)
                        center center no-repeat;
                }
            }
        }
    }
    .right {
        padding: 0 10px;
        .button-box {
            padding: 10px 0;
            .fr {
                float: right;
                color: #fff;
                background-color: #137ddf !important;
                border-color: #137ddf !important;
            }
        }
        .check-box {
            padding-top: 10px;
            div {
                display: inline-block;
                padding: 15px;
                background: rgba(0, 0, 0, 0.0196078431372549);
                border: 1px solid #ebebeb;
                margin-right: 10px;
                cursor: pointer;
            }
            .fff {
                background: #fff;
            }
        }
        .title {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .title-box {
            display: inline-block;
            margin-right: 30px;
            margin-top: 10px;
            font-size: 14px;
            .bolder {
                font-weight: 700;
                color: #000;
                margin-right: 10px;
            }
        }
    }
    .blue {
        color: #409eff;
    }
    //表格头颜色
    .el-table th {
        // background:#FFF;
    }
    // 分页的字体大小，间隔等
    .el-pagination__total {
        font-size: 14px;
    }
    .el-pager li {
        font-size: 14px;
        display: block;
        float: left;
        padding: 0 2px;
    }
    .el-pagination__jump {
        font-size: 14px;
        margin-left: 4px;
    }
    .el-pagination__sizes {
        margin-right: 0;
    }
    .w150 {
        width: 150px;
    }
}
.el-select-dropdown {
    max-width: 300px;
}
</style>
