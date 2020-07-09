/**
 * @author yaoding
 * @time 2017-11-09
 * @description 二级服务
 */
'use strict';

require.config(__FRAMEWORK_CONFIG__);
require.async([
	'common'
], function(common) {
	var platForm = common.checkMobilePlatform(),
		OS = common.phoneOs(),
		AID = '',
		name = common.getParam('name'),
		type = $('.wrap')[0].className.split(' ')[1],  // wzcj 违法查缴   jmhdx  警民互动
		vm = window.vm = fly({
			// 区域点击事件
			areaSecClick: function() {
				croods.customPlugin({
                    action: 'BsdtPlugin.clickAreaSpecial',
                    params: {},
                    success: function(res) {

                    }
                });
			}

		});
	// 事件处理
	var eventHandle = {
		// 获取当前区域信息
		getCurArea: function() {
			common.noNet($('.wrap'), function() {
				$('.no-net').removeClass('top-7');
				$('.service-list').addClass('hide');
			}, function() {
				croods.customPlugin({
					action: 'UserPlugin.getData',
					params: {},
					success: function(data) {
						AID = data.areaId;
						renderEvent.renderService();
						renderEvent.renderCurrentCity(data);
					},
					fail: function() {
						renderEvent.renderService();
					}
				});
			});
			
		}
	},
	renderEvent = {
		/**
		 * 渲染当前市
		 * @param {[object]} [data] [列表数据]
		 */
		renderCurrentCity: function(data) {
			if (data.areaName.length > 3) { // 超过3个字省略
				data.areaName = data.areaName.substring(0, 3) + '...';
			}
			$('.area-name').text(data.areaName);
			AID = data.areaId;
		},
		renderService: function() {
			var code;
			 // wzcj 违法查缴   jmhdx  警民互动
			if(type == 'jmhdx') {
				code = 'f635f85ec8a4447682d254bf6cf2f9a0';
			}else {
				code = 'a8e7c69cf10c4c2092a27fc1ff3a40c8';  // 违法查缴、警媒链接公用一个接口
			}
			/**
			 * 渲染服务
			 */
			croods.ajax({
				method: code,
				params: {
					areaId: AID,
					osType: OS,
					name: name
				},
				//请求参数
				success: function(res) { //请求成功回调
					var res1 = JSON.parse(res),
						data = res1.data;
					if(!!data) {
						for (var i = 0, len = data.length; i < len; i++) {
							data[i].info = JSON.stringify(data[i].androidDetail);
						}
						var requestTmpl = fly.template('appTmpl', data);
						$(".service-list").html(requestTmpl);
					}else {
						common.toast('数据请求失败！');
					}
				},
				fail: function(res) { //请求失败回调
					/*mescroll.endErr();*/
				},
				complete: function(res) {}
			});
		}
	};

	// 点击app入口
	$('.service-list').off('.service-item').on('click', '.service-item', function() {
		$('.app-blank').show();
		var linkUrl = $(this).attr('data-url'),
			type = $(this).attr('data-type'),
			jumpType;
		if (type == "1") {
			jumpType = "app";
		} else if (type == "2") {
			jumpType = "h5zip";
		} else if (type == "3") {
			jumpType = "html";
		} else {
			jumpType = "local";
		}
		var REQUEST = common.packData({}, "", 1, false, "ct://ThirdService@" + jumpType + "@Third@url=" + linkUrl);
		if (type != undefined) {
			croods.customPlugin({
				action: 'CIPRoutePlugin.action',
				params: REQUEST,
				success: function(res) {}
			});
		}
		setTimeout(function() {
			$('.app-blank').hide();
		}, 2000);
	});

	// 返回
	$('.top-banner').off('.back').on('click', '.back', function() {
		platForm ? croods.pageClose({}) : window.history.back(-1);
	});

    fly.bind(document.body, vm);
	// 初始化页面信息
	eventHandle.getCurArea();
	window.AreaRefresh = function(res) {
		if (res.areaName.length > 3) {  // 超过3个字省略
			res.areaName = res.areaName.substring(0, 3) + '...';
		}
        AID = res.areaId;
        $('.area-name').html(res.areaName);
        renderEvent.renderService();
    };
});