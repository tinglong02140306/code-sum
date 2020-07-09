/*
 * @Author: kkfan2 
 * @Date: 2018-10-22 14:52:45 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-10 21:19:50
 * @description: 一件事详情
 */
<template>
    <div id="eventDetails">
        <div class="container">
            <!-- <div class="detail-title">{{titleName}}</div> -->
            <div class="detail-title text-one">
                <span class="inline-block detail-title-font ell font-max" :title="titleName"> {{titleName}} </span>
                <!-- <div class="btn-group ml10 inline-block">
                    <Button size="small" class="cursor-p w80" @click="$router.back(-1)">
                        <i class="iconfont icon-back"></i>
                        <span class="font-min">返回</span>
                    </Button>
                </div> -->
            </div>
            <div class="tab-btn-wrap">
              <div class="tab-wrap switch-navigate w100_">
                <span class="switch-default font-min ml20" @click="navClick('0')" :class="curIndex == 0 ? 'cur-selected' : ''">导览图</span>
                <span class="switch-default font-min br ml5" @click="navClick('1')" :class="curIndex == 1 ? 'cur-selected' : ''">事项列表</span>
                <div class="btn-wrap inline-block h30 fr">
                    <el-button class="btn h30 step5" @click="printReceipt">打印回执单</el-button>
                    <el-button class="btn mr10 h30 step5" @click="printCirculation">打印流转单</el-button>
                </div>
              </div>
            </div>
            <!-- <div class="nav">
                <span class="nav-item" @click="navClick('0')" :class="curIndex == 0 ? 'selected' : ''">导览图</span>
                <span class="nav-item" @click="navClick('1')" :class="curIndex == 1 ? 'selected' : ''">事项列表</span>
                <div class="btn-wrap inline-block h30 fr">
                    <el-button class="btn h30 step5">打印回执单</el-button>
                    <el-button class="btn mr10 h30 step5">打印流转单</el-button>
                </div>
            </div> -->
            <!-- <div class="flow-chart" :class="{clickStat: clickStat}" v-if="viewDisplayDate.status"> -->
            <div class="flow-chart" v-show="viewDisplayDate.status">
                <div class="tj-content" ref="content">
                    <!--右上角tip提示-->
                    <div class="tip">
                        <p class="tip1"></p>
                        <span>已选事项</span>
                        <p class="tip2"></p>
                        <span>未选事项</span>
                    </div>
                    <!--tab切换以及渲染数据-->
                    <div class="tabs" v-if="treeData.eventMatterList.length > 1">
                        <!-- <div class="tabs-bar">
                            <div :class="tabCls(index)" v-for="(item,index) in treeData.eventMatterList" @click="tabClick(index)">
                                {{item.subStageName}}
                            </div>
                        </div> -->
                        <div class="radio-group switch-navigate mt10">
                            <Icon type="ios-arrow-back" @click="scrollPre" v-if="showBtn" />
                            <div class="radio-sub-wrap" :style="{width: subWrapWid}">
                                <div class="radio-sub" :style="{width: subWid}">
                                    <span class="switch-default ell font-min" v-for="(item ,index) in treeData.eventMatterList" :key="index" :value="index" :class="{cur:curTabIndex==index, last: index+1==treeData.eventMatterList.length}" :title="item.subStageName" @click="tabClick(index)">{{item.subStageName}}</span>
                                </div>
                            </div>
                            <Icon type="ios-arrow-forward" @click="scrollNext" v-if="showBtn" />
                        </div>
                        <!-- <Tabs type="card">
                            <TabPane  v-for="(item,index) in treeData.eventMatterList" :key="index" on-click="tabClick(index)" :label="item.subStageName" :title="item.subStageName"></TabPane>
                        </Tabs> -->
                        <div class="tabs-content flow-wrap" :class="isIE9 ? 'is-ie9-auto': ''">
                            <div class="pane" v-for="(item,index) in treeData.eventMatterList" v-show="isFirst ? isFirst : index == curTabIndex">
                                <flowChart ref="flowChart" :width="treeData.tabW" :index="index" :defaultSelectMatter="defaultSelectMatter"/>
                            </div>
                        </div>
                    </div>
                    <div class="flow-wrap" v-if="treeData.eventMatterList.length == 1" :class="isIE9 ? 'is-ie9-auto': ''">
                      <flowChart ref="flowChart" :width="treeData.tabW" :index="0" :defaultSelectMatter="defaultSelectMatter"/>
                    </div>
                    <!-- <flowChart v-else ref="flowChart" :width="treeData.tabW" :index="0" :defaultSelectMatter="defaultSelectMatter"/> -->

                    <!--导览图说明-->
                    <div class="description">
                        <p>说明：</p>
                        <p v-html="treeData.remark"></p>
                    </div>
                </div>
            </div>
            <div class="matter-list" v-if="!viewDisplayDate.status">
                <Table class="matter-table" border :columns="columns1" :data="data1"></Table>
            </div>
        </div>
    </div>
</template>

<script>
import unit from "@/api/index";
import flowChart from "@/pages/consigneeCenter/oneThingReceiveFile/flowChart.vue";
export default {
  components: {
    flowChart: flowChart
  },
  data() {
    let that = this;
    return {
      ind: 1,
      receiptNo: "",
      titleName: "",
      formItem: {
        // 办理对象
      },
      viewDisplayDate: {
        status: true
      },
      valueItem: {},
      res: "",
      showBtn: false,  //是否显示按钮
      showLastBtn: true,  // 是否显示上一步按钮
      subWid: '100%',
      subWrapWid: '96%',
      distance: 0,
      tabIndex: '0',  // 流程图tab切换index值
      treeData: { // 树形图数据
          tabW: 1200,
          eventMatterList: [],
      },


      columns1: [
        //事件头部
        {
          title: "序号",
          key: "receiptNo",
          align: "center",
          ellipsis: "true",
          type: "index",
          width: 100,
          render: (h, params, index) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "60px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  // domProps: {
                  //   title: this.ind++
                  // }
                },
                that.ind
              )
            ]);
          }
        },
        {
          title: "事项名称",
          key: "recObjectName",
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    color: "#2d8cf0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    cursor: 'pointer',
                    textAlign: 'left'
                  },
                  domProps: {
                    title: params.row.recObjectName.length > 20 ? params.row.recObjectName : '',
                    id: params.row.receiptNo,
                    click: "openRecordView()"
                  },
                  on: {
                    click: e => {
                      // unit.openNewDialog(
                      //   this,
                      //   '/myReceipt/receiptDetails?id=' + params.row.id +'&recriptType='+ params.row.type
                      // );
                      this.$router.push(
                        {
                            path: '/myReceipt/eventReceiptDetails',
                            query: {
                                id: params.row.id,
                                recriptType: params.row.type,
                                jointStatus: params.row.jointStatus,
                                receiptNo: params.row.realRecNo,
                                type: '4'
                            }
                        }
                    );
                    }
                  }
                },
                params.row.recObjectName
              )
            ]);
          }
        },
        {
          title: "部门",
          key: "deptName",
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: 'left'
                  },
                  domProps: {
                    title: params.row.deptName.length > 20 ? params.row.deptName : ''
                  }
                },
                params.row.deptName
              )
            ]);
          }
        },
        {
          title: "承诺时限",
          key: "commitTime",
          align: "center",
          render: (h, params) => {
            let commitTime = (params.row.commitTime=='' || params.row.commitTime == null) ? '即办' : params.row.commitTime + '工作日';
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  // domProps: {
                  //   title: commitTime
                  // }
                },
                commitTime
              )
            ]);
          }
        }
      ],
      data1: [],
      curIndex: "0",

      isFirst: true, //是否第一次登录
      curTabIndex: 0, //记录当前tab页
      treeData: {
        tabW: 0,
        eventMatterList: []
      },
      isIE9: false,
    };
  },
  computed: {},
  methods: {
    /**
     * 返回
     */
    backEvent() {
        // window.location.href = '/bog-receive-web/index.html#/searchMatters';
        window.location.href = history.back(-1);
    },
    /**
     * 打印回执单
     */
    printReceipt() {
      let that = this,
          param = that.$route.query,
          url = that.$store.state.path + '/consignee/printReceipt?id=' + param.receiptNo + '&type=' + param.recriptType;
      unit.openFullWindow(url, '');
    },
    /**
     * 打印流转单
     */
    printCirculation() {
      let that = this,
          param = that.$route.query,
          url = this.$store.state.path + '/consignee/printFlow?id='  + param.receiptNo + '&type=' + param.recriptType;
      unit.openFullWindow(url, '');
    },
    //记录初始默认高亮（必须提供）的事项
    defaultSelectMatter(child) {
      // this.matterSelectList.push(child);
    },
    navClick: function(index) {
      let _that = this;
      _that.curIndex = index;
      if (index == 1) {
        this.viewDisplayDate.status = 0;
        let params = this.$route.query || {},
          id = params.id;
        unit.ajaxMerPost(
          "/znsj-web/myReceipt/eventMatterList",
          {
            id: id
          },
          function(res) {
            _that.data1 = res.data;
          },
          function(res) {
            _that.$Message.error("数据请求失败");
          },
          this
        );
      } else {
        this.viewDisplayDate.status = 1;
      }
    },
    handleSubmit(name) {
      let _that = this,
        url = "/znsj-web/myReceipt/recordDetails";
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)",
        customClass: "el-mask"
      });
      unit.ajaxMerPost(
        url,
        name,
        function(res) {
          loading.close();
          if (res.flag) {
            _that.res = res.data;
          }
          return;
        },
        function(res) {
          loading.close();
          _that.$message.warning("服务端错误");
          return;
        },
        _that
      );
    },
    /*
      * tab向前移动
      */
    scrollPre() {
        this.distance -= 140;
        $('.radio-sub-wrap').scrollLeft(this.distance);
        if (this.distance < 0) {
            this.distance = 0;
        }
    },
    /*
      * tab向后移动
      */
    scrollNext() {
        let maxWid = this.subWid.substr(0, this.subWid.length - 2) - this.subWrapWid.substr(0, this.subWid.length - 2);
        this.distance += 140;
        $('.radio-sub-wrap').scrollLeft(this.distance);
        if (this.distance > maxWid) {
            this.distance = maxWid;
        }
    },
    /*
      * 计算宽度
      */
    cupWidth() {
        let that = this,
            len = that.treeData.eventMatterList.length,
            distanceRight = 0,
            allWid = $('.radio-group').length > 0 ? $('.radio-group')[0].offsetWidth : 0,
            subWrapWid = 0,
            subWid = 0,
            $dom = $('.switch-default');
        for (let i = 0; i < len; i++) {
            subWid +=  $($dom[i]).length > 0 ? $dom[i].offsetWidth : 0;
            distanceRight += 5;
        }
        if (subWid > allWid) {
            that.showBtn = true;
            subWrapWid = allWid - 36;
        } else {
            that.showBtn = false;
            subWrapWid = allWid;
        }
        if(len >= 6) {
            that.showBtn = true;
        }else {
            that.showBtn = false;
        }
        that.subWrapWid = 840 + 'px';
        that.subWid = subWid + 1 + distanceRight - 5 + 'px';

    },
    tabCls(index) {
      return [
        "tabs-tab",
        {
          "tabs-tab-active": index === this.curTabIndex
        }
      ];
    },
    //tab点击事件
    tabClick(index) {
      if (this.curTabIndex != index) {
        this.curTabIndex = index;
        this.isFirst = false;
      }
    },
    mergeJsonObject: function(jsonbject1, jsonbject2) {
      var resultJsonObject = {};
      for (var attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
      }
      for (var attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr];
      }
      return resultJsonObject;
    },
    //获取数据
    getGuideMapData(id) {
      let self = this;
      unit.ajaxMerPost(
        "/znsj-web/myReceipt/recordEvent",
        {
          id: id
        },
        function(res) {
          self.treeData = res.data;
          self.titleName = res.data.eventName;
          self.receiptNo = res.data.receiptNo;
          
          // for(let i = 0; i < res.data.eventMatterList.length; i++) {
          //     //$.extend(true, self.data1, res.data.eventMatterList[i].children);
          //     for(let j = 0; j<res.data.eventMatterList[i].children.length;j++) {
          //         self.data1.push(res.data.eventMatterList[i].children[j]);
          //     }
          // }
          //设置导览图宽度
          let tabW = self.$refs.content.offsetWidth;
          self.treeData.tabW = tabW - 32;

          //渲染页面
          self.$nextTick(() => {
            if (self.treeData.eventMatterList.length == 1) {
              self.$refs.flowChart.setWidthAndReset(
                self.treeData.eventMatterList[0],
                0
              );
              if(self.treeData.eventMatterList[0].flag) {
                if(res.data.ids != null && res.data.ids != '') {
                  let ids = res.data.ids.split(",");
                  for (id in ids) {
                    self.$refs.flowChart.highlightNode(ids[id]);
                  }
                }
              }
            } else if (self.treeData.eventMatterList.length > 1) {
              self.$refs.flowChart.forEach(function(flowChart, index) {
                flowChart.setWidthAndReset(
                  self.treeData.eventMatterList[index],
                  index
                );

                if(self.treeData.eventMatterList[index].flag) {
                  if(res.data.ids != null && res.data.ids != '') {
                    let ids = res.data.ids.split(",");
                    for (id in ids) {
                      flowChart.highlightNode(ids[id]);
                    }
                  }
                }
                
              });
              self.isFirst = false;
              setTimeout(() => {
                  self.$nextTick(function() {
                        self.cupWidth();
                    });
              }, 0);
            }
          });
          
        },
        function(res) {
          self.$Message.error("数据请求失败");
        },
        this
      );
    }
  },
  // dom渲染后
  mounted: function() {
    let that = this,
        params = this.$route.query || {},
        id = params.id;
    // let data = {
    //     id: id
    // };
    // console.log(data);
    // this.handleSubmit(data);
    that.isIE9 = unit.isIE9();
    this.getGuideMapData(id);
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/theme.less";
#eventDetails {
    overflow: auto;
    min-width: 900px;
    height: 100%;
    background-color: #fff;
    padding:15px 0 0 25px;
    .container {
      padding-right: 30px;
    }
  .detail-title {
        margin: 15px 0;
        padding-left: 5px;
        height: 32px;
        width: 100%;
        .detail-title-font {
            height: 24px;
            max-width: 800px;
            color: #333;
            font-weight: 600;
            border-left: 5px solid #09f;
            text-indent: 8px;
            line-height: 24px;
        }
        .btn-group {
            position: relative;
            z-index: 10;
            top: -5px;
        }
  }
  //导览图
  .tj-content {
    position: relative;
    // padding-left: 15px;
    color: #333;
    text-align: center;
    .tabs-content {
      padding: 8px 0;
    }
    .flow-wrap {
      margin: 25px 0;
      width: 100%;
      // height: 250px;
      overflow-x:hidden;
    }
    .is-ie9-auto {
      height: 250px;
      overflow: auto;
    }
    flowChart {
      margin-bottom: 10px;
      width: 100%;
    }
    .tip {
      position: absolute;
      top: 0;
      right: 50px;
      height: 30px;
      line-height: 30px;
      .tip1 {
        display: inline-block;
        width: 20px;
        height: 15px;
        background: #2d8cf0;
        border-radius: 3px;
        vertical-align: middle;
      }
      .tip2 {
        display: inline-block;
        width: 20px;
        height: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-left: 20px;
        vertical-align: middle;
      }
    }
  }
  .description {
    text-align: left;
    width: 100%;
    background: #f2f2f2;
    padding: 20px;
    margin-bottom: 20px;
    /*margin-top: -50px;*/
  }
  .tabs {
    font-size: 14px;
    .tabs-bar {
      text-align: left;
      .tabs-tab {
        display: inline-block;
        padding: 4px 16px;
        background: #fff;
        cursor: pointer;
        position: relative;
        max-width: 100px;
      }
      .text {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          vertical-align: middle;
      }
      .tabs-tab-active {
        color: #1255b3;
        border-bottom: 2px solid #1255b3;
      }
    }
    .tabs-bar:after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background: #d7dde4;
      margin-top: -1px;
    }
    .tabs-content {
      padding: 8px 0;
    }
  }
  .matter-list {
    width: 100%;
    min-height: 400px;
    .matter-table {
      margin-top: 20px;
    }
  }

  .radio-group {
    margin: 15px 0px 0 35px;
    font-size: 0;
    .switch-default {
        padding: 0 12px;
        margin-right: 5px;
        display: inline-block;
        height: 35px;
        width: 140px;
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
        margin-right: 10px;
        &.ivu-icon-ios-arrow-forward {
            margin-left: 10px;
        }
    }
    .radio-sub-wrap {
        float: left;
        display: inline-block;
        overflow: hidden;
        height: 36px;
        white-space: nowrap;
        text-align: left;
        max-width: 890px;
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
  .tab-btn-wrap {
        margin: 10px 0;
        height: 37px;
        border-bottom: 1px solid #e4e4e4;
        .tab-wrap {
            float:left;
            height: 26px;
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