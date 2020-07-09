const animation = wx.createAnimation({
    duration:150,
    timingFunction:'linear',
    delay:0,
});
const app = getApp();
let index = 0;
let countTimer = null;
let count = 59;
let keyboardHeight = 0;
const width = app.globalData.windowWidth;
Component({
    properties: {
        show:{
            type:Boolean,
            value:false,
            observer:function(newVal){
                if(newVal){
                    this.getCountTimer();
                    this.fadeIn();
                }else{
                    this.fadeOut();
                }
            }
        },
        mobile:{
            type:String,
            value:'------'
        },
        again:{
            type:Boolean,
            value:false,
            observer:function(newVal){
                const {isCanClick} = this.data;
                if(isCanClick&&newVal){
                    this.getCountTimer();
                }
            }
        }
    },

    data: {
        isShow:false,
        animationKeyboard:null,
        animationInput:null,
        isFix:((app.globalData.screenWidth/app.globalData.screenHeight)<0.5)?30:0,
        keyboard:[1,2,3,4,5,6,7,8,9,"",0,"d"],
        identify_code:["-","-","-","-","-","-"],
        countText:`${count}s后可重发`,
        isCanClick:false,
        itemKeyboardWidth:(width-2)/3
    },

    lifetimes: {
        detached: function() {
           this.clearTimer();
        },
    },

    methods: {
        //倒计时
        getCountTimer:function(){
            count = 60;
            countTimer = setInterval(()=>{
                if(count===1){
                    clearInterval(countTimer);
                    this.setData({
                        countText:`重新获取验证码`,
                        isCanClick:true,
                        again:false
                    });
                }else{
                    count--;
                    this.setData({
                        countText:`${count}s后可重发`,
                        isCanClick:false
                    });
                }
            },1000);
        },
        //清除倒计时
        clearTimer:function(){
            clearInterval(countTimer);
            countTimer = null;
            count = 59;
            this.setData({
                countText:`${count}s后可重发`,
                isCanClick:false
            });
        },
        //获取验证码点击事件
        onObtainClick:function(){
            const {isCanClick} = this.data;
            if(isCanClick){
                this.getCountTimer();
                this.triggerEvent('obtain');//重新获取验证码
            }
        },
        //关闭弹框
        onCloseClick:function(){
            this.triggerEvent('close');
            this.fadeOut();
        },
        //键盘点击事件
        onKeyboardItemClick:function(e){
            const item = e.currentTarget.dataset.item;
            const {identify_code} = this.data;
            identify_code[index] = item;
            this.setData({identify_code:identify_code});
            if(index===5){
                setTimeout(()=>{
                    this.fadeOut();
                    this.triggerEvent('identify',identify_code.join(''));//验证码输入完成
                },150);
            }else{
                index++;
            }
        },
        //键盘删除点击
        onKeyboardDelete:function(){
            const {identify_code} = this.data;
            if(index!==0){
                index--;
                identify_code[index] = '-';
                this.setData({identify_code:identify_code});
            }
        },
        //动画进入
        fadeIn:function(){
            this.setData({
                isShow:true
            });
            setTimeout(()=>{
                if(!keyboardHeight){
                    this.createSelectorQuery().select('#keyboard').boundingClientRect((rect)=>{
                        if(rect){
                            keyboardHeight = rect.height;
                            this.setData({
                                animationInput:animation.translateY(-rect.height).step().export(),
                                animationKeyboard:animation.translateY(0).step().export(),
                            });
                        }
                      }).exec()
                }else{
                    this.setData({
                        animationInput:animation.translateY(-keyboardHeight).step().export(),
                        animationKeyboard:animation.translateY(0).step().export(),
                    });
                }
               
            },100);
        },
        //动画离开
        fadeOut:function(){
            this.clearTimer();
            index = 0;
            this.setData({
                animationInput:animation.translateY(0).step().export(),
                animationKeyboard:animation.translateY(keyboardHeight).step().export()
            });
            setTimeout(()=>{
                this.setData({
                    show:false,
                    isShow:false,
                    identify_code:["—","—","—","—","—","—"]
                })
            },200); 
        }
     
    }
    
})