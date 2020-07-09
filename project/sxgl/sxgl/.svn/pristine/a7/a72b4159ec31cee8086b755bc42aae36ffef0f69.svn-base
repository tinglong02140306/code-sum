/*
 * @Author: lhqin
 * @Date: 2018-10-22 16:13:55
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-10-31 15:50:37
 */

<template>
  <div id="oneThingSituationConfigInfos" class="pl20 pr20 pt15">
    <!-- 头部说明 -->
    <div class="title-top">
      <p class="title-left">
        <span class="t-div mr5"></span>
        <span :title="parentParams.name" class="ell title-ell">{{parentParams.name}}</span>
      </p>
      <p class="btn-groups inline-block ml30" @click="backEvt">
        <Button size="small" class="cursor-p w80">
          <i class="iconfont icon-back"></i>
          <span>返回</span>
        </Button>
      </p>
    </div>

    <div class="tabs" v-if="tabMatterList.length > 1">
      <div class="tabs-bar">
        <!-- <div :class="tabCls(index)" v-for="(item,index) in tabMatterList" @click="tabClick(index)">
          {{item.stepName}}
        </div> -->
        <div class="radio-group switch-navigate mt10">
            <Icon type="ios-arrow-back" @click="scrollPre" v-if="showBtn" />
            <div class="radio-sub-wrap" :style="{width: subWrapWid}">
                <div class="radio-sub" :style="{width: subWid}">
                      <!-- :style="{width: subWid}" -->
                    <span class="switch-default ell font-min" :class="tabCls(index)" v-for="(item ,index) in tabMatterList" :key="index" :value="index"  :title="item.stepName" @click="tabClick(index)">{{item.stepName}}</span>
                </div>
            </div>
            <Icon type="ios-arrow-forward" @click="scrollNext" v-if="showBtn" />
        </div>
      </div>
    </div>

    <div class="radio-wrap" :class="tabMatterList.length > 1?'mtTab':''" v-if="tabMatterList.length > 0" v-for="(item,index) in tabMatterList" v-show="index == curTabIndex">
      <!-- 切换面板组件 -->
      <matterSituationConfigInfos :showTop="showTop" :index="index" :stageId="item.id" :parentParams="parentParams"></matterSituationConfigInfos>
    </div>
    <matterSituationConfigInfos style="padding-top: 0px" v-show="tabMatterList.length == 0" :showTop="showTop" :stageId="stageId" :index="0" :parentParams="parentParams"></matterSituationConfigInfos>

  </div>

</template>
<script>
  import util from '@/api/index';
  import matterSituationConfigInfos from '@/pages/thingSetting/configuration/matterSituationConfigInfos';

  export default {
    data() {
      return {
        showBtn: false,  //是否显示按钮
        subWid: '100%',
        subWrapWid: '96%',
        distance: 0,
        showTop: false,  //不显示子组件返回
        stageId: '',
        savaQuery: '',
        operateName: '',
        param: {
          eventVersion: '',
          eventCode: ''
        },
        curTabIndex: 0,//记录当前tab页
        tabMatterList: [],
        parentParams: {
          eventCode: this.$route.query.eventCode,
          eventVersion: this.$route.query.eventVersion,
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
      };
    },
    components: {
      matterSituationConfigInfos
    },
    methods: {
      /*
         * tab向前移动
         */
        scrollPre() {
            let that = this;
            that.distance -= 100;
            $('.radio-sub-wrap').scrollLeft(that.distance);
            if (that.distance < 0) {
                that.distance = 0;
            }
        },
        /*
         * tab向后移动
         */
        scrollNext() {
            let that = this,
                maxWid = that.subWid.substr(0, that.subWid.length - 2) - that.subWrapWid.substr(0, that.subWid.length - 2);
            that.distance += 100;
            $('.radio-sub-wrap').scrollLeft(that.distance);
            if (that.distance > maxWid) {
                that.distance = maxWid;
            }
        },
        /*
         * 计算宽度
         */
        cupWidth() {
            let that = this,
                len = that.tabMatterList.length,
                distanceRight = 0,
                allWid = $('.radio-group')[0].offsetWidth,
                subWrapWid = 0,
                subWid = 0,
                $dom = $('.switch-default');
            for (let i = 0; i < len; i++) {
                subWid += $dom[i].offsetWidth;
                distanceRight += 5;
            }
            if (subWid > allWid) {
                that.showBtn = true;
                subWrapWid = allWid - 36;
            } else {
                that.showBtn = false;
                subWrapWid = allWid;
            }
            if(len >= 7) {
                that.showBtn = true;
            }else {
                that.showBtn = false;
            }
            that.subWrapWid = 910 + 'px';
            that.subWid = subWid + 1 + distanceRight - 5 + 'px';
        },
      backEvt() {
        this.$router.go(-1);
      },
      tabCls(index) {
        return [
          'tabs-tab', {
            'cur': index === this.curTabIndex
          }
        ]
      },
      //tab点击事件
      tabClick(index) {
        if (this.curTabIndex != index) {
          this.curTabIndex = index;
          this.isFirst = false;
        }
      },
      //获取阶段数据
      getStepEventList() {
        let $this = this;
        let params = {
          id: $this.$route.query.id/*'c56edc6bdbf3428b8d3bca5ecb382777'*/,
        }
        util.ajaxMerPost('/znsj-web/classify/getStepEventList', params,
          function (res) {
            if (res.data && res.data.length > 0) {
              $this.tabMatterList = res.data;
              if($this.tabMatterList.length > 1) {
                  setTimeout(() => {
                      $this.cupWidth();
                  }, 0);
              } 
            }
          },
          function (res) {
            $this.$Message.error('数据请求失败');
          }, this);
      }

    },
    mounted() {
      this.savaQuery = this.$route.query;
    },
    created() {
      this.getStepEventList();
    }
  };
</script>
<style lang="less" rel="stylesheet/stylus">
  @import "../../../assets/styles/color.less";
  #oneThingSituationConfigInfos {
    .el-form-item__content {
      text-align: left;
    }

    overflow-y: auto;
    height: 100%;
    background-color: #fff;

    .title-top {
      height: 42px;
      border-bottom: 1px dashed #d8d8d8;
      position: relative;
      z-index: 100;
    }
    .title-top .title-left {
      display: inline-block;
      position: relative;
      height: 25px;
      vertical-align: middle;
    }

    .title-left {
      .title-ell {
        display: inline-block;
        max-width: 850px;
      }
      .t-div {
        display: inline-block;
        width: 7px;
        height: 100%;
        background-color: #078fea;
        vertical-align: middle;
      }

      span:last-child {
        font-size: 14px;
        font-weight: 1000;
        vertical-align: middle;
      }
    }
    .radio-wrap{
        padding: 20px;
        // padding-top: 0;
        height: 100%;
        padding-top: 42px;
        margin-top: -42px;
      }
      .radio-wrap.mtTab{
        padding-top: 93px;
        margin-top: -93px;
      }
    .switch-navigate {
      height: 43px;
      line-height: 43px;
      font-size: 13px;
      // border: 1px solid #e4e4e4;
        background: #fff;
        position: relative;
        z-index: 100;
    }

    .switch-navigate p {
      text-align: center;
      width: 133px;
      height: 100%;
    }

    .switch-navigate p:last-child {
      position: relative;
      left: -5px;
    }

    // .switch-default {
    //   background-color: #f2f2f2;
    //   color: #5e5e5e;
    // }

    .a-color-red {
      a {
        color: #288ff4;
      }
    }

    .selected {
      background-color: #1683c8;
      color: #fffffc !important;
    }

    .des {
      height: 25px;
      line-height: 25px;
      span {
        color: red;
      }
    }
    .tabs {
      font-size: 14px;
      // border-bottom: 1px dashed #d8d8d8;
      .tabs-bar {
          .radio-group {
          margin: 15px 100px 0 35px;
          font-size: 0;
          .switch-default {
              padding: 0 12px;
              margin-right: 5px;
              display: inline-block;
              height: 35px;
              width: 126px;
              // background-color: #eef1f7;
              line-height: 35px;
              text-align: center;
              cursor: pointer;
              color: #515a6e;
              box-sizing: border-box;
              &.cur {
                  margin-bottom: -1px;
                  background-color: #fff;
                  border-bottom: 2px solid #2d8cf0;
                  // border-left: 1px solid #e4e4e4;
                  // border-right: 1px solid #e4e4e4;
                  line-height: 33px;
                  color: #515a6e;
              }
              &.last {
                  margin-right: 0px;
              }
          }
          .ivu-icon {
              float: left;
              line-height: 36px;
              font-size: 18px;
              cursor: pointer;
              &.ivu-icon-ios-arrow-forward {
                  float: right;
              }
          }
          .radio-sub-wrap {
              float: left;
              // display: inline-block;
              overflow: hidden;
              height: 36px;
              white-space: nowrap;
          }
          &.switch-navigate {
              // overflow: hidden;
              height: 36px;
              line-height: 36px;
              border-bottom: 1px solid #e4e4e4;
          }
      }
      .mtb10 {
          margin: 10px 0;
      }
      //   text-align: left;
      //   .tabs-tab {
      //     display: inline-block;
      //     padding: 4px 16px;
      //     background: #fff;
      //     cursor: pointer;
      //     position: relative;
      //   }
      //   .tabs-tab-active {
      //     color: @baseColor;
      //     border-bottom: 2px solid @baseColor;
      //   }
      // }
      // .tabs-bar:after {
      //   content: '';
      //   display: block;
      //   width: 100%;
      //   height: 0px;
      //   background: #d7dde4;
      //   margin-top: -1px;
      // }
      // .tabs-content {
      //   padding: 8px 0;
      }
    }
  }

</style>
