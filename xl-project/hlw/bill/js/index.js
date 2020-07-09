
var tabSwiper,
    currIndex = 0,
    mescroll,
    // cpageArr = [1, 1, 1, 1], // 4个tab对应的页数
    pageSize = 10,  // 每页加载的条数
    tabTop = $('.tab-content').offset().top,
    tabFixedFlag = false,
    cardNo = '', // 卡号
    date = '', // 日期
    curPageNum = 0,
    pickSelectIndex = 0;
// rule = [{
//     'key': 'cardNo',
//     'title': '卡号',
//     'required': true,
//     'pattern': /^\d{14}$/
// }];
// 方法处理
var handleEvent = {
    // 高度调整
    adjustHeight: function () {
        // adjustHeight: function() {
        /*调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值)*/
        var minHight;
        setTimeout(function () {
            if (tabFixedFlag) {
                minHight = mescroll.getClientHeight() - $("#tabWrap").height();
            } else {
                minHight = mescroll.getClientHeight() - $("#tabWrap").offset().top - $("#tabWrap").height();
            }
            document.getElementById("upscrollWarp").style.minHeight = minHight + "px";
        })
    },
    // 请求参数验证
    checkSearchParams: function () {
        var pattern = /^\d{14}$/,
            result = true;
        cardNo = $('#cardNo').val();
        if (!cardNo || cardNo.length == 0 || !pattern.test(cardNo)) {
            util.toastHtml('请输入正确的卡号', '', '', '');
            return false;
        }
        if (!date) {
            util.toastHtml('请选择账期', '', '', '');
            return false;
        }
        return true;
    },
    // 查询点击事件
    searchEvent: function () {
        if (!handleEvent.checkSearchParams()) {
            return;
        }
        var param = {
            card_no: card_no,
            bill_peroid: bill_peroid,
            page_no: page_no,
            page_size: page_size,
            status: 0
        }
        // 0-未处理； 3-支付失败；4-支付成功  全部 ： null

        // 账单状态 0-未处理；1-已处理；2-支付中；3-支付失败；4-支付成功
        // 列表数据请求
        requestEvent.getListData(param);
    },
    // tab点击事件
    tabSwitchClick: function (e) {
        var self = $(this),
            index = self.data().index;
        currIndex = index;
        self.addClass('tab-active').siblings().removeClass('tab-active');
        // 高度调整
        handleEvent.adjustHeight()
        mescroll.resetUpScroll()
    },
    // 查看订单失败原因
    viewFailRsonClick: function (e) {
        var self = $(this),
            state = self.attr('data-state');
        if (state == 0) {
            self.removeClass('icon-down').addClass('icon-up');
            self.attr('data-state', 1);
            self.siblings().removeClass('hide');
        } else if (state == 1) {
            self.removeClass('icon-up').addClass('icon-down');
            self.attr('data-state', 0)
            self.siblings().addClass('hide');
        }
    },
    // picker组件初始化
    initDatePicker: function () {
        var picker = new Picker(document.querySelector('.time'), {
            controls: false,
            format: 'YYYY-MM',
            headers: false,
            inline: true,  // 是否从手机低端弹出
            text: {
                title: '选择日期时间',
                cancel: '取消',
                confirm: '确认',
            },
            pick(options) {
                // 2019-11
                date = picker.getDate(true);
            }
        });
    },

    // 卡号
    pickerEvent: function () {
        var cardNoPicker = new Picker({
            data: [array],
            selectedIndex: [pickSelectIndex],
            title: '卡号'

        });
        cardNoPicker.on('picker.select', function (selectedVal, selectedIndex) {
        });

        cardNoPicker.on('picker.change', function (e, index, selectIndex) {
            if (OS == 'Android') {
                var num = 3.4 + index * 0.025;
                $('.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll').css('marginTop', num + 'rem');
            }
        });

        $('.wrap').on('click', "#picker", function () {
            cardNoPicker.show();
        });

    },
    // 获取数据
    // getTabData: function () {
    //     currIndex = $('#swiperContainer .swiper-slide-active').data().index;
    //     $('.tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active');
    // },
    /**
     * 加载当前滚动条
     */
    renderScroll: function () {
        // mescroll.endByPage(data.rows.length, data.totalPageCount);
        // mescroll.endSuccess();
        // mescroll.endErr();
        // mescroll.lockUpScroll(true)  锁住上拉加载
        // mescroll.triggerUpScroll() 主动触发上拉加载
        //重置列表数据
        // mescroll.resetUpScroll();
        mescroll = new MeScroll('wrapper', {
            down: {
                use: false,
            },
            up: { // 上拉配置
                noMoreSize: 15,
                isBounce: false, //此处禁止ios回弹
                htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                warpId: "upscrollWarp", // 让上拉进度装到upscrollWarp里面
                callback: function (page, mescroll) {
                    // cpageArr[currIndex] = page.num;
                    curPageNum = page.num;
                    // 请求资讯列表
                    // requestEvent.getTestData();
                    getListData(page);
                    // setTimeout(() => {
                    //     tabSwitchFlag = false;
                    // });

                },
                lazyLoad: {
                    use: true // 是否开启懒加载,默认false
                },
                page: {
                    size: pageSize
                },
                onScroll: function (mescroll, y, isUp) {
                    console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ", tabTop = " + tabTop + 'mescroll.getClientHeight():::' + mescroll.getClientHeight());
                    // if(tabSwitchFlag) return;
                    // scrollTopVal[currIndex] = y;
                    if (y >= tabTop) {
                        tabFixedFlag = true;
                        if (util.phoneOs == 'IOS') {
                            $('.tab-content').addClass("tab-sticky");
                        } else {
                            $('.tab-content').addClass("tab-fixed");
                        }
                        // $('.bill-search-wrap').addClass('hide')
                    } else {
                        tabFixedFlag = false;
                        if (util.phoneOs == 'IOS') {
                            $('.tab-content').removeClass("tab-sticky");
                        } else {
                            $('.tab-content').removeClass("tab-fixed");
                        }
                    }

                }
            }
        });
    },
    
    // 支付宝登录
    loginAlipay: function () {

    }
},
    addEvent = function () {
        var $this = $('.wrap');
        // 查询按钮点击事件

        $this.off('.btn-wrap span').on('click', '.btn-wrap span', handleEvent.searchEvent);
        // 头部tab点击事件
        $this.off('.tab-wrap .tab-item').on('click', '.tab-wrap .tab-item', handleEvent.tabSwitchClick);

        // 失败原因点击事件
        $this.off('.swiper-list-wrap .fail-detail .icon').on('click', '.swiper-list-wrap .fail-detail .icon', handleEvent.viewFailRsonClick);
    },
    // 数据请求
    requestEvent = {

        // 获取暂无数据Dom结构
        getEmptyPageDom: function () {
            return `<div class="empty-wrap">
                        <div class="content">
                            <span class="icon-empty"></span>
                            <p class="notice-wrap">
                                <span class="f34 c3b4">暂无账单</span>
                                <span class="f28 c3b4">您还没有通行账单可显示~</span>
                            </p>
                        </div>
                    </div>`
        },
        // 列表数据请求
        getListData: function (param) {
            util.ajaxRequest('../res/pdlist1.json', param, 'GET', function (res) {
                // console.log(res)
                // 当前页个数 ： rows.length  当前页总数：totalPageCount
                // mescroll.endByPage(rows.length, totalPageCount);
                if (res.length() == 0) {

                } else {
                    renderEvent.renderListData(res)
                }
            }, function (res) {
                mescroll.endErr();
            }, function (xhr, status) {
                mescroll.endSuccess();
            })
        }
    },
    // 渲染数据
    renderEvent = {
        renderListData: function (data) {
            var listDom = $("#listWrap"),
                $html = ``;
            if (curPageNum == 1) {  // 当页数为第一页时
                listDom.empty()
            }
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    $html += `<div class="list-item">
                            <div class="state-wrap">
                                <p class="state ${data[i].dealState == 0 ? '' : (data[i].dealState == 1 ? "fail-state" : "success-state")} ">
                                    <span>${data[i].dealState == 0 ? '' : (data[i].dealState == 1 ? "支付失败" : "支付成功")}</span>
                                </p>
                            </div>
                            
                            <div class="content">
                                <div class="left-content">
                                    <p class="start-wrap">
                                        <span class="start-point font f28">${data[i].startPoint}</span>
                                        <span class="start-time font f26">${data[i].endTime}</span>
                                    </p>
                                    <span class="icon-direct"></span>
                                    <p class="end-wrap">
                                        <span class="end-point font f28">${data[i].endPoint}</span>
                                        <span class="end-time font f26">${data[i].endTime}</span>
                                    </p>
                                </div>
                                <div class="right-content">
                                    <p class="pay-money font f28">${data[i].payMoney}</p>
                                    <p class="pay-time f26">${data[i].payTime}</p>
                                </div>
                                <!-- 失败原因 -->
                                <p class="fail-detail ${data[i].dealState == 1 ? '' : 'hide'}"> 
                                    <span class="fail-reason font f28 hide">${data[i].failReson}</span>
                                    <span class="icon icon-down" data-state="0"></span>
                                </p>
                            </div>
                        </div>`
                }
            }
            // else {
            //     $html += requestEvent.getEmptyPageDom()

            // }
            listDom.append($html)
        },
        // 渲染无数据页面
        renderEmptyPage: function () {
            var $html = requestEvent.getEmptyPageDom();
            $('#listWrap').empty().append($html)
        }
    };

; (function () {
    var arr = [{
        text: '9999999',
        value: 0
    }, {
        text: '88888888',
        value: 1
    }]
    handleEvent.pickerEvent(arr)
    // 银行卡小于14位
    addEvent();
    // handleEvent.initDatePicker()
    handleEvent.renderScroll()
    mescroll.triggerUpScroll()
})()








/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page) {
    //联网加载数据
    getListDataFromNet(page.num, page.size, function (curPageData) {
        mescroll.endSuccess(curPageData.length);
        //设置列表数据
        setListData(curPageData);
    }, function () {
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
    });
}

/*设置列表数据*/
function setListData(curPageData) {
    var listDom = document.getElementById("listWrap"),
        data = curPageData,
        $html = ``;
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            $html += `<div class="list-item">
                            <div class="state-wrap">
                                <p class="state ${data[i].dealState == 0 ? '' : (data[i].dealState == 1 ? "fail-state" : "success-state")} ">
                                    <span>${data[i].dealState == 0 ? '' : (data[i].dealState == 1 ? "支付失败" : "支付成功")}</span>
                                </p>
                            </div>
                            
                            <div class="content">
                                <div class="left-content">
                                    <p class="start-wrap">
                                        <span class="start-point font f28">${data[i].startPoint}</span>
                                        <span class="start-time font f26">${data[i].endTime}</span>
                                    </p>
                                    <span class="icon-direct"></span>
                                    <p class="end-wrap">
                                        <span class="end-point font f28">${data[i].endPoint}</span>
                                        <span class="end-time font f26">${data[i].endTime}</span>
                                    </p>
                                </div>
                                <div class="right-content">
                                    <p class="pay-money font f28">${data[i].payMoney}</p>
                                    <p class="pay-time f26">${data[i].payTime}</p>
                                </div>
                                <!-- 失败原因 -->
                                <p class="fail-detail ${data[i].dealState == 1 ? '' : 'hide'}"> 
                                    <span class="fail-reason font f28 hide">${data[i].failReson}</span>
                                    <span class="icon icon-down" data-state="0"></span>
                                </p>
                            </div>
                        </div>`
        }
    } else {
        if (currIndex != 0) {
            $html += requestEvent.getEmptyPageDom()
        }


    }
    if (curPageNum == 1) {
        $(listDom).empty()
    }
    $(listDom).append($html)

}

/*联网加载列表数据
在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
实际项目以您服务器接口返回的数据为准,无需本地处理分页.
* */
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: '../res/pdlist1.json',
            //		                url: '../res/pdlist1.json?pdType='+pdType+'&num='+pageNum+'&size='+pageSize,
            dataType: 'json',
            success: function (data) {
                console.log("data:::" + data.length)
                console.log("pageNum:::" + pageNum)
                var listData = [];

                //currIndex 全部0; 未支付1; 支付失败2  支付成功3;
                if (currIndex == 0) {
                    //全部
                    for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
                        if (i == data.length) break;
                        listData.push(data[i]);
                    }

                }
                // else if (currIndex == 1) {
                //     //未支付
                //     for (var i = 0; i < data.length; i++) {
                //         if (data[i].dealState == 0) {
                //             listData.push(data[i]);
                //         }
                //     }

                // } else if (currIndex == 2) {
                //     //支付失败
                //     for (var i = 0; i < data.length; i++) {
                //         if (data[i].dealState == 1) {
                //             listData.push(data[i]);
                //         }
                //     }
                // } else if(currIndex == 3) {
                //     for (var i = 0; i < data.length; i++) {
                //         if (data[i].dealState == 2) {
                //             listData.push(data[i]);
                //         }
                //     }

                // }

                //回调
                successCallback(listData);
                console.log('currIndex:' + currIndex)
                console.log(listData.length)
            },
            error: errorCallback
        });
    }, 500)
}

