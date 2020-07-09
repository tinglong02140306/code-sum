// components/nav-menu/nav-menu.js
let color = "rgba(0,0,0,.45)";
let selected_color = "rgba(0,0,0,.85)";
let text_style = "font-size:38rpx;font-weight: bold;";
let border_color = "#05BA7D";
let border_width = 2;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[]
    },
    color:{//默认字体颜色
      type:String,
      value:color
    },
    selected_color:{//选中时字体颜色
      type:String,
      value:selected_color
    },
    border_color:{//选中下划线颜色
      type:String,
      value:border_color
    },
    border_width:{
      type:Number,
      value:border_width
    },
    selected_index:{
      type:Number,
      value:0
    },
    space:{//菜单之间的间距
      type:Number,
      value:20
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style:`color:${color};text-align: center;`,
    selected_style:`color:${selected_color};text-align: center;`,
    border_style:`height:${border_width}px;background-color: transparent;`,
    selected_border_style:`height:${border_width}px;background-color: ${border_color};`,
    selected_index:0
  },

  lifetimes:{
    attached: function() {
      this.setData({
        style:`color:${this.data.color};text-align: center;`,
        selected_style:`color:${this.data.selected_color};text-align: center;`,
        border_style:`height:${this.data.border_width}px;background-color: transparent;`,
        selected_border_style:`height:${this.data.border_width}px;background-color: ${this.data.border_color};`,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //item 点击事件
    onMenuClick:function(e){
      const index = e.currentTarget.dataset.item;
      if(this.data.selected_index!=index){
        this.setData({selected_index:index});
        this.triggerEvent('menu',index);
      }
    }
  }
})
