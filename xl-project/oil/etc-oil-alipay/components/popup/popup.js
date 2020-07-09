const animation = my.createAnimation({
    duration: 150,
    timingFunction: 'linear',
    delay: 0,
});

Component({
    props: {
        position: "bottom", //bottom center
        show: false,
        // 点击外部区域 是否关闭弹框
        outside: true,
        tab: false
    },
    data: {
        height: 0,
        bottom_style: `bottom:0px;`,
        animation: null
    },
    methods: {
        preventTouchMove() {},
        //内容区域点击
        onContentClick() {},
        //遮罩区域点击
        onMaskerClick() {
            this.props.onCancel && this.props.onCancel();
        },
        //动画进入
        fadeIn(isTab) {
            isTab && my.hideTabBar();
            setTimeout(() => {
                my.createSelectorQuery().select('#bottom').boundingClientRect().exec((rect) => {
                    if (rect && rect[0]) {
                        this.setData({
                            height: rect[0].height,
                        });
                    }
                    this.setData({
                        animation: animation.translateY(0).step().export()
                    });
                });
            }, 100);
        },
        //动画离开
        fadeOut(isTab) {
            const {
                height
            } = this.data;
            this.setData({
                animation: animation.translateY(height).step().export()
            });
            setTimeout(() => {
                isTab && my.showTabBar();
            }, 200);
        }
    }
})