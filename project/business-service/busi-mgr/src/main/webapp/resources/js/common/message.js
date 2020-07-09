/* 统一提示语信息 */

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {

    var data = {
        "TIP_MUTLSEL":"请选择至少一个专题",
        "TIP_MUTLSEL_MAX":"最多可选择10个专题",
        "ERROR_MAP_500":"地图接口出错",
        "success": "数据请求成功!",
        "error": "数据请求失败！"
    };

    var message = {
        get: function(key) {
            if (!key) {
                return data['DEFAULT'];
            }

            var keys = key.split(','),
                msg = [];
            for (var i = 0, l = keys.length; i < l; i++) {
                if (data[keys[i]]) {
                    msg.push(data[keys[i]]);
                }
            }

            if (msg.length == 0)
                return data['DEFAULT'];

            return msg.join('<br/>');
        }
    };

    window.message = message;
    return message;
}));