import {provinces, letters} from '../../constants/plate_number';
let inputValue="";
Component({
    properties:{
       default_index:{
           type:Array,
           value:[0,0],
           observer:function(newVal){
                this.setData({
                    index:newVal,
                    header:`${provinces[newVal[0]]}${letters[newVal[1]]}`
                });
           }
       },
       input_value:{
           type:String,
           value:""
       }
    },
   
    data:{
        multiArray:[provinces,letters],
        header:`${provinces[0]}${letters[0]}`,
        index:[0,0]
    },
    methods:{
        onPickerChange:function(e){
            const value = e.detail.value;
            const header = `${provinces[value[0]]}${letters[value[1]]}`;
            this.setData({
                header:header,
                index:value
            });
            const params = {
                palte_no:`${inputValue}`,
                index : value,
                plate_header:`${header}`
            }
            this.triggerEvent('plateinput',params);
        },

        onInputChange:function(e){
            const value = e.detail.value;
            inputValue = value;
            const params = {
                palte_no:`${inputValue}`,
                index : this.data.index,
                plate_header:`${this.data.header}`
            }
            this.triggerEvent('plateinput',params);
        }
    }
});