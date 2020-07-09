import React from 'react';
import {Button,Spin} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("params")
@observer
class Cache extends React.Component {

    onResetGeo = () => {
        this.props.params.resetAllGeo();
    }

    onResetPrice = () => {
        this.props.params.resetAllPrice();
    }

    onResetEntity = () => {
        this.props.params.resetAllEntity();
    }

    onResetWxEntity = () => {
        this.props.params.resetWxEntity();
    }

    onBuildStationData = () => {
        this.props.params.buildStationData();
    }

    onStationZhyk = () => {
        this.props.params.getStationZhyk();
    }

    render() {
        return (
            <div>
                <Spin tip="请稍候..." size="large" spinning={this.props.params.isShowLoading}>
                    <div style={{padding:50, color:"red",fontSize:20}}>因数据量过大，重置过程非常耗时(超过3分钟)，请勿频繁重置。</div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',padding:100,alignItems:'center'}}>
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
                            <Button type="primary" style={{margin:10}} onClick={this.onResetGeo}>重置位置缓存</Button>
                            <div style={{color:'#938f98',fontSize:13}}>(解决附近油站距离排序不显示问题)</div>
                            <Button type="primary" style={{margin:10}} onClick={this.onResetPrice} >重置油价缓存</Button>
                            <div style={{color:'#938f98',fontSize:13}}>(解决附近油站油价排序不显示问题)</div>
                            <Button type="primary" style={{margin:10}} onClick={this.onResetEntity} >重置油站信息缓存</Button>
                            <div style={{color:'#938f98',fontSize:13}}>(解决附近油站信息显示错误异常问题)</div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
                            <Button type="primary" style={{margin:10}} onClick={this.onStationZhyk}>智慧油客获取信息</Button>
                            <div style={{color:'#938f98',fontSize:13}}>(同步所有智慧油客油站油价信息)</div>
                            <Button type="primary" style={{margin:10}} onClick={this.onBuildStationData} >生成加油站数据文件</Button>
                            <div style={{color:'#938f98',fontSize:13}}>(立即生成全量加油站文件，用以第三方获取油站信息，每小时自动生成。)</div>
                            {/*<Button type="primary" style={{margin:10}} onClick={this.onResetWxEntity} >重置小程序油站信息缓存</Button>*/}
                            {/*<div style={{color:'#938f98',fontSize:13}}>(解决微信小程序附近油站信息显示错误异常问题)</div>*/}
                        </div>
                    </div>
                </Spin>

            </div>

            );
    }
}

export default Cache;