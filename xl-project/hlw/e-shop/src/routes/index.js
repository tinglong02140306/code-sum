export default [
    // index页
    // 主页
    {
        path: '/',
        name: 'index',
        component: () =>
            import ('@/views'),
        redirect: '/Home',
        meta: {
            title: '信联卡网上商城'
        },
        children: [{
                path: '/Home',
                name: 'Home',
                component: () =>
                    import ('@/views/Home')
            },
            {
                path: '/commodity',
                name: 'commodity',
                component: () =>
                    import ('@/views/commodity')
            }, {
                path: '/shoppingCart',
                name: 'shoppingCart',
                component: () =>
                    import ('@/views/shoppingCart')
            }, {
                path: "/mineHome",
                name: "mineHome",
                component: () =>
                    import ('@/views/mine/mineHome')
            }
        ]
    },
    // 产品详情
    {
        path: "/productDetails",
        name: "productDetails",
        component: () =>
            import ('@/views/productDetails'),
    },
    {
        path: "/order",
        name: "order",
        component: () =>
            import ('@/views/mine/order'),
    },
    // 地址列表
    {
        path: "/addressList",
        name: "addressList",
        component: () =>
            import ('@/views/address/addressList')
    },
    // 编辑地址
    {
        path: "/editAddress",
        name: "editAddress",
        component: () =>
            import ('@/views/address/editAddress')
    },
    // 写评价
    {
        path: "/writeComment",
        name: "writeComment",
        component: () =>
            import ('@/views/mine/writeComment'),
    },
    // 收银台
    {
        path: "/pay",
        name: "pay",
        component: () =>
            import ('@/views/pay'),
    },
    // 退款售后列表
    {
        path: "/afterSales",
        name: "afterSales",
        component: () =>
            import ('@/views/mine/afterSales'),
    },
    // 售后退款详情
    {
        path: "/afterSalesDetail",
        name: "afterSalesDetail",
        component: () =>
            import ('@/views/mine/afterSalesDetail'),
    },
    // 售后退款详情
    {
        path: "/test",
        name: "test",
        component: () =>
            import ('@/views/test'),
    },
    // 商品店铺
    {
        path: '/shop',
        name: 'shop',
        component: () =>
            import ('@/views/shop')
    },
    // 商品评价列表
    {
        path: '/productReview',
        name: 'productReview',
        component: resolve => require(['@/views/comment/productReview'], resolve),
    },
    // 我的评价
    {
        path: '/myComment',
        name: 'myComment',
        component: () =>
            import ('@/views/comment/myComment'),
    },
    // 已评价列表
    {
        path: '/alrEvaluatedList',
        name: 'alrEvaluatedList',
        component: () =>
            import ('@/views/comment/alrEvaluatedList'),
    },
    // 未评价列表
    {
        path: '/unEvaluatedList',
        name: 'unEvaluatedList',
        component: () =>
            import ('@/views/comment/unEvaluatedList'),
    },

    // 关于我们
    {
        path: '/aboutUs',
        name: 'aboutUs',
        component: () =>
            import ('@/views/mine/aboutUs')
    },
    // 新增新联卡
    {
        path: '/addCardNo',
        name: 'addCardNo',
        component: () =>
            import ('@/views/mine/addCardNo')
    },
    // 订单确认
    {
        path: '/orderConfirm',
        name: 'orderConfirm',
        component: () =>
            import ('@/views/order/confirm')
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: () =>
            import ('@/views/order/detail')
    },

    // 售后服务 申请退款
    {
        path: '/refund',
        name: 'refund',
        component: () =>
            import ('@/views/order/refund')
    }
];