var tabSwiper,
    currIndex = 0,
    mescroll,
    cpageArr = [0, 0, 0, 0], // 4个tab对应的页码
    pageSize = 10, // 每页加载的条数
    noMoreSize = 5,
    tabTop = $('.tab-content').offset().top,
    tabFixedFlag = false,
    cardNo = '', // 卡号
    billPeroid = '', // 日期
    token = '';
// 方法处理
var handleEvent = {
        // 设置tab 初始值
        addFocusStyle: function() {
            setTimeout(function() {
                $('.swiper-pagination .tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active');
            }, 100)
        },
        // 高度调整
        adjustHeight: function() {
            handleEvent.addFocusStyle()
                /*调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值)*/
            var minHeight,
                $curDom = $('.swiper-wrapper .swiper-slide').eq(currIndex),
                listHeight = $('#listWrap' + currIndex).outerHeight(),
                curMinHeight = parseInt($curDom[0].style.minHeight.split('px')[0]),
                tabHeight = $("#tabWrap").outerHeight(),
                tabOffset = $("#tabWrap").offset().top,
                clientHeiht = mescroll.getClientHeight(),
                upWrapHeight = $('.mescroll-upwarp').outerHeight();

            window.requestAnimationFrame(function() {
                if (tabFixedFlag) {
                    minHeight = clientHeiht - tabHeight;
                } else {
                    minHeight = clientHeiht - tabHeight - tabOffset;
                    //  - upWrapHeight*4
                }
                // 第一个 minHeight 防止抖动下滑  （防止滑动 height：auto  sib:height: minHeight）
                $curDom.css({ 'minHeight': minHeight + 'px', 'height': 'auto' })
                $curDom.siblings().css({ 'height': minHeight, 'minHeight': minHeight });
                //  - $('.mescroll-upwarp').height()
            })
        },
        // 查询点击事件
        searchEvent: function() {
            handleEvent.showMask()
            mescroll.resetUpScroll();
        },
        // tab点击事件
        tabSwitchClick: function(e) {
            var self = $(this),
                index = self.data().index;
            currIndex = index;
            self.addClass('tab-active').siblings().removeClass('tab-active');
            swiper.slideTo(currIndex);
        },
        // 查看订单失败原因
        viewFailRsonClick: function(e) {
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
        initSwiper: function() {
            swiper = new Swiper("#swiperContainer", {
                direction: "horizontal",
                /*横向滑动*/
                pagination: ".swiper-pagination",
                /*分页器*/
                paginationBulletRender: function(index, className) {
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
                onInit: function(swiper) {
                    handleEvent.addFocusStyle();
                },
                onTransitionEnd: function(swiper) {
                    // 高度调整
                    handleEvent.adjustHeight();
                    currIndex = swiper.activeIndex; //轮播切换完毕的事件
                    mescroll.resetUpScroll();
                }
            })
        },
        // picker组件初始化
        initDatePicker: function() {
            var picker = new Picker(document.querySelector('.time'), {
                controls: false,
                date: null,
                format: 'YYYY-MM',
                headers: false,
                inline: true, // 是否从手机低端弹出
                text: {
                    title: '选择账期',
                    cancel: '取消',
                    confirm: '确认',
                },
                pick(options) {
                    billPeroid = picker.getDate(true); // 2019-11
                }
            });
            // 设置默认值
            billPeroid = new Date().getFullYear() + '-' + (new Date().getMonth() + 1);
            $('#time').val(billPeroid);
        },
        // toast
        toastDialog: function(message) {
            if (util.isAlipay()) {
                ap.showToast({
                    content: message
                });
            } else if (util.isWeiXin()) {
                util.showToast(message)
            }
        },
        // 显示遮罩
        showMask: function() {
            if (util.isAlipay()) {
                ap.showLoading({
                    content: '加载中...',
                });
            } else if (util.isWeiXin()) {
                util.showMask('加载中...')
            }
        },
        // 隐藏遮罩
        hideMask: function() {
            if (util.isAlipay()) {
                ap.hideLoading()
            } else if (util.isWeiXin()) {
                util.hideMask()
            }
        },
        /**
         * 加载当前滚动条
         */
        renderScroll: function() {
            mescroll = new MeScroll('wrapper', {
                down: {
                    use: false,
                },
                up: { // 上拉配置
                    noMoreSize: noMoreSize,
                    isBounce: false, //此处禁止ios回弹
                    htmlNodata: '<p class="upwarp-nodata">没有更多了</p>',
                    callback: function(page, mescroll) {
                        cpageArr[currIndex] = page.num;
                        // 列表数据请求
                        requestEvent.getListData();
                    },
                    page: {
                        size: pageSize
                    },
                    onScroll: function(mescroll, y, isUp) {
                        // console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ");
                        if (!$('.swiper-pagination .tab-item').eq(currIndex).hasClass('tab-active')) handleEvent.addFocusStyle();
                        if (y < 10) {
                            handleEvent.adjustHeight();
                        }
                        // scrollZeroFlag = y < 10 ? true : false;
                        if (y >= tabTop) {
                            tabFixedFlag = true;
                            if (util.phoneOs == 'IOS') {
                                $('.tab-content').addClass("tab-sticky");
                            } else {
                                $('.tab-content').addClass("tab-fixed");
                            }
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
        }
    },
    addEvent = function() {
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
        // 获取list 参数
        getListParams: function() {
            var status = null,
                index,
                param;
            // 请求参数处理
            var status = null;
            if (currIndex == 0) {
                status = null;
            } else if (currIndex == 1) {
                status = 0;
            } else if (currIndex == 2) {
                status = 3;
            } else if (currIndex == 3) {
                status = 4;
            }
            index = $('#cardNo')[0].selectedIndex;
            if (index > -1) {
                cardNo = $('#cardNo')[0].options[index].text;
            }
            param = {
                card_no: cardNo,
                bill_peroid: billPeroid,
                page_no: cpageArr[currIndex],
                page_size: pageSize,
                status: status
            }
            return param;
        },
        // 获取暂无数据Dom结构
        getEmptyPageDom: function() {
            return `<div class="empty-wrap">
                <div class="content">
                    <span class="icon-empty"></span>
                    <p class="notice-wrap">
                        <span class="f34 c3b4">暂无账单</span>
                        <span class="f28 c3b4">您还没有通行账单可显示~</span>
                    </p>
                </div>
            </div>`;
        },
        // 列表数据请求
        getListData: function() {
            var param = requestEvent.getListParams();
            util.ajaxRequest('/isp/alipay/life/bills', param, token, function(res) {
                // handleEvent.toastDialog(JSON.stringify(res))
                // 当前页个数 ： rows.length  当前页总数：totalPageCount
                // mescroll.endByPage(rows.length, totalPageCount);
                var data = res.data;
                if (res.code == '0000') {
                    if (data.total == 0) {
                        mescroll.endByPage(data.list.length, data.total);
                        renderEvent.renderEmptyPage();
                    } else if (data.total > 0) {
                        mescroll.endByPage(data.list.length, data.total);
                        renderEvent.renderListData(data.list);
                    }
                } else {
                    renderEvent.renderEmptyPage();
                    handleEvent.toastDialog(res.message);
                    mescroll.endSuccess();
                }
                handleEvent.hideMask();
            }, function(res) {
                handleEvent.toastDialog(res.message)
                mescroll.endErr();
                handleEvent.hideMask();
            })
        },
        // 获取卡号
        getCardNos: function() {
            util.ajaxRequest('/isp/alipay/life/cards', {}, token, function(res) {
                // handleEvent.toastDialog('卡号信息:' + JSON.stringify(res))
                if (res.code = "0000") {
                    if (res.data && res.data.length > 0) {
                        renderEvent.renderCardNo(res.data);
                    }
                    init();
                    mescroll.resetUpScroll();
                } else {
                    handleEvent.toastDialog(res.message)
                }
            }, function(res) {
                handleEvent.toastDialog(res.message)
            });
        }
    },
    // 渲染数据
    renderEvent = {
        renderListData: function(data) {
            var listDom = $("#listWrap" + currIndex),
                $html = ``;
            if (cpageArr[currIndex] == 1) { // 当页数为第一页时
                listDom.empty()
            }
            // 账单状态 0-未处理 3-支付失败 4-支付成功 null: 全部
            for (let i = 0; i < data.length; i++) {
                $html += `<div class="list-item">
                <div class="state-wrap">
                    <p class="state ${data[i].status == 4 ? "success-state" : "fail-state"}">
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
                        <p class="pay-money font f28">${data[i].bill_money + '元'}</p>
                        <p class="pay-time f26 ${data[i].pay_date == null ? "hide" : ""} ">${data[i].pay_date}</p>
                    </div>
                    <!-- 失败原因 -->
                    <p class="fail-detail ${data[i].fail_reason ? '' : 'hide'}"> 
                        <span class="fail-reason font f28 hide">${data[i].fail_reason}</span>
                        <span class="icon icon-down" data-state="0"></span>
                    </p>
                </div>
            </div>`
            }
            listDom.append($html);
            handleEvent.adjustHeight();
        },
        // 渲染无数据页面
        renderEmptyPage: function() {
            var $html = requestEvent.getEmptyPageDom();
            $('#listWrap' + currIndex).empty().append($html);
            handleEvent.adjustHeight();
        },
        // 渲染卡号
        renderCardNo: function(data) {
            var $html = ``;
            for (var i = 0; i < data.length; i++) {
                if (i == 0) {
                    $html += `<option value="" selected>${data[i].card_no}</option>`
                } else {
                    $html += `<option value="">${data[i].card_no}</option>`
                }
            }
            $('#cardNo').empty().append($html)
        }
    },
    // 初始化
    init = function() {
        addEvent();
        handleEvent.initSwiper()
        handleEvent.initDatePicker()
        handleEvent.renderScroll()
    };
(function() {
    token = util.getLocalToken();
    requestEvent.getCardNos();
    // if (util.isAlipay()) {
    //     requestEvent.getAlipayAuth()
    // } else if (util.isWeiXin()) {
    //     requestEvent.getWeinXinAuth();
    // }
})()