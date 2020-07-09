import React from 'react';
import {Modal, Input, Cascader, Select, Radio, Checkbox} from 'antd'
import {inject, observer} from 'mobx-react'
import "./StationInfoDialog.scss"
import city from "../../../constants/city"
import RoadDialog from "./RoadDialog";
import {isEmpty} from "../../../utils/isEmpty";
import {isNumber} from "../../../utils/isNumber";
const options = city;
const CheckboxGroup = Checkbox.Group;
// const plainOptions = ['国标98#', '国标95#', '国标92#', '国标0#', '国标-10#'];
// const plainOptions = [];

const support_payments = ['ONE_KEY', 'QR_CODE', 'ETC_NO_SENSE', 'ETC_CARD'];
//ONE_KEY(一键加油),QR_CODE(扫码加油),ETC_NO_SENSE(无感支付),ETC_CARD(ETC刷卡支付)
const paymentOptions = [
    { label: '一键加油', value: 'ONE_KEY' },
    { label: '扫码加油', value: 'QR_CODE' },
    { label: '无感支付', value: 'ETC_NO_SENSE' },
    { label: 'ETC刷卡支付', value: 'ETC_CARD' },
];
@inject("stationInfoStore")
@observer
class StationInfoDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            id:'',
            full_name: '',
            name: '',
            province_code: '',
            province_name: '',
            city_code: '',
            city_name: '',
            county_code: '',
            county_name: '',
            address: '',
            coordinate: '',
            brand_id: '',
            brand_name: '',
            brand_code: '',
            on_high: false,
            support_oil: '',
            support_oil_array: '',
            road_id: '',
            road_code: '',
            road_name: '',
            contact_person: '',
            contact_phone: '',
            email: '',
            printer_no: '',
            company_id: '',
            xl_merchant_id: '',
            extend_no: '',
            fullNameHint: '',
            nameHint: '',
            provinceCodeHint: '',
            provinceNameHint: '',
            cityNameHint: '',
            countyNameHint: '',
            addressHint: '',
            coordinateHint: '',
            brandIdHint: '',
            onHighHint: '',
            oilNoHint: '',
            XlMerchantIdHint: '',
            checkedList: [],
            paymentList: [],
            support_payments: [],
            // oilDefaultList: [],
            indeterminate: true,
            checkAll: false,
        }
    }

    componentDidMount() {
        const {typeModal} = this.props.stationInfoStore;//0:增加 1:修改 2 :查看
        //包含油品
        // for (let i=0; i<oilDetailList.length; i++){
        //     plainOptions.push({label:oilDetailList[i].oil_level+oilDetailList[i].oil_code , value: oilDetailList[i].xl_oil_code})
        // }

        const {support_payments,printer_no,email,id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, brand_name,brand_code,on_high, support_oil_array, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no} = this.props.stationInfoStore.stationInfoObject;

        if (typeModal !== 0) {
            // let oilDefaultList = support_oil_array.split(",");
            if (brand_id) {
                this.setState({
                    brand_id: brand_id.toString(),
                })
            }
            if (company_id) {
                this.setState({
                    company_id: company_id.toString(),
                })
            }
            //支持油品
            let arr = [];
            if (support_oil_array) {
                for (let i=0; i<support_oil_array.length; i++){
                    arr.push(support_oil_array[i].xl_oil_code);
                }
                // this.setState({
                //     checkedList: arr
                // })
                // console.log(arr);
                // console.log(this.state.checkedList);
            }
            this.setState({
                id:id,
                full_name: full_name,
                name: name,
                province_code: province_code,
                province_name: province_name,
                city_code: city_code,
                city_name: city_name,
                county_code: county_code,
                county_name: county_name,
                address: address,
                coordinate: coordinate,
                brand_name: brand_name,
                brand_code: brand_code,
                on_high: on_high,
                support_oil: arr.join(','),
                road_id: road_id,
                road_code: road_code,
                road_name: road_name,
                contact_person: contact_person,
                contact_phone: contact_phone,
                email: email,
                printer_no: printer_no,
                xl_merchant_id: xl_merchant_id,
                extend_no: extend_no,
                support_payments: support_payments,
                checkedList: arr
            });
        }

    }

    onCancel = () => {
        // plainOptions.splice(0);//清除可支持油品数组
        this.props.stationInfoStore.setIsShowDialog(false);
        this.props.stationInfoStore.setRoadData(null);
        // this.props.stationInfoStore.setPlainOptions([]);

        // this.props.companyStore.setCompanyObject(null);
    }

    onOk = () => {
        const {typeModal,roadData} = this.props.stationInfoStore;//0:增加 1:修改 2 :查看
        const {support_payments,printer_no,email, id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, brand_name, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id,company_name, xl_merchant_id,extend_no} = this.state;

        if (typeModal === 0) {//新增
            if (!isEmpty(full_name) && !isEmpty(name) && !isEmpty(province_name) && !isEmpty(city_name) && !isEmpty(county_name) && !isEmpty(address) && !isEmpty(coordinate) && !isEmpty(brand_id) && !isEmpty(support_oil) && !isEmpty(xl_merchant_id)) {

                this.setState({
                    fullNameHint: '',
                    nameHint: '',
                    provinceCodeHint: '',
                    provinceNameHint: '',
                    cityNameHint: '',
                    countyNameHint: '',
                    addressHint: '',
                    brandIdHint: '',
                    onHighHint: '',
                    oilNoHint: '',
                    XlMerchantIdHint: '',
                });
                if (coordinate.search("，")!=-1) {
                    this.setState({
                        coordinateHint: "请用英文逗号",
                    });
                }else if (coordinate.split(',').length-1!=1){
                    this.setState({
                        coordinateHint: "格式错误(正确如:116.45,40.075)",
                    });
                } else {
                    let lon = coordinate.split(',')[0];
                    let lat = coordinate.split(',')[1];

                    if (isNumber(lon) && isNumber(lat)){
                        if(lon>73 && lon<136 && lat>3 && lat<54){
                            this.setState({
                                coordinateHint: '',
                            });
                            if (roadData){
                                // this.props.stationInfoStore.addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, roadData.id, roadData.code, roadData.name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no);
                                this.props.stationInfoStore.addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, roadData.id, roadData.code, roadData.name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments);
                            } else {
                                // this.props.stationInfoStore.addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no);
                                this.props.stationInfoStore.addStation(full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments);
                            }

                        }else {
                            this.setState({
                                coordinateHint: "坐标不正确(73<经度<136,3<纬度<54)",
                            });
                        }
                    } else {
                        this.setState({
                            coordinateHint: "请输入数字坐标",
                        });
                    }
                }

            } else {
                this.dealData();
            }

        } else if (typeModal === 1) {//修改
            if (!isEmpty(full_name) && !isEmpty(name) && !isEmpty(province_name) && !isEmpty(city_name) && !isEmpty(county_name) && !isEmpty(address) && !isEmpty(coordinate) && !isEmpty(brand_id) && !isEmpty(support_oil) && !isEmpty(xl_merchant_id)) {

                this.setState({
                    fullNameHint: '',
                    nameHint: '',
                    provinceCodeHint: '',
                    provinceNameHint: '',
                    cityNameHint: '',
                    countyNameHint: '',
                    addressHint: '',
                    brandIdHint: '',
                    onHighHint: '',
                    oilNoHint: '',
                    XlMerchantIdHint: '',
                });
                if (coordinate.search("，")!=-1) {
                    this.setState({
                        coordinateHint: "请用英文逗号",
                    });
                }else if (coordinate.split(',').length-1!=1){
                    this.setState({
                        coordinateHint: "格式错误(正确如:116.45,40.075)",
                    });
                } else {
                    let lon = coordinate.split(',')[0];
                    let lat = coordinate.split(',')[1];

                    if (isNumber(lon) && isNumber(lat)){
                        if(lon>73 && lon<136 && lat>3 && lat<54){
                            this.setState({
                                coordinateHint: '',
                            });
                            if (roadData){
                                // this.props.stationInfoStore.updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, roadData.id, roadData.code, roadData.name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no);
                                this.props.stationInfoStore.updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, roadData.id, roadData.code, roadData.name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments);
                            } else {
                                // this.props.stationInfoStore.updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,extend_no,email,printer_no);
                                this.props.stationInfoStore.updateStation(id,full_name, name, province_code, province_name, city_code, city_name, county_code, county_name, address, coordinate, brand_id, on_high, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id,email,printer_no,support_payments);
                            }

                        }else {
                            this.setState({
                                coordinateHint: "坐标不正确(73<经度<136,3<纬度<54)",
                            });
                        }
                    } else {
                        this.setState({
                            coordinateHint: "请输入数字坐标",
                        });
                    }
                }

            } else {
                this.dealData();
            }
        } else {
            this.props.stationInfoStore.setIsShowDialog(false);
        }
    }

    /**
     *提交前的校验
     */
    dealData = () => {
        const {full_name, name, province_name, city_name, county_name, address, coordinate, brand_id, support_oil,xl_merchant_id} = this.state;
        console.log('brand_id'+brand_id);
        this.setState({
            fullNameHint: full_name ? "" : "名称不能为空",
            nameHint: name ? "" : "简称不能为空",
            provinceNameHint: county_name ? city_name ? province_name ?"" :  "请选择省市区" :  "请选择省市区" : "请选择省市区",
            addressHint: address ? "" : "地址不能为空",
            coordinateHint: coordinate ?"": "坐标不能为空",
            brandIdHint: brand_id ? "" : "请选择油站品牌",
            oilNoHint: support_oil ? "" : "请选择油品",
            XlMerchantIdHint: xl_merchant_id ? "" : "商户号不能为空",
        });

    }

    onNameChange = (e) => {
        this.setState({name: e.target.value});
    };

    onFullNameChange = (e) => {
        this.setState({full_name: e.target.value});
    };

    onCascaderChange = (value, selectedOptions) => {
        if (selectedOptions.length) {
            this.setState({
                province_code: selectedOptions[0].code,
                province_name: selectedOptions[0].value,
                city_code: selectedOptions[1].code,
                city_name: selectedOptions[1].value,
                county_code: selectedOptions[2].code,
                county_name: selectedOptions[2].value,
                address: selectedOptions[0].value + selectedOptions[1].value + selectedOptions[2].value,
            })
        }else {
            this.setState({
                province_code: '',
                province_name: '',
                city_code: '',
                city_name: '',
                county_code: '',
                county_name: '',
            })
        }
    };

    onAddressChange = (e) => {
        this.setState({address: e.target.value});
    };

    onCoordinateChange = (e) => {
        this.setState({coordinate: e.target.value});
    };

    onChangeBrandId = (value) => {
        // const {brandList} = this.props.stationInfoStore;
        // brandList.map((item)=>{
        //     if (item.code === value){
        //         this.setState({brand_id: item.id});
        //     }
        // })
        // this.setState({brand_code: value});
        this.setState({brand_id: value});
    };

    selectBrandOption = () => {
        const {brandList} = this.props.stationInfoStore;
        // console.log("brandList"+JSON.stringify(brandList))
        if (brandList.length) {
            return brandList && brandList.map((item, index) => {
                // return <Select.Option key={item.code}>{item.name}</Select.Option>
                return <Select.Option key={item.id}>{item.name}</Select.Option>
            });
        }
    };

    onChangeOnHigh = (e) => {
        if (e.target.value === 1) {
            this.setState({on_high: true});
        } else {
            this.setState({on_high: false});
        }
    };

    onChangeOil = checkedList => {
        const {plainOptions} = this.props.stationInfoStore;
        this.setState({
            support_oil: checkedList.join(','),
            checkedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };

    onChangePayment= checkedValues => {
        this.setState({
            support_payments:checkedValues
        })
    }

    onCheckAllChange = e => {
        const {plainOptions} = this.props.stationInfoStore;

        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    onContactPersonChange = (e) => {
        this.setState({contact_person: e.target.value});
    };

    onContactPhoneChange = (e) => {
        this.setState({contact_phone: e.target.value});
    };
    onEmailChange = (e) => {
        this.setState({email: e.target.value});
    };
    onPrinterNoChange = (e) => {
        this.setState({printer_no: e.target.value});
    };
    onExtendNoChange = (e) => {
        this.setState({extend_no: e.target.value});
    };

    onChangeCompanyId = (value) => {
        const {companyList} = this.props.stationInfoStore;
        if (companyList.length) {
            return companyList && companyList.map((item) => {

                if (item.id.toString() === value){
                    this.setState({
                        company_id:item.id.toString(),
                        xl_merchant_id: item.xl_merchant_id,
                    });
                }
            });
        }
    };

    selectCompanyOption = () => {
        const {companyList} = this.props.stationInfoStore;
        if (companyList.length) {
            return companyList && companyList.map((item, index) => {
                return <Select.Option key={item.id.toString()}>{item.name}</Select.Option>
            });
        }
    };

    onXlMerchantIdChange = (e) => {
        // this.setState({xl_merchant_id: e});
        this.setState({xl_merchant_id: e.target.value});
    };
    onXlMerchantIdSearch = (e) => {
        this.setState({xl_merchant_id: e});
    };
    onRoadNameChange = (e) => {
        this.props.stationInfoStore.setIsShowRoadDialog(true);
    };

    selectXlMerchantIdOption = () => {
        const {companyList} = this.props.stationInfoStore;
        if (companyList.length) {
            return companyList && companyList.map((item) => {
                if (!isEmpty(item.xl_merchant_id)) {
                    return <Select.Option key={item.xl_merchant_id}>{item.xl_merchant_id}</Select.Option>
                }
            });
        }
    };

    render() {
        const {plainOptions,isShowRoadDialog, isShowSubmitLoading, isShowDialog, typeModal,roadData} = this.props.stationInfoStore;//0:新增 1:修改 2 :查看
        const {support_payments,brand_code,brand_name,printer_no,email,indeterminate, checkAll, checkedList, oilDefaultList, full_name, name, address, coordinate, brand_id, on_high, province_name, city_name, county_name, support_oil, road_id, road_code, road_name, contact_person, contact_phone, company_id, xl_merchant_id, fullNameHint, nameHint, provinceCodeHint, provinceNameHint, cityNameHint, countyNameHint, addressHint, coordinateHint, brandIdHint, onHighHint, oilNoHint,XlMerchantIdHint,extend_no} = this.state;

        let title = "";
        let okText = "";
        if (typeModal === 0) {
            title = "添加油站";
            okText = "提交"
        } else if (typeModal === 1) {
            title = "修改油站";
            okText = "提交"
        } else {
            title = "查看";
            okText = "确定"
        }
        return (
            <Modal title={title}
                   width={1000}
                   okText={okText}
                   okType="primary"
                   cancelText="取消"
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   confirmLoading={isShowSubmitLoading}
                   visible={isShowDialog}>
                <div className="station-info-dialog-container">
                    <div className="station-info-dialog-left">
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>全称:</p>
                                <Input placeholder="全称"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={full_name}
                                       onChange={this.onFullNameChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder">{fullNameHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>简称:</p>
                                <Input placeholder="简称"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={name}
                                       onChange={this.onNameChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder">{nameHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>省市区:</p>
                                <Cascader className="station-info-cascader"
                                          options={options}
                                          onChange={this.onCascaderChange}
                                          placeholder="省/市/区"
                                          disabled={typeModal !== 2 ? false : true}
                                          defaultValue={[province_name, city_name, county_name]}/>
                            </div>
                            <p className="station-info-dialog-placeholder">{provinceNameHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>地址:</p>
                                <Input.TextArea
                                    placeholder="地址"
                                    // disabled={typeModal !== 2 ? false : true}
                                    value={address}
                                    autosize={{minRows: 2}}
                                    style={{width: 250, height: 100, marginBottom: 4}}
                                    onChange={this.onAddressChange}></Input.TextArea>
                            </div>
                            <p className="station-info-dialog-placeholder">{addressHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>坐标(经/纬度):</p>
                                <Input placeholder="百度坐标系,如:116.45,40.075"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={coordinate}
                                       onChange={this.onCoordinateChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder">{coordinateHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>油站品牌:</p>
                                <Select
                                    placeholder="油站品牌"
                                    // defaultValue={brand_code}
                                    // value={brand_code}
                                    defaultValue={brand_id}
                                    value={brand_id}
                                    style={{width: 250, margin: 0}}
                                    disabled={typeModal !== 2 ? false : true}
                                    onChange={this.onChangeBrandId}>
                                    {this.selectBrandOption()}
                                </Select>
                            </div>
                            <p className="station-info-dialog-placeholder">{brandIdHint}</p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>是否在高速上:</p>
                                <Radio.Group
                                    style={{margin: 0, width: 250}}
                                    value={on_high ? 1 : 2}
                                    onChange={this.onChangeOnHigh}
                                    disabled={typeModal !== 2 ? false : true}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </Radio.Group>
                            </div>
                            <p className="station-info-dialog-placeholder">{onHighHint}</p>
                        </div>
                    </div>
                    <div className="station-info-dialog-line"></div>
                    <div className="station-info-dialog-left">
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">道路信息:</p>
                                <Input.TextArea
                                    placeholder="道路信息"
                                    type="button"
                                    autosize={{minRows: 1}}
                                    style={{width: 250, height: 100, marginBottom: 4}}
                                    // disabled={typeModal !== 2 ? false : true}
                                    value={roadData?roadData.name:road_name}
                                    onClick={this.onRoadNameChange}></Input.TextArea>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">联系人:</p>
                                <Input placeholder="联系人"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={contact_person}
                                       onChange={this.onContactPersonChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">联系电话:</p>
                                <Input placeholder="联系电话"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={contact_phone}
                                       onChange={this.onContactPhoneChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">邮箱:</p>
                                <Input placeholder="邮箱"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={email}
                                       onChange={this.onEmailChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">打印机编号:</p>
                                <Input placeholder="打印机编号"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={printer_no}
                                       onChange={this.onPrinterNoChange}></Input>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label">归属合作伙伴:</p>
                                <Select
                                    placeholder="归属合作伙伴"
                                    value={company_id}
                                    style={{width: 250, margin: 0}}
                                    disabled={typeModal !== 2 ? false : true}
                                    onChange={this.onChangeCompanyId}
                                >
                                    {this.selectCompanyOption()}
                                </Select>
                            </div>
                            <p className="station-info-dialog-placeholder"></p>
                        </div>
                        <div className="station-info-dialog-item">
                            <div className="station-info-dialog-item-content">
                                <p className="station-info-dialog-item-label"><span>*</span>信联商户号:</p>
                                <Input placeholder="信联商户号"
                                       // disabled={typeModal !== 2 ? false : true}
                                       value={xl_merchant_id}
                                       onChange={this.onXlMerchantIdChange}></Input>
                                {/*<Select*/}
                                    {/*showSearch*/}
                                    {/*placeholder="信联商户号"*/}
                                    {/*value={xl_merchant_id}*/}
                                    {/*style={{width: 250, margin: 0}}*/}
                                    {/*disabled={typeModal !== 2 ? false : true}*/}
                                    {/*onSearch={this.onXlMerchantIdSearch}*/}
                                    {/*onChange={this.onXlMerchantIdChange}>*/}
                                    {/*{this.selectXlMerchantIdOption()}*/}
                                {/*</Select>*/}
                            </div>
                            <p className="station-info-dialog-placeholder">{XlMerchantIdHint}</p>
                        </div>
                        {/*<div className="station-info-dialog-item">*/}
                        {/*    <div className="station-info-dialog-item-content">*/}
                        {/*        <p className="station-info-dialog-item-label">外部编号:</p>*/}
                        {/*        <Input placeholder="外部编号"*/}
                        {/*               disabled={typeModal !== 2 ? false : true}*/}
                        {/*               value={extend_no}*/}
                        {/*               onChange={this.onExtendNoChange}></Input>*/}
                        {/*    </div>*/}
                        {/*    <p className="station-info-dialog-placeholder" style={{color:'#FF7B53',fontSize:12}}>(智慧油客请移步终端管理~)</p>*/}
                        {/*    /!*<p className="station-info-dialog-placeholder"></p>*!/*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="station-info-dialog-item">
                    <div className="station-info-dialog-item-content-check">
                        <p className="station-info-oil-detail-label"><span>*</span>支持油品:
                        </p>
                        <CheckboxGroup
                            className="oil-check-item"
                            options={plainOptions}
                            value={checkedList}
                            disabled={typeModal !== 2 ? false : true}
                            onChange={this.onChangeOil}
                        />
                    </div>
                    <p className="station-info-dialog-placeholder">{oilNoHint}</p>
                </div>
                <div className="station-info-dialog-item">
                    <div className="station-info-dialog-item-content-check">
                        <p className="station-info-oil-detail-label"><span>*</span>支付方式:
                        </p>
                        <CheckboxGroup
                            className="oil-check-item"
                            options={paymentOptions}
                            value={support_payments}
                            disabled={typeModal !== 2 ? false : true}
                            onChange={this.onChangePayment}
                        />
                    </div>
                    {/*<p className="station-info-dialog-placeholder">{oilNoHint}</p>*/}
                </div>
                {isShowRoadDialog ? <RoadDialog/> : null}
            </Modal>
        )
    }

}

export default StationInfoDialog;

// const oilDetailList = [
//     {id:11,xl_oil_code:'G611092',oil_level:'国Ⅵ',oil_code:'92#'},
//     {id:12,xl_oil_code:'G611093',oil_level:'国Ⅵ',oil_code:'93#'},
//     {id:13,xl_oil_code:'G611094',oil_level:'国Ⅵ',oil_code:'94#'},
//     {id:14,xl_oil_code:'G611095',oil_level:'国Ⅵ',oil_code:'95#'},
//     {id:15,xl_oil_code:'G611096',oil_level:'国Ⅵ',oil_code:'96#'},
//     {id:16,xl_oil_code:'G611097',oil_level:'国Ⅵ',oil_code:'97#'},
// ];
