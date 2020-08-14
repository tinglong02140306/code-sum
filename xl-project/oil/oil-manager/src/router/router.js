import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Partner from "../page/business/partner/Partner";
import Organization from "../page/business/organazation/Organization";
import User from "../page/system/user/User";
import Role from "../page/system/role/Role";
import Params from "../page/system/params/Params";
import Permission from "../page/system/permission/Permission";
import Order from "../page/order/order/Order";
import WaterCollect from "../page/order/order-water-collect/WaterCollect";
import Children from "../page/order/children/Children";
import AccountCheck from "../page/order/account-check/AccountCheck";
import Invoice from "../page/invoice/invoice/Invoice";
import InvoiceRegular from "../page/invoice/invoice-regular/InvoiceRegular";
import Waybill from "../page/order/waybill/waybill";
import Financial from "../page/report/financial/Financial";
import OilProduct from "../page/report/oil-product/OilProduct";
import OilCardStatistics from "../page/report/oil-card-statistics/OilCardStatistics";
import OilProductStatistics from "../page/report/oil-product-statistics/OilProductStatistics";
import QuartzManage from "../page/system/quartz/QuartzManage";
import Invite from "../page/wxapplet/invite/Invite";
import Operation from "../page/system/operation/Operation";
import Pages from "../page/system/pages/Pages";
import EtcOil from "../page/wxapplet/etc/EtcOil";
import EtcBlacklist from "../page/wxapplet/etc-blacklist/EtcBlacklist";
import Terminal from '../page/shell/terminal/Terminal';
import SummaryReport from '../page/shell/summary-report/SummaryReport';
import Reports from '../page/shell/reports/Reports';
import Groups from "../page/shell/groups/Groups";
import PosUser from "../page/wx-member-card/pos-user/PosUser";
import Price from '../page/shell/price/Price';
import OilPrice from '../page/shell/oil-price/OilPrice';
// TODO
import nonActivestatistics from '../page/shell/statistics/Statistics';
import StationImage from '../page/station/station-image/StationImage';
import Company from '../page/station/company/Company';
import Brand from '../page/station/brand/Brand';
import StationInfo from '../page/station/station-info/StationInfo';
import StationOilPrice from '../page/station/oil-price/OilPrice';
import StationTerminal from '../page/station/station-terminal/StationTerminal';
import StationOilGun from '../page/station/oil-gun/OilGun';
import Cache from '../page/station/cache/Cache';
import WXRecharge from '../page/report/wx-recharge/WXRecharge';
import WXConsume from '../page/report/wx-consume/WXConsume';
import FeeImport from '../page/report/fee-import/fee-import';
import EtcGold from "../page/etc-account/etc-gold/EtcGold";
import Interests from '../page/wxapplet/interests/Interests'
import BillOnline from '../page/bill-fix/online/BillOline'
import BillEtc from '../page/bill-fix/etc/BillEtc'
import BillPartner from '../page/bill-fix/partner/BillPartner'
import BillTicket from '../page/bill-fix/ticket/BillTicket'
import Discount from '../page/discount/discount/Discount'
import DiscountStation from '../page/discount/discount-station/DiscountStation';
import Static from '../page/wxapplet/static/Static';
import Banner from '../page/wxapplet/banner/Banner';
import VehicleBrand from '../page/vehicle-cleaning/brand/Brand';
import VehicleInfo from '../page/vehicle-cleaning/info/Info';
import VehicleOrder from '../page/vehicle-cleaning/order/Order';
import TickerManager from '../page/ticket/manage/Manager';
import TickerGrant from '../page/ticket/grant/Grant';
import TickerBag from '../page/ticket/bag/Bag';
import TickerBagOrder from '../page/ticket/order/Order';
import WhiteList from '../page/ticket/white-list/list/List';
import WhiteCreate from '../page/ticket/white-list/create/Create';


class Rooter extends Component {
    render() {
        return (<Switch>
            <Route path="/business-partner" component={Partner} />
            <Route path="/business-organization" component={Organization} />
            <Route path="/system-user" component={User} />
            <Route path="/system-role" component={Role} />
            <Route path="/system-permission" component={Permission} />
            <Route path="/system-params" component={Params} />
            <Route path="/order-water" component={Order} />
            <Route path="/order-water-collect" component={WaterCollect} />
            <Route path="/order-children-water" component={Children} />
            <Route path="/invoice" component={Invoice} />
            <Route path="/invoice-regular" component={InvoiceRegular} />
            <Route path="/waybill-query" component={Waybill} />
            <Route path="/financial" component={Financial} />
            <Route path="/system-quartz" component={QuartzManage} />
            <Route path="/invite-code" component={Invite} />
            <Route path="/wx-etc-oil" component={EtcOil} />
            <Route path="/wx-etc-interests" component={Interests} />
            <Route path="/wx-etc-blacklist" component={EtcBlacklist} />
            <Route path="/wx-static" component={Static} />
            <Route path="/wx-banner" component={Banner} />
            <Route path="/oil-product" component={OilProduct} />
            <Route path="/oil-card-statistics" component={OilCardStatistics} />
            <Route path="/oil-product-statistics" component={OilProductStatistics} />
            <Route path="/system-operation" component={Operation} />
            <Route path="/system-pages" component={Pages} />
            <Route path="/shell-terminal" component={Terminal} />
            <Route path="/shell-forms" component={Reports} />
            <Route path="/shell-summary-report" component={SummaryReport} />
            <Route path="/shell-terminal-group" component={Groups} />
            <Route path='/shell-oil-price-updata' component={Price} />
            <Route path='/shell-oil-price' component={OilPrice} />
            {/* TODO */}
            <Route path='/shell-non-statistics' component={nonActivestatistics} />
            <Route path="/wx-pos-user" component={PosUser} />
            <Route path="/station-image" component={StationImage} />
            <Route path="/station-company" component={Company} />
            <Route path="/station-brand" component={Brand} />
            <Route path="/station-info" component={StationInfo} />
            <Route path="/station-oil-price" component={StationOilPrice} />
            <Route path="/station-terminal" component={StationTerminal} />
            <Route path="/station-oil-gun" component={StationOilGun} />
            <Route path="/station-cache" component={Cache} />
            <Route path="/discount-catory" component={Discount} />
            <Route path="/discount-station" component={DiscountStation} />
            <Route path="/report-wx-recharge" component={WXRecharge} />
            <Route path="/report-wx-consume" component={WXConsume} />
            <Route path="/report-fee-import" component={FeeImport} />
            <Route path="/account-etc-gold" component={EtcGold} />
            <Route path="/bill-online" component={BillOnline} />
            <Route path="/bill-etc" component={BillEtc} />
            <Route path="/bill-partner" component={BillPartner} />
            <Route path="/bill-ticket" component={BillTicket} />
            <Route path="/account-check" component={AccountCheck} />
            {/* 洗车服务 */}
            <Route path="/vehicle-cleaning-brand" component={VehicleBrand} />
            <Route path="/vehicle-cleaning-info" component={VehicleInfo} />
            <Route path="/vehicle-cleaning-order" component={VehicleOrder} />
            {/* 优惠券 */}
            <Route path="/ticket-manage-create" component={TickerManager}></Route>
            <Route path="/ticket-manage-update" component={TickerManager}></Route>
            <Route path="/ticket-manage" component={TickerManager}></Route>
            <Route path="/ticket-grant-create" component={TickerGrant}></Route>
            <Route path="/ticket-grant-update" component={TickerGrant}></Route>
            <Route path="/ticket-grant" component={TickerGrant}></Route>
            <Route path="/ticket-bag-create" component={TickerBag}></Route>
            <Route path="/ticket-bag-update" component={TickerBag}></Route>
            <Route path="/ticket-bag" component={TickerBag}></Route>
            <Route path="/ticket-bag-order" component={TickerBagOrder}></Route>
            <Route path="/ticket-white-list" component={WhiteList}></Route>
            <Route path="/ticket-white-create" component={WhiteCreate}></Route>
            <Redirect to="/business-partner" />
        </Switch>);
    }
}

export default Rooter;