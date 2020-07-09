<template>
  <div :class="domFootCss">
    {{footerContent}}
  </div>
</template>

<script>
  export default {
    props: {
      footContent: {
        type: String,
        default: '版权所有 @ 科大讯飞股份有限公司'
      },
      footCss: {
        type: String,
        default: 'main-content-foot'
      }
    },
    data () {
      return {
        footerContent: this.footContent,
        domFootCss: this.footCss
      }
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  .main-content-foot{
    position: fixed;
    bottom: 0;
    width: calc(~"100% - 200px");
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: #f8f8f8;
    z-index: 1;
  }
</style>
