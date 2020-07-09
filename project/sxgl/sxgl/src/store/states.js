// states
const states = {
    // 是否加载中
    isLoading: false,
    // 是否登录
    isLogin: false,
    // 用户ID
    userId: "6D6710F1611C252DE05346011FACA095",
    // 用户名
    userName: '',
    // 用户token
    token: '',
    //菜单状态
    menuState: '2c9f81ca657adb450166877848860e62',

    isNew: false,

    userUrl: '/bog-situation-mgr',

    contentPath: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),

    path: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/bog-situation-mgr',
    //行政区划
    xzqhId: '340000000000',
    // 用户姓名
    loginName: '张三',
    //行政区划
    xzqhName: '安徽省',

    fontFlag: 'normal',
    colorFlag: 'light',
    // 记录编辑时当前页码
    editCurPage: 0, 


}

export default states