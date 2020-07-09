<template>
    <div id="featureConfig">
        <!-- 要素配置列表 -->
        <div class="list-wrap">
            <el-table :data="featureData" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="expandChange" @selection-change="guideSelChange" @sort-change='sortChange'>
                <el-table-column class="font-max" align="center" type="selection" width="55">
                </el-table-column>
                <!-- 展收 start-->
                <el-table-column type="expand" prop="elementDetailDtos" label="展/收" width="55">
                    <template scope="scope">
                        <div class="btn-wrap">
                            <span class="btn-sure font-min" @click="goServerConfig('moreChild', scope.row, true)">服务配置</span>
                            <span class="btn-del font-min" @click="delEvtChild(scope.$index, scope.row)">删除</span>
                        </div>
                        <!-- 子项列表 -->
                        <el-table :data="scope.row.elementDetailDtos" tooltip-effect="light" @selection-change="eleDetailSelChange">
                            <el-table-column class="font-max" align="center" type="selection" width="55"><!--  :selectable='selectInit' -->
                            </el-table-column>
                            <el-table-column class="font-max" align="center" label="序号" type="index">
                            </el-table-column>
                            <el-table-column class="font-max" class-name="el-tooltip" width="110" align="center" prop="elementName" label="要素名称">
                                <template scope="scope">
                                    <span class="tip-title el-tooltip cell" :title="scope.row.elementName">{{scope.row.elementName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class="font-max" class-name="el-tooltip" width="110" align="center" prop="elementCode" label="要素标识">
                                <template scope="scope">
                                    <span class="tip-title el-tooltip cell" :title="scope.row.elementCode">{{scope.row.elementCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class="font-max" align="center" prop="dataName" label="数据类型">
                            </el-table-column>
                            <el-table-column class="font-max" class-name="el-tooltip" align="center" prop="dataLength" label="长度">
                                <template scope="scope">
                                    <span class="tip-title el-tooltip cell" :title="scope.row.dataLength">{{scope.row.dataLength}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class="font-max" align="center" prop="isRequiredName" label="必填">
                            </el-table-column>
                            <el-table-column class="font-max" align="center" width="90" prop="controlTypeName" label="控件类型">
                            </el-table-column>
                            <el-table-column class="font-max" class-name="el-tooltip" width="110" align="center" prop="defaultValue" label="默认值">
                                <template scope="scope">
                                    <span class="tip-title el-tooltip cell" :title="scope.row.defaultValue">{{scope.row.defaultValue}}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column class="font-max" align="center" prop="guideTitle" label="服务类型">
                            </el-table-column> -->
                            <el-table-column class="font-max" align="center" width='110' label="服务配置">
                                <template scope="scope">
                                    <a v-show="scope.row.isServerConfigured==1" href="javascript:void(0);" class="mattLink" @click="goServerConfig('child',scope.row,true)">已配置</a>
                                    <a class="noServer" v-show="scope.row.isServerConfigured==0" href="javascript:void(0);" @click="goServerConfig('child',scope.row,false)">未配置</a>
                                    <a class="ml5 reset" href="javascript:void(0);" :disabled="scope.row.isServerConfigured==0?true:false" @click="resetServercongfig('function',scope.row)">重置</a>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width='100' v-if="operType !== 'detail'">
                                <template slot-scope="scope">
                                    <el-button class="font-max" type="text" size="small" 
                                    :disabled="scope.row.isServerConfigured==1 || scope.row.isForbid==1?true:false" 
                                    @click="editEleDetailevt(scope.$index, scope.row)">编辑</el-button>
                                    <!--  -->
                                    <el-button class="font-max" type="text" size="small" :disabled="scope.row.isForbid==1?true:false" @click="delEvtChild(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table> 
                    </template>
                </el-table-column>
                <!-- 展收 end -->
                <el-table-column class="font-max" align="center" prop="linkName" label="环节名称" sortable='custom'>
                </el-table-column>
                <el-table-column class="font-max" align="center" prop="elementName" label="要素分类">
                </el-table-column>
                <el-table-column class="font-max" class-name="el-tooltip" align="center" prop="formCode" label="表单编码">
                    <template scope="scope">
                        <span class="tip-title el-tooltip cell" :title='scope.row.formCode'>{{scope.row.formCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="font-max" align="center" label="服务配置">
                    <template scope="scope">
                        <a v-show="scope.row.isServerConfigured==1" href="javascript:void(0);" class="mattLink" @click="goServerConfig('parent',scope.row,true)">已配置</a>
                        <a class="noServer" v-show="scope.row.isServerConfigured==0" href="javascript:void(0);" @click="goServerConfig('parent',scope.row,false)">未配置</a>
                        <a class="ml10 reset" href="javascript:void(0);" :disabled="scope.row.isServerConfigured=='0'?true:false" @click="resetServercongfig('data',scope.row)">重置</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200" v-if="operType !== 'detail'">
                    <template slot-scope="scope">
                        <el-button class="font-max" type="text" size="small" @click="addEvtChild(featureData[scope.$index].id, scope.row)">添加要素</el-button>
                        <el-button class="font-max" type="text" size="small" :disabled="scope.row.isServerConfigured==1 ?true:false" @click="editFatEvent(featureData[scope.$index].id, scope.$index)">编辑</el-button>
                        <el-button class="font-max" type="text" size="small" @click="delFatEvt(scope.row,featureData[scope.$index].id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页
            <div class="block fr mt15">
                <el-pagination :total="featureTotal" :page-size="featurePageSize" @size-change="featureSizeChange" @current-change="featureCurrentChange" :current-page="featureCurPage" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div> -->
        </div>
        <!-- 新增/编辑 要素分类 -->
        <el-dialog :title="featureTitle" :visible.sync="featureAddVis" @closed="clearValidate" width="800px" height="600px" :close-on-click-modal="false">
            <el-form :model="fatFormData" :rules="featureRules" ref="fatForm" label-width="85px" :label-position="labelPosition" size="small">
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="环节名称" prop="linkCode">
                            <el-select v-model="fatFormData.linkCode" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in linkCodeGroup" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="要素分类" prop="elementType">
                            <el-select v-model="fatFormData.elementType" filterable placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in elementTypeGroup" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item class="font-min" label="表单编码" prop="formCode">
                            <el-input class="font-min" v-model.trim="fatFormData.formCode" placeholder="请填写表单编码" maxlength='50' @change="changeFormCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="footer">
                    <el-button type="primary" size="small" @click="saveFormData('fatForm')">确 定</el-button>
                    <el-button size="small" @click="featureAddVis = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 添加要素 -->
        <el-dialog :title="batchAddTitle" :visible.sync="batchAddModal" width="1100px" custom-class="batch-dialog" :close-on-click-modal="false">
            <div class="batch-list-wrap">
                <el-table :data="mattObj.mattChildData">
                    <el-table-column class="font-max" align="left" label="要素名称">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.elementName" placeholder="请输入" maxlength='50' @change="changeEleName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="要素标识">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.elementCode" placeholder="请输入" maxlength='50' @change="changeEleCode"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="数据类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.dataType" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in dataTypeSelect" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="长度">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.dataLength" maxlength='9' placeholder="请输入" @change="changeDataLength"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="必填">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.isRequired" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in fatRequiredSec" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="控件类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.controlType" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in controlTypeSec" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="left" label="默认值">
                        <template slot-scope="scope">
                            <el-input class="" v-model.trim="scope.row.defaultValue" placeholder="请输入" maxlength="50" @change="changeDafulatVal"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" align="center" width="80" label="操作">
                        <template slot-scope="scope">
                            <el-button class="font-max" type="text" size="small" @click="delEditDetail(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="btn-add-wrap">
                    <Button type="dashed" size="large" icon="md-add" @click="addBatchAnsEvt">添加</Button>
                </div>
            </div>
            <div class="footer">
                <el-button type="primary" size="small" @click="sureChildEvt()">确 定</el-button>
                <el-button size="small" @click="batchAddModal = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 编辑要素 -->
        <el-dialog :title="eleDetailTitle" :visible.sync="eleDetailModal" @closed="clearValidate" width="800px" height="600px" :close-on-click-modal="false">
            <el-form :model="eleFormItemData" :rules="eleChildRules" ref="eleFormItem" label-width="85px" :label-position="labelPosition" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="要素名称" prop="elementName">
                            <el-input class="font-min" v-model.trim="eleFormItemData.elementName" maxlength='50' @change="changeEleName2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="要素标识" prop="elementCode">
                            <el-input class="font-min" v-model.trim="eleFormItemData.elementCode" maxlength='50' @change="changeEleCode2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="数据类型" prop="dataType">
                            <el-select v-model="eleFormItemData.dataType" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in dataTypeSelect" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="长度" prop="dataLength">
                            <el-input class="font-min"  maxlength='9' v-model.trim="eleFormItemData.dataLength" @change="changeDataLength2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="控件类型" prop="controlType">
                            <el-select v-model="eleFormItemData.controlType" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in controlTypeSec" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="必填" prop="isRequired">
                            <el-select v-model="eleFormItemData.isRequired" placeholder="请选择" :popper-append-to-body="false">
                                <el-option v-for="item in fatRequiredSec" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="font-min" label="默认值">
                            <el-input class="font-min" v-model.trim="eleFormItemData.defaultValue" maxLength="50" @change="changeDafulatVal2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="footer">
                    <el-button type="primary" size="small" @click="saveFormData('eleFormItem')">确 定</el-button>
                    <el-button size="small" @click="eleDetailModal = false">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 配置事项 -->
        <el-dialog :title="modelTitle" :visible.sync="modelFlag" width="1270px" :close-on-click-modal="false">
            <dataServerSetModel v-if="modelFlag" ref='modelFlag' @closeDialog="closeDialog" :param="param"></dataServerSetModel>
        </el-dialog>

        <!-- 配置事项 -->
        <el-dialog :title="modelFunTitle" :visible.sync="modelFunFlag" width="1270px" :close-on-click-modal="false">
            <functionServerSetModel v-if="modelFunFlag" ref='modelFunFlag' @closeDialog="closeDialog" :param="funParam"></functionServerSetModel>
        </el-dialog>
    </div>
</template>

<script>
import unit from "@/api";   // 公共工具方法
import util from "@/api/index";
import dataServerSetModel from "@/components/serverSet/dataServerSetModel";
import functionServerSetModel from "@/components/serverSet/functionServerSetModel";
export default {
    components: {
        dataServerSetModel: dataServerSetModel,
        functionServerSetModel: functionServerSetModel
    },
    data() {
        // 长度校验
        let dataLengthRules = (rule, value, callback) => {
            var that = this;
            if(value===""){
                callback();
            }else{
                let rule = /^([1-9]\d*|0)$/;
                if (!rule.test(value)) {
                     callback(new Error("长度请输入整型数值"));
                } else {
                    callback();
                }
            }
        };
        return { // 列表数据
            featureData: [{
                guideTitle: ''  // 名称
            }],
            value: '',
            sortOrder: '',//表格排序

            // 列表展收*******
            // 获取row的key值
            getRowKeys(row) {
                return row.id;
            },
            // 要展开的行，数值的元素是row的key值
            expands: [],
            parentId: '',

            // 新增
            featureTitle: '新增要素分类',
            linkCodeGroup: [],//环节名称字典项
            elementTypeGroup: [],//要素分类

            dataTypeSelect: [],//数据类型
            fatRequiredSec: [],//必填
            controlTypeSec: [],//控件类型

            // 分页
            // featureTotal: 0,//事项列表总条数
            // featureCurPage: 1,//事项列表当前页
            // featurePageSize: 10,//事项列表每页条数

            //添加要素弹框
            addModalChild: false,
            batchAddTitle: '添加要素',
            batchAddModal: false,
            curClassifyCode: '',
            curClassifyName: '',
            mattObj: {
                mattChildData: []
            },
            // 子项数据
            elementDetailDtos: [],

            notSaveFlag: false,//是否保存
            featureAddVis: false, // 新增环节配置弹框标志位 
            notSaveChildData: [],//未保存数据

            // 编辑子项
            eleDetailTitle: '编辑要素',
            eleDetailModal: false,
            eleFormItemData: [],
            // dataLengthRule: false,

            eleChildRules: {
                elementName: [
                    { required: true, message: '请填写要素名称', trigger: 'blur' },
                    // { min: 0, max: 50, message: '长度不大于50字符', trigger: 'blur' }
                ],
                elementCode: [
                    { required: true, message: '请填写要素标识', trigger: 'blur' },
                    // { min: 0, max: 50, message: '长度不大于50字符', trigger: 'blur' }
                ],
                dataType: [
                    { required: true, message: '请选择数据类型', trigger: 'change' },
                ],
                controlType: [
                    { required: true, message: '请选择控件类型', trigger: 'change' },
                ],
                isRequired: [
                    { required: true, message: '请选择必填', trigger: 'change' },
                ],
                dataLength: [
                    {
                        required: false,
                        validator: dataLengthRules,
                        trigger: "change"
                    },
                    {min:0,max:9,message: '长度不大于9字符',trigger:'change'}
                ],
            },


            // 测试数据
            version: 1.1,
            code: 'px-s2e-s',
            // eventId: '',  // 一件事id

            operType: '', // 操作类型
            curId: '',  // 当前被操作事项id  存储 删除 编辑项
            guideSeldArr: [],  // 要素父表格删除选中项 id
            selEleName:[],//要素父表批量删除选中项 要素名称
            eleDetailSeldArr: {},// 要素子表格删除选中项 
            // 新增/编辑 要素分类
            fatFormData: {
                linkCode: '',//环节名称
                elementType: '',//要素分类
                formCode:''//表单编码
            },
            // 要素验证规则
            featureRules: {
                linkCode: [
                    { required: true, message: '请选择环节名称', trigger: 'change' },
                ],
                elementType: [
                    { required: true, message: '请选择要素分类', trigger: 'change' }
                ],
                formCode:[
                    { required: true, message: '请填写表单编码', trigger: 'blur' },
                    { pattern:/^[\w]+$/,message:'请输入数字或英文',trigger:'change'},
                ]
            },
            labelPosition: 'right',

            modelFlag: false,
            modelTitle: '数据服务配置',
            param: {

            },

            modelFunFlag: false,
            modelFunTitle: '功能服务配置',
            funParam: {

            }
        };

    },
    methods: {
        // ie记忆功能
        changeFormCode(val) {
            this.fatFormData.formCode = val == '' ? '' : val;
        },
         // 清空表单校验
        clearValidate: function() {
			if (this.$refs["fatForm"]) {
				this.$refs["fatForm"].clearValidate();              
            }
           if (this.$refs["eleFormItem"]) {
				this.$refs["eleFormItem"].clearValidate();              
            }
		},
        // 子要素 批量删除不可勾选 
//         selectInit(row,index){
//             if(row.isForbid==1){
//                 return false  //不可勾选
//             }else{    
//                 return true  //可勾选
//             }
//         },
        //服务配置
        goServerConfig(type, row, flag) {
            if (type == 'moreChild') {
                let that = this,
                    idData = [],
                    nameData = [],
                    name = '',
                    ids = '',
                    parentId;
                if (row.elementDetailDtos) {//批量配置
                    parentId = row.id;
                    if ($.isEmptyObject(that.eleDetailSeldArr)) {
                        that.$Message.warning('请选择要配置的要素！');
                        return;
                    } else {
                        for (let key in that.eleDetailSeldArr) {
                            if (row.id == key) {
                                for (var i = 0; i < that.eleDetailSeldArr[key].length; i++) {
                                    idData.push(that.eleDetailSeldArr[key][i].id);
                                    nameData.push(that.eleDetailSeldArr[key][i].elementName);
                                }
                                ids = idData.join(',');
                                name = nameData.join('、');
                            }
                        }
                        if (idData.length == 0) {
                            that.$Message.warning('请选择要配置的要素！');
                            return;
                        }
                    }
                }
                this.funParam.dataTemplateId = row.id;
                this.funParam.linkId = row.id;
                this.funParam.tempAttrId = ids;
                this.funParam.templateType = '3';
                this.funParam.isMult = 1;
                if(idData.length == 1) {
                    this.funParam.isMult = 0;
                }
                this.funParam.name = name;
                this.modelFunFlag = true;
            } else if (type == 'parent') {
                this.param.dataTemplateId = row.id;
                this.param.linkId = row.id;
                this.param.templateType = '3';
                this.param.flag = flag;
                this.param.name = '';
                this.modelFlag = true;
            } else {
                this.funParam.dataTemplateId = row.elementId;
                this.funParam.linkId = row.elementId;
                this.funParam.tempAttrId = row.id;
                this.funParam.templateType = '3';
                this.funParam.isMult = 0;
                this.funParam.name = row.elementName;
                this.modelFunFlag = true;
            }
        },
        //关闭弹框
        closeDialog() {
            this.getElementData(this.sortOrder);
            this.modelFlag = false;
            this.modelFunFlag = false;
        },
        // 重置服务
        resetServercongfig(serveType,row){
            let that = this,
                param,url,
                id = row.id;
             that.$confirm('确定要清除已配置的服务吗？', '提示', {
                cancelButtonText: '取 消',
                confirmButtonText: '确 定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                if(serveType == 'data'){//数据服务
                    url = '/data/server/clean';
                    param = {
                        dataTemplateId: null,   //数据模板null 
                        linkId: id,//要素分类id
                        templateType: "3"//1:环节 2：受理条件 3:要素配置 4:材料 
                    };
                }else{//功能服务
                    url = '/funtion/server/clean';
                    param = {
                        dataTempAttrId: id,// 要素详情id
                        dataTempId: null,
                        linkId: row.parentId,//要素分类id
                        funType: "3"//1:环节 2：受理条件 3:要素配置
                    };
                }   
                that.sureResetEvt(url,param);
            }).catch(() => {

            });
        },
         /*
        * 确定重置服务
        * 
        */
        sureResetEvt(url, param) {
            let that = this;
                // type = that.delPropType;
            unit.ajaxObjPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.$Message.success('重置成功');
                   // 刷新数据
                    that.getElementData(that.sortOrder);
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);
        },
        //  /*
        // ** 分页 每页显示数据量变更
        // */
        // featureSizeChange: function (val) {
        //     let _that = this;
        //     _that.featurePageSize = val;
        //     _that.featureCurPage = 1;
        //     _that.getElementData();
        // },
        // /*
        // ** 列表页码变更
        // */
        // featureCurrentChange: function (val) {
        //     let _that = this; 
        //     _that.featureCurPage = val;
        //     _that.getElementData();
        // },

        changeEleName(val) {
            this.mattObj.mattChildData.elementName = val == '' ? '' : val;
        },
        changeEleCode(val) {
            this.mattObj.mattChildData.elementCode = val == '' ? '' : val;
        },
        changeDataLength(val) {
            this.mattObj.mattChildData.dataLength = val == '' ? '' : val;
        },
        changeDafulatVal(val) {
            this.mattObj.mattChildData.defaultValue = val == '' ? '' : val;
        },
        changeEleName2(val) {
            this.eleFormItemData.elementName = val == '' ? '' : val;
        },
        changeEleCode2(val) {
            this.eleFormItemData.elementCode = val == '' ? '' : val;
        },
        changeDataLength2(val) {
            this.eleFormItemData.dataLength = val == '' ? '' : val;
        },
        changeDafulatVal2(val) {
            this.eleFormItemData.defaultValue = val == '' ? '' : val;
        },
        // table 展收
        expandChange(row, expandedRows) {
            let that = this;
            for(let key in that.eleDetailSeldArr){
                if(key == row.id){
                    that.eleDetailSeldArr[key] = [];
                }
            }
             // 子表ie11下title过长显示不全
            setTimeout(() => {
                let tips = $('.tip-title');
                $(tips).each(function (index, obj) {
                    if (tips.eq(index).html().length > 9) {
                        tips.eq(index).tipTip();
                    }
                });
            },100);

        },
        // 获取字典项
        getDictionarys(pinyin) {
            let that = this,
                url = '/dic/getDictionarys',
                param = {
                    pinYinType: pinyin
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    if (pinyin === 'HJMC') {
                        that.linkCodeGroup = data;
                    } else if (pinyin === 'bsxbdlx') {
                        that.elementTypeGroup = data;
                    } else if (pinyin === 'yssjlx') {
                        that.dataTypeSelect = data;
                    } else if (pinyin === 'BT') {
                        that.fatRequiredSec = data;
                    } else if (pinyin === 'KJLX') {
                        that.controlTypeSec = data;
                    }
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 编辑、新增 要素分类
         */
        editFatEvent(id) {
            let that = this,
                url;
            that.getDictionarys('HJMC');
            that.getDictionarys('bsxbdlx');
            that.curId = id;
            if (id) {  // 根据id获取数据
                url = '/element/getElementsInfo';
                that.featureAddVis = true;
                that.featureTitle = '编辑要素分类';
                unit.ajaxMerPost('/znsj-web' + url, {
                    id: id
                }, function (res) {
                    res = typeof res == 'string' ? JSON.parse(res) : res;
                    let data = res.data;
                    if (res.flag) {
                        setTimeout(function () {
                            for (var key in data) {
                                that.fatFormData[key] = data[key];
                            }
                            // that.$refs.UE.setContent(data.guideDsc);
                        }, 300);
                    } else {
                        that.$Message.error(data.errMsg || '数据加载失败！');
                    }
                }, function (error) {
                     that.$Message.error(error.errMsg || '数据加载失败！');
                }, that);
            } else {
                that.featureTitle = '新增要素分类';
                that.featureAddVis = true;
                that.clearFormData();
            }
        },
        /*
         * 清空表单数据
         */
        clearFormData() {
            let that = this;
            // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
            if (that.$refs['fatForm'] !== undefined) {
                that.$refs['fatForm'].resetFields();
                that.fatFormData.linkCode = '';
                that.fatFormData.elementType = '';
                that.fatFormData.formCode = ''
                // that.$refs.UE.setContent('');
            }
        },
        /*
         * 保存要素分类,子要素
         */
        saveFormData(formName) {
            var that = this,
                url,
                param;
            that.$refs[formName].validate((valid) => {
                if (!valid) {
                    return;
                }
                let that = this;
                if (formName == 'eleFormItem') {
                    url = '/elementDetail/updateElementDetail';
                    param = that.eleFormItemData;
                } else {
                    url = that.curId ? '/element/updateElements' : '/element/addElement';
                    param = that.fatFormData;
                }
                param.matterVersion = that.version
                param.matterCode = that.code;
                param.id = that.curId ? that.curId : null;
                param.type = that.$parent.guideType;
                that.saveJsonType(url, param);
            });
        },
        
        /*
         * 保存数据json字符串形式 编辑
         * id: 记录id
         * type (string, optional): 事件类型：1:事项 2：一件事
         */

        saveJsonType(url, param) {
            let that = this;
            //     rule = /^[1-9]\d*$/;
            // if (that.eleFormItemData.dataLength && !rule.test(that.eleFormItemData.dataLength)) {
            //     that.dataLengthRule = true;
            //     return;
            // } else {
            //     that.dataLengthRule = false;
            // }
            unit.ajaxPost('/znsj-web' + url, param).then(function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (data.flag) {
                    that.$Message.success(data.data || '保存成功！');
                    that.featureAddVis = false;
                    that.eleDetailModal = false;
                    // 清空表单数据
                    that.clearFormData();
                    // 刷新数据
                    that.getElementData(that.sortOrder);
                } else {
                    that.$Message.error(data.errMsg || '信息保存失败!');
                }
            }).catch(function (error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            });
        },
        /*
        * 请求数据列表数据--父表格
        * type请求数据类别： 1： 流程配置 2：指南配置
        */
        getElementData(sortOrder) {
            let that = this,
                url = '/element/getAllElementList',
                param = {
                    matterVersion: that.version,  // 事件版本
                    matterCode: that.code,  // 事件code
                    isSortFlag: sortOrder
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.featureData = [];
                    for (let i in data) {
                        for (let j in data[i].elementDetailDtos) {
                            data[i].elementDetailDtos[j].parentId = data[i].id;
                        }
                        that.$set(that.featureData, i, data[i]); 
                    }
                    // ie11下title过长显示不全
                    setTimeout(() => {
                        let tips = $('.tip-title');
                        $(tips).each(function (index, obj) {
                            if (tips.eq(index).html().length > 4) {
                                tips.eq(index).tipTip();
                            }
                        });
                    }, 100);
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);

        },

        // 环节名称排序
        sortChange(column) {
            let that = this;
            if (column.order) {
                that.sortOrder = column.order;
            } else {
                that.sortOrder = "";
            }
            that.getElementData(that.sortOrder);
        },
        /*
        * 删除  弹框触发事件
        * id: 记录id
        */
        delFatEvt(row,id) {
            let that = this,
                idData, tips = '确定要删除这条记录吗？';
            that.curId = id;
            if (id) {
                //that.delPromTips = '确定要删除这条记录吗?';
                let arr = [];
                $.each(row.elementDetailDtos,function(i,item){
                    if(item.isServerConfigured==1){
                        arr.push(item)
                    }
                })
                if(row.isServerConfigured==1 ||row.isServerConfigured==0 && arr.length !=0){//要素分类已配置 或 子要素已配置
                    tips = '该要素分类或其子要素有绑定的服务，确定要删除吗？'
                }else {
                    tips = '确定要删除这条要素分类及其子要素吗？'
                }
                // row.isServerConfigured==1? tips = '该要素分类或其子要素有绑定的服务，确定要删除吗？':tips = '确定要删除这条要素分类及其子要素吗？';
                // tips = '确定要删除这条记录吗？';

            } else {
                idData = that.guideSeldArr;
                if (idData.length == 0) {
                    that.$Message.warning('请选择要删除的记录！');
                    return;
                } else {
                    // tips = "确定删除选中的记录吗？";
                    if(that.selEleName.length !=0){
                        tips = that.selEleName.join('，') +"要素分类或其子要素有绑定的服务，确定删除选中的记录吗？"
                    }else{
                        tips = "确定删除选中的记录吗？"
                    }
                    that.curId = idData.join(',');
                }
            }
            that.$confirm(tips, '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                let url = '/element/deleteElements';  // 接口请求地址
                that.sureDelEvt(url, '1');

            }).catch(() => {

            });
        },
        // 删除子分类
        delEvtChild(index, row) {
            let that = this,
                idData = [], tips = '确定要删除这条记录吗?',
                parentId;
            if (row.elementDetailDtos) {//批量删除
                parentId = row.id;
                if ($.isEmptyObject(that.eleDetailSeldArr)) {
                    that.$Message.warning('请选择要删除的记录！');
                    return;
                } else {
                    let selEleChildName= [];
                    let isForbidSel = [];
                    for (let key in that.eleDetailSeldArr) {
                        if (row.id == key) { 
                            for (var i = 0; i < that.eleDetailSeldArr[key].length; i++) {
                                idData.push(that.eleDetailSeldArr[key][i].id);
                                if(that.eleDetailSeldArr[key][i].isServerConfigured == '1'){
                                    selEleChildName.push(that.eleDetailSeldArr[key][i].elementName)
                                }
                                if(that.eleDetailSeldArr[key][i].isForbid==1){
                                    isForbidSel.push(that.eleDetailSeldArr[key][i].elementName)
                                }

                            }
                            if(isForbidSel.length==0){
                                that.curId = idData.join(',');
                                if(selEleChildName.length == 0){
                                    tips = "确定删除选中的记录吗？";
                                }else{
                                    tips = selEleChildName.join('，')+"要素有绑定的服务，确定删除选中的记录吗？";
                                }
                            }else{
                                // tips = isForbidSel.join('，')+"要素不能删除,请重新确认！";
                                that.$Message.warning(isForbidSel.join('，')+"要素不能删除,请重新确认！");
                                return;
                            }
                            
                        }
                    }
                    if (idData.length == 0) {
                        that.$Message.warning('请选择要删除的记录！');
                        return;
                    }
                }
            } else {
                parentId = row.parentId;
                if(row.isServerConfigured == '1'){
                    tips = "该要素有绑定的服务，确定要删除吗？"
                }else{
                    tips = '确定要删除这条记录吗？'
                }
                that.curId = row.id;
            }
            that.$confirm(tips, '提示', {
                cancelButtonText: '取 消',
                confirmButtonText: '确 定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                let url = '/elementDetail/deleteElementDetail';
                that.sureDelEvt(url, '2');
            }).catch(() => {

            });
            // 展开当前编辑项
            this.expands = [];
            this.expands.push(parentId);
        },

        /*
        * 确定删除选中记录项
        * 
        */
        sureDelEvt(url, delType) {
            let that = this,
                type = that.delPropType,
                param = {
                    ids: that.curId
                };
            unit.ajaxMerPost('/znsj-web' + url, param, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    // that.deleteVis = false;
                    if (delType == '1') {//删除父事项
                        // 刷新数据
                        that.getElementData(that.sortOrder);
                    } else if (delType == '2') {
                        // 刷新数据
                        that.getElementData(that.sortOrder);
                    }
                } else {
                    //  that.deleteVis = false;
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                //  that.deleteVis = false;
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 要素父table复选框chang事件
         */
        guideSelChange(val) {
            let that = this;
            that.guideSeldArr = [];
            that.selEleName = [];
            if (val.length > 0) {
                for (let i in val) {
                    that.guideSeldArr.push(val[i].id);
                    if(val[i].isServerConfigured == '1'){
                        that.selEleName.push(val[i].elementName);
                    }else{
                        $.each(val[i].elementDetailDtos,function(t,item){
                            if(item.isServerConfigured == '1'){
                                that.selEleName.push(val[i].elementName);
                            }
                        })
                    }
                }
            }
        },
        // 要素子表格复选框change事件
        eleDetailSelChange(val) {
            let that = this;
            that.eleDetailSeldArr = [];
            if (val.length > 0) {
                var parentId = val[0].parentId;
                that.eleDetailSeldArr[parentId] = val;
            } else {
                that.eleDetailSeldArr[parentId] = [];
            }
        },
        //   添加要素
        addEvtChild(id, row) {
            let that = this;
            that.parentId = id;
            that.getDictionarys('yssjlx');
            that.getDictionarys('BT');
            that.getDictionarys('KJLX');
            that.batchAddModal = true;
            that.curId = id;
            // for (let i = 0; i < that.mattObj.mattChildData.length; i++) {
            //     that.mattObj.mattChildData[i].elementId = id;
            // }
            // that.mattObj.mattChildData = JSON.parse(JSON.stringify(row.elementDetailDtos));
            that.mattObj.mattChildData = [{
                controlType: "",
                dataLength: "",
                dataType: "",
                defaultValue: "",
                elementName: "",
                elementCode: "",
                elementId: that.curId,
                isRequired: ""
            }];

        },
        // 添加要素删除
        delEditDetail(index, row) {
            var that = this;
            that.$confirm('确定要删除这条记录吗？', '提示', {
                cancelButtonText: '取 消',
                confirmButtonText: '确 定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                that.mattObj.mattChildData.splice(index, 1);
            }).catch(() => {

            });
            
        },
        /*
       * 添加要素 -增加按钮点击事件
       */
        addBatchAnsEvt() {
            let that = this;
            that.notSaveChildData = [{
                controlType: "",
                dataLength: "",
                dataType: "",
                defaultValue: "",
                elementName: "",
                elementCode: "",
                elementId: that.curId,
                isRequired: ""
            }];
            that.mattObj.mattChildData.push(that.notSaveChildData[0]);
        },
        /*
        * 添加要素 确定
        */
        sureChildEvt() {
            let that = this;
            let url = '/elementDetail/addElementDetailList';
            let param = {};
            param.dtoList = that.mattObj.mattChildData;
            param.elementId = that.curId;
            for (let i = 0; i < that.mattObj.mattChildData.length; i++) {
                let rule =/^([1-9]\d*|0)$/;
                if (!that.mattObj.mattChildData[i].elementName) {
                    that.$Message.warning('请填写要素名称！');
                    return;
                } if (!that.mattObj.mattChildData[i].elementCode) {
                    that.$Message.warning('请填写要素标识！');
                    return;
                } if (!that.mattObj.mattChildData[i].dataType) {
                    that.$Message.warning('请选择数据类型！');
                    return;
                } if (that.mattObj.mattChildData[i].dataLength && !rule.test(that.mattObj.mattChildData[i].dataLength)) {
                    that.$Message.warning('长度请输入整型数值！');
                    return;
                } if (!that.mattObj.mattChildData[i].isRequired) {
                    that.$Message.warning('请选择必填！');
                    return;
                } if (!that.mattObj.mattChildData[i].controlType) {
                    that.$Message.warning('请选择控件类型！');
                    return;
                }
            }
            if(param.dtoList.length == 0){
                that.$Message.warning('添加要素不能为空！');
                return;
            }
            that.batchAddModal = false;
            unit.ajaxObjPost('/znsj-web' + url, param, function (res) {
                let data = res.data;
                that.$Message.success(data.errMsg || '保存成功！');
                // 刷新数据
                that.getElementData(that.sortOrder);
            },function (res) {
                    that.$Message.error(res.errMsg || '数据加载失败！');
                }, that);

            // 展开当前编辑项
            this.expands = [];
            this.expands.push(that.parentId);
            that.parentId = ''
        },
        //   编辑子项
        editEleDetailevt(index, row) {
            let that = this,
                url,
                parentId = row.parentId;
            that.curId = row.id;
            that.getDictionarys('yssjlx');
            that.getDictionarys('BT');
            that.getDictionarys('KJLX');
            url = '/elementDetail/getElementDetailInfo';
            that.eleDetailModal = true;
            this.eleFormItemData = Object.assign({}, row);
            that.eleDetailTitle = '编辑要素';
            unit.ajaxMerPost('/znsj-web' + url, {
                id: row.id
            }, function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    setTimeout(function () {
                        for (var key in data) {
                            that.eleFormItemData[key] = data[key];
                        }
                    }, 300);
                } else {
                    that.$Message.error(data.errMsg || '数据加载失败！');
                }
            }, function (error) {
                that.$Message.error(error.errMsg || '数据加载失败！');
            }, that);
            // 展开当前编辑项
            this.expands = [];
            this.expands.push(parentId);

        },
        /*
         * 初始化数据
         */
        created() {
            let that = this;
            that.getElementData(that.sortOrder);
        }
    },
    activated() {
        let that = this,
            parent;
        if (that.$parent && that.$parent.param) {
            parent = that.$parent.param;
            that.code = parent.matterCode ? parent.matterCode : '';
            that.version = parent.matterVersion ? parseFloat(parent.matterVersion) : 0;
        }
        that.created();
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
.el-button {
    font-size: 14px !important;
}
// 排序
.el-table .caret-wrapper {
    display: inline-block;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    @iehack: \9;
    display: inline-block @iehack;
}
// 超出截断
.el-tooltip > .cell{
    white-space: nowrap;
    min-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
}
#featureConfig {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    .el-table {
        border-top: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        font-size: 14px !important;
        color: #515a6e;
        th {
            height: 40px;
            padding: 0 !important;
            background-color: #f4f6f9;
            border-bottom: 1px solid #ddd !important;
            color: #515a6e;
        }
        td {
            height: 48px;
            padding: 0;
        }
        .reset{
            color:#409eff;

        }
        a.reset[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
            pointer-events: auto; 
        }
        a.noServer{
            color:#606266;
        }
        a.noServer:hover {
            color: #606266
        }
        .tip-title {
            display: inline-block;
            max-width: 100%;
        }
    }
    .el-table__expanded-cell[class*="cell"] {
        // background-color:#fff!important;
        padding: 10px 30px;
    }
    .mattLink {
        color: #409eff;
    }
    .btn-wrap {
        float: right;
        // width: 500px;
        cursor: pointer;
        text-align: right;
        margin: 0 0 10px;
        span {
            display: inline-block;
            width: 75px;
            height: 30px;
            // font-size: 13px;
            color: #fff;
            border-radius: 3px;
            line-height: 30px;
            text-align: center;
        }
        .btn-sure {
            margin-right: 10px;
            background: @baseColor;
        }
        .btn-del {
            background: #ed3f14;
        }
    }
    // 弹框样式
    .el-dialog__body {
        padding: 30px 0px;
        .el-select {
            width: 100%;
        }
        .other-width {
            width: 50%;
        }
        .el-checkbox {
            margin-left: 30px;
        }
    }
    .el-row {
        padding: 0 20px;
    }
    .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }
    .batch-dialog .batch-list-wrap {
        padding: 0 20px;
    }
    // 弹框按钮样式覆盖
    .footer {
        padding: 10px 30px 0 0;
        // height: 50px;
        background: #fff;
        text-align: right;
        line-height: 50px;
        border-top: 1px solid #ddd;
        margin-top: 50px;
    }
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    // 添加要素
    .btn-add-wrap {
        height: 40px;
        margin-top: 10px;
        .ivu-btn {
            width: 100%;
            height: 100%;
        }
    }

    .hide {
        display: none;
    }
    .editor-label {
        // display: inline-block;
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
}
</style>

       