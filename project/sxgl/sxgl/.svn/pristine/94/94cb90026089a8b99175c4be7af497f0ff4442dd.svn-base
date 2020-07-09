/*
 * @Author: lhqin 
 * @Date: 2018-10-12 21:17:45 
 * @Last Modified by: lhqin
 * @Last Modified time: 2018-10-23 22:09:45
 */

<template>
    <!-- 基本信息 -->
    <div id="mattInfo" class="pb10">
        <div class="base-info-wrap mt20 pt10 pr10 pl20 pb20">
            <el-form :model="ruleForm" :rules="rules" ref="mattForm" label-width="120px" class="demo-ruleForm" size="small">
                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="行政区划" prop="adminDiv">
                            <Cascader class="inline-block xzqhWt" :data="adminDivData" :load-data="xzqhLoadData" v-model="ruleForm.adminDiv" change-on-select filterable :disabled="isDisabled" :transfer="true"></Cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :push="3">
                        <el-form-item label="所属部门" prop="deptCode">
                            <el-select v-model="ruleForm.deptCode" filterable :disabled="isDisabled">
                                <el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="所属组织机构" prop="orgCode">
                            <el-select v-model="ruleForm.orgCode" filterable :disabled="isDisabled">
                                <el-option v-for="item in orgData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :push="3">
                        <el-form-item label="事项名称" prop="matterName">
                            <el-input v-model="ruleForm.matterName" maxlength="100" placeholder="请输入事项名称" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="事项编码" prop="matterCode">
                            <el-input v-model="ruleForm.matterCode" maxlength="100" placeholder="请输入事项编码" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :push="3">
                        <el-form-item label="实施清单编码" prop="ssqdCode">
                            <el-input v-model="ruleForm.ssqdCode" placeholder="请输入实施清单编码" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="事项版本号">
                            <el-input v-model="ruleForm.matterVersion" placeholder="请输入事项版本号" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9" :push="3">
                        <el-form-item label="事项分类" prop="matterClassify">
                            <el-radio-group v-model="ruleForm.matterClassify" :disabled="isDisabled">
                                <el-radio label="01">办事项</el-radio>
                                <el-radio label="02">咨询项</el-radio>
                                <el-radio label="03">预约项</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="事项类型" prop="matterType">
                            <el-select v-model="ruleForm.matterType" :disabled="isDisabled">
                                <el-option v-for="item in matterTypeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :push="3">
                        <el-form-item label="事项来源" prop="matterSource">
                            <el-radio-group v-model="ruleForm.matterSource" :disabled="isDisabled">
                                <el-radio label="01">社管自建</el-radio>
                                <el-radio label="02">权利清单</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="14" :push="1">
                        <el-form-item label="办件类型" prop="projType">
                            <el-checkbox-group v-model="ruleForm.projType" :disabled="isDisabled">
                                <el-checkbox v-for="(item,index) in projTypeData" :label="item.value" @change="checked=>handleCheck(checked,item)">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" :push="1">
                        <el-form-item label="是否下沉社区" prop="isSink">
                            <el-radio-group v-model="ruleForm.isSink" :disabled="isDisabled">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="9" :push="1">
                        <el-form-item label="法定时限" prop="legalTime">
                            <el-col :span="19" class="mr10">
                                <el-input class="mr10" v-model="ruleForm.legalTime" placeholder="请输入法定时限" :disabled="isDisabled"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <label>工作日</label>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9" :push="2">
                        <el-form-item label="承诺时限" prop="commitTime">
                            <el-col :span="19" class="mr10">
                                <el-input v-model="ruleForm.commitTime" placeholder="请输入承诺时限" :disabled="isDisabled"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <label>工作日</label>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="theme-type">
                    <el-col :span="20" :push="1">
                        <el-row>
                            <el-form-item class="mt10" label="主题类型" prop="themeType">
                                <el-checkbox-group v-model="ruleForm.themeType" :disabled="isDisabled">
                                    <el-checkbox label="个人" name="theme" @change="changeType($event,'percheck')"></el-checkbox>
                                    <el-checkbox label="法人" name="theme" @change="changeType($event,'laycheck')"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-row>
                        <div id="tipId">
                            <el-row class="mt10 person-select">
                                <el-col :span="9" :push="2">
                                    <el-form-item label="个人主题" prop="personalTheme">
                                        <el-select v-model="ruleForm.personalTheme" multiple :disabled="isDisabledPersonal">
                                            <el-option v-for="item in perThemeData" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9" :push="3">
                                    <el-form-item label="个人对象" prop="personalObject">
                                        <el-select v-model="ruleForm.personalObject" multiple :disabled="isDisabledPersonal">
                                            <el-option v-for="item in perObjectData" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="mt10 legal-select">
                                <el-col :span="9" :push="2">
                                    <el-form-item label="法人主题" prop="legalTheme">
                                        <el-select v-model="ruleForm.legalTheme" multiple :disabled="isDisabledLegal">
                                            <el-option v-for="item in legalThemeData" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9" :push="3">
                                    <el-form-item label="法人对象" prop="legalObject">
                                        <el-select v-model="ruleForm.legalObject" multiple :disabled="isDisabledLegal">
                                            <el-option v-for="item in legalObjectData" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>

                    </el-col>
                </el-row>

                <div class="mt10 tc">
                    <el-button class="w70" type="primary" size="small" :disabled="okDisabled" @click="submitForm('mattForm')">确定</el-button>
                    <el-button class="w70" size="small" :disabled="okDisabled" @click="backPage()">取消</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import unit from '@/api/index';
export default {
    data() {
        //法定时限自定义校验规则（非必填）
        var vlilegalTime = (rule, value, callback) => {
            if(value) {//有值才检验
                let reg = /^(0|([1-9]\d{0,2}))$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入0-999之间的正整数'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        //承诺时限自定义校验规则（办件类型为承诺件时必填）
        var vlilegalTime2 = (rule, value, callback) => {
            let reg = /^([\+ \-]?([1-9]\d*)|(0))([.]\d{0,1})?$/;
            if(value) {
                if (!reg.test(value)) {
                callback(new Error('请输入0-999之间的数字（小数精确到十分位）'));
                } else if (value > 999) {
                    callback(new Error('数字不大于999'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            isDisabled: false,
            isDisabledPersonal: true,
            isDisabledLegal: true,
            okDisabled: false,
            areaOption: [],

            saveXzqh: [], //暂存行政区划
            saveFlag: true, //暂存标志
            // getDetailFlag: true,//请求详细信息标志
            query:{},
            saveType: '',

            parentCode:'',//复制操作时传
            ruleForm: {//表单赋初值
                adminDiv: [],
                deptCode: '',
                orgCode: '',
                matterName: '',
                matterCode: '',
                ssqdCode: '',
                matterVersion: '1.0',
                matterClassify: '01',
                matterType: '',
                matterSource: '02',
                projType: [],
                isSink: '1',
                legalTime: '',
                commitTime: '',
                themeType: [],
                personalTheme: [],
                personalObject: [],
                legalTheme: [],
                legalObject: []
            },
            rules: {//表单校验规则
                adminDiv: [
                    { type: 'array', required: true, message: '请选择行政区划', trigger: 'change' }
                ],
                deptCode: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                orgCode: [
                    { required: true, message: '请选择所属组织机构', trigger: 'change' }
                ],
                matterName: [
                    { required: true, message: '请输入事项名称', trigger: 'blur' },
                    { max: 200, message: '长度不大于200个字符', trigger: 'blur' }
                ],
                matterCode: [
                    { required: true, message: '请输入事项编码', trigger: 'blur' }
                ],
                ssqdCode: [
                    { required: true, message: '请输入实施清单编码', trigger: 'blur' }
                ],
                matterClassify: [
                    { required: true, message: '请选择事项分类', trigger: 'change' }
                ],
                matterType: [
                    { required: true, message: '请选择事项类型', trigger: 'change' }
                ],
                matterSource: [
                    { required: true, message: '请选择事项来源', trigger: 'change' }
                ],
                projType: [
                    { required: true, message: '请勾选办件类型', trigger: 'change' }
                ],
                isSink: [
                    { required: true, message: '请选择是否下沉社区', trigger: 'change' }
                ],
                legalTime: [
                    { required: false, trigger: 'blur', validator: vlilegalTime }
                ],
                commitTime: [
                    { required: false, message: '请填写承诺时限', trigger: 'blur' },
                    { validator: vlilegalTime2, trigger: 'blur' }
                ],
                themeType: [
                    { type: 'array', required: true, message: '请至少选择一个主题类型', trigger: 'change' }
                ],
                personalTheme: [
                    { required: false, message: '请选择个人主题', trigger: 'change' }
                ],
                personalObject: [
                    { required: false, message: '请选择个人对象', trigger: 'change' }
                ],
                legalTheme: [
                    { required: false, message: '请选择法人主题', trigger: 'change' }
                ],
                legalObject: [
                    { required: false, message: '请选择法人对象', trigger: 'change' }
                ]
            },
            adminDivData: [],//行政区划
            deptData: [],//部门
            orgData: [],//所属组织机构
            perThemeData: [],//个人主题
            perObjectData: [],
            legalThemeData: [],
            legalObjectData: [],

            matterTypeData: [],//事项类型
            projTypeData: []//办件类型
        };
    },
    methods: {
        /*
        ** 行政区划改变联动部门和所属组织机构
        */
        changeXzqh(value, selectedData) {
            let _that = this;
            if(value.length === 0) {//行政区划清空时部门和机构清空
                _that.ruleForm.deptCode = '';
                _that.deptData = [];
                _that.ruleForm.orgCode = '';
                _that.orgData = [];
            } else {
                _that.ruleForm.adminDiv = value;
            }
            if(!_that.saveFlag) {
                if(_that.$route.query.type != 'detail') {
                    _that.getDeptData();//联动部门
                    _that.getOrgList();//联动所属组织机构
                }
            }
        },
        /*
        ** 提交
        */
        submitForm(formName) {
            let _that = this,
                type = _that.saveType,
                url;
            if (type === 'addNew') {//新增父项（不需ID）
                url = '/matterAllocation/addMatter';
                _that.addOrChange(formName, type, url);
            } else if (type === 'edit') {//编辑（需ID）
                url = '/matterAllocation/updateMatter';
                _that.addOrChange(formName, type, url);
            } else if (type === 'copy') {//复制（需ID，子项的复制需要父项matterCode）
                url = '/matterAllocation/addMatter';
                _that.addOrChange(formName, type, url);
            } else if (type === 'change') {//变更（需ID）
                url = '/matterAllocation/updateVersion';
                _that.addOrChange(formName, type, url);
            } else if (type === 'addChild') {//新增子项（需ID）
                url = '/matterAllocation/addMatter';
                _that.addOrChange(formName, type, url);
            }
        },
        /*
        ** 操作(请求接口)
        */
        addOrChange(formName, type, url) {
            let _that = this;
            _that.$refs[formName].validate((valid) => {
                if (valid) {
                    let formData = _that.ruleForm;
                    let projTypeArr = formData.projType.slice(','),
                        str = '';
                    for (let i = 0; i < projTypeArr.length; i++) {
                        str += projTypeArr[i] + ',';
                    }
                    let projType = str.substring(0, str.length - 1);
                    let situationMatterDto = {
                        adminDiv: formData.adminDiv[formData.adminDiv.length - 1],
                        commitTime: formData.commitTime,
                        deptCode: formData.deptCode,
                        isSink: formData.isSink,
                        legalTime: formData.legalTime,
                        matterClassify: formData.matterClassify,
                        matterName: formData.matterName,
                        matterSource: formData.matterSource,
                        matterType: formData.matterType,
                        normalCode: formData.matterCode,//事项编号
                        normalVersion: formData.matterVersion,//事项版本号
                        ssqdCode: formData.ssqdCode,//实施清单编码
                        orgCode: formData.orgCode,
                        projType: projType
                    };
                    let typeData = _that.ruleForm.themeType;
                    for (let i = 0; i < typeData.length; i++) {
                        if (typeData[i] === '个人') {
                            situationMatterDto.isPersonal = '1';
                            situationMatterDto.personalTheme = _that.ruleForm.personalTheme.join(',');
                            situationMatterDto.personalObject = _that.ruleForm.personalObject.join(',');
                        } else if (typeData[i] === '法人') {
                            situationMatterDto.isLegal = '1';
                            situationMatterDto.legalTheme = _that.ruleForm.legalTheme.join(',');
                            situationMatterDto.legalObject = _that.ruleForm.legalObject.join(',');
                        }
                    }

                    if(type === 'edit' || type === 'change') {//编辑、变更需要ID
                        situationMatterDto.id = _that.query.id;
                    } 
                    if(type === 'copy') {
                        if(_that.query.isChild === '1') {//子项复制
                            situationMatterDto.parentCode = _that.parentCode;
                        }
                    }
                    if(type === 'addChild') {//新增子项
                        situationMatterDto.parentCode = _that.query.parentCode;
                    }
                    unit.ajaxObjPost('/znsj-web' + url, situationMatterDto, function (res) {
                        if (res.flag == true) {
                            if (type === 'addNew') {
                                _that.$message.success('新增成功');
                            } else if (type === 'edit') {
                                _that.$message.success('修改成功');
                            } else if (type === 'copy') {
                                _that.$message.success('复制成功');
                            } else if (type === 'change') {
                                _that.$message.success('变更成功');
                            } else if (type === 'addChild') {
                                _that.$message.success('新增子项成功');
                            }
                            _that.$emit('getCode', {
                                normalCode: res.data.matterCode,
                                normalVersion: res.data.matterVersion
                            });
                        } else {
                            _that.$message.warning('服务端错误');
                        }
                    }, function (res) {
                        _that.$message.warning('服务端错误');
                    }, _that);
                } else {
                    return false;
                }
            });
        },
        backPage() {
            this.$router.go(-1);
        },
        /*
        ** 获取行政区划
        */
        getXzqhTreeData() {
            let _that = this,
                obj = {
                    value: _that.ruleForm.adminDiv[0]
                };
            unit.ajaxMerPost('/znsj-web/commer/getXzqhTreeData', obj, function (res) {
                if (res.flag == true) {
                    $.each(res.data, function (index, item) {
                        item.children = [];
                        item.loading = false;
                    })
                    _that.adminDivData = res.data;
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
        ** 行政区划动态加载
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
                                _that.ruleForm.adminDiv = _that.saveXzqh;
                                _that.getDeptData();//获取部门
                                _that.getOrgList();//获取所属组织机构字典
                                _that.saveFlag = false;
                            },0);
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
        ** 获取事项类型
        */
        getSXLXData() {
            let _that = this,
                obj = {
                    pinYinType: 'SXLX'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    _that.matterTypeData = res.data;
                    if (res.data.length === 0) {
                        _that.rules.matterType = [];
                    }
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取办件类型
        */
        getBJLXData() {
            let _that = this,
                obj = {
                    pinYinType: 'BJLX'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    _that.projTypeData = res.data;
                    $.each(res.data, function (index, item) {
                        if (item.label === '承诺件') {
                            _that.ruleForm.projType = [item.value];
                            _that.rules.commitTime[0].required = true;
                        }
                    })
                    if (res.data.length === 0) {
                        _that.rules.projType = [];
                    }
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取所属组织机构
        */
        getOrgList() {
            let _that = this,
                obj = {
                    adminDiv: _that.ruleForm.adminDiv[_that.ruleForm.adminDiv.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getOrgList', obj, function (res) {
                if (res.flag == true) {
                    _that.orgData = res.data;
                    _that.ruleForm.orgCode = '';
                    if (res.data.length === 0) {
                        _that.rules.orgCode = [];
                    } else {
                        _that.rules.orgCode.push({ required: true, message: '请选择所属组织机构', trigger: 'change' });
                    }
                    _that.getMattInfo();//此处调用详情，防止覆盖返回的数据           
                    // _that.saveFlag = false;
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 根据type相应操作
        */
        getMattInfo() {
            let _that = this;
            _that.query = _that.$route.query;
            _that.saveType = _that.query.type;
            let type = _that.saveType;
            let obj = {
                    id: _that.query.id
                };
            if (type === 'detail') {//查看
                _that.isDisabled = true;
                _that.okDisabled = true;
                _that.rules = {};
                _that.getDetailById(obj);
            } else if (type === 'edit') {//编辑
                _that.getDetailById(obj);
            } else if (type === 'copy') {//复制(能编辑)
                _that.getDetailById(obj);
            } else if (type === 'change') {//变更
                _that.getDetailById(obj);
            } else if (type === 'addChild') {//新增子项
                _that.ruleForm.matterSource = '01';
                _that.getDetailById(obj);
            }
        },
        /*
        ** 获取个人主题
        */
        getGRZTData() {
            let _that = this,
                obj = {
                    pinYinType: 'GRZT'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    _that.perThemeData = res.data;
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取个人对象
        */
        getGRDXData() {
            let _that = this,
                obj = {
                    pinYinType: 'GRDX'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    _that.perObjectData = res.data;
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取法人主题
        */
        getFRZTData() {
            let _that = this,
                obj = {
                    pinYinType: 'FRZT'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    _that.legalThemeData = res.data;
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取法人对象
        */
        getFRDXData() {
            let _that = this,
                obj = {
                    pinYinType: 'FRDX'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                let data = res.data;
                _that.legalObjectData = data;
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 主题类型勾选样式和规则处理
        */
        changeType($event, str) {
            let _that = this;
            if ($event) {//勾选
                if (str === 'percheck') {//勾选了个人
                    this.isDisabledPersonal = false;
                    _that.rules.personalTheme[0].required = true;
                    _that.rules.personalObject[0].required = true;
                } else {//勾选了法人
                    this.isDisabledLegal = false;
                    _that.rules.legalTheme[0].required = true;
                    _that.rules.legalObject[0].required = true;
                }
            } else {//取消勾选
                if (str === 'percheck') {//取消个人
                    this.isDisabledPersonal = true;
                    _that.rules.personalTheme[0].required = false;
                    _that.rules.personalObject[0].required = false;
                } else {//取消法人
                    this.isDisabledLegal = true;
                    _that.rules.legalTheme[0].required = false;
                    _that.rules.legalObject[0].required = false;
                }
            }
        },
        /*
        ** 办件类型为“承诺件”时承诺时限必填
        */
        handleCheck(checked,item) {
            let _that = this;
            if(item.label === '承诺件') {
                if(checked) {
                    _that.rules.commitTime[0].required = true;
                } else {
                    _that.rules.commitTime[0].required = false;
                }
            } 
        },
        /*
        ** 根据id获取事项信息
        */
        getDetailById(obj) {
            let _that = this;
            unit.ajaxMerPost('/znsj-web/matterAllocation/getInfo', obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.parentCode = data.parentCode;//复制操作会传

                    _that.ruleForm.adminDiv = [data.adminDiv];
                    _that.ruleForm.deptCode = data.deptCode;
                    _that.ruleForm.orgCode = data.orgCode;
                    _that.ruleForm.matterName = data.matterName;
                    _that.ruleForm.matterCode = data.matterCode;
                    _that.ruleForm.ssqdCode = data.ssqdCode;
                    _that.ruleForm.matterVersion = data.matterVersion;
                    _that.ruleForm.matterClassify = data.matterClassify;
                    _that.ruleForm.matterSource = data.matterSource;
                    _that.ruleForm.matterType = data.matterType;
                    _that.ruleForm.isSink = data.isSink;
                    _that.ruleForm.projType = data.projType.split(',');
                    _that.ruleForm.legalTime = data.legalTime;
                    _that.ruleForm.commitTime = data.commitTime;
                    if (data.isPersonal === '1') {
                        _that.ruleForm.themeType.push('个人');
                    }
                    if (data.isLegal === '1') {
                        _that.ruleForm.themeType.push('法人');
                    }

                    if (_that.saveType != 'detail' && _that.saveType != 'addNew') {
                        if (data.isPersonal === '1') {
                            _that.isDisabledPersonal = false;
                        }
                        if (data.isLegal === '1') {
                            _that.isDisabledLegal = false;
                        }
                    }
                    _that.ruleForm.personalTheme = data.personalTheme.split(',');
                    _that.ruleForm.personalObject = data.personalObject.split(',');
                    _that.ruleForm.legalTheme = data.legalTheme.split(',');
                    _that.ruleForm.legalObject = data.legalObject.split(',');
                    // _that.getDetailFlag = false;//请求详情标志，防止行政区划联动时部门和所属机构被渲染
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        /*
        ** 获取部门
        */
        getDeptData() {
            let _that = this,
                obj = {
                    adminDiv: _that.ruleForm.adminDiv[_that.ruleForm.adminDiv.length - 1]
                };
            unit.ajaxMerPost('/znsj-web/commer/getDeptList', obj, function (res) {
                if (res.flag == true) {
                    _that.deptData = res.data;
                    _that.ruleForm.deptCode = '';
                    if (res.data.length === 0) {
                        _that.rules.deptCode = [];
                    } else {
                        _that.rules.deptCode.push({ required: true, message: '请选择部门', trigger: 'change' });
                    }
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
            let _that = this,
                obj = {
                    pinYinType: 'XZQH'
                };
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', obj, function (res) {
                if (res.flag == true) {
                    let data = res.data;
                    _that.saveXzqh = [data[0].value, data[1].value]; //暂存行政区划，供后面调用
                    _that.ruleForm.adminDiv = [data[0].value, data[1].value];
                } else {
                    _that.$message.warning('服务端错误');
                }
            }, function (res) {
                _that.$message.warning('服务端错误');
            }, _that);
        },
        init() {
            let _that = this;
            _that.getXzqhTreeData();//获取行政区划
            _that.getSXLXData();//获取事项类型
            _that.getBJLXData();//获取办件类型
            _that.getGRZTData();//获取个人主题字典
            _that.getGRDXData();//获取个人对象字典
            _that.getFRZTData();//获取法人主题字典
            _that.getFRDXData();//获取法人对象字典
            // 解决ie兼容性问题 requestAnimationFrame
            unit.solveAnimFrame();
        },
        disa() {
            let _that = this;
            _that.isDisabled = true;
            _that.okDisabled = true;
            _that.isDisabledPersonal = true;
            _that.isDisabledLegal = true;
            _that.rules = {};
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#mattInfo {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: 0;
    .el-form-item__content .el-input--small {
        width: 100% !important;
    }

    .xzqhWt {
        width: 96.3%;
    }

    .theme-type {
    }
}
</style>

