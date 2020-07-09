/**
 * @author yaoding
 * @time 2017-11-13
 * @description 我的模块交互
 */

'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async([
	'common'
], function(common) {
	var main = {},
		TOKEN = '',
		INDEX = 1;

	main.render = {
		/**
		 * 渲染违章信息
		 */
		renderCarIllegal: function(token) {
			if(token) {
				TOKEN = token;
			}
			croods.ajax({
				method: '4fd135382d5f4a5c85723b2a5db6c0e4',
				params: {
					token: TOKEN
				},
				//请求参数
				success: function(res) { //请求成功回调
					if (common.checkToken(res, function(newToken) {
						main.render.renderCarIllegal(newToken);
					}, INDEX)) {
						res = $.parseJSON(res);
						if(res && res.data && parseInt(res.data)) {
							$('.my-car .num').text(res.data + '条新交通违法');
						} else {
							$('.my-car .num').text('');
						}
					}
				},
				fail: function(res) {

				}
			});
		},
		/**
		 * 刷新用户信息
		 */
		refreshUser: function() {
			main.render.renderUser(function(data) {
				// 渲染违章信息
				main.render.renderCarIllegal(data.token);
			});
		},

		/**
		 * 渲染用户信息
		 * @return {[type]} [description]
		 */
		renderUser: function(callback) {
			croods.customPlugin({
				action: 'UserPlugin.getUser',
				params: {},
				success: function(data) {
					if (data && data.token) {
						// 显示登录状态
						$('.login').removeClass('hide');
						$('.loginout').addClass('hide');
						TOKEN = data.token;
						var name = data.nickname || data.name || data.username || '---', // 用户名
							phone = data.phone,
							rankCode = data.rankCode;
						if(rankCode == 0 || rankCode == '') {
							$('.auth-status span').removeClass('hight');
						} else {
							$('.auth-status span').addClass('hight');
						}
						if(rankCode == '') {
							data.rankName = '未认证';
						}
						$('.auth-status span').text(data.rankName);
						$('.name').text(name);
						if (data.pictureUrl) { 
							$('.login .my-photo').attr('src', data.pictureUrl+ '?' + Date.parse(new Date()));
						}
						if (phone.length > 7) {
							phone = phone.substr(0, 3) + '****' + phone.substr(phone.length - 4, 4);
						}
						$('.phone').text(phone);

						callback && callback(data);

					} else {

						// 显示未登录状态
						$('.login').addClass('hide');
						$('.loginout').removeClass('hide');
					}
				},
				fail: function() {
					$('.login').addClass('hide');
					$('.loginout').removeClass('hide');
				}
			});

		}
	};

	main.handleEvent = {
		/**
		 * 未登录区域点击
		 */
		loginEvent: function() {
			var request = common.packData({}, '', '1', '', 'ct://LocalService@app@Login@');
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: request,
				success: function(res) {}
			});
		},

		/**
		 * 已登录区域点击
		 */
		selfEvent: function() {
			var request = common.packData({}, '', '1', '', 'ct://LocalService@app@MyInfo@'); // 对接口请求数据封装
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: request,
				success: function(res) {}
			});
		},

		/**
		 * 导航点击事件
		 */
		navClickEvent: function(e) {
			var that = $(this),
				type = that.data('type'), // 类型1为本页面跳转，2为APP跳转
				login = that.data('login'), // 是否登录, 1登录，0不登录
				url = that.data('url');
			if (type == 1) {
				url = 'ct://LocalService@app@CommonService@extra_url=' + url;
			}
			if (login == 1) {
				croods.customPlugin({
					action: 'UserPlugin.isLogin',
					params: common.packData({}, '', '1', '', ''),
					success: function(res) {
						var request = common.packData({}, '', '1', false, url); // 对接口请求数据封装
						croods.customPlugin({
							action: 'CIPRoutePlugin.action',
							params: request,
							success: function(res) {}
						});
					}
				});
			} else {
				var request = common.packData({}, '', '1', false, url); // 对接口请求数据封装
				croods.customPlugin({
					action: 'CIPRoutePlugin.action',
					params: request,
					success: function(res) {}
				});
			}
		}
	};

	main.bindEvent = function() {
		// 未登录区域点击
		$('.top-content').off('.loginout').on('click', '.loginout', main.handleEvent.loginEvent);

		// 登录区域点击
		$('.top-content').off('.login').on('click', '.login', main.handleEvent.selfEvent);

		// 导航点击事件
		$('.nav-tab').off('.nav-item').on('click', '.nav-item', main.handleEvent.navClickEvent);
	};

	// 刷新用户数据
	window.userRefresh = function() {
		main.render.renderUser();
	};

	// 刷新车辆
	window.carRefresh = function() {
		if(TOKEN) {
			main.render.renderCarIllegal();
		} else {
			$('.my-car .num').text('');
		}
	};

	$(function() {
		main.bindEvent();
		main.render.refreshUser();
	});
});