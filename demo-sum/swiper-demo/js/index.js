var currIndex = 0,
    swiper,
    curPageNumArr = [0, 0, 0, 0],
    pageSize = 5,
    mescroll,
    tabTop = $('.tab-content').offset().top,
    tabFixedFlag = false;
var initEvent = {
    // 初始化swiper
    initSwiper: function () {
        swiper = new Swiper("#swiperContainer", {
            direction: "horizontal",/*横向滑动*/
            pagination: ".swiper-pagination",/*分页器*/
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
            onTransitionEnd: function (swiper) {
                currIndex = swiper.activeIndex;//轮播切换完毕的事件
                handleEvent.adjustHeight();
            }
        })
    },
    initScroll: function () {
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
                callback: function (page, mescroll) {
                    // cpageArr[currIndex] = page.num;
                    curPageNumArr[currIndex] = page.num;
                    requestEvent.getData(page)
                },
                lazyLoad: {
                    use: true // 是否开启懒加载,默认false
                },
                page: {
                    size: pageSize
                },
                onScroll: function (mescroll, y, isUp) {
                    console.log("up --> onScroll 列表当前滚动的距离 y = " + y + 'mescroll.getClientHeight():::' + mescroll.getClientHeight());
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
    },
    // 设置tab 初始值
    addFocusStyle: function () {
        $('.swiper-pagination .tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active')
    }
},
    handleEvent = {
        // 调整高度
        adjustHeight: function () {
            var minHeight;
            initEvent.addFocusStyle();
            if (tabFixedFlag) {
                minHeight = document.body.clientHeight - $('.tab-wrap').height();
            } else {
                minHeight = document.body.clientHeight - $('.tab-wrap').height() - $('.tab-wrap').offset().top;
            }
            $('.swiper-wrapper .swiper-slide').eq(currIndex).css('height', 'auto').siblings().css('height', minHeight + 'px');
        },
        // tab点击事件
        tabSwitchClick: function (e) {
            var self = $(this),
                index = self.data().index;
            currIndex = index;
            self.addClass('tab-active').siblings().removeClass('tab-active');
            swiper.slideTo(currIndex);
            // 高度调整
            // handleEvent.adjustHeight()
            // mescroll.resetUpScroll()
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
    },
    renderEvent = {
        renderListData: function (data) {
            var listDom = $("#listWrap" + currIndex),
                $html = ``;
            if (curPageNumArr[currIndex] == 1) {  // 当页数为第一页时
                listDom.empty()
            }
            if (data.length > 0) {
                console.log(data)
                for (let i = 0; i < data.length; i++) {
                    if (data[i] == undefined) return;
                    $html += `<div class="list-item">
                        <div class="state-wrap">
                            <p class="state ${data[i].dealState && data[i].dealState == 0 ? '' : (data[i].dealState && data[i].dealState == 1 ? "fail-state" : "success-state")} ">
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
            listDom.append($html)

        }

    },
    requestEvent = {
        getData: function (page) {
            util.ajaxRequest('../res/pdlist1.json', {}, 'GET', function (data) {
                // console.log(res)
                // 当前页个数 ： rows.length  当前页总数：totalPageCount
                // mescroll.endByPage(rows.length, totalPageCount);
                // if(res.length() == 0) {

                // } else {
                //     renderEvent.renderListData(res)
                // }
                var listData = [];
                if (currIndex == 0) {

                    //全部
                    for (var i = (page.num - 1) * pageSize; i < page.num * pageSize; i++) {
                        if (i == data.length) break;
                        listData.push(data[i]);
                    }
                }
                mescroll.endByPage(data.length)
                renderEvent.renderListData(listData)

            }, function (data) {
                mescroll.endErr();
            }, function (xhr, status) {
                mescroll.endSuccess();
            })

        }
    },
    addEvent = function () {
        var $this = $('.wrap');
        // 查询按钮点击事件

        // $this.off('.btn-wrap span').on('click', '.btn-wrap span', handleEvent.searchEvent);
        // 头部tab点击事件
        $this.off('.tab-wrap .tab-item').on('click', '.tab-wrap .tab-item', handleEvent.tabSwitchClick);

        // 失败原因点击事件
        $this.off('.swiper-list-wrap .fail-detail .icon').on('click', '.swiper-list-wrap .fail-detail .icon', handleEvent.viewFailRsonClick);

    }
    ; $(function () {
        addEvent();
        initEvent.addFocusStyle()
        initEvent.initSwiper();
        initEvent.addFocusStyle()
        initEvent.initScroll()
        mescroll.resetUpScroll()
    })