import ajax from "../utils/request.js";
// 购物车相关接口

// 购物车列表
export const cartList = data => {
    return ajax({
        url: "/xlk-shop/cart/list",
        method: "post",
        data
    });
};

// 购物车添加商品
export const cartAddproduct = data => {
    return ajax({
        url: "/xlk-shop/cart/add",
        method: "post",
        data
    });
};
// 购物车删除商品
export const cartDelProduct = data => {
    return ajax({
        url: "/xlk-shop/cart/delete",
        method: "post",
        data
    });
};

// 购物车修改商品
export const cartUpdateProduct = data => {
    return ajax({
        url: "/xlk-shop/cart/update",
        method: "post",
        data
    });
};
