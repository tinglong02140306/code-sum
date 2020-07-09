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
    menuState: '2c9f81ca657adb45016687789a950e63',

    isNew: false,

    contentPath: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),

    path: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/bog-receive-web',
    // path: 'http://172.31.1.87:8885/znsj-sj-web',
    //行政区划
    xzqhId: '340000000000',
    // 用户姓名
    loginName: '张三',
    //行政区划
    xzqhName: '安徽省',
    fontFlag: 'normal',
    colorFlag: 'light',
    takePicFlag: '0',
    dev: {},
    // 高拍仪型号
    gpyConfigInfo: 'liangtianXF660R',  // 良田XF660R: liangtianXF660R; 良田S320R: liangtianS320R; 汉王E1190PRO: hanwangE1190PRO; 良田S620A3R:liangtianS620A3R
    // 高拍仪 拍照弹框标志位
    takePicActive: false,
    // 高拍仪文件上传标志位
    gpyUploadFlag: false,
    // 纠偏裁边
    clipCkecked: false,
    // 去底色
    delCoCkecked: false,
    isIndexPage: false,
    gpySelPicList:[],
    gpyPicList: [],
    // 扫描尺寸
    selScanSizeVal: '0',
    // 旋转角度
    selRotateVal: '0',
    // 分辨率
    selResVal: '0',
    // 颜色设置
    selColorVal: '0',
    selScanSizeData: [],
    selRotateData: [],
    selResData:[],
    selColorData: [],
    startPreEvt: {},
    switchState: 0,
    // 高拍仪定时器
    gpyInter: '',
    // 记录查询条件
    recordSearchParam: {},
    oneRecordSerParam: {},
    myRecSerParam: {},
    // 是否触发编辑操作 收件 指南
    isTrigEdit: false,
    isOneTrigEdit: false,
    isMyRecTrigEdit: false
}

export default states