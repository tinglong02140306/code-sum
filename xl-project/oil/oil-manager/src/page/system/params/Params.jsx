import React from 'react';
import {Button} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("params")
@observer
class Params extends React.Component {

    onClickParams = () => {
        this.props.params.getParams();
    }

    onClickSysParams = () => {
        this.props.params.getSysParams();
    }

    render() {
        return (<div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',padding:200}}>
            <Button type="primary" onClick={this.onClickParams}>刷新系统参数</Button>
            <Button type="primary" onClick={this.onClickSysParams} >刷新映射</Button>
        </div>);
    }
}

export default Params;