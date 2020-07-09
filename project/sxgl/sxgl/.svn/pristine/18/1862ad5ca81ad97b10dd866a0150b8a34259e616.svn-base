/*
 * @Author: tinglong 
 * @Date: 2018-10-29 10:52:06 
 * @Last Modified by: qijiang
 * @Last Modified time: 2019-01-17 17:20:42
 */
<template>
    <!-- 基本信息 -->
    <div id="stageConfig">
        <!-- 阶段配置列表 -->
        <div class="list-wrap">
            <el-table :data="stageData" @selection-change="stageSelChange">
                <el-table-column align="center" width="55" type="selection" :selectable='checkSelectable'>
                </el-table-column>
                <!-- prop="stepName" label="阶段名称" -->
                <el-table-column class="font-max" align="left" prop="stepName" label="阶段名称">
                    <template slot-scope="scope">
                        <span class="item-text" v-if="stageData[scope.$index].status == '1'">{{stageData[scope.$index].stepName}}</span>
                        <el-input class="" v-if="stageData[scope.$index].status == '0'" v-model="stageData[scope.$index].stepName" placeholder="请输入" maxlength="50" @change="(val) =>changeStageName(val,scope.$index)"></el-input>
                    </template>
                </el-table-column>

                <el-table-column class="font-max" align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button class="font-max" type="text" size="small" @click="upSortEvt(stageData[scope.$index].id)" :disabled="stageData[scope.$index].status == '0' ? true : false">上移</el-button>
                        <el-button class="font-max" type="text" size="small" @click="downSortEvt(stageData[scope.$index].id)" :disabled="stageData[scope.$index].status == '0' ? true : false">下移</el-button>
                        <el-button class="font-max" type="text" size="small" @click="editStageEvent(stageData[scope.$index].id, scope.$index)" v-if="stageData[scope.$index].status == '1'">编辑</el-button>
                        <el-button class="font-max" type="text" size="small" @click="editStageEvent(stageData[scope.$index].id, scope.$index)" v-if="stageData[scope.$index].status == '0'">保存</el-button>
                        <el-button class="font-max" type="text" size="small" @click="delStageEvt(stageData[scope.$index].id, stageData[scope.$index].isNew)" :disabled="stageData[scope.$index].isNew == '0' && stageData[scope.$index].status == '0' ? true : false">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加按钮 -->
            <div class="btn-add-wrap">
                <!-- iview按钮 -->
                <Button type="dashed" size="large" icon="md-add" @click="addStageNameEvt">增加</Button>
            </div>
        </div>
    </div>
</template>
<script>
// 公共工具方法
import unit from "@/api";   
export default {
    data() {
        return {
            eventId: 'c56edc6bdbf3428b8d3bca5ecb382777',  // 一件事id
            stageSeldArr: [],  // 删除选中项 id
            stageData: [],   // 前置条件数据
            notSaveStageData: [],  // 尚未保存数据
            curId: '',  // 当前被操作事项id  存储 删除 编辑项
            delPromTips: '确定要删除这条记录？',  // 删除提示语
            notSaveFlag: false,
        };
    },
    methods: {
        /*
         * 阶段名称修复ie记忆问题
         */ 
        changeStageName(val, index) {
            let that = this;
            that.stageData[index].stepName = val == '' ? '' : val;
        },
        /*
         * 阶段名称复选框禁用
         */ 
        checkSelectable(row) {
            if(row.status == '1'){
    			return 1;
    		}else{
    			return 0;
            }
        },
        /*
         * 添加阶段名称
         */ 
        addStageNameEvt() {
            let that = this;
            for(var i in that.stageData) {
                if(that.stageData[i].status == '0') {
                    that.notSaveFlag = true;
                }
            }
            if(!that.notSaveFlag) {
                let data = {
                    stepName: '',
                    status: '0',
                    id: null,
                    // 是否是新增
                    isNew: '1'
                };
                that.stageData.push(data);
                that.notSaveStageData.push(data);
                that.notSaveFlag = true;
            }else {
                that.$Message.warning('有尚未保存的数据');
            }
            
        },
        /*
         * 获取阶段名称数据列表
         * type: 1: 代表上移、下移、删除刷新数据
         */ 
        getStageNameData(type) {
            let that = this, 
                url = '/stepEvent/getStepEventList';
            unit.ajaxMerPost('/znsj-web' + url, {
                id: that.eventId
            }, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                that.stageData = [];
                for(let i in data) {
                    data[i].status = '1';
                    data[i].isNew = '0';
                    // that.$set(that.stageData, i, data[i]); 
                }
                that.stageData = data;
                if(type == '1' &&  that.notSaveStageData.length == 1) {
                    that.stageData.push( that.notSaveStageData[0]);
                }
            },function(error) {
                that.$Message.error('数据加载失败！');
            }, that);
        },
        /*
         * 编辑 新增点击事件
         * id有值就是编辑 为空为新增
         */ 
        editStageEvent(id,index) {
            let that = this,
                url = id ? '/stepEvent/editStepEvent' : '/stepEvent/addStepEvent',
                param = {},
                status = that.stageData[index].status;
            if(status == '0') {
                if(!that.stageData[index].stepName) {
                    that.$Message.warning('请填写阶段名称！');
                    return;
                }
                param.stepName = that.stageData[index].stepName;
                param.eventId = that.eventId;
                // 记录id
                param.id = id; 
                // 新增 json 字符串
                that.saveJsonType(url, param,index);
            }else if(status == '1') {
                
                for(var i in that.stageData) {
                    if(that.stageData[i].status == '0') {
                        that.notSaveFlag = true;
                    }
                }
                if(that.notSaveFlag) {
                    that.$Message.warning('有尚未保存的数据');
                    return;
                }
                that.stageData[index].status = '0';
            }
        },
        /*
         * 保存数据json字符串形式 编辑
         * id: 记录id
         */
        saveJsonType(url, param,index) {
            let that = this;
            unit.ajaxPost('/znsj-web' + url ,param).then(function(res){
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                that.notSaveStageData = [];
                that.notSaveFlag = false;
                // 刷新数据
                // that.stageData[index].status = '1';
                // that.stageData[index].isNew = '0';
                that.getStageNameData();
            }).catch(function(error){
                that.$Message.error('保存失败');    
            });

        },
        
        /*
         * 删除  弹框触发事件
         * id: 记录id
         */
        delStageEvt(id, isNew) {  
            let that = this,
                idData;
            that.curId = id;
            if(isNew == '0') {
                if(id) {
                    that.delPromTips = '确定要删除这条记录？';
                }else {
                    idData = that.stageSeldArr;
                    if(idData.length == 0) {
                        that.$Message.warning('请选择要删除的记录！');
                        return;
                    }else {
                        that.delPromTips = '确定要删除选中的记录吗？';
                        that.curId = idData.join(',');
                    }
                }
            }
            
            that.$confirm(that.delPromTips, '提示', {
                cancelButtonText: '取 消',
                confirmButtonText: '确 定',
                cancelButtonClass: 'fr ml10',
                type: 'warning'
            }).then(() => {
                if(isNew == '1') {
                    that.stageData.splice(that.stageData.length - 1, 1);
                    that.notSaveStageData = [];
                    that.notSaveFlag = false;
                }else {
                    that.sureDelEvt(that.curId);
                }
            }).catch(() => { 
            });
        },
        /*
         * 确定删除选中记录项
         */
        sureDelEvt(id) {
            let that = this,
                url = '/stepEvent/deleteStepEvent',
                param = {
                    ids: id
                }; 
            unit.ajaxMerPost('/znsj-web' + url , param, function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                // that.deleteVis = false;
                that.$Message.success('删除成功');
                // 刷新数据
                that.getStageNameData('1');
                
            },function(error) {
                // that.deleteVis = false;
                that.$Message.error(error.data.errMsg);
            }, that);
        },
        /*
         * 阶段名称table复选框chang事件
         */ 
        stageSelChange(val) {
            let that = this;
            that.stageSeldArr = [];
            if(val.length >  0) {
                for(let i in val) {
                    that.stageSeldArr.push(val[i].id);
                }
            }
        },
        /*
         * 上移
         * id: 记录id
         */ 
        upSortEvt(id) {
            let that = this,
                url;
            unit.ajaxMerPost('/znsj-web/stepEvent/upStepEvent', {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                // 刷新数据
                that.getStageNameData('1');
            },function(error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         * 下移
         * id: 记录id
         */ 
        downSortEvt(id) {
            let that = this;
            unit.ajaxMerPost('/znsj-web/stepEvent/downStepEvent', {
                id: id
            },function(res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                let data = res.data;
                // 刷新数据
                that.getStageNameData('1');
            },function(error) {
                that.$Message.error(error.data.errMsg || '数据加载失败！');
            }, that);
        },
        /*
         *  初始化页面数据
         */
        init() {
            let that = this;
            that.getStageNameData();
        },
    },
    mounted() {
        let that = this,
            parent;
        // 阶段名称只需要事项id
        if(that.$parent && that.$parent.param){
            parent = that.$parent.param;
            that.eventId = parent.eventId ? parent.eventId : '';
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
    font-size: 14px !important;
}
#stageConfig {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    .list-wrap {
        .el-table {
            border: 1px solid #ddd;
            border-bottom: none;
        }
        .el-table td {
            padding: 7px 0;
        }
        .el-input__inner {
            padding: 0 8px;
            height: 35px;
            line-height: 35px;
        }
        .item-text {
            display: inline-block;
            width: 100%;
            height: 35px;
            line-height: 35px;
        }
        .btn-add-wrap {
            margin-top: 10px;
            width: 100%;
            .ivu-btn {
                width: 100%;
                height: 40px;
            }
        }
    }
   
    .del-tips {
        display: inline-block;
        width:100%;
        text-indent: 10px;
    }
    // 弹框按钮样式覆盖
    .footer {
        height: 50px;
        background: #fff;
        text-align: center;
        line-height: 50px;
        // .el-button {
        //     height: 30px;
        //     width: 70px;
        // }
    }
    
    // 改弹框层级
    .el-dialog__wrapper {
        z-index: 1000 !important;
    }
    // 选择下拉框样式修改
    .el-select {
        width: 235px !important;
    }
}
</style>
