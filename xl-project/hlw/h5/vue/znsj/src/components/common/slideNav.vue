/*
 * @Author: tinglong 
 * @Date: 2018-12-12 10:34:00 
 * @Last Modified by: tinglong
 * @Last Modified time: 2018-12-12 10:34:00 
 * @description 导航面板
 */
<template>
    <div id="slideNav" class="mb10">
        <Steps class="slide-wrap" :current="step">
            <Step title="看条件"></Step>
            <Step title="填问卷"></Step>
            <Step title="核材料"></Step>
            <Step title="填信息"></Step>
            <Step title="收材料"></Step>
        </Steps>
    </div>
</template>
<script>
export default {
    props: ['step', 'status'],  
	data() {
		return {  
		}
    }
}
</script>
<style lang="less">
#slideNav {
    height: 67px;
    // margin-bottom: 15px;
    padding: 0 100px 0 20px;
    .slide-wrap {
        padding: 20px 0;
        border-bottom: 1px dashed #ddd;
        .ivu-steps .ivu-steps-head {
            top: -2px;
        }
        .ivu-steps .ivu-steps-main {
            display: inline-block;
            margin-top: 4px;
        }
    }
}
</style>
