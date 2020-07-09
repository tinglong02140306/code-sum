/**
 * @author xxcai
 * @time 2018-04-08
 * @description 拍照文件选择插件调用demo
 */
'use strict';
// 拍照或者选中图片后，Android端会调用这个方法回传选择图片路径列表
window.getPicture = function(data) {
    alert(data);
};

// 拍照、选择图片
var takephoto = function() {
    // 插件入参
    var REQUEST = util.packData({
        "url": '',  //已添加图片URL，json字符串
        "size": "3" //最大选择个数
    }, "", "1", false, "");

    // 这个地方调用我们的插件，启动拍照和图片选择界面
    croods.customPlugin({
        // 固定调用
        action: 'CustomImagePlugin.ClickCameraFilm',
        params: REQUEST,
        success: function(res) {}
    });
},
// 查看图片
scan = function() {
    // 插件入参
    var REQUEST = util.packData({
        "url": "", // 图片URL数组
        "position": "0", // 当前图片索引
        "deleteFlag": true // 是否添加删除按钮
    }, "", "1", false, "");

    // 这个地方调用我们的插件，启动拍照和图片选择界面
    croods.customPlugin({
        // 固定调用
        action: 'CustomImagePlugin.BigImage',
        params: REQUEST,
        success: function(res) {}
    });
}; 
(function(){
    takephoto();
})();  


