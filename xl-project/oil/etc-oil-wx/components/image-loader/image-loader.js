
Component({
    properties: {
        width:{
            type:String,
            value:"200rpx"
        },
        height:{
            type:String,
            value:"200rpx"
        },
        src:{//图片路径 绝对路径
            type:String,
            value:""
        },
        css:{//image 样式
            type:String,
            value:"",
        },
        mode:{//图片裁剪、缩放的模式
            type:String,
            value:"scaleToFill",
        },
        default:{//默认图片
            type:String,
            value:""
        }
    },

    data: {
        loadFinish:false
    },

    methods: {
        //当图片载入完毕时触发
        onLoadImage:function(e){
            this.setData({
                loadFinish:true
            });
        },
        //当错误发生时触发
        onErrorImage:function(e){
            this.setData({
                loadFinish:false
            });
        }
    
    }
    
})