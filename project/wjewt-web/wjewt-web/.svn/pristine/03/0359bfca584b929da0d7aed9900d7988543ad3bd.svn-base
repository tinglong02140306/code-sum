/**
 * @author hmxue
 * @time 2017-12-26
 * @description 办事指南
 */
'use strict';
$(function() {
    var platForm = util.checkMobilePlatform(),
        url = util.getParam('url'), //id
        errorImgFlag = false, // img是否加载失败
        title = util.getParam('title'),
        platForm = util.checkMobilePlatform(),
        vm = window.vm = fly({
            // 返回事件
            back: function() {
                platForm ? croods.pageClose({}) : window.history.back(-1);
            }

        });
    var eventHandle = {
        // 图片点击缩放事件
        imgClick: function(){
            if(!errorImgFlag) {
                var url,
                    URL = [],
                    result,
                    position,
                    deleteFlag;
                url = $(this).attr('src');
                if(url){
                    URL.push(url);
                }
                result = JSON.stringify(URL);
                position = JSON.stringify(1);
                deleteFlag = "false";
                var REQUEST = util.packData({
                    "url": result,
                    "position": position,
                    "deleteFlag":deleteFlag
                }, "", "1", false, "");
                croods.customPlugin({
                    action: 'CustomImagePlugin.BigImage',
                    params: REQUEST,
                    success: function(res) {}
                });
            }
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
                text = text ? text : elem.innerHTML,
                pre = document.createElement('pre'),
                body = document.body,
                style, width;

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
    }
    fly.bind(document.body, vm);
    var addEvent = function() {
        var $this = $('.wrap');
        $this.off('#wrapper img').on('click','#wrapper img',eventHandle.imgClick);

    }

    $(function() {
        // 第三方流程图渲染
        addEvent();
        $('#wrapper img').attr('src',url);
        $("#wrapper img").off('error').on('error', function() {
            $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
            $(this).css('minWidth','100%');
            errorImgFlag = true;
        });

        var itemBanner = document.getElementById('itemBanner');
        $('#itemBanner').text(title);
        if (itemBanner.offsetWidth < eventHandle.getTextWidth('itemBanner', title)) {
            eventHandle.initMarquee();
        }

    });
});