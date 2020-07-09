import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import stores from "./store/index"
import {Provider} from 'mobx-react';
import registerServiceWorker from './registerServiceWorker';
import Rooter from "./router";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from 'antd';
import {message} from 'antd';

message.config({
    maxCount:1,
  });

ReactDOM.render(
    <Provider {...stores}>
        <LocaleProvider locale={zh_CN}>
            <Rooter/>
        </LocaleProvider>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
