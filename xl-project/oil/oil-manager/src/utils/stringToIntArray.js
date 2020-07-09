export function stringToIntArray(array) {
    let arrayData=[];
    for (let i = 0; i < array.length; i++) {
        arrayData.push(parseInt(array[i]));
    }
    return arrayData;
}