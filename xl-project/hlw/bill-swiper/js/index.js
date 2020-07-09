
var tabSwiper,
    currIndex = 0,
    mescroll,
    cpageArr = [1, 1, 1, 1], // 4个tab对应的页码
    tabRequestFlag = [false, false, false, false],  // 4个tab是否请求过数据
    pageSize = 10,  // 每页加载的条数
    tabTop = $('.tab-content').offset().top,
    tabFixedFlag = false,
    cardNo = '', // 卡号
    billPeroid = '', // 日期
    scrollZeroFlag = true,
    token = '9976586756456',
    curPageNum = 0;
// 方法处理
var handleEvent = {
    // 设置tab 初始值
    addFocusStyle: function () {
        setTimeout(function () {
            $('.swiper-pagination .tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active');
        }, 300)
    },
    // 高度调整
    adjustHeight: function () {
        console.log('enter adjustHeight')
        handleEvent.addFocusStyle()
        /*调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值)*/
        var minHeight;
        setTimeout(function () {
            if (tabFixedFlag) {
                minHeight = mescroll.getClientHeight() - $("#tabWrap").height();  
            } else {
                minHeight = mescroll.getClientHeight() - $("#tabWrap").height() - $("#tabWrap").offset().top;
            }
            // 防止抖动 下滑
            $('.swiper-wrapper .swiper-slide').eq(currIndex).css('minHeight', minHeight + 'px');
            // 防止滑动
            $('.swiper-wrapper .swiper-slide').eq(currIndex).css('height', 'auto').siblings().css('height', minHeight + 'px');
            // 当滚动为0 时 重置当前slide的高度  受其它兄弟元素影响
            if (scrollZeroFlag) {
                console.log('currIndex-------' + currIndex)
                var height = $('#listWrap' + currIndex).height();
                
                $('.swiper-wrapper .swiper-slide').eq(currIndex).css('height', 'auto').siblings().css('height', height > minHeight ? minHeight : height);
            }
        })
    },
    // 请求参数验证
    // checkSearchParams: function () {
    //     var pattern = /^\d{14}$/,
    //         result = true;
    //     cardNo = $('#cardNo').val();
    //     if (!cardNo || cardNo.length == 0 || !pattern.test(cardNo)) {
    //         util.toastHtml('请输入正确的卡号', '', '', '');
    //         return false;
    //     }
    //     if (!date) {
    //         util.toastHtml('请选择账期', '', '', '');
    //         return false;
    //     }
    //     return true;
    // },
    // 查询点击事件
    searchEvent: function () {
        mescroll.resetUpScroll()
        // currIndex = 0;
        // mescroll.optUp.page.num = cpageArr[currIndex] = ;
        // requestEvent.getListData(param);
        // if (!handleEvent.checkSearchParams()) {
        //     return;
        // }
        // 账单状态 0-未处理；1-已处理；2-支付中；3-支付失败；4-支付成功
        // 列表数据请求
        
    },
    // tab点击事件
    tabSwitchClick: function (e) {
        var self = $(this),
            index = self.data().index;
        currIndex = index;
        self.addClass('tab-active').siblings().removeClass('tab-active');
        swiper.slideTo(currIndex);
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
    // 初始化swiper
    initSwiper: function () {
        swiper = new Swiper("#swiperContainer", {
            direction: "horizontal",/*横向滑动*/
            // loop: true,/*形成环路（即：可以从最后一张图跳转到第一张图*/
            pagination: ".swiper-pagination",/*分页器*/
            // autoplay: 3000,/*每隔3秒自动播放*/
            paginationBulletRender: function (index, className) {
                var name = '';
                switch (index) {
                    case 0:
                        name = '全部';
                        break;
                    case 1:
                        name = '未支付';
                        break;
                    case 2:
                        name = '支付成功';
                        break;
                    case 3:
                        name = '支付失败';
                        break;
                    default:
                        name = '';
                }
                var className = '';
                return `<div class="tab-item" data-index="${index}" ><span>${name}</span></div>`;
            },
            onInit: function (swiper) {
                handleEvent.addFocusStyle()
            },
            onTransitionEnd: function (swiper) {
                currIndex = swiper.activeIndex;//轮播切换完毕的事件
                // 高度调整
                handleEvent.adjustHeight()
                // mescroll.resetUpScroll()
                // changePage();
                if(!tabRequestFlag[currIndex]) {
                    mescroll.optUp.page.num = cpageArr[currIndex];
                    mescroll.triggerUpScroll()
                    // requestEvent.getListData();
                    tabRequestFlag[currIndex] = true;
                }
                
            }
        })
    },
    // picker组件初始化
    initDatePicker: function () {
        var picker = new Picker(document.querySelector('.time'), {
            controls: false,
            date: null,
            format: 'YYYY-MM',
            headers: false,
            endDate: new Date(),
            Default: new Date(),
            inline: true,  // 是否从手机低端弹出
            text: {
                title: '选择日期时间',
                cancel: '取消',
                confirm: '确认',
            },
            
            pick(options) {
                // 2019-11
                billPeroid = picker.getDate(true);
            }
        });
        // 设置默认值
        billPeroid = new Date().getFullYear() + '-' + new Date().getMonth();
        $('#time').val(billPeroid);
    },

    // 登录
    login: function() {
        token = localStorage.getItem('token') || null;
		if (!token) {
			requestEvent.getAuth();
		} else {
			handleEvent.init()
		}
    },
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
                    console.log('page.num::'+ page.num)
                    // 真实
                    // cpageArr[currIndex] = page.num;
                    // requestEvent.getListData();
                    
                    // 请求资讯列表
                    // requestEvent.getTestData();
                   
                    // setTimeout(() => {
                    //     tabSwitchFlag = false;
                    // });
                    // 测试
                    curPageNum = page.num;
                    if (currIndex == 0) {
                        getListData(page);
                    } else {
                        handleEvent.dealEmptyPage()
                    }
                },
                // lazyLoad: {
                //     use: true // 是否开启懒加载,默认false
                // },
                page: {
                    size: pageSize
                },
                onScroll: function (mescroll, y, isUp) {
                    console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ", tabTop = " + tabTop + 'mescroll.getClientHeight():::' + mescroll.getClientHeight());
                    // if(tabSwitchFlag) return;
                    // scrollTopVal[currIndex] = y;
                    if (y == 0) {
                        setTimeout(function() {
                            var height = $('#listWrap' + currIndex).height();
                            // console.log('等于0执行')
                            $('.swiper-wrapper .swiper-slide').eq(currIndex).css('height', 'auto').siblings().css('height', height + 'px');
                            $('.swiper-wrapper .swiper-slide').eq(currIndex).css('minHeight', 'auto')
                        }) 
                    }

                    scrollZeroFlag = y == 0 ? true : false;
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
    dealEmptyPage: function () {
        setTimeout(function () {
            mescroll.endSuccess();
            $('#listWrap' + currIndex).empty().append(requestEvent.getEmptyPageDom())
        }, 500)
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
            // 请求参数处理
            var status = null;
            if(currIndex == 0) {
                status = null;
            }else if(currIndex == 1) {
                status = 0;
            }else if(currIndex == 2) {
                status = 3;
            }else if(currIndex == 3) {
                status = 4;
            }
            var index = $('#cardNo')[0].selectedIndex;
            cardNo = $('#cardNo')[0].options[index].text;
            var param = {
                card_no: cardNo,
                bill_peroid: billPeroid,
                page_no: cpageArr[currIndex],
                page_size: pageSize,
                status: status
            }
            // 是否请求标志位
            tabRequestFlag[currIndex] = true;
            util.ajaxRequest('service/bills', param, 'GET', function (res) {
                console.log(res)
                // 当前页个数 ： rows.length  当前页总数：totalPageCount
                // mescroll.endByPage(rows.length, totalPageCount);
                var data = res.data;
                if (data.pages == 0) {
                    renderEvent.getEmptyPageDom(res);
                } else if(data.pages > 0){
                    renderEvent.renderListData(res);
                }else {
                    ap.showToast({
                        content: res.message
                    });
                }
                mescroll.endByPage(pageSize, data.pages);
            }, function (res) {
                ap.showToast({
                    content: res.message
                });
                mescroll.endErr();
            })
        },
        // 获取用户认证信息
        getAuth: function() {
            // var self = this;
			var code = window.location.href.split('auth_code=')[1];
			if (!code) return;
			var param = {
				auth_code: code
            };
            util.ajaxRequest('/isp/alipay/service/login', param, token,function (res) {
                if (res.data && res.data.token) {
                    token = res.data.token;
                    localStorage.setItem('token', token);
                    // 初始化数据
                } else {
                    ap.showToast({
                        content: res.message
                    });
                }
            }, function (res) {
                ap.showToast({
                    content: res.message
                });
            });
        },

        // 获取卡号
        getCardNos: function() {
            // 测试
            // var data = [{
            //     card_no: '3701199213435545677'
            // }];
            // renderEvent.renderCardNo(data)
            // var param = {
            //     contentType: 'application/json;charset=utf-8',
            //     'auth-token': '123'
            // }
            
            // 真实 需放开
            util.ajaxRequest('isp/alipay/service/cards', {}, token,function (res) {
                if (res.data && res.data.length > 0) {
                    renderEvent.renderCardNo(res.data);
                    // 初始化数据
                } else {
                    ap.showToast({
                        content: res.message
                    });
                }
            }, function (res) {
                ap.showToast({
                    content: res.message
                });
            });
        }
    }, 
    // 渲染数据
    renderEvent = {
        renderListData: function (data) {
            var listDom = $("#listWrap" + currIndex),
                $html = ``;
            if (cpageArr[currIndex] == 1) {  // 当页数为第一页时
                listDom.empty()
            }
            // 账单状态 0-未处理 3-支付失败 4-支付成功 null: 全部
            for (let i = 0; i < data.length; i++) {
                $html += `<div class="list-item">
                        <div class="state-wrap">
                            <p class="state ${data[i].status == 3 ? 'fail-state' : "success-state"}">
                                <span>${data[i].status == 4 ? "支付成功" : (data[i].status == 0 ? "未处理" : "支付失败")}</span>
                            </p>
                        </div>
                        
                        <div class="content">
                            <div class="left-content">
                                <p class="start-wrap">
                                    <span class="start-point font f28">${data[i].in_station}</span>
                                    <span class="start-time font f26">${data[i].in_time}</span>
                                </p>
                                <span class="icon-direct"></span>
                                <p class="end-wrap">
                                    <span class="end-point font f28">${data[i].out_station}</span>
                                    <span class="end-time font f26">${data[i].out_time}</span>
                                </p>
                            </div>
                            <div class="right-content">
                                <p class="pay-money font f28">${data[i].pay_money}</p>
                                <p class="pay-time f26 ${data[i].status == 3 ? "hide" : ""} ">${data[i].pay_date}</p>
                            </div>
                            <!-- 失败原因 -->
                            <p class="fail-detail ${data[i].fail_reason ? '' : 'hide'}"> 
                                <span class="fail-reason font f28 hide">${data[i].fail_reason}</span>
                                <span class="icon icon-down" data-state="0"></span>
                            </p>
                        </div>
                    </div>`
            }
            listDom.append($html)
        },
        // 渲染无数据页面
        renderEmptyPage: function () {
            var $html = requestEvent.getEmptyPageDom();
            $('#listWrap').empty().append($html)
        },
        // 渲染卡号
        renderCardNo: function(data) {
            var $html = ``;
            for(var i = 0; i < data.length; i++) {
                if(i == 0) {
                    $html += `<option value="" selected>${data[i].card_no}</option>`
                }else {
                    $html += `<option value="">${data[i].card_no}</option>`
                }
            }
            $('#cardNo').empty().append($html)
        }
    },
    // 初始化
    init = function () {
        addEvent();
        handleEvent.initSwiper()
        handleEvent.initDatePicker()
        handleEvent.renderScroll()
        // mescroll.optUp.page.num = 2;
        mescroll.triggerUpScroll()
        // requestEvent.getCardNos();
    }
; (function () {
    // handleEvent.login();
    // init();
    requestEvent.getCardNos();
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
    var listDom = document.getElementById("listWrap" + currIndex),
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