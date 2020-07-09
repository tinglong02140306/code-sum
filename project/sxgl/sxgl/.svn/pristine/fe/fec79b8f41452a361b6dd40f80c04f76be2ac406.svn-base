/*
 * @Author: qijiang 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-02 15:15:12
 */
<template>
    <!-- 基本信息 -->
    <div id="addDataTemplate">
        <!-- 受理条件列表 -->
        <div class="list-wrap">
            <el-form :model="addData" ref="addDataForm" label-width="80px" :label-position="labelPosition" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="font-min" label="模板名称" prop="templateName" :rules="addDataRule.templateName">
                            <el-input class="font-min" style="width:675px;" v-model="addData.templateName" placeholder="请输入模板名称" maxlength="50" @change="changeTemplateName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="font-min" label="模板类型" prop="templateType" :rules="addDataRule.templateType">
                            <el-select class="bwidth" v-model="addData.templateType" size="small" placeholder="请选择" >
                                <el-option v-for="item in templateTypeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <label class="el-form-item__label label-width-80">
                    <span class="required">*</span>模板属性
                </label>
                <el-table :data="addData.listAttr">
                    <el-table-column class="font-max" label="要素名称">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listAttr.'+scope.$index+'.attrName'" :rules="addDataRule.attrName">
                                <el-input v-model="scope.row.attrName" placeholder="请输入" maxlength="50" @change="(val)=>changeInput(val,scope.$index,'attrName')"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" label="要素标识">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listAttr.'+scope.$index+'.attrCode'" :rules="addDataRule.attrCode">
                                <el-input v-model="scope.row.attrCode" placeholder="请输入" maxlength="50" @change="(val)=>changeInput(val,scope.$index,'attrCode')"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" label="数据类型">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listAttr.'+scope.$index+'.attrType'" :rules="addDataRule.attrType">
                                <el-select v-model="scope.row.attrType" size="small" filterable>
                                    <el-option v-for="item in sjlxData" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column class="font-max" label="长度">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listAttr.'+scope.$index+'.attrLength'" :rules="addDataRule.attrLength">
                                <el-input v-model="scope.row.attrLength" placeholder="请输入" @change="(val)=>changeInput(val,scope.$index,'attrLength')"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-button class="font-max" type="text" size="small" @click="delAcceEvt(scope.$index)">删除</el-button>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <!-- 添加按钮 -->
            <div class="btn-add-wrap">
                <Button type="dashed" size="large" icon="md-add" @click="addAccConEvt">新增</Button>
            </div>
            <div class="footer">
                <el-button type="primary" size="small" @click="saveFormData('addDataForm')">确 定</el-button>
                <el-button size="small" @click="closeDialog">取 消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import unit from "@/api";   // 公共工具方法
export default {
    props: {
        mblxData: {
            type: Array
        },
        idS: {
            type: String,
            default: ''
        },
        sjlxData: {
            type: Array
        }
    },
    data() {
        //长度自定义校验规则（非必填）
        var vlilegalAttrLength = (rule, value, callback) => {
            if (value) {//有值才检验
                let reg = /^([1-9]\d*)$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入1-2000内的整数'));
                } else if(parseInt(value) > 2000) {
                    callback(new Error('请输入1-2000内的整数'));
                }else {
                    callback();
                }
            } else {
                callback();
            }
        };

        return {
            addData: {  //form表单
                listAttr: [],      // 前置条件数据
                templateName: '',  //模板名称
                templateType: ''   //模板类型
            },
            addDataRule: {  //form校验规则
                templateName: [
                    { required: true, message: '请填写模板名称', trigger: 'blur' },
                    { min: 0, max: 200, message: '长度在 0 到 200个字符', trigger: 'blur' }
                ],
                templateType: [
                    { required: true, message: '请选择模板类型', trigger: 'change' }
                ],
                attrName: [
                    { required: true, message: '请填写要素名称', trigger: 'blur' },
                    { min: 0, max: 50, message: '长度在 0 到 50个字符', trigger: 'blur' }
                ],
                attrCode: [
                    { required: true, message: '请填写要素标识', trigger: 'blur' },
                    { min: 0, max: 50, message: '长度在 0 到 50个字符', trigger: 'blur' }
                ],
                attrType: [
                   { required: true, message: '请选择数据类型', trigger: 'change' }
                ],
                attrLength: [
                   { validator: vlilegalAttrLength, trigger: 'blur' }
                ]
            },
            templateTypeData: [],  //模板类型数据源

            labelPosition: 'right'
        };
    },
    methods: {
        //修复ie记忆问题
        changeInput(val,index,attr) {
            this.addData.listAttr[index][attr] = val == '' ? '' : val;
        },
        //修复ie记忆问题
        changeTemplateName(val) {
            this.addData.templateName = val == '' ? '' : val;
        },
        //关闭弹窗
        closeDialog() {
            this.$emit('closeDialog');
        },
        /*
         * 增加受理条件
         */
        addAccConEvt: function () {
            let that = this,
                data = {
                    attrName: '',  //要素名称
                    attrType: '',  //数据类型
                    attrLength: '',  //长度
                    attrCode: '',  //要素标识
                    id: null,
                };
            that.addData.listAttr.push(data);
        },
        /*
         * 清空表单数据
         */
        clearFormData() {
            let that = this;
            // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
            if (that.$refs['addData'] !== undefined) {
                that.$refs['addData'].resetFields();
                for (var key in that.addData) {
                    that.addData[key] = '';
                }
            }
        },
        /*
         * 保存模板数据
        */
        saveFormData(formName, type) {
            var that = this,
                url,
                param = {};
            that.$refs[formName].validate((valid) => {
                if (!valid) {
                    return;
                }
                url = that.idS ? '/data/template/update' : '/data/template/add';
                param.listAttr = that.addData.listAttr;
                param.templateName = that.addData.templateName;
                param.templateType = that.addData.templateType;

                if (that.idS) {  // 受理条件 编辑
                    param.id = that.idS;  // 记录id
                    that.saveJsonType(url, param, type);
                } else {  // 受理条件 新增 
                    that.saveJsonType(url, param, type);
                }
            });
        },
        /*
         * 保存数据json字符串形式 新增 
         */
        saveJsonType(url, param, type) {
            let that = this;
            unit.ajaxPost('/znsj-web' + url, param).then(function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                if (data.flag) {
                    that.$Message.success(data.data || '保存成功！');
                    // 清空表单数据
                    that.clearFormData();
                    //关闭弹窗
                    that.closeDialog();
                } else {
                    that.$Message.warning(data.errMsg || '保存失败!');
                }
            }).catch(function (error) {
                that.$Message.error('数据加载失败！');
            });

        },
        /*
         * 删除  弹框触发事件
         */
        delAcceEvt(index) {
            let that = this,
                tips = '确定要删除这条记录吗？';   // 删除提示语
            that.$confirm(tips, '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                that.addData.listAttr.splice(index, 1);
            }).catch(() => {

            });
        }
    },
    mounted() {
        let that = this;
        that.templateTypeData = that.mblxData;
        that.addData.listAttr = [];
    }
};
</script>
<style lang="less">
@import "../../assets/styles/theme.less";
.v-modal {
    z-index: 999 !important;
}
#addDataTemplate {
    height: 100%;
    background-color: #fff;
    .el-table {
        border: 1px solid #e4e4e4;
        border-bottom: none;
        .el-form-item {
            margin-top: 18px;
        }
        .el-form-item__content {
            margin-left: 0 !important;
            .el-select {
                width: auto !important;
            }
        }
    }

    // 弹框头部样式覆盖
    .el-dialog__header {
        background-color: @baseColor;
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
    // 选择下拉框样式修改
    .el-form .el-select {
        width: 675px !important;
    }
    .list-wrap {
        .label-width-80 {
            width: 80px;
        }
        .el-input__inner {
            height: 32px;
            line-height: 32px;
        }
        .btn-add-wrap {
            margin-top: 10px;
            width: 100%;
            .ivu-btn {
                width: 100%;
                height: 40px;
            }
        }
        .required {
            display: inline-block;
            padding-right: 3px;
            color: red;
        }
        // 弹框按钮样式覆盖
        .footer {
            padding: 10px 30px 0 0;
            background: #fff;
            text-align: right;
            line-height: 50px;
            border-top: 1px solid #ddd;
        }
    }
}
</style>
