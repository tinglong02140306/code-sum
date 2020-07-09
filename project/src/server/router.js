'use strict';

var express = require('express'),
    meta = require('../package.json'),
    router = express.Router(),
    path = '/public/' + meta.name + '/' + meta.version + '/',
    homePath = 'home'; //配置主页访问地址

//主页访问router
router.get('/', function (req, res, next) {
    req.url = path + 'page/' + homePath + '.html';
    next();
});

//模块主页router
router.get('/:path', function (req, res, next) {
    var baseUrl = path + 'page/' + req.params.path;
    req.url = baseUrl + '.html';
    // if(homePath == req.params.path) {
    //     req.url = baseUrl + '.html';
    // } else {
    //     req.url = baseUrl  + '/home.html';
    // }

    // console.log(baseUrl);
    // if(homePath == req.params.path) {
    //     req.url = baseUrl  + '/home.html';
        
    // } else {
    //     req.url = baseUrl + '.html';
    // }
    next();
});

//模块子页访问router
router.get('/:path/:sub', function (req, res, next) {
    req.url = path + 'page/'  + req.params.path + '/' + req.params.sub + '.html';
    next();
});


module.exports = router;