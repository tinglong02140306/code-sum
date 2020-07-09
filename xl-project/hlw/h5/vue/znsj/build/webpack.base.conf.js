"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
var webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
const pathMap = {
  vue$: "vue/dist/vue.esm.js",
  "@": resolve("src"),
  static: resolve("static")
};
//获取入口文件数组，添加一个入口文件
const entryPath = utils.entry();
module.exports = {
  context: path.resolve(__dirname, "../"),
  //修改入口文件，解决ie11下页面空白的问题
  entry: entryPath,
  output: {
    path: config.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
    chunkFilename: utils.assetsPath("js/[name].[chunkhash].js")
  },
  resolve: {
    extensions: [
      ".js",
      ".css",
      ".scss",
      ".tpl",
      ".png",
      ".jpg",
      ".html",
      ".vue"
    ],
    modules: ["./src", "./src/components", "./src/views", "./node_modules"],
    alias: pathMap
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
  // plugins: [
  //   // 配置引入jquery
  //   new webpack.ProvidePlugin({
  //     $: "jquery",
  //     jQuery: "jquery",
  //     jquery: "jquery",
  //     "window.jQuery": "jquery"
  //   })
  // ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          name: utils.assetsPath("images/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [resolve("src"), resolve("test")]
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?jQuery!expose-loader?$'
      }
    ]
  }
};
