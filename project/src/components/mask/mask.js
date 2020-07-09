'use strict';

var c = module.exports = fly.Component.extend({

    name: 'Mask',

    template: fly.template('<div class="mask"></div>'),

    options: {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, .2)'
    },

    events: ['close'],

    ctor: function (element, options) {
        var that = this;
        that._super(element, options);
        element = that.element;
        options = that.options;
        element.style.backgroundColor = options.backgroundColor;
        element.style.opacity = options.opacity;
        //touchstart事件 会导致事件冒泡
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            that.trigger('close');
        });
    },

    // 显示
    show: function () {
        this.element.style.display = 'block';
    },

    // 隐藏
    close: function (callback) {
        this.element.style.display = 'none';
        callback && callback();
    }
});

fly.component(c);