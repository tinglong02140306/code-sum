// 去掉所有空格
export const trimAll = str => {
    if (!str) {
        return "";
    }
    return str.toString().replace(/\s/g, "");
};
export const getUrlParam = name => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href
    let search = url.split('?')[1]
    if (search) {
        var r = search.substr(0).match(reg)
        if (r !== null) return unescape(r[2])
        return null
    } else {
        return null
    }
}

function wxpay(params, callback) {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(params, callback), false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady(params, callback));
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(params, callback));
        }
    } else {
        onBridgeReady(params, callback);
    }
}

function onBridgeReady(params, callback) {
    let that = this
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": params.appId,
            "timeStamp": params.timeStamp,
            "nonceStr": params.nonceStr,
            "package": params.package,
            "signType": params.signType,
            "paySign": params.paySign
        },
        function(res) {
            callback(res)
        }
    );
}