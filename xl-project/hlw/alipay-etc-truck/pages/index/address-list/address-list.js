import APIs from "../../../apis/index";
import { hideLoading, showLoading, showToast } from "../../../utils/util";
const app = getApp();


Page({
	data: {
		list: [],
		loaded: false
	},
	addNew(){
		app.globalData.uuidAddress = "";
		my.navigateTo({
			url: "/pages/index/add-address/add-address"
		});
	},
	delete(e) {
		const idx = e.currentTarget.dataset.idx;
		showLoading();
		APIs.addressRemove({ uuid_address: this.data.list[idx]["uuid_address"] }).then(() => {
			hideLoading();
			showToast("删除成功");
			setTimeout(() => {
				this.getList();
			},1500);
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	edit(e) {
		const idx = e.currentTarget.dataset.idx;
		app.globalData.uuidAddress = this.data.list[idx];
		my.navigateTo({
			url: "/pages/index/add-address/add-address"
		});
	},
	getList() {
		showLoading();
		APIs.addressQuery().then(res => {
			hideLoading();
      console.log(res,43)
      	let itemlist=res.result;
		console.log(itemlist,45)
		// let filterAddress= itemlist.filter(item => 
		// 	item.receive_address!=null||item.receive_province!=null||item.receive_city!=null||item.receive_area!=null
		// 	)
		let filterAddress= itemlist.filter(item => 
			(item.receive_address!=""&&item.receive_province!=""&&item.receive_city!=""&&item.receive_area!="")&&(item.receive_address!=null&&item.receive_province!=null&&item.receive_city!=null&&item.receive_area!=null)
			)
		// let filterList= filterAddress.filter(item => 
		// 	item.receive_province!=""
		// 	)
		// let filterCity= filterList.filter(item => 
		// 	item.receive_city!=""
		// 	)
		// let filterArea= filterCity.filter(item => 
		//     item.receive_area!=""
		// )
        console.log(filterAddress,58)
			this.setData({ list:filterAddress, loaded: true });
		}).catch(error => {
			hideLoading();
			console.log(error);
			showToast(error.message);
		});
	},
	select(e) {
		const idx = e.currentTarget.dataset.idx;
		app.globalData.uuidAddress = this.data.list[idx];
    console.log(app.globalData.uuidAddress,"-----------------------------------")
		setTimeout(() => {
			my.navigateBack();
		},50);
	},
	onShow() {
		this.getList();
	}
});
