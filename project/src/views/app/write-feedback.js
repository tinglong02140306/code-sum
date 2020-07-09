/**
 * @author leiran
 * @time 2016-08-05
 * @description 我的反馈
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common'
    ],
    function(common) {
        var platForm = common.checkMobilePlatform();
        //返回照片url
        window.getPicture = function(data) {
            var os = common.phoneOs();
            if (os != 'IOS') {
                $('.img-list a').remove();
            }
            $('.more').show();
            for (var i = 0; i < data.length; i++) {
                var str = "<a class='document' href='javascript:void(0)' data-src=" + data[i] + "><i class='delete-pic'></i><img src=" + data[i] + "></a>";
                /*$(appendA[i]).appendTo($('.img-list'));*/
                $('.img-list').append(str);
            }
           
            if ($('.img-list a').length == 3) {
                $('.more').hide();
            }
           
        };
       
        //保存完成返回
        window.getBack = function() {
            croods.pageClose({});
        };
        var AID,  //区域ID
            REQUEST,
            TOKEN,   //用户登录后的token值
            main = {},  // 页面初始化时创建页面
            OS = common.phoneOs(),
            vm = window.vm = fly.observable({
                userMess: {
                    phone: ''
                },
                //添加图片
                more: function() {
                    var URL = [];
                    for (var i = 0, len = $('.img-list a').length; i < len; i++) {
                        URL.push($(".img-list a img:eq(" + i + ")").attr("src"));
                    }
                    var result = JSON.stringify(URL);
                    REQUEST = common.packData({
                        "url": result,
                        "size": "3"
                    }, "", "1", false, "ct://LocalService@app@CameraFilm@");
                    croods.customPlugin({
                        action: 'CustomImagePlugin.ClickCameraFilm',
                        params: REQUEST,
                        success: function(res) {}
                    });
                },
                //提交
                submitEvent: function() {
                    if ($('.submit-btn').hasClass('nothingg') == false) {
                        var URL = [],
                            content = $('#feedback').val();
                        for (var i = 0; i < $('.img-list a').length; i++) {
                            URL.push($(".img-list a img:eq(" + i + ")").attr("src"));
                        } 
                       
                        var result = JSON.stringify(URL);
                        content = content.replace(/\u2006/g, '');
                        REQUEST = common.packData({
                            "url": result,
                            "questionContent": content,
                            "createUserPhone": vm.userMess.phone,
                            "portalTerminal": OS,
                            "areaId": AID
                        }, "", "1", false, "");
                        if(TOKEN){
                           REQUEST.params.token = TOKEN;
                        }
                        croods.customPlugin({
                            action: 'WriteFeedbackPlugin.SubmitForm',
                            params: REQUEST,
                            success: function(res) {
                            },
                            fail: function(res) {
                                common.toast(res.errMsg);
                            }
                        });
                    } else {
                        common.toast("写下您的意见反馈吧~");
                    }
                },
               
                back: function() {
                    $('.mark').show();
                },
                sure: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                },
                cancel: function() {
                    $('.mark').hide();
                }
            });

        // 初始化数据
        main.deletePic = function(e) {
            e.stopPropagation();
            $(this).parent().remove();
            var sum = $('.img-list a').length;
            if (sum < 3) {
                $('.more').show();
            }
        };

        main.dao = {
            //点击预览图片
            preview: function() {
                var URL = [];
                for (var i = 0, len = $('.img-list a').length; i < len; i++) {
                    URL.push($(".img-list a img:eq(" + i + ")").attr("src"));
                }
                var $this = $(this),
                    pos = $this.index() + 1,
                    result,
                    position;
                result = JSON.stringify(URL);
                position = JSON.stringify(pos);
                REQUEST = common.packData({
                    "url": result,
                    "position": position
                }, "", "1", false, "");
                croods.customPlugin({
                    action: 'CustomImagePlugin.BigImage',
                    params: REQUEST,
                    success: function(res) {}
                });
            },
            //校验
            check: function() {
                if (window.addEventListener) {
                    document.getElementById('feedback').addEventListener('input', function() {
                        var key = $('#feedback').val();
                        $('#wordNum').text(key.length);
                        $('.submit-btn').removeClass('nothingg');
                        if (key == "") {
                            $('.submit-btn').addClass('nothingg');
                        }
                    })
                }
            },
           
            //获取用户信息
            getUserRequest: function() {

                croods.customPlugin({
                    action: 'UserPlugin.getUser',
                    params: {},
                    success: function(data) {
                        if (data) {
                            var userInfor = {};
                            TOKEN = data.token;
                            userInfor.MOBILE_PHONE = data.phone ? data.phone : '';
                            $('input').val(userInfor.MOBILE_PHONE);
                            vm.userMess.set('phone', userInfor.MOBILE_PHONE);
                        }
                    }
                });
            },
            //获取区域Id
            getAreaId: function(){
                croods.customPlugin({
                    action: 'UserPlugin.getData',
                    params: {},
                    success: function(res) {
                        AID = res.areaId;
                    },
                    fail: function(res) {
                        common.toast(res.errMsg);
                    }
                });
            }
        };


        main.initEvent = function() {
            main.dao.getAreaId();
            main.dao.getUserRequest();
            main.dao.check();
            $('.write-wrapper').off('.document').on('click', '.document', main.dao.preview);
            $('.write-wrapper').off('.delete-pic').on('click', '.delete-pic', main.deletePic);
        };

        main.initEvent();
        fly.bind(document.body, vm);
        croods.bindButton({
            keycode: ['backbutton'],
            success: function(res) {
                vm.back();
            }
        });
    });
