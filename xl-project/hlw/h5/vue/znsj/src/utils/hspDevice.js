//模块加载器
window.hspDeviceList = {};
var loadModule = function(dom) {
    var cache = {},
        /*缓存加载过的js*/
        funct;
    /**
     * HTML动态加载js
     * @path {String}
     * @callback {Function} 加载成功的回掉函数
     * */
    funct = function(path, callback) {
        if (!path) { /*检查路径是否为空*/
            throw new Error("请输入path路径!");
        };
        var fn = Object.prototype.toString.call(callback) == "[object Function]" ? callback : function() {};
        if (".js" == path.substring(path.length - 3)) { /*检查路径后缀名是否为.js*/
            addJs(path, fn);
        } else {
            throw new Error('请输入正确的path路径!');
        }
    };
    /**
     * HTML动态加载js
     * @path {String} 
     * @callback {Function} 加载成功的回掉函数
     * */
    function addJs(path, callback) {
        if (!checkcache(path)) { /*检查是否加载过*/
            var head = dom.getElementsByTagName('head')[0];
            var script = dom.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script); /*添加到HTML中*/
            script.onload = script.onreadystatechange = function() { /*判断是否加载成功*/
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    script.onload = script.onreadystatechange = null;
                    callback();
                }
            };
            cache[path] = 1; /*存储加载过的js路径,值设为1*/
        }
    };
    /**
     * 检查是否加载
     * @path {String} 路径
     * */
    function checkcache(path) {
        if (cache[path]) {
            /*判断是否加载过的js路径*/
            return true;
        } else {
            return false;
        }
    };
    return funct;
};

var hspDevice = loadModule(document);

export default hspDevice;