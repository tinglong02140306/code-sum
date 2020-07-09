// 将接口分别放在不同的接口文件内  统一导出
import * as bill from './bill';
import * as sign from './sign';
import * as apply from './apply';
import * as deposit from './deposit';
import * as etc from './etc';
import * as company from './company';
import * as active from "./active";

export default {
	...bill,
	...sign,
	...apply,
	...deposit,
	...etc,
	...active,
	...company
};
