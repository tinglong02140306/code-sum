import React from 'react';
import {Select} from 'antd';
import {observer, inject} from 'mobx-react';

@inject("organization")
@observer
class OrganizationSelect extends React.Component {

    render() {
        const {partnerList} = this.props.organization;
        return (<div>
            <Select defaultValue={partnerList[0].partner_id} style={{width: 230}}>
                {partnerList.map((number) =>
                    <Select.Option value={number.partner_id}>{number.partner_id}</Select.Option>
                )}
            </Select>
        </div>);
    }
}

export default OrganizationSelect;