import {PreferenceMoney, PerferPull, PerferUsed, PerferLose, PerferQrcode,PreferenceCar} from '../../../../../assets/url/url'


Component({
    options: {
        multipleSlots:true
    },
    properties:{
        type:{
            type:Number,
            value:0,
            observer:function(oldVal){
                const radius = 8;
                const color = oldVal==0?'#074DB4':oldVal==1?'#B34E23':'#c6c6c6'
                const topLeft = oldVal==0?'#5BC7FF':oldVal==1?'#FFC854':'#c6c6c6';
                const bottomRight = oldVal==0?'#074DB4':oldVal==1?'#B34E23':'#c6c6c6';
                const titleColor = oldVal==4?'#999999':'#333333';
                const contentColor = oldVal==4?'#999999':'#333333';
                this.setData({
                    money_icon:PreferenceMoney,
                    titleColor:`color:${titleColor}`,
                    contentColor:`color:${contentColor}`,
                    moneyStyle:`text-shadow:6px 6px 12px ${color};`,
                    borderRadius:`border-bottom-left-radius: ${radius}rpx;`,
                    background:`background:linear-gradient(to bottom right, ${topLeft}, ${bottomRight});`,
                    backgroundG:`background:linear-gradient(to bottom right, ${'#44B291'}, ${'#164D3F'});`,
                    backgroundB:`background:linear-gradient(to bottom right, ${'#5BC7FF'}, ${'#074DB4'});`,
                    backgroundY:`background:linear-gradient(to bottom right, ${'#FFC854'}, ${'#B34E23'});`,
                    backgroundGray:`background:linear-gradient(to bottom right, ${'#999999'}, ${'#333333'});`,
                    finish_icon:oldVal==2?PerferUsed:PerferLose,
                });
            }
        },
        item:{
            type:Object,
            value:{},
            observer:function(oldVal,newVal){
                // this.setData({
                //     finish_icon:oldVal.coupon_status==2?PerferUsed:PerferLose,
                // })
            }
        },
        folding:{//当folding的值与data的coupon_put_id相同时 点击可展示使用规则
            type:String,
            value:'',
            observer:function(oldVal,newVal){
                if(this.properties.item.coupon_put_id!==newVal){
                    this.setData({
                        showRules:false,
                        borderRadius:`border-bottom-left-radius: 8rpx;`
                    });
                }
            }
        }
    },

    data:{
       money_icon:PreferenceMoney,
       car_icon:PreferenceCar,
       pull_icon:PerferPull,
       finish_icon:PerferUsed,
       prefer_qrcode:PerferQrcode,
       showRules:false,//是否展示使用规则 
       titleColor:'color:#333333',
       contentColor:'color:#666666',
       moneyStyle:'text-shadow:6px 6px 12px #1d85ff',
       borderRadius:'border-bottom-left-radius: 8rpx;',
       background:'background:linear-gradient(to bottom right, #73D4FE, #1378ff);',
        backgroundG:`background:linear-gradient(to bottom right, ${'#44B291'}, ${'#164D3F'});`,
        backgroundB:`background:linear-gradient(to bottom right, ${'#73D4FE'}, ${'#1378ff'});`,
        backgroundY:`background:linear-gradient(to bottom right, ${'#fad88a'}, ${'#f19156'});`,
       animation:null,
       rules:null
    },

    lifetimes:{
        
    },

    methods:{
        //设置默认使用优惠券
        onSetDefaultClick:function(){
            const {item} = this.properties;
            this.triggerEvent('default',item);
        },

        //选择去使用跳转
        onSetSelectClick:function(){
            const {item} = this.properties;
            this.triggerEvent('select',item);
        },

        //查看优惠券
        onSeeCouponClick:function(){
            console.log('llllput_id'+JSON.stringify(this.properties.item.put_id))
            const {item} = this.properties;
            this.triggerEvent('see',item.put_id);
        },

        //使用规则点击
        onSeeRuleClick:function(){
            const {item} = this.properties;
            const {showRules} = this.data;
            this.triggerEvent('rule',item.put_id);
            this.setData({
                showRules:!showRules,
                borderRadius:`border-bottom-left-radius: ${showRules?8:0}rpx;`
            })
        }
    }
})