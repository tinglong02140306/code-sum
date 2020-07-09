const path = require("path")
const opn = require('opn')
const express = require('express')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.dev.conf')
const webpackDevMiddleware = require("webpack-dev-middleware")
const proxyMiddleware = require('http-proxy-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware');
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const PORT = config.dev.port,
    HOST = config.dev.host,
    DIST_DIR = path.join(config.dev.assetsRoot, config.viewOutputRoot()),
    app = express(),
    router = express.Router(),
    complier = webpack(merge(baseWebpackConfig, {
        devtool: 'eval-source-map'
    }));

// webpack-dev-server中间件
const devMiddleware = webpackDevMiddleware(complier, {
    publicPath: baseWebpackConfig.output.publicPath,
    quiet: false,
    stats: {
        colors: true,
        chunks: false
    }
});
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  const options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(devMiddleware);
app.use(webpackHotMiddleware(complier));
app.use(router);
app.use('/static', express.static(path.join(config.dev.assetsRoot, 'static')));

// favicon匹配
router.get("/favicon.ico", (req, res, next) => {
    res.end();
})

// 根路由
router.get("/", (req, res, next) => {
    sendFile(path.join(DIST_DIR, '/index.html'), res, next);
})

// 一级路由
router.get("/:view", (req, res, next) => {
    sendFile(path.join(DIST_DIR, req.params.view + '/index.html'), res, next);
})

// mock数据
router.get("/mock/:module", (req, res, next) => {
    sendFile(path.join(DIST_DIR, 'mock/' + req.params.module + '.json'), res, next, true);
})

// 二级路由
router.get("/:module/:view", (req, res, next) => {
    sendFile(path.join(DIST_DIR, req.params.module + '/' + req.params.view + '/index.html'), res, next);
})

const sendFile = (viewname, response, next, isJSON) => {
    complier.outputFileSystem.readFile(viewname, (err, result) => {
        if (err) {
            response.status(404).send('404');
            return;
        }
        response.set('content-type', isJSON ? 'application/json' : 'text/html')
        response.send(result)
        response.end()
    })
}

const uri = `http://${HOST}:${PORT}`

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = PORT

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, PORT) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = PORT
    var uri = `http://${HOST}:${PORT}`
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(PORT)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
