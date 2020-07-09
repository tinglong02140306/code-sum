/*
 * @Author: sunmingmao
 * @Date: 2020-04-13 08:05:12
 * @LastEditors: longting
 * @LastEditTime: 2020-05-20 09:55:21
 * @Description: 
 */
//所有支持的油品类型
export const oils = [
    {
        title:"92#",
        id:"92#"
    },{
        title:"0#", 
        id:"0#"
    },{
        title:"95#", 
        id:"95#"
    },{
        title:"98#", 
        id:"98#"
    }
];

//汽油
export const oil_gas = [
    {
        title:"92#",
        id:"92#"
    },{
        title:"95#", 
        id:"95#"
    },{
        title:"98#", 
        id:"98#"
    }
];

//柴油
export const oil_diesel = [
    {
        title:"0#", 
        id:"0#"
    }
]



export const sort = [
    {
        title:"距离最近", 
        id:1
    },{
        title:"油价最低", 
        id:2
    }
];

//所有支持的品牌
export const brands = [
    {
        title:"全部品牌", 
        id:'all'
    },{
        title:"中石油", 
        id:'cnpc'
    }, {
        title:"中石化", 
        id:'sinopec'
    },{
        title:"中海油", 
        id:'cnooc'
    }, {
        title:"壳牌", 
        id:'shell'
    }, {
        title:"中海能源", 
        id:'zhxny'
    }, {
        title:"山东高速", 
        id:'sdhs'
    }, {
        title:"其他", 
        id:'default'
    }
]

export const oil_filter_tabs = [
    {
        list:oils,
        default_id:oils[0].id,
        default_title:oils[0].title,
        style:1,
    },{
        list:sort,
        default_id:sort[0].id,
        default_title:sort[0].title,
        style:1
    },{
        list:brands,
        default_id:brands[0].id,
        default_title:brands[0].title,
        style:2
    }
]

export const clean_sort = [
    {
        title:"距离最近", 
        id:1
    },
    // {
    //     title:"价格最低",
    //     id:2
    // }
]

export const clean_enable = [
    {
        title:"全部位置",
        value:1,
        id:null
    },{
        title:"停车场内",
        value:2,
        id:true
    },
    {
        title:"停车场外",
        value:3,
        id:false
    }
]

export const clean_status = [
    {
        title:"全部状态",
        value:1,
        id:null
    },
    {
        title:"空闲",
        value:2,
        id:'1'
    },
    {
        title:"使用中",
        value:3,
        id:'2'
    },
    {
        title:"维护中",
        value:3,
        id:'3'
    }
]

export const clear_filter_tabs = [
    {
        list:clean_sort,
        default_id:clean_sort[0].id,
        default_title:clean_sort[0].title,
        style:1, 
    },{
        list:clean_enable,
        default_id:clean_enable[0].id,
        default_title:clean_enable[0].title,
        style:1, 
    },{
        list:clean_status,
        default_id:clean_status[0].id,
        default_title:clean_status[0].title,
        style:1, 
    }
]


export const oil_guns = [0,1,2,3,4,5,6,7,8,9,10,-1];
export const picker_guns = ["12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50"];
export const moneys = [100,200,300,400]