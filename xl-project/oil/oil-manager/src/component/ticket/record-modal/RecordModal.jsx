import React from 'react';
import './RecordModal.scss';
import {Modal} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("ticketRecodeStore")
@observer
class RecordModal extends React.Component{
    render(){
        const {isShowModal} = this.props.ticketRecodeStore;
        return(
            <Modal
                title="Basic Modal"
                visible={isShowModal}>
                <div>
hhhh
                </div>
            </Modal>
        );
    }
}