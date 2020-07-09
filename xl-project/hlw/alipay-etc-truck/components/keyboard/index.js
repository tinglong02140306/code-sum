Component({
	props: {
		//数字键盘是否可以点击
		tapNum: false,
		isProvince:true
	},
	data: {
		number: ['1','2','3','4','5','6','7','8','9','0'],
		provinces:[['京','津','沪','渝','苏','浙','豫','粤','川','陕'],['冀','辽','吉','皖','闽','鄂','湘','鲁','晋','黑'],['赣','贵','甘','桂','琼','云','青','蒙','藏','宁'],['新']],
		alphas: [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L','Z'],['X','C','V','B','N','M']],
	},
	methods: {
		selectProvince(e){
			const idx = e.currentTarget.dataset.idx;
			if(idx == 'del'){
				this.props.onDel();
			}else if(idx == 'confirm'){
				this.props.onConfirm();
			}else{
				this.props.onInput(idx);
			}
		},
		selectNumber(e){
			if(this.props.tapNum){
				const number = e.currentTarget.dataset.idx;
				this.props.onInput(number);
			}
		},
		selectAlpha(e){
			const alpha = e.currentTarget.dataset.idx;
			if(alpha == 'del'){
				this.props.onDel();
			}else if(alpha == 'confirm'){
				this.props.onConfirm();
			}else{
				this.props.onInput(alpha);
			}
		}
	}
});
