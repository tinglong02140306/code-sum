export default  [
    {
        key: '/business', title: '企业管理', icon: 'tags-o',
        sub: [
            { key: '/business-partner', title: '合作方', icon: '', },
            { key: '/business-organization', title: '机构方', icon: '', },
        ],
    },
    {
        key: '/order', title: '订单报表', icon: 'paper-clip',
        sub: [
            { key: '/waybill-query', title: '运单表', icon: '', },
            { key: '/order-water', title: '流水表', icon: '', },
            { key: '/order-water-collect', title: '流水统计表', icon: '', },
            { key: '/order-children-water', title: '子流水表', icon: '', },
        ],
    },
    {
        key: '/financial', title: '财务报表', icon: 'bar-chart',
        sub: [
            { key: '/financial', title: '财务日报表', icon: '',},
            { key: '/oil-product', title: '产品消费报表', icon: '', },

        ],
    },
    {
        key: '/invoice', title: '发票', icon: 'contacts',
    },
    {
        key: '/wx-applet', title: '微信小程序', icon: 'red-envelope',
        sub: [
            { key: '/invite-code', title: '推广码', icon: '', },

        ],
    },
    {
        key: '/ticket', title: '优惠券', icon: 'gift',
        sub: [
            { key: '/ticket-configure', title: '优惠券基础配置', icon: '', },
            { key: '/activity-manage', title: '活动管理', icon: '', },
            { key: '/grant-ticket', title: '发放优惠券管理', icon: '', },
            { key: '/activity-count', title: '优惠活动统计', icon: '', },
            { key: '/ehs-activity', title: 'e高速国庆活动', icon: '', },
        ],
    },
    {
        key: '/system', title: '系统管理', icon: 'setting',
        sub: [
            { key: '/system-user', title: '用户管理', icon: '', },
            { key: '/system-role', title: '角色管理', icon: '', },
            { key: '/system-permission', title: '权限管理', icon: '', },
            { key: '/system-pages', title: '页面管理', icon: '', },
            { key: '/system-params', title: '系统参数', icon: '', },
            { key: '/system-quartz', title: '任务管理', icon: '',},
            { key: '/system-operation', title: '运维处理', icon: '',},
        ],
    },
];