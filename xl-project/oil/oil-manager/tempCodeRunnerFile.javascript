Date.prototype.format = function(fmt){ 
    const o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(let k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}   

/**
 * 将时间字符串转为指定格式的时间
 * @param date 需要转换的时间
 * @param format 转换格式  yyyy:年 MM:月 dd:日  hh:日 mm:时 ss:秒
 */
const formDate = (dateStr,formatStr) =>{
    const dateObj = new Date(dateStr||null);
    return dateObj.format(formatStr)
}

console.log(formDate('str','yyyy-MM-dd hh:mm:ss'));
















