var vConsole;
var requestEvent = {
        // 微信授权登录
        weinxinLogin: function() {
            var curToken = util.getQueryString('token'),
                type = util.getQueryString('type'),
                param;
            console.log(type);
            if (!curToken) return;
            param = {
                'token': curToken
            };
            util.ajaxRequest('/wx/login/mp/gaosuetc', param, '', function(res) {
                // util.showToast('用户信息:' + JSON.stringify(res.data))
                console.log('用户信息:' + JSON.stringify(res));
                if (res.code == "0000") {
                    if (res.data && res.data.auth_token) {
                        util.setLocalToken(res.data.auth_token);
                        handleEvent.pageGopath(type);
                    }
                } else {
                    util.showToast(res.message);
                }
            }, function(res) {
                util.showToast(res.message);
            });
        },

        // 支付宝授权登录
        alipayLogin: function() {
            console.log('enter 支付宝登录');
            var code = util.getQueryString('auth_code'),
                type = util.getQueryString('type'),
                platId = util.getQueryString('plat_id'),
                param;
            console.log(location.href);
            console.log('platId::' + platId);
            if (!code) return;
            if (!platId) return;
            param = {
                'auth_code': code,
                'plat_id': platId
            };
            util.ajaxRequest('/isp/alipay/life/login', param, '', function(res) {
                // console.log('用户信息:' + JSON.stringify(res));
                if (res.code == "0000") {
                    if (res.data && res.data.token) {
                        util.setLocalToken(res.data.token);
                        console.log(localStorage.getItem('TOKEN'))
                        handleEvent.pageGopath(type);
                    }
                } else {
                    util.showToast(res.message)
                }
            }, function(res) {
                util.showToast(res.message)
            });
        },
        // 获取支付宝签约信息
        getAlipaySignState: function() {
            util.ajaxRequest('/isp/alipay/life/sign/info', {}, util.getLocalToken(), function(res) {
                console.log('信息:' + JSON.stringify(res))
                var data = res.data,
                    path = '';
                if (res.code = "0000") {
                    // status：签约状态（0-无效；1-有效；）
                    if (data && data.status == 1) {
                        path = './sign-result.html';
                        window.localStorage.setItem('SIGNINFO', JSON.stringify(data));
                    } else {
                        path = './aliSign.html';
                        window.localStorage.removeItem('SIGNINFO');
                    }
                    window.location.href = path;
                } else {
                    handleEvent.showToast(res.message);
                    window.localStorage.removeItem('SIGNINFO');
                }
            }, function(res) {
                handleEvent.showToast(res.message)
            });
        },


        // 获取微信签约信息
        getWxSignState: function() {
            util.ajaxRequest('/wx/sign/info', {}, util.getLocalToken(), function(res) {
                console.log('信息:' + JSON.stringify(res))
                var data = res.data,
                    path = '';
                if (res.code = "0000") {
                    if (data && data.status == 1) {
                        path = './sign-result.html?t=' + new Date().getTime();
                        window.localStorage.setItem('SIGNINFO', JSON.stringify(data));
                    } else {
                        path = './wxSign.html?t=' + new Date().getTime();
                        window.localStorage.removeItem('SIGNINFO');
                    }
                    window.location.href = path;
                } else {
                    handleEvent.showToast(res.message);
                    window.localStorage.removeItem('SIGNINFO');
                }
            }, function(res) {
                handleEvent.showToast(res.message)
            });

        }
    },
    handleEvent = {
        // 页面跳转
        pageGopath: function(type) {
            var path = '';
            // 签约
            if (type == 1) {
                if (util.isAlipay()) {
                    requestEvent.getAlipaySignState();
                } else if (util.isWeiXin()) {
                    requestEvent.getWxSignState();
                }
            } else if (type == 2) { // 账单
                path = './bill.html';
                window.location.href = path;
            }
        }
    },
    // 初始化
    init = function() {
        // vConsole = new VConsole();
        if (window.localStorage.getItem('PAGESTATE') == 'abnomal') {
            util.closePage();
            return;
        }
        if (util.isAlipay()) {
            requestEvent.alipayLogin();
        } else if (util.isWeiXin()) {
            requestEvent.weinxinLogin();
        }
    };
$(function() {
    init();
    // 监听 左上角返回键和 物理键 关闭页面
    util.pushHistory();
    window.addEventListener("popstate", util.dealClosePage, false);
});