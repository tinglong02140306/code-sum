Component({
	props: {
		label: {
			type: String,
		},
		idx: {
			type: String
		},
		placeholder: {
			type: String
		},
		type: {
			type: String,
			value: "text"
		},
		maxlength: {
			type: Number,
			value: -1
		},
		value: String,
		disabled: {
			type: Boolean,
			value: false
		},
		password: {
			type: Boolean,
			value: false
		}
	},
	data: {
		focus: false
	},
	methods: {
		bindInput(e){
			const val = e.detail.value;
			this.setData({ value: val });
			this.props.input({ key: this.data.idx, val });
		},
		clear(){
			this.setData({ value: "" });
			this.props.clear({ key: this.data.idx });
		},
		onFocus(){
			this.setData({ focus: true });
		},
		onBlur(){
			this.setData({ focus: false });
		}
	}
});
