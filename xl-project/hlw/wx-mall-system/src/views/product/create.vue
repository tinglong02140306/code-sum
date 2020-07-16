<template>
	<product-detail :is-edit="false" :product-info="productInfo" :templates="templates" :merchants="list" />
</template>

<script>
	import ProductDetail from "./components/ProductDetail";
	import { getTemplates } from "@/api/product";
	import { merchantChildren } from "@/api/merchant";
	import { mapGetters } from "vuex";

	export default {
		name: "CreateProduct",
		components: { ProductDetail },
		data(){
			return {
				templates: [],
				productInfo: {
					serial_no: "",
					applicant: "",
					apply_time: "",
					product_id: "",
					product_name: "",
					shop_id: "",
					template_id: "",
					priority: 0,
					detail: "",
					image_list: [],
					specs_list: [{
						specs_name: "",
						price: "",
						weight: 0
					}],
				},
				list: []
			};
		},
		computed: {
			...mapGetters(["shopId"])
		},
		created(){
			if(!this.shopId) {
				merchantChildren({shop_id: "",shop_status: "1"}).then(({data:res}) => {
					let result = res.shop_list;
					let list = [];
					result.forEach(item => {
						let option = {};
						option.name = item.shop_name;
						option.key = item.shop_id;
						list.push(option);
						option = null;
					});
					this.list = list;
					getTemplates({shop_id: this.shopId}).then(({ data: res }) => {
						let list = [];
						res.list.forEach(item => {
							let temp = {};
							temp.label = item.template_name;
							temp.value = item.template_id;
							list.push(temp);
							temp = null;
						});
						console.log(list);
						this.templates = list;
					});
				});
			} else {
				getTemplates({shop_id: this.shopId}).then(({ data: res }) => {
					let list = [];
					res.list.forEach(item => {
						let temp = {};
						temp.label = item.template_name;
						temp.value = item.template_id;
						list.push(temp);
						temp = null;
					});
					console.log(list);
					this.templates = list;
				});
			}
		}
	};
</script>

