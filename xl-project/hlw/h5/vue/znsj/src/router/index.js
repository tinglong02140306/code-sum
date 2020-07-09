import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const routes = [{
        path: '/',
        redirect: '/searchMatters'
    },
    // 单收件
    {
        path: '/oddGuide/guideWrap',
        name: '/oddGuide/guideWrap',
        component: resolve => require(['@/pages/consigneeCenter/oddGuide/guideWrap'], resolve)
    },
    // 多收件
    {
        path: '/majorityGuide/guideWrap',
        name: '/majorityGuide/guideWrap',
        component: resolve => require(['@/pages/consigneeCenter/majorityGuide/guideWrap'], resolve)
    },
    // 一件事
    {
        path: '/oneThingReceiveFile/guideWrap',
        name: '/oneThingReceiveFile/guideWrap',
        component: resolve => require(['@/pages/consigneeCenter/oneThingReceiveFile/guideWrap'], resolve)
    },
    // 单收件-情形引导
    {
        path: '/oddGuide/caseGuidance',
        name: '/oddGuide/caseGuidance',
        component: resolve => require(['@/pages/consigneeCenter/oddGuide/caseGuidance'], resolve)
    },
    // 单收件-材料核查
    {
        path: '/oddGuide/materialVerification',
        name: '/oddGuide/materialVerification',
        component: resolve => require(['@/pages/consigneeCenter/oddGuide/materialVerification'], resolve)
    },
    // 多收件-情形引导
    {
        path: '/majorityGuide/caseGuidance',
        name: '/majorityGuide/caseGuidance',
        component: resolve => require(['@/pages/consigneeCenter/majorityGuide/caseGuidance'], resolve)
    },
    // 信息填写
    {
        path: '/infoFill',
        name: 'infoFill',
        component: resolve => require(['@/pages/consigneeCenter/guideCommon/infoFill'], resolve)
    },
    // 收材料
    {
        path: '/collectMaterial',
        name: 'collectMaterial',
        component: resolve => require(['@/pages/consigneeCenter/guideCommon/collectMaterial'], resolve)
    },
    // 导航面板
    {
        path: '/slideNav',
        name: 'slideNav',
        component: resolve => require(['@/components/common/slideNav'], resolve)
    },
    // 详情公共头部小标题
    {
        path: '/detailHead',
        name: 'detailHead',
        component: resolve => require(['@/components/common/detailHead'], resolve)
    },
    // 用户信息组件
    {
        path: '/userInfo',
        name: 'userInfo',
        component: resolve => require(['@/components/userInfo/userInfo'], resolve)
    },
    // 页签导航
    {
        path: '/tabNavigate',
        name: 'tabNavigate',
        component: resolve => require(['@/components/common/tabNavigate'], resolve)
    },
    // 表格导航切换
    {
        path: '/tabSwitch',
        name: 'tabSwitch',
        component: resolve => require(['@/components/common/tabSwitch'], resolve)
    },
    // 综合收件_事项
    {
        path: '/searchMatters',
        name: 'searchMatters',
        component: resolve => require(['@/pages/consigneeCenter/guideIndex/searchMatters'], resolve)
    },
    // 综合收件_一件事
    {
        path: '/searchOneMatter',
        name: 'searchOneMatter',
        component: resolve => require(['@/pages/consigneeCenter/guideIndex/searchOneMatter'], resolve)
    },
    // 指南
    {
        path: '/affairsGuide',
        name: 'affairsGuide',
        component: resolve => require(['@/pages/consigneeCenter/guideIndex/affairsGuide'], resolve)
    },
    // 收件成功
    {
        path: '/receiverSuccess',
        name: 'receiverSuccess',
        component: resolve => require(['@/pages/consigneeCenter/guideCommon/receiverSuccess'], resolve)
    },
    // 一件事情形引导
    {
        path: '/oneThingGuidance',
        name: 'oneThingGuidance',
        component: resolve => require(['@/pages/consigneeCenter/oneThingReceiveFile/oneThingGuidance'], resolve)
    },
    // 我的收件
    {
        path: '/myReceipt/receiptList',
        name: '/myReceipt/receiptList',
        component: resolve => require(['@/pages/consigneeCenter/myReceipt/receiptList'], resolve)
    },
    // 收件详情
    {
        path: '/myReceipt/receiptDetails',
        name: '/myReceipt/receiptDetails',
        component: resolve => require(['@/pages/consigneeCenter/myReceipt/receiptDetails'], resolve)
    },
    {
        path: '/myReceipt/eventReceiptDetails',
        name: '/myReceipt/eventReceiptDetails',
        component: resolve => require(['@/pages/consigneeCenter/myReceipt/eventReceiptDetails'], resolve)
    },
    // 一件事详情
    {
        path: '/myReceipt/eventDetails',
        name: '/myReceipt/eventDetails',
        component: resolve => require(['@/pages/consigneeCenter/myReceipt/eventDetails'], resolve)
    },
    // 一件事事项清单
    {
        path: '/thingBill',
        name: 'thingBill',
        component: resolve => require(['@/pages/consigneeCenter/oneThingReceiveFile/thingBill'], resolve)
    },
    // 一件事情形引导
    {
        path: '/oneThingReceiveFile/caseGuidance',
        name: 'oneThingReceiveFile/caseGuidance',
        component: resolve => require(['@/pages/consigneeCenter/oneThingReceiveFile/caseGuidance'], resolve)
    },
    // 富文本框编辑器（可删除）
    {
        path: '/test',
        name: 'test',
        component: resolve => require(['@/pages/consigneeCenter/guideCommon/test'], resolve)
    },
    // 系统设置
    {
        path: '/systemMatters',
        name: 'systemMatters',
        component: resolve => require(['@/pages/consigneeCenter/systemSetting/systemMatters'], resolve)
    },
    {
        path: '/systemOneMatter',
        name: 'systemOneMatter',
        component: resolve => require(['@/pages/consigneeCenter/systemSetting/systemOneMatter'], resolve)
    },
    // 统计
    {
        path: '/statisticList',
        name: 'statisticList',
        component: resolve => require(['@/pages/consigneeCenter/statisticAnalysis/statisticList'], resolve)
    },

];

export default new Router({
    routes
});