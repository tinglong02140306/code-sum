// import {checkAddressCode} from "./checkAddressCode";
// import {isValidOrgCode} from "./isValidOrgCode";
import {isEmpty} from "./isEmpty";
import {isSpecialChart} from "./isSpecialChart";
export function isRightTax(taxpayerId) {
    if (isSpecialChart(taxpayerId)){
        return false;
    } else {
        if (!isEmpty(taxpayerId)){
            if (taxpayerId.length>20) {
                return false;
            }else {
                return true;
            }
        } else {
            return false;
        }
    }
    // if (taxpayerId !== "" && taxpayerId.length === 15) {
    //     let addressCode = taxpayerId.substring(0, 6);
    //     // 校验地址码
    //     let check = checkAddressCode(addressCode);
    //     if (!check) {
    //         return false;
    //     }
    //     // 校验组织机构代码
    //     let orgCode = taxpayerId.substring(6, 9);
    //     check = isValidOrgCode(orgCode);
    //     if (!check) {
    //         return false;
    //     }
    //     return true;
    // } else {
    //     return false;
    // }
}



