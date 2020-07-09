/**
 * @author hmxue
 * @time 2017-11-09
 * @description 我的收藏
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'share'
    ],
    function(common, share) {
        var main = {},
            TOKEN = '',
            platForm = common.checkMobilePlatform(),
            OS = common.phoneOs(), // 终端类型
            mescroll,
            INDEX = 1,
            deleteDataList = [], // 需要删除我的收藏的数据
            DEVICE,  // 设备id
            praiseIndex = 1,
            collectIndex = 1,
            swiper, // swiper 对象
            currIndex = 0, // 头条类型 tab index值 0综合 2警微热点
            localCity, // 当前城市名 单位为地级市
            mescrollArr = new Array(2), // 2个菜单所对应的2个mescroll对象
            cpageArr = new Array(2), // 2个菜单所对应的当前页
           /* editArr = new Array(2), // 2个菜单所对应的当前页的编辑状态
            deleteNumArr = new Array(2), // 2个菜单所对应的当前页的删除数*/
            editArr = ['0', '0'], // 默认编辑 0 编辑  1 完成
            deleteNumArr = [0, 0], // 默认删除数为0
            deleteDataListArr = new Array(2),  // 删除列表
            editBlockNoneArr = ['removeClass', 'removeClass'],
            shareListFlag = true, // 标记是否渲染分享列表
            shareId = '',
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
            vm = window.vm = fly({
                /**
                 * 返回事件
                 */
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                },
                /**
                 * 删除事件
                 */
                deleteClickEvent: function() {
                    var collectionItem,
                        ids = '', // 需要删除收藏资讯的ID集合
                        code,
                        param;
                    if (deleteDataListArr[currIndex].length) {
                        ids = deleteDataListArr[currIndex].join(',');
                    }
                    if(currIndex == 0) {
                        collectionItem = $('.collection-item');
                        code = '1c2373452b0c4a888ba2e5aa7b869846';
                        param = {
                            ids: ids, // 收藏的ID集合
                            token: TOKEN
                        };  // resId
                    }else if(currIndex == 1) {
                        collectionItem = $('.blog-news-item');
                        code = 'ebf9c5e93faa499d9daf914f5c80bf3d';  // 取消收藏接口
                        param = {
                            resIds: ids, // 收藏的ID集合
                            token: TOKEN
                        };
                    }

                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                croods.ajax({
                                    method: code,
                                    params: param,
                                    success: function(res) {
                                        if (common.checkToken(res)) {
                                            res = $.parseJSON(res);
                                            if (res.flag) {
                                                collectionItem.each(function(i, item) { // 移出已经选中的资讯
                                                    if ($(item).find('.delete-select').length) {
                                                        item.remove();
                                                    }
                                                });
                                                $('.delete-number').text(0); // 已经选择的数量清空
                                                deleteDataListArr[currIndex] = [];
                                                deleteNumArr[currIndex] = 0;

                                                $('.delete-btn-wapper').css('color', '#999'); // 将删除按钮置灰

                                                // deleteDataList = []; // 将需要删除的资讯ID 清空 
                                               

                                                vm.editClickEvent();
                                                $('.mark').hide();
                                                if ((currIndex == 0 && $('.collection-item').length == 0) || (currIndex == 1 && $('.blog-news-item').length == 0)) {
                                                    $('.empty' + currIndex).removeClass('hide');
                                                    $('.dataList' + currIndex).addClass('hide');
                                                    $('.edit').addClass('hide');
                                                    editBlockNoneArr[currIndex] = 'addClass';
                                                    $('#wrapper' + currIndex + ' .mescroll-upwarp').addClass('hide');

                                                }
                                            }
                                        }
                                    },
                                    fail: function(res) {
                                        common.toast('删除失败！')
                                    }
                                });
                            }
                        }
                    });

                },
                cancel: function() {
                    $('.mark').hide();
                },
                /**
                 * 编辑事件
                 */
                editClickEvent: function() {
                    var deleteStatus = $('#wrapper' + currIndex + ' .delete-status');
                        // editFlag = $('.edit').data().editflag;  // 0 编辑 1 完成
                        // text = $('.edit').text(); // 获取当前状态是查看还是删除状态
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                if (editArr[currIndex] == '0') {  // 0 编辑 1 完成
                                    // $('#wrapper').addClass('edit-status');
                                    editArr[currIndex] = '1';
                                    $('.edit').text('完成');
                                    // $('.edit').attr('data-editflag', '1');

                                    renderEvent.deleteStatusLayout(); // 在删除状态下布局样式调整
                                    deleteStatus.removeClass('hide'); // 显示删除状态按钮

                                    if($('#wrapper' + currIndex + ' .mescroll-upwarp').css('display') == 'none') {
                                        $('#wrapper' + currIndex).css('margin-bottom', '2.2rem'); // 下面显示删除2.2rem 高度的DOM
                                    } else {
                                        $('#wrapper' + currIndex + ' .mescroll-upwarp').css('margin-bottom', '2.2rem'); // 下面显示删除2.2rem 高度的DOM
                                    }
                                    $('.delete-btn-wapper').removeClass('hide'); // 显示删除按钮
                                   
                                   /* $('.news-info .time-delete').css('max-width','3rem');*/
                                    // deleteDataListArr[currIndex] = [];
                                    // deleteDataList = [];
                                    // $('.delete-number').text('0');
                                    $('.delete-number').text(0); // 已经选择的数量清空
                                    deleteDataListArr[currIndex] = [];
                                    deleteNumArr[currIndex] = 0;
                                   
                                } else {
                                    // $('#wrapper').removeClass('edit-status');
                                    deleteStatus.removeClass('delete-select'); // 移除用户已经选择却没有进行删除的标志
                                    deleteStatus.addClass('hide'); // 隐藏删除状态按钮
                                    editArr[currIndex] = '0';
                                    $('.edit').text('编辑');

                                    $('.delete-btn-wapper').addClass('hide'); //隐藏删除按钮
                                    $('#wrapper' + currIndex).css('margin-bottom', '0'); // 下面隐藏删除2.2rem 高度的DOM
                                    $('#wrapper' + currIndex + ' .mescroll-upwarp').css('margin-bottom', '0');

                                    $('.delete-number').text(0); // 已经选择的数量清空
                                    deleteDataListArr[currIndex] = [];
                                    deleteNumArr[currIndex] = 0;
                                    // deleteDataList = []; //将需要删除的资讯ID 清空

                                    $('#wrapper' + currIndex + ' .content').css('width', '100%'); // 在不可删除状态 资讯的宽度100%
                                    $('.delete-btn-wapper').css('color', '#999'); //删除按钮置灰

                                    if(currIndex == 0) {
                                        $('.news-info .resource-delete').css('max-width','3.8rem');
                                        $('.news-info .num-delete').css('max-width','3.1rem');
                                    }                                    
                                    /*$('.news-info .time-delete').css('max-width','2.5rem');*/
                                }
                            }
                        }
                    });
                }

            }),
            renderEvent = { // 渲染数据模块
                /**
                 * 是否是删除状态
                 */
                deleteStatusLayout: function() {
                   if($('.edit').text() == '完成') {
                        if($('#wrapper' + currIndex + ' .mescroll-upwarp').css('display') != 'none') {
                            $('#wrapper' + currIndex).css('margin-bottom', '0rem'); // 下面显示删除2.2rem 高度的DOM
                            $('#wrapper' + currIndex + ' .mescroll-upwarp').css('margin-bottom', '2.2rem'); // 下面显示删除2.2rem 高度的DOM
                        }
                        $('#wrapper' + currIndex + ' .content').css('width', '88%');
                        $('#wrapper' + currIndex + ' .delete-status').removeClass('hide');
                        if(currIndex == 0) {
                            $('.news-info .resource-delete').css('max-width','2.5rem');
                            var resourceDelete = $('.resource-delete');
                            resourceDelete.each(function(index,element) { 
                                if($(element).text() == "") {         
                                    $(element).next().css('maxWidth','3.1rem');        
                                }else {
                                    $(element).next().css('maxWidth','2.2rem');
                                }             
                            });
                        }
                        
                    }
                },
                /**
                 * 初始化下拉加载
                 */

                initScroll: function(wrapperId) {
                    var mescroll = new MeScroll(wrapperId, {
                        down: {
                            isLock: true,
                            use: false
                        },
                        up: {
                            callback: function(page, mescroll) {
                                cpageArr[currIndex] = page.num;
                                requestData.getCollectionData();
                            },
                            htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                            noMoreSize: 15,
                            page: {
                                size: 15
                            }
                        }
                    });
                    return mescroll;
                },
                renderData: function(data) {
                    if (!$.isEmptyObject(data)) {
                        var list = data.rows;
                        if (currIndex == 0) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                var obj = list[i],
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
                                if(obj.releaseDate) {
                                    obj.releaseDate = common.getTimeRange(obj.releaseDate);
                                }
                                if (imgUrl1 && imgUrl2 && imgUrl3) {
                                    obj.tag = 3;
                                    obj.imgUrl1 = imgUrl1 + common.getListImgSize(4.8*2, 0.75);
                                    obj.imgUrl2 = imgUrl2 + common.getListImgSize(4.8*2, 0.75);
                                    obj.imgUrl3 = imgUrl3 + common.getListImgSize(4.8*2, 0.75);
                                } else if (imgUrl1 || imgUrl2 || imgUrl3) {
                                    obj.imgUrl1 = (imgUrl1 || imgUrl2 || imgUrl3) + common.getListImgSize(4.7*2, 0.75);
                                    obj.tag = 1;
                                } else {
                                    obj.tag = 0;
                                }
                            }
                        }else if(currIndex == 1){
                            for (var i = 0, len = list.length; i < len; i++) {

                                list[i].multiple = i + (cpageArr[currIndex] -1)*15;  // 列表项中的index值

                                // 标志位转string类型
                                list[i].collection = typeof list[i].collection != 'string' ? (list[i].collection).toString() : list[i].collection;
                                list[i].prise = typeof list[i].prise != 'string' ? (list[i].prise).toString() : list[i].prise;

                                // 数据格式处理
                                list[i].shareCount = list[i].shareCount > 9999 ? '9999+' : list[i].shareCount;
                                list[i].collectionCount = list[i].collectionCount > 9999 ? '9999+' : list[i].collectionCount;
                                list[i].priseCount = list[i].priseCount > 9999 ? '9999+' : list[i].priseCount;

                                // 带标签的文章内容处理
                                var resultArr = common.getContent(list[i].content, 140);
                                list[i].content = resultArr[0];
                                list[i].notFull = resultArr[1];
                            
                                // 图片预览
                                if (list[i].appendixType == 1) {
                                    var imgList = [];
                                    for (var j = 0; j < list[i].appendixList.length; j++) {
                                        if(!!list[i].appendixList[j]) {
                                            var gifFlag = list[i].appendixList[j].indexOf('gif');  // 是否为动图标志位
                                            if(gifFlag <= -1) {
                                                list[i].appendixList[j] = CONFIG.viewPath + list[i].appendixList[j];
                                            }
                                            imgList.push(list[i].appendixList[j]); 
                                        } 
                                    }
                                    imgList = JSON.stringify(imgList);
                                    list[i].appendixList = $.parseJSON(imgList);  // 容错处理
                                    list[i].imgList = imgList;
                                } else if (list[i].appendixType == 2) { // 视频播放
                                    list[i].appendixAddress = CONFIG.viewPath + list[i].appendixAddress;
                                }
                            }
                        }

                        if (cpageArr[currIndex] == 1) {
                            $('#dataList' + currIndex).empty();
                        }
                        /// 数据模板渲染
                        var tmpl,
                            wrapperSel;
                        if(currIndex == 0) {
                            tmpl = fly.template('collectionTmpl', list);
                        }else if (currIndex == 1) {
                            tmpl = fly.template('blogTmpl', list);
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

                        // 图片error处理
                        $('.content .city-news img').off('error').on('error', function() { // 图片error处理
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
                }

            },
            requestData = {
                /**
                 * 获取用户信息
                 */
                getUserId: function() {
                    common.noNet($('.wrap'), function() {
                        common.toast('网络无法连接，请检查您的网络');
                    },function() {
                        croods.customPlugin({
                            action: 'UserPlugin.getUser',
                            params: {},
                            success: function(data) {
                                data.token ? TOKEN = data.token : TOKEN = '';
                                requestData.getDevice();  // 获取deviceId
                                if(data.token) {
                                    TOKEN = data.token;
                                    eventHandle.initSwiper();
                                    setTimeout(function() {
                                        //初始化首页
                                        mescrollArr[0] = renderEvent.initScroll("wrapper0");
                                        mescrollArr[0].triggerUpScroll();
                                    }, 400);
                                }
                            }
                        });
                    });
                },
                /**
                 * 获取收藏列表
                 */
                getCollectionData: function() {
                    var code;
                    switch(currIndex) {
                        case 0:
                            code = '8b83330cfb2d4d0e9e5158b39bcf150b';
                            break;
                        case 1:
                            code = '3e6de6d48d4a4884b830601161c2e7bf';
                            break;
                        default:
                            break;
                    }
             
                    croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { 
                                mescrollArr[currIndex].endErr();
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                if (cpageArr[currIndex] == 1) {
                                    common.mask(true);
                                }
                                croods.ajax({
                                    method: code,
                                    params: {
                                        currentPageNo: cpageArr[currIndex],
                                        pageSize: 15,
                                        token: TOKEN
                                    },
                                    success: function(res) {
                                        if (cpageArr[currIndex] == 1) {
                                                common.mask(false);
                                        }
                                        if (common.checkToken(res, function(newToken) {
                                            requestData.getCollectionData();
                                            INDEX++;
                                        }, INDEX)) {
                                            res = $.parseJSON(res);
                                            var data = res.data;
                                            if (data && data.rows && data.rows.length) {
                                                for(var i = 0; i < data.rows.length; i++) {
                                                    var content = data.rows[i].content;
                                                    if(content) {
                                                        data.rows[i].content = content.replace(/(^\s*)|(\s*$)/g,"");
                                                    }
                                                }
                                                renderEvent.renderData(data);
                                                $('.edit').removeClass('hide');
                                                editBlockNoneArr[currIndex] = 'removeClass';
 
                                                $('#wrapper' + currIndex).removeClass('hide');
                                                $('.empty' + currIndex).addClass('hide');

                                                mescrollArr[currIndex].endByPage(data.rows.length, data.totalPageCount);
                                                renderEvent.deleteStatusLayout(); // 在删除状态下布局样式调整
                                            } else {
                                                mescrollArr[currIndex].endByPage(0,0);
                                                if (cpageArr[currIndex] == 1) { 
                                                    $('#wrapper' + currIndex).addClass('hide');
                                                    $('.empty' + currIndex).removeClass('hide');
                                                    $('.edit').addClass('hide');
                                                 
                                                    editBlockNoneArr[currIndex] = 'addClass';
                                                    $('.collection-wrap').css('backgroundColor','#f5f5f5');
                                                    renderEvent.deleteStatusLayout(); // 在删除状态下布局样式调整
                                                }
                                            }
                                        }
                                    },
                                    fail: function() {
                                        mescrollArr[currIndex].endErr();
                                        if (cpageArr[currIndex] == 1) {
                                            common.mask(false);
                                            $('.empty' + currIndex).removeClass('hide');
                                            $('#wrapper' + currIndex).addClass('hide');
                                            $('.edit').addClass('hide');
                                        
                                            editBlockNoneArr[currIndex] = 'addClass';
                                            $('.collection-wrap').css('backgroundColor','#f5f5f5');
                                            if($('.edit').text() == '完成') {
                                                if($('#wrapper' + currIndex + ' .mescroll-upwarp').css('display') != 'none') {
                                                    $('#wrapper' + currIndex).css('margin-bottom', '0rem'); // 下面显示删除2.2rem 高度的DOM
                                                    $('#wrapper' + currIndex + ' .mescroll-upwarp').css('margin-bottom', '2.2rem'); // 下面显示删除2.2rem 高度的DOM
                                                }
                                            }
                                        }
                                        common.toast('请求数据失败！');
                                    },
                                    complete: function(res) {
                                        if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致
                                            common.toast('网络无法连接，请检查您的网络');
                                            mescrollArr[currIndex].endErr();
                                        }
                                    }
                                }); 
                            }
                        }
                    });              
                },
                /**
                 * 获取设备id
                 */
                getDevice: function() {
                    croods.customPlugin({
                        action: 'UserPlugin.getDevice',
                        params: {},
                        success: function(data) {
                            DEVICE = data.deviceId;
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
            /**
             * 事件处理模块
             */
            eventHandle = {
                /**
                 * 改变删除状态点击事件
                 */
                deleteSatusClickEvent: function($this) {
                    var id = $this.data('id'),
                        deleteNumber = parseInt($('.delete-number').text());
                    if ($this.find('.delete-status').hasClass('delete-select')) { // 判断删除转状态是否选择 选中则取消 未选择则选中
                        $this.find('.delete-status').removeClass('delete-select');
                        deleteDataListArr[currIndex] = deleteDataListArr[currIndex].filter(function(item, index) { // 在选择的资讯列表中移出此次选择的ID
                            return item != id;
                        });
                        deleteNumber = deleteNumber - 1; // 删除资讯数量减一
                    } else {
                        $this.find('.delete-status').addClass('delete-select');
                        deleteDataListArr[currIndex].push(id); // 在选择的资讯列表中添加此次选择的ID
                        deleteNumber = deleteNumber + 1; // 删除资讯数量加一
                    }
                    $('.delete-number').text(deleteNumber);
                    if (deleteDataListArr[currIndex].length) {
                        $('.delete-btn-wapper').css('color', '#ff2727'); // 删除按钮置红
                    } else {
                        $('.delete-btn-wapper').css('color', '#999'); //删除按钮置灰
                    }
                    deleteNumArr[currIndex] = deleteNumber;

                },
                /**
                 * 删除收藏点击事件
                 */
                deleteClickEvent: function() {

                    if (deleteNumArr[currIndex] >= 1) { // 如何需要删除的资讯ID 为空 不进行删除操作
                        $('.delete-number-tip').text(deleteNumArr[currIndex]);
                        $('.mark').show();
                    }
                },
                /**
                 * 资讯点击事件
                 */
                newsClick: function() {
                    var resid = $(this).data('resid'),
                        tabType = $(this).data().tabtype,
                        url;                        
                    if ($('.edit').text() == '完成') { // 编辑状态
                        eventHandle.deleteSatusClickEvent($(this));
                    } else {
                        if(tabType == 'blog') {
                            var id = $(this).data('id'),
                                wbname = $(this).data().wbname,
                                weburl = $(this).data().weburl,
                                url =  'blog-news-detail.html?id=' + id + '&wbname=' + wbname + '&weburl=' + weburl; 
                        }else {
                            url = 'news-detail.html?id=' + resid;
                        }
                        eventHandle.originalReturn(url);
                    }
                },
                // 本地原生页面跳转
                originalReturn: function(url) {
                    var request = common.packData({}, '', '1', false, 'ct://LocalService@app@CommonService@extra_url=' + url); // 对接口请求数据封装
                    $(this).addClass('visited');
                    croods.customPlugin({
                        action: 'CIPRoutePlugin.action',
                        params: request,
                        success: function(res) {}
                    });

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
                        eventHandle.originalReturn(url);
                    e.stopPropagation();
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
                            eventHandle.getTabData();
                        }
                    });
                },
                // 根据type类型 请求不同接口数据
                getTabData: function() { // 头条类型 0综合 1警微热点
                    currIndex = $('.swiper-slide-active').data().index; // 头条类型 index值  0综合 1警微热点
                    var deleteStatus = $('#wrapper' + currIndex + ' .delete-status');

                    $('.edit').attr('data-editflag', editArr[currIndex]);  // 当前tab页的编辑状态
                    if(editArr[currIndex] == '0') {
                        $('.edit').text('编辑');
                        deleteStatus.addClass('hide'); // 显示删除状态按钮
                        $('.delete-btn-wapper').addClass('hide'); 
                    }else if(editArr[currIndex] == '1') {
                        $('.edit').text('完成');
                        deleteStatus.removeClass('hide'); // 显示删除状态按钮
                        $('.delete-btn-wapper').removeClass('hide');
                    }
                    if (deleteNumArr[currIndex] >= 1) {
                        $('.delete-btn-wapper').css('color', '#ff2727'); // 删除按钮置红
                    } else {
                        $('.delete-btn-wapper').css('color', '#999'); //删除按钮置灰
                    }

                    $('.delete-number').text(deleteNumArr[currIndex]);
                    $('.edit')[editBlockNoneArr[currIndex]]('hide');
                    

                    //取出菜单所对应的mescroll对象,如果未初始化则初始化
                    if (mescrollArr[currIndex] == null) {
                        mescrollArr[currIndex] = renderEvent.initScroll("wrapper" + currIndex);
                        mescrollArr[currIndex].triggerUpScroll();
                    }
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
                    requestData.requestShareCount(self);
                },
                // 收藏点击事件
                collectClick: function(e) { //用户需要登录  点赞和分享不需要用户登录
                    var self = $(e.currentTarget),
                        collectFlag = self.attr('data-collect'),
                        id = self.data().id,
                        index = self.data().index,
                        request = common.packData({}, '', '1', '', '');
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
                                            method: 'ebf9c5e93faa499d9daf914f5c80bf3d',
                                            params: {
                                                token: TOKEN,
                                                resIds: id, // 取消收藏id
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
                                                        common.toast('取消收藏');
                                                        $('.blog-news-item' + index).remove();
                                                    } else {
                                                        common.toast('取消收藏失败');
                                                    }
                                                }   
                                            },
                                            fail: function(res) { //请求失败回调
                                                common.toast('取消收藏失败');
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
                },
                //图片预览
                imgPreviewClick: function(e) {
                    e.stopPropagation(); // 阻止事件冒泡
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
                            // alert('保存成功！');
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
                }
            },
            addEvent = function() {
                var $this = $('#wrapper');
                // 删除选中状态改变事件
                $('.delete-btn-wapper').off('.delete-btn').on('click', '.delete-btn', eventHandle.deleteClickEvent);
                // 收藏列表点击
                $this.off('.city-news li, .blog-news-item').on('click', '.city-news li, .blog-news-item', eventHandle.newsClick);

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

            };
        /**
         * 初始化
         */
        main.init = function() {
            addEvent();
            // 获取用户TOKEN
            requestData.getUserId();
        };
        fly.template.config('escape', false);  // 标签转换成文字
        fly.bind(document.body, vm);
        croods.bindButton({
            keycode: ['backbutton'],
            success: function(res) {
                var markDisplay = $('.mark').css('display');
                if(markDisplay == 'none') {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }else {
                    $('.mark').hide(); 
                }
               
            }
        });
        $('.mark').hide();
        main.init();

    });