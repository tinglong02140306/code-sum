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
          <FormItem label="材料属性" prop="pzType">
            <Select v-model="formItem.pzType" :transfer="true">
              <Option v-for="item in properties" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="10">
          <span class="propertie-tip">注：必须提供的材料不需要配置分类</span>
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
import expandRow from './classifiyAndRelationshipTableExpand.vue';
import treetransfer from 'el-tree-transfer';

export default {
  components: {
    expandRow,
    treetransfer
  },
  data() {
    return {
      // 从上个页面跳转来的情形事项id this.$parent.id
      id: this.$parent.matterId,
      version: this.$parent.matterVersion/*'1.0'*/,
      matterCode: this.$parent.matterCode/*'cssx1'*/,
      matterTitle: this.$parent.matterTitles ? this.$parent.matterTitles : '操作',
      columnsData: [{
        type: 'expand',
        width: 50,
        render: (h, params) => {
          if (params.row.child) {
            return h(expandRow, {
              props: {
                row: params.row.child
              }
            })
          }
        }
      }, {
        title: '材料名称',
        key: 'matterialName',
      }, {
        title: '材料属性',
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
                color: "#409EFF",
                marginRight: "10px"
              },
              on: {
                click: () => {
                  this.upSort(params);
                }
              }
            }, '上移'),
            h('a', {
              style: {
                color: "#409EFF",
                marginRight: "10px"
              },
              on: {
                click: () => {
                  this.downSort(params);
                }
              }
            }, '下移'),
            h('a', {
              style: {
                color: "#409EFF",
                marginRight: "10px"
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
      childCode: '',
      materialCode: '',
      matterConDialogModal: false,
      mode: 'transfer',
      ruleValidate: {
        pzType: [{
          required: true,
          message: '请选择材料属性',
          trigger: 'change'
        }]
      },
      formItem: {},
      properties: [],
      fromData: [],
      toData: []
    }
  },
  methods: {
    //材料上移
    upSort(param){
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/upSort",
        {
          id: param.row.id,
          isGroup: param.row.isGroup
        },
        function(res) {
          if (res.data && res.flag) {
            self.$Message.success("操作成功");
            // 刷新父页面列表
            self.getMatter();
          } else {
            self.$Message.error(res.errMsg);
          }
        },
        function(res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        },
        this
      );
    },

    //材料下移
    downSort(param){
      let self = this;
      util.ajaxMerPost(
        "/znsj-web/matterial/downSort",
        {
          id: param.row.id,
          isGroup: param.row.isGroup
        },
        function(res) {
          if (res.data && res.flag) {
            self.$Message.success("操作成功");
            // 刷新父页面列表
            self.getMatter();
          } else {
            self.$Message.error(res.errMsg);
          }
        },
        function(res) {
          if (res.data) {
            self.$Message.error(res.data.errMsg);
          } else {
            self.$Message.error("操作失败");
          }
        },
        this
      );
    },
    // 获取材料信息表数据
    getMatter() {
      let $this = this;
      util.ajaxObjPost('/qxpz/matterial/getMatterialByMatteCode?matteCode=' + $this.matterCode + '&matteVersion=' +
        $this.version, {},
        function (res) {
          let data = res.data;
          data.forEach(function (item, index) {
            if (!item.child) {
              item._disableExpand = true;
              item.childCode = '';
            } else {
              item.childCode = item.child[0].code
            }
          });
          $this.dataList = data;
        },
        function (res) {
          $this.$Message.error('数据请求失败');
        }, this);
    },
    openModal(index, row) {
      //init
      this.materialId = row.id;
      this.materialCode = row.code;
      this.matterTitle=row.matterialName;
      if (row.pzType) {
        this.formItem.pzType = row.pzType;
      } else {
       
        this.$refs['ruleValidate'].resetFields();
         this.formItem.pzType = '02';
      }
      this.childCode = row.childCode;//第一个子项的id，如果有的话
      //reset
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
        code: $this.childCode ? $this.childCode : $this.materialCode,
      }
      util.ajaxMerPost('/qxpz/matterial/getClassifymatterial', params,
        function (res) {
          if (res.data) {
            $this.toData = res.data;
          }
        },
        function (res) {
          $this.$Message.error('数据请求失败');
        }, this);
    },
    //   请求穿梭数左边原始数据
    getmatterMatterTree() {
      let $this = this;
      let param = {
        matterCode: $this.matterCode,
        version: $this.version,
        type: '1' //1:事项； 2：事件
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
      if(self.formItem.pzType == '02' && self.toData.length <= 0) {
          self.$Message.error('请选择分类和答案');
          return;
      }
      let params = {
        id: self.materialId,
        pzType: self.formItem.pzType,
        type: self.childCode ? '1' : '0',//节点类型：0：单材料 1：组对象
        classifymatterial: self.toData
      }
      util.ajaxObjPost('/qxpz/matterial/updateMatterial', params,
        function (res) {
          self.$Message.success('操作成功');
          setTimeout(function () {
            self.matterConDialogModal = false;
            //对话框消失的回调
            self.getMatter()
          }, 500);
        },
        function (res) {
          self.$Message.error(res.data.errMsg);
        }, this);
    }
  },
  mounted(){
    util.solveIviewTable();
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
#issuesMaterialConfigure > .ivu-table-wrapper {
    margin-top: 15px;
}

#issuesMaterialConfigure {
    .ivu-table-expanded-cell {
        padding: 0;
        border: none !important;
        .ivu-table-wrapper {
            border-top: none;
            border-left: none;
            border-bottom: none;
            // .ivu-table-row td:nth-child(1){
            //   padding-left: 50px;
            // }
        }
    }
    .ivu-table th {
        height: 49px;
    }
    .ivu-table-expanded-cell[class*="cell"] {
        padding: 0;
        border-bottom: 0 !important;
        border: none;
        padding-left: 50px;
        background-color: #f8f9fb !important;
    }
    .ivu-table-expanded-cell tr.ivu-table-row td {
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
    .progressContainer {
        height: 20px;
        width: 96%;
        border-radius: 10px;
        background-color: #ddd;
        margin-left: 2%;
    }
    .custom-el-btn {
        width: 64px !important;
        height: 34px !important;
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
    // .ivu-modal-header {
    //     // border-radius: 2px 2px 0 0;
    //     // background: @baseColor;
    //     // .ivu-modal-header-inner {
    //     //     color: #ffffff;
    //     // }
    // }
    // .ivu-icon-ios-close {
    //     // color: #ffffff;
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
