var rpath = APPCONFIG.resourcePath;
var suff = APPCONFIG.jsFileSuffix;
var requireConfig = {
    baseUrl: rpath,
    paths: {
        ajaxupload: 'js-base/plugins/jquery.ajaxupload',
        artTemp: 'js-base/plugins/art-template',
        bizUtil: 'js-base/common/util',
        bizDao: 'js-base/common/dao-biz',
        commonDao: 'js-base/common/dao',
        cred: 'js-base/plugins/fly.credentials-0.5',
        credTmpl: 'js-base/plugins/cred-tmpl',
        da: 'js-base/plugins/fly.dataAggregation',
        division: 'js-base/plugins/fly.division',
        editgrid: 'js-base/plugins/fly.multiLineForm',
        entrance: 'js-base/common/entrance',
        fly: 'js-base/plugins/flyui/js/flyui-0.6.0',
        flyupload: 'js-base/plugins/fly.uploadify',
        form: 'js-base/common/form',
        headphoto: 'js-base/plugins/fly.headphoto-0.2',
        jquery: 'js-base/plugins/jquery-1.8.2',
        la: 'js-base/plugins/fly.linkage',
        linkagebox: 'js-base/plugins/fly.linkagebox',
        message: 'js-base/common/message',
        newidcard: 'js-base/plugins/fly.idcard',
        print: 'js-base/plugins/jquery.print',
        publicInfo: 'js-base/common/localstorage',
        rotate: 'js-base/plugins/jquery.rotate',
        rules: 'js-base/common/rules',
        scroll: 'js-base/plugins/jquery.nicescroll',
        sign: 'js-base/plugins/fly.websign',
        tab: 'js-base/plugins/fly.tabForm',
        toolbar: 'js-base/common/toolbar',
        uploadify: 'js-base/plugins/uploadify/jquery.uploadify',
        modelSwitch: 'js-base/common/modelSwitch',
        ajaxdownload: 'js-base/plugins/jquery.download',
        crypto: 'js-base/plugins/crypto-js'
    },
    shim: {
        fly: {
            deps: ['jquery'],
            exports: 'fly'
        },
        jqprint: {
            deps: ['jquery']
        },
        headphoto: {
            deps: ['jquery', 'fly']
        },
        scroll: {
            deps: ['jquery']
        },
        rotate: {
            deps: ['jquery']
        },
        tab: {
            deps: ['jquery', 'fly']
        },
        editgrid: {
            deps: ['jquery', 'fly']
        },
        uploadify: {
            deps: ['jquery']
        }
    },
    waitSeconds: 0
};
for (var key in requireConfig.paths) {
    requireConfig.paths[key] = rpath + requireConfig.paths[key] + suff;
}