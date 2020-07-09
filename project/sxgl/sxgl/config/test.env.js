'use strict'

var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    PROJECT_BUILD_ENV: `"${process.env.PROJECT_BUILD_ENV}"`
})
