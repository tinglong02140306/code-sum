/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat){
	if(arguments.length === 0) {
		return null;
	}
	const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
	let date;
	if(typeof time === "object") {
		date = time;
	} else {
		if((typeof time === "string")) {
			if((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time);
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), "/");
			}
		}

		if((typeof time === "number") && (time.toString().length === 10)) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	};
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if(key === "a") {
			return ["日", "一", "二", "三", "四", "五", "六"][value];
		}
		return value.toString().padStart(2, "0");
	});
	return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option){
	if(("" + time).length === 10) {
		time = parseInt(time) * 1000;
	} else {
		time = +time;
	}
	const d = new Date(time);
	const now = Date.now();

	const diff = (now - d) / 1000;

	if(diff < 30) {
		return "刚刚";
	} else if(diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + "分钟前";
	} else if(diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + "小时前";
	} else if(diff < 3600 * 24 * 2) {
		return "1天前";
	}
	if(option) {
		return parseTime(time, option);
	} else {
		return (
			d.getMonth() +
			1 +
			"月" +
			d.getDate() +
			"日" +
			d.getHours() +
			"时" +
			d.getMinutes() +
			"分"
		);
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url){
	url = url == null ? window.location.href : url;
	const search = url.substring(url.lastIndexOf("?") + 1);
	const obj = {};
	const reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1);
		let val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str){
	// returns the byte length of an utf8 string
	let s = str.length;
	for(var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i);
		if(code > 0x7f && code <= 0x7ff) s++;
		else if(code > 0x7ff && code <= 0xffff) s += 2;
		if(code >= 0xDC00 && code <= 0xDFFF) i--;
	}
	return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual){
	const newArray = [];
	for(let i = 0; i < actual.length; i++) {
		if(actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json){
	if(!json) return "";
	return cleanArray(
		Object.keys(json).map(key => {
			if(json[key] === undefined) return "";
			return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
		})
	).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url){
	const search = url.split("?")[1];
	if(!search) {
		return {};
	}
	return JSON.parse(
		"{\"" +
		decodeURIComponent(search)
			.replace(/"/g, "\\\"")
			.replace(/&/g, "\",\"")
			.replace(/=/g, "\":\"")
			.replace(/\+/g, " ") +
		"\"}"
	);
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val){
	const div = document.createElement("div");
	div.innerHTML = val;
	return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source){
	if(typeof target !== "object") {
		target = {};
	}
	if(Array.isArray(source)) {
		return source.slice();
	}
	Object.keys(source).forEach(property => {
		const sourceProperty = source[property];
		if(typeof sourceProperty === "object") {
			target[property] = objectMerge(target[property], sourceProperty);
		} else {
			target[property] = sourceProperty;
		}
	});
	return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className){
	if(!element || !className) {
		return;
	}
	let classString = element.className;
	const nameIndex = classString.indexOf(className);
	if(nameIndex === -1) {
		classString += "" + className;
	} else {
		classString =
			classString.substr(0, nameIndex) +
			classString.substr(nameIndex + className.length);
	}
	element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type){
	if(type === "start") {
		return new Date().getTime() - 3600 * 1000 * 24 * 90;
	} else {
		return new Date(new Date().toDateString());
	}
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate){
	let timeout, args, context, timestamp, result;

	const later = function(){
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp;

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if(last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if(!immediate) {
				result = func.apply(context, args);
				if(!timeout) context = args = null;
			}
		}
	};

	return function(...args){
		context = this;
		timestamp = +new Date();
		const callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if(!timeout) timeout = setTimeout(later, wait);
		if(callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source){
	if(!source && typeof source !== "object") {
		throw new Error("error arguments", "deepClone");
	}
	const targetObj = source.constructor === Array ? [] : {};
	Object.keys(source).forEach(keys => {
		if(source[keys] && typeof source[keys] === "object") {
			targetObj[keys] = deepClone(source[keys]);
		} else {
			targetObj[keys] = source[keys];
		}
	});
	return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr){
	return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString(){
	const timestamp = +new Date() + "";
	const randomNum = parseInt((1 + Math.random()) * 65536) + "";
	return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls){
	return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls){
	if(!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls){
	if(hasClass(ele, cls)) {
		const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		ele.className = ele.className.replace(reg, " ");
	}
}

export function computeMonthRange(month = new Date().getMonth() + 1, year = new Date().getFullYear()){
	if(month == 0) {
		month = 12;
		year--;
	}
	const startDate = `${ year }-${ String(month).padStart(2, "0") }-01`;
	const lastTimeStamp = new Date(year, parseInt(month)).getTime() - 1;
	const endDate = `${ year }-${ String(month).padStart(2, "0") }-${ String(new Date(lastTimeStamp).getDate()).padStart(2, "0") }`;
	return {
		year,
		month: String(month).padStart(2, "0"),
		startDate,
		endDate
	};
}

export const getToday = () => {
	const now = new Date();
	return `${ now.getFullYear() }-${ String((now.getMonth() + 1)).padStart(2, "0") }-${ String(now.getDate()).padStart(2, "0") }`;
};


/* 转换省市区格式方法 */
function loadArea(areas){
	const provinces = Object.keys(areas.province_list);
	const cities = Object.keys(areas.city_list);
	const countries = Object.keys(areas.county_list);
	return provinces.map(province => {
		return {
			id: province,
			label: areas.province_list[province],
			children: cities.filter(item => item.substr(0, 2) === province.substr(0, 2)).map(city => {
				return {
					id: city,
					label: areas.city_list[city],
					children: countries.filter(item => item.substr(0, 4) === city.substr(0, 4)).map(country => {
						return {
							id: country,
							label: areas.county_list[country]
						};
					})
				};
			})
		};
	});
}

const countOccurrences = (arr, val, step) => arr.reduce((a, v) => (v.substr(0, step) === val.substr(0, step) ? a + 1 : a), 0);

const difference = (a, b) => {
	const s = new Set(b);
	return a.filter(x => !s.has(x));
};

export const formatArea = (arr) => {
	if(arr.includes("000000")) {
		return {
			code: "000000",
			all: "1"
		};
	}
	const level1 = Array.from(new Set(arr.slice().map(item => item.substr(0, 2) + "0000")));
	const level2 = Array.from(new Set(difference(arr.slice(), level1).map(item => item.substr(0, 4) + "00")));
	const level3 = Array.from(new Set(difference(arr.slice(), [...level1, ...level2])));
	let rootChildren = level1.map(item => eee(item, arr));
	const leafChildren = level2.map(item => eee(item, arr));
	leafChildren.filter(item => item.all === "0").forEach(item => {
		item.children = level3.filter(x => x.substr(0, 4) === item.code.substr(0, 4)).map(xx => eee(xx, arr));
	});
	rootChildren.filter(item => item.all === "0").forEach(item => {
		item.children = leafChildren.filter(x => x.code.substr(0, 2) === item.code.substr(0, 2)).map(xx => eee(xx, arr));
	});
	return {
		code: "000000",
		all: "0",
		children: rootChildren
	};
};

function eee(val, arr){
	if(typeof val === "object") {
		return val;
	}
	return arr.includes(val) ? {
		code: val,
		all: "1"
	} : {
		code: val,
		all: "0"
	};
}
