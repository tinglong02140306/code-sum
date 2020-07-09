
import React from 'react';
import './Grant.scss';
import TickerGrantList from '../grant/list/List';
import TickerGrantCreate from '../grant/create/Create';
import TickerGrantUpdate from '../grant/update/Update';
import { Redirect, Route, Switch, Link} from 'react-router-dom';

class Grant extends React.Component {

    
    routes = () =>{
        return  <Switch>
            <Route  path="/ticket-grant-create" component={TickerGrantCreate}></Route>
            <Route  path="/ticket-grant-update" component={TickerGrantUpdate}></Route>
            <Route  path="/ticket-grant" component={TickerGrantList}></Route>
            <Redirect to="/ticket-grant"/>
        </Switch>
    }

	render() {
        const create = this.props.location.pathname==="/ticket-grant-create"?"flex":"none";
        const update = this.props.location.pathname==="/ticket-grant-update"?"flex":"none";
		return (
			<div className="ticket-manage-container">
				<div className="ticket-manage-breadcrumb-box">
                    <span>优惠券 </span>
                    <Link to="/ticket-grant">/ 优惠券发放 </Link>
                    <Link to="/ticket-grant-create" style={{display:create}}>/ 创建发放活动</Link>
                    <Link to="/ticket-grant-update" style={{display:update}}>/ 修改发放活动</Link>
                </div>
                <div className="ticket-manage-routes">
                    {this.routes()}
                </div>
			</div>
		);
	}


}

export default Grant;
