/*
 * @Author: tinglong 
 * @Date: 2018-10-29 18:52:06 
 * @Last Modified by: tinglong
 * @Last Modified time: 2018-10-29 18:52:06 
 */
<template>
  <div id="configInfoPage" style="background: #ffffff">
      <!-- 头部标题部分 -->
      <div class="head-wrap">
          <p class="title">
              <i></i>
              <span class="ell font-max" :title="headTitle">{{headTitle}}</span>
          </p>
          <p class="btn-group ml30">
            <Button size="small" class="cursor-p w80" @click="$router.back(-1)">
              <i class="iconfont icon-back"></i>
              <span>返回</span>
            </Button>
          </p>
      </div>
      <div class="content">
        <div class="tab-btn-wrap">
            <div class="tab-wrap switch-navigate" v-model="tabView">
                <span class="switch-default font-min" :class="{'cur-selected': curIndex == index, 'br': index == tabs.length - 1, 'ml5': index != 0,'ml20': index == 0}" v-for="(item ,index) in tabs" :label="index" :key="index" @click="tabChange(index)">{{item.name}}</span>
            </div>
            <div class="btn-wrap">
                <span v-if="curIndex != 0" class="btn-sure font-min" @click="addEvent('')">新增</span>
                <span v-if="curIndex == 1" class="btn-flow font-min" @click="flowChartEvt('')">流程图</span>
                <span v-if="curIndex != 1" class="btn-del font-min" @click="deleteEvt('')">删除</span>
            </div>
        </div>
        <keep-alive>
            <component v-bind:is="tabView" ref="children"></component>
        </keep-alive>
      </div>
  </div>
</template>
<script>

// 阶段配置
import stageConfig from "@/pages/thingManagement/configuration/stageConfig";
// 流程配置
import flowMatteConfig from '@/pages/thingManagement/configuration/flowMatteConfig'; 
// 指南配置
import oneGuideConfig from "@/pages/thingManagement/configuration/oneGuideConfig";
export default {
    components: {
        select1: stageConfig,
        select2: flowMatteConfig,
        select3: oneGuideConfig
    },
    data() {
        return {
            headTitle: this.$route.query.name,
            param: {
                eventCode: this.$route.query.eventCode,
                eventVersion: this.$route.query.eventVersion,
                eventId: this.$route.query.id
            },
            // type:  事件类型：1:事项 2：一件事  针对指南
            guideType: '2',  
            // 默认选中第一项
            tabView: 'select1',  
            // tab项
            tabs: [{
              name: "阶段配置"
            }, {
              name: "事项配置"
            }, {
              name: "指南配置"
            }],
            curIndex: 0,
            // 前一次tab的index值
            // preIndex: 0,  
        }
    },
    methods: {
        /*
         * tab切换点击事件
         */
        tabChange: function (index) {
            let that = this;
            if(that.$refs.children.notSaveFlag) {
                that.$Message.warning('有尚未保存的数据');
                return;
            }
            that.curIndex = index;
            that.tabView = 'select' + (index+1);
            for (let i = 0; i < that.$children.length; i++) {
                if (that.$children[i].init) {
                    that.$children[i].init();
                }
            }
        },
        /*
         * 配置项新增
         * curIndex: 0: 阶段名称配置 1：流程事项配置 2： 指南配置
         */
        addEvent(id) {
            let that = this,
                index = that.curIndex;
            if(index == '0') {
                that.$refs.children.editStageEvent(id);
            }else if(index == '1'){
                that.$refs.children.editFlowMatEvt(id);
            }else if(index == '2') {
                that.$refs.children.editGuideEvt(id);
            }
        },
        /*
         * 配置项删除
         * type: 1: 阶段配置 3： 指南配置
         */
        deleteEvt(id) {
            let that = this,
                index = that.curIndex;
            if(index == '0') {
                that.$refs.children.delStageEvt(id, '0');
            }else if(index == '1'){
                that.$refs.children.delFlowMatEvt(id);
            }else if(index == '2') {
                that.$refs.children.delGuideEvt(id);
            }
        },
        /*
         * 查看流程图点击事件
         */
        flowChartEvt() {
            let that = this;
            that.$refs.children.viewFlowChat();
        }
    }
}

</script>
<style lang="less">
@import "../../../assets/styles/theme.less";
#configInfoPage {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
    // 头部标题
    .head-wrap {
        margin-bottom: 10px;
        height: 42px;
        border-bottom: 1px dashed #d8d8d8;
        .title {
          display: inline-block;
          position: relative;
          height: 25px;
          line-height: 25px;
          vertical-align: middle;
          i {
            float: left;
            width: 7px;
            height: 100%;
            background-color: #3399ff;
          }
          span {
            display: inline-block;
            padding-left: 10px;
            max-width: 800px;
            height: 100%;
            color: #333;
            font-weight: 1000;
            line-height: 25px;
          }
        }
        .btn-group {
          display: inline-block;
        }
    }
    .tab-btn-wrap {
        margin: 10px 0;
        height: 37px;
        border-bottom: 1px solid #e4e4e4;
        .btn-wrap {
            float: right;
            width: 500px;
            cursor: pointer;
            text-align: right;
            span {
                display: inline-block;
                width: 60px;
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
            .btn-flow {
                background: #2db7f5;
            }
        }
        .tab-wrap {
            float:left;
            height: 26px;
            width: 450px;
            font-size: 0;
            line-height: 26px;
            span {
              cursor: pointer;
              display: inline-block;
              width: 120px;
              color: #515a6e;
              border-top: 3px solid transparent;
              text-align: center;
            }
            .br {
              border-right: 1px solid #e4e4e4;
            }
            .cur-selected {
                border-left: 1px solid #e4e4e4;
                border-right: 1px solid #e4e4e4;
                border-bottom: 1px solid transparent;
                border-color: #3399ff #e4e4e4 transparent #e4e4e4;
                background-color: #fff !important;
            }
        }
        .switch-navigate {
            height: 33px;
            line-height: 33px;
            .switch-default {
                background-color: #f2f2f2;
                color: #5e5e5e;
            }
      }
    }
}
</style>
