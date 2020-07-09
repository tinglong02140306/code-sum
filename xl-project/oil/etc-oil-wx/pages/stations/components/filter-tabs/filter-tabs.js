const PullIcon  = '../../../../assets/static/drop-down-pull.png';
const UpIcon =  '../../../../assets/static/drop-down-up.png';
const CheckIcon = '../../../../assets/static/drop-down-check.png';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height:{//遮罩的高度
      type:String,
      value:""
    },
    tab_height:{//筛选栏高度
      type:Number,
      value:84
    },
    source:{
      type:Array,
      value:[],
      observer:function(newVal){
        this.setData({list:newVal});
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    showMark:false,
    mask_data:[],
    select_tab_index:-1,
    icon_pull:PullIcon,
    icon_up:UpIcon,
    icon_check:CheckIcon,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //菜单选项点击
    onMenuClick:function(e){
      const index = e.currentTarget.dataset.item;
      const {select_tab_index,showMark} = this.data;
      this.setData({
        mask_data:this.data.list[index],
        select_tab_index:index,
        showMark:select_tab_index==index?!showMark:true
      });
    },

    //下拉item点击
    onItemClick:function(e){
      const item = e.currentTarget.dataset.item;
      const {list, select_tab_index} = this.data;
      if(list[select_tab_index].default_id!=item.id){
        list[select_tab_index].default_title = item.title;
        list[select_tab_index].default_id = item.id;
        this.setData({
          list:list,
          mask_data:list[select_tab_index]
        });
        const data = list&&list.map(item=>{
          return item.default_id
        });
        this.triggerEvent('select',data);
      }
      this.setData({showMark:false})
    },

    onMarskClick:function(){
      this.setData({showMark:false});
    },

    preventTouchMove:function(){}
  }
})
