import {SUPPORT_TYPE} from '../../constants/etc-type';
Component({
    properties: {
        data:{
            type:Object,
            value:{
                etc_card_no:"",
                etc_card_no_str:"",
                car_plate_no:"",
                is_click:false
            },
            observer:function(newVal){
                this.processData(newVal);
            }
        }
    },
    data: {
        bg_color:'',
        card_name:''
    },

    methods: {
        processData: function (newVal) {
            const card_type = SUPPORT_TYPE;
            if(newVal&&newVal.etc_card_no_str){
                let card_no = newVal.etc_card_no_str.substr(0, 2);
                for (let i = 0; i < card_type.length; i++) {
                    const item = card_type[i];
                    if (item.province_code == card_no) {
                        this.setData({
                            card_name:item.name,
                            bg_color:item.bg_color
                        })
                        break;
                    }
                    this.setData({
                        card_name: "未知卡",
                        bg_color: "#cf7e22",
                    })
                }
            }
        },
        etcClick:function (e) {
            console.log('itemclick'+JSON.stringify(e.currentTarget.dataset))

            const item = e.currentTarget.dataset.item;
            this.triggerEvent('itemclick',item);
        },
        etcCarChange:function(e){
            const  item = e.currentTarget.dataset.item;
            this.triggerEvent('carChange',item)

        },
        onUnbindClick:function(e){
            const  item = e.currentTarget.dataset.item;
            this.triggerEvent('unBindClick',item)

        },

    },

});
