// pages/station/components/perferents/perferent-container/perferent-container.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Array,
      value:[],
      observer:function(oldVal){
        const data = oldVal&&oldVal.map(item=>{
          item.isOpen = false;
          item.isCheck = false;
          return item;
        });
        this.setData({list:data});
      }
  }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCheckClick:function(e){
      const {list} = this.data;
      const selectIndex = e.detail;
      const data = list&&list.map((item,index)=>{
        if(index==selectIndex){
          item.isCheck = !item.isCheck;
        }else{
          item.isCheck = false;
        }
        return item;
      });
      this.setData({list:data});
      const params = {
        index:selectIndex,
        status:data[selectIndex].isCheck
      }
      this.triggerEvent('check',params);
    },
    onRuleClick:function(e){
      const {list} = this.data;
      const selectIndex = e.detail;
      const data = list&&list.map((item,index)=>{
        if(index==selectIndex){
          item.isOpen = !item.isOpen;
        }else{
          item.isOpen = false;
        }
        return item;
      });
      this.setData({list:data});
    }
  }
})
