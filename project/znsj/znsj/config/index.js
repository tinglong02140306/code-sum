"use strict";

var path = require("path");

module.exports = {
    // 是否单页模式
    spaMode: true,
    // 构建输出环境JAVA、NODE
    buildEnv: "NODE",
    // 入口文件
    entry: function() {
        return this.spaMode ? "./src/main.js" : "./src/static/js/**/*.js";
    },
    // html模板文件
    htmlTemplate: function() {
        return this.spaMode ? "index.html" : "./src/views/**/*.html";
    },
    // 视图输出总目录
    viewOutputRoot: function() {
        return this.buildEnv == "JAVA" ?
            "WEB-INF/views/" :
            this.spaMode ?
            "" :
            "views/";
    },
    // 禁用热替换
    disableHMR: process.env.NODE_ENV === "production" ? true : false,
    // 开发配置
    dev: {
        assetsRoot: path.resolve(__dirname, "../dist"),
        // 静态资源文件夹
        assetsSubDirectory: "static",
        // 发布路径
        assetsPublicPath: "/",
        // Various Dev Server settings
        host: "localhost",
        // dev-server监听的端口
        port: 8080,
        autoOpenBrowser: true,
        proxyTable: {
            //综合收件
            '/bog-receive-web/': {
                target: "http://172.31.1.87:8882/znsj", //开发环境
                // target: "http://10.5.4.174:8888/znsj/",
                // 10.5.40.251:8882/znsj-sj-rest/commer/uploadbase64
                changeOrigin: true,
                pathRewrite: {
                    '^/bog-receive-web': ''
                }
            },
            // '/pzgl-qxpz-web/': { //收件配置
            //     target: "http://172.31.1.87:9090/znsj-qx-rest", //开发环境
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/pzgl-qxpz-web': ''
            //     }
            // }
        }
    },
    // 构建配置
    build: {
        // 存放根路径
        assetsRoot: path.resolve(__dirname, "../dist"),
        // 二级目录，存放静态资源文件的目录，位于dist文件夹下
        assetsSubDirectory: "static",
        // 发布路径，设置之后构建的产品文件在注入到index.html中的时候就会带上这里的发布路径
        assetsPublicPath: "./",
        // 是否使用source-map
        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: "#source-map",
        // 是否开启gzip压缩
        productionGzip: false,
        // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩
        productionGzipExtensions: ["js", "css"],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        // 是否展示webpack构建打包之后的分析报告
        bundleAnalyzerReport: process.env.npm_config_report
    }
};