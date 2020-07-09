/**
 * @author tinglong
 * @time 2017-11-08
 * @description 搜索
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'share',
        'common'
    ],
    function(remCacul, share, common) {
        var AID = '', // 区域ID  common.getQueryString('aid')
            DEVICE = "", // 设备号
            TOKEN, // 唯一标识符
            OS = common.phoneOs(), // 终端类型
            serviceUrl = [],
            workUrl = [],
            CPAGE = 1, // 当前页
            searchTypeTxt = common.getParam('searchTypeTxt'),  // 搜索分类文本值
            searchKey = common.getParam('searchKey'),  // 输入文本值获取
            mescroll, // 上拉加载，下拉刷新
            preValues = '',   // 输入框上一次的值 点击详情时获取
            currValue = common.getParam('searchKey'),  // 输入文本值获取
            hisRecordData,
            NEWSIMG = common.getListImgSize(111, 0.75),
            praiseIndex = 1,
            collectIndex = 1,
            requestNewsIndex = 1,
            swiper,   // swiper 对象
            currIndex = 0,  // 头条类型 tab index值 0 综合 1警微热点
            localCity,  // 当前城市名 单位为地级市
            mescrollArr = new Array(2), // 2个菜单所对应的2个mescroll对象
            cpageArr = new Array(2),  // 2个菜单所对应的当前页
            currValueArr = new Array(2),  // 2个菜单所对应的当前页
            shareListFlag = true, // 标记是否渲染分享列表
            shareId = '',
            platForm = common.checkMobilePlatform(),
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
            path = 'http://61.191.24.229:5069/',  // 图片视频路径
            vm = window.vm = fly.observable({
                // 返回按钮
                back: function() {
                    croods.pageClose({});
                },
                // 清空文本内容按钮
                deleteEvent: function() {
                    $('.search-input input').val('');
                    $('.btn-delete').addClass('hide');
                    searchKey = '';
                    switch(searchTypeTxt) {
                        case '资讯':
                        case '警网头条':
                            $('#dataList' + currIndex).empty();
                            $('#wrapper' + currIndex).addClass('hide');
                            $('.empty' + currIndex).addClass('hide');
                            break;
                        case '服务项':
                            $('.service-list-details').empty();
                            $('.empty').addClass('hide');
                            $('#serviceItem').addClass('hide');
                            break;
                        case '办事项':
                            $('.work-list-details').empty();
                            $('.empty').addClass('hide');
                            $('#WorksItem').addClass('hide');
                            break;
                    }
                    // $('#conwrapper').addClass('hide');
                    // $('.empty').addClass('hide');
                    
                    

                    // 输入框label显示与隐藏
                    $('.search-input label').removeClass('hide');
                    $('.search-input input').blur();
                }
            });
            fly.bind(document.body,vm);

        var renderEvent = {  
            /**
             * 加载当前滚动条
             */
            renderScroll: function(wrapperId) {
                var mescroll = new MeScroll(wrapperId, {
                    down: {
                        use: false
                    },
                    up: { // 上拉配置
                        noMoreSize: 15,
                        htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                        callback: function(page, mescroll) {
                            cpageArr[currIndex] = page.num;
                            if(currValueArr[currIndex]) {
                                requestEvent.requestNewsInfoData();
                            }  
                        },
                        page: {
                            size: 15
                        }
                    }
                });
                return mescroll;
            },

            // 资讯数据渲染模块  
            renderNewsInfo: function(res) {
                // var res = data.rows;
                if (!$.isEmptyObject(res)) {
                    if(currIndex == 0) {
                        for (var i = 0, len = res.length; i < len; i++) {
                        var obj = res[i],
                            imgUrl;

                        if(res[i].iconUrl) {
                            imgUrl = res[i].iconUrl.split(',');
                            var img1 = imgUrl[0], // 资讯图片1
                            img2 = imgUrl[1], // 资讯图片1
                            img3 = imgUrl[2]; // 资讯图片3
                            obj.imgUrl1 = img1;
                            obj.imgUrl2 = img2;
                            obj.imgUrl3 = img3;
                            if (img1 && img2 && img3) {
                                obj.tag = 3;
                                obj.imgUrl1 = img1 + common.getListImgSize(4.8*2, 0.75);
                                obj.imgUrl2 = img2 + common.getListImgSize(4.8*2, 0.75);
                                obj.imgUrl3 = img3 + common.getListImgSize(4.8*2, 0.75);
                            } else if (img1 || img2 || img3) {
                                obj.imgUrl1 = (img1 || img2 || img3) + common.getListImgSize(4.7*2, 0.75);
                                obj.tag = 1;
                            }else {
                                obj.imgUrl1 = '';
                                obj.tag = 0;
                            }
                        }else {
                            obj.imgUrl1 = '';
                            obj.tag = 0;
                        }

                        if(obj.releaseTime) {
                           obj.releaseTime = obj.releaseTime.substring(0,10)
                        }
                        }
                    }else if(currIndex == 1) {
                        for (var i = 0, len = res.length; i < len; i++) {

                            res[i].multiple = i + (cpageArr[currIndex] -1)*15;  // 列表项中的index值
                            
                            // 点赞 收藏 状态处理 标志位转string类型
                            res[i].collection = typeof res[i].collection != 'string' ? (res[i].collection).toString() : res[i].collection;
                            res[i].prise = typeof res[i].prise != 'string' ? (res[i].prise).toString() : res[i].prise;

                            // 数据格式处理
                            res[i].shareCount = res[i].shareCount > 9999 ? '9999+' : res[i].shareCount;
                            res[i].collectionCount = res[i].collectionCount > 9999 ? '9999+' : res[i].collectionCount;
                            res[i].priseCount = res[i].priseCount > 9999 ? '9999+' : res[i].priseCount;

                            // 带标签的文章内容处理
                            res[i].notFull = res[i].cropLength == 0 ?  true : false;
                            res[i].content = (res[i].content).replace(/\\/g, '');
                            res[i].content = (res[i].content).replace(/\/\//g, 'http://');
                            res[i].content = (res[i].content).replace(/\&quot;/g, '"');  // 将&quot;转换成"
                            res[i].content += res[i].cropLength == 0 ? '' : '...';
                            /*var resultArr = common.getContent(res[i].content, 140);
                            res[i].content = resultArr[0];
                            res[i].notFull = resultArr[1];*/

                            // 图片预览
                            if(res[i].appendixType == 1) {
                                var imgList = [];
                                for(var j = 0; j < res[i].appendixList.length; j++) {
                                    if(!!res[i].appendixList[j]) {
                                        var gifFlag = res[i].appendixList[j].indexOf('gif');  // 是否为动图标志位
                                        if(gifFlag <= -1) {
                                            res[i].appendixList[j] = CONFIG.viewPath + res[i].appendixList[j];
                                        }
                                        imgList.push(res[i].appendixList[j]);
                                    }
                                    
                                }
                                imgList = JSON.stringify(imgList);
                                res[i].imgList = imgList;
                                res[i].appendixList = $.parseJSON(imgList);  // 容错处理
                            }else if(res[i].appendixType == 2) {  // 视频播放
                                res[i].appendixAddress = CONFIG.viewPath + res[i].appendixAddress;  
                            }

                          
                        }
                    }
                    if(cpageArr[currIndex] == 1) {
                        $('#dataList' + currIndex).empty();
                    }
                    // 数据模板渲染
                    var tmpl,
                        wrapperSel;
                    if(currIndex == 0) {
                        tmpl = fly.template('notifyTmpl', res);
                    }else if (currIndex == 1) {
                        tmpl = fly.template('blogTmpl', res);
                    }
                    wrapperSel = '#wrapper' + currIndex;
                    $('#dataList' + currIndex).append(tmpl);

                    if(currIndex == 1) {
                        // 警微热点内容行间距微调
                        if(OS == 'IOS') {
                            $('.article-sec, .article-sec .content-text').addClass('blog-con-line');
                        }
                        // 图片预览
                        mui.previewImage({ 
                            header: '',
                            footer: '<span class="mui-preview-indicator"></span><div class="mui-preview-btn save-logo">保存</div>'
                        }); // 插件预览
                    }
     
                    $('.content .city-news img').off('error').on('error', function() {  // 图片error处理
                        $(this).attr('src', CONFIG.path + 'img/home/list-default.png');
                    });
                    // 懒加载
                    $("img.lazy", $(wrapperSel + " .city-news li.unloaded," + wrapperSel + " .city-news .item-content .unloaded")).lazyload({
                        container: $(wrapperSel),
                        threshold: 200,
                        placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAYAAAA3d5OIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5NDFERjlDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5NDFERkFDMjkxMTFFNzg0MjVGMUQ4M0Q4RThBQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDk0MURGN0MyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDk0MURGOEMyOTExMUU3ODQyNUYxRDgzRDhFOEFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsaTlT0AAAToSURBVHja7N1LbttWFIBh6mFbsOVOu4yiC+mwaYpuIcvxDooCDZpZVpJlJAOP6rdll0cQU1doLFq694o0vw8g0jhpIjP6zXMpUh6dn59XT/xQb+/q7ad6+74CtvW53j7W21m9fWo+OFoFN6m3P+rtF/sJkntfb7/V22K6+oDYIJ9oa1xvb8arMVJskNfP0dp4tWYD8nsXwb21H6CI5Ug5tx+giO/G9gGUIzgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHggMEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOBAcIDgQHAgOEBwIDhAcCA4QHAgOBAcsKupXdB/t7e3y22xWFSj0aiaTCbVbDZb/ojgSOji4qK6u7v7+vPHx8fq4eFh+bHj4+Pq8PDQTjJSksL19fV/Ylt3eXm5POohOBK4ublJ8nsQHBvEkSvGx03u7+/tLMGB4OjTP9x4vDwjuYkzlYIjgYitzRnIo6MjO0twpLDptbb49enUKz9d4l+j50e5+Xy+PBMZL3zH62/NGBmxHRwc2EmCI3V0EVdszVnLNms7BEeC+LCGAwQHghukWHvFFSHNSQ+s4cgkLkCOrRFnFuMqf+sxRzgyxxbi6v+45QbBkVCEtR5bI8bLb/0aguOFYq0W96ptOvo9d68bgqOlGBnb3FoTUeY8keJkTXlOmhR2dXXV+i7sCCLiPD09Tf444lKweCxN+E7WOMK9ynXbS+/AjjgjjNSPI46eT4+y8bHUfw+C6/S67Vuai5NzP47m3b8QXK81o2GbdVuKUXSX9WP8PdZ0ghvMuu25aNfHwJdq8y5e8ecbLQXXWynHtF3Wcy95HLGeM1oKrndynPDYJuBtHofRUnCDW7ftMhruOoo2/x+C64XcL1q3jXmX9WO8KO6NZAXXefEkzX1ZVpuXGVKsH+MSM6Ol4DorjgqlzvI990J6HNVSjIRGS8F1et1W+skZca+/nXmzfkz5RcRoKbjOiSf5Psav9ZMiOdaPqV54FxxJxFpnX984I+Jqjmg5149GS8F1Zt227xtG4zFEEDnXj3GEc2Os4Pbq6dFl30pcHRLBGS0Ftze7Xt/Y188ZwRX3f2cIh8BoKbjitrmZ9DXZ50kiwQ1w3WasGuY4LbjCcl6U3McvPEZLwWVftzlL968Yq42WgsvCe34YLQVXSI6bSV/TaGnfCM66rfDR32gpuGQjk3vCjJaCK3RSwHv8Gy0FZ93W2dHSFyjBbb1uw2gpOOu2zn+xciWO4Frzvdl2581kBdeK7z6ajjeTFdyzunQz6WsZLZ10EpzFvtFScF0Yf1wpYbQUXKGvwt53Me9o6ayl4L6u2zwZ8vNmsoJbclFyOb5PwcCD85Zv5UfLoZ+1HHRwRpz9jJaCg1JPuPGwn3LTIX/yJycnxso1o9Eo2587mUyq2WwmuMF+8tNpNZ/PVYaREgQHCA4EBwgOBAeCAwQHggMEB4IDwQGCA8EBggPBAYIDwYHgAMGB4ADBgeBAcIDgQHCA4EBwgOBAcCA4QHAgOEBwIDgQHCA4EBwgOBAcCM4uAMGB4ADBQa+C+9tugCI+R3B/2g9QxMcI7sx+gCLOIrhP9faXfQFZfYjWmpMmv9bbe/sEsogD2tv4jya4xeoDP9bb7/X2xT6CnXxZtRRNvVk1Vv0jwABSdjl9DH5YIgAAAABJRU5ErkJggg=="
                    });
                    $(wrapperSel + " .city-news li.unloaded," + wrapperSel + " .city-news .item-content .unloaded").removeClass('unloaded');  
                }
            },

            // 服务项数据渲染
            renderServiceInfo: function(data) {
                $(".service-list-details").empty();
                serviceUrl = [];
                for(var i=0; i<data.length;i++) {
                    serviceUrl.push(JSON.stringify(data[i]));
                }
                var tmpl = fly.template('serviceInfoTmpl', data);
                $(".service-list-details").append(tmpl);

                $('.service-list-details .service-link img').off('error').on('error', function() {
                    $(this).attr('src', CONFIG.path + 'img/home/owl-default.png');
                });
            },

            // 办事项数据渲染
            renderWorkInfo: function(data) {
                $(".work-list-details").empty();
                var tmpl = fly.template('workInfoTmpl', data);
                $(".work-list-details").append(tmpl);
            }
        };
        var requestEvent = {  // 数据请求模块

            // 服务项数据请求并渲染
            requestServiceInfoData: function() {
                croods.ajax({
                    method: '2e6239580f8a45beb34e097b779e28c6',
                    params: {
                        condition: searchKey, // 搜索条件
                        currentPageNo: 1,
                        pageSize: 15,
                        areaId: AID,
                        osType: OS
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        var res1 = JSON.parse(res),
                            data;
                        if(res1 && res1.data && res1.data.rows) {
                            data = res1.data.rows;  // 服务项内容
                        }

                        if(data && data.length) { // 服务项内容
                            // $('#conwrapper').removeClass('hide');
                            $('#serviceItem').removeClass('hide');
                            $('.empty').addClass('hide');
                            renderEvent.renderServiceInfo(data);  
                        }else {
                            $('#serviceItem').addClass('hide');
                            // $('#conwrapper').addClass('hide');
                            $('.empty').removeClass('hide');

                        }
                    },
                    fail: function(res) { //请求失败回调
                        // common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });
            },
            // 办事项数据请求并渲染
            requestWorkInfoData: function() {
                croods.ajax({
                    method: 'd7a40be3dbc547a8a42c59bf357372e4',
                    params: {
                        condition: searchKey, // 搜索条件
                        currentPageNo: 1,
                        pageSize: 15,
                        osType: OS,
                        areaId: AID,
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        var res1 = JSON.parse(res),
                            data;  // 办事项内容
                        if(res1 && res1.data && res1.data.rows) {
                            data = res1.data.rows;  // 服务项内容
                        }

                        if(data && data.length) { // 服务项内容
                            // $('#conwrapper').removeClass('hide');
                            $('#WorksItem').removeClass('hide');
                            $('.empty').addClass('hide');
                            renderEvent.renderWorkInfo(data);  
                        }else {
                            // $('#conwrapper').addClass('hide');
                            $('#WorksItem').addClass('hide');
                            $('.empty').removeClass('hide');
                        }
                    },
                    fail: function(res) { //请求失败回调
                        // common.toast('数据请求失败！');
                    }
                });
            },

            // 资讯数据请求 并渲染
            requestNewsInfoData: function() {
                var code,
                    param = {};
                switch (currIndex) {
                    case 0:
                        code = '6a1acc4d7c52448f9301579b2c2c8a74';
                        param = {
                                condition: currValueArr[currIndex], // 搜索条件
                                currentPageNo: cpageArr[currIndex],
                                pageSize: 15,
                                osType: OS,
                                areaId: AID,
                            };
                            break;
                    case 1:
                        code = 'ba9c4e2493b245f5b8ea9037691f3167';
                        param = {
                                keywords: currValueArr[currIndex], // 搜索条件
                                currentPageNo: cpageArr[currIndex],
                                pageSize: 15,
                                deviceId: DEVICE,
                                token: TOKEN
                            };
                            break;
                    default:
                        break;
                }
                croods.ajax({
                    method: code,
                    params: param,
                    //请求参数
                    success: function(res) { //请求成功回调
                        if (common.checkToken(res, function(newToken) {
                                TOKEN = newToken;
                                requestEvent.requestNewsInfoData();
                                requestNewsIndex++;
                            }, requestNewsIndex)) {
                                var res1 = JSON.parse(res),
                                    data;  // 资讯内容
                                if(res1.flag) {
                                    data = res1.data.rows;
                                    if(data && data.length) {
                                        mescrollArr[currIndex].endByPage(res1.data.rows.length, res1.data.totalPageCount);
                                        /*$('#conwrapper').removeClass('hide');
                                        $('.home-news').removeClass('hide');
                                        $('.empty').addClass('hide');*/
                                        // $('.swiper-wrapper').removeClass('hide');
                                        $('#wrapper' + currIndex).removeClass('hide');
                                        $('.empty' + currIndex).addClass('hide');

                                        renderEvent.renderNewsInfo(data);
                                    }else {
                                        mescrollArr[currIndex].endByPage(0, 0);
                                        if(cpageArr[currIndex] == 1) {
                                            /*$('#conwrapper').addClass('hide');
                                            $('.home-news').addClass('hide');
                                            $('.empty').removeClass('hide');*/
                                            // $('.swiper-wrapper').addClass('hide');
                                            $('#wrapper' + currIndex).addClass('hide');
                                            $('.empty' + currIndex).removeClass('hide');
                                        }
                                    }
                                }else {
                                    common.toast('服务端错误');
                                } 
                        }
                               
                    },
                    fail: function(res) { //请求失败回调
                        mescrollArr[currIndex].endErr();
                        // common.toast('数据请求失败！');
                    },
                    complete: function(res) {
                        common.mask(false);
                        mescrollArr[currIndex].endSuccess();
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                            common.toast(res.message); 
                        }
                    }
                });
            },
            /**
             * 获取设备id
             */
            getDevice: function(callback) {
                croods.customPlugin({
                    action: 'UserPlugin.getDevice',
                    params: {},
                    success: function(data) {
                        DEVICE = data.deviceId;
                        callback && callback();
                    }
                });
            },
            // 分享计数请求接口
            requestShareCount: function(self) {
                croods.ajax({
                    method: 'ed01ad526eb043519c0d656f53e416db',
                    params: {
                        resId: shareId // 警微热点id
                    },
                    //请求参数
                    success: function(res) { //请求成功回调
                        res = $.parseJSON(res);
                        if (res.flag) {
                            var num = parseInt(self.find('.num').html()) + 1;
                            self.find('.num').html(num);
                        }
                    },
                    fail: function(res) { //请求失败回调
                    },
                    complete: function(res) {
                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                            common.toast('网络无法连接，请检查您的网络');
                        }
                    }
                });
            }
        };

        /**
         * 事件添加
         */
        var addEvent = function() {
            var self = $('.wrap');

            // 点击服务项跳转到详情页
            self.off('.service-list-details .service-link').on('click', '.service-list-details .service-link', eventHandle.appClick);

            // 点击资讯跳转到详情页
            self.off('.new-details').on('click', '.new-details', eventHandle.newsDetailsEvent);

            // 点击办事项跳转到详情页
            self.off('.work-list-details a').on('click', '.work-list-details a', eventHandle.returnWorkDetail);

            // 监听输入框内容变化状态
            self.off('.search-input input').on('input propertychange', '.search-input input', eventHandle.realTimeDynIn);

            // 隐藏、显示输入框上的label标签
            self.off('.search-input label').on('click', '.search-input label', eventHandle.hideLabelEvent);

            // 警微热点点击 跳转详情 
            self.off('.blog-news-item').on('click','.blog-news-item',eventHandle.returnBlogDel);

            // 警微热点点击 跳转详情
            self.off('.full-text').on('click', '.full-text', eventHandle.returnBlogDelFull);

            // 分享按钮点击事件
            self.off('.btn-wrap .btn-share').on('click', '.btn-wrap .btn-share', eventHandle.shareClick);

            // 收藏按钮点击事件
            self.off('.btn-wrap .btn-collect').on('click', '.btn-wrap .btn-collect', eventHandle.collectClick);

            // 点赞按钮点击事件
            self.off('.btn-wrap .btn-praise').on('click', '.btn-wrap .btn-praise', eventHandle.praiseClick);

            // 图片预览点击事件
            self.off('.blog-img-list .img-item').on('click','.blog-img-list .img-item',eventHandle.imgPreviewClick);

            // 视频点击事件
            self.off('.vedio-unit').on('click','.vedio-unit',eventHandle.vedioPlayClick);

            // 图片 功能点击事件
            // $(document).on('click', '.mui-preview-btn', function() {
            //     $('.btn-content').toggleClass('hide');
            // });
            // 图片保存点击事件
            $('body').on('click', '.save-logo', eventHandle.imgSaveClick);
        };
        /**
         * 事件处理
         */
        var eventHandle = {

            // 隐藏、显示输入框上的label标签
            hideLabelEvent: function() {
                $('.search-input input').focus();
            },

            /**
             * 服务点击事件
             */
            appClick: function() {
                eventHandle.saveHistoryData(); //存历史记录
                var index = $(this).index(),
                    type = $(this).attr('data-type'),
                    linkUrl = serviceUrl[index],
                    jumpType;
                switch(type) {
                    case '1':
                        jumpType = "app";
                        break;
                    case '2':
                        jumpType = "h5zip";
                        break;
                    case '3':
                        jumpType = "html";
                        break;
                    default: 
                        jumpType = "local";
                }
               var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + linkUrl);
               $(this).addClass('visited');
                if (type != undefined) {
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: REQUEST,
                        success: function(res) {}
                    });
                }
            },
            /**
             * 资讯点击
             */
            newsDetailsEvent: function() {
                eventHandle.saveHistoryData();//存历史记录
                var id = $(this).data('id');
                var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=news-detail.html?id=' + id); // 对接口请求数据封装
                $(this).addClass('visited');
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },

            /*
             * 办事项跳转到详情页
             */
            returnWorkDetail: function() {
                eventHandle.saveHistoryData();//存历史记录
                var self = $(this),
                    returnId = self.attr('data-id'),
                    name = self.attr('data-projectname'),
                    returntype = self.attr('data-type'),
                    deatilUrl = self.attr('data-url'),
                    isAddHeader; // 是否有头部
                var REQUEST = common.packData({}, '', '1', '', '');
                croods.customPlugin({
                    action: 'UserPlugin.isLogin',
                    params: REQUEST,
                    success: function(res) {
                       croods.customPlugin({
                            action: 'UserPlugin.getUser',
                            params: {},
                            success: function(data) {
                                TOKEN = data.token ? data.token: '';
                                
                                if (returntype == '1' || returntype == '2') { // 查询、可办理
                                    isAddHeader = '1'; // 有头部
                                } else if (returntype == '3') {
                                    isAddHeader = '0'; // 没头部
                                }
                                var jFlag = (deatilUrl).indexOf('/app/convertAddr') > -1, // 含次字符串的都是交管办事项
                                    accFlag = (deatilUrl).indexOf('access_token') == -1;
                                if (jFlag && accFlag) {
                                    deatilUrl = deatilUrl + '&access_token=' + TOKEN;
                                }
                                var returnUrl = JSON.stringify({
                                    'isAddHeader': isAddHeader,
                                    'serviceAddr': deatilUrl,
                                    'serviceName': name
                                });

                                self.addClass('visited'); // 办事项被点击后置灰
                                if (returntype == '1' || returntype == '2' || (returntype == '3' && returnId)) {
                                    eventHandle.regionSwitch(returnUrl); // 原生页面跳转
                                }
                            }
                        });
                    }
                });
                
            },
            // 原生页面跳转
            regionSwitch: function(returnUrl) {
                var request = common.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },
            // 返回按钮
            backEvent: function() {
                window.history.go(-1);
            },
            // 根据搜索分类 进行获取数据
            judgeTypeRequest: function() {
                switch (searchTypeTxt) {
                    case '资讯':
                    case '警网头条':
                        $('.swiper-container').removeClass('hide');
                        eventHandle.initSwiper();
                        if(mescrollArr[currIndex] == null){
                            currValueArr[currIndex] = $('.search-input input').val();
                            mescrollArr[currIndex] = renderEvent.renderScroll("wrapper" + currIndex);
                            if($.trim($('.search-input input').val())) {
                                mescrollArr[currIndex].triggerUpScroll();
                            } 
                        }
                        /*if (!mescroll) {
                        // 初始化滚动条
                            renderEvent.renderScroll();  
                        }
                        if(searchKey) {
                            mescroll.triggerUpScroll();
                        }*/
                        break;
                    case '服务项':
                        if (searchKey) {
                            requestEvent.requestServiceInfoData();
                        }
                        break;
                    case '办事项':
                        if (searchKey) {
                            requestEvent.requestWorkInfoData();
                        }
                }
            },

            // 实时动态获取输入框的值
            realTimeDynIn: function() {
                eventHandle.hideShowlabel();
                currValue = $.trim(currValue);

                if(currValue) {
                    $('.btn-delete').removeClass('hide');
                        common.noNet($('.wrap'), function() {
                            searchKey = currValue;
                            $('.no-net').removeClass('hide');  // 无网络状态页
                            $('.content').addClass('hide');  // 内容列表页
                            if(searchTypeTxt == '资讯' || searchTypeTxt == '警网头条') {
                                $('.content').css('position', 'static');
                            }
                            common.toast('网络无法连接，请检查您的网络');
                        },function() {
                           searchKey = currValue;
                            $('.content ').removeClass('hide');
                            $('.no-net').addClass('hide');
                           
                            // 接口数据渲染
                            if(searchTypeTxt == '资讯' || searchTypeTxt == '警网头条') {
                                $('.content').css('position', 'absolute');
                                if(currValueArr[currIndex] != currValue) {
                                    currValueArr[currIndex] = $('.search-input input').val(); 
                                    mescrollArr[currIndex].resetUpScroll();
                                }
                            }else if(searchTypeTxt == '服务项') {
                                requestEvent.requestServiceInfoData();
                            }else if(searchTypeTxt == '办事项') {
                                requestEvent.requestWorkInfoData();
                            }
                        });
                }else {
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                $('.no-net').removeClass('hide');
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                $('.no-net').addClass('hide');
                            }
                        }
                    });

                    $('.btn-delete').addClass('hide');
                    searchKey = currValue;
                    
                    switch(searchTypeTxt) {
                        case '资讯':
                        case '警网头条':
                            $('#dataList' + currIndex).empty();
                            $('#wrapper' + currIndex).addClass('hide');
                            /*$('.city-news').empty();
                            $('.home-news').addClass('hide');
                            $('.mescroll-hardware').addClass('hide');*/
                            break;
                        case '服务项':
                            $('.service-list-details').empty();
                            $('#WorksItem').addClass('hide');
                            break;
                        case '办事项':
                            $('.work-list-details').empty();
                            $('#serviceItem').addClass('hide');
                            break;
                    }


                }
            },
            // 存历史记录
            saveHistoryData: function() {
                searchKey =  $.trim($('.search-input input').val());
                $('.search-history').removeClass('hide');
                var obj = {
                    key: ''
                };
                hisRecordData = JSON.parse(localStorage.getItem('hisRecordData'));
                if(searchKey && searchKey != preValues) {
                    preValues = searchKey;
                    if(!(hisRecordData && hisRecordData.length)) {
                        obj.key = searchKey;
                        hisRecordData = [];
                        hisRecordData.unshift(obj.key);
                    }else if(hisRecordData.length < 6) {
                        $.each(hisRecordData, function(i,item) {
                            if(item == searchKey) {
                                hisRecordData.splice(i,1);
                            }
                        });
                        obj.key = searchKey;
                        hisRecordData.unshift(obj.key);
                    }else if(hisRecordData.length >= 6) {
                        $.each(hisRecordData, function(i,item) {
                            if(item == searchKey) {
                                hisRecordData.splice(i,1);
                            }
                        });
                        if(hisRecordData.length > 5) {
                            hisRecordData = hisRecordData.slice(0,5);
                        }
                        obj.key = searchKey;
                        hisRecordData.unshift(searchKey);
                    }
                }
                
               
                localStorage.setItem('hisRecordData',JSON.stringify(hisRecordData));
            },

            // 输入框label显示与隐藏
            hideShowlabel: function() {
                currValue = $('.search-input input').val();  // 获取当前输入值  
                if(currValue) {
                    // 输入框label显示与隐藏
                    $('.search-input label').addClass('hide');
                    $('.search-input input').focus();
                }else {
                    // 输入框label显示与隐藏
                    $('.search-input label').removeClass('hide');
                }
            },

            // 输入框中label中的值
            inputSearValue: function() {
                $('.search-input input').val(searchKey);

                switch(searchTypeTxt) {
                    case '警网头条':
                        $('.search-input label').text('搜索资讯');
                        break;
                    case '':
                        $('.search-input label').text('搜索办事项、服务项、资讯');
                        break;
                    default:
                        $('.search-input label').text('搜索'+ searchTypeTxt);
                }
            },

            // 初始化轮播组件
            initSwiper: function() {
                swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    paginationBulletRender: function(index, className) {
                        var name = '';
                        switch (index) {
                            case 0:
                                name = '综合';
                                break;
                            case 1:
                                name = '警微热点';
                                break;
                            default:
                                name = '';
                        }
                        var classNames = 'innner-item';
                        return '<div class="' + className + '">' + '<span class="innner-item" >' + name + '</span>' + '</div>';
                    },
                    onSlideChangeStart: function(swiper) {

                        // 根据type类型 请求不同接口数据
                        common.noNet($('.wrap'), function() { // 展示无网络图片
                            common.toast('网络无法连接，请检查您的网络');
                            $('.wrap .no-net').css({
                                'top' : '0rem !important',
                                'background': '#fff'
                            });
                            $('.swiper-container').addClass('hide');
                        }, function() {
                            $('.wrap .no-net').css({
                                'top' : '3rem !important',
                                'background': '#f5f5f5'
                            });
                            $('.swiper-container').removeClass('hide');
                            eventHandle.getTabData(); 
                        });
                    }
                });
                
            },
            // 根据type类型 请求不同接口数据
            getTabData: function() { // 头条类型 0 综合 1警微热点
                currIndex = $('.swiper-slide-active').data().index;  // 头条类型 index值 0 推荐 1 本地 2警微热点
                //取出菜单所对应的mescroll对象,如果未初始化则初始化
                if(mescrollArr[currIndex] == null){
                    mescrollArr[currIndex] = renderEvent.renderScroll("wrapper" + currIndex);
                }
                var currentV = $('.search-input input').val();
                if(currValueArr[currIndex] != currentV) {
                    if(currentV) {
                        currValueArr[currIndex] = $.trim($('.search-input input').val());
                        mescrollArr[currIndex].resetUpScroll();
                    }else {
                        $('#dataList' + currIndex).empty();
                        $('#wrapper' + currIndex).addClass('hide');
                    } 
                }
                    // mescrollArr[currIndex].resetUpScroll();
                
            },
            // 获取用户信息 和区域信息
            getUserInfo: function() {
                common.noNet($('.wrap'), function() {
                    common.toast('网络无法连接，请检查您的网络');
                    $('.no-net').removeClass('hide');  // 无网络状态页
                    $('.content').addClass('hide');  // 内容列表页
                    if(searchTypeTxt == '资讯' || searchTypeTxt == '警网头条') {
                        $('.content').css('position', 'static');
                    }
                },function() {
                    $('.no-net').addClass('hide');  // 无网络状态页
                    $('.content').removeClass('hide');  // 内容列表页
                    if(searchTypeTxt == '资讯' || searchTypeTxt == '警网头条') {
                        $('.content').css('position', 'absolute');
                    }
                    // 获取区域id、区域别名
                    croods.customPlugin({
                        action: 'UserPlugin.getUser',  // 用户信息接口
                        params: {},
                        success: function(res) {
                            TOKEN = res.token ? res.token: '';
                            croods.customPlugin({
                                action: 'UserPlugin.getData',  // 区域信息接口
                                params: {},
                                success: function(data) {
                                    AID = data.areaId ? data.areaId : '';

                                    requestEvent.getDevice();  // 获取设备id

                                    // 根据分类请求数据
                                    eventHandle.judgeTypeRequest();
                                },
                                fail: function() {
                                }
                            });
                        }
                    });
                });
            },
            //图片预览
            imgPreviewClick: function(e) {
                var $this = $(e.currentTarget),
                    imgArr = $this.parent().data().imgarr,
                    parIndex = $this.parent().data().index,  // 当前列表中列表项的位置
                    childIndex =  $this.data().index +1;  // 当前列表项中图片的位置
                if(platForm) {
                    imgArr = JSON.stringify(imgArr);
                    var REQUEST = common.packData({
                        "url": imgArr,
                        "position": childIndex,
                        "deleteFlag": "false"
                    }, "", "1", false, "");
                    croods.customPlugin({
                        action: 'CustomImagePlugin.BigImage',
                        params: REQUEST,
                        success: function(res) {}
                    });
                }else {
                    $('#imgList' + parIndex).FlyZommImg();// 图片预览插件
                }
                e.stopPropagation();  // 阻止事件冒泡
            },
            // 图片保存点击事件
            imgSaveClick: function(e) {
                var $this = $(this),
                    downLoadUrl = $this.parents().find('.mui-preview-footer').siblings().find('.mui-active').find('img').attr('src');

                var REQUEST = common.packData({
                    "downLoadUrl": downLoadUrl,
                 }, "", "1", false, "");
                croods.customPlugin({
                    action: 'CustomImagePlugin.downloadImage',
                    params: REQUEST,
                    success: function(res) {
                        alert('保存成功！');
                    }
                });
                $('input').blur();
                e.stopPropagation();  // 阻止冒泡
            },
            // 视频点击事件
            vedioPlayClick: function(e) {
                var $this = $(e.currentTarget),
                    detailId = $this.data().detailid,
                    name = $this.data().name,
                    poster = $this.data().poster;
                var url = 'video-paly.html?id=' + detailId + '&title=' + name + '&poster=' + poster;
                    eventHandle.originalReturn(url);
                    e.stopPropagation();
                e.stopPropagation();
            },
            // 警微热点详情页跳转
            returnBlogDel: function() {
                eventHandle.saveHistoryData();//存历史记录
                var id = $(this).data('id'),
                wbname = $(this).data().wbname,
                weburl = $(this).data().weburl,
                type =  $(this).data().type,
                url =  'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl;
                eventHandle.originalReturn(url);
            },
            // 点击全文跳转到 警微热点详情
            returnBlogDelFull: function(e) {
                eventHandle.saveHistoryData();//存历史记录
                var $this = $(this),
                    index = $this.data().index,
                    that = $this.parents().find('.blog-news-item' + index),
                    id = that.data('id'),
                    wbname = that.data().wbname,
                    weburl = that.data().weburl,
                    url =  'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl;
                    $this.addClass('add-opacity');
                    setTimeout(function() {
                        $this.removeClass('add-opacity');
                    }, 100);
                    eventHandle.originalReturn(url, that);
                e.stopPropagation();
            },
            // 本地页面跳转-原生
            originalReturn: function(url) {
                var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=' + url); // 对接口请求数据封装
                $(this).addClass('visited');
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: request,
                    success: function(res) {}
                });
            },
            // 原生地址跳转 第三方
            originThirdSerReUrl: function(returnUrl) {
                var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@html@Third@url=" + returnUrl);
                croods.customPlugin({
                    action: 'CIPRoutePlugin.action',
                    params: REQUEST,
                    success: function(res) {}
                });

            },

            // 分享点击事件
            shareClick: function(e) {
                var self = $(e.currentTarget),
                    id = self.data().id,
                    wbName = self.data().wbname,
                    weburl = self.data().weburl,
                    index = self.data().index;
                    shareId = id;
                CONFIG.appName = wbName;
                CONFIG.shareFile = CONFIG.BlogDetail + '?id=' + id;
                // if(OS == 'IOS') {
                CONFIG.shareFile = encodeURI(CONFIG.shareFile);
                // }
                OBJ = {
                    shareType: croods.shareType.WebPage,
                    shareText: $('.article-sec .content-text' + index).text().replace(/(^\s*)|(\s*$)/g, "").substr(0, 30),  // 去除资讯内容的空格
                    url: CONFIG.shareFile,  // 警微热点id
                    title: wbName,
                    site:  wbName,
                    titleUrl: CONFIG.BlogDetail + '?id=' + id+ '&wbname=' + wbName + '&weburl=' + weburl,  // 警微热点id
                    siteUrl: CONFIG.BlogDetail + '?id=' + id+ '&wbname=' + wbName + '&weburl=' + weburl,  // 警微热点id
                    imageUrl: weburl ? weburl : CONFIG.shareImg
                };

                croods.getNetworkType({
                    success: function(res) { //请求成功回调
                        if (res.network == 'none') {
                            common.toast('网络无法连接，请检查您的网络');
                        } else {
                            if (shareListFlag) {
                                vm.set('OP', options);
                                shareListFlag = false;
                            }
                            
                            eventHandle.callShare(this, self, e);
                        }
                    }
                });
                e.stopPropagation();
            },
            // 绑定物理返回键
            bindbutton: function() {
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
            },
            /**
             * 分享模块点击
             */
            callShare: function(that, self) {
                that.shareDom = document.getElementsByClassName('share')[0];
                that.share = that.shareDom.handler;
                $('.shareset').removeClass('hide');
                that.share.show();
                that.share.shareFun(OBJ, function() {
                    common.toast('分享成功');
                });
                requestEvent.requestShareCount(self);
            },
            // 收藏点击事件
            collectClick: function(e) { //用户需要登录  点赞和分享不需要用户登录
                var self = $(e.currentTarget),
                    collectFlag = self.attr('data-collect'),
                    id = self.data().id,
                    request = common.packData({}, '', '1', '', ''),
                    code;
                    if (collectFlag == 'false') { //未收藏
                        code = '5f22f7a03b89447eba15ad12849bbc79';
                    } else { //已收藏
                        code = 'ebf9c5e93faa499d9daf914f5c80bf3d'; 
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') {
                                common.toast('网络无法连接，请检查您的网络');
                            } else {
                                croods.customPlugin({
                                    action: 'UserPlugin.isLogin',
                                    params: request,
                                    success: function(res) {
                                        TOKEN = res.token ?  res.token : '';
                                        croods.ajax({
                                            method: code,
                                            params: {
                                                token: TOKEN,
                                                resIds: id, // 警微热点id  收藏id
                                                resId: id  // 取消收藏id
                                            },
                                            //请求参数
                                            success: function(res) { //请求成功回调
                                                if (common.checkToken(res, function(newToken) {
                                                   TOKEN = newToken;
                                                   eventHandle.collectClick(e);
                                                   collectIndex++;
                                                }, collectIndex)) {
                                                    res = $.parseJSON(res);
                                                    if (res.flag) {
                                                        if (collectFlag == 'false') {
                                                            collectFlag = 'true';
                                                            self.attr('data-collect', 'true');
                                                            self.find('.num').html(res.data);
                                                            self.find('.icon').addClass('collected');
                                                            self.find('.icon').removeClass('uncollected');
                                                            common.toast('已添加到我的收藏');
                                                        } else {
                                                            collectFlag = 'false';
                                                            self.attr('data-collect', 'false');
                                                            self.find('.num').html(res.data);
                                                            self.find('.icon').addClass('uncollected');
                                                            self.find('.icon').removeClass('collected');
                                                            common.toast('取消收藏');
                                                        }
                                                    } else {
                                                        if (collectFlag == 'true') {
                                                            common.toast('收藏失败');
                                                        } else {
                                                            common.toast('取消收藏失败');
                                                        }
                                                    }
                                                }
                                            },
                                            fail: function(res) { //请求失败回调
                                                if (collectFlag == 'true') {
                                                    common.toast('收藏失败');
                                                } else {
                                                    common.toast('取消收藏失败');
                                                }
                                            },
                                            complete: function(res) {
                                                if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                                    common.toast('网络无法连接，请检查您的网络');
                                                }
                                            }
                                        });      
                                    }
                                });
                            }
                        }
                    });
                e.stopPropagation();
            },
            // 点赞点击事件
            praiseClick: function(e) {
                var self = $(e.currentTarget),
                    id = self.data().id,
                    index = self.data().index,
                    dom = self.parents().find('.blog-news-item' + index),
                    priseFlag = self.attr('data-prise');
                if (platForm) {
                    var obj = {
                        objId: id, // 警微热点ID
                        deviceId: DEVICE, // 设备ID
                        token: TOKEN, // 用户登录的TOKEN
                        osType: OS // 终端类型IOS Android
                    },
                    code;

                    if (priseFlag == 'false') { //未点赞
                        eventHandle.praiseAnimate(dom, index);
                        code = '3140ce2df226465ca46260b7b6a4431d';
                    } else { //已点赞
                        code = '93f0150736934e958f51b19e929ee46c';
                    }
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.ajax({
                                    method: code,
                                    params: obj,
                                    //请求参数
                                    success: function(res) { //请求成功回调
                                        if (common.checkToken(res, function(newToken) {
                                            TOKEN = newToken;
                                            eventHandle.praiseClick(e);
                                            praiseIndex++;
                                        }, praiseIndex)) {
                                            res = $.parseJSON(res);
                                            if (res.flag) {
                                                var data = res.data;
                                                if (priseFlag == 'false') {
                                                    if (data != 0) {
                                                        priseFlag = 'true';
                                                        self.attr('data-prise', 'true');
                                                        self.find('.num').html(data);
                                                        self.find('.icon').addClass('praised');
                                                        self.find('.icon').removeClass('unpraised');
                                                    } else {
                                                        common.toast('点赞失败！');
                                                    }
                                                } else {
                                                    if (data != -1) {
                                                        priseFlag = 'false';
                                                        self.attr('data-prise', 'false');
                                                        self.find('.num').html(data);
                                                        self.find('.icon').addClass('unpraised');
                                                        self.find('.icon').removeClass('praised');
                                                    } else {
                                                        common.toast('取消点赞失败！');
                                                    }
                                                }
                                            } else {
                                                if (priseFlag == 'true') {
                                                   common.toast('取消点赞失败！');
                                                } else {
                                                   common.toast('点赞失败！');
                                                }
                                            }
                                        }
                                    },
                                    fail: function(res) { //请求失败回调
                                       if (priseFlag == 'true') {
                                           common.toast('取消点赞失败！');
                                        } else {
                                           common.toast('点赞失败！');
                                        }
                                    },
                                    complete: function(res) {
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                            common.toast('网络无法连接，请检查您的网络');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                e.stopPropagation();
            },
            // 点赞动画加载
            praiseAnimate: function(dom, index) {
                croods.getNetworkType({
                    success: function(res) { //请求成功回调
                        if (res.network != 'none') { 
                            common.maskPraise(true, dom, index);
                            setTimeout(function(){
                                common.maskPraise(false, dom, index);
                            }, 1000);
                        } 
                    }
                });
            } 
        };

        $(function(){
            fly.template.config('escape',false);// 是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
            // 搜索初始值为空
            currValueArr[0] = '';
            currValueArr[1] = '';
            addEvent();
            $('.search-input input').val(searchKey);
            eventHandle.hideShowlabel();
            eventHandle.inputSearValue();
            eventHandle.getUserInfo();

            window.onload = function() {
                var oInp = document.getElementById("searchInput");
                if(oInp.autofocus != true){
                    setTimeout(function() {
                         oInp.focus();
                    },500);
                }
            };
        }); 
    });
