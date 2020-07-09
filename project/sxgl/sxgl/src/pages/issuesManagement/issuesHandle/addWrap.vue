/*
 * @Author: lhqin 
 * @Date: 2018-10-12 21:17:45 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-02-15 11:39:45
 */

<template>
    <!-- 基本信息 -->
    <div id="addWrap" class="pb10">
        <div class="base-info-wrap mt20 pt10 pr10 pl20 pb20">
            <el-form :model="sourceForm" :rules="rules" ref="mattForm" label-width="120px" class="demo-ruleForm" size="small">
                <el-row>
                    <el-col :span="10" :push="1">
                        <el-form-item label="事项来源" prop="matterSource">
                            <el-radio-group v-model="sourceForm.matterSource" :disabled="isDisabled" @change="matterSourceChange">
                                <el-radio label="02">事项库</el-radio>
                                <el-radio label="01">自建</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :push="2" v-if="sourceForm.matterSource == '01'">
                        <el-form-item label="数据来源" prop="dataSource">
                            <el-radio-group v-model="sourceForm.dataSource" :disabled="isDisabled">
                                <el-radio label="01">从事项库选择</el-radio>
                                <el-radio label="02">手动添加</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 切换面板组件 -->
            <keep-alive>
                <div :is="currentView" @statusChange="statusChange"></div>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import unit from '@/api/index';
import mattInfoPanel from '@/pages/issuesManagement/issuesHandle/mattInfoPanel';
import mattInfoPanelSelf from '@/pages/issuesManagement/issuesHandle/mattInfoPanelSelf';
export default {
    data() {
        return {
            currentView: '',

            isDisabled: false,
            sourceForm: {//表单赋初值
                matterSource: '02',
                dataSource: '02'
            },
            rules: {//表单校验规则
                matterSource: [
                    { required: true, message: '请选择事项来源', trigger: 'change' }
                ],
                dataSource: [
                    { required: true, message: '请选择数据来源', trigger: 'change' }
                ]
            },
            query: {

            },
            flag: true
        };
    },
    methods: {
        matterSourceChange(val) {
            // for (let i = 0; i < this.$children.length; i++) {
            //     if (this.$children[i].destroyed) {
            //         this.$children[i].destroyed();
            //     }
            // }
            this.flag = false;
            if (val == '02') {
                this.currentView = 'mattInfoPanel';
            } else {
                this.sourceForm.dataSource = '02';
                this.currentView = 'mattInfoPanelSelf';
            }
        },
        statusChange(val) {
            if (this.flag) {
                this.sourceForm.matterSource = val;
                this.matterSourceChange(val);
            }
        }
    },
    components: {
        mattInfoPanel,
        mattInfoPanelSelf
    },
    mounted() {
        let _that = this;
        _that.query = _that.$route.query;
        if (_that.query.type == 'addChild') {
            _that.currentView = 'mattInfoPanelSelf';
            _that.sourceForm.matterSource = '01';
        } else if (_that.query.type == 'detail') {
            _that.rules = {};
            _that.isDisabled = true;
            _that.currentView = 'mattInfoPanelSelf';
        } else {
            _that.currentView = 'mattInfoPanelSelf';
        }
    }
};
</script>
<style lang="less" rel="stylesheet/less">
@import "../../../assets/styles/color.less";
#addWrap {
    // overflow-y: auto;
    height: 100%;
    background-color: #fff;
    // border: 1px solid #e4e4e4;
    border-top: 0;
}
</style>

