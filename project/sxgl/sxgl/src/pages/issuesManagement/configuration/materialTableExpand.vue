/*
* @Author: gaoxiong
* @Date: 2018-10-29 13:06:00
* 事项配置—材料配置
*/
<template>
  <Table :columns="columnsData" :data="row" :show-header="false"></Table>
</template>
<script>
// 公共工具方法
import util from '@/api/index';

export default {
  components: {},
  props: {
    row: Array,
    editModal: {
      type: Function,
      default: null
    },
    openDeleteModal: {
      type: Function,
      default: null
    },
    serverReset: {
      type: Function,
      default: null
    },
    goServerConfig: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      columnsData: [
        {
          title: "环节名称",
          key: "linkName",
          align: "center",
          width: 120,
          sortable: true
        }, {
          title: '材料名称',
          key: 'matterialName',
          align: "left",
          width: 180,
          render: (h, params) => {
            let classFlag = false;
            if (params.row.matterialNameTitle) {
              if (params.row.matterialNameTitle.length > 39) {
                classFlag = true;
              }
              return h('span', {
                attrs: {
                  title: params.row.matterialNameTitle
                },
                domProps: {
                  innerHTML: params.row.matterialName
                },
                class: {
                  "tip-title": classFlag
                }
              })
            } else {
              return h('span', {
                domProps: {
                  innerHTML: params.row.matterialName
                }
              })
            }

          }
        }, {
          title: '原始材料名称',
          key: 'orignalName',
          width: 240,
          render: (h, params) => {
            let classFlag = false;
            if (params.row.orignalNameTitle) {
              if (params.row.orignalNameTitle.length > 39) {
                classFlag = true;
              }
              return h('span', {
                attrs: {
                  title: params.row.orignalNameTitle
                },
                domProps: {
                  innerHTML: params.row.orignalName
                },
                class: {
                  "tip-title": classFlag
                }
              })
            } else {
              return h('span', {
                domProps: {
                  innerHTML: params.row.orignalName
                }
              })
            }
          }
        }, {
          title: "材料类型",
          key: "typeTxt",
          width: 100,
          render: (h, params) => {
            if (params.row.orignalNameTitle) {
              return h('span', {
                attrs: {
                  title: params.row.typeTxt
                },
                domProps: {
                  innerHTML: params.row.typeTxt
                }
              })
            } else {
              return h('span', {
                domProps: {
                  innerHTML: params.row.typeTxt
                }
              })
            }

          }
        }, {
          title: '必要性',
          key: 'isNeedTxt',
          width: 100,
          align: 'center'
        }, {
          title: "服务配置",
          key: "isNeedTxt",
          align: "center",
          width: 131,
          render: (h, params) => {
            let self = this;
            if (params.row.isServerConfigured == 0) {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      color: "#606266",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        self.goServerConfig(params, false);
                      }
                    }
                  },
                  "未配置"
                ),
                h(
                  "span",
                  {
                    style: {
                      color: "#c0c4cc",
                      marginRight: "10px"
                    }
                  },
                  "重置"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        self.goServerConfig(params, true);
                      }
                    }
                  },
                  "已配置"
                ),
                h(
                  "a",
                  {
                    style: {
                      color: "#409EFF",
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        self.serverReset(params);
                      }
                    }
                  },
                  "重置"
                )
              ]);
            }
          }
        }, {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let self = this;
            return h('div', [
              h('a', {
                style: {
                  color: '#409EFF',
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    self.editModal(params);
                  }
                }
              }, '编辑'),
              h('a', {
                style: {
                  color: '#409EFF'
                },
                on: {
                  click: () => {
                    self.openDeleteModal(params.row);
                  }
                }
              }, '删除')
            ]);
          }
        }],
    }
  },
  methods: {
  },
  created() {
  }
}

</script>
<style lang="less" rel="stylesheet/stylus">
@import "../../../assets/styles/color.less";

#issuesMaterialConfigure {
    .expand-row {
        margin-bottom: 16px;
    }
}
</style>
