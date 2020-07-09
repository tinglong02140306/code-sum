/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 13:45:22
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-15 13:53:39
 * @Description: 
 */
import {SUPPORT_TYPE} from './constants';
import {BindEtcRight,NextIcon} from '../../assets/url/url';
import {trim} from '../../utils/util';
let isRight = true;

Component({
    properties:{
        value:{
            type:String,//代表text的值
            value:'',
            observer:function(newVal){
                this.setData({etc_num:newVal});
                const card_num = trim(newVal);
                this.dealCardType(card_num);
            }
        },
        input_disabled:{// true:代表text false:代表input
            type:Boolean,
            value:false
        }
    },
    data:{
        etc_num:"",//input的值
        etc_type:'',
        position:0,
        icon:BindEtcRight,
        next_icon:NextIcon
    },
    methods:{
        //点击事件 text 时有效
        onClick:function(){
            const {input_disabled} = this.data;
            if(input_disabled){
                this.triggerEvent('onclick');
            }
        },
        onInputClick:function(){
            this.setData({
                position:etc_num.length
            });
        },
        //用户输入监听
        onBindInput:function(e){
            let value = e.detail.value;
            const card_num = trim(value);
            this.dealCardType(card_num);
            this.triggerEvent('etcinput',value);
        },
        //ETC卡类型
        dealCardType:function(value) {
            if(value.length===20&&SUPPORT_TYPE){
                const province = value.substr(0,2);
                for(let i=0;i<SUPPORT_TYPE.length;i++){
                    const item = SUPPORT_TYPE[i];
                    if(item.province_code==province){
                        isRight = true;
                        this.setData({etc_type:item.name});
                        break;
                    }
                }
                if(!isRight){
                    wx.showToast({
                        title:"请输入正确的ETC卡号",
                        icon:"none"
                    });
                }
            }else{
                this.setData({etc_type:""});
            }
        }
    }
})