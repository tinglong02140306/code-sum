// components/drop-down/drop-down.js
const PullIcon  = '../../assets/static/drop-down-pull.png';
const UpIcon =  '../../assets/static/drop-down-up.png';
const CheckIcon = '../../assets/static/drop-down-check.png';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    space:{//文字与图标之间的间距
      type:Number,
      value:8
    },
    list:{
      type:Array,
      value:[],
      observer:function(newVal){
        const {list} = this.data;
        const data = list&&list.map(tab=>{
          const obj = {};
          obj.defaultTitle = (tab&&tab[0]&&tab[0].title)||"--",
          obj.defaultId = tab&&tab[0]&&tab[0].id,
          obj.data = tab;
          return obj;
        });
        this.setData({tabs:data});
      }
    },
    height:{//遮罩的高度
      type:String,
      value:""
    },
    tab_height:{//筛选栏高度
      type:Number,
      value:84
    },
    color:{//默认字体颜色
      type:String,
      value:'rgba(0,0,0,.45)'
    },
    selected_color:{//选中时字体颜色
      type:String,
      value:'#05BA7D'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    source:null,
    tabs:[],
    selected_index:-1,
    showMark:false,
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
      const {selected_index,showMark} = this.data;
      this.setData({
        source:this.data.list[index],
        selected_index:index,
        showMark:selected_index==index?!showMark:true
      });
    },
    //下拉item点击
    onItemClick:function(e){
      const item = e.currentTarget.dataset.item;
      const {tabs, selected_index} = this.data;
      if(tabs[selected_index].defaultId!=item.id){
        tabs[selected_index].defaultTitle = item.title;
        tabs[selected_index].defaultId = item.id;
        tabs[selected_index].data = item;
        this.setData({tabs:tabs});
        const data = tabs&&tabs.map(item=>{
          return item.defaultId
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
