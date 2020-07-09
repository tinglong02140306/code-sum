/**
 * @author tinglong
 * @time 2018-03-29
 * @description 警网头条 tab页
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'remCacul',
        'share',
        'common'
    ],
    function(remCacul, share, common) {

        var TOKEN = "", // 用户token
            DEVICE = "", // 设备号
            AID = "", // 区域ID
            ACODE = "", // 区域code
            ANAME = "", // 区域name
            OS = common.phoneOs(), // 终端类型
            NEWSIMG = common.getListImgSize(111, 0.75),
            platForm = common.checkMobilePlatform(),
            INDEX = 1,
            praiseIndex = 1,
            collectIndex = 1,
            requestNewsIndex = 1,
            swiper, // swiper 对象
            currIndex = 0, // 头条类型 tab index值 0 推荐 1 本地 2警微热点
            localCity, // 当前城市名 单位为地级市
            mescrollArr = new Array(3), // 3个菜单所对应的3个mescroll对象
            cpageArr = new Array(3), // 3个菜单所对应的当前页
            shareListFlag = true, // 标记是否渲染分享列表
            shareId = '',
            newsPageSize = 6, // 警网头条每次加载的条数
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
            vm = window.vm = fly.observable({
                // 搜索
                searchEvent: function() {
                    var url = JSON.stringify({
                            'isAddHeader': '0',
                            'serviceAddr': 'police-search-type.html?searchTypeTxt=警网头条&aid=' + AID,
                            'serviceName': ''
                        }),
                        REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@local@Third@url=" + url);
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: REQUEST,
                        success: function(res) {}
                    });
                },
                // 返回
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
                // 分享平台类型
                OP: [],
            }),

            renderEvent = {

                /**
                 * 渲染网警头条
                 * @param {[int]} [CPAGE] [当前页]
                 * @param {[object]} [data] [列表数据]
                 */
                renderNews: function(data) {
                    var res = data.rows;
                    if (!$.isEmptyObject(res)) {
                        if (currIndex == 0 || currIndex == 1) {
                            for (var i = 0, len = res.length; i < len; i++) {
                                var obj = res[i],
                                    imgUrl1 = obj.imgUrl1, // 资讯图片1
                                    imgUrl2 = obj.imgUrl2, // 资讯图片2
                                    imgUrl3 = obj.imgUrl3; // 资讯图片3
                                if (obj.clickCount) {
                                    if (obj.clickCount > 9999) {
                                        obj.clickCount = '9999+';
                                    }
                                } else {
                                    obj.clickCount = 0;
                                }
                                obj.releaseDate = common.getTimeRange(obj.releaseDate);
                                if (imgUrl1 && imgUrl2 && imgUrl3) {
                                    obj.tag = 3;
                                    obj.imgUrl1 = imgUrl1 + common.getListImgSize(4.8 * 2, 0.75);
                                    obj.imgUrl2 = imgUrl2 + common.getListImgSize(4.8 * 2, 0.75);
                                    obj.imgUrl3 = imgUrl3 + common.getListImgSize(4.8 * 2, 0.75);
                                } else if (imgUrl1 || imgUrl2 || imgUrl3) {
                                    obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + common.getListImgSize(4.7 * 2, 0.75);
                                    obj.tag = 1;
                                } else {
                                    obj.tag = 0;
                                }
                            }
                        } else if (currIndex == 2) {
                            for (var i = 0, len = res.length; i < len; i++) {
                                if(cpageArr[currIndex] == 1) {

                                }
                                res[i].multiple = i + (cpageArr[currIndex] -1) * newsPageSize;  // 列表项中的index值

                                // 点赞 收藏 状态处理 标志位转string类型
                                res[i].collection = typeof res[i].collection != 'string' ? (res[i].collection).toString() : res[i].collection;
                                res[i].prise = typeof res[i].prise != 'string' ? (res[i].prise).toString() : res[i].prise;

                                // 数据格式处理
                                res[i].shareCount = res[i].shareCount > 9999 ? '9999+' : res[i].shareCount;
                                res[i].collectionCount = res[i].collectionCount > 9999 ? '9999+' : res[i].collectionCount;
                                res[i].priseCount = res[i].priseCount > 9999 ? '9999+' : res[i].priseCount;
                            
                                // 带标签的文章内容处理
                                var resultArr = common.getContent(res[i].content, 140);
                                res[i].content = resultArr[0];
                                res[i].notFull = resultArr[1];
                               

                                // 图片预览
                                if (res[i].appendixType == 1) {
                                    var imgList = [];
                                    for (var j = 0; j < res[i].appendixList.length; j++) {
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

                                    

                                } else if (res[i].appendixType == 2) { // 视频播放
                                    res[i].appendixAddress = CONFIG.viewPath + res[i].appendixAddress;
                                }
                            }
                        }
                        if (cpageArr[currIndex] == 1) {
                            $('#dataList' + currIndex).empty();
                        }

                        // 数据模板渲染
                        var tmpl,
                            wrapperSel;
                        if(currIndex == 0 || currIndex == 1) {
                            tmpl = fly.template('notifyTmpl', res);
                        }else if (currIndex == 2) {
                            tmpl = fly.template('blogTmpl', res);
                        }
                        wrapperSel = '#wrapper' + currIndex;
                        $('#dataList' + currIndex).append(tmpl);
                        

                        if(currIndex == 2) {
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

                        // 图片error处理
                        $('img').off('error').on('error', function() { // 图片error处理
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
                /**
                 * 加载当前滚动条
                 */
                renderScroll: function(mescrollId) {
                    var mescroll = window.mescroll = new MeScroll(mescrollId, {
                        down: {
                            onMoving: function(mescroll, rate, downHight) {
                                var height = $('.downwarp-content').innerHeight();
                                $('.downwarp-progress').css('opacity', downHight / (height / 2));
                            }
                        },
                        up: { // 上拉配置
                            noMoreSize: 15,
                            htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                            callback: function(page, mescroll) {
                                cpageArr[currIndex] = page.num;

                                // 判断网络状态、请求数据
                                eventHandle.judegeNetState(currIndex);
                            },
                            page: {
                                size: 6
                            }
                        }
                    });
                    return mescroll;
                }
            },
            eventHandle = {

                // 判断网络情况
                judegeNetState: function(currIndex) {
                    common.noNet($('.wrap'), function() { // 展示无网络图片
                        mescroll.endErr();
                        // $('.no-line').removeClass('hide');
                        $('.no-net').removeClass('hide'); // 无网络状态页
                        $('.content').addClass('hide'); // 内容列表页
                        $('.content').css('position', 'static');
                        common.toast('网络无法连接，请检查您的网络');
                    }, function() {
                        // $('.no-line').addClass('hide');
                        $('.no-net').addClass('hide'); // 无网络状态页
                        $('.content').removeClass('hide');
                        $('.content').css('position', 'absolute');
                        requestEvent.requestNewData(currIndex);
                    });
                },
                // 获取用户信息 和区域信息
                getUserInfo: function() {
                    common.noNet($('.wrap'), function() {
                        common.toast('网络无法连接，请检查您的网络');
                        $('.no-net').removeClass('hide'); // 无网络状态页
                        $('.content').addClass('hide'); // 内容列表页
                        $('.content').css('position', 'static');
                    }, function() {
                        $('.no-net').addClass('hide'); // 无网络状态页
                        $('.content').removeClass('hide');
                        $('.content').css('position', 'absolute');
                        // 获取区域id、区域别名
                        croods.customPlugin({
                            action: 'UserPlugin.getUser', // 用户信息接口
                            params: {},
                            success: function(res) {
                                TOKEN = res.token ? res.token : '';
                                croods.customPlugin({
                                    action: 'UserPlugin.getData', // 区域信息接口
                                    params: {},
                                    success: function(data) {
                                        AID = data.areaId ? data.areaId : '';
                                        ANAME = data.areaName ? data.areaName : '';
                                        ACODE = data.areaCode ? data.areaCode : ''; // 安徽的areaCode "340000000000"
                                        eventHandle.getDevice(); // 获取设备id
                                        // 判断是否启动定位 首页用户选择的是安徽则启动定位、否则不启动定位
                                        if (ACODE == '340000000000') {
                                            eventHandle.bindLocationEventBaidu(); // 使用croods精确定位
                                        } else {
                                            localCity = data.areaName;
                                            eventHandle.initSwiper(); // 初始化轮播组件
                                            setTimeout(function() {
                                                //初始化首页
                                                mescrollArr[0] = renderEvent.renderScroll("wrapper0");
                                            }, 400);
                                        }
                                    },
                                    fail: function() {}
                                });
                            }
                        });
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
                // 初始化轮播组件
                initSwiper: function() {
                    swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        paginationBulletRender: function(index, className) {
                            var name = '';
                            switch (index) {
                                case 0:
                                    name = '推荐';
                                    break;
                                case 1:
                                    name = localCity;
                                    break;
                                case 2:
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
                            eventHandle.getTabData();
                        }
                    });
                },
                // 根据type类型 请求不同接口数据
                getTabData: function() { // 头条类型 0 推荐 1 本地 2警微热点
                    currIndex = $('.swiper-slide-active').data().index; // 头条类型 index值 0 推荐 1 本地 2警微热点
                    //取出菜单所对应的mescroll对象,如果未初始化则初始化
                    if (mescrollArr[currIndex] == null) {
                        mescrollArr[currIndex] = renderEvent.renderScroll("wrapper" + currIndex);
                    }
                },
                // 使用croods 进行精确定位
                bindLocationEventBaidu: function() {
                    common.getOpenLocation({
                        getOpenLocationSuccess: function(lng, lat) {
                            try {
                                var gpsPoint = new BMap.Point(lng, lat);
                                BMap.GPSConvertor.translate(gpsPoint, 0, function(point) { // 将GSP定位转换成百度地图的经度纬度
                                    eventHandle.getLocation(point); // 逆地址解析
                                });
                            } catch (err) {
                                eventHandle.getLocationFailSituation();
                            }
                        },
                        getLocationFail: function() {
                            eventHandle.getLocationFailSituation();
                        },
                        getLocModeFail: function() {
                            eventHandle.getLocationFailSituation();
                        },
                        openGpsSettingFail: function() {
                            eventHandle.getLocationFailSituation();
                        },
                        getOpenLocation: function() {
                            common.getOpenLocation({
                                getOpenLocationSuccess: function(lng, lat) {
                                    try {
                                        var gpsPoint = new BMap.Point(lng, lat);
                                        BMap.GPSConvertor.translate(gpsPoint, 0, function(point) { // 将GSP定位转换成百度地图的经度纬度
                                            eventHandle.getLocation(point); // 逆地址解析
                                        });
                                    } catch (err) {
                                        eventHandle.getLocationFailSituation();
                                    }
                                },
                                getLocationFail: function() {
                                    eventHandle.getLocationFailSituation();
                                },
                                getLocModeFail: function() {
                                    eventHandle.getLocationFailSituation();
                                },
                                openGpsSettingFail: function() {
                                    eventHandle.getLocationFailSituation();
                                },
                                getOpenLocation: function() {
                                    eventHandle.getLocationFailSituation();
                                }
                            });
                        }
                    });
                },
                // 逆地址解析
                getLocation: function(point) {
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(point, function(rs) {
                        var addComp = rs.addressComponents;
                        localCity = addComp.city; // 当前定位的城市
                        if (ANAME == addComp.province) { // aname为安徽省的情况
                            localCity = localCity.substring(0, localCity.length - 1);
                        } else {
                            localCity = '合肥';
                        }

                        eventHandle.initSwiper(); // 初始化轮播组件
                        setTimeout(function() {
                            //初始化首页
                            mescrollArr[0] = renderEvent.renderScroll("wrapper0");
                        }, 400);
                    });
                },
                // 定位失败的情况  默认定位到合肥
                getLocationFailSituation: function() {
                    AID = '0a79565ad65f4e2ab236b5438e7d7731';
                    localCity = '合肥';
                    eventHandle.initSwiper(); // 初始化轮播组件
                    setTimeout(function() {
                        //初始化首页
                        mescrollArr[0] = renderEvent.renderScroll("wrapper0");
                    }, 400);
                },
                //图片预览
                imgPreviewClick: function(e) {
                    e.stopPropagation(); // 阻止事件冒泡
                },
                // 图片功能点击事件
                /*popBtnClick: function() {
                    $('.btn-content').toggleClass('hide');
                },*/
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
                    // e.stopPropagation();  // 阻止冒泡
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
                    return;
                },
                // 资讯详情点击事件
                newsClick: function() {
                    var id = $(this).data('id'),
                        url = 'news-detail.html?id=' + id;
                    $(this).addClass('visited');
                    eventHandle.originalReturn(url);
                },
                // 警微热点详情页跳转
                returnBlogDel: function() {
                    var id = $(this).data('id'),
                        wbname = $(this).data().wbname,
                        weburl = $(this).data().weburl,
                        type = $(this).data().type,
                        url =  'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl;
                        eventHandle.originalReturn(url);
                },
                // 点击全文跳转到 警微热点详情
                returnBlogDelFull: function(e) {
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
                        },100);
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
                shareClick: function(e) {  // 1 点击按钮分享 2点击图片分享
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
                        shareText: $('.article-sec .content-text' + index).text().replace(/(^\s*)|(\s*$)/g, "").substr(0, 30), // 去除资讯内容的空格
                        url:  CONFIG.shareFile, // 警微热点id
                        title: CONFIG.appName,
                        site: CONFIG.appName,
                        titleUrl:  CONFIG.shareFile, // 警微热点id
                        siteUrl:  CONFIG.shareFile, // 警微热点id
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

                                eventHandle.callShare(this, self);
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
                        code = '5f22f7a03b89447eba15ad12849bbc79';  // resId
                    } else { //已收藏
                        code = 'ebf9c5e93faa499d9daf914f5c80bf3d';  // resIds
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
                        priseFlag = self.attr('data-prise'),
                        index = self.data().index,
                        dom = self.parents().find('.blog-news-item' + index);
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
                                } else {
                                    croods.ajax({
                                        method: code,
                                        params: obj,
                                        //请求参数
                                        success: function(res) { //请求成功回调
                                            // common.maskPraise(false);
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
                                            // common.maskPraise(false);
                                            if (priseFlag == 'true') {
                                                common.toast('取消点赞失败！');
                                            } else {
                                                common.toast('点赞失败！');
                                            }
                                        },
                                        complete: function(res) {
                                            // common.maskPraise(false);
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
            },
            requestEvent = { // 数据请求模块
                /**
                 * 获取资讯数据、警微热点
                 */
                requestNewData: function(index) {
                    var code,
                        param = {};
                    switch (index) {
                        case 0:
                            code = '2fe8839e9ecf47fc9b427875f085b5be';
                            param = {
                                areaId: '',
                                currentPageNo: cpageArr[currIndex],
                                pageSize: newsPageSize
                            };
                            break;
                        case 1:
                            param = {
                                areaId: localCity,
                                currentPageNo: cpageArr[currIndex],
                                pageSize: newsPageSize
                            };
                            code = '2fe8839e9ecf47fc9b427875f085b5be';
                            break;
                        case 2:
                            code = 'ba9c4e2493b245f5b8ea9037691f3167';
                            param = {
                                deviceId: DEVICE, // 设备ID
                                token: TOKEN, // 用户登录的TOKEN
                                currentPageNo: cpageArr[currIndex],
                                pageSize: newsPageSize
                            };
                            break;
                        default:
                            break;
                    }
                    common.mask(false);
                    croods.ajax({
                        method: code, // 2fe8839e9ecf47fc9b427875f085b5be  原来的：b59d7aa875264769a5e9b4efe3080b9e
                        params: param,
                        //请求参数
                        success: function(res) { //请求成功回调
                        if (common.checkToken(res, function(newToken) {
                                TOKEN = newToken;
                                requestEvent.requestNewData();
                                requestNewsIndex++;
                            }, requestNewsIndex)) {

                            if(currIndex == index) { // 解决数据请求异步 滑动tab页过快问题
                                res = JSON.parse(res);
                                var data = res.data;
                                if (data && data.rows && data.rows.length) {
                                    for (var i = 0; i < data.rows.length; i++) {
                                        var content = data.rows[i].content;
                                        if (content) {
                                            data.rows[i].content = content.replace(/(^\s*)|(\s*$)/g, "");
                                        }
                                    }
                                    $('#wrapper' + currIndex).removeClass('hide');
                                    $('.empty' + currIndex).addClass('hide');
                                    mescrollArr[currIndex].endByPage(data.rows.length, data.totalPageCount);
                                    // mescroll.endByPage(data.rows.length, data.totalPageCount);
                                    renderEvent.renderNews(data);
                                } else {
                                    mescrollArr[currIndex].endSuccess();
                                    // mescroll.endSuccess();
                                    $('#wrapper' + currIndex).addClass('hide');
                                    $('.empty' + currIndex).removeClass('hide');
                                }
                            } 
                        }
                            
                        },
                        fail: function(res) { //请求失败回调
                            mescrollArr[currIndex].endErr();
                            common.toast('数据请求失败！');
                        },
                        complete: function(res) {
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message);
                            }
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
            },
            addEvent = function() {
                var $this = $('.wrap');
                // 资讯点击跳转详情
                $this.off('.home-news ul li').on('click', '.home-news ul li', eventHandle.newsClick);

                // 警微热点点击 跳转详情
                $this.off('.blog-news-item').on('click', '.blog-news-item', eventHandle.returnBlogDel);

                // 警微热点点击 跳转详情
                $this.off('.full-text').on('click', '.full-text', eventHandle.returnBlogDelFull);

                // 分享按钮点击事件
                $this.off('.btn-wrap .btn-share').on('click', '.btn-wrap .btn-share', eventHandle.shareClick);

                // 收藏按钮点击事件
                $this.off('.btn-wrap .btn-collect').on('click', '.btn-wrap .btn-collect', eventHandle.collectClick);

                // 点赞按钮点击事件
                $this.off('.btn-wrap .btn-praise').on('click', '.btn-wrap .btn-praise', eventHandle.praiseClick);

                // 图片预览点击事件
                $this.off('.blog-img-list .img-item').on('click', '.blog-img-list .img-item', eventHandle.imgPreviewClick);

                // 视频点击事件
                $this.off('.vedio-unit').on('click', '.vedio-unit', eventHandle.vedioPlayClick);

                // 图片保存点击事件
               $(document).off('.save-logo').on('click', '.save-logo', eventHandle.imgSaveClick);
                // $(document).on('click', '.save-logo', eventHandle.imgSaveClick);
            };

        $(function() {
            fly.bind(document.body, vm);
            fly.template.config('escape', false);  // xxs是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
            common.mask(true); // 加遮罩
            addEvent();
            eventHandle.bindbutton();
            eventHandle.getUserInfo();

        });
    });