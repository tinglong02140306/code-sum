const TIME = 200;
const animationIn = wx.createAnimation({
    duration:TIME,
    timingFunction:"linear",
    delay:0,
});

const animatinOpacity = wx.createAnimation({
    duration:TIME,
    timingFunction:"linear",
    delay:0,
})

Component({
    properties:{
       show:{
           type:Boolean,
           value:false,
           observer:function(newVal){
                newVal?this.fadeIn():this.fadeOut();
           }
       },
       outside:{//点击外部是否关闭 true:关闭 false:不关闭
            type:Boolean,
            value:true,
       }
    },

    data:{
        is_show:false,
        animation:null,
        animation_opacity:null
    },

    methods:{
        //点击外部区域
        onModalClick:function(){
            const {outside} = this.data;
            if(outside){
                this.setData({show:false});
            }
        },
        //点击内部区域
        onContentClick:function(){},
        preventTouchMove:function(){},
        //动画进入
        fadeIn:function(){
            this.setData({is_show:true});
            setTimeout(()=>{
                this.setData({
                    animation:animationIn.scale(1).step().export()
                });
            },TIME);
        },
        //动画离开
        fadeOut:function(){
            this.setData({
                animation:animationIn.scale(0).step().export()
            });
            setTimeout(()=>{
                this.setData({is_show:false});
            },80);
        }
    }
});