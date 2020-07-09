<!DOCTYPE html>
<html>
<link href="/wjewt/resource/img/favicon.ico" type="image/vnd.microsoft.icon" rel="icon" />
<script>
	var CONTEXTPATH = "/wjewt",
		USERURL = 'http://www.ahga.gov.cn:20081/publicsso/wx/index',
		SHAREADDRESS = window.location.origin + CONTEXTPATH,
		APPDOWNURL = SHAREADDRESS + '/h5/share.do';
</script>
<head>
    <meta charset="UTF-8">
    <!-- 添加到主屏幕后，全屏显示 -->
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="format-detection" content="telephone=no" />
    <!-- iphone 运行在全屏模式 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <script type="text/javascript" src="/wjewt/resource/js/plugins/remCacul/remCacul.js"></script>
    <link href="/wjewt/resource/h5/css/base.css" rel="stylesheet" />
    <link href="/wjewt/resource/h5/css/all.css" rel="stylesheet" />
    <style>
      .all{
            height: 100%;
            width: 100%;
        }

        .pdtb {
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;
        }
    </style>
    <title>皖警便民服务e网通</title>
</head>
<body>  
  <div class="all" >
    </div>
<script type="text/javascript" src="/wjewt/resource/js/plugins/jquery/jquery-1.8.2.min.js"></script>
 <script type="text/javascript" src="/wjewt/resource/js/plugins/croods/croods-1.3.1.min.js"></script>
<script lanuage="javascript">
   $(function () {
	   	function getLocation(param) {
	   		var params = $.extend({
	   			getLocationFail: function() {},
	   			getLocModeFail: function() {},
	   			openGpsSettingFail: function() {}
	   		}, param);
	   		/**
	   		 * 开启定位
	   		 */
	   		croods.openLocation({
	        	interval: 5000,
	           	//可选,代表每个5S进行一次定位，默认为5000ms
	           	success: function (res) { //请求成功回调
	               	if(res && res.lng && res.lat) { // 成功后有回调并且经纬度存在
	               		// 关闭定位
	                   	croods.closeLocation();
	               	}
	           	},
	           	fail: function (res) { //失败回调
	           		if(res && ((res.substring(0, 5) == '70033')|| (res.substring(0, 5) == '50009'))) {
						getLocMode(params);
	           		} else {
	           			params.getLocationFail();
	           			console.log('定位失败');
	           		}
	       			
	           	}
		    });
		}

		/**
		 * 获取定位模式
		 */
		function getLocMode(params) {
			croods.customPlugin({
	        	action: 'GeoSettingPlugin.getLocMode',
	        	success: function(res) {
	               	var locMode = res.locMode;
	               	if(locMode == 1) {
	               		console.log('室内GPS定位不准确，请开启网络定位...');
	                	openGpsSetting();
	               	}
	            },
	            fail: function(msg) {
	               	/*alert(msg.errorMessage)*/
	               	params.getLocModeFail();
	            }
	        });
		}

		/**
		 * 开启定位设置
		 * @type {Object}
		 */
		function openGpsSetting(params) {
			croods.customPlugin({
	       		action: 'GeoSettingPlugin.openGpsSetting',
	       		success: function(res) {
	           		
	       		},
	       		fail: function(msg) {
	       			params.openGpsSettingFail();
	           		console.log('定位失败');
	       		}
	   		});
		}

		getLocation();
	});
</script>
</body>
</html>