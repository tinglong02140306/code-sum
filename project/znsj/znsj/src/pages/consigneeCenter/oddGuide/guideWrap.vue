/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-07 14:31:36
 * @description 单收件引导
 */
<template>
    <div id="guideWrap">
        <keep-alive>
            <component :is="tabView" @go="go"></component>
        </keep-alive>
    </div>
</template>
<script>
import caseGuidance from "@/pages/consigneeCenter/oddGuide/caseGuidance";
import materialVerification from "@/pages/consigneeCenter/oddGuide/materialVerification";
import infoFill from "@/pages/consigneeCenter/guideCommon/infoFill";
import collectMaterial from "@/pages/consigneeCenter/guideCommon/collectMaterial";
export default {
    components: {
        caseGuidance: caseGuidance,
        materialVerification: materialVerification,
        infoFill,
        collectMaterial
    },
    data() {
        return {
            tabView: 'caseGuidance',
            param: {

            }
        }
    },
    methods: {
        go(val, obj) {
            this.tabView = val;
            this.param = Object.assign({}, this.param, obj);
            if (obj && !obj.flag) {
                for (let i = 0; i < this.$children.length; i++) {
                    if (this.$children[i].init) {
                        this.$children[i].init();
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
        let that = this;
    }
}
</script>
<style lang="less" scoped>
#guideWrap {
    height: 100%;
    background: #fff;
    // padding-top:20px;
    overflow-x: hidden;

}
</style>
