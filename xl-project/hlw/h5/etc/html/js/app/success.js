$(function() {
    // 清空本地存储
    util.setLocalInfos(null);
    $('.success-wrap').off('.btn-close').on('click', '.btn-close', function() {
        window.location.href = "about:blank";
        window.close();
    });

})