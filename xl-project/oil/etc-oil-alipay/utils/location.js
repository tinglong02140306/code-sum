import { LOCATION_INFO } from '../constants/global.js'
/**
 * @description: 获取当前位置的经纬度、城市代码等信息
 * @param confirm: 获取位置信息失败后 是否需要再次提醒用户打开授权
 * @param success: 成功回调
 * @param fail: 失败回调
 * @return null
 */
export const getLocation = (confirm, success, fail) => {
    my.getLocation({
        type: 1, // 逆地址解析
        success: res => {
            const location = {
                latitude: res.latitude,
                longitude: res.longitude
            }
            location.area_code = res.cityAdcode;
            location.city = res.city;
            location.province = res.province
            my.setStorageSync({ key: LOCATION_INFO, data: JSON.stringify(location) });
            success(location);
        },
        fail: () => {
            if (confirm) {
                my.getSetting({
                    success: res => {
                        var statu = res.authSetting;
                        if (!statu['location']) {
                            my.alert({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则将会影响功能的正常使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        my.openSetting({
                                            success: data => {
                                                if (data.authSetting['location'] === true) {
                                                    my.getLocation({
                                                        type: 1, // 逆地址解析
                                                        success: res => {
                                                            const location = {
                                                                latitude: res.latitude,
                                                                longitude: res.longitude
                                                            }
                                                            location.area_code = res.cityAdcode;
                                                            location.city = res.city;
                                                            location.province = res.province
                                                            my.setStorageSync({ key: LOCATION_INFO, data: JSON.stringify(location) });
                                                            success(location);
                                                        },
                                                        fail: () => {}
                                                    });
                                                } else {
                                                    fail("获取地理位置授权失败");
                                                }
                                            },
                                            fail: () => {
                                                fail("获取地理位置授权失败");
                                            }
                                        });
                                    } else {
                                        fail("您已禁止获取当前地址位置");
                                    }
                                }
                            });
                        }
                    },
                    fail: () => {
                        fail("调用授权窗口失败");
                    }
                });
            } else {
                fail("您已拒绝获取当前位置");
            }
        }
    });
}