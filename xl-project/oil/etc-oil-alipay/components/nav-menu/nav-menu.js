import { STATIONPAGE } from '../../constants/global';
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
    props: {
        list: [],
        color: color,
        selected_color: selected_color,
        //选中下划线颜色
        border_color: border_color,
        border_width: border_width,
        //菜单之间的间距
        space: 20,
        page_type: 0
    },

    /**
     * 组件的初始数据
     */
    data: {
        style: `color:${color};text-align: center;`,
        selected_style: `color:${selected_color};text-align: center;`,
        border_style: `height:${border_width}px;background-color: transparent;`,
        selected_border_style: `height:${border_width}px;background-color: ${border_color};`
    },
    didMount() {
        this.setData({
            style: `color:${this.props.color};text-align: center;`,
            selected_style: `color:${this.props.selected_color};text-align: center;`,
            border_style: `height:${this.props.border_width}px;background-color: transparent;`,
            selected_border_style: `height:${this.props.border_width}px;background-color: ${this.props.border_color};`,
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //item 点击事件
        menuClick(e) {
            const index = e.currentTarget.dataset.item;
            if(this.props.page_type != index) {
                this.props.onClick(index);
            }
        }
    }
})