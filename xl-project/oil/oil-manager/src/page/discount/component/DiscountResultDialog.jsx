import React from 'react';
import {Modal,List} from 'antd';
import {inject,observer} from 'mobx-react';
import './DiscountDialog.scss';

@inject("discountStationStore")
@observer
class DiscountResultDialog extends React.Component{

    onOk=()=>{
        this.props.discountStationStore.setIsShowResultDialog(false);
    }

    onCancel=()=>{
        this.props.discountStationStore.setIsShowResultDialog(false);
    }

    render() {
        const {isShowResultDialog,failed_array} = this.props.discountStationStore;
        return(
            <Modal width={400}
                   okText="确定"
                   cancelText="取消" centered={true}
                   visible={isShowResultDialog}
                   title='添加结果'
                   onOk={this.onOk}
                   onCancel={this.onCancel}>
                <div className='discount-result-container'>
                    <div className='discount-result-hint'>有{failed_array.length}个油站添加失败</div>
                    <List
                        size="small"
                        style={{width:'100%'}}
                        bordered
                        dataSource={failed_array}
                        renderItem={item => <List.Item>{item.station_name}</List.Item>}
                    />
                </div>
            </Modal>
        )

    }
}
export default DiscountResultDialog;
