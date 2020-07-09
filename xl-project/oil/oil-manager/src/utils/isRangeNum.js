import {isNumber} from "./isNumber";

export function isRangeNum(string,range) {
    const num = Number(string);
    if (isNumber(string)){
        if (num>range){
            return false
        } else {
            return true
        }
    } else {
        return false;
    }
}