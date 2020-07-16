<template>
	<div class="dashboard-editor-container" v-loading="loading">

		<panel-group :panelData="panelData"/>

		<el-row :gutter="8">

			<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
			        style="margin-bottom:30px;">
				<box-card title="商品统计信息">
					<div slot="content">
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								商品总数：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ productInfo["productNum"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								上架商品：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ productInfo["productSale"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								下架商品：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ productInfo["productNotSale"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								商品评论：
							</el-col>
							<el-col :span="12">
								<span style="color:orange;">{{ productInfo["productComments"] }}</span> 条
							</el-col>
						</el-row>
					</div>
				</box-card>
			</el-col>

			<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
			        style="margin-bottom:30px;">
				<box-card title="订单统计信息">
					<div slot="content">
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								未处理订单：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ orderInfo["orderHandle"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								待发货订单：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ orderInfo["orderSend"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								待售后订单：
							</el-col>
							<el-col :span="12">
								<span style="color:orange">{{ orderInfo["orderService"] }}</span> 个
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="12">
								已成交订单：
							</el-col>
							<el-col :span="12">
								<span style="color:orange;">{{ orderInfo["orderComplete"] }}</span> 条
							</el-col>
						</el-row>
					</div>
				</box-card>
			</el-col>

			<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
			        style="margin-bottom:30px;">
				<box-card title="订单金额统计">
					<div slot="content">
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="14">
								实际成交金额：
							</el-col>
							<el-col :span="10">
								<span style="color:orange">{{ amountInfo["amountTotal"] }}</span> 元
							</el-col>
						</el-row>
						<el-row :gutter="8" style="height:40px;line-height:40px;">
							<el-col :span="14">
								退款金额：
							</el-col>
							<el-col :span="10">
								<span style="color:orange">{{ amountInfo["amountRefund"] }}</span> 元
							</el-col>
						</el-row>
<!--						<el-row :gutter="8" style="height:40px;line-height:40px;">-->
<!--							<el-col :span="14">-->
<!--								实际营收金额：-->
<!--							</el-col>-->
<!--							<el-col :span="10">-->
<!--								<span style="color:orange">{{ amountInfo["amountRevenue"] }}</span> 元-->
<!--							</el-col>-->
<!--						</el-row>-->
					</div>
				</box-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import PanelGroup from "./components/PanelGroup";
	import BoxCard from "./components/BoxCard";
	import { fetchData } from "@/api/home";

	export default {
		name: "DashboardAdmin",
		components: { PanelGroup, BoxCard },
		data(){
			return {
				loading: true,
				panelData: {},
				productInfo: "",
				orderInfo: "",
				amountInfo: ""
			};
		},
		created(){
			this.getData();
		},
		methods: {
			getData(){
                this.loading = true;
                // TODO
                this.loading = false;
				fetchData().then(({ data: res }) => {
					this.panelData = {
						totalUsers: res.total_users || 0,
						totalOrders: res.total_orders || 0,
						totalRecords: res.amount_total || 0
					};
					this.productInfo = {
						productNum: res.product_num || 0,
						productSale: res.product_sale || 0,
						productNotSale: res.product_not_sale || 0,
						productComments: res.product_comments || 0
					};
					this.orderInfo = {
						orderHandle: res.order_handle || 0,
						orderSend: res.order_send || 0,
						orderService: res.order_service || 0,
						orderComplete: res.order_complete || 0
					};
					this.amountInfo = {
						amountTotal: res.amount_revenue || 0.00,
						amountRefund: res.amount_refund || 0.00,
					};
					this.loading = false;
				}).catch(error => {
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.dashboard-editor-container {
		padding: 32px;
		background-color: rgb(240, 242, 245);
		position: relative;

		.github-corner {
			position: absolute;
			top: 0px;
			border: 0;
			right: 0;
		}

		.chart-wrapper {
			background: #fff;
			padding: 16px 16px 0;
			margin-bottom: 32px;
		}
	}

	@media (max-width: 1024px) {
		.chart-wrapper {
			padding: 8px;
		}
	}
</style>
