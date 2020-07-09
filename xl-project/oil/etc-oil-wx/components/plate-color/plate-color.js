import {PLATE_COLOR} from './constants';

Component({
    properties:{
        select:{//默认选中的车牌颜色
            type:Number,
            value:0
        }
    },

    data:{
        plate_color_list:PLATE_COLOR,
    },
   
    methods:{
        onPlateColorClick:function(e) {
            const {id} = e.currentTarget.dataset.item;
            this.setData({select:id});
            this.triggerEvent('platecolor',id);
        }
    }
})