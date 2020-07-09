// 以下新增前两行
const vConsolePlugin = require("vconsole-webpack-plugin"); // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
    lintOnSave: false,
    css: {
        sourceMap: false,
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*']
                    })
                ]
            }
        }
    },
    // 以下新增内容
    filenameHashing: false, // 去掉文件名中的 hash
    // publicPath: process.env.NODE_ENV === "production" ? "/abc" : "/",//vue-cli3.3新版本
    publicPath: process.env.NODE_ENV === "production" ? "./" : "", //vue-cli3.3新版本
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: "",
    //以多页模式构建应用程序。
    pages: undefined,
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    parallel: require("os").cpus().length > 1,
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: false,
    configureWebpack: config => {
        //开发环境
        let pluginsDev = [
            //移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
            new vConsolePlugin({
                filter: [], // 需要过滤的入口文件
                enable: false // 发布代码前记得改回 false
            }),
        ];
        if (process.env.NODE_ENV === "production") { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
            config.entry.app = ["babel-polyfill", "./src/main.js"];
            config.plugins = [...config.plugins];
        } else {
            // 为开发环境修改配置...
            config.plugins = [...config.plugins, ...pluginsDev];
        }
    },
    // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
    devServer: {
        host: "0.0.0.0",
        port: 8080, // 端口号
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器  http://XXX.XXX.X.XX:7071/rest/XXX/
        hotOnly: true, // 热更新
        disableHostCheck: true, //默认不检查hostname
        proxy: {
            "/xlk-shop": {
                // target: "http://cui-shop.test.etcsd.cn",
                target: "http://10.184.34.245:8086", //测试
                changeOrigin: true,
            },
        }
    },
    // 下列代码会将其限制设置为 10kb
    chainWebpack: config => {
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap(options => Object.assign(options, { limit: 10240 }));
    },
}