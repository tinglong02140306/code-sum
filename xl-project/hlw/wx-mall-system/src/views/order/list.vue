<template>
	<div class="app-container">

		<div class="filter-container" style="display:flex;">
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
			<el-input v-model="listQuery.product" clearable placeholder="商品名称/编号" style="width: 200px;margin-right:20px"
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.order_status" placeholder="状态" clearable class="filter-item"
			           style="width: 130px;margin-right:20px">
				<el-option v-for="item in orderOptions" :key="item.key" :label="item.label"
				           :value="item.key"/>
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
			style="width: 100%">
			<el-table-column align="center" label="订单ID" width="120">
				<template slot-scope="scope">
					<span>{{ scope.row.order_id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center" label="店铺">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="150px" label="商品名称" align="center">
				<template slot-scope="scope">
					<template v-for="(item,index) in scope.row.product_list">
						<el-row style="flex:1;">
							<el-col :span="24">
								<div>{{ item["product_name"] }}</div>
							</el-col>
						</el-row>
					</template>
				</template>
			</el-table-column>
			<el-table-column width="100px" label="品种规格" align="center">
				<template slot-scope="scope">
					<template v-for="(item,index) in scope.row.product_list">
						<el-row style="flex:1;">
							<el-col :span="24">
								<div>{{ item["sku_desc"] }}</div>
							</el-col>
						</el-row>
					</template>
				</template>
			</el-table-column>
			<el-table-column width="100px" label="单价" align="center">
				<template slot-scope="scope">
					<template v-for="(item,index) in scope.row.product_list">
						<el-row style="flex:1;">
							<el-col :span="24">
								<div>{{ item["price"] }}</div>
							</el-col>
						</el-row>
					</template>
				</template>
			</el-table-column>
			<el-table-column width="100px" label="商品数量" align="center">
				<template slot-scope="scope">
					<template v-for="(item,index) in scope.row.product_list">
						<el-row style="flex:1;">
							<el-col :span="24">
								<div>{{ item["quantity"] }}</div>
							</el-col>
						</el-row>
					</template>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="运费" width="110">
				<template slot-scope="{row}">
					<span>{{ row.freight }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="实付/元" width="110">
				<template slot-scope="{row}">
					<span>{{ row.pay_amount }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="下单时间">
				<template slot-scope="scope">
					<span>{{ scope.row.gmt_create }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="收货人" width="110">
				<template slot-scope="{row}">
					<span>{{ row.receiver }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="收货人电话" width="110">
				<template slot-scope="{row}">
					<span>{{ row.telphone }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="收货地址" width="220">
				<template slot-scope="{row}">
					<span>{{ row.address }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="订单状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.order_status | statusFilter">
						{{ orderStatusMap[row.order_status] }}
					</el-tag>
				</template>
			</el-table-column>
			<!--
			<el-table-column class-name="status-col" label="确认人" width="110">
				<template slot-scope="{row}">
					<span>{{ row.confirmor }}</span>
				</template>
			</el-table-column>
			-->
			<el-table-column class-name="status-col" label="下单用户" width="110">
				<template slot-scope="{row}">
					<span>{{ row.user_name }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="下单用户电话" width="110">
				<template slot-scope="{row}">
					<span>{{ row.link_phone }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="期望送达时间">
				<template slot-scope="scope">
					<span>{{ scope.row.expect_time }}</span>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" align="center" width="130" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleShip(row)"
					           v-if="(roles.includes('shop_admin') || row.shop_id === shopId) && row.order_status==='2'">
						发货
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<!--	发货  -->
		<el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="请确认是否发货"
		           :visible.sync="shippingDialog">
			<el-form ref="shipForm" :model="shipForm">
				<el-form-item hidden>
					<el-input
						disabled
						v-model="shipForm.order_id">
					</el-input>
				</el-form-item>
				<el-form-item
					prop="express_cron"
					:rules="[
			      { required: true, message: '物流公司不能为空'},
			    ]"
				>
					<el-input
						type="text"
						placeholder="请填写物流公司"
						v-model="shipForm.express_cron">
					</el-input>
				</el-form-item>
				<el-form-item
					prop="express_no"
					:rules="[
			      { required: true, message: '物流单号不能为空'},
			    ]"
				>
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4}"
						placeholder="请填写物流单号"
						v-model="shipForm.express_no">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="shippingDialog = false">
					取消
				</el-button>
				<el-button type="primary" @click="shipNow">
					发货
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import { fetchList, shipOrder } from "@/api/order";
	import { computeMonthRange, getToday } from "@/utils";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { orderStatusMap, orderOptions } from "@/utils/mapUtils";
	import { mapGetters } from "vuex";

	let interval = null;

	export default {
		name: "OrderList",
		components: { Pagination },
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
		},
		computed: {
			...mapGetters(["shopId", "roles"])
		},
		data(){
			return {
				list: null,
				listLoading: true,
				sumInfo: {},
				listQuery: {
					product: "",
					order_status: "",
					page: 1,
					limit: 10,
					date_range: ""
				},
				total: 0,
				orderStatusMap,
				orderOptions,
				shipForm: {
					order_id: "",
					express_cron: "",
					express_no: ""
				},
				shippingDialog: false,
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
				interval: null
			};
		},
		watch: {
			shippingDialog(){
				if(!this.shippingDialog) {
					this.$refs.shipForm.resetFields();
				}
			}
		},
		created(){
			let res = computeMonthRange();
			this.listQuery.date_range = [res.startDate, res.endDate];
			this.getList();
		},
		beforeDestroy(){
			if(interval) {
				window.clearInterval(interval);
				interval = null;
			}
		},
		methods: {
			handleFilter(){
				this.listQuery.page = 1;
				this.$nextTick(() => this.getList());
			},
			handleShip(row){
				this.$set(this.shipForm, "order_id", row.order_id);
				this.shippingDialog = true;
			},
			shipNow(){
				this.$refs.shipForm.validate(valid => {
					if(valid) {
						shipOrder(this.shipForm).then(() => {
							this.$notify.success("操作成功");
							this.shippingDialog = false;
							this.getList();
						}).catch(error => this.$message.error("操作失败"));
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				params.shop_id = this.shopId || "";
				if(this.listQuery.date_range) {
					params = Object.assign(params, {
						start_time: this.listQuery.date_range[0] + " 00:00:00",
						end_time: this.listQuery.date_range[1] + " 23:59:59",
					});
				}
				delete params.limit;
				delete params.date_range;
				fetchList(params).then(({ data: res }) => {
					this.list = res && res.order_list || [];
					this.sumInfo = res && res.sum_info || {};
					this.total = res.total || 0;
					this.listLoading = false;
					if(!interval) {
						interval = window.setInterval(() => this.getList(), 60000);
					}
				}).catch(error => {
					this.listLoading = false;
				});
			},
			getSummaries(param){
				const { columns } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = "合计";
						return;
					}
					if(index === 5) {
						sums[5] = this.sumInfo.sum_quantity;
					} else if(index === 6) {
						sums[6] = this.sumInfo.sum_freight;
					} else if(index === 7) {
						sums[7] = this.sumInfo.sum_amount;
					} else {
						sums[index] = "";
					}
				});
				return sums;
			},
		}
	};
</script>

<style scoped>
	.edit-input {
		padding-right: 100px;
	}

	.cancel-btn {
		position: absolute;
		right: 15px;
		top: 10px;
	}

	td.el-table_1_column_4 {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

	}

	.xxxx {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
