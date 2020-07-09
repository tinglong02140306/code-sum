import {getRole} from "./getRole";
export function addKeyIdPermission(dataSource,permissionList,pagesList) {
    let array = [];
    array = dataSource;
    for (let i = 0; i < array.length; i++) {
        array[i].key = array[i].id;
        array[i].permission = getRole(array[i].permission_id_array,permissionList)
    }
    for (let i = 0; i < array.length; i++) {
        array[i].key = array[i].id;
        array[i].pages = getRole(array[i].page_id_array,pagesList)
    }
    return array;

}