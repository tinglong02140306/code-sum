import { provinces, letters } from '../../constants/plate_number';
let inputValue = "";
Component({
    props: {
        default_index: [0, 0],
        input_value: "",
    },
    data: {
        show: false,
        multiArray: [provinces, letters],
        headerText: `${provinces[0]}${letters[0]}`,
        indexValue: [0, 0]
    },
    methods: {
        onInputChange(e) {
            const value = e.detail.value;
            inputValue = value;
            const params = {
                palte_no: `${inputValue}`,
                index: this.data.indexValue,
                plate_header: `${this.data.headerText}`
            }
            this.props.onPlateChange(params);
        },
        pickerShow() {
            this.setData({
                show: true
            });
            this.popup.fadeIn();
        },
        onCancel() {
            this.setData({
                show: false
            });
            this.popup.fadeOut();
        },
        confirmClick(obj) {
            this.onCancel();
            if (obj.type == 1) {
                this.setData({
                    indexValue: obj.indexValue,
                    headerText: obj.headerText,
                });
                const params = {
                    palte_no: `${inputValue}`,
                    index: this.data.indexValue,
                    plate_header: `${this.data.headerText}`
                }

                this.props.onPlateChange(params)
            }
        },
        popupRef(ref) {
            this.popup = ref;
        }
    }
});