import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from "../page/home/Home";
import Login from "../page/login/Login";
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn';

moment.locale('zh-cn')

class Rooter extends Component {
    render() {
        return (<LocaleProvider locale={zh_CN}><Router basename='/manager/'>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/"
                    render={() => {
                        return (localStorage.getItem('isLogin') !== "1" ?
                            <Redirect push to="/login" /> : <Home />)
                    }} />
            </Switch>
        </Router></LocaleProvider>);
    }
}

export default Rooter;