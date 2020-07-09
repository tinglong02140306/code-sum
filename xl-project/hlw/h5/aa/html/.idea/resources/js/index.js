var requestEvent = {
        // 微信授权登录
        weinxinLogin: function() {
            var curToken = window.location.href.split('token=')[1],
                param;
            if (!curToken) {
                // handleEvent.authLogin();
                return;
            }
            param = {
                'token': curToken
            };
            util.ajaxRequest('/wx/login/mp/wechat', param, '', function(res) {
                // handleEvent.toastDialog('用户信息:' + res.data.auth_token)
                if (res.code = "0000") {
                    if (res.data && res.data.auth_token) {
                        util.setLocalToken(res.data.auth_token);
                        localStorage.setItem('AUTH', null);
                        handleEvent.pageGopath();
                    }
                } else {
                    handleEvent.toastDialog(JSON.stringify(res.message))
                }
            }, function(res) {
                handleEvent.toastDialog(JSON.stringify(res.message))
            });
        },

        // 支付宝授权登录
        alipayLogin: function() {
            var code = window.location.href.split('auth_code=')[1],
                param;
            if (!code) {
                // handleEvent.authLogin();
                return;
            }
            param = {
                'auth_code': code
            };
            util.ajaxRequest('/isp/alipay/life/login', param, '', function(res) {
                // handleEvent.toastDialog('用户信息:' + JSON.stringify(res))
                if (res.code = "0000") {
                    if (res.data && res.data.token) {
                        util.setLocalToken(res.data.token);
                        localStorage.setItem('AUTH', null);
                        handleEvent.pageGopath();
                    }
                } else {
                    handleEvent.toastDialog(res.message)
                }
            }, function(res) {
                handleEvent.toastDialog(res.message)
            });
        },

        // 校验token是否过期
        checkIsValid: function() {
            util.ajaxRequest('/h5/login/check-token', {}, util.getLocalToken(), function(res) {
                if (res.code = "0000") {
                    // 签约和账单页面跳转
                    handleEvent.pageGopath();
                } else if (res.code = "0007") {
                    // token过期重新授权登录
                    localStorage.setItem('AUTH', '1');
                    handleEvent.authLogin();
                } else {
                    handleEvent.toastDialog(res.message);
                }
            }, function(res) {
                handleEvent.toastDialog(res.message)
            });
        }
    },
    handleEvent = {
        // 页面跳转
        pageGopath: function() {
            var type = window.localStorage.getItem('menuType'),
                path = '';
            // 签约
            if (type == 1) {
                if (util.isAlipay()) {
                    path = './aliSign.html';
                } else if (util.isWeiXin()) {
                    path = './wxSign.html';
                }
            } else if (type == 2) { // 账单
                path = './bill.html';
            }
            window.location.href = path;
        },
        // 链接
        authLogin: function() {
            var path = '';
            if (util.isAlipay()) {
                path = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018082261119327&auth_skip=false&scope=auth_user&redirect_uri=http%3a%2f%2flongting.test.etcsd.cn%2f%3fmenu%3d1';
            } else if (util.isWeiXin()) {
                path = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx56b18061fe4b7c26&redirect_uri=https://wx.etcsd.com/userInfo.jsp&response_type=code&scope=snsapi_userinfo&state=SZP001#wechat_redirect';
            }
            window.location.href = path;
        }
    },
    // 初始化
    init = function() {
        // 获取tab类型
        var menuType = window.location.href.split('menu=');
        if (menuType) window.localStorage.setItem('menuType', menuType);
        // if (util.getLocalToken()) {
        //     // 校验token是否过期
        //     requestEvent.checkIsValid();
        // } else {
        //     if (util.isAlipay()) {
        //         requestEvent.alipayLogin()
        //     } else if (util.isWeiXin()) {
        //         requestEvent.weinxinLogin()
        //     }
        // }

        // // 授权登录
        if (!localStorage.getItem('AUTH')) {
            if (util.getLocalToken()) {
                // 校验token是否过期
                requestEvent.checkIsValid();
            } else {
                handleEvent.authLogin();
                localStorage.setItem('AUTH', '1');
            }
        } else if (localStorage.getItem('AUTH') == 1) {
            if (util.isAlipay()) {
                requestEvent.alipayLogin()
            } else if (util.isWeiXin()) {
                requestEvent.weinxinLogin()
            }
        }
    };
$(function() {
    init();
});