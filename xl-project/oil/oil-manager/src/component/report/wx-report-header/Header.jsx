import React from 'react';
import {DatePicker} from 'antd';
import './Header.scss';
const {RangePicker} = DatePicker;

const Header = (params,onPickerChange) => {

    const onRangePickerChange=(dates, dateStrings)=>{
      onPickerChange(dates, dateStrings);
    }
    
    return <div className="wx-recharge-header">
        <p className="wx-recharge-header-text">制表单位：加油事业部</p>
        <div className="wx-recharge-header-date">
            <p className="wx-recharge-header-text">所属日期：</p>
            <RangePicker 
                style={{width:200}}
                format="YYYY-MM-DD"
                value={params}
                onChange={onRangePickerChange}/>
        </div>
        <p className="wx-recharge-header-text">单位：元</p>
    </div>
}

export default Header;