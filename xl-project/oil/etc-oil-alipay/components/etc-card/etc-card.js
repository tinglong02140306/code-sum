import {
    SUPPORT_TYPE
} from '../../constants/etc-type';
Component({
    props: {
        list: {
            etc_card_no: "",
            etc_card_no_str: "",
            car_plate_no: "",
            is_click: false,
            is_enough: false,
        },
        height: `height:230rpx`
    },
    data: {
        bg_color: '',
        card_name: ''
    },
    didMount() {
        this.processData(this.props.list)
    },
    methods: {
        processData(newVal) {
            const card_type = SUPPORT_TYPE;
            if (newVal && newVal.etc_card_no_str) {
                let card_no = newVal.etc_card_no_str.substr(0, 2);
                for (let i = 0; i < card_type.length; i++) {
                    const item = card_type[i];
                    if (item.province_code == card_no) {
                        this.setData({
                            card_name: item.name,
                            bg_color: item.bg_color
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
        etcClick(e) {
            const item = e.currentTarget.dataset.item;
            this.props.onETCItemClick(item)
        },
        statusChange(e) {
            const item = e.currentTarget.dataset.item;
            this.props.onStatusChange(item)
        },
    },

});