/*
 * @Author: lhqin 
 * @Date: 2018-10-12 22:18:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-26 21:04:28
 */

<template>
    <!-- 基本信息 -->
    <div id="configInfo" class="pt30 pb20">
            <!-- 受理条件配置 -->
            <div class="config-title">
                <p class="title-left inline-block">
                    <Icon class="title-icon" type="ios-pricetags-outline" />
                    <span>受理条件配置</span>
                </p>
                <p class="btn-groups inline-block mt15 mr10 fr" v-if="operType !== 'detail'">
                    <el-button type="text" @click="editEvent('', '1')">新增</el-button>
                    <el-button type="text" @click="deleteEvt('', '1')">删除</el-button>
                </p>
            </div>
            <!-- 受理条件列表 -->
            <div class="list-wrap mt10">
                <el-table :data="acceConData" border @selection-change="acceConSelectChange">
                    <el-table-column align="center" type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="judgeCond" label="判断条件">
                    </el-table-column>
                    <el-table-column prop="judgeStd" label="判断标准">
                    </el-table-column>
                    <el-table-column label="操作" width="190" v-if="operType !== 'detail'">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editEvent(acceConData[scope.$index].id, '1')">编辑</el-button>
                            <el-button type="text" size="small" @click="deleteEvt(acceConData[scope.$index].id, '1')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!-- 新增受理条件弹框 -->
            <el-dialog :title="accConFormTitle" :visible.sync="acceConAddVis">
                <el-form :model="condFormData" :rules="condRules" ref="condForm" label-width="100px" class="demo-ruleForm" :label-position="labelPosition" size="mini">
                    <el-form-item label="判断条件" prop="judgeCond">
                        <el-input type="textarea" v-model="condFormData.judgeCond" placeholder="请输入判断条件" maxlength="500"></el-input>
                    </el-form-item>
                    <el-form-item label="判断标准" prop="judgeStd">
                        <el-input type="textarea" v-model="condFormData.judgeStd" placeholder="请输入判断标准" maxlength="500"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveFormData('condForm', '1')">确 定</el-button>
                        <el-button @click="acceConAddVis = false">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>  


            <!-- 删除提示框 -->
            <el-dialog
                title="删除"
                :visible.sync="deleteVis"
                width="30%"
               >
                <span>{{delPromTips}}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteVis = false">取 消</el-button>
                    <el-button type="primary" @click="sureDelEvt">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 原始材料配置 -->
            <div class="config-title mt25">
                <p class="title-left inline-block">
                    <Icon class="title-icon" type="ios-pricetags-outline" />
                    <span>原始材料配置</span>
                </p>
                <p class="btn-groups inline-block mt15 mr10 fr" v-if="operType !== 'detail'">
                    <el-button type="text" @click="editEvent('', '2')">新增</el-button>
                    <el-button type="text" @click="deleteEvt('', '2')">删除</el-button>
                </p>
            </div>

            <!-- 原始材料配置列表 -->
            <div class="list-wrap mt10">
                <el-table :data="originData" border @selection-change="originSelectChange">
                    <el-table-column align="center" type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="orginName" label="原始材料">
                    </el-table-column>
                    <el-table-column label="操作" width="190" v-if="operType !== 'detail'">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editEvent(originData[scope.$index].id, '2')">编辑</el-button>
                            <el-button type="text" size="small" @click="deleteEvt(originData[scope.$index].id, '2')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 新增原始材料弹框 -->
            <el-dialog :title="oriFormTitle" :visible.sync="originAddVis" width="65%">
                <el-form :model="oriMaterFormData" :rules="originMaterRules" ref="originMateForm" label-width="120px" :label-position="labelPosition" size="mini">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="原始材料名称" prop="orginName">
                                <el-input v-model="oriMaterFormData.orginName" placeholder="请输入原始材料名称" maxlength="1200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-checkbox class="mr20" v-model="originChecked" v-if="orgiAddFlag">创建另一个</el-checkbox>
                        <el-button type="primary" @click="saveFormData('originMateForm', '2')">确 定</el-button>
                        <el-button @click="originAddVis = false">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 颗粒化材料配置 -->
            <div class="config-title mt25">
                <p class="title-left inline-block">
                    <Icon class="title-icon" type="ios-pricetags-outline" />
                    <span>颗粒化材料配置</span>
                </p>
                <p class="btn-groups inline-block mt15 mr10 fr" v-if="operType !== 'detail'">
                    <el-button type="text" @click="editEvent('', '3')">新增</el-button>
                    <el-button type="text" @click="deleteEvt('', '3')">删除</el-button>
                </p>
            </div>

            <!-- 颗粒化材料配置列表 -->
            <div class="list-wrap mt10">
                <el-table :data="tinyData" border @selection-change="tinySelectChange" :span-method="mergeSpanRow">
                    <el-table-column align="center" type="selection" width="55">
                    </el-table-column>
                    <el-table-column align="center" prop="orignalName" label="原始材料" width="180">
                    </el-table-column>
                    <el-table-column align="center" prop="name" label="颗粒化材料">
                    </el-table-column>
                    <el-table-column align="center" prop="isNeed" label="必要性">
                    </el-table-column>
                    <el-table-column align="center" prop="fileTypeName" label="材料形式及份数">
                    </el-table-column>
                    <el-table-column align="center" prop="typeText" label="材料类型">
                    </el-table-column>
                    <el-table-column label="操作" width="190" v-if="operType !== 'detail'">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="upSortEvt(tinyData[scope.$index].id)">上移</el-button>
                            <el-button type="text" size="small" @click="downSortEvt(tinyData[scope.$index].id)">下移</el-button>
                            <el-button type="text" size="small" @click="editEvent(tinyData[scope.$index].id, '3')">编辑</el-button>
                            <el-button type="text" size="small" @click="deleteEvt(tinyData[scope.$index].id, '3')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 新增颗粒化材料弹框 -->
            <el-dialog :title="tinyFormTitle" :visible.sync="tinyAddVis" width="65%">
                <el-form :model="tinyMaterFormData" :rules="tinyMaterRules" ref="tinyForm" label-width="120px" class="demo-ruleForm" :label-position="labelPosition" size="mini">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="原始材料名称" prop="orignalCode">
                                <el-select placeholder="请选择" v-model="tinyMaterFormData.orignalName" @change="orignNCChange">
                                    <el-option
                                        v-for="item in originOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="颗粒化材料名称" prop="name">
                                <el-input v-model="tinyMaterFormData.name" placeholder="请输入颗粒化材料名称" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :push="1">
                            <el-form-item label="材料形式" prop="form">
                                <el-checkbox-group v-model="tinyMaterFormData.form" :min="1">
                                    <el-checkbox v-for="item in formOption" :label="item" :key="item">{{item}}</el-checkbox>
                                </el-checkbox-group>   
                            </el-form-item>
                        </el-col>   
                    </el-row>
                    
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="原件份数" prop="originalNum">
                                <el-input v-model="tinyMaterFormData.originalNum" placeholder="请输入原件份数"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :push="1">
                            <el-form-item label="复印件份数" prop="copiesNum">
                                <el-input v-model="tinyMaterFormData.copiesNum" placeholder="请输入复印件份数"></el-input>
                            </el-form-item>
                        </el-col>   
                    </el-row>

                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="材料类型" prop="type">
                                <el-select placeholder="请选择" v-model="tinyMaterFormData.type">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :push="1">
                            <el-form-item label="材料类型版本" prop="version">
                                <el-select placeholder="请选择" v-model="tinyMaterFormData.version">
                                    <el-option
                                        v-for="item in versionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>   
                    </el-row>

                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="必要性" prop="isNeed">
                                <el-select placeholder="请选择" v-model="tinyMaterFormData.isNeed">
                                    <el-option
                                        v-for="item in needOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :push="1">
                            <el-form-item label="需要纸质材料" prop="paperNeed">
                                <el-radio v-model="tinyMaterFormData.paperNeed" label="1">是</el-radio>
                                <el-radio v-model="tinyMaterFormData.paperNeed" label="0">否</el-radio>
                            </el-form-item>
                        </el-col>   
                    </el-row>

                    <el-row>
                        <el-form-item label="上传文件格式" prop="fileType">
                            <el-checkbox-group v-model="tinyMaterFormData.fileType" @change="fileTypeChange" :min="1">
                                <el-checkbox v-for="item in fileTypeOptions" :label="item" :key="item">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    

                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="材料大小" prop="matterialSize" required>
                                <el-input v-model="tinyMaterFormData.matterialSize" placeholder="请输入材料大小"></el-input>
                                
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <span style="padding-left: 10px;height: 30px; line-height: 30px;">MB</span>
                        </el-col>
                        <el-col :span="10" :push="1">
                            <el-form-item label="关联组" prop="asscGroup">
                                <el-select placeholder="请选择" v-model="tinyMaterFormData.asscGroup">
                                    <el-option
                                        v-for="item in asscGroupOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>   
                    </el-row>

                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="材料来源" prop="source">
                                <el-input v-model="tinyMaterFormData.source" placeholder="请输入材料来源" maxlength="200"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="详细要求" prop="owner">
                                <el-input type="textarea" v-model="tinyMaterFormData.owner" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="材料持有者" prop="owerner">
                                <el-input v-model="tinyMaterFormData.owerner" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="材料显示条件" prop="showCondition">
                                <el-input v-model="tinyMaterFormData.showCondition" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row>
                        <el-col :span="22   ">
                            <el-form-item label="OCR比例映射" prop="ocrMapper">
                                <el-input v-model="tinyMaterFormData.ocrMapper" maxlength="500"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-checkbox class="mr20" v-model="tinyChecked" v-if="tinyAddFlag">创建另一个</el-checkbox>
                        <el-button type="primary" @click="saveFormData('tinyForm', '3')">确 定</el-button>
                        <el-button @click="tinyAddVis = false">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            
    </div>
</template>

<script>
import unit from "@/api";   // 公共工具方法
export default {
    data() {
        // 数值 0 - 10 验证方法 
        let validateNum = (rule, value, callback) => {
            if(value) {
                let rule =  /^(([1-9]|10){1})$/;
                if(!rule.test(value)) {
                    callback(new Error('请输入1到10的数字'));
                }else {
                    callback();
                }
            }
        },
        validateMaterSize = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入材料大小'));
            } else {
                let rule =  /^(([0-9]|10){1})$/;
                if(!rule.test(value)) {
                    callback(new Error('请输入0到10的数字'));
                }else {
                    callback();
                }
            }
        };
        return {
            version: 1.0,
            code: 'cssx1', // 默认值 测试用
            operType: '',  // 操作类型

            acceConAddVis: false,  // 受理条件 新增弹框 显示/隐藏标志位
            deleteVis: false, // 受理条件 删除弹框 显示/隐藏标志位
            originAddVis: false,  // 原始材料- 新增弹框
            tinyAddVis: false,  // 颗粒化新增显示标志位
            
            acceConSelectdArr: [],  // 前置删除选中项 id
            originSelectedArr: [],  // 原始材料删除选中项 id
            tinySelectedArr: [],  // 颗粒化材料删除选中项 id

            acceConData: [],   // 前置条件数据
            originData: [],  // 原始材料数据
            tinyData: [], // 颗粒化数据

            accConFormTitle: '新增受理条件',
            oriFormTitle: '新增原始材料',
            tinyFormTitle:'新增颗粒化材料',
            orgiAddFlag: true,
            tinyAddFlag: true,

            allFlag: '0',  // 0：单选 1：全选
            curId: '',  // 当前被操作事项id  存储 删除 编辑项
            delPromTips: '确定删除该记录？',  // 删除提示语
            delPropType: '',  // 删除弹框类型 1：受理条件弹框  2：原始材料弹框 3：颗粒化材料弹框
            // 受理条件表单数据
            condFormData: {
                judgeCond: '',
                judgeStd: '',
                id: ''
            },
            // 原始材料表单数据
            oriMaterFormData: {
                orginName : '', // 原始材料名称
                id: ''  // 原始材料id
            },
            // form: [], // 材料形式
            // fileType: [],  // 上传文件格式
            // 颗粒化材料
            tinyMaterFormData: {
                orignalCode: '',
                orignalName : '', // 原始材料名称 下拉框 
                name: '', // 颗粒化材料名称
                form: [],  // 材料形式
                originalNum: '',  // 原件份数
                copiesNum: '',  // 复印件份数
                type: '',  // 材料类型
                version: '1',// 材料类型版本  暂时没这个字段 默认取1.0
                isNeed: '',// 必要性
                paperNeed: '',// 是否需要纸质材料
                fileType: ['txt','doc','docx','xls','xlsx','jpg','jpeg','gif','png','bmp','pdf','wps'], // 上传文件格式  默认全选
                matterialSize: 10,  // 材料大小 不确定该字段是否为 材料大小  默认10
                asscGroup: '0', // 关联组
                source: '',  // 材料来源
                detail: '', // 详细要求
                owner: '',// 材料持有者  暂无此字段
                showCondition: '',// 材料显示条件
                ocrMapper: ''// OCR比例映射
            },
            originChecked: true,  // 原始材料
            tinyChecked: true,  // 颗粒化材料
            
            // 受理表单条件验证规则
            condRules: {
                judgeCond: [
                    { required: true, message: '请填写判断条件', trigger: 'blur' },
                    { min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ],
                judgeStd: [
                    { required: true, message: '请填写判断标准', trigger: 'blur' },
                    { min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ]
            },

            // 原始材料表单验证规则
            originMaterRules: {
                orginName: [
                    { required: true, message: '请填写原始材料名称', trigger: 'blur' },
                    { min: 0, max: 1200, message: '长度在 0 到 1200 个字符', trigger: 'blur' }
                ]
            },

            // 颗粒化材料表单验证
            tinyMaterRules: {
                orignalCode: [
                    { required: true, message: '请选择原始材料名称', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请填写颗粒化材料名称', trigger: 'blur' },
                    { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
                ],
                form: [
                    { required: true, message: '请选择材料形式', trigger: 'blur' }
                ],
                originalNum: [  // 数值 0 10 
                    {validator: validateNum,  trigger: 'blur' }
                ],
                copiesNum: [ // 数值 0 10 
                    {validator: validateNum, trigger: 'blur' }
                ],
                isNeed: [
                    { required: true, message: '请选择必要性', trigger: 'change' }
                ],
                paperNeed: [
                    { required: true, message: '请选择是否需要纸质材料', trigger: 'change' }
                ],
                fileType: [
                    { required: true, message: '请选择上传文件格式', trigger: 'blur' }
                ],
                matterialSize: [  // 数值  0 - 10
                    { validator: validateMaterSize, trigger: 'blur' }
                ],
                asscGroup: [
                    { required: true, message: '请选择关联组', trigger: 'change' }
                ],
                detail: [  
                    { min: 0, max: 200, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ],
                owner: [ // 验证规则待定
                    { min: 0, max: 200, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ],
                showCondition: [
                    { min: 0, max: 200, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ],
                ocrMapper: [
                    { min: 0, max: 200, message: '长度在 0 到 500 个字符', trigger: 'blur' }
                ]
            },

            // 原始材料下拉框数据
            originOptions: [],

            // 材料形式 '电子件','原件','复印件'
            formOption: [],

            // 对象键值对的形式
            formOptions:[],

            // 材料类型 下拉框数据
            typeOptions: [],

            // 材料版本 下拉框数据
            versionOptions: [{
                label: '1.0',
                value: '1'
            }],

            // 文件格式
            fileTypeOptions: ['txt','doc','docx','xls','xlsx','jpg','jpeg','gif','png','bmp','pdf','wps'],
            // 必要性下拉数据
            needOptions: [],
            // 有无关联组
            asscGroupOptions: [],
            labelPosition: 'right'
            
        };
    },
    methods: {
        /*
         * 获取受理条件、原始材料、颗粒化材料数据信息
         * type: 1: 受理条件 材料类型 2： 原始材料 3：颗粒化材料
         */ 
        getCondMaterData(type) {
            let that = this, 
                url,
                param;
            if(type === '1') {
                url = '/conditon/getAllByMatter';
            }else if(type === '2') {
                url = '/matterial/getOriginMatterialByMatteId';
            }else if(type === '3') {
                url = '/matterial/getMatterialByMatteId';
            }
            param = {
                matteVersion: that.version, //1.0,
                matteCode: that.code //'cssx1'   
            };
            unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    if(type === '1') {
                        that.acceConData = [];
                        for(let i in data) {
                            that.$set(that.acceConData, i, data[i]); 
                        }
                    }else if(type === '2') {
                        that.originData = [];
                        for(let i in data) {
                            that.$set(that.originData, i, data[i]); 
                        }
                    }else if(type === '3') {
                        that.tinyData = [];
                        for(let i in data) {
                            data[i].fileTypeName = '原件' + data[i].originalNum + '份，' + '复印件' + data[i].copiesNum + '份';
                            if(data[i].isNeed === '0') {
                                data[i].isNeed = '非必要';
                            }else if(data[i].isNeed === '1') {
                                data[i].isNeed = '必要';
                            }else if(data[i].isNeed === '2') {
                                data[i].isNeed = '后补容缺';
                            }
                            that.$set(that.tinyData, i, data[i]); 
                            // // 材料类型 文本转换
                            // for(var j in that.typeOptions) {
                            //     if(data[i].type === that.typeOptions[j].value) {
                            //         data[i].type = that.typeOptions[j].label;
                            //     }
                            // }
                        }
                        that.calcRow();  //合并颗粒化材料的行  遍历数据
                    }
                }else {
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        /*
         * 获取受理条件数据
         */ 
        getOriMaterText() {
            let that = this;
            unit.ajaxMerPost('/znsj-web/matterial/getOriginMatterialText', {
                matteVersion: that.version, //1.0,
                matteCode: that.code //'cssx1'   
            }, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    that.originOptions = [];
                    for(let i in data) {
                        that.originOptions = data;
                    }
                }else {
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        /*
         * 编辑 新增点击事件
         * id有值就是编辑 为空为新增
         * type(事项类型):1:条件 2： 原始材料 3： 颗粒化材料
         */ 

        editEvent(id, type) {  
            let that = this,
                url;
                that.curId = id; 
            if(id) {  // 根据id获取数据
                if(type === '1') {
                    that.accConFormTitle = '编辑受理条件';
                    that.acceConAddVis = true;
                    url = '/conditon/getConditionInfo';
                }else if(type === '2') {
                    that.oriFormTitle = '编辑原始材料';
                    that.orgiAddFlag = false;
                    that.originAddVis = true;
                    url = '/matterial/getOriginMatterialInfo';
                }else if(type === '3') {
                    that.tinyFormTitle = '编辑颗粒化材料';
                    that.tinyAddVis = true;
                    that.tinyAddFlag = false;
                    url = '/matterial/getMatterialInfo';
                    that.getOriMaterText();  // 刷新原始材料下拉框数据
                }
                unit.ajaxMerPost('/znsj-web' + url, {
                    id: id
                },function(res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if(res.flag) {
                        if(type === '1') {
                            for(var key in data) {
                                that.condFormData[key] = data[key];
                            }
                        }else if(type === '2') {
                            for(var key in data) {
                                that.oriMaterFormData[key] = data[key];
                            }
                        }else if(type === '3') {
                            for(var key in data) {
                                if(key !== 'form' && key !== 'fileType') {
                                    that.tinyMaterFormData[key] = data[key];
                                    // that.tinyMaterFormData.fileType = [];
                                } 
                            }
                            // 上传文件格式转换
                            that.tinyMaterFormData.fileType = [];
                            if(data.fileType) {
                                let fileArr = data.fileType.split(',');
                                for(var i in fileArr) {
                                    that.$set(that.tinyMaterFormData.fileType, i, fileArr[i]);
                                }
                            }else {
                                that.$set(that.tinyMaterFormData.fileType, i, fileArr[0]);
                            }
                            // 材料形式格式转换
                            that.tinyMaterFormData.form = [];
                            let formOptions = that.formOptions;
                            if(data.form) {
                                let arr = data.form.split(',');
                                for(let i in arr) {
                                    for(let j in formOptions) {
                                        if(arr[i] === formOptions[j].value) {
                                            that.tinyMaterFormData.form.push(formOptions[j].label)
                                        }
                                    }
                                    // that.tinyMaterFormData.form.push(that.formOption[arr[i]]);
                                } 
                            }else {
                                that.tinyMaterFormData.form.push(formOptions[0].label);
                            }
                            // that.tinyMaterFormData.asscGroup = '1';  // 测试数据
                        }
                    }else {
                        that.$Message.error(data.data || '数据加载失败！');
                    }
                },function(error) {
                    that.$Message.error('数据加载失败！');
                }, that);
            }else {
                if(type === '1') {
                    that.accConFormTitle = '新增受理条件';
                    that.acceConAddVis = true;
                    // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
                    if (that.$refs['condForm'] !== undefined) {
                        that.$refs['condForm'].resetFields(); 
                        for(var key in that.condFormData) {
                            that.condFormData[key] = '';
                        }
                    }
                }else if(type === '2') {
                    that.oriFormTitle = '新增原始材料';
                    that.originAddVis = true;
                    that.orgiAddFlag = true;
                    that.originChecked = true;
                    // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
                    if (that.$refs['originMateForm'] !== undefined) {
                         that.$refs['originMateForm'].resetFields(); 
                        for(var key in that.oriMaterFormData) {
                            that.oriMaterFormData[key] = '';
                        }
                    }
                   
                }else if(type === '3') {
                    that.tinyFormTitle = '新增颗粒化材料';                    
                    that.tinyAddVis = true;
                    that.tinyAddFlag = true;
                    that.tinyChecked = true;
                    // 刷新原始材料下拉框数据
                    that.getOriMaterText();  
                    // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
                    if (that.$refs['tinyForm'] !== undefined) {
                        that.$refs['tinyForm'].resetFields();  
                        for(var key in that.tinyMaterFormData) {
                            let val = that.tinyMaterFormData[key];
                            if(key !== 'fileType' && key !== 'matterialSize') {
                                if(val instanceof Array) { 
                                        that.$set(that.tinyMaterFormData, key, []);
                                }else { // 数组
                                    that.$set(that.tinyMaterFormData, key, "");
                                }
                            }
                            
                        }
                    }
                }
            }
        },
        /*
         * 保存原始材料
        */
        saveFormData(formName, type) {
            var that = this,
                url,
                param;
            that.$refs[formName].validate((valid) => {
                if(!valid) {
                    return;
                }
                // that.saveData(url,param,type);
                let that = this;
                if(type === '1') {
                    url = that.curId ? '/conditon/updateCondition' : '/conditon/addCondition';
                    param = that.condFormData;
                    param.situationMattCode = that.code;  //  事项版本 
                    param.situationMattVerison = that.version;  // 事项code
                }else if(type === '2') {
                    url = that.curId ? '/matterial/updateOriginMatterial' : '/matterial/addOriginMatterial';
                    param = that.oriMaterFormData;
                    param.matterVersion = that.version; //1.0;  //  事项版本 
                    param.matterCode = that.code;  //'cssx1';  // 事项code
                    
                }else if(type === '3') {
                    if(that.tinyMaterFormData.form.length === 0) {
                        that.$Message.warning('请选择材料形式');
                        return;
                    }
                    if(that.tinyMaterFormData.fileType.length === 0) {
                        that.$Message.warning('请选择上传文件格式');
                        return;
                    }
                    url = that.curId ? '/matterial/editMatterial' :  '/matterial/addMatterial';
                    param = $.extend({}, that.tinyMaterFormData);
                    // param = that.tinyMaterFormData;
                    param.matterVersion = that.version; //1.0;  //  事项版本 
                    param.matterCode = that.code;  //'cssx1';  // 事项code

                    let fileTypeData = that.tinyMaterFormData.fileType;
                    if(fileTypeData.length > 0) {
                        param.fileType = fileTypeData.join(',');
                    }
                    // 材料形式格式转换
                    let formData = that.tinyMaterFormData.form,
                        formOptions = that.formOptions;
                    if(formData.length > 0) {
                        let arr = [];
                        for(let i in formData) {
                            for(let j in formOptions) {
                                if(formData[i] === formOptions[j].label) {
                                    arr.push(formOptions[j].value);
                                }
                            }
                            // let index = that.formOption.indexOf(formData[i]);
                            // arr.push(index + 1);
                        }
                        param.form = arr.join(',');
                    }
                }
                if(type === '3') {
                    // if(that.curId) {  // 表单形式 json对象 编辑
                    //     param.id = that.curId;  // 记录id
                    //     that.saveJsonType(url, param, type); 
                    // }else {  // json字符串形式 添加
                    //     that.saveObjType(url, param, type);  
                    // } 
                    param.id = that.curId;  // 记录id
                    that.saveJsonType(url, param, type); 
                }else {
                    if(that.curId) {  // 受理条件 表单形式 json对象 编辑
                        param.id = that.curId;  // 记录id
                        that.saveObjType(url, param, type); 
                    }else {  // 受理条件 新增 json 字符串
                        that.saveJsonType(url, param, type); 
                    }
                }
            });
        },
        /*
         * 保存数据json字符串形式 编辑
         * id: 记录id
         * type(事项类型):1:条件 2： 原始材料 3： 颗粒化材料
         */
        saveJsonType(url, param, type) {
            let that = this;
            unit.ajaxPost('/znsj-web' + url ,param).then(function(res){
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(data.flag) {
                    that.$Message.success(data.data || '保存成功！');
                    if(type === '1'){
                        that.acceConAddVis = false;
                    }else if(type === '2') {
                        that.originAddVis = that.originChecked ? true: false;
                    }else if(type === '3') {
                        that.tinyAddVis = that.tinyChecked ? true: false;
                    }
                    // 刷新数据
                    that.getCondMaterData(type);
                }else {
                    that.$Message.warning(data.errMsg || '保存失败!');
                }
            }).catch(function(error){
                that.$Message.error('数据加载失败！');
            });

        },
        /*
         * 保存数据json对象形式 添加
         * id: 记录id
         * type(事项类型):1:条件 2： 原始材料 3： 颗粒化材料
         */
        saveObjType(url, param, type) {
            let that = this;
            unit.ajaxMerPost('/znsj-web' + url, param, function(res) {
                res = typeof res === 'string' ? JSON.parse(res) : res;
                if(res.flag) {
                    that.$Message.success(res.data || '保存成功！');
                    if(type === '1'){
                        that.acceConAddVis = false;
                    }else if(type === '2') {
                        that.originAddVis = that.originChecked ? true: false;
                    }else if(type === '3') {
                        that.tinyAddVis = that.originChecked ? true: false;
                    }
                    // 刷新数据
                    that.getCondMaterData(type); 
                }else {
                    
                    that.$Message.warning(data.errMsg || '保存失败!');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);

        },

        /*
         * 删除  弹框触发事件
         * id: 记录id
         * type(事项类型):1:条件 2： 原始材料 3： 颗粒化材料
         */
        deleteEvt(id, type) {  
            let that = this,
                idData;
            that.delPropType = type;
            that.curId = id;
            if(id) {
                that.allFlag = '0';
                that.delPromTips = '确定删除该记录？';
            }else {
                that.allFlag = '1';
                if(type === '1') {
                    idData = that.acceConSelectdArr;
                }else if(type === '2') {
                    idData = that.originSelectedArr;
                }else if(type === '3') {
                    idData = that.tinySelectedArr;
                }
                if(idData.length == 0) {
                    that.$Message.warning('请选择要删除的记录！');
                    return;
                }else {
                    that.delPromTips = '确定要删除选中的记录吗？';
                    that.curId = idData.join(',');
                }
            }
            that.deleteVis = true;
        },
        /*
         * 确定删除选中记录项
         */
        sureDelEvt() {
            let that = this,
                type = that.delPropType,
                url,  // 接口请求地址
                param;
            if(type === '1') {
                url = '/conditon/deleteCondition';
                param = {
                    ids: that.curId
                };
            }else if(type === '2') {
                url = '/matterial/deleteOriginMatterial';
                param = {
                    id: that.curId
                };
            }else if(type === '3') {
                url = '/matterial/deleteMatterial';
                param = {
                    id: that.curId
                };
            }
            unit.ajaxMerPost('/znsj-web' + url , param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    that.deleteVis = false;
                    // 刷新数据
                    that.getCondMaterData(type);  
                }else {
                    that.deleteVis = false;
                    that.$Message.error(data.data || '数据加载失败！');
                }
            },function(error) {
                that.deleteVis = false;
                that.$Message.error('数据加载失败！');
            }, that);
        },
        /*
         * 上移
         * id: 记录id
         */ 
        upSortEvt(id) {
            let that = this,
                url;
            unit.ajaxMerPost('/znsj-web/matterial/upSort', {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    // 重新渲染材料列表数据
                    that.getCondMaterData('3');
                }else {
                    that.$Message.error(data.errMsg || '已经是最高层！');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        /*
         * 下移
         * id: 记录id
         */ 
        downSortEvt(id) {
            let that = this,
                url;
            unit.ajaxMerPost('/znsj-web/matterial/downSort', {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    // 重新渲染材料列表数据
                    that.getCondMaterData('3');
                }else {
                    that.$Message.error(data.errMsg || '已经是最低层!');
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },

        /*
         * 受理条件table复选框chang事件
         */ 
        acceConSelectChange(val) {
            let that = this;
            that.acceConSelectdArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.acceConSelectdArr.push(val[i].id);
                }
            }
        },
        /*
         * 原始材料table复选框chang事件
         */ 
        originSelectChange(val) {
            let that = this;
            that.originSelectedArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.originSelectedArr.push(val[i].id);
                }
            }
        },
        /*
         * 颗粒化材料材料table复选框chang事件
         */ 
        tinySelectChange(val) {
            let that = this;
            that.tinySelectedArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.tinySelectedArr.push(val[i].id);
                }
            }
        },
        /*
         * 原始材料编码获取
         */
        orignNCChange(val) {
            let that = this,
            obj = that.originOptions.find((item)=>{
                //筛选出匹配数据 
                return item.value === val; 
            });  
            that.tinyMaterFormData.orignalCode = val;
            that.tinyMaterFormData.orignalName = obj.label;
        },
        /*
         * 合并颗粒化材料的行 
         * 原始材料名一致时合并
         * 遍历表格数据   最终输出的结果为 spanArr = [3, 0, 0, 2, 0, 0......]的形式，
         * 3代表当前单元格合并多少行， 0代表不合
         */ 
        calcRow() {
            let contactDot = 0,
                that = this;
            that.spanArr = [];
            that.tinyData.forEach((item, index) => {
                item.index = index;
                if (index === 0) {
                    that.spanArr.push(1);
                } else {
                    // 原始材料名一致时合并
                    if (item.orignalName === that.tinyData[index - 1].orignalName) {
                        that.spanArr[contactDot] += 1;
                        that.spanArr.push(0);
                    } else {
                        that.spanArr.push(1);
                        contactDot = index;
                    }
                }
            });
        },
        /*
         * 合并颗粒化材料的行 
         */ 
        mergeSpanRow({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        /*
         * 获取字典项公共方法
         */ 
        getDicData(param, success) {
            let that = this;
            unit.ajaxMerPost('/znsj-web/dic/getDictionarys', {pinYinType: param}, function(res) {
                res = typeof res === 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if(res.flag) {
                    if(data && data.length > 0) {
                        success && success(data);
                    } 
                }else {
                    that.$Message.error(res.data || '数据加载失败!');
                }
            },function(error) {
                that.$Message.error('数据加载失败！！');
            }, that);
        },
        /*
         * 获取各种字典项
         */ 
        getSumDictionary() {
            let that = this;
            // 获取材料类型字典项 
            that.getDicData('CLLX', function(data) {
                that.typeOptions = [];
                for(var i in data) {
                    that.$set(that.typeOptions, i, data[i]);
                }      
            });

            // 获取材料形式
            that.getDicData('CLXS', function(data) {
                that.formOption = [];  // 选中数组形式
                that.formOptions = []; // 键值对形式
                for(var i in data) {
                    that.$set(that.formOptions, i, data[i]);
                    that.$set(that.formOption, i, data[i].label);
                }
            });

            // 有无关联组
            that.getDicData('YWGLZ', function(data) {
                that.asscGroupOptions = [];
                for(var i in data) {
                    that.$set(that.asscGroupOptions, i, data[i]);
                }
            });

            // 必要性
            that.getDicData('CLBYX', function(data) {
                that.needOptions = [];
                for(var i in data) {
                    that.$set(that.needOptions, i, data[i]);
                }
            });
        },
        
        /*
         *  初始化页面数据
         */
        init() {
            let that = this;
            that.getOriMaterText();  // 颗粒化材料中的 原始材料下拉框数据
            that.getSumDictionary();  // 获取材料类型字典项
            that.getCondMaterData('1');
            that.getCondMaterData('2');
            that.getCondMaterData('3');   
        },
        backEvt() {
            this.$router.go(-1);
        },
        fileTypeChange(val) {
            let that = this;
        }

    },
    mounted: function () {
        let that = this,
            query,
            parent;
        if(that.$route && that.$route.query) {
            query = that.$route.query;
            that.code = query.matteCode ? query.matteCode : '';
            that.version = query.matteVersion ? parseFloat(query.matteVersion) : 0;
            that.operType = query.type;
        }
        if(that.$parent && that.$parent.param && !that.version && !that.code){
            parent = that.$parent.param;
            that.code = parent.matteCode ? parent.matteCode : '';
            that.version = parent.matteVersion ? parseFloat(parent.matteVersion) : 0;
        }
        that.init();
    }
};
</script>
<style lang="less">
.v-modal {
    z-index: 999 !important;
}
#configInfo {
    overflow-y: auto;
    padding: 15px;
    height: 100%;
    background-color: #fff;
    // 弹框头部样式覆盖
    .el-dialog__header {
        background-color: #1255B3;
    }
    .el-dialog__header .el-dialog__title, 
    .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
    }
    .el-dialog__body {
        padding: 10px 10px 20px 10px;
        color: #606266;
        font-size: 14px;
    }
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    
    // 配置标题样式覆盖
    .config-title {
        height: 35px;
        font-size: 14px;
        font-weight: 1000;
        vertical-align: middle;
        .title-icon {
            font-size: 18px;
            color: #333;
            vertical-align: top;
        }
        span {
            vertical-align: middle;
        }
        .btn-groups {
            font-size: 14px;
        }
    }
    .title-left{
        .t-div {
            display: inline-block;
            width: 7px;
            height: 100%;
            background-color: #078fea;
            vertical-align: middle;
        }
    } 
    .a-color-red {
        a {
            color: #288ff4;
        }
    }

    // 选择下拉框样式修改
    .el-select {
        width: 235px !important;
    }
}
</style>
