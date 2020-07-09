import React from 'react';
import './TicketConfigureModal.scss';
import {isEmpty} from '../../../utils/isEmpty';
import {isMoney} from '../../../utils/isMoney';
import {isRange} from '../../../utils/isRange';
import {Modal, Input, Button,Radio,Select} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("ticketConfigureStore")
@observer
class TicketConfigureModal extends React.Component {

    constructor(){
        super();
        this.state={
            id:'',
            name:'',
            use_channel:'0',
            type:'1',
            limit_amount:'',//限制金额
            face_value:'',
            discount_amount:'',//优惠金额
            discount_ratio:'',
            description:'',
            fund_bear:'',
            coupon_status:0,
            ticket_type:0,
            isEmptyName:false,
            isEmptyDiscountAmount:false,//优惠金额
            isEmptyDiscountRatio:false,
            isEmptyLimitAmount:false,//限制金额
            isEmptyDescription:false
        }
    }

    componentDidMount() {
       const {modalRecord,typeModal} = this.props.ticketConfigureStore;
       if (typeModal!==2) {
           this.setState({
               id:modalRecord.id,
               name:modalRecord.name,
               use_channel:modalRecord.use_channel,
               type:modalRecord.type,
               limit_amount:modalRecord.limit_amount,
               discount_amount:modalRecord.discount_amount,
               discount_ratio:modalRecord.discount_ratio,
               description:modalRecord.description,
               fund_bear:modalRecord.fund_bear,
               coupon_status:modalRecord.coupon_status,
               ticket_type:isEmpty(modalRecord.discount_amount)?1:0,
               isEmptyName:false,
               isEmptyDiscountAmount:false,
               isEmptyFundBear:false,
               isEmptyDiscountRatio:false,
               isEmptyLimitAmount:false
           });
       }
    }

    /**
     * 校验 提交的信息 是否合法
     * @returns {boolean}
     */
    checkInfo(){
       const {name,discount_amount,discount_ratio,limit_amount,ticket_type,description,fund_bear}= this.state;
       if (isEmpty(name)){
           this.setState({isEmptyName:true});
           return false
       } else {
           this.setState({isEmptyName:false});
       }
       if (isMoney(limit_amount)){
           this.setState({isEmptyLimitAmount:false});
       } else {
           this.setState({isEmptyLimitAmount:true});
           return false
       }
        if (isEmpty(fund_bear)){
            this.setState({isEmptyFundBear:true});
            return false
        } else {
            this.setState({isEmptyFundBear:false});
        }

        if (isEmpty(description)){
            this.setState({isEmptyDescription:true});
            return false
        } else {
            this.setState({isEmptyDescription:false});
        }

       if (ticket_type===0) {
            if (isMoney(discount_amount)) {
                this.setState({isEmptyDiscountAmount:false});
            }else {
                this.setState({isEmptyDiscountAmount:true});
                return false
            }
       }else {
           if (isRange(discount_ratio)){
               this.setState({isEmptyDiscountRatio:false});
           } else {
               this.setState({isEmptyDiscountRatio:true});
               return false
           }
       }
       return true
    }

    /**
     *
     * @param submitData
     * @param oldData
     */
    onDealUpdate(submitData,oldData){
        if (submitData===oldData){
            return null
        }
        return submitData
    }

    isCanUpdate(name,use_channel,type,limit_amount,discount_amount,discount_amount_result,discount_ratio,description,fund_bear){
        if (!name&&!use_channel && !type && !limit_amount && !discount_amount&&!discount_amount_result && !discount_ratio && !description &&!fund_bear) {
            return false
        }
        return true
    }

    onOk = () => {
        const {ticket_type,name,discount_amount,discount_ratio,
            limit_amount,use_channel,type,description,coupon_status,fund_bear}= this.state;
        const {typeModal,modalRecord} = this.props.ticketConfigureStore;

        const checkResult = this.checkInfo();
        if (typeModal===1){//修改
            const coupon_name_result = this.onDealUpdate(name,modalRecord.name);
            const use_channel_result = this.onDealUpdate(use_channel,modalRecord.use_channel);
            const type_result = this.onDealUpdate(type,modalRecord.type);
            const limit_amount_result = this.onDealUpdate(limit_amount,modalRecord.limit_amount);
            const discount_amount_result = this.onDealUpdate(discount_amount,modalRecord.discount_amount);
            const discount_ratio_result = this.onDealUpdate(discount_ratio,modalRecord.discount_ratio);
            const description_result = this.onDealUpdate(description,modalRecord.description);
            const fund_bear_result = this.onDealUpdate(fund_bear,modalRecord.fund_bear);
            // const coupon_status_result = this.onDealUpdate(coupon_status,modalRecord.coupon_status);

            if (this.isCanUpdate(coupon_name_result,use_channel_result,type_result,limit_amount_result,discount_amount_result,discount_ratio_result,description_result,fund_bear_result)) {
                if (checkResult){
                    this.props.ticketConfigureStore.getUpdateTicket(modalRecord.id,coupon_name_result,
                        use_channel_result, type_result, limit_amount_result,
                        ticket_type===0?discount_amount_result:null,
                        ticket_type===1?discount_ratio_result:null,
                        description_result, ticket_type,fund_bear_result,()=> {
                            this.props.onClicked();
                        })
                }
            }else {
                this.props.ticketConfigureStore.setIsShowTicketConfigureModal(0,false,null);
            }
        } else {//新增
            if (checkResult){
                this.props.ticketConfigureStore.getAddTicket(name,use_channel,type,limit_amount,
                    ticket_type===0?discount_amount:null,ticket_type===1?discount_ratio:null,description,ticket_type,fund_bear,()=>{
                        this.props.onClicked();
                    })
            }
        }
    }



    onCancel = () => {
        this.props.ticketConfigureStore.setIsShowTicketConfigureModal(0,false,null);
    }

    /**
     * 优惠券名称
     * @param e
     */
    onTicketNameChange=(e)=>{
        this.setState({
            name:e.target.value
        });
    }

    /**
     * 优惠券限制金额
     * @param e
     */
    onTicketLimitMoneyChange=(e)=>{
        this.setState({
            limit_amount:e.target.value
        });
    }

    /**
     * 优惠金额
     * @param e
     */
    onTicketMoneyChange=(e)=>{
        this.setState({
            discount_amount:e.target.value
        });
    }

    /**
     * 优惠折扣
     * @param e
     */
    onTicketDiscountTatioChange=(e)=>{
        this.setState({
            discount_ratio:e.target.value
        });
    }

    /**
     * 优惠券限制
     */
    onUseChannelChange=(e)=>{
        this.setState({
            use_channel:e.target.value
        });
    }

    /**
     * 优惠券类型
     */
    onTicketTypeChange=(e)=>{
        this.setState({
            type:e.target.value
        });
    }

    /**
     * 优惠券状态
     * @param e
     */
    onTicketStatusChange=(e)=>{
        this.setState({
            coupon_status:e.target.value
        });
    }

    /**
     * 优惠方式
     */
    onTicketChange=(e)=>{
        this.setState({
            ticket_type:e.target.value,
            isEmptyDiscountAmount:false,
            isEmptyDiscountRatio:false
        });
    }

    onChangeFundBear = (e) => {
        this.setState({fund_bear: e});
    };

    onTicketDesChange=(e)=>{
        this.setState({
            description:e.target.value
        });
    }

    getTitle=(typeModal)=>{
        let title = "";
        switch (typeModal) {
            case 0:
                title = "查看";
                break
            case 1:
                title = "修改";
                break
            case 2:
                title = "新增";
                break
        }
        return title
    }

    render() {
        const {ticket_type,name,use_channel,type,limit_amount,
            discount_amount,discount_ratio,description,fund_bear,coupon_status,
            isEmptyName,isEmptyDiscountRatio,isEmptyDiscountAmount,isEmptyLimitAmount,isEmptyDescription,isEmptyFundBear} = this.state;
        const {isShowSubmitLoading, typeModal, isShowTicketConfigureModal} = this.props.ticketConfigureStore;
        const title = this.getTitle(typeModal);

        return (<Modal
            width={700}
            title={title}
            onCancel={this.onCancel}
            visible={isShowTicketConfigureModal}
            footer={typeModal === 0 ?
                [<Button type="primary" key="back" onClick={this.onCancel}>确定</Button>] : [
                    <Button key="back" onClick={this.onCancel}>取消</Button>,
                    <Button key="submit" onClick={this.onOk} loading={isShowSubmitLoading} type="primary">提交</Button>]}>
            <div className="ticket-configure-modal-container">
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>优惠券名称:</div>
                        <Input.TextArea
                            maxLength={50}
                            value={name}
                            autosize={{ minRows: 1}}
                            disabled={typeModal===0}
                            placeholder="优惠券名称"
                            onChange={this.onTicketNameChange}
                            className="ticket-configure-modal-input"/>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint" style={{visibility:isEmptyName?'visible':'hidden'}}>请输入优惠券名称</div>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>限制金额:</div>
                        <Input
                            maxLength={50}
                            value={limit_amount}
                            disabled={typeModal===0}
                            placeholder="限制金额"
                            onChange={this.onTicketLimitMoneyChange}
                            className="ticket-configure-modal-input"/>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint" style={{visibility:isEmptyLimitAmount?'visible':'hidden'}}>请输入正确的限制金额</div>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>出资方:</div>
                        <Select className="terminal-dialog-item-input"
                                size="small"
                                value={fund_bear}
                                disabled={typeModal===0}
                                style={{width: '70%', margin: 0}}
                                onChange={this.onChangeFundBear}>
                            <Select.Option value="信联">信联</Select.Option>
                            <Select.Option value="油站">油站</Select.Option>
                        </Select>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint" style={{visibility:isEmptyFundBear?'visible':'hidden'}}>请选择出资方</div>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>描述信息:</div>
                        <Input.TextArea
                            maxLength={200}
                            value={description}
                            disabled={typeModal===0}
                            autosize={{ minRows: 1}}
                            placeholder="描述信息"
                            onChange={this.onTicketDesChange}
                            className="ticket-configure-modal-input"/>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint"  style={{visibility:isEmptyDescription?'visible':'hidden'}}>请输入描述信息</div>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>使用渠道:</div>
                        <Radio.Group onChange={this.onUseChannelChange} value={use_channel} disabled={typeModal===0}>
                            <Radio value={'0'}>无限制</Radio>
                            <Radio value={'1'}>充值</Radio>
                            <Radio value={'2'}>消费</Radio>
                        </Radio.Group>
                    </div>
                    <div className="ticket-configure-modal-input-error-empty"/>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>优惠券类型:</div>
                        <Radio.Group onChange={this.onTicketTypeChange} value={type} disabled={typeModal===0}>
                            {/*<Radio value={'0'}>代金券</Radio>*/}
                            <Radio value={'1'}>满减券</Radio>
                            {/*<Radio value={'2'}>折扣券</Radio>*/}
                            {/*<Radio value={'3'}>代金券</Radio>*/}
                            <Radio value={'4'}>非油提货券</Radio>
                        </Radio.Group>
                    </div>
                    <div className="ticket-configure-modal-input-error-empty"/>
                </div>
                <div className="ticket-configure-modal-item">
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span >*</span>优惠方式:</div>
                        <Radio.Group onChange={this.onTicketChange} value={ticket_type}>
                            <Radio value={0}>优惠金额</Radio>
                            <Radio value={1}>折扣比例</Radio>
                        </Radio.Group>
                    </div>
                    <div className="ticket-configure-modal-input-error-empty"/>
                </div>
                <div className="ticket-configure-modal-item" style={{display:ticket_type===0?'flex':'none'}}>
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>优惠金额:</div>
                        <Input
                            maxLength={50}
                            value={discount_amount}
                            disabled={typeModal===0}
                            placeholder="优惠金额"
                            onChange={this.onTicketMoneyChange}
                            className="ticket-configure-modal-input"/>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint" style={{visibility:isEmptyDiscountAmount?'visible':'hidden'}}>请输入优惠金额,必须为数字</div>
                </div>
                <div className="ticket-configure-modal-item" style={{display:ticket_type===1?'flex':'none'}}>
                    <div className="ticket-configure-modal-input-box">
                        <div className="ticket-configure-modal-input-hint"><span>*</span>折扣比例:</div>
                        <Input
                            maxLength={50}
                            value={discount_ratio}
                            disabled={typeModal===0}
                            placeholder="折扣比例"
                            onChange={this.onTicketDiscountTatioChange}
                            className="ticket-configure-modal-input"/>
                    </div>
                    <div className="ticket-configure-modal-input-error-hint" style={{visibility:isEmptyDiscountRatio?'visible':'hidden'}}>请输入折扣比例，范围0-1</div>
                </div>
                {/*<Button type="dashed" onClick={this.add} className="ticket-configure-modal-input" style={{visibility:typeModal===0?'hidden':'visible'}}>*/}
                {/*    <Icon type="plus" /> 添加描述信息*/}
                {/*</Button>*/}
            </div>
        </Modal>)
    }
}

export default TicketConfigureModal;