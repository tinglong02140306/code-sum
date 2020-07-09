export function getRole(role_id_array,roleList) {
    let stringRole = "";
    let roleArray = [];
    for (let key in role_id_array){
        roleArray.push(role_id_array[key]);
    }
    for (let j = 0; j < roleArray.length; j++) {
        for (let k = 0; k < roleList[0].children.length; k++) {
            if (roleArray[j]===roleList[0].children[k].key){
                stringRole = stringRole+","+roleList[0].children[k].title;
            }
        }
    }

    return stringRole.substring(1,stringRole.length);
}