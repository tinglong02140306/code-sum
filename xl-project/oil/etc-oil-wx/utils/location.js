import {QQ_MAP_KEY} from '../constants/global';
import QQMapWX from '../utils/qqmap-wx-jssdk1/qqmap-wx-jssdk.js';
import {LOCATION_INFO} from '../constants/global'
const qqmapsdk = new QQMapWX({key: QQ_MAP_KEY});

/**
 * @description: 获取当前位置的经纬度、城市代码等信息
 * @param confirm: 获取位置信息失败后 是否需要再次提醒用户打开授权
 * @param success: 成功回调
 * @param fail: 失败回调
 * @return null
 */
export const getLocation = (confirm,success,fail) => {
    wx.getLocation({
        type: 'gcj02',
        success: res=>{
            // 腾讯api获取地理代码
            const location = {
                latitude: res.latitude,
                longitude: res.longitude
            }
            //逆地址解析
            qqmapsdk.reverseGeocoder({
                location:location,
                success: function (res) {
                    console.log(res)
                    if(res.status==0){
                        location.area_code = res.result.ad_info.adcode;
                        location.city = res.result.ad_info.city;
                        location.province = res.result.ad_info.province
                        wx.setStorageSync({LOCATION_INFO:JSON.stringify(location)});
                        success(location);
                    }else{//逆地址解析失败
                        fail("逆地址解析失败");
                    }
                },
                fail: ()=>{//逆地址解析失败
                    fail("逆地址解析失败");
                }
            });
        },
        fail: ()=>{
            if(confirm){
                wx.getSetting({
                    success: res=> {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则将会影响功能的正常使用',
                                success: function(tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: data=> {
                                                if (data.authSetting['scope.userLocation'] === true) {
                                                    wx.getLocation({
                                                        type: 'gcj02',
                                                        success: res=> {
                                                            // 腾讯api获取地理代码
                                                            const location = {
                                                                latitude: res.latitude,
                                                                longitude: res.longitude
                                                            }
                                                            //逆地址解析
                                                            qqmapsdk.reverseGeocoder({
                                                                location:location,
                                                                success: function (res) {
                                                                    if(res.status==0){
                                                                        location.city_code = res.result.ad_info.adcode;
                                                                        location.city = res.result.ad_info.city;
                                                                        location.province = res.result.ad_info.province
                                                                        wx.setStorageSync({LOCATION_INFO:JSON.stringify(location)});
                                                                        success(location);
                                                                    }else{//逆地址解析失败
                                                                        fail("逆地址解析失败");
                                                                    }
                                                                },
                                                                fail: ()=>{//逆地址解析失败
                                                                    fail("逆地址解析失败");
                                                                }
                                                            });
                                                        },fail:()=>{
                                                            fail("获取地理位置失败");
                                                        }
                                                    });
                                                } else {
                                                    fail("获取地理位置授权失败");
                                                }
                                            },
                                            fail:()=>{
                                                fail("获取地理位置授权失败");
                                            }
                                        });
                                    }else{
                                        fail("您已禁止获取当前地址位置");
                                    }
                                }
                            });
                        }
                    },
                    fail: ()=> {
                        fail("调用授权窗口失败");
                    }
                });
            }else{
                fail("您已拒绝获取当前位置");
            }
        }
    });
}






