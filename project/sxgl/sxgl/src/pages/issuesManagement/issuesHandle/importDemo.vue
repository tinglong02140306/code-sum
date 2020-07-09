<template>
    <!-- 基本信息 -->
    <div id="importDemo">
        <div class="btn-import" @click="importEvt"></div>
    </div>
</template>
<script>
import unit from '@/api/index';
export default {
    data() {
        return {

        }
    },
    methods: {
        importEvt() {
            let that = this;
            unit.ajaxPost('/znsj-web/eventMatter/SituationMatterLavel' ,{
            }).then(function(res){
                // res = typeof res === 'string' ? JSON.parse(res) : res;
                // let data = res.data.data;
                // that.parentNameOptions = [];
                // for(let i in data) {
                //     that.parentNameOptions.push(data[i]);
                // }
            }).catch(function(error){
                // that.$Message.error('数据加载/失败！');
            });
        }
    }
};
</script>
<style lang="less" rel="stylesheet/less">
#importDemo {
    overflow-y: auto;
    height: 100%;
    background-color: #fff;
    .btn-import {
        margin: 30px;
        width: 300px;
        height: 100px;
        border-radius: 5px;
        background: #137ddf;
    }
}
</style>

