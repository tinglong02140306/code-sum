<template>
	<div class="app-container">
		<panel-group :info="info"/>
		<div class="filter-container" style="display:flex;">
			<el-input v-model="listQuery.product" placeholder="商品名称/编号" style="width: 200px;margin-right:20px;"
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-date-picker
				style="margin-right:20px"
				v-model="listQuery.date_range"
				type="daterange"
				align="right"
				unlink-panels
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				value-format="yyyy-MM-dd"
				:picker-options="pickerOptions">
			</el-date-picker>
			<el-select v-model="listQuery.shop_id_arr" clearable filterable placeholder="请选择" class="filter-item"
			           style="width: 130px;margin-right:20px;">
				<el-option
					v-for="item in merchants"
					:key="item.key"
					:label="item.name"
					:value="item.key">
				</el-option>
			</el-select>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			:summary-method="getSummaries"
			show-summary
			highlight-current-row
			style="width: 100%;">
			<el-table-column label="序号" prop="id" align="center" width="80">
				<template slot-scope="{row,$index}">
					<span>{{ $index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column label="商品名称" width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.product_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="品种规格" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.sku_desc }}</span>
				</template>
			</el-table-column>
			<el-table-column label="成交量" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.sale_volume }}</span>
				</template>
			</el-table-column>
			<el-table-column label="退款量" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.refund_volume }}</span>
				</template>
			</el-table-column>
			<el-table-column label="实际销量" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.actual_volume }}</span>
				</template>
			</el-table-column>
			<el-table-column label="销量金额" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.sale_amount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="退款金额" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.refund_amount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="实际销售金额/元" width="180px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.actual_amount }}</span>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

	</div>
</template>

<script>
	import { getReport } from "@/api/report";
	import waves from "@/directive/waves"; // waves directive
	import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
	import { computeMonthRange, getToday } from "@/utils";
	import PanelGroup from "./components/PanelGroup";
	import { mapGetters } from "vuex";
	import { merchantChildren } from "@/api/merchant";

	export default {
		name: "OperationIndex",
		components: { Pagination, PanelGroup },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					published: "success",
					draft: "info",
					deleted: "danger"
				};
				return statusMap[status];
			},
			typeFilter(type){
				return calendarTypeKeyValue[type];
			}
		},
		computed: {
			...mapGetters(["shopId"])
		},
		data(){
			return {
				info: {},
				list: null,
				sumInfo:{},
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					product: undefined,
					date_range: "",
					shop_id_arr: ""
				},
				dateRange: [],
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
				merchants: []
			};
		},
		created(){
			this.listQuery.date_range = [getToday(), getToday()];
			this.$nextTick(() => {
				this.getList();
			});
			this.getMerchants();
		},
		methods: {
			getMerchants(){
				merchantChildren({shop_id: this.shopId,shop_status: ""}).then(({data:res}) => {
					let result = res.shop_list;
					let list = [];
					result.forEach(item => {
						let option = {};
						option.name = item.shop_name;
						option.key = item.shop_id;
						list.push(option);
						option = null;
					});
					list.unshift({"key": "",name: "全部店铺"});
					this.merchants = list;
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit,
					shop_id: this.shopId || ""
				};
				if(this.listQuery.date_range) {
					params = Object.assign(params,{
						start_time: this.listQuery.date_range[0] + " 00:00:00",
						end_time: this.listQuery.date_range[1] + " 23:59:59",
					})
				}
				delete params.limit;
				delete params.date_range;
				getReport(params).then(({data:res}) => {
					this.list = res.sale_list;
					this.total = res.total;
					this.sumInfo = res.sum_info;
					this.info = {
						total_sale_amount: res.total_sale_amount,
						day_sale_amount: res.day_sale_amount,
						total_freight: res.total_freight,
						day_freight: res.day_freight
					};
					this.listLoading = false;
				}).catch(error => {
					this.listLoading = false;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
			getSummaries(param){
				const { columns } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = "合计";
						return;
					}
					if(index === 3) {
						sums[3] = this.sumInfo.sum_sale_volume;
					} else if(index === 4) {
						sums[4] = this.sumInfo.sum_refund_volume;
					} else if(index === 5) {
						sums[5] = this.sumInfo.sum_actual_volume;
					} else if(index === 6) {
						sums[6] = this.sumInfo.sum_sale_amount;
					} else if(index === 7) {
						sums[7] = this.sumInfo.sum_refund_amount;
					} else if(index === 8) {
						sums[8] = this.sumInfo.sum_actual_amount;
					} else {
						sums[index] = "";
					}
				});
				return sums;
			},
		}
	};
</script>
