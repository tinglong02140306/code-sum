/*
 * @Author: qijiang
 * @Date: 2018-09-29 14:45:00
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-07 21:25:20
 * @description 一件事收件
 */
<template>
    <div id="guideWrap">
        <keep-alive>
            <component :is="tabView" @go="go" :param="param"></component>
        </keep-alive>
    </div>
</template>
<script>
import oneThingGuidance from "@/pages/consigneeCenter/oneThingReceiveFile/oneThingGuidance";
import thingBill from "@/pages/consigneeCenter/oneThingReceiveFile/thingBill";
import caseGuidance from "@/pages/consigneeCenter/oneThingReceiveFile/caseGuidance";
import materialVerification from "@/pages/consigneeCenter/oneThingReceiveFile/materialVerification";
import infoFill from "@/pages/consigneeCenter/guideCommon/infoFill";
import collectMaterial from "@/pages/consigneeCenter/guideCommon/collectMaterial";
export default {
    components: {
        oneThingGuidance: oneThingGuidance,
        thingBill: thingBill,
        caseGuidance: caseGuidance,
        materialVerification: materialVerification,
        infoFill,
        collectMaterial
    },
    data() {
        return {
            tabView: 'oneThingGuidance',
            param: {}
        }
    },
    methods: {
        go(val, obj) {
            this.tabView = val;
            this.param = Object.assign({}, this.param, obj);
            if (obj && !obj.flag) {
                for (let i = 0; i < this.$children.length; i++) {
                    if(obj.initCaseFlag) {
                        if (this.$children[i].initData) {
                            this.$children[i].initData();
                        }
                    }else {
                        if (this.$children[i].init) {
                            this.$children[i].init();
                        }
                    }
                    
                }
            }
        }
    },
    created() {
      let params = this.$route.query || {},
        temp = params.matterIds;
      params.matterIds = [temp];
      this.param = Object.assign({}, this.param, params);
    }
}
</script>
<style lang="less" scoped>
#guideWrap {
    height: 100%;
    background: #fff;
    overflow-x: hidden;
}
</style>
