// 解码车牌的辅助方法
import gbk_us from './gbk_code';

// 将byteArray转成GBK
function decode(hexstr) {
	// 没有考虑后面带汉字的
	hexstr = hexstr.toString()
	let province = gbk_us[hexstr.substr(0,4).toUpperCase()];
	let str = '';
	if(province) {
		hexstr = hexstr.substring(4);
		for(let i = 0 ;i < hexstr.length ; i += 2 ){
			str += String.fromCharCode(parseInt(hexstr.substr(i,2),16));
		}
		let vlp = province + str;
		return vlp.substring(0,vlp.length-4);
	}
	return "";
}

module.exports = {
	decode:decode
};
