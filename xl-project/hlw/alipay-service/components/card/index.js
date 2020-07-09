Component({
	props: {
		type: {
			type: String,
			value: "guess"
		}
	},
	methods: {
		onCardRefresh(){
			this.props.onRefresh();
		}
	}
});