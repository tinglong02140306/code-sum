import { PLATE_COLOR } from './constants';

Component({
    props: {
        //默认选中的车牌颜色
        select: 0
    },

    data: {
        plate_color_list: PLATE_COLOR,
    },

    methods: {
        onPlateColorClick: function (e) {
            const {
                id
            } = e.currentTarget.dataset.item;
            this.setData({
                select: id
            });
            this.props.onPlateColorChange(id)
        }
    }
})