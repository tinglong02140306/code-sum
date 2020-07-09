/**
 * @author hmxue
 * @time 2017-12-26
 * @description 办事指南
 */
'use strict';
$(function() {
    var bsdtSkinColor = '#4c72ff', // 主题色
        materialTemp = fly.template.compile(
            '{{each $data as item}}' +
            '<li class="bgcfff mgb25 fs30">' +
            '       <table class="fixed-table">' +
            '           <thead>' +
            '               <tr>' +
            '                   <th width="75%"></th>' +
            '                   <th width="25%"></th>' +
            '               </tr>' +
            '           </thead>' +
            '           <tbody>' +
            '               <tr style="height: 2rem" class="pdl25 bde5 bd-top-none bd-right-none bd-left-none">' +
            '                   <td class="pdl25">{{item.clmc}}</td>' +
            '                   {{if item.sfby === "1"}}' +
            '                   <td class="pdl25 c9d"><div class="floatr public-results mgr25 blue-bg" style="border: 1px solid' + bsdtSkinColor + '">必要</div></td>' +
            '                   {{else if item.sfby === "2"}}' +
            '                   <td class="pdl25 c9d"><div class="floatr public-results mgr25 blue-bg" style="border: 1px solid ' + bsdtSkinColor + '">容缺候补</div></td>' +
            '                   {{else if item.sfby === "3"}}' +
            '                   <td class="pdl25 c9d"><div class="floatr public-results mgr25 blue-bg" style="border: 1px solid ' + bsdtSkinColor + '">可选</div></td>' +
            '                   {{else }}' +
            '                   <td class="pdl25 c9d"><div class="floatr public-results mgr25 blue-bg" style="border: 1px solid ' + bsdtSkinColor + '">其他</div></td>' +
            '                   {{/if}}' +
            '               </tr>' +
            '           </tbody>' +
            '       </table>' +
            '       <table class="fixed-table">' +
            '           <thead>' +
            '               <tr>' +
            '                   <th width="25%"></th>' +
            '                   <th width="75%"></th>' +
            '               </tr>' +
            '           </thead>' +
            '           <tbody>' +
            '               <tr style="height: 1.5rem">' +
            '                   <td class="pdl25 c9d">介质要求</td>' +
            '                   {{if item.jzyq}}' +
            '                   <td class="pdr25">{{item.jzyq}}</td>' +
            '                   {{else}}' +
            '                   <td class="pdr25">电子件</td>' +
            '                   {{/if}}' +
            '               </tr>' +
            '               <tr style="height: 1.5rem">' +
            '                   <td class="pdl25 c9d">材料来源</td>' +
            '                   <td class="pdr25">{{item.clly}}</td>' +
            '               </tr>' +
            '                   {{if item.tbxz}}' +
            '               <tr style="height: 1.5rem">' +
            '                   <td class="pdl25 c9d">填报须知</td>' +
            '                   <td class="pdr25">{{item.tbxz}}</td>' +
            '               </tr>' +
            '                   {{/if}}' +
            '                   {{if item.fjList.length}}' +
            '               <tr style="height: 1.5rem">' +
            '                   <td class="pdl25 c9d">相关附件</td>' +
            '                   <td class="pdr25 ">' +
            '                   {{each item.fjList as fj}}' +
            '                       <div style="width: 40%;float: left">' +
            '                           <i class="details-download1"></i>' +
            '                           <a class="blue-bg" download="{{fj.fileName}}" href="/bsdt-h5/common/file/downloadZipFile.do?fileInfo={{fj.filePath}}">' +
            '                       {{if fj.fileBusiType =="MATERIAL_EMPTY"}}材料空表' +
            '                       {{else if fj.fileBusiType =="MATERIAL_SAMPLE"}}材料样表{{/if}}' +
            '                       </div>' +
            '                   {{/each}}' +
            '                   </td>' +
            '               </tr>' +
            '                   {{/if}}' +
            '           </tbody>' +
            '       </table>' +
            '</li>' +
            '{{/each}}'

    ),questionListTemp = fly.template.compile(
        '{{each $data as item}}' +
        '<li class="mgb10 pd25 bgcfff">' +
        '   <table class="fixed-table">' +
        '       <thead>' +
        '           <tr>' +
        '               <th width="15%"></th>' +
        '               <th width="85%"></th>' +
        '           </tr>' +
        '       </thead>' +
        '       <tbody>' +
        '           <tr style="height: 1.5rem;background-color: #F5F5F5">' +
        '               <td style="color: #4c72ff">问：</td>' +
        '               <td>{{item.question}}</td>' +
        '           </tr>' +
        '           <tr >' +
        '               <td style="float: left;color: #4c72ff">答：</td>' +
        '               <td>{{item.answer}}</td>' +
        '           </tr>' +
        '       </tbody>' +
        '   </table>' +
        '</li>' +
        '{{/each}}'
    );
    var platForm = util.checkMobilePlatform(),
        swiper, // tab切换变量
        id = '',//也叫 ssqdId 获取申请材料需要
        mode = '',
        title = util.getParam('title'), // title
        ssqdCode = fly.getQueryString('id'),
        questionData = [], // 常见问题数据
        materialData = [], // 材料数据


        vm = window.vm = fly.observable({
                /**
                 * 返回按钮
                 */
                back: function() {
                    platForm ? croods.pageClose({}) : window.history.back(-1);
                }
            }),
        /**
         * 事件处理模块
         */
        eventHandle = {
            /**
             * 加载常见问题
             */
            loadQuestion: function () {
                if(questionData) {
                    util.id('questionTempWrap').innerHTML = questionListTemp(questionData);
                }else {

                }
            },
            /**
             * 申请材料
             */
            loadApply: function () {//applayMaterial
               /* fly.$.ajax({
                    url: CONTEXTPATH + '/resource/h5/applyData.json',
                    type: 'POST',
                    data: params,
                    success: function (res) {
                        res = fly.evalJSON(res);

                        if (res.data.length !== 0) {
                            util.id('materialTempWrap').innerHTML = materialTemp(res.data);

                            fly.bind(document.body, vm);

                        } else {
                            util.id('graph').classList.add('list-block-empty');
                        }
                    },
                    error: function () {
                        util.toast('加载失败');
                    }
                });*/
                if(materialData) {
                    util.id('materialTempWrap').innerHTML = materialTemp(materialData);

                    fly.bind(document.body, vm);
                }else {
                    util.id('graph').classList.add('list-block-empty');
                }
            },
            /**
             * 加载指南
             */
            loadGuide: function () {
                var params = {
                    id: ssqdCode
                };
                fly.$.ajax({
                    url: CONTEXTPATH + '/guide/getSzwGuideDetailsById.do', // /resource/h5/data.json /guide/getGuideDetailsById.do
                    type: 'POST',
                    data: params,
                    success: function (data) {
                        //res = fly.evalJSON(res);
                        // 不可见特殊字符处理
                        if (data) {
                            // deptName = data.projectInfo.ssqdDeptName;
                            // deptId = data.projectInfo.ssqdDeptCode;
                            if (data.sltj) {
                                util.removeClass(util.id('guide-sltj'), 'hide');
                                util.id('sltj').innerHTML = data.sltj;
                            }
                            if (data.sfsf) {

                                util.removeClass(util.id('guide-sfsf'), 'hide');

                                util.id('sfsf').innerHTML = data.sfsf;
                            }
                            if (data.sfbz && data.sfsf !== '否') {

                                util.removeClass(util.id('guide-sfbz'), 'hide');
                               //var chargeJson = fly.evalJSON(data.projectInfo.chargeJson);
                                var chargeJson = fly.evalJSON(data.sfbz);
                                var sfbz = '';
                                for (var i = 0; i < chargeJson.length; i++) {
                                    sfbz = chargeJson[i].chargeStandard + '<br>';
                                }
                                util.id('sfbz').innerHTML = sfbz.substring(0, sfbz.length - 1);
                            }
                            if (data.cnbjqx) {
                                util.removeClass(util.id('guide-cnbjsx'), 'hide');
                                util.id('cnbjsx').innerHTML = data.cnbjqx;
                            }
                            if (data.blxs) {
                                util.removeClass(util.id('guide-blxs'), 'hide');
                                util.id('blxs').innerHTML = data.blxs;
                            }
                            if (data.blxs.indexOf("窗口办理")-1 && data.bldz) {
                                util.removeClass(util.id('guideBldd'), 'hide');
                                util.id('bldd').innerHTML = data.bldz;
                            }
                            if (data.yybl) {
                                util.removeClass(util.id('guide-yybl'), 'hide');
                                util.id('yybl').innerHTML = data.yybl;
                            }
                            if (data.blsj) {
                                util.removeClass(util.id('guide-blsj'), 'hide');
                                util.id('blsj').innerHTML = data.blsj;
                            }
                            if (data.zxdh) {
                                util.removeClass(util.id('guide-zxdh'), 'hide');
                                var zxdh = data.zxdh;
                                if (zxdh) {
                                    zxdh = zxdh.replace(/(0\d{2,3}-\d{7,8})|(1[35784]\d{9})|(\d{8,8})|(\d{7,8})|(\d{6,8})|(\d{5,8})/g, "<a class=\"blue-bg\" href=\"tel:$&\">$&</a>");
                                    $("#guide-zxdh").append(zxdh);
                                } else {
                                    $("#guide-zxdh").append("暂无");
                                }
                            }
                            if (data.jddh) {
                                util.removeClass(util.id('guide-jddh'), 'hide');
                                var jddh = data.jddh;
                                if (jddh) {
                                    jddh = jddh.replace(/(0\d{2,3}-\d{7,8})|(1[35784]\d{9})|(\d{8,8})|(\d{7,8})|(\d{6,8})|(\d{5,8})/g, "<a class=\"blue-bg\" href=\"tel:$&\">$&</a>");
                                    $("#guide-jddh").append(jddh);
                                } else {
                                    $("#guide-jddh").append("暂无");
                                }
                            }
                            if (data.wlkd) {
                                util.removeClass(util.id('guide-wlkd'), 'hide');
                                util.id('wlkd').innerHTML = data.wlkd;
                            }
                        } else {
                            util.id('guide').classList.add('list-block-empty')
                        }
                        materialData = data.applydatalist; // 申请材料数据
                        questionData = data.serviceconsultationlist; //常见问答数据
                        //申请材料
                        eventHandle.loadApply();
                        //常见问题
                        eventHandle.loadQuestion();
                    },
                    error: function () {
                        util.toast('加载失败');
                    }
                });
            },
            /**
             * 初始化轮播组件
             */
            initSwiper: function () {
                swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    paginationBulletRender: function (index, className) {
                        var name = '';
                        switch (index) {
                            case 0:
                                name = '办事指南';
                                break;
                            case 1:
                                name = '申请材料';
                                break;
                            case 2:
                                name = '办事咨询';
                                break;
                            default:
                                name = '';
                        }
                        return '<span class="' + className + '">' + name + '</span>';
                    },
                    onInit: function (swiper) {
                        var swiperBulletActive = document.getElementsByClassName('swiper-pagination-bullet-active')[0];
                        swiperBulletActive.style.color = bsdtSkinColor;
                        swiperBulletActive.style.borderBottom = '2px solid ' + bsdtSkinColor;
                    },
                    onSlideChangeStart: function (swiper) {
                        var swiperBulletActive = document.getElementsByClassName('swiper-pagination-bullet-active')[0];
                        swiperBulletActive.style.color = bsdtSkinColor;
                        swiperBulletActive.style.borderBottom = '2px solid ' + bsdtSkinColor;

                        for (var i = 0; i < util.siblings(swiperBulletActive).length; i++) {
                            util.siblings(swiperBulletActive)[i].style.color = '#666';
                            util.siblings(swiperBulletActive)[i].style.borderBottom = '1px solid #c5c5c5';
                        }
                    }
                });
            },
            /**
             * 初始化标题跑马灯
             */
            initMarquee: function (id) {
                var marqueeWrap = document.querySelector('div.marquee-wrap'),
                    fragment = document.createDocumentFragment('div'),
                    marqueeContentWrap = document.createElement('div'),
                    marqueeContent = document.createElement('div'),
                    marqueeContentCopy = document.createElement('div'),

                    text = marqueeWrap.innerText,
                    speed = 30,
                    marqueeHandler,
                    marqueeInterval;

                marqueeContentWrap.className = 'marquee-content-wrap';
                marqueeContent.className = 'marquee-content';
                marqueeContent.innerText = text;
                marqueeContentCopy.className = 'marquee-content-copy';
                marqueeContentCopy.innerText = text;

                marqueeContentWrap.appendChild(marqueeContent);
                marqueeContentWrap.appendChild(marqueeContentCopy);

                fragment.appendChild(marqueeContentWrap);

                marqueeWrap.innerHTML = '';
                marqueeWrap.appendChild(fragment);

                marqueeContentCopy.innerHTML = marqueeContent.innerHTML;
                marqueeHandler = function () {
                    if (marqueeContentCopy.offsetWidth - marqueeWrap.scrollLeft <= 0) {
                        marqueeWrap.scrollLeft -= marqueeContentCopy.offsetWidth;
                    } else {
                        marqueeWrap.scrollLeft++;
                    }
                };
                marqueeInterval = setInterval(marqueeHandler, speed);
            },
            /**
             * 获取标题的长度
             */
            getTextWidth: function (id, text) {
                var elem = id ? document.getElementById(id) : document.body,
                    text = text ? text : elem.innerHTML,
                    pre = document.createElement('pre'),
                    body = document.body,
                    style, width;

                style = window.getComputedStyle(elem, null);
                pre.innerHTML = text;
                pre.style.whiteSpace = 'nowrap';
                pre.style.position = 'absolute';
                pre.style.zIndex = '-99999';
                pre.style.font = style.getPropertyValue('font');
                body.appendChild(pre);
                width = pre.offsetWidth;
                body.removeChild(pre);
                return width;
            }
        },
        init = function () {
            var itemBanner = document.getElementById('itemBanner');
            itemBanner.innerHTML = title;
            fly.bind(document.body, vm);

            eventHandle.loadGuide();
            // 初始化轮播
            eventHandle.initSwiper();

            // 计算当前文字长度，超过容器长度使用跑马灯
            if (itemBanner.offsetWidth < eventHandle.getTextWidth('itemBanner', title)) {
                eventHandle.initMarquee();
            }
        };
    init();

});