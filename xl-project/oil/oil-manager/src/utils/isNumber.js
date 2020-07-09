import {isEmpty} from "./isEmpty";
export function isNumber(string) {
    if (isEmpty(string)) {
        return false;
    }else {
        return Number(string);
    }
}