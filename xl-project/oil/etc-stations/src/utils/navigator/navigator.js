
const navigatorToMap = (latitude,longitude,name,address) => {
    const href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:'+latitude+','+longitude+';title:'+name+';addr:'+address
    console.log(href);
    
    window.location.href= href
}

export default navigatorToMap