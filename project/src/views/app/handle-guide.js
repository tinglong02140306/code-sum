/**
 * @author tinglong
 * @time 2017-11-24
 * @description 办事指南
 */
'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
        'common',
        'share',
        'remCacul' 
    ],
    function(common, share, remCacul) {
        fly.template.config('escape',false);
        var ID = common.getParam('id'), //id
            title = common.getParam('title'), // 标题名
            flag = true, // 标记是否渲染分享列表
            platForm = common.checkMobilePlatform(),
            OBJ = {
                shareType: croods.shareType.WebPage,
                shareText: "快来加入" + CONFIG.appName+ "吧",
                url: CONFIG.shareFile,
                title: CONFIG.appName,
                site: CONFIG.appName,
                titleUrl: CONFIG.shareFile,
                siteUrl: CONFIG.shareFile,
                imageUrl:CONFIG.shareImg //服务器上的图片
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
                OP: [],
                // 返回事件
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);  // 用android的方法打开 就用android方法关闭
                },
                refreshClick: function() {
                    window.location.reload();
                }

            });
        //渲染数据模块 
        var renderEvent = {  

            
            // 详情数据请求与渲染
            detailRequestRender: function() {
                common.mask(true);
                common.noNet($('.wrap'), function() {
                    $('.search').addClass('hide');
                    common.toast('网络无法连接，请检查您的网络');
                },function() {
                    $('.search').removeClass('hide');
                    croods.ajax({
                        method: '9dbcfd290e044dbfaa2721f74ac5f3b7',
                        params: {
                            uuid: ID
                        },
                        //请求参数
                        success: function(res) { //请求成功回调
                            common.mask(false);
                            res = $.parseJSON(res);
                            var data = res.data,
                                materialLists = [];
                            if (data) {
                                if(data.procedure) {
                                    var result = data.procedure,
                                        results;
                                    results = result.split('-');
                                    data.procedure = results.join('→');
                                    if(data.materialList && data.materialList.length) {
                                        materialLists = [];
                                      
                                        for(var i = 0; i < data.materialList.length; i++) {
                                            var j = i+1,
                                                k = j.toString();
                                            materialLists.push(k + '.'+data.materialList[i]['material'+k]);
                                        }
                                    data.materialLists = materialLists;
                                  
                                    }
                                }
                                $('.empty').addClass('hide');
                                $('.handle-wrap').removeClass('hide');

                                var tmpl = fly.template('handleTmpl',data);
                                $('.handle-wrap').html(tmpl);

                            } else {
                                $('.empty').removeClass('hide');
                                $('.handle-wrap').addClass('hide');
                            }
                        },
                        fail: function(res) { //请求失败回调
                            common.mask(false);
                            common.toast('请求数据失败');
                        },
                        complete: function(res) {
                            common.mask(false);
                            if (res.code === 70002) { // 两种状态码是因为IOS和Android不一致导致 
                                common.toast(res.message); 
                            }
                        }
                    });
                }); 
            }
        };

        var eventHandle = {
            // 跳转到流程图页面
            returnChart: function() {
                var self = $(this),
                    url = self.attr('data-path'),
                    title = self.attr('data-infoname');
                croods.getNetworkType({
                        success: function(res) { //请求成功回调
                            if (res.network == 'none') { // 提示无网络提示语
                                common.toast('网络无法连接，请检查您的网络');
                            }else {
                                window.location.href = CONFIG.path + 'page/flow-chart.html?url=' + url + '&title=' + title;
                            }
                        }
                    });  
            },
            /**
             * 分享事件
             */
            shareClickEvent: function(e) {
                if(flag) {
                        vm.set('OP', options);
                        flag = false;
                    }    
                eventHandle.callShare(this, e);   
            },
            /**
             * 分享模块点击
             */
            callShare: function(that) {
                that.shareDom = document.getElementsByClassName('share')[0];
                that.share = that.shareDom.handler;
                $('.shareset').removeClass('hide');
                that.share.show();
                that.share.shareFun(OBJ);
            },
            initMarquee: function (id) {
	            var marqueeWrap = document.querySelector('div.marquee-wrap'),
	                fragment = document.createDocumentFragment('div'),
	                marqueeContentWrap = document.createElement('div'),
	                marqueeContent = document.createElement('div'),
	                marqueeContentCopy = document.createElement('div'),

	                text = marqueeWrap.innerText,
	                speed = 30,
	                marqueeHandler,
	                marqueeInterval;

	            marqueeContentWrap.className = 'marquee-content-wrap';
	            marqueeContent.className = 'marquee-content';
	            marqueeContent.innerText = text;
	            marqueeContentCopy.className = 'marquee-content-copy';
	            marqueeContentCopy.innerText = text;

	            marqueeContentWrap.appendChild(marqueeContent);
	            marqueeContentWrap.appendChild(marqueeContentCopy);

	            fragment.appendChild(marqueeContentWrap);

	            marqueeWrap.innerHTML = '';
	            marqueeWrap.appendChild(fragment);

	            marqueeContentCopy.innerHTML = marqueeContent.innerHTML;
	            marqueeHandler = function () {
	                if (marqueeContentCopy.offsetWidth - marqueeWrap.scrollLeft <= 0) {
	                    marqueeWrap.scrollLeft -= marqueeContentCopy.offsetWidth;
	                } else {
	                    marqueeWrap.scrollLeft++;
	                }
	            };

	            marqueeInterval = setInterval(marqueeHandler, speed);
	        },

	        getTextWidth: function (id, text) {
	            var elem = id ? document.getElementById(id) : document.body,
	                pre = document.createElement('pre'),
	                body = document.body,
	                style, width;
                text = text ? text : elem.innerHTML;
	            style = window.getComputedStyle(elem, null);
	            pre.innerHTML = text;
	            pre.style.whiteSpace = 'nowrap';
	            pre.style.position = 'absolute';
	            pre.style.zIndex = '-99999';
	            pre.style.font = style.getPropertyValue('font');
	            body.appendChild(pre);
	            width = pre.offsetWidth;
	            body.removeChild(pre);
	            return width;
	        }
        };
        var addEvent = function() { 
            var self = $('.wrap');

            // 跳转到流程图页面
            self.off('.underline').on('click','.underline', eventHandle.returnChart);

            // 分享点击
            self.off('.share-btn').on('click', '.share-btn', eventHandle.shareClickEvent);
        };
      
        fly.bind(document.body, vm);

        $(function() {
            addEvent();
            renderEvent.detailRequestRender();

            var itemBanner = document.getElementById('itemBanner');
            $('#itemBanner').text(title);
            if (itemBanner.offsetWidth < eventHandle.getTextWidth('itemBanner', title)) {
                eventHandle.initMarquee();
            }
            

            // var title = '办事指南办事指南办事指南办事指南办事指南办事指南';
           /* if (title.length && title.length > ) { //处理头部过长  onMouseOut="this.start()" onMouseLeave"this.start()"  onMouseOver="this.stop()"
               $('#liMarquee').html('<marquee>'+title+'</marquee>');
            } else {
               $('#liMarquee').html('<div>'+title+'</div>');
            }*/

        });
      
    });