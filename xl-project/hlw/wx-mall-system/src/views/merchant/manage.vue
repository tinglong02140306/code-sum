<template>
	<div class="app-container" v-loading="loading">
		<div class="section-header">
			商户信息
			<!--			<el-button style="margin-left:30px;">编辑</el-button>-->
			<!--			<el-button style="margin-left:30px;">保存</el-button>-->
			<el-button style="float:right" @click="handleClick">本月账单</el-button>
		</div>
		<el-divider style="margin:0 !important;"></el-divider>
		<div style="width:800px;border-bottom:1px solid #eee;padding-bottom:20px;padding-left:50px;">
			<el-row :gutter="5" style="height:50px;line-height:50px;">
				<el-col :span="10">{{ shopInfo.shop_name }}</el-col>
				<el-col :span="14">商户号：{{ shopInfo.shop_id }}</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">信联支付账户：</el-col>
				<el-col :span="12">{{ shopInfo.mch_id_consume }}</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">信联退款账户：</el-col>
				<el-col :span="12">{{ shopInfo.mch_id_refund }}</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">联系电话：</el-col>
				<el-col :span="12">{{ shopInfo.mobile }}</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">门店地址：</el-col>
				<el-col :span="18">{{ shopInfo.address }}</el-col>
			</el-row>
			<el-row :gutter="5" style="height:50px;line-height:50px;">
				<el-col :span="5">
					包邮起步费：
				</el-col>
				<el-col :span="6">
					<p style="height:100%;line-height:100%">{{ shopInfo.free_delivery }}元</p>
				</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">
					营业时间：
				</el-col>
				<el-col :span="3">
					<p style="height:100%;line-height:100%">{{ shopInfo.open_time_start }}</p>
				</el-col>
				<el-col :span="1">
					<p style="height:100%;line-height:100%">至</p>
				</el-col>
				<el-col :span="4">
					<p style="height:100%;line-height:100%">{{ shopInfo.open_time_end }}</p>
				</el-col>
			</el-row>
			<el-row :gutter="20" style="height:50px;line-height:50px;">
				<el-col :span="5">
					店铺状态：
				</el-col>
				<el-col :span="6">
					<el-radio disabled :value="shopInfo.shop_status" label="1">启用</el-radio>
					<el-radio disabled :value="shopInfo.shop_status" label="2">停用</el-radio>
				</el-col>
			</el-row>
		</div>
		<div class="section-header">
			分店信息
		</div>
		<el-divider></el-divider>
		<!--	分店信息	-->
		<template v-for="shop in subShops">
			<sub-branch :shop="shop" :key="shop.sub_shop_id"></sub-branch>
		</template>

		<!--	订单明细	-->
		<el-dialog width="60%" :close-on-click-modal="false" :close-on-press-escape="false" title="订单明细"
		           :visible.sync="dialogFormVisible">
			<div class="filter-container" style="display:flex;">
				<template v-if="shopOptions.length">
					<el-select v-model="listQuery.shop" class="filter-item"
					           style="width: 130px;margin-right:20px">
						<el-option v-for="(item,index) in shopOptions" :key="index" :label="item.label" :value="item.value"/>
					</el-select>
				</template>
				<el-date-picker
					style="margin-right:20px"
					v-model="listQuery.time_range"
					type="daterange"
					align="right"
					unlink-panels
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd"
					:picker-options="pickerOptions">
				</el-date-picker>
				<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
					搜索
				</el-button>
			</div>

			<el-row>
				<el-col :span="5">订单数量：{{ sumInfo.sum_quantity }}</el-col>
				<el-col :span="5">订单总额：{{ sumInfo.sum_pay_amount }}</el-col>
				<el-col :span="5">退款总额：{{ sumInfo.sum_refund_amount }}</el-col>
				<el-col :span="5">实收金额：{{ sumInfo.sum_amount }}</el-col>
			</el-row>
			<br/>

			<el-table
				:key="tableKey"
				v-loading="listLoading"
				:data="list"
				border
				fit
				highlight-current-row
				style="width: 100%;"
			>
				<el-table-column label="下单日期" width="150px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.gmt_create }}</span>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" min-width="150px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.product_name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="金额" width="110px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.amount }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单状态" width="110px" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.order_status | statusFilter">
							{{ orderStatusMap[row.order_status] }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="收货人" width="80px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.receiver }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系方式" align="center" width="95">
					<template slot-scope="{row}">
						<span>{{ row.telphone }}</span>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			            @pagination="getList"/>
		</el-dialog>
	</div>
</template>

<script>
	import { merchantBill } from "@/api/merchant";
	import waves from "@/directive/waves"; // waves directive
	import { parseTime } from "@/utils";
	import SubBranch from "./components/Subbranch"; // secondary package based on el-pagination
	import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
	import { merchantInfo, merchantAnalysis } from "@/api/merchant";
	import { orderStatusMap } from "@/utils/mapUtils";
	import { computeMonthRange, getToday } from "@/utils";
	import { mapGetters } from "vuex";

	export default {
		components: { SubBranch, Pagination },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					"1": "success",
					"3": "success",
					"2": "info",
					"4": "info",
					"99": "danger"
				};
				return statusMap[status];
			},
			typeFilter(type){
				return calendarTypeKeyValue[type];
			}
		},
		computed: {
			...mapGetters(["shopId", "level"])
		},
		data(){
			return {
				tableKey: 0,
				list: null,
				total: 0,
				loading: true,
				listLoading: false,   // Dialog表格loading
				listQuery: {
					page: 1,
					limit: 10,
					shop: "",
					time_range: ""
				},
				orderStatusMap,
				sumInfo: {},
				shopInfo: {},
				subShops: [],
				shopOptions: [],
				dialogFormVisible: false,
				pickerOptions: {
					shortcuts: [{
						text: "本月",
						onClick(picker){
							let res = computeMonthRange();
							picker.$emit("pick", [res.startDate, res.endDate]);
						}
					}, {
						text: "上月",
						onClick(picker){
							let res = computeMonthRange(new Date().getMonth());
							picker.$emit("pick", [res.startDate, res.endDate]);
						}
					}, {
						text: "今天",
						onClick(picker){
							picker.$emit("pick", [getToday(), getToday()]);
						}
					}]
				},
			};
		},
		created(){
			let res = computeMonthRange();
			this.listQuery.time_range = [res.startDate, res.endDate];
			this.$nextTick(() => {
				this.getInfo();
			});
		},
		methods: {
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					shop_id: this.listQuery.shop,
					per_num: this.listQuery.limit
				};
				if(this.listQuery.time_range) {
					params = Object.assign(params, {
						start_time: this.listQuery.time_range[0] + " 00:00:00",
						end_time: this.listQuery.time_range[1] + " 23:59:59",
					});
				}
				delete params.limit;
				delete params.shop;
				delete params.time_range;
				merchantBill(params).then(({ data: res }) => {
					this.sumInfo = res.sum_info;
					this.list = res.order_list;
					this.total = res.total;
					console.log(this.list);
					this.listLoading = false;
				}).catch(error => {
					console.log(error);
					this.listLoading = false;
				});
			},
			handleClick(){
				this.dialogFormVisible = true;
				this.getList();
			},
			// 异步获取经营信息
			async getOperationInfo(){
				let subShops = this.subShops;
				if(this.level === "2") {
					subShops = subShops.filter(item => item.sub_shop_id === this.shopId);
				}
				let range = computeMonthRange();
				let params = {
					page: 1,
					per_num: 999,
					start_time:range.startDate + " 00:00:00",
					end_time: range.endDate + " 23:59:59"
				};
				const promises = subShops.map(shop => merchantBill({ shop_id: shop.sub_shop_id,...params }));
				for(const promise of promises) {
					const { data: shop } = await promise;
					let index = this.subShops.findIndex(item => item.sub_shop_id === shop.shop_id);
					let temp = {
						...this.subShops[index],
						total_num: shop.sum_info.sum_quantity,
						total_amount: shop.sum_info.sum_pay_amount
					};
					this.$set(this.subShops, index, temp);
					temp = null;
				}
			},
			generateOptions(){
				let opts = [];
				if(this.shopInfo && this.shopInfo.shop_id) {
					console.log(this.shopInfo);
					let temp = {
						label: this.shopInfo.shop_name,
						value: this.shopInfo.shop_id
					};
					opts.push(temp);
					temp = null;
				}
				if(this.subShops.length) {
					let subShops = this.subShops;
					subShops.forEach(item => {
						let temp = {
							label: item.sub_shop_name,
							value: item.sub_shop_id
						};
						opts.push(temp);
						temp = null;
					});
				}
				console.log(opts);
				let result = opts;
				if(this.level === "2") {
					result = opts.filter(item => item.value === this.shopId);
				}
				this.listQuery.shop = result[0].value;
				this.shopOptions = result;
			},
			getInfo(){
				this.loading = true;
				let shop_id = this.$route.params && this.$route.params.id;
				merchantInfo({ shop_id, is_query_sub_shop: "1" }).then(({ data: res }) => {
					this.shopInfo = {
						"shop_id": res.shop_id,
						"shop_name": res.shop_name,
						"mobile": res.mobile,
						"address": res.address,
						"ship_area": res.ship_area,
						"image": res.image,
						"free_delivery": res.free_delivery,
						"open_time_start": res.open_time_start,
						"open_time_end": res.open_time_end,
						"shop_status": res.shop_status,
						"level": res.level,
						"head_shop_id": res.head_shop_id,
						"mch_id_consume": res.mch_id_consume,
						"mch_id_refund": res.mch_id_refund
					};
					this.subShops = res.sub_shop_list;
					this.loading = false;
					this.generateOptions();
					this.getOperationInfo();
				}).catch(error => {
					console.log(error);
					this.loading = false;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
		}
	};
</script>

<style scoped>
	.section-header {
		margin-top: 20px;
		width: 800px;
		height: 60px;
		line-height: 60px;
	}
</style>
