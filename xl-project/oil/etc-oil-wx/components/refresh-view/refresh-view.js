const app = getApp();
const height = app.globalData.screenHeight;
let _startY = -1;
let _top = -1;
const PULL_HEIGHT = 30;
const PULL_MAX_HEIGHT = 60;
Component({
    properties:{
        lower_threshold:{//距底部多远时，触发 loadmore 事件
            type:Number,
            value:50
        },
        up_threshold:{//下拉多远时，触发下拉刷新事件 refresh
            type:Number,
            value:80
        }
    },

    data:{
        transform:"translate3d(0,0,0)",
        refreshText:''
    },

    methods:{
        //手指触摸屏幕
        onTouchStart:function(e){
            _startY = e.touches[0].clientY;
        },
        //手指在屏幕上移动
        onTouchMove:function(e){
            //滚动到最顶端
            if(_top<=0){
                let _clientY = e.touches[0].clientY;
                let _diffY = _clientY-_startY;
                const ratio = _diffY / height;
                let dy = _diffY * (1 - ratio) * 0.6;//添加下拉阻尼
                if(_diffY>0){//下拉
                    this.setData({
                        transform:`translate3d(0,${dy}px,0)`,
                        refreshText:dy>PULL_MAX_HEIGHT?"松开刷新":"下拉刷新"
                    });
                    // if(dy >= PULL_HEIGHT){
                    //     if(dy >= PULL_MAX_HEIGHT){
                    //         this.setData({refreshText:"松开刷新"})
                    //         this.triggerEvent('refresh');
                    //         return
                    //     }
                    //     this.setData({refreshText:"下拉刷新"})
                    // }
                }
            }
        },
        //手指离开屏幕
        onTouchEnd:function(){
            this.setData({transform:`translate3d(0,0,0)`})
        },
        //滚动到底部时触发
        onSrollBottom:function(){
            this.triggerEvent('loadmore');
        },
        //滚动时触发
        onSroll:function(e){
            const top = e.detail.scrollTop;
            _top = top;
        }
    }

})