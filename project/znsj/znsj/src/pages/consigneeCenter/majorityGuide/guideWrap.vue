/*
 * @Author: qijiang 
 * @Date: 2018-09-29 14:45:00 
 * @Last Modified by: qijiang
 * @Last Modified time: 2018-11-07 21:25:31
 * @description 多收件引导
 */
<template>
    <div id="guideWrap">
        <keep-alive>
            <component :is="tabView" @go="go" :param="param"></component>
        </keep-alive>
    </div>
</template>
<script>
// import searchMatters from "@/pages/consigneeCenter/guideIndex/searchMatters";
import caseGuidance from "@/pages/consigneeCenter/majorityGuide/caseGuidance";
import materialVerification from "@/pages/consigneeCenter/oddGuide/materialVerification";
import infoFill from "@/pages/consigneeCenter/guideCommon/infoFill";
import collectMaterial from "@/pages/consigneeCenter/guideCommon/collectMaterial";
export default {
    components: {
        searchMatters: searchMatters,
        caseGuidance: caseGuidance,
        materialVerification: materialVerification,
        infoFill,
        collectMaterial
    },
    data() {
        return {
            tabView: 'caseGuidance',
            // tabView: 'searchMatters',
            param: {},
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
        let params = this.$route.query || {};
        params.matterIds = JSON.parse(params.matterIds);
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
