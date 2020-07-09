/*
* @Author: gaoxiong
* @Date: 2018-10-08 09:00:00
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-12-15 16:53:23
* @description 一件事情形引导
*/
<template>
  <div id="oneThingGuidance">
    <div class="nav-wrap">
      <slideNav2 :step="step" :status="navStatus"></slideNav2>
    </div>
    <!-- 头部标题部分 -->
    <div class="case-guid-head">
      <detailHead :titles="titles" :isBackShow="true"></detailHead>
    </div>
    <div class="one-thing-guidance-wrap">
      <div class="head">
        <detailHead :subTitle="tjSubTitle" :isClick="headIsClick" @iconClick="iconClick"></detailHead>
      </div>
      <!--导览图-->
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
          <div class="tabs-bar">
            <!-- <div :class="tabCls(index)" v-for="(item,index) in treeData.eventMatterList" @click="tabClick(index)"
                 :title="item.subStageName">
              {{item.subStageName}}
            </div> -->
            <div class="radio-group switch-navigate mt10" style="width: 880px">
              <Icon type="ios-arrow-back" @click="scrollPre" v-if="showBtn" />
              <div class="radio-sub-wrap" :style="{width: subWrapWid}">
                <div class="radio-sub" :style="{width: subWid}">
                  <!-- :style="{width: subWid}" -->
                  <span class="switch-default ell font-min" v-for="(item ,index) in treeData.eventMatterList" :key="index" :value="index" :class="tabCls(index)" :title="item.subStageName" @click="tabClick(index)">{{item.subStageName}}</span>
                </div>
              </div>
              <Icon type="ios-arrow-forward" @click="scrollNext" v-if="showBtn" />
            </div>
          </div>
          <div class="tabs-content flow-wrap" :class="isIE9 ? 'is-ie9-auto': ''">
            <div class="pane" v-for="(item,index) in treeData.eventMatterList" v-show="isFirst ? isFirst : index == curTabIndex">
              <emptyPage v-show="item.children == null"></emptyPage>
              <flowChart v-show="item.children != null" ref="flowChart" :width="treeData.tabW" :index="index" :defaultSelectMatter="defaultSelectMatter" />
            </div>
          </div>
        </div>
        <div class="flow-wrap" v-if="treeData.eventMatterList.length == 1" :class="isIE9 ? 'is-ie9-auto': ''">
          <flowChart ref="flowChart" :width="treeData.tabW" :index="0" :defaultSelectMatter="defaultSelectMatter" />
        </div>
        <emptyPage v-else-if="treeData.eventMatterList.length == 0"></emptyPage>

        <!--导览图说明-->
        <div class="description mt10">
          <p>说明：</p>
          <p v-html="treeData.remark"></p>
        </div>
      </div>
      <!-- 情形引导内容 -->
      <div class="head" v-for="(parent,index) in treeData.eventMatterList" v-show="parent.situationList && parent.situationList.length != 0 && index == curTabIndex">
        <detailHead :subTitle="qxSubTitle"></detailHead>
        <div class="qx-content">
          <Form ref="formDynamic" :model="parent" label-position="top">
            <FormItem v-for="(item, index) in parent.situationList" :key="index" :label="item.classifyName" prop="name" :rules="{required: true, message: '请选择' + item.name, trigger: 'change'}" :show-message="showMes">
              <RadioGroup v-model="item.value" @on-change="radioEventChange(item, parent.children, treeData, true)" v-if="item.isMulti==0">
                <Radio :label="obj.answerCode" v-for="(obj, i) in item.answerList" :disabled="item.isMultiTrue||item.disaAns">
                  {{obj.answerName}}
                </Radio>
              </RadioGroup>
              <CheckboxGroup v-model="item.value" @on-change="checkboxEventChange(item, parent.children, treeData, true)" v-else>
                <Checkbox :label="obj.answerCode" v-for="(obj, i) in item.answerList" :disabled="item.isMultiTrue||obj.defaultSelect==1">
                  {{obj.answerName}}
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Form>
        </div>
      </div>
      <!-- 按钮部分 -->
      <div class="btn-wrap">
        <i-button class="step" type="primary" v-show="treeData.eventMatterList.length && treeData.eventMatterList[curTabIndex].matterSelectList.length" @click="handleSubmit('formDynamic')">下一步</i-button>
      </div>
    </div>

  </div>
</template>
<script>
import slideNav2 from "@/components/common/slideNav2";
import detailHead from "@/components/common/detailHead";   // 公共
import flowChart from "@/pages/consigneeCenter/oneThingReceiveFile/flowChart.vue";
import util from "@/api";
import emptyPage from "@/components/common/emptyPage";   // 缺省页

export default {
  components: {
    slideNav2,
    flowChart: flowChart,
    detailHead: detailHead,
    emptyPage: emptyPage
  },
  data() {
    return {
      isFirst: true,//是否第一次登录
      // 导航面板的状态
      step: 0,
      navStatus: '1',
      titles: '标题',
      tjSubTitle: '主题式服务事项导览图',
      headIsClick: true,
      //树形图数据
      treeData: {
        tabW: 0,
        eventMatterList: []
      },
      curTabIndex: 0,//记录当前tab页
      qxSubTitle: '情形引导',
      showMes: false,
      showBtn: false,  //是否显示按钮
      // showLastBtn: true,  // 是否显示上一步按钮
      subWid: '100%',
      subWrapWid: '96%',
      distance: 0,
      isIE9: false
    };
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
        len = that.treeData.eventMatterList.length,
        distanceRight = 0,
        allWid = $('.radio-group').length > 0 ? $('.radio-group')[0].offsetWidth : 0,
        subWrapWid = 0,
        subWid = 0,
        $dom = $('.switch-default');
      for (let i = 0; i < len; i++) {
        subWid += $($dom[i]).length > 0 ? $dom[i].offsetWidth : 0;
        distanceRight += 5;
      }
      if (subWid > allWid) {
        that.showBtn = true;
        subWrapWid = allWid - 36;
      } else {
        that.showBtn = false;
        subWrapWid = allWid;
      }

      if (len >= 7) {
        that.showBtn = true;
      } else {
        that.showBtn = false;
      }
      that.subWrapWid = 840 + 'px';
      that.subWid = subWid + 1 + distanceRight - 5 + 'px';
    },
    iconClick(e, val) {
      $(e.currentTarget).closest('.head').next().slideToggle();
    },
    //获取数据
    getGuideMapData() {
      let self = this;
      util.ajaxMerPost('/znsj-web/consignee/event/create', {
        id: /*'20181022001'*/this.$parent.param.id
      }, function (res) {
        // 处理情形引导数据，有数据是默认选中
        for (var i = 0; res.data && i < res.data.eventMatterList.length; i++) {
          res.data.eventMatterList[i].matterSelectList = [];
          for (var j = 0; res.data.eventMatterList[i].situationList && j < res.data.eventMatterList[i].situationList.length; j++) {
            let situationList = res.data.eventMatterList[i].situationList;
            if (situationList[j].isMulti == '2') {
              situationList[j].isMultiTrue = true;
              situationList[j].value = [];
              for (var k = 0; k < situationList[j].answerList.length; k++) {
                situationList[j].value.push(situationList[j].answerList[k].answerCode);
              }
            } else {
              if (situationList[j].isMulti == '0') {
                for (var k = 0; k < situationList[j].answerList.length; k++) {
                  if (situationList[j].answerList[k].defaultSelect == '1') {
                    situationList[j].value = situationList[j].answerList[k].answerCode;
                    situationList[j].disaAns = true;
                  }
                }
              } else {
                situationList[j].value = [];
                for (var k = 0; k < situationList[j].answerList.length; k++) {
                  if (situationList[j].answerList[k].defaultSelect == '1') {
                    situationList[j].value.push(situationList[j].answerList[k].answerCode);
                    situationList[j].disaAns = true;
                  }
                }
              }
              situationList[j].isMultiTrue = false;
            }
            // 默认选中的题目记录关联的事项以及改变事项状态
            if (typeof situationList[j].value == 'object') {
              if (situationList[j].value.length > 0) {
                self.checkboxEventChange(situationList[j], res.data.eventMatterList[i].children, res.data, false);
              }
            } else {
              if (situationList[j].value) {
                self.radioEventChange(situationList[j], res.data.eventMatterList[i].children, res.data, false);
              }
            }
          }
        }

        self.treeData = res.data;
        self.titles = res.data.eventName;

        //设置导览图宽度
        let tabW = self.$refs.content.offsetWidth;
        self.treeData.tabW = tabW - 15;
        //渲染导览图页面
        self.$nextTick(() => {
          if (self.treeData.eventMatterList.length == 1) {
            self.$refs.flowChart.setWidthAndReset(self.treeData.eventMatterList[0], 0);
            self.treeData.tabW = 1200;
          } else if (self.treeData.eventMatterList.length > 1) {
            for (var i = 0; i < self.$refs.flowChart.length; i++) {
              self.$refs.flowChart[i].setWidthAndReset(self.treeData.eventMatterList[i], i);
            }
            setTimeout(() => {
              self.$nextTick(function() {
                  self.cupWidth();
              });
            }, 0);
          }
          self.isFirst = false;
        });
      }, function (res) {
        self.$Message.error('数据请求失败');
      }, this);
    },
    tabCls(index) {
      return [
        'tabs-tab', 'ell', {
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
    //下一步提交
    handleSubmit(name) {
      let flag = this.verFrom(this.treeData.eventMatterList[this.curTabIndex]);
      if (flag) {
        var params = {
          receiptNo: this.treeData.receiptNo,
          matterSelectList: this.treeData.eventMatterList[this.curTabIndex] ? this.treeData.eventMatterList[this.curTabIndex].matterSelectList : []
        }
        this.saveCond(params);
      }
    },
    // form校验
    verFrom(form) {
      if (form && form.situationList) {
        let i,
          situation = form.situationList,
          len = situation.length;
        for (i = 0; i < len; i++) {
          if (typeof situation[i].value == 'object' && situation[i].value.length == 0) {
            this.$Message.error('请选择' + situation[i].classifyName);
            return false;
          } else if (typeof situation[i].value == 'string' && situation[i].value == '') {
            this.$Message.error('请选择' + situation[i].classifyName);
            return false;
          } else if (situation[i].value == undefined) {
            this.$Message.error('请选择' + situation[i].classifyName);
            return false;
          }
        }
      }
      return true;
    },
    //保存情形引导
    saveCond(obj) {
      let self = this;
      util.ajaxObjPost('/znsj-web/consignee/event/saveSelectMatter', obj, function (res) {
        self.$Message.success("操作成功");
        self.$emit('go', 'thingBill', {
          eventsTitle: self.titles,
          eventReceiptNo: self.treeData.receiptNo
        })
      }, function (res) {
        self.$Message.error(res.data.errMsg);
      }, this);
    },
    radioEventChange(item, children, treeData, isClick) {
      // 将答案关联的事项找出来
      var selectChild;
      for (var i = 0; i < children.length; i++) {
        if (item.value == children[i].answerCode) {
          if (this.isFirst) {
            children[i].isDefaultHight = true;
          } else {
            selectChild = children[i];
          }
          break;
        }
      }

      // 有就高亮，没有就通过兄弟答案找出来置灰
      if (selectChild) {
        if (selectChild.pzType != '01') {
          // 高亮并记录
          if (treeData.eventMatterList.length == 1) {
            this.$refs.flowChart.highlightNode(selectChild.id);
            treeData.eventMatterList[this.curTabIndex].matterSelectList.push(selectChild);
          } else if (treeData.eventMatterList.length > 1) {
            this.$refs.flowChart[this.curTabIndex].highlightNode(selectChild.id);
            treeData.eventMatterList[this.curTabIndex].matterSelectList.push(selectChild);
          }
        }
      } else {
        for (var j = 0; j < item.answerList.length; j++) {
          if (item.answerList[j].answerCode) {
            for (var k = 0; k < treeData.eventMatterList[this.curTabIndex].matterSelectList.length; k++) {
              if (treeData.eventMatterList[this.curTabIndex].matterSelectList[k].pzType != '01') {
                if (item.answerList[j].answerCode == treeData.eventMatterList[this.curTabIndex].matterSelectList[k].answerCode) {
                  // 反选并移除
                  if (treeData.eventMatterList.length == 1) {
                    this.$refs.flowChart.resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[k].id);
                    if (k == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                      k = k - 1;
                    }
                  } else if (treeData.eventMatterList.length > 1) {
                    this.$refs.flowChart[this.curTabIndex].resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[k].id);
                    if (k == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                      k = k - 1;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }
      if (isClick) {
        this.classAnsList(item);
      }
    },
    checkboxEventChange(item, children, treeData, isClick) {
      if (item.value.length > 0) {
        // 先全都删除
        for (var a = 0; a < item.answerList.length; a++) {
          if (item.answerList[a].answerCode) {
            for (var b = 0; b < treeData.eventMatterList[this.curTabIndex].matterSelectList.length; b++) {
              if (treeData.eventMatterList[this.curTabIndex].matterSelectList[b].pzType != '01') {
                if (item.answerList[a].answerCode == treeData.eventMatterList[this.curTabIndex].matterSelectList[b].answerCode) {
                  // 反选并移除
                  if (treeData.eventMatterList.length == 1) {
                    this.$refs.flowChart.resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[b].id);
                    if (b == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(b, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(b, 1);
                      b = b - 1;
                    }
                  } else if (treeData.eventMatterList.length > 1) {
                    this.$refs.flowChart[this.curTabIndex].resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[b].id);
                    if (b == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(b, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(b, 1);
                      b = b - 1;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
        // 再重新添加
        for (var x = 0; x < item.value.length; x++) {
          for (var y = 0; y < item.answerList.length; y++) {
            if (item.value[x] == item.answerList[y].answerCode) {
              for (var z = 0; z < children.length; z++) {
                if (item.answerList[y].answerCode == children[z].answerCode) {
                  if (this.isFirst) {
                    children[z].isDefaultHight = true;
                  } else {
                    if (children[z].pzType != '01') {
                      // 高亮并记录
                      if (treeData.eventMatterList.length == 1) {
                        this.$refs.flowChart.highlightNode(children[z].id);
                        treeData.eventMatterList[this.curTabIndex].matterSelectList.push(children[z]);
                      } else if (treeData.eventMatterList.length > 1) {
                        this.$refs.flowChart[this.curTabIndex].highlightNode(children[z].id);
                        treeData.eventMatterList[this.curTabIndex].matterSelectList.push(children[z]);
                      }
                      break;
                    }
                  }
                }
              }
              break;
            }
          }
        }
      } else {
        for (var j = 0; j < item.answerList.length; j++) {
          if (item.answerList[j].answerCode) {
            for (var k = 0; k < treeData.eventMatterList[this.curTabIndex].matterSelectList.length; k++) {
              if (treeData.eventMatterList[this.curTabIndex].matterSelectList[k].pzType != '01') {
                if (item.answerList[j].answerCode == treeData.eventMatterList[this.curTabIndex].matterSelectList[k].answerCode) {
                  // 反选并移除
                  if (treeData.eventMatterList.length == 1) {
                    this.$refs.flowChart.resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[k].id);
                    if (k == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                      k = k - 1;
                    }
                  } else if (treeData.eventMatterList.length > 1) {
                    this.$refs.flowChart[this.curTabIndex].resetNode(treeData.eventMatterList[this.curTabIndex].matterSelectList[k].id);
                    if (k == treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                    } else {
                      treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(k, 1);
                      k = k - 1;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }
      if (isClick) {
        // 通过答案获取下一题的数据
        this.classAnsList(item);
      }
    },
    /*递归删除题目后代数据*/
    removeChild(firstChild, temp) {
      if (typeof firstChild.value == 'object') { // checkBox
        for (var j = 0; j < firstChild.value.length; j++) {
          firstChild.answer = firstChild.value[j];
          firstChild.answerId = this.getAnswerId(firstChild.answerList, firstChild.answer);
          for (var i = 0; i < temp.length; i++) {
            let x = temp[i];
            if (firstChild.answerId) {
              if (firstChild.answerId == x.situationParentId) {
                temp.splice(i, 1);
                i = i - 1;
                this.removeChild(x, temp);
              }
            } else {
              if (firstChild.id == x.parentId) {
                temp.splice(i, 1);
                i = i - 1;
                this.removeChild(x, temp);
              }
            }
          }
        }
      } else {//radio
        for (var i = 0; i < temp.length; i++) {
          let x = temp[i];
          if (firstChild.answerId) {
            if (firstChild.answerId == x.situationParentId) {
              temp.splice(i, 1);
              i = i - 1;
              this.removeChild(x, temp);
            }
          } else {
            if (firstChild.id == x.parentId) {
              temp.splice(i, 1);
              i = i - 1;
              this.removeChild(x, temp);
            }
          }
        }
      }
    },
    //情形引导
    classAnsList(obj) {
      let $this = this;
      let situation = $this.treeData.eventMatterList[$this.curTabIndex].situationList;
      let firstChild;//找到第一个child
      let removeAnswerId = [];//找到并记录不应该出现的answer(没有选中的都不应该出现)

      if (typeof obj.value == 'object') { // checkBox
        for (var i = 0; i < obj.answerList.length; i++) {
          let answerCode = obj.answerList[i].answerCode;
          let isCanPush = true;
          for (var j = 0; j < obj.value.length; j++) {
            if (obj.value[j] == answerCode) {
              isCanPush = false;
              break;
            }
          }
          if (isCanPush) {
            removeAnswerId.push(obj.answerList[i].situationId)
          }
        }
      } else { // radio
        for (var i = 0; i < obj.answerList.length; i++) {
          if (obj.answerList[i].answerCode != obj.value) {
            removeAnswerId.push(obj.answerList[i].situationId)
          }
        }
      }

      for (var i = 0; i < situation.length; i++) {
        for (var j = 0; j < removeAnswerId.length; j++) {
          // 如果不是父子关系,保留
          if (situation[i].situationParentId != removeAnswerId[j]) {
          } else {//递归删除相关数据
            firstChild = situation[i];
            situation.splice(i, 1);
            i = i - 1;
            $this.removeChild(firstChild, situation);
          }
        }
      }

      //移除所有因情形高亮的块
      for (var a = 0; a < this.treeData.eventMatterList[this.curTabIndex].matterSelectList.length; a++) {
        if (this.treeData.eventMatterList[this.curTabIndex].matterSelectList[a].pzType != '01') {
          if (this.treeData.eventMatterList.length == 1) {
            this.$refs.flowChart.resetNode(this.treeData.eventMatterList[this.curTabIndex].matterSelectList[a].id);
            if (a == this.treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
              this.treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(a, 1);
            } else {
              this.treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(a, 1);
              a = a - 1;
            }
          } else if (this.treeData.eventMatterList.length > 1) {
            this.$refs.flowChart[this.curTabIndex].resetNode(this.treeData.eventMatterList[this.curTabIndex].matterSelectList[a].id);
            if (a == this.treeData.eventMatterList[this.curTabIndex].matterSelectList.length - 1) {
              this.treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(a, 1);
            } else {
              this.treeData.eventMatterList[this.curTabIndex].matterSelectList.splice(a, 1);
              a = a - 1;
            }
          }
        }
      }
      // 重新添加
      for (var b = 0; b < $this.treeData.eventMatterList[$this.curTabIndex].situationList.length; b++) {
        let item = $this.treeData.eventMatterList[$this.curTabIndex].situationList[b];
        let children = $this.treeData.eventMatterList[$this.curTabIndex].children;
        if (typeof item.value == 'object') {
          for (var x = 0; item.value && x < item.value.length; x++) {
            for (var y = 0; y < item.answerList.length; y++) {
              if (item.value[x] == item.answerList[y].answerCode) {
                for (var z = 0; z < children.length; z++) {
                  if (item.answerList[y].answerCode == children[z].answerCode) {
                    if (children[z].pzType != '01') {
                      //高亮并记录
                      if (this.treeData.eventMatterList.length == 1) {
                        this.$refs.flowChart.highlightNode(children[z].id);
                        this.treeData.eventMatterList[this.curTabIndex].matterSelectList.push(children[z]);
                      } else if (this.treeData.eventMatterList.length > 1) {
                        this.$refs.flowChart[this.curTabIndex].highlightNode(children[z].id);
                        this.treeData.eventMatterList[this.curTabIndex].matterSelectList.push(children[z]);
                      }
                      // tinglong 加if条件
                      if(z == children.length -1) {
                        break;
                      }
                    }
                  }
                }
                break;
              }
            }
          }
        } else {
          var selectChild;
          for (var i = 0; i < children.length; i++) {
            selectChild = '';
            // tinglong 添加 item.value 为undefined  children[i].answerCode为null  undefined == null 为true
            // item.value必有值  但不知道为什么没值
            if (!!item.value && !!children[i].answerCode && item.value == children[i].answerCode) {
              selectChild = children[i];
              //有就高亮，没有就通过兄弟答案找出来置灰
              if (selectChild) {
                if (selectChild.pzType != '01') {
                  //高亮并记录
                  if (this.treeData.eventMatterList.length == 1) {
                    this.$refs.flowChart.highlightNode(selectChild.id);
                    this.treeData.eventMatterList[this.curTabIndex].matterSelectList.push(selectChild);
                  } else if (this.treeData.eventMatterList.length > 1) {
                    this.$refs.flowChart[this.curTabIndex].highlightNode(selectChild.id);
                    this.treeData.eventMatterList[this.curTabIndex].matterSelectList.push(selectChild);
                  }
                }
              }
              // tinglong 加if条件
              if(i == children.length - 1) {
                break;
              }
            }
          }
          
        }
      }

      //取消选择时，不需要再去请求下一题
      if (obj.value == '' || obj.value.length == 0) {
        return;
      }
      if (typeof obj.value == 'object') { // checkBox
        for (var i = 0; i < obj.value.length; i++) {
          obj.answer = obj.value[i];
          obj.answerId = this.getAnswerId(obj.answerList, obj.answer);
          obj.matterCode = this.getMatterCode(obj.answerList, obj.answer);
          obj.matterVersion = this.getMatterVersion(obj.answerList, obj.answer);
          for (var j = 0; j < obj.answerList.length; j++) {
            if (obj.answerId == obj.answerList[j].situationId && obj.answerList[j].defaultSelect != 1) {
              this.getAnswer(obj);
            }
          }
        }
      } else {//radio
        obj.answer = obj.value;
        obj.answerId = this.getAnswerId(obj.answerList, obj.answer);
        obj.matterCode = this.getMatterCode(obj.answerList, obj.answer);
        obj.matterVersion = this.getMatterVersion(obj.answerList, obj.answer);
        this.getAnswer(obj);
      }
    },
    //获取情形situationId
    getAnswerId(data, val) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].answerCode == val) {
          return data[i].situationId;
        }
      }
    },
    //答案对应的事项code,如果为空，取其兄弟节点的事项code
    getMatterCode(data, val) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].matterCode) {
          return data[i].matterCode;
        }
      }
    },
    //答案对应的事项版本，如果为空，取其兄弟节点的事项版本
    getMatterVersion(data, val) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].matterVersion) {
          return data[i].matterVersion;
        }
      }
    },
    getAnswer(obj) {
      let $this = this;
      util.ajaxObjPost('/znsj-web/situation/eventClassAnsList', {
        "eventCode": obj.objectCode,
        "eventVersion": obj.objectVersion,
        "matterCode": obj.matterCode,
        "matterVersion": obj.matterVersion,
        "situationId": obj.answerId,
        "parentId": obj.id
      }, function (res) {
        //对默认选中的答案进行处理
        let situationList = res.data,
          len = situationList.length;
        for (var i = 0; i < len; i++) {
          if (situationList[i].isMulti == 2) {
            situationList[i].isMultiTrue = true;
            situationList[i].value = [];
            for (var j = 0; j < situationList[i].answerList.length; j++) {
              situationList[i].value.push(situationList[i].answerList[j].answerCode);
            }
          } else {
            if (situationList[i].isMulti == 0) {
              for (var j = 0; j < situationList[i].answerList.length; j++) {
                if (situationList[i].answerList[j].defaultSelect == 1) {
                  situationList[i].value = situationList[i].answerList[j].answerCode;
                  situationList[i].disaAns = true;
                }
              }
            } else {
              situationList[i].value = [];
              for (var k = 0; k < situationList[i].answerList.length; k++) {
                if (situationList[i].answerList[k].defaultSelect == 1) {
                  situationList[i].value.push(situationList[i].answerList[k].answerCode);
                  situationList[i].disaAns = true;
                }
              }
            }
            situationList[i].isMultiTrue = false;
          }

          // 去重，将获取到的答案添加到队列
          let isCanPush = true;
          for (var x = 0; x < $this.treeData.eventMatterList[$this.curTabIndex].situationList.length; x++) {
            if ($this.treeData.eventMatterList[$this.curTabIndex].situationList[x].situationId == situationList[i].situationId) {
              isCanPush = false;
              break;
            }
          }
          // 默认选中的题目记录关联的事项以及改变事项状态
          if (typeof situationList[i].value == 'object' && isCanPush) {
            if (situationList[i].value.length > 0) {
              $this.checkboxEventChange(situationList[i], $this.treeData.eventMatterList[$this.curTabIndex].children, $this.treeData, false);
            }
          } else {
            if (situationList[i].value) {
              $this.radioEventChange(situationList[i], $this.treeData.eventMatterList[$this.curTabIndex].children, $this.treeData, false);
            }
          }
          
          if (isCanPush) {
            $this.treeData.eventMatterList[$this.curTabIndex].situationList.push(situationList[i]);
          }
        }
      }, function (res) {
      }, this);
    },
    //记录初始默认高亮（必须提供）的事项
    defaultSelectMatter(child, index) {
      this.treeData.eventMatterList[index].matterSelectList.push(child);
    }
  },
  mounted: function () {
    let that = this;
    that.isIE9 = util.isIE9();
    this.getGuideMapData();
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/styles/color.less";

#oneThingGuidance {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // padding-left:20px;
    // padding-top:20px;
    .case-guid-head {
        padding: 0px 100px 0 20px;
    }
    .one-thing-guidance-wrap {
        width: 100%;
        height: 100%;
        padding: 0 100px 20px 20px;
        background: #fff;
        box-sizing: border-box;
        .head {
            overflow: hidden;
            margin-bottom: 10px;
            #detailHead{
              // margin-bottom:-1px!important;
            }
            .ivu-form{
              border-top:none!important;
            }
        }
        //导览图
        .tj-content {
            position: relative;
            // padding-left: 15px;
            width: 100%;
            overflow: auto;
            color: #333;
            text-align: center;
            .tabs-content {
                padding: 8px 0;margin-bottom: 20px;
            }
            .flow-wrap {
                margin: 25px 0;
                width: 100%;
                // height: 250px;
                overflow-x: hidden;
            }
            .is-ie9-auto {
              height: 250px;
              overflow: auto;
            }
            .flowChart {
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
            // .flow-chart-wrap {
            //   width: 100%;
            //   height: 260px;
            //   overflow: auto;
            // }
        }
        .description {
            text-align: left;
            width: 100%;
            background: #f2f2f2;
            padding: 20px;
            margin-bottom: 20px;
            /*margin-top: -50px;*/
        }
        //情形引导-主体内容
        .qx-content {
            // padding-left: 15px;
            font-size: 12px;
            color: #333;
            .ivu-form {
                padding: 15px;
                border: 1px solid #dcdee2;
                .ivu-form-item {
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                    border-bottom: 1px dashed #dcdee2;
                    &:last-child {
                        padding-bottom: 0;
                        margin-bottom: 0;
                        border-bottom: 0;
                    }
                }
            }
        }

        // 按钮部分
        .btn-wrap {
            width: 100%;
            height: 60px;
            text-align: right;
            line-height: 60px;
        }
    }
    .tabs {
        font-size: 14px;
        .tabs-bar {
            .radio-group {
                margin: 15px 100px 0 35px;
                font-size: 0;
                .switch-default {
                    padding: 0 12px;
                    margin-right: 5px;
                    display: inline-block;
                    height: 35px;
                    width: 96px;
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
                    display: inline-block;
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
            // height: 37px;
            // text-align: left;
            // .tabs-tab {
            //   display: inline-block;
            //   padding: 0 16px;
            //   height: 37px;
            //   line-height: 37px;
            //   background: #fff;
            //   max-width: 260px;
            //   cursor: pointer;
            //   position: relative;
            // }
            // .tabs-tab-active {
            //   color: @baseColor;
            //   border-bottom: 2px solid @baseColor;
            // }
        }
        // .tabs-bar:after {
        //   content: '';
        //   display: block;
        //   width: 100%;
        //   height: 1px;
        //   background: #d7dde4;
        //   margin-top: -6px;
        // }
    }
}
</style>
