import React,{useState,useEffect} from 'react';
import {DatePicker} from 'antd';
import './Footer.scss';


const Footer = () => {
    return <div className="wx-recharge-footer">
        <div className="wx-recharge-footer-bottom">
            <p className="wx-recharge-footer-text">部门分管领导：</p> 
            <p className="wx-recharge-footer-text">部门负责人：</p>
            <p className="wx-recharge-footer-text">复核：</p>
            <p className="wx-recharge-footer-text">制表：</p>
            <p className="wx-recharge-footer-text">制表日期：</p>
        </div>
    </div>
}

export default Footer;