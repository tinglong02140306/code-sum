/*
 * @Author: sunmingmao
 * @Date: 2020-05-11 16:26:27
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-05-19 10:15:07
 * @Description: 网点查询
 */
import http from "../../http/http";
import {
    action,
    observable
} from "mobx";
import {
    message
} from "antd/lib/index";
class PointsStore {
    @observable loadingPoints = false;
    @action setloadingPoints(loadingPoints) {
        this.loadingPoints = loadingPoints
    }

    //油站品牌
    @observable brands_station = [];
    @action getBrandsStation() {
        const params = {
            page_num: 1,
            page_size: 0
        }
        http.post('/website/gasstation/brand-query', params, res => {
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                item.label = item.name;
                item.value = item.id;
                return item;
            });
            this.brands_station = data;
        }, err => {
            console.log(err);
        });
    }

    //油站查询
    @observable stations = [];
    @action getStations(params) {
        this.loadingPoints = true;
        http.post('/website/gasstation/station-multi-query', params, res => {
            this.loadingPoints = false;
            const data = res.data;
            const array = data && data.map(item => {
                const obj = {};
                obj.key = item.id;
                obj.title = item.name;
                return obj;
            });
            this.stations = array;
        }, err => {
            this.loadingPoints = false;
            message.error(err);
        });
    }


    //洗车机品牌
    @observable brands_washer = [];
    @action getBrandsWasher() {
        const params = {
            page_num: 1,
            page_size: 0
        }
        http.post('/website/wash/query-washer-brand', params, res => {
            const data = res.data;
            data && data.map(item => {
                item.key = item.id;
                item.label = item.brand_name;
                item.value = item.id;
                return item;
            });
            this.brands_washer = data;
        }, err => {
            console.log(err);
        });
    }

    //洗车机查询
    @observable washers = [];
    @action getWashers(params) {
        this.loadingPoints = true;
        http.post('/website/wash/query-washer-multi', params, res => {
            this.loadingPoints = false;
            const data = res.data;
            const array = data && data.map(item => {
                const obj = {};
                obj.key = item.id;
                obj.title = item.wash_name;
                return obj;
            });
            this.washers = array;
        }, err => {
            this.loadingPoints = false;
            message.error(err);
        });
    }
}


export default PointsStore;