// 将接口再统一导出
import * as home from './home';
import * as product from './product';
import * as cart from './cart';
import * as mine from './mine';
import * as order from './order';
export default {
    ...home,
    ...cart,
    ...product,
    ...mine,
    ...order
};