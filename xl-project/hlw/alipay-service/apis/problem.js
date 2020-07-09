import { ajax } from "../utils/request.js";

// 问题列表
export const problemList = data => {
    return ajax({
        url: '/wx/95011mp/kbms/list',
        method: 'post',
        data
    })
};
// 问题详情
export const problemDetail = data => {
    return ajax({
        url: '/wx/95011mp/kbms/question/click',
        method: 'post',
        data
    })
};
// 问题评价
export const problemEval = data => {
    return ajax({
        url: '/wx/95011mp/kbms/question/eval',
        method: 'post',
        data
    })
};

// 问题评价状态查询
export const problemEvalQuery = data => {
    return ajax({
        url: '/wx/95011mp/kbms/question/eval/query',
        method: 'post',
        data
    })
};