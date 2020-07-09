/*
 * @Author: tinglong
 * @Date: 2018-10-29 10:52:06
 * @Last Modified by: kkfan2
 * @Last Modified time: 2019-01-18 09:25:46
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
              <span class="font-min">返回</span>
            </Button>
          </p>
      </div>
      <div class="content">
        <div class="tab-btn-wrap">
          <div class="tab-wrap-auto switch-navigate" v-model="tabView">
              <span class="switch-default font-min" :class="{'cur-selected': curIndex == index, 'br': index == tabs.length - 1, 'ml5': index != 0,'ml20': index == 0}" v-for="(item ,index) in tabs" :label="index" :key="index" @click="tabChange(index)">{{item.name}}</span>
          </div>
          <div class="btn-wrap-auto">
              <span v-if="curIndex != 1" class="btn-sure font-min" @click="addEvent('')">新增</span>
              <span v-if="curIndex != 2 && curIndex != 1" class="btn-del font-min" @click="deleteEvt('','0')">删除</span>
              <span v-if="curIndex == 1 " class="btn-manage font-min" @click="manage()">关联组管理</span>
          </div>
        </div>
        <keep-alive>
            <component v-bind:is="tabView" ref="children"></component>
        </keep-alive>
      </div>
  </div>
</template>
<script>
// 受理条件配置
import accConConfig from "@/pages/issuesManagement/configuration/accConConfig";
// 材料配置
import materialConfigure from '@/pages/issuesManagement/configuration/materialConfigure.vue';
// 指南配置
import guideConfig from "@/pages/issuesManagement/configuration/guideConfig";
//环节配置
import linkConfig from "@/pages/issuesManagement/configuration/linkConfig";
//要素配置
import featureConfig from "@/pages/issuesManagement/configuration/featureConfig";
//特别程序配置
import specialConfig from "@/pages/issuesManagement/configuration/specialConfig";

export default {
    components: {
        select1: linkConfig,
        select2: accConConfig,
        select3: materialConfigure,
        select4: guideConfig,
        select5: featureConfig,
        select6: specialConfig
    },
    data() {
        return {
            headTitle: this.$route.query.name,
            param: {
                matterCode: this.$route.query.matteCode,
                matterVersion: this.$route.query.matteVersion,
                id: this.$route.query.id,
                isParent: this.$route.query.isParent
            },
            // type:  事件类型：1:事项 2：一件事  针对指南
            guideType: '1',
            tabView: 'select1',  // 默认选中第一项
            // tab项
            tabs: [{
              name: "环节配置"
            },{
              name: "受理条件配置"
            }, {
              name: "材料配置"
            }, {
              name: "指南配置"
            },{
              name: "要素配置"
            },{
              name: "特别程序配置"
            }],
            curIndex: 0
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
            if (this.$children[i].init) {
              this.$children[i].init();
            }
          }
        },
        /*
         * 配置项新增
         * curIndex: 0: 受理条件配置 1：材料配置 2： 指南配置
         * type:  事件类型：1:事项 2：一件事  针对指南
         */
        addEvent(id) {
            let that = this,
                index = that.curIndex;
            if(index == '0'){
                that.$refs.children.editLinkEvt(id);
            } else if(index == '1') {
                that.$refs.children.editAcceEvent(id);
            }else if(index == '2'){
                that.$refs.children.openModal(id);
            }else if(index == '3') {
                that.$refs.children.editGuideEvt(id);
            }else if(index == '4'){
                that.$refs.children.editFatEvent(id);//新增要素
            }else if(index == '5'){
                that.$refs.children.editSpecialEvt(id);//新增特别程序
            }
        },
        /*
         * 配置项删除
         * type: 1: 受理条件配置 3： 指南配置
         */
        deleteEvt(id,isNew) {
            let that = this,
                index = that.curIndex;
            // that.$store.state.userUrl;
            if(index == '0') {
                that.$refs.children.deleteLink();
            } else if(index == '1') {
                that.$refs.children.delAcceEvt(id,isNew);
            }else if(index == '3') {
                that.$refs.children.delGuideEvt(id);
            }else if(index == '4') {
                that.$refs.children.delFatEvt(id);//删除要素
            }else if(index == '5') {
                that.$refs.children.delSpecialEvt(id);//删除特别程序
            }
            
        },
        /**
         * 配置项管理
         */
        manage(){
            let that = this;
            that.$refs.children.showManageDialog();
        }
    },
    mounted(){

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
        .btn-wrap-auto {
            float: right;
            width: auto;
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
            .btn-manage{
                display: inline-block;
                background:#fff;
                color: #666;
                border:1px solid rgba(221, 222, 225, 1);
                width:auto;
                height:auto;
                padding:1px 14px;
            }
        }
        .tab-wrap-auto {
            float:left;
            height: 26px;
            width: auto;
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
        //   font-size: 13px;
          line-height: 33px;
          .switch-default {
            background-color: #f2f2f2;
            color: #5e5e5e;
        }
      }
    }
}
</style>
