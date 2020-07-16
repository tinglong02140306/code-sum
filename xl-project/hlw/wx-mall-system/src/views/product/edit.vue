<template>
	<product-detail :is-edit="true" :product-info="info" :templates="templates" :merchants="list" v-if="ready"/>
</template>

<script>
	import ProductDetail from "./components/ProductDetail";
	import { getTemplates, productInfo } from "@/api/product";
	import { merchantChildren } from "@/api/merchant";
	import { mapGetters } from "vuex";

	export default {
		name: "EditProduct",
		components: { ProductDetail },
		data(){
			return {
				templates: [],
				info: {},
				ready: false,
				list: []
			};
		},
		computed: {
			...mapGetters(["shopId"])
		},
		async created(){
			if(!this.shopId) {
				let { data: res } = await merchantChildren({ shop_id: "", shop_status: "" });
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
			}
			const product_id = this.$route.params && this.$route.params.id;
			let [{ data: templates }, { data: info }] = await Promise.all([getTemplates({ shop_id: this.shopId }), productInfo({ product_id })]);
			let list = [];
			templates.list.forEach(item => {
				let temp = {};
				temp.label = item.template_name;
				temp.value = item.template_id;
				list.push(temp);
				temp = null;
			});
			this.templates = list;
			info.image_url_arr = info.image_arr;
			// 如果规格型号为空  给他一个默认的空值  不然无法编辑
			if(info.specs_list.length === 0) {
				let temp = {
					specs_name: "",
					price: "",
					weight: 0
				};
				info.specs_list.push(temp);
				temp = null;
			}
			console.log(info);
			this.info = info;
			this.ready = true;
		}
	};
</script>

