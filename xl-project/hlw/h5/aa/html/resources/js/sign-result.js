var vConsole;
// 方法处理
var handleEvent = {
        // 返回
        backEvent: function() {
            util.closePage();
            window.localStorage.removeItem('SIGNINFO');
        },
        // 平台 内容显示处理
        dealPlatShow: function() {
            var data = JSON.parse(window.localStorage.getItem('SIGNINFO'));
            if (util.isAlipay()) {
                $('.bg-wrap').addClass('bg-alipay').removeClass('bg-wx');
                $('.alipay-btn-wrap').removeClass('hide');
                $('title').text('高速ETC一站通');
                // 渲染签约信息
                if (!data) return;
                $('.sign-num').text(data.agreement_no);
                $('.valid-date').text(data.valid_date);
                $('.invalid-date').text(data.invalid_date);


            } else if (util.isWeiXin()) {
                $('.bg-wrap').addClass('bg-wx').removeClass('bg-alipay');
                $('.wx-btn-wrap').removeClass('hide');
                $('title').text('高速ETC');
                // 渲染签约信息
                if (!data) return;
                console.log(data)
                $('.sign-num').text(data.agreement_no);
                $('.valid-date').text(data.gmt_valid);
                $('.invalid-date').text(data.gmt_invalid);
            }
        }
    },
    addEvent = function() {
        var $this = $('.wrap');
        // 返回
        $this.off('.btn-wrap span').on('click', '.btn-wrap span', handleEvent.backEvent);
    },
    init = function() {
        // vConsole = new VConsole();
        window.localStorage.setItem('PAGESTATE', 'abnomal');
        addEvent();
        handleEvent.dealPlatShow();
        // 监听 左上角返回键和 物理键 关闭页面
        util.pushHistory();
        window.addEventListener("popstate", util.dealClosePage, false);
    }
$(function() {
    init();
});