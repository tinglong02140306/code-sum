import React from 'react';
import './Bag.scss';
import TickerBagList from '../bag/list/List';
import TickerBagCreate from '../bag/create/Create';
import TickerBagUpdate from '../bag/update/Update';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';

@inject('tickerBagStore')
@observer
class Manager extends React.Component {


    routes = () => {
        return <Switch>
            <Route path="/ticket-bag-create" component={TickerBagCreate}></Route>
            {/* <Route path="/ticket-bag-update" component={TickerBagUpdate}></Route> */}
            <Route path="/ticket-bag" component={TickerBagList}></Route>
            <Redirect to="/ticket-bag" />
        </Switch>
    }

    render() {
        const create = this.props.location.pathname === "/ticket-bag-create" ? "flex" : "none";
        // const update = this.props.location.pathname === "/ticket-bag-update" ? "flex" : "none";
        // const len = Object.keys(this.props.tickerBagStore.record).length;
        const optionType = this.props.tickerBagStore.optionType
        return (
            <div className="ticket-manage-container">
                <div className="ticket-manage-breadcrumb-box">
                    <span>优惠券 </span>
                    <Link to="/ticket-bag">/ 洗车券包管理 </Link>
                    <Link to="/ticket-bag-create" style={{ display: create }}>{optionType == 1 ? '/ 新增洗车券包' : optionType == 2 ? '/ 修改洗车券包' : '/ 查看洗车券包'}</Link>
                    {/* <Link to="/ticket-bag-update" style={{ display: update }}>/ 修改洗车券包</Link> */}
                </div>
                <div className="ticket-manage-routes">
                    {this.routes()}
                </div>
            </div>
        );
    }


}

export default Manager;
