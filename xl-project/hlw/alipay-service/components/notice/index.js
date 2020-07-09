Component({
	props: {
		list: {
			type: Array,
			value: [1, 2, 3, 4]
		},
		items: {
			type: Number,
			value: 2
		}
	},
	data: {
		cmpArr: []
	},
	methods: {
		onTap(e){
			const { item } = e.currentTarget.dataset;
			this.props.onClick(item);
		}
	},
	didMount(){
		const list = this.props.list;
		let cmpArr = list.slice(1, list.length);
		cmpArr.push(list[0]);
		this.setData({ cmpArr });
	}
});