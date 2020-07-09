import {
    SUPPORT_TYPE
} from '../../constants/etc-type';
Component({
    props: {
        data: {
            etc_card_no: "",
            etc_card_no_str: "",
            car_plate_no: "",
            is_click: false
        }
    },
    data: {
        bg_color: '',
        card_name: ''
    },
    didMount() {
        this.processData(this.props.data);
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
        etcCarChange(e) {
            const item = e.currentTarget.dataset.item;
            this.props.onCarChange(item);
        },
        onUnbindClick(e) {
            const item = e.currentTarget.dataset.item;
            this.props.onUnbindClick(item);
        },
    },

});