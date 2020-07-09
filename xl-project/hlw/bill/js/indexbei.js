; (function () {
    var tabSwiper,
        currIndex = 0,
        mescroll,
        cpageArr = [1, 1, 1, 1], // 4个tab对应的页数
        pageSize = 6;  // 每页加载的条数
    // 方法处理
    var handleEvent = {
        // 初始化警网头条tab组件
        initSwiper: function () {
            if (!tabSwiper) {
                tabSwiper = new Swiper('#swiperContainer', {
                    pagination: '#swiperPagination',
                    paginationClickable: true,  // 可点击
                    observer: true,
                    observerParents: true,
                    paginationBulletRender: function (index, className) {
                        var name = '';
                        switch (index) {
                            case 0:
                                name = "全部";
                                break;
                            case 1:
                                name = "未支付";
                                break;
                            case 2:
                                name = "支付失败";
                                break;
                            case 3:
                                name = "支付成功";
                                break;
                            default:
                                name = '';
                        }
                        var className = 'tab-item';
                        return `<div class="${className}" data-index="${index}"><span class="innner-item" >${name}</span></div>`;
                    },
                    onInit: function (swiper) {
                        // alert(currIndex)
                        setTimeout(function(){
                            $('.tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active');
                        },300)
                        // $('.tab-item span').text('全部');
                    },
                    onSlideChangeStart: function (tabSwiper) {
                        /*调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值)*/
                        // var minHight = mescroll.getClientHeight() - navWarp.offsetHeight;
                        // document.getElementById("upscrollWarp").style.minHeight = minHight + "px";
                        // mescroll.resetUpScroll()
                        // 根据type类型 请求不同接口数据
                        handleEvent.getTabData();
                    }
                });
            }
        },
        // 获取数据
        getTabData: function () {
            currIndex = $('#swiperContainer .swiper-slide-active').data().index;
            $('.tab-item').eq(currIndex).addClass('tab-active').siblings().removeClass('tab-active');
        },
        // tab点击事件
        tabSwitchClick: function (e) {
            var self = $(this),
                index = self.data().index;
            currIndex = index;
            self.addClass('tab-active').siblings().removeClass('tab-active');
            // $('#swiperPagination .swiper-pagination-bullets').eq(index).find('span').trigger('click');
            // tabSwiper.slideTo(currIndex)

            /*调整upscrollWarp的最小高度,使其刚好满屏,避免点击悬浮菜单时会滑下来;(这里每次点击都计算一次,毕竟轮播图高度改变或未能显示图都会影响计算的值)*/
            // var minHight = mescroll.getClientHeight() - navWarp.offsetHeight;
            // document.getElementById("upscrollWarp").style.minHeight = minHight + "px";
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
                        cpageArr[currIndex] = page.num;
                        // 请求资讯列表
                        requestEvent.getTestData();
                    },
                    page: {
                        size: pageSize
                    },
                    onScroll: function(mescroll, y, isUp) {
                        console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ", 是否向上滑动 isUp = " + isUp);
                        // if (y >= navWarp.offsetTop) {
                        //     navContent.classList.add("nav-fixed");
                        // } else {
                        //     navContent.classList.remove("nav-fixed");
                        // }

                    }
                }
            });
        },
        buildListDom() {
            var $listHtml = `
                            <div class="list-item">
                                <div class="state-wrap">
                                    <p class="state success-state">
                                        <span>支付成功</span>
                                    </p>
                                </div>
                                <div class="content">
                                    <div class="left-content">
                                        <p class="start-wrap">
                                            <span class="start-point font f28">济南西</span>
                                            <span class="start-time font f26">2019-11-21 15:00:02</span>
                                        </p>
                                        <span class="icon-direct"></span>
                                        <p class="end-wrap">
                                            <span class="end-point font f28">上海虹桥</span>
                                            <span class="end-time font f26">2019-11-21 15:00:02</span>
                                        </p>
                                    </div>
                                    <div class="right-content">
                                        <p class="pay-money font f28">259.05元</p>
                                        <p class="pay-time f26">(2019-11-21 15:00:02)</p>
                                    </div>
                                    <!-- 失败原因 -->
                                    <p class="fail-detail"> 
                                        <span class="fail-reason font f28 hide">失败原因：用户银行卡余额不足</span>
                                        <span class="icon icon-down" data-state="0"></span>
                                    </p>
                                </div>
                            </div>`
        }
    },
        addEvent = function () {
            var $this = $('.wrap');
            // 头部tab点击事件
            $this.off('.tab-wrap .tab-item').on('click', '.tab-wrap .tab-item', handleEvent.tabSwitchClick);

            // 失败原因点击事件
            $this.off('.swiper-list-wrap .fail-detail .icon').on('click', '.swiper-list-wrap .fail-detail .icon', handleEvent.viewFailRsonClick);
        },
        // 数据请求
        requestEvent = {
            getTestData: function() {
                setTimeout(function() {
                    mescroll.endByPage(0, 0);
                    // mescroll.endSuccess()
                },3000)
            },
            // 获取全部列表数据
            getAllData: function() {
                var data = [{
                    "dealState": 0, // 0：未支付 1：支付失败 2：支付成功
                    "startPoint": "济南西",
                    "endPoint": "上海虹桥",
                    "payMoney": "256.09元",
                    "startTime": "2019-09-07 15:20:00",
                    "endTime": "2019-09-07 15:20:00",
                    "payTime": "2019-09-07 15:20:00",
                    "failReson": "失败原因：用户银行卡余额不足"
                }],
                $html = ``;
                if(data.length > 0) {
                    for(let i = 0; i < data.length;i++) {
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
                                        <p class="fail-detail"> 
                                            <span class="fail-reason font f28 hide">${data[i].failReson}</span>
                                            <span class="icon icon-down" data-state="0"></span>
                                        </p>
                                    </div>
                                </div>`
                    }
                }else {

                }
                

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
                        </div>`
            }
        };

    // handleEvent.initSwiper();
    addEvent();
    handleEvent.renderScroll()
    mescroll.triggerUpScroll()

    var tabWrap = document.getElementById("tabWrap");
		// if (mescroll.os.ios) {
		// 	//ios的悬停效果,通过给navWarp添加nav-sticky样式来实现
		// 	tabWrap.classList.add("nav-sticky");
		// } else {
		// 	//android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
		// 	tabWrap.style.height = tabWrap.offsetHeight + "px";//固定高度占位,避免悬浮时列表抖动
		// 	var navContent = document.getElementById("swiperPagination");
		// 	mescroll.optUp.onScroll = function (mescroll, y, isUp) {
		// 		console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ", 是否向上滑动 isUp = " + isUp);
		// 		if (y >= tabWrap.offsetTop) {
		// 			navContent.classList.add("nav-fixed");
		// 		} else {
		// 			navContent.classList.remove("nav-fixed");
		// 		}
		// 	}
		// }
})()