const animation = wx.createAnimation({
    duration:150,
    timingFunction:'linear',
    delay:0,
});

Component({
    properties:{
        position:{
            type:String,
            value:'bottom'//bottom center
        },
        tab:{
            type:Boolean,
            value:false,
        },
        show:{
            type:Boolean,
            value:false,
            observer:function(newVal){
                const {position} = this.data;
                if(position==="bottom"){
                    if(newVal){
                        this.fadeIn();
                    }else{
                        this.fadeOut();
                    }
                }else{
                    this.setData({
                        isShow:newVal
                    });
                }
            }
        },
        outside:{//点击外部区域 是否关闭弹框
            type:Boolean,
            value:true
        }
    },

    data:{
        height:0,
        bottom_style:`bottom:0px;`,
        animation:null,
        isShow:false
    },

    methods:{
        preventTouchMove:function(){
        },
        //遮罩区域点击
        onMaskerClick:function(){
            const {outside} = this.data;
            if(outside){
                this.fadeOut();
            }
            this.triggerEvent('outside');
        },
        //内容区域点击
        onContentClick:function(){

        },
        //动画进入
        fadeIn:function(){
            if (this.data.tab){
                wx.hideTabBar();
            }
            this.setData({isShow:true});
            setTimeout(()=>{
                this.createSelectorQuery().select('#bottom').boundingClientRect((rect)=>{
                    if(rect){
                        this.setData({
                            height:rect.height,
                        });
                    }
                    this.setData({
                        animation:animation.translateY(0).step().export()
                    });
                  }).exec()
            },100);
        },
        //动画离开
        fadeOut:function(){
            const{height}= this.data;
            this.setData({
                animation:animation.translateY(height).step().export()
            });
            setTimeout(()=>{
                if (this.data.tab){
                    wx.showTabBar();
                }
                this.setData({
                    isShow:false,
                    show:false
                })
            },200);
        }
    }

})