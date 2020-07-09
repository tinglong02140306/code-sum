
  
/**
 * 转化时间格式
 * @param {*} time  2018-02-01 12:05:10 转为  2018-02-01
 */
export const formatTime = time => {
    const reg = /^(\d{4})-(\d{1,2})-(\d{1,2}).*/;
    const result = reg.test(time);
    return result?time.replace(reg,"$1-$2-$3"):""
}

/**
 * 保留小数点后两位，不够补零
 * @param {} num 
 */
export const keepTwoDecimalFull = (num) => {
  let result = parseFloat(num);
  if(isNaN(result)) {
    return false;
  }
  result = Math.round(num * 100) / 100;
  let s_x = result.toString();
  let pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
 }

 /**
 * 保留小数点后一位，不够补零
 * @param {} num 
 */
export const keepOneDecimalFull = (num) => {
  let result = parseFloat(num);
  if(isNaN(result)) {
    return false;
  }
  result = Math.round(num * 10) / 10;
  let s_x = result.toString();
  let pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 1) {
    s_x += '0';
  }
  return s_x;
 }

 



  

