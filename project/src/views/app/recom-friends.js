/**
 * @author tinglong
 * @time 2016-11-15
 * @description 推荐好友交互
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'remCacul',
        'share'
    ],
    function(common, remCacul, share) {

        // 页面初始化时创建页面
        var TOKEN = "", // 用户token
            INDEX = 1,
            main = {},
            inOnline = true, // 是否有网
            OS = common.phoneOs(),
            OBJ = {
                shareType: croods.shareType.WebPage,
                shareText: "",
                url: CONFIG.shareFile,
                title: CONFIG.appName,
                site: CONFIG.appName,
                titleUrl: CONFIG.shareFile,
                siteUrl: CONFIG.shareFile,
                imageUrl: CONFIG.shareImg //服务器上的图片
            },
            options = [{
                icon: "qq",
                platform: "QQ",
                type: 1
            }, {
                icon: "qzone",
                type: 2,
                platform: "QQ空间"
            }, {
                icon: "session",
                type: 4,
                platform: "微信"
            }, {
                icon: "timeline",
                type: 5,
                platform: "朋友圈"
            }],
            flag = true,
            vm = window.vm = fly({
                query: {
                    num: ""
                },

                // 跳转到登录页面
                loginEvent: function() {
                    var request = common.packData({}, '', '1', '', '');
                    croods.customPlugin({
                        action: 'UserPlugin.isLogin',
                        params: request,
                        success: function(res) {
                            var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=recom-friends.html'); // 对接口请求数据封装
                            croods.customPlugin({
                                action: 'CIPRoutePlugin.action',
                                params: request,
                                success: function(res) {}
                            });
                        }
                    });
                },

                OP: [],
                back: function() {
                    var shareDom = document.getElementsByClassName('share')[0],
                        shareMask = shareDom.handler.mask.className;
                    if (shareMask.indexOf('show') > -1) {
                        $('.mask').removeClass('show');
                        $(".sheet").css({
                            "transform": "translate3d(0,100%,0)",
                            "-webkit-transform": "translate3d(0,100%,0)",
                        });
                    } else {
                        croods.pageClose({});
                    }

                },
                share: function(e) {

                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                if (flag) {
                                    vm.set('OP', options);
                                    flag = false;
                                }
                                main.callShare(this, e);
                            }
                        }
                    });
                }
            });

        // 初始化数据
        main.getMessage = function() {
            if (inOnline) {
                $('.recom-friends-content').removeClass('hide');
                $('.no-net').addClass('hide');
                croods.customPlugin({
                    action: 'UserPlugin.getUser',
                    //必填,PluginName为插件名、ActionName为插件内方法
                    params: {},
                    //可选,插件需请求参数
                    success: function(res) { //请求成功回调
                        if (res && res.token) { // 已登录
                            TOKEN = res.token;
                            var username = res.name || res.nickname || res.username,
                                username = username.substring(0, 3) + '...';
                            $('.code-value-text').removeClass('hide');
                            $('.code-value-num').removeClass('hide');
                            $('.code-value-login').addClass('hide');
                            main.renderCode(TOKEN, username);
                        } else { // 未登录
                            TOKEN = '';
                            OBJ.shareText = "一键挪车、警网头条、违法查缴，更有公安办事大厅等海量服务，快来下载吧！";
                            $('.code-value-text').addClass('hide');
                            $('.code-value-num').addClass('hide');
                            $('.code-value-login').removeClass('hide');
                        }
                    }
                });
            } else {
                $('.recom-friends-content').addClass('hide');
                $('.no-net').addClass('hide');
                common.toast('网络无法连接，请检查您的网络');
            }
        };

        main.renderCode = function(token, username) {
            if(token) {
                TOKEN = token;
            }
            croods.ajax({
                method: '68932c6336de4598b139584f0057c096',
                params: {
                    osType: OS,
                    token: TOKEN
                },
                //请求参数
                success: function(res) { //请求成功回调
                    if (common.checkToken(res, function(newToken) {
                        main.renderCode(newToken, username);
                        INDEX++;
                    }, INDEX)) {
                        res = JSON.parse(res);
                        var data = res.data;
                        vm.set('query.num', data);
                        OBJ.shareText =  "我的邀请码为"+ data +"。这里有一键挪车、警网头条、违法查缴，更有公安办事大厅等海量服务，快来下载吧！";
                    }
                },
                fail: function(res) {
                    //common.toast('数据加载失败！');
                    OBJ.shareText =  "这里有一键挪车、警网头条、违法查缴，更有公安办事大厅等海量服务，快来下载吧！";  // 接口报错情况
                }
            });
        };

        // 初始化
        main.init = function() {
            main.getMessage();
        };
        main.callShare = function(that) {
            console.log(OBJ);
            that.shareDom = document.getElementsByClassName('share')[0];
            that.share = that.shareDom.handler;
            that.share.show();
            that.share.shareFun(OBJ, function() {
                common.toast('分享成功');
            });
        };

        $('.recommend-share').on('click', vm.share);

        croods.bindButton({
            keycode: ['backbutton'],
            success: function(res) {
                var shareDom = document.getElementsByClassName('share')[0],
                    shareMask = shareDom.handler.mask.className;
                if (shareMask.indexOf('show') > -1) {
                    $('.mask').removeClass('show');
                    $('.share').addClass('d-none');
                    $(".sheet").css({
                        "transform": "translate3d(0,100%,0)",
                        "-webkit-transform": "translate3d(0,100%,0)",
                    });
                } else {
                    croods.pageClose({});
                }
            }
        });


        fly.bind(document.body, vm);

        $(function() {
            main.init();

            common.noNet($('.wrap'), function() {
                inOnline = false; // 断网情况 
                $('.recom-friends-content').addClass('hide');
                $('.no-net').removeClass('hide');
                common.toast('网络无法连接，请检查您的网络');
            }, function() {
                inOnline = true; // 有网络
                $('.recom-friends-content').removeClass('hide');
                $('.no-net').addClass('hide');
            });
        });

    });