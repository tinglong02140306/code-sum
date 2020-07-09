/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 13:45:22
 * @LastEditors: longting
 * @LastEditTime: 2020-04-15 13:53:39
 * @Description: 
 */
import { SUPPORT_TYPE } from './constants';
import { BindEtcRight, NextIcon } from '../../assets/url/url';
import { trim } from '../../utils/util';
import { showLoading, hideLoading, showToast } from "../../utils/my";
let isRight = true;

Component({
    props: {
        //代表text的值
        value: "",
        // true:代表text false:代表input
        input_disabled: false
    },
    data: {
        etc_type: '',
        position: 0,
        icon: BindEtcRight,
        next_icon: NextIcon
    },
    methods: {
        //用户输入监听
        onBindInput(e) {
            let value = e.detail.value;
            const card_num = trim(value);
            this.dealCardType(card_num);
            this.props.onETCChange(value)
        },
        //ETC卡类型
        dealCardType(value) {
            if (value.length === 20 && SUPPORT_TYPE) {
                const province = value.substr(0, 2);
                for (let i = 0; i < SUPPORT_TYPE.length; i++) {
                    const item = SUPPORT_TYPE[i];
                    if (item.province_code == province) {
                        isRight = true;
                        this.setData({
                            etc_type: item.name
                        });
                        break;
                    }
                }
                if (!isRight) {
                    showToast("请输入正确的ETC卡号");
                }
            } else {
                this.setData({
                    etc_type: ""
                });
            }
        }
    }
})