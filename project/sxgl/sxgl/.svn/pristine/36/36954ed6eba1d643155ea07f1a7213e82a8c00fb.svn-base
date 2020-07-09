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
      row: Array
    },
    data() {
      return {
        columnsData: [{
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
            return h('div', []);
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
  // .ivu-table-cell-expand-expanded {
  //   transform: rotate(90deg);
  //   -ms-transform: rotate(90deg);

  // }
  // .ivu-table-cell-expand {
  //     transition: transform 0.2s ease-in-out;
  //     -ms-transition: -ms-transform 0.2s ease-in-out;
  // }
  #issuesMaterialConfigure {
    .expand-row {
      margin-bottom: 16px;
    }
  }
</style>
