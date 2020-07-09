import React from 'react';
import './Manager.scss';
import TickerManageList from '../manage/list/List';
import TickerManageCreate from '../manage/create/Create';
import TickerManageUpdate from '../manage/update/Update';
import { Redirect, Route, Switch, Link} from 'react-router-dom';

class Manager extends React.Component {

    
    routes = () =>{
        return  <Switch>
            <Route  path="/ticket-manage-create" component={TickerManageCreate}></Route>
            <Route  path="/ticket-manage-update" component={TickerManageUpdate}></Route>
            <Route  path="/ticket-manage" component={TickerManageList}></Route>
            <Redirect to="/ticket-manage"/>
        </Switch>
    }

	render() {
        const isCreate = this.props.location.pathname==="/ticket-manage-create";
        const isUpdate = this.props.location.pathname==="/ticket-manage-update";
        const create = isCreate?"flex":"none";
        const update = isUpdate?"flex":"none";
		return (
			<div className="ticket-manage-container">
				<div className="ticket-manage-breadcrumb-box">
                    <span>优惠券 </span>
                    <Link to="/ticket-manage">/ 优惠券管理 </Link>
                    <Link to="/ticket-manage-create" style={{display:create}}>/ 创建优惠券</Link>
                    <Link to="/ticket-manage-update" style={{display:update}}>/ 修改优惠券</Link>
                </div>
                <div className="ticket-manage-routes">
                    {this.routes()}
                </div>
			</div>
		);
	}


}

export default Manager;
