<!-- 树状选择器 下拉树组建-->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
     :popper-append-to-body="false">
     <!-- 区划树 -->
    <!-- <tree class="select-tree" :treeData="data" :props="props"></tree> -->
      <Tree class="select-tree" :data="options"  :props="props" ref="" :render="renderContent" :load-data="xzqhLoadData"></Tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :style="`width: ${width}px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder">
    </el-input>
  </el-popover>
</template>
<script>
import unit from '@/api/index';
import tree from "@/components/tree/tree";   // 区划树
export default {
    components: {
        tree: tree,
    },
    name: 'Pagination',
  props: {
    // // 接收绑定参数
    value: String,
    // // 输入框宽度
    width: String,
    // 选项数据
    options: {
      type: Array,
      required: true,
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'areaName',
        children: 'children',
      }),
    },
  },
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  // computed: {
  //   // 是否为树状结构数据
  //   dataType() {
  //     const jsonStr = JSON.stringify(this.options);
  //     return jsonStr.indexOf(this.props.children) !== -1;
  //   },
  //   // 若非树状结构，则转化为树状结构数据
  //   data() {
  //     return this.dataType ? this.options : this.switchTree();
  //   },
  // },
  // watch: {
  //   labelModel(val) {
  //     if (!val) {
  //       this.valueModel = '';
  //     }
  //   //   this.$refs.tree.filter(val);
  //   },
    // value(val) {
    //   this.labelModel = this.queryTree(this.data, val);
    // },
  // },
  created() {
    // 检测输入框原有值并显示对应 label
    // if (this.value) {
    //   this.labelModel = this.queryTree(this.data, this.value);
    // }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
    data(){
        return{
            // 树状菜单显示状态
            showStatus: false,
            // 菜单宽度
            // treeWidth: 'auto',
            // 输入框显示值
            labelModel: '',
            // 实际请求传值
            valueModel: '0',
        }
    },
    methods:{
        // 子节点的option
         renderContent (h, { root, node, data }) {
                let that = this;
                return h('span', {
                    style: {
                        // display: 'inline-block',
                        width: '100%'
                    },
                    on:{
                      click(e)  {
                            that.labelModel = data.label;
                            that.valueModel = data.value;
                            that.$parent.sjdm = data.value;
                            that.$parent.selected = data.label;
                            // console.log(that.$parent.sjdm,data.value)
                            that.onCloseTree();
                        },
                    }
                }, [
                    h('span',{
                        // class:{
                        //     'tree-til':true,
                        //     'high-light':data.highLight ? true:false
                        // }
                      }, [
                        h('i', {
                            class: {
                                'iconfont': true,
                                'icon-wenjian':data.isFolder ? false:true,
                                'icon-folder_icon':data.isFolder ? true:false
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.label)
                    ]),
                ]);
            },
              /*
            ** 行政区划加载子项
            */
            xzqhLoadData(item, callback) {
                let _that = this,
                    qhCode = item.value,
                    itenLen = item.value.split(',').length;
                    item.loading = true;
                setTimeout(() => {
                    let obj = {
                        value: qhCode
                    };
                    unit.ajaxMerPost('/znsj-web/xzqh/getXzqhTreeData', obj, function (result) {
                        if (result.flag) {
                            $.each(result.data, function (i, t) {
                                // t.title = t.label;
                                if(t.existChild){
                                  if (t.existChild) {
                                      t.children = [];
                                      t.loading = false;
                                  }
                                }
                            });
                            item.children = result.data;
                            item.loading = false;
                            _that.$set(item,'expand',true)
                        } 
                        else {
                            _that.$message.warning('服务端错误');
                        }
                        // item.loading = false;
                        // callback();
                    }, function (result) {
                        _that.$message.warning('服务端错误');
                    }, _that);
                }, 300);
            },
        // 偏平数组转化为树状层级结构
        switchTree() {
          return this.cleanChildren(this.buildTree(this.options, '0'));
        },
        // 隐藏树状菜单
        onCloseTree() {
            this.$refs.popover.showPopper = false;
        },
        // //关闭树结构
        // closeTree() {
        //     this.treeData[0].expand = false;
        // },
        // //展开树结构
        // showTree() {
        //     this.treeData[0].expand = true;
        // },
        // 显示时触发
        onShowPopover() {
            this.showStatus = true;
        },
        // 隐藏时触发
        onHidePopover() {
            this.showStatus = false;
            this.$emit('selected', this.valueModel);
        },
        // 树节点过滤方法
    // filterNode(query, data) {
    //   if (!query) return true;
    //   return data[this.props.label].indexOf(query) !== -1;
    // },
    // 搜索树状数据中的 ID
    // queryTree(tree, id) {
    //   let stark = [];
    //   stark = stark.concat(tree);
    //   while (stark.length) {
    //     const temp = stark.shift();
    //     if (temp[this.props.children]) {
    //       stark = stark.concat(temp[this.props.children]);
    //     }
    //     if (temp[this.props.value] === id) {
    //       return temp[this.props.label];
    //     }
    //   }
    //   return '';
    // },
    // 将一维的扁平数组转换为多层级对象
    // buildTree(data, id = '0') {
    //   const fa = (parentId) => {
    //     const temp = [];
    //     for (let i = 0; i < data.length; i++) {
    //       const n = data[i];
    //       if (n[this.props.parent] === parentId) {
    //         n.children = fa(n.rowGuid);
    //         temp.push(n);
    //       }
    //     }
    //     return temp;
    //   };
    //   return fa(id);
    // },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    },
    }
}
</script>
<style>
  .ivu-tree ul{
      height: auto !important;
  }
  .el-icon-caret-right:before {
      content: "\e603"!important;
  }
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    -webkit-transform: -webkit-rotate(180deg);
    -ms-transform: -ms-rotate(180deg);
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>