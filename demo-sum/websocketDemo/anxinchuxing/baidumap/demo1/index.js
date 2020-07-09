'use strict'
var baiduPostionTimer,  // 百度定位次数
    pts = [[117.15083329753, 31.837163064664],[117.350658, 31.938285],[117.386446, 31.939281],[117.442501, 31.914603]],
    pointDataArr = [],
   /* pointDataArrs = [
        new BMap.Point(117.15083329753, 31.837163064664),
        new BMap.Point(117.350658, 31.938285),
        new BMap.Point(117.386446, 31.939281),
        new BMap.Point(117.389034, 31.913828),
        new BMap.Point(117.442501, 31.914603)],*/
    mapItem,
    marker,
    repeatLocInter,
    i = 0,
    pointX,
    pointY,
    REM = $(window).width() / 16,
    baiWidth = 1.47 * REM,
    baiHeight = 1.82 * REM,
    myIcon,
    myIcon,
	eventHandle = {
		// 百度定位
		baiduLocationEvent: function() {
			try {
	            baiduPostionTimer++;
	            var geolocation = new BMap.Geolocation();
	            geolocation.getCurrentPosition(function (data) {
	                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
	                    if (data.accuracy == null) {
	                        // 用户拒绝地理位置授权
	                        alert('请检查定位服务是否打开');
	                        // eventHandle.platFormToast('请检查定位服务是否打开!');
	                    }
	                    //省+市+区
	                    var address=data.address.province + data.address.city + data.address.district;
	                    //街道+号牌
	                    var streetinfo = data.address.street + data.address.street_number;
	                    pointX = data.point.lng.toString(); // 经度
	                    pointY = data.point.lat.toString(); // 纬度
	                    eventHandle.renderMap(pointX,pointY);
	                }else  {
	                    //定位失败请刷新重试
	                }
	            },{enableHighAccuracy: true});  // enableHighAccuracy 设置精度
	        }catch (e) {
	            if(pointX != 0) {
	                eventHandle.renderMap(pointX,pointY);
	            }else {
	                if(baiduPostionTimer <= 3 ) {
	                    eventHandle.bindLocationEventBaiduThird();
	                }else {
	                	alert('定位失败')
	                    // eventHandle.platFormToast('定位失败！');
	                }
	               
	            }
	        }
		},
		// 根据点的数组自动调整缩放级别
        setMapZoom: function(pointDataArr) {
            var view = mapItem.getViewport(eval(pointDataArr)),
                mapZoom = view.zoom,
                centerPoint = view.center;  
            mapItem.centerAndZoom(centerPoint,mapZoom);  
        },
        // 渲染地图场景
        renderMap: function(){

            if(!mapItem) {
                mapItem = new BMap.Map("allMap"); // 创建map实例
                mapItem.addControl(new BMap.NavigationControl());  // 添加平移缩放控件
                mapItem.addControl(new BMap.GeolocationControl());  // 添加定位控件 
            }
            pointDataArr = [];
            for(var j = 0; j  <pts.length; j++) {
                pointDataArr.push(new BMap.Point(pts[j][0], pts[j][1]));
            }
            var mPoint = pointDataArr[pointDataArr.length -1]; // 创建点坐标
            eventHandle.setMapZoom(pointDataArr);  // 根据距离设置地图缩放级别
            mapItem.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            myIcon = myIcon ? myIcon : new BMap.Icon('../img/icon-location.png', new BMap.Size(baiWidth, baiHeight),{
                imageSize: new BMap.Size(baiWidth,baiHeight),    
            });

            mapItem.removeOverlay(marker);  // 移除前一个marker样式
            marker = new BMap.Marker(mPoint,{
                icon: myIcon
                // offset: new BMap.Size(-(baiWidth/10), -(baiHeight/4))
            });  // 创建标注
            eventHandle.setDriverLine(pointDataArr);
            // eventHandle.setMapConStyle(pointDataArr);   
        },
        setDriverLine: function(pointDataArr) {
            var p1, p2,
                len = pointDataArr.length;
            var driving = new BMap.DrivingRoute(mapItem, {renderOptions:{map: mapItem, autoViewport: true},
                onPolylinesSet:function(routes) { 
                    var searchRoute = routes[0].getPolyline();//导航路线
                    mapItem.addOverlay(searchRoute); 
                }, 
                onMarkersSet:function(routes) {
                    // mapItem.removeOverlay(routes[0].marker); //删除起点
                    for(var i = 1; i < len-1; i++) {
                        mapItem.removeOverlay(routes[i].Om);
                    }
                    // mapItem.removeOverlay(routes[len-1].marker);//删除终点
                }
            });
            if(len == 2) {
                p1 = pointDataArr[0];
                p2 = pointDataArr[1];
                driving.search(p1, p2);
            }else if(len > 2) {
                p1 = pointDataArr[0];
                p2 = pointDataArr[len - 1];
                driving.search(p1, p2, {waypoints: pointDataArr.slice(1, len -1)});
            }
            mapItem.addOverlay(marker);
        },
        setMapConStyle: function(pointDataArr) {
            var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                scale: 0.6,//图标缩放大小
                strokeColor:'#fff',//设置矢量图标的线填充颜色
                strokeWeight: '2',//设置线宽
            });
            var icons = new BMap.IconSequence(sy, '10', '30');  // 第二个参数 折线相对于起点的位置， 第3个参数线上符号之间的距离
           
            var polyline =new BMap.Polyline(pointDataArr, {
               enableEditing: false,//是否启用线编辑，默认为false
               enableClicking: true,//是否响应点击事件，默认为true
               // icons:[icons],
               strokeWeight: 0.1 * REM + '',//折线的宽度，以像素为单位
               strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
               strokeColor: "#4c72ff" //折线颜色
            });
            mapItem.addOverlay(marker);
            mapItem.addOverlay(polyline);  
        }
	};
(function() {
	eventHandle.renderMap();
})();