<template>
	<div class="sub-branch-container">
		<el-row :gutter="5" style="height:50px;line-height:50px;">
			<el-col :span="10">{{ shop.sub_shop_name }}</el-col>
			<el-col :span="14">商户号：{{ shop.sub_shop_id }}</el-col>
<!--			<el-col :span="3">-->
<!--				<el-button type="primary">编辑</el-button>-->
<!--			</el-col>-->
<!--			<el-col :span="3">-->
<!--				<el-button>保存</el-button>-->
<!--			</el-col>-->
		</el-row>
		<el-row :gutter="5" style="height:50px;line-height:50px;" v-if="shop.mch_id_consume">
			<el-col :span="5">
				信联支付账户：
			</el-col>
			<el-col :span="6">
				<p style="height:100%;line-height:100%">{{ shop.mch_id_consume }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="5" style="height:50px;line-height:50px;" v-if="shop.mch_id_refund">
			<el-col :span="5">
				信联退款账户：
			</el-col>
			<el-col :span="6">
				<p style="height:100%;line-height:100%">{{ shop.mch_id_refund }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="height:50px;line-height:50px;">
			<el-col :span="5">联系电话： </el-col>
			<el-col :span="7">{{ shop.sub_mobile }}</el-col>
			<template v-if="shop.total_num != null">
				<el-col :span="5">当月订单量：</el-col>
				<el-col :span="7"> {{ shop.total_num }}</el-col>
			</template>
		</el-row>
		<el-row :gutter="20" style="height:50px;line-height:50px;">
			<el-col :span="5">门店地址：</el-col>
			<el-col :span="7"> {{ shop.sub_address }}</el-col>
			<template v-if="shop.total_amount != null">
				<el-col :span="5">当月订单金额：</el-col>
				<el-col :span="7">￥{{ shop.total_amount }}</el-col>
			</template>

		</el-row>
		<el-row :gutter="5" style="height:50px;line-height:50px;">
			<el-col :span="5">
				包邮起步费：
			</el-col>
			<el-col :span="6">
				<p style="height:100%;line-height:100%">{{ shop.sub_free_delivery }}元</p>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="height:50px;line-height:50px;" v-if="shop.sub_open_time_start">
			<el-col :span="5">
				营业时间：
			</el-col>
			<el-col :span="3">
				<p style="height:100%;line-height:100%">{{ shop.sub_open_time_start }}</p>
			</el-col>
			<el-col :span="1">
				<p style="height:100%;line-height:100%">至</p>
			</el-col>
			<el-col :span="4">
				<p style="height:100%;line-height:100%">{{ shop.sub_open_time_end }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="height:50px;line-height:50px;">
			<el-col :span="5">
				店铺状态：
			</el-col>
			<el-col :span="6">
				<el-radio disabled v-model="shop.sub_shop_status" label="1">启用</el-radio>
				<el-radio disabled v-model="shop.sub_shop_status" label="0">停用</el-radio>
			</el-col>
		</el-row>
	</div>
</template>

<script>

	export default {
		props: {
			shop: {
				required: true,
				type: Object,
			}
		}
	};
</script>

<style scoped>
.sub-branch-container{
	width: 800px;
	padding-bottom: 20px;
	padding-left: 50px;
	border-bottom: 1px solid #eee;
}
</style>
