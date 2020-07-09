const TIME = 200;
const animationIn = my.createAnimation({
    duration: TIME,
    timingFunction: "linear",
    delay: 0,
});

const animatinOpacity = my.createAnimation({
    duration: TIME,
    timingFunction: "linear",
    delay: 0,
})

Component({
    props: {
        show: false,
        //点击外部是否关闭 true:关闭 false:不关闭
        outside: true
        //    {
        //        type:Boolean,
        //        value:false,
        //        observer:function(newVal){
        //             newVal?this.fadeIn():this.fadeOut();
        //        }
        //    },
    },

    data: {
        animation: null,
        animation_opacity: null
    },

    methods: {
        //点击外部区域
        onModalClick() {
            // const {outside} = this.data;
            // if(outside){
            //     this.setData({show:false});
            // }
        },
        //点击内部区域
        onContentClick() {},
        preventTouchMove() {},
        //动画进入
        fadeIn() {
            this.setData({
                is_show: true
            });
            setTimeout(() => {
                this.setData({
                    animation: animationIn.scale(1).step().export()
                });
            }, TIME);
        },
        //动画离开
        fadeOut() {
            this.setData({
                animation: animationIn.scale(0).step().export()
            });
            setTimeout(() => {
                this.setData({
                    is_show: false
                });
            }, 80);
        }
    }
});