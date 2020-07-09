let map;
// 地图类
const mapUtil = {
    /**
     * 地图初始化
     */
    init(options) {
        // 初始化百度地图对象
        this.map = map = new BMap.Map(options.id || "map");
        if (options.city) { // 参数为两个时，根据地点初始化地图
            map.centerAndZoom(options.city, options.zoom); // 初始化地图
        } else if (options.point) { // 参数为三个时，根据点坐标初始化地图
            var point = new BMap.Point(options.point.x, options.point.y);
            map.centerAndZoom(point, options.zoom); // 初始化地图
        };
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);
        return this;
    },

}

export default mapUtil;