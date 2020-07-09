import {trim} from "./trim";
export function isEmpty(str) {
    if (str===null|| str=== undefined){
        return true
    } else {
        const isEmptyString = trim(str.toString());
        if (isEmptyString.length===0){
            return true;
        } else {
            return false;
        }
    }
}