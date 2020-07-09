import React from "react";
import "./PriceAddDialog.scss";
import {Input, Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import {isEmpty} from "../../../utils/isEmpty";
import {isMoney} from "../../../utils/utils";

// let prices = [];
let pricesArr = [];
@inject("stationPriceStore")
@observer
class PriceAddDialog extends React.Component {

    constructor() {
        super();
        this.state = {
            id: '',
            station_name: '',
            oil_no: '',
            oil_priceHint: '',
            stationEmptyHint: '',
            oilNoEmptyHint: '',
            oilPriceEmptyHint: '',
            prices: [],
            isPrices: false,
        }
    }

    componentDidMount() {
        const {typeModal} = this.props.stationPriceStore;//0:增加 1:修改 2 :查看
        const {id, station_name, oil_no, oil_price,xl_oil_code,oil_full_name,} = this.props.stationPriceStore.stationPriceObject;
        if (typeModal !== 0) {
            this.setState({
                id: id,
                station_name: station_name || '',
                oil_no: oil_no || '',
                oil_price: oil_price || '',
                xl_oil_code: xl_oil_code || '',
                oil_full_name: oil_full_name || '',
            });
        }
    }

    onStationChange = (e) => {
        this.props.stationPriceStore.setIsShowSearchDialog(true);
    }

    onOilCodeChange = (e) => {
        this.setState({xl_oil_code: e.target.value});
    }
    onOilFullNameChange = (e) => {
        this.setState({oil_full_name: e.target.value});
    }

    onOilPriceChange = (e) => {
        this.setState({oil_price: e.target.value});
    }

    onChangeOilDetail = (e) => {
        let arr = this.state.prices;
        for (let i=0; i<arr.length; i++){
            if (arr[i].xl_oil_code === e.target.id) {
                arr[i]['oil_price'] = e.target.value;
                this.setState({
                    prices:arr,
                })
            }
        }
    }

    onCancel = () => {
        if (this.props.stationPriceStore.operationData) {
            this.props.stationPriceStore.setOperationData(null);
        }
        this.props.stationPriceStore.setIsShowDialog(false);
    }

    onOk = () => {
        const {typeModal, operationData} = this.props.stationPriceStore;//0:增加 1:修改 2 :查看
        const {id, station_name, oil_price,prices,isPrice} = this.state;
        if (typeModal === 0) {//新增
            // for (let i = 0; i<pricesArr.length;i++){
            //     if (!isEmpty(pricesArr[i].oil_price.toString()) && !isMoney(pricesArr[i].oil_price)) {
            //         this.setState({isPrice:true});
            //         this.dealData();
            //         pricesArr.splice();
            //         console.log('99999')
            //         break;
            //     }else {
            //         this.setState({isPrice:false});
            //     }
            // }
            if (operationData) {
                if (!isEmpty(operationData.name)) {
                    this.dealPrice();
                    this.props.stationPriceStore.addPrice(operationData.id,operationData.name, pricesArr);
                    pricesArr.splice();

                } else {
                    this.dealData();
                }
            } else {
                if (!isEmpty(station_name)) {
                    this.dealPrice();
                    this.props.stationPriceStore.addPrice(operationData.id,operationData.name, pricesArr);
                    pricesArr.splice();
                } else {
                    this.dealData();
                }
            }
        } else if (typeModal === 1) {//修改
            console.log(station_name);
            if (operationData) {
                if (!isEmpty(oil_price)&& isMoney(oil_price)) {
                    this.props.stationPriceStore.updateOilPrice(id, oil_price);
                } else {
                    this.dealData();
                }
            } else {
                if (!isEmpty(oil_price)&& isMoney(oil_price)) {
                    this.props.stationPriceStore.updateOilPrice(id, oil_price);
                } else {
                    this.dealData();
                }
            }
        } else {
            if (operationData) {
                this.props.stationPriceStore.setOperationData(null);
            }
            this.props.stationPriceStore.setIsShowDialog(false);
        }
    }

    inputItem = (id, label, inputValue, inputChange, hint) => {
        return <div className="station-price-dialog-item-container">
            <div className="station-price-dialog-price-item">
                <p className="station-price-dialog-item-label">{label}</p>
                <Input className="station-price-dialog-item-input"
                       maxLength={8}
                       id={id}
                       // type = "number"
                       value={inputValue} onChange={inputChange}/>
            </div>
            <p className="station-price-dialog-item-hint" style={{visibility: hint ? "visible" : "hidden"}}>{hint}</p>
        </div>
    }

    //处理价格参数数组
    dealPrice = () => {
        pricesArr.splice();
        const {prices} = this.state;
        console.log('prices',prices)
        for (let i=0;i<prices.length; i++){
            if (prices[i].oil_price){
                pricesArr.push(prices[i]);
            }
        }
        console.log('pricesArr',pricesArr)

    }

        /**
     *提交前的校验
     */
    dealData = () => {
        const {operationData, typeModal} = this.props.stationPriceStore;
        const {station_name, oil_price,prices} = this.state;
        if (typeModal === 0) {
            this.setState({
                stationEmptyHint: operationData ? "" : station_name ? "" : "请选择油站",
            });
            for (let i = 0; i<prices.length;i++){
                this.setState({
                    oil_priceHint:prices[i].oil_price?isMoney(prices[i].oil_price) ? '' : '':'格式错误',
                });
            }
        } else {
            this.setState({
                oilPriceEmptyHint: oil_price ?isMoney(oil_price) ?'': "格式错误" : "油价不能为空",
            })
        }

    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {operationData,isExecute} = this.props.stationPriceStore;

        let support_oil_array = [];
        let arr = [];
        if (operationData && isExecute) {
            pricesArr.splice();
            this.props.stationPriceStore.setIsExecute(false);
            support_oil_array = operationData.support_oil_array;
            support_oil_array&&support_oil_array.map((item,index)=>{
                arr.push({"xl_oil_code": item.xl_oil_code,"oil_full_name":item.oil_full_name, "oil_price": ''})
            })
            this.setState({
                prices:arr,
            });
        }
    }

    render() {
        const {isShowDialog, typeModal, operationData} = this.props.stationPriceStore;//0:新增 1:修改 2 :查看
        const {prices,station_name, xl_oil_code,oil_full_name, oil_price, oil_priceHint, stationEmptyHint, oilNoEmptyHint, oilPriceEmptyHint} = this.state;
        let title = "";
        let okText = "";
        if (typeModal === 0) {
            title = "新增";
            okText = "提交"
        } else if (typeModal === 1) {
            title = "修改";
            okText = "提交"
        } else {
            title = "查看";
            okText = "确定"
        }


        if (typeModal === 0) {
            return (
                <Modal title={title}
                       okText={okText}
                       okType="primary"
                       cancelText="取消"
                       onCancel={this.onCancel}
                       onOk={this.onOk}
                       visible={isShowDialog}>
                    <div className="station-price-dialog-box">
                        <div className="station-price-dialog-item">
                            <div className="station-price-dialog-item-content">
                                <p className="station-price-dialog-item-label"><span>*</span>油站名称:</p>
                                <Input placeholder="油站名称"
                                       type="button"
                                       disabled={typeModal === 1 ? true : false}
                                       value={operationData ? operationData.name : station_name}
                                       onClick={this.onStationChange}></Input>
                            </div>
                            <p className="price-dialog-item-placeholder">{stationEmptyHint}</p>
                        </div>
                        <div className="station-price-dialog-item-label station-price-group-price-title"><span>*</span>油价设置:
                            <div style={{fontSize: 12, color: "#F5AD27"}}>(单位：元，两位小数)</div>
                        </div>
                        <div className='station-price-dialog-price-box'>
                            <div style={{margin:'20px', fontSize: 14, color: "red",display:operationData?'none':'flex'}}>请先选择要添加的油站~</div>
                            <div className="station-price-group-dialog-container" style={{display:operationData?'flex':'none',flexDirection:'column',}}>
                                {prices&&prices.map((item,index,key)=>{
                                    return(
                                            <div className='station-price-dialog--box' style={{display:'flex'}} key={item.xl_oil_code}>
                                                {this.inputItem(item.xl_oil_code.toString(),item.oil_full_name+':', item.oil_price, this.onChangeOilDetail,'')}
                                            </div>
                                        )
                                })}
                            </div>
                            <p className="price-dialog-item-placeholder">{oil_priceHint}</p>
                        </div>
                    </div>
                </Modal>
            )
        } else {
            return (
                <Modal title={title}
                       okText={okText}
                       okType="primary"
                       cancelText="取消"
                       onCancel={this.onCancel}
                       onOk={this.onOk}
                       visible={isShowDialog}>
                    <div className="station-price-dialog-box">
                        <div className="station-price-dialog-item">
                            <div className="station-price-dialog-item-content">
                                <p className="station-price-dialog-item-label"><span>*</span>油站名称:</p>
                                <Input placeholder="油站名称"
                                       type="button"
                                       disabled={typeModal === 1 ? true : false}
                                       value={operationData ? operationData.name : station_name}
                                       onClick={this.onStationChange}></Input>
                            </div>
                            <p className="price-dialog-item-placeholder">{stationEmptyHint}</p>
                        </div>
                        <div className="station-price-dialog-item">
                            <div className="station-price-dialog-item-content">
                                <p className="station-price-dialog-item-label"><span>*</span>油品编号:</p>
                                <Input placeholder="油品编号"
                                       disabled={typeModal === 1 ? true : false}
                                       value={xl_oil_code}
                                       onChange={this.onOilCodeChange}></Input>
                            </div>
                            <p className="price-dialog-item-placeholder">{oilNoEmptyHint}</p>
                        </div>
                        <div className="station-price-dialog-item">
                            <div className="station-price-dialog-item-content">
                                <p className="station-price-dialog-item-label"><span>*</span>油品:</p>
                                <Input placeholder="油品"
                                       disabled={typeModal === 1 ? true : false}
                                       value={oil_full_name}
                                       onChange={this.onOilFullNameChange}></Input>
                            </div>
                            <p className="price-dialog-item-placeholder">{oilNoEmptyHint}</p>
                        </div>
                        <div className="station-price-dialog-item">
                            <div className="station-price-dialog-item-content">
                                <p className="station-price-dialog-item-label"><span>*</span>油价:</p>
                                <Input placeholder="油价"
                                       disabled={typeModal !== 2 ? false : true}
                                       value={oil_price}
                                       onChange={this.onOilPriceChange}></Input>
                            </div>
                            <p className="price-dialog-item-placeholder">{oilPriceEmptyHint}</p>
                        </div>
                    </div>
                </Modal>
            )
        }

    }
}

export default PriceAddDialog;