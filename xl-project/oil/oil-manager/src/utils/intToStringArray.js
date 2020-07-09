export function intToStringArray(array) {
    let arrayData=[];
    for (let i = 0; i < array.length; i++) {
        arrayData.push((array[i]).toString());
    }
    return arrayData;
}