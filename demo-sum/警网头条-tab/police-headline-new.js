/**
 * @author tinglong
 * @time 2017-11-08
 * @description 警网头条
 */
'use strict';
var swiper,   // swiper 对象
    eventHandle = {
        /*
         * 初始化轮播组件
         *
        */
        initSwiper: function () {
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                paginationBulletRender: function (index, className) {
                    var name = '';
                    switch (index) {
                        case 0:
                            name = '推荐';
                            break;
                        case 1:
                            name = '合肥';
                            break;
                        case 2:
                            name = '警徽热点';
                            break;
                        default:
                            name = '';
                    }
                    var classNames = 'innner-item';
                    return '<div class="' + className + '">' + '<span class="innner-item" >'+ name + '</span>'+ '</div>';
                },
                onInit: function (swiper) {
                    var swiperBulletActive = $('.swiper-pagination-bullet-active').find('.innner-item');
                    
                    // 选中状态
                    swiperBulletActive.addClass('selected');
                    swiperBulletActive.removeClass('unselected');
                },
                onSlideChangeStart: function (swiper) {
                    var swiperBulletActive = $('.swiper-pagination-bullet-active'),
                        swiperBulletChild,
                        swiperBulletChildItem = swiperBulletActive.find('.innner-item');

                        // 选中状态
                        swiperBulletChildItem.addClass('selected');
                        swiperBulletChildItem.removeClass('unselected');

                    // 未选中状态
                    for(var i = 0; i < swiperBulletActive.siblings().length; i++) {
                        swiperBulletChild =  swiperBulletActive.siblings().eq(i).find('.innner-item');
                        swiperBulletChild.addClass('unselected');
                        swiperBulletChild.removeClass('selected');
                    }
                }
            });
        }
    };
$(function(){
    eventHandle.initSwiper();
}); 
