/**
 * @author tinglong
 * @time 2018-01-11
 * @description 挪车记录
 */
'use strict';

var CPAGE = 1,
    mescroll,
    getNewsIndex = 1,
    platForm = util.checkMobilePlatform(),
    vm = window.vm = fly.observable({
        // 返回事件
        back: function() {
            window.history.back(-1);
        }
    }),
    renderEvent = {
        /**
         * 加载当前滚动条
         */
        renderScroll: function() {
            mescroll = window.mescroll = new MeScroll('wrapper', {
                down: {
                    use: false
                },
                up: { // 上拉配置
                    noMoreSize: 20,
                    htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                    callback: function(page, mescroll) {

                        CPAGE = page.num;  // 当前页

                        // 请求数据
                        requestEvent.getCarRecordData(page);
                    },
                    page: {
                        size: 20
                    }
                }
            });
        },

        /*渲染挪车记录*/
        renderCarRecord: function(data) {

            // 模板数据渲染
            if(CPAGE == 1) {
                $(".analysis-list").empty();
            }
            var tmpl = fly.template('carRecordTempl', data);
            $(".car-list").append(tmpl);
        }
    },

    requestEvent = {
        /*挪车记录数据获取*/
        getCarRecordData: function(page) {
            if(platForm) {
                util.mask(true);
            }else {
                util.maskHtml(true, '');
            }
            util.ajaxRequest(CONTEXTPATH + '/apply/record', {
                    currentPageNo: page.num,
                    pageSize: 20
                }, function(res) {
                    if(platForm) {
                        util.mask(false);
                    }else {
                        util.maskHtml(false, '');
                    }
                    var data = res.data;
                    if(res.flag) {
                        if(data && data.rows && data.rows.length) {
                            /*=============时间格式转换=================start*/
                            var nowDate = new Date(),
                                nowYear = nowDate.getFullYear(),  // 当前年
                                nowMonth = nowDate.getMonth() + 1,   // 当前月
                                nowhDay = nowDate.getDate();   // 当前日
                            for(var i = 0; i < data.rows.length; i++) {

                                // 挪车状态文本值更改
                                if(data.rows[i].status == 2) {  // 成功 2 、失败3  、4待评价 、1待挪车
                                    data.rows[i].statusMc = '挪车成功';
                                }else if(data.rows[i].status == 3) {
                                    data.rows[i].statusMc = '挪车失败';
                                }

                                // 2017-09-06 12:34  后台返回时间格式为ms级别的
                                var dates = util.dateFormatMs(data.rows[i].applyTime).substring(0, 16),
                                    passYear = dates.substring(0, 4),
                                    passMonth = dates.substring(5, 7),
                                    passDay = dates.substring(8, 10);
                                    
                                    if(nowYear == passYear) {
                                        var monEqual = (nowMonth == passMonth),
                                            dayEqual = (nowhDay == passDay),
                                            dayEqualSub = ((parseInt(nowhDay) -1) == passDay);

                                        if(monEqual && dayEqual) {
                                            data.rows[i].applyTime = '今天&nbsp;&nbsp;' + dates.split(' ')[1];
                                        }else if(monEqual && dayEqualSub) {
                                            data.rows[i].applyTime = '昨天&nbsp;&nbsp;' + dates.split(' ')[1];
                                        }else {
                                            data.rows[i].applyTime = dates.substring(5,16);  // xx-xx xx:xx
                                        }
                                    }else {
                                        data.rows[i].applyTime = dates;

                                    }
                            }
                            /*=============时间格式转换=================end*/

                            $('.content-wrap').removeClass('hide');
                            $('.empty').addClass('hide'); 
                            mescroll.endByPage(data.rows.length, data.totalPageCount);

                            // 渲染挪车记录
                            renderEvent.renderCarRecord(data.rows);
                        }else {
                            $('.content-wrap').addClass('hide');
                            $('.empty').removeClass('hide');
                            mescroll.endSuccess();
                        } 
                    }

                }, function(res) {
                    if(platForm) {
                        util.mask(false);
                    }else {
                        util.maskHtml(false, '');
                    }
                    mescroll.endErr();

                });
        }
    },
    eventHandle = {
        /*挪车记录详情*/
        carDetailEvent: function(e) {
            var self = $(e.currentTarget),
                id = self.data().id;  
            window.location.href = CONTEXTPATH + '/h5/remove-car-details?id=' + id; // 详情页面 
        }
    };

    var addEvent = function() {
        var $this = $('.wrap');
        // 催一催按钮点击事件
        $this.off('.car-item').on('click', '.car-item', eventHandle.carDetailEvent);
    };
        

$(function() {
    fly.bind(document.body, vm);
    addEvent();
    renderEvent.renderScroll();
    mescroll.triggerUpScroll();                                     
});