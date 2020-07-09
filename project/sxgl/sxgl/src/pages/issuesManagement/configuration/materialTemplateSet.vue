/*
* @Author: qijiang
* @Date: 2018-10-29 13:06:00
* 材料配置-新增模板
*/
<template>
    <div id="materialTemplateSet">
        <Form :model="addFormItem" :rules="ruleValidate" ref="addFormItem" :label-width="125">
            <Row>
                <Col span="12">
                <FormItem label="表单类型" prop="billType">
                    <Select v-model="addFormItem.billType" :transfer="true" @on-change="bdlxChange" label-in-value>
                        <Option v-for="item in dataSource.bsxbdlxSource" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="表单模板" prop="billTemplate">
                    <Select ref="bdmb" v-model="addFormItem.billTemplate" :transfer="true" filterable @on-change="bdmbChange" label-in-value>
                        <Option v-for="item in dataSource.bdmbSource" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="表单显示名称" prop="billName">
                    <Input v-model="addFormItem.billName" placeholder="请输入表单显示名称" @change="(val)=>changeInput(val,'billName')" :maxlength="50"></Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="模板版本" prop="templateVersion">
                    <Select v-model="addFormItem.templateVersion" :transfer="true" @on-change="mbbbChange" label-in-value>
                        <Option v-for="item in dataSource.mbbbSource" :value="item.version" :key="item.version">{{ item.version }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                <FormItem label="是否有依赖表单" prop="isDepend">
                    <RadioGroup v-model="addFormItem.isDepend" @on-change="isDependChange">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                </Col>
            </Row>
            <Row v-if="showDepend">
                <Col span="12">
                <FormItem label="依赖表单模板" prop="dependTempCode">
                    <Select v-model="addFormItem.dependTempCode" :transfer="true" filterable @on-change="ylbdmbChange" label-in-value>
                        <Option v-for="item in dataSource.bdmbSource" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="依赖表单模板版本" prop="dependTempVersion">
                    <Select v-model="addFormItem.dependTempVersion" :transfer="true">
                        <Option v-for="item in dataSource.ylmbbbSource" :value="item.version" :key="item.version">{{ item.version }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <div class="clearfxi iframe-wrap">
            <iframe id="ifram" v-show="isShowForm" src="/bog-matter-mgr/static/formHandle/formHandle.html" width="750" height="auto" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
            <!-- 禁用标志 -->
            <div class="no-use" v-show="isShowForm"></div>
            <div v-show="!isShowForm" class="form-tip">
                表单显示区域
            </div>
        </div>
        <div class="ivu-modal-footer-change">
            <div class="dialog-footer">
                <el-button type="button" size="small" class="el-button el-button--primary" @click="sureBtn(true)">
                    <span>确定</span>
                </el-button>
                <el-button type="button" size="small" class="el-button el-button--default" @click="sureBtn(false)">
                    <span>取消</span>
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
import util from "@/api/index";
export default {
    props: {
        backData: {
            type: Object
        },
        matriCode: {
            type: String,
            default: ''
        },
        mterialTemplateData: {
            type: Array
        }
    },
    data() {
        return {
            addFormItem: {  //表单集合
                billType: '',   //表单类型
                billTypeName: '',   //表单类型名称
                billTemplate: '',      //表单模板
                billTemplateName: '',  //表单模板名称
                billName: '',    //表单显示名称
                templateVersion: '',      //模板版本
                templateVersionName: '',  //模板版本名称
                isDepend: '0',      //是否有依赖表单
                dependTempCode: '',    //依赖表单模板
                dependTempName: '',    //依赖表单模板名称
                dependTempVersion: ''     //依赖模板版本
            },
            dataSource: {  //数据源集合
                bsxbdlxSource: [],  //表单类型
                bdmbSource: [],     //表单模板
                mbbbSource: [],      //模板版本
                ylmbbbSource: [],      //依赖模板版本
            },
            formParam: {
                code: '',
                version: ''
            },
            ruleValidate: { //校验规则
                billType: [
                    { required: true, message: "请选择表单类型", trigger: "change" },
                ],
                billTemplate: [
                    { required: true, message: "请选择表单模板", trigger: "change" },
                ],
                billName: [
                    { required: true, message: "请输入表单显示名称", trigger: "change" },
                ],
                templateVersion: [
                    { required: true, message: "请选择模板版本", trigger: "change" },
                ],
                isDepend: [
                    { required: true, message: "请选择是否有依赖表单", trigger: "change" },
                ],
                dependTempCode: [
                    { required: true, message: "请选择依赖表单模板", trigger: "change" },
                ],
                dependTempVersion: [
                    { required: true, message: "请选择依赖表单模板版本", trigger: "change" },
                ]
            },
            showDepend: false,  //是否展示依赖表单
            isShowForm: false  //是否展示表单
        }
    },
    methods: {
        // 修复ie记忆问题
        changeInput(val, attr) {
            this.addFormItem[attr] = val == '' ? '' : val;
        },
        //单选框选中事件
        isDependChange(val) {
            if (val == 0) {
                this.showDepend = false;
            } else {
                this.showDepend = true;
            }
        },
        //表单类型下拉框事件
        bdlxChange(obj) {
            let query = this.$refs.bdmb.$data.query;
            if (query) {
                this.$refs.bdmb.$data.query = '';
            }
            if (obj && obj.value) {
                //清空关联数据
                this.addFormItem.billTemplate = '';
                this.addFormItem.templateVersion = '';
                this.addFormItem.dependTempCode = '';
                this.addFormItem.dependTempVersion = '';
                this.dataSource.mbbbSource = [];
                this.dataSource.ylmbbbSource = [];
                
                this.addFormItem.billTypeName = obj.label;
                this.getBillList();
            }

        },
        //表单模板下拉框事件
        bdmbChange(obj) {
            if (obj && obj.value) {
                this.getBillVersion('billTemplate');
                this.formParam.code = obj.value;
                this.addFormItem.billTemplateName = obj.label;  //赋值表单模板名称
                this.addFormItem.billName = obj.label;  //赋值显示模板名称
                //清空关联数据
                this.addFormItem.templateVersion = '';
                this.formParam.version = '';

                if (this.formParam.code && this.formParam.version) {
                    this.isShowForm = true;
                    window.top.init(this.formParam.code, this.formParam.version);
                } else {
                    this.isShowForm = false;
                }
            } else {
                this.isShowForm = false;
            }
        },
        //依赖表单模板下拉框事件
        ylbdmbChange(obj) {
            if (obj && obj.value) {
                this.addFormItem.dependTempName = obj.label;  //赋值依赖表单模板名称

                //清空关联数据
                this.addFormItem.dependTempVersion = '';
                this.getBillVersion('dependTempCode');
            }
        },
        //模板版本下拉框事件
        mbbbChange(obj) {
            if (obj && obj.label) {
                this.formParam.version = obj.label;
                this.addFormItem.templateVersionName = obj.label;
                if (this.formParam.code && this.formParam.version) {
                    this.isShowForm = true;
                    window.top.init(this.formParam.code, this.formParam.version);
                } else {
                    this.isShowForm = false;
                }
            }
        },
        // 获取表单模板字典数据源
        getBillList() {
            let that = this;
            util.ajaxMerPost("/znsj-web/matri/bill/formList", {
                billType: that.addFormItem.billType,
                queryName: ''
            }, function (res) {
                res = typeof res === "string" ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    that.dataSource.bdmbSource = data.rows;
                    if (that.backData.billTemplate) {
                        that.addFormItem.billTemplate = that.backData.billTemplate;
                        that.getBillVersion('billTemplate');
                    }
                    if (that.backData.dependTempCode) {
                        that.addFormItem.dependTempCode = that.backData.dependTempCode;
                        that.getBillVersion('dependTempCode');
                    }
                } else {
                    that.$Message.error(res.data || "数据加载失败!");
                }
            }, function (error) {
                that.$Message.error("数据加载失败！！");
            }, that);
        },
        // 获取表单模板版本字典数据源
        getBillVersion(type) {
            let that = this,
                code = '';
            if (type == 'billTemplate') {
                code = that.addFormItem.billTemplate
            } else {
                code = that.addFormItem.dependTempCode
            }
            util.ajaxMerPost("/znsj-web/matri/bill/formDetail", {
                code: code
            }, function (res) {
                res = typeof res === "string" ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    if (type == 'billTemplate') {
                        that.dataSource.mbbbSource = data;
                        if (that.backData.templateVersion) {
                            that.addFormItem.templateVersion = that.backData.templateVersion;
                        }
                    } else {
                        that.dataSource.ylmbbbSource = data;
                        if (that.backData.dependTempVersion) {
                            that.addFormItem.dependTempVersion = that.backData.dependTempVersion;
                        }
                    }
                } else {
                    that.$Message.error(res.data || "数据加载失败!");
                }
            }, function (error) {
                that.$Message.error("数据加载失败！！");
            }, that);
        },
        //获取字典项公共方法
        getDicData(param, success) {
            let that = this;
            util.ajaxMerPost("/znsj-web/dic/getDictionarys", { pinYinType: param }, function (res) {
                res = typeof res === "string" ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    if (data && data.length > 0) {
                        success && success(data);
                    }
                } else {
                    that.$Message.error(res.data || "数据加载失败!");
                }
            }, function (error) {
                that.$Message.error("数据加载失败！！");
            }, that);
        },
        //字典项总获取
        getSumDictionary() {
            let that = this;
            // 获取表单类型字典项
            that.getDicData("bsxbdlx", function (data) {
                that.dataSource.bsxbdlxSource = data;
                if (that.backData.billType) {
                    that.addFormItem.billType = that.backData.billType;
                    that.getBillList();
                }
            });
        },
        //确定按钮
        sureBtn(flag) {
            if (!flag) { //取消按钮
                this.$emit('saveMaterialTemplate', {}, flag);
                return;
            }
            let that = this,
                obj = {};
            that.$refs.addFormItem.validate(valid => {
                if (!valid) {
                    return;
                }
                obj = JSON.parse(JSON.stringify(that.addFormItem));
                if (obj.id || that.matriCode) {
                    obj.matriCode = that.matriCode;
                    that.saveData(obj);
                } else {
                    that.$emit('saveMaterialTemplate', obj, flag);
                }
            });
        },
        //保存接口调用
        saveData(param) {
            let that = this;
            util.ajaxObjPost("/znsj-web/matri/bill/saveOrUpdate", param, function (res) {
                res = typeof res === "string" ? JSON.parse(res) : res;
                let data = res.data;
                if (res.flag) {
                    param.id = res.data;
                    that.$emit('saveMaterialTemplate', param, true);
                } else {
                    that.$Message.error(res.data || "数据加载失败!");
                }
            }, function (res) {
                that.$Message.error(res.data.errMsg || "数据加载失败！！");
            }, that);
        }
    },
    mounted() {

    },
    created() {
        let that = this;
        //获取全部字典值
        this.getSumDictionary();
        if (this.backData.billType) {
            this.addFormItem = this.backData;
            this.isShowForm = true;
            if(this.backData.isDepend == '1') {
                this.showDepend = true;
            }
            setTimeout(()=> {
                window.top.init(that.backData.billTemplate, that.backData.templateVersion);
            }, 1000);    
        }
    }
};
</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
#materialTemplateSet {
    .ivu-modal-footer-change {
        margin-top: 26px;
        padding: 12px 18px 0 18px;
        border-top: 1px solid #e8eaec;
        text-align: right;
    }
    .ivu-form-item-error {
        .ivu-select-selection {
            border: 1px solid #dcdee2;
        }
    }
    .iframe-wrap {
        position: relative;
        padding: 20px 0;
        width: 100%;
        border: 1px dashed #dcdee2;
        iframe {
            display: block;
            height: auto;
            margin: 0 auto;
            min-height: 400px;
            width: 915px;
        }
        .no-use {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            cursor: not-allowed;
            opacity: 0;
        }
        .form-tip {
            height: 300px;
            line-height: 300px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }
    }
}
</style>
