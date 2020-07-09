let timerCount = null;

Component({
    properties:{
        control:{
            type:Boolean,
            value:false,
            observer:function(newVal){
                if(newVal){
                    this.countDown();
                }
            }
        }
    },
    data:{
        value:'获取验证码',
        count:60,
    },
    methods:{
        onIdentifyClick:function(){
            const {control} = this.data;
            if(!control){
                this.triggerEvent('identify');
            } 
        },
        //倒计时
        countDown:function(){
            if(timerCount){
                clearInterval(timerCount); 
            }
            const {count} = this.data;
            let countNow = count;
            countNow--;
            this.setData({
                count:countNow,
                value:countNow+"s后获取"
            });
            timerCount = setInterval(() => {
                if(countNow>1){
                    countNow--;
                    this.setData({
                        count:countNow,
                        value:countNow+"s后获取"
                    });
                }else{
                    clearInterval(timerCount);
                    this.setData({
                        count:60,
                        value:"重新获取",
                        control:false
                    });
                }
            }, 1000);
        }
    },
    pageLifetimes: {
        hide() {
            clearInterval(timerCount);
            this.setData({
                count:60,
                value:"获取验证码",
                control:false
            });
        },
      }
});