import {isEmpty} from "./isEmpty";
import {trim} from "./trim";
export function isRange(string) {
    const reg = /^(0(\.\d{1,2})|1(\.0{1,2})?)$/;
    const num = Number(trim(string));
    if (isEmpty(string)) {
        return false;
    }else {
        if (num){
            if (reg.test(num)){
                return true
            } else {
                return false
            }
        } else {
            return false;
        }
    }
}