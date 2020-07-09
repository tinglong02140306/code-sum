import {getRole} from "./getRole";
export function addKeyId(dataSource,roleList) {
    let array = [];
    array = dataSource;
    for (let i = 0; i < array.length; i++) {
        array[i].key = array[i].id;
        array[i].role = getRole(array[i].role_id_array,roleList)
    }
    return array;

}