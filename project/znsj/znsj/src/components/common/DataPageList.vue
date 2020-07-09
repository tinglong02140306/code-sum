<template>
  <el-table
    :data="loadPageLists.pageList"
    border
    :show-overflow-tooltip="true"
    :header-cell-class-name="header"
  >
    <div slot="empty" class="no-data-img"><img src="@/assets/images/common/empty-data.png"></div>
    <el-table-column  :label="item" header-align="center" v-for="(item, key) in loadPageLists.header" :key="item">
      <template slot-scope="scope">
        <span v-if="loadPageLists.pageList[scope.$index][key] === 'tool'">
            <el-button @click="handleClick(scope.row)" type="warning" size="small">详情</el-button>
            <el-button type="warning" size="small">编辑</el-button>
            <el-button  type="info" size="small">删除</el-button>
        </span>
        <span v-else>
          {{loadPageLists.pageList[scope.$index][key]}}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  /**
   *
   * <!--table表格列表props---/pageDataLists为子组件暴露的传参变量
   以下传入的数据格式
    {
      header: ['序号', '英文名称', '中文名称', '数据格式', '中文描述'],
      pageList: [
        ['1', 'QLLX', '权力类型', '文本', '权力类型']
      ]
    }
   */
  export default {
    name: 'DataPageList',
    props: {
      pageDataLists: Array,
      types: {
        type: Number,
        default: 1
      },
      headerList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
      }
    },
    computed: {
      loadPageLists () {
        let headArr = []
        let pageList = []
        let allPageList = []
        let pageLists = {} // 包装返回数据
        let resData = this.pageDataLists
        if (this.types === 2) {
          pageLists.header = this.headerList
          pageLists.pageList = this.pageDataLists
        } else {
          if (resData && resData.length > 0) {
            for (let key in resData[0]) { // 循环获取头部信息
              headArr.push(key)
            }
            for (let i = 0; i < resData.length; i++) { // 改变分页列表数据结构
              pageList = []
              for (let item in resData[i]) {
                pageList.push(resData[i][item])
              }
              allPageList.push(pageList)
            }
            pageLists.header = headArr
            pageLists.pageList = allPageList
          } else {
            pageLists.header = []
            pageLists.pageList = []
          }
        }
        return pageLists
      }
    },
    methods: {
      header () {
        return 'tableHeader'
      }
    }
  }
</script>
