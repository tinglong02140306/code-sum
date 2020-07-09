import ajax from "../utils/request.js";
// 商品相关接口

// 商品列表接口
export const productList = data => {
    return ajax({
        url: "/xlk-shop/product/list",
        method: "post",
        data
    });
};

// 商品详情
export const productDetail = data => {
    return ajax({
        url: "/xlk-shop/product/detail",
        method: "post",
        data
    });
};

// 店铺信息
export const shopInfo = data => {
    return ajax({
        url: "/xlk-shop/product/shop/info",
        method: "post",
        data
    });
};

// 评论列表接口
export const commentList = data => {
    return ajax({
        url: "/xlk-shop/product/comment/list",
        method: "post",
        data
    });
};
// 我的评价列表
export const myCommentList = data => {
    return ajax({
        url: "/xlk-shop/my/comment/list",
        method: "post",
        data
    });
};