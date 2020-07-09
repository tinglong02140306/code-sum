'use strict';
var Mask = require('mask?__inline');

var CLICK = 'click',
    TOUCHSTART = 'touchstart',
    proxy = fly.$.proxy,
    template = fly.template;

var c = module.exports = fly.Component.extend({

    name: 'confirm',

    template: template(__inline('confirm.html')),

    options: {
        hideFlag: false,
        templateCont: template('<a herf = "{{if url}}{{url}}{{/if}}" data-url = "{{url}}"class="cont-line"  data-type="{{type}}">{{content}}</a>'),
        templateTitle: template('<span>{{title}}</span>'),
    },

    ctor: function(element, options) {
        var that = this,
            maskDom;
        that._super(element, options);
        element = that.element;
        that.operationCont = element.querySelector('.confirm-body');
        that.operationTitle = element.querySelector('.confirm-header');
        /*that.createButtons();
        that.createPickers();*/

        // 创建遮罩
        maskDom = document.createElement('div');
        element.appendChild(maskDom);
        that.mask = new Mask(maskDom);
        that.mask.bind('close', function() {
            that.hide();
        });
        /*that.show();*/
        // 防止滚动穿透
        element.addEventListener(CLICK, function(e) {
            /*e.preventDefault();*/
            e.stopPropagation();
        }, false);
        element.addEventListener('touchmove', function(e) {
            /*e.preventDefault();*/
            e.stopPropagation();
        }, false);
        /*实现数据绑定*/
        that._dataSource();
    },
    refresh: function(e) {
        var that = this,
            options = that.options,
            operationCont = that.operationCont,
            operationTitle = that.operationTitle;
        var view = that.dataSource.view();
        view.forEach(function(item, i) {
            var operaItem = $(options['templateCont'](item))[0],
                operaTitle = $(options['templateTitle'](item))[0];
            operationCont.appendChild(operaItem);
            if (i == 0) {
                operationTitle.appendChild(operaTitle);
            }
            operaItem.addEventListener(CLICK, proxy(function(e) {
                /*localStorage.TYPE = e.currentTarget.getAttribute('data-type');*/
                that.hide();
            }, that), false);
            operaItem.addEventListener(CLICK, item.click || $.noop);
        });
    },

    //显示
    show: function() {
        this.mask && this.mask.show();
        this.element.querySelector('.confirm-inner').classList.add('active');
    },

    //隐藏
    hide: function() {
        this.element.querySelector('.confirm-inner').classList.remove('active');
        this.mask && this.mask.close();
    }
});

fly.component(c);