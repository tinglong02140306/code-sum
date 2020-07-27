import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from "../page/home/Home";
import Login from "../page/login/Login";

class Rooter extends Component {
    render() {
        return (<Router basename='/manager/'>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/"
                    render={() => {
                        return (localStorage.getItem('isLogin') !== "1" ?
                            <Redirect push to="/login" /> : <Home />)
                    }} />
            </Switch>
        </Router>);
    }
}

export default Rooter;