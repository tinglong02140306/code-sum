import {city} from '../../constants/city_key';
let cityArr=[];

const deepClone = (arr) => {
    let obj=arr.constructor===Array?[]:{};
　　for(let item in arr){
        if(typeof arr[item]==="object"){
            obj[item]=deepClone(arr[item]);
        }else{
            obj[item]=arr[item];
        }
    }
    return obj;
}

const dealData = (search,_city) => {
    for(let i=0; i<_city.length;i++){
        const item = _city[i];
        if(search==item.key){
            cityArr.push(item.title);
        }else{
            const children = item.children;
            if(children&&children.length){
                dealData(search,children);
            }
        }
    }
}


export const dealCityName = (_newIndex) => {
    let newIndex = deepClone(_newIndex);
    cityArr=[];
    for(let i=0; i<newIndex.length; i++){
        const seleteItem = newIndex[i];
        dealData(seleteItem,city);
    }
    return cityArr;
}

