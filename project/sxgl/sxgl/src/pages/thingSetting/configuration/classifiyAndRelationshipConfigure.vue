/*
* @Author: gaoxiong
* @Date: 2018-10-29 13:06:00
* 分类与材料关系配置
*/
<template>
  <div id="issuesMaterialConfigure">
    <Table ref="table" :columns="columnsData" :data="dataList"></Table>

    <Modal id="issuesMaterialConDialog" v-model="matterConDialogModal" :title="matterTitle" :width="850" :mask-closable="false" :scrollable="true">
      <Form :model="formItem" :rules="ruleValidate" ref="ruleValidate" :label-width="100">
        <Row>
          <Col span="9">
          <FormItem label="事项属性" prop="pzType">
            <Select v-model="formItem.pzType" :transfer="true">
              <Option v-for="item in properties" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="10">
          <span class="propertie-tip">注：必须提供的事项不需要配置分类</span>
          </Col>
        </Row>
      </Form>
      <div>
        <!-- 穿梭树实现 -->
        <treetransfer :title="title" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' height='540px' filter>
        </treetransfer>
      </div>
      <div slot="footer" class="dialog-footer">
         <el-button type="button" size="small" class="el-button custom-el-btn el-button--primary" @click="okMatterConDialog">
            <span>确定</span>
          </el-button>
          <el-button type="button" size="small" class="el-button custom-el-btn el-button--default" @click="matterConDialogModal = false">
            <span>取消</span>
          </el-button>
      </div>
    </Modal>
  </div>
</template>
<script>
// 公共工具方法
import util from '@/api/index';
import treetransfer from 'el-tree-transfer';

export default {
  components: {
    treetransfer
  },
  data() {
    return {
      id: this.$parent.matterStageId/*'c56edc6bdbf3428b8d3bca5ecb382771'*/,//阶段
      version: this.$parent.matterVersion/*'1.0'*/,
      matterCode: this.$parent.matterCode/*'sjbma_001'*/,
      matterTitle: this.$parent.matterTitles ? this.$parent.matterTitles : '操作',
      columnsData: [{
        type: 'index',
        title: '序号',
        width: 80,
        align: 'center'
      }, {
        title: '事项名称',
        key: 'matterName'
      }, {
        title: '行政区划',
        key: 'adminDivName',
        align: 'center'
      }, {
        title: '所属部门',
        key: 'deptName',
        align: 'center'
      }, {
        title: '事项属性',
        key: 'pzTypeTxt',
        width: 300,
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        width: 250,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('a', {
              style: {
                color: '#409EFF',
              },
              on: {
                click: () => {
                  this.openModal(params.index, params.row);
                }
              }
            }, '编辑')
          ]);
        }
      }],
      dataList: [],

      /*dialog相关数据*/
      materialId: '',
      materialCode: '',
      materialVersion: '',
      matterConDialogModal: false,
      mode: 'transfer',
      ruleValidate: {
        pzType: [{
          required: true,
          message: '请选择材料属性',
          trigger: 'change'
        }]
      },
      formItem: {
        pzType:'02'
      },
      properties: [],
      fromData: [],
      toData: []
    }
  },
  methods: {
    // 获取材料信息表数据
    getMatter() {
      let $this = this;
      let params = {
        id: $this.id,
        eventCode: $this.matterCode,
        eventVersion: $this.version
      }
      util.ajaxMerPost('/qxpz/eventMatter/getEventMatterList', params,
        function (res) {
          let data = res.data;
          $this.dataList = data;
        },
        function (res) {
          $this.$Message.error('数据请求失败');
        }, this);
    },
    openModal(index, row) {
      //init
      this.materialId = row.id;
      this.materialCode = row.matterCode;
      this.materialVersion = row.matterVersion;
      //reset
      this.formItem = {
        pzType: row.pzType||'02'
      }
      this.fromData = [];
      this.toData = [];
      //http
      this.getDicData();
      this.getmatterMatterTree();
      this.getmatterMatterRight();
      //show
      this.matterConDialogModal = true;
      this.$nextTick(() => {
        $('.transfer-title .el-checkbox').addClass('hide');
      });
    },
    //材料属性字典项
    getDicData() {
      let that = this;
      util.ajaxMerPost('/qxpz/dic/getDictionarys', { pinYinType: 'clsx' }, function (res) {
        res = typeof res === 'string' ? JSON.parse(res) : res;
        let data = res.data;
        if (res.flag) {
          if (data && data.length > 0) {
            that.properties = res.data;
            // that.formItem.pzType = '02';
          }
        } else {
          that.$Message.error(res.data || '数据加载失败!');
        }
      }, function (error) {
        that.$Message.error('数据加载失败！！');
      }, that);
    },
    // 请求穿梭数右边原始数据
    getmatterMatterRight() {
      let $this = this;
      let params = {
        matterCode: $this.materialCode,
        matterVersion: $this.materialVersion,
        subStageCode: $this.id,
        eventCode: $this.matterCode,
        eventVersion: $this.version
      }
      util.ajaxObjPost('/qxpz/eventMatter/getEventClassifyList', params,
        function (res) {
          if (res.data) {
            $this.toData = res.data;
          }
        },
        function (res) {
          $this.$Message.error('数据请求失败');
        }, this);
    },
    //请求穿梭数左边原始数据
    getmatterMatterTree() {
      let $this = this;
      let param = {
        matterCode: $this.matterCode,
        version: $this.version,
        subStageCode: $this.id,
        type: '2'//1：事项； 2：事件
      }
      util.ajaxMerPost('/qxpz/matterial/getClassifyTree', param,
        function (res) {
          $this.fromData = res.data
        },
        function (res) {
          $this.$Message.error('数据请求失败');
        }, this);
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      this.toData = toData;
      this.fromData = fromData;
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      this.toData = toData;
      this.fromData = fromData
    },
    // 提交事件
    okMatterConDialog() {
      let self = this;
      // if (!self.formItem.pzType) {
      //   self.$Message.error('请选择事项属性');
      //   return false;
      // }
      if(self.formItem.pzType == '02' && self.toData.length <= 0) {
          self.$Message.error('请选择分类和答案');
          return;
      }
      let params = {
        id: self.materialId,
        pzType: self.formItem.pzType,
        matterCode: self.materialCode,
        matterVersion: self.materialVersion,
        eventCode: self.matterCode,
        eventVersion: self.version,
        classifyAns: self.toData,
        subStageCode: self.id
      }
      util.ajaxObjPost('/qxpz/eventMatter/saveClassifyTree', params,
        function (res) {
          if (res.flag) {
            self.$Message.success('操作成功');
            setTimeout(function () {
              self.matterConDialogModal = false;
              //对话框消失的回调
              self.getMatter()
            }, 500);
          } else {
            self.$Message.error('操作失败');
          }
        },
        function (res) {
          self.$Message.error('操作失败');
        }, this);
    }
  },
  computed: {
    title() {
      if (this.mode == "transfer") {
        return ["待选分类", "已选分类"];
      }
    }
  },
  created() {
    this.getMatter();
  }
}

</script>
<style lang="less" rel="stylesheet/stylus">
@import "../../../assets/styles/color.less";

#issuesMaterialConfigure>{
  .ivu-table-wrapper{
    margin-top: 15px;
  }
}
#issuesMaterialConfigure {
    .ivu-table {
        // font-size: 15px;
        th{
          height: 49px;
        }
    }
    .ivu-table-expanded-cell {
        padding: 0;
        border: none !important;
        .ivu-table-wrapper {
            border-top: none;
            border-left: none;
            border-bottom: none;
            // .ivu-table-row td:nth-child(1) {
            //     padding-left: 50px;
            // }
        }
    }
    .ivu-table-expanded-cell[class*=cell]{
      padding: 0;
      border-bottom: 0!important;
      border: none;
      padding-left: 50px;
      background-color:#f8f9fb !important;
    }
    .ivu-table-expanded-cell tr.ivu-table-row td{
      background-color: #f8f9fb !important;
    }
}
#issuesMaterialConDialog {
    position: relative;
    // 改弹框层级
    .ivu-modal-wrap {
        z-index: 1002 !important;
    }
    .ivu-modal-mask {
        z-index: 1001 !important;
    }
    .custom-el-btn {
        width: 64px !important;
        height: 34px !important;
    }
    .progressContainer {
        height: 20px;
        width: 96%;
        border-radius: 10px;
        background-color: #ddd;
        margin-left: 2%;
    }
    .progress {
        background-color: @baseColor;
        border-radius: 10px;
        height: 20px;
        line-height: 20px;
    }
    b {
        color: #fff;
        font-weight: 100;
        font-size: 12px;
        position: absolute;
        left: 40%;
    }
    .btns {
        margin-top: 20px;
    }
    .wenjian {
        font-size: 18px;
        color: #bfbfbf;
    }
    .gouxuan {
        font-size: 15px;
        color: #70c34c;
        float: right;
        margin-top: 6px;
    }
    .chahao {
        font-size: 16px;
        color: #bfbfbf;
        float: right;
        margin-top: 6px;
    }
    .ul-class {
        width: 400px;
        margin-top: 10px;
    }
    /* 文件上传显示 */
    .upload-detail {
        color: #333;
        label {
            display: inline-block;
            width: 110px;
            height: 30px;
            color: @baseColor;
            line-height: 30px;
            text-align: right;
        }
        span {
            display: inline-block;
            padding-right: 15px;
            height: 30px;
            line-height: 30px;
            vertical-align: top;
        }
        .elec-photo {
            .file-list {
                display: inline;
            }
            a {
                display: inline-block;
                padding-right: 10px;
            }
            span {
                padding: 0;
            }
        }
        a {
            text-decoration: none;
        }

        a:hover {
            color: #333;
        }
        i {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../../assets/images/common/icon-del.png)
                no-repeat;
            background-position: center;
            background-size: 12px;
        }
    }
    .icon-del {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(../../../assets/images/common/icon-del.png) no-repeat;
        background-position: center;
        background-size: 12px;
    }
    .ivu-upload {
        display: inline-block;
    }
    .el-dialog__footer {
        margin-top: 20px;
        text-align: center;
    }
    /* 穿梭树样式 */
    .el-tree > .el-tree-node > .el-tree-node__content .el-checkbox__inner {
        display: none;
    }
    .upload-view {
        width: 78px;
        height: 68px;
        .webuploader-pick {
            background: transparent;
        }
        .icon {
            width: 48px;
            height: 48px;
            line-height: 48px;
            .ivu-icon-ios-add {
                font-size: 20px;
                color: #666;
            }
        }
    }
    .upload-extensions-tip {
        position: absolute;
        top: 15%;
        margin-left: 10px;
    }
    .transfer-title {
        font-size: 14px;
    }
    .ivu-modal-content {
        border-radius: 2px;
    }
    .ivu-modal-header {
        // border-radius: 2px 2px 0 0;
        // background: @baseColor;
        // .ivu-modal-header-inner {
        //     color: #ffffff;
        // }
    }
    // .ivu-icon-ios-close {
    //     color: #ffffff;
    // }
    .dialog-footer {
        text-align: right;
    }
    .propertie-tip {
        color: #666;
        padding-left: 10px;
        line-height: 40px;
    }
}
</style>
