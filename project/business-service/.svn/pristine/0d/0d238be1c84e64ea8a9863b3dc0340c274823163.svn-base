/**
 * @description: 常用工具方法
 */
define([
	'jquery',
	'fly',
	'../common/mask',
	'../common/tip'
], function($, fly, mask, tip) {

	var utils = {};

	/**
	 * [添加遮罩]
	 * @param {[String]} content [显示的内容]
	 */
	utils.mask = function(content) {
		mask.init({
			content: content || '正在加载数据...'
		});
	};
	utils.maskImg = function(content) {
		mask.initImg({
			content: content,
		});
	};
	/**
	 * [删除遮罩]
	 */
	utils.removeMask = function() {
		mask.remove();
	};

	/**
	 * [添加tip]
	 * @param  {[String]} text [提示的内容]
	 * @param  {[String]} cssType [提示的类型]info、success、warning、danger
	 */
	utils.tip = function(content, cssType) {
		fly.top.fly.tip({
			content: content,
			css: cssType
		});
	};

	/**
	 * [对字节的文件大小进行格式化]
	 * @param  {[Number]} text [文件的字节大小]
	 */
	utils.formatSize = function(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024;
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
	};

	/**
	 * 接入0.6的ajaxObj
	 * @returns {{}}
	 */
	utils.ajaxObj = function() {
		var obj = {};

		obj.done = function(callback) {
			if (callback) this._done = callback;
			return this;
		};

		obj.fail = function(callback) {
			if (callback) this._fail = callback;
			return this;
		};

		obj.empty = function(callback) {
			if (callback) this._empty = callback;
			return this;
		};

		obj.options = {
			before: function() {},
			after: function() {}
		};

		return obj;
	};
	/**
	 * 接入0.6的ajax
	 * @returns {{}}
	 */
	utils.ajax = {

		//POST发送数据
		post: function(url, data, type) {
			url = CONTEXTPATH + url;
			type = type || 'json';
			return $.ajax({
				url: url,
				data: data || {},
				dataType: type || 'json',
				type: 'POST'
			});
		},

		//GET请求数据
		get: function(url, data, type) {
			url = CONTEXTPATH + url;
			type = type || 'json';
			return $.ajax({
				url: url,
				cache: false,
				data: data || {},
				dataType: type || 'json',
				type: 'GET'
			});
		}
	};

	window.util = utils;
	return utils;
});