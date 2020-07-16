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
			<el-input v-model="listQuery.serial_no" placeholder="申请售后单ID" style="width: 200px;margin-right:20px"
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-input v-model="listQuery.order_id" placeholder="订单ID" style="width: 200px;margin-right:20px" clearable
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-input v-model="listQuery.applicant_info" placeholder="申请人/申请人电话" style="width: 200px;margin-right:20px"
			          clearable
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item"
			           style="width: 130px;margin-right:20px">
				<el-option v-for="item in salesOptions" :key="item.key" :label="item.label"
				           :value="item.key"/>
			</el-select>
			<el-select v-model="listQuery.shop_id" placeholder="店铺" clearable class="filter-item"
			           style="width: 130px;margin-right:20px">
				<el-option v-for="item in shopOptions" :key="item.key" :label="item.label"
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
			highlight-current-row
			style="width: 100%">
			<el-table-column align="center" label="售后申请单ID" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.serial_no }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="订单ID">
				<template slot-scope="scope">
					<span>{{ scope.row.order_id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="150px" label="店铺" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="原因备注" width="180">
				<template slot-scope="{row}">
					<span>{{ row.refund_reason }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="商品名称" width="110">
				<template slot-scope="{row}">
					<span>{{ row.product_name }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="品种规格" width="110">
				<template slot-scope="{row}">
					<span>{{ row.sku_desc }}</span>
				</template>
			</el-table-column>
			<el-table-column width="80px" align="center" label="商品数量">
				<template slot-scope="scope">
					<span>{{ scope.row.quantity }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="运费" width="110">
				<template slot-scope="{row}">
					<span>{{ row.freight }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="实付/元" width="110">
				<template slot-scope="{row}">
					<span>{{ row.amount }}</span>
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
			<el-table-column class-name="status-col" label="收货地址" width="180">
				<template slot-scope="{row}">
					<span>{{ row.address }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="订单状态" width="120">
				<template slot-scope="{row}">
					<el-tag type="info">
						{{ salesStatusMap[row.order_status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="预计送达时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.gmt_received }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="下单时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.order_time }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="申请售后时间">
				<template slot-scope="scope">
					<span>{{ scope.row.after_sale_time }}</span>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" align="center" width="280" class-name="small-padding"
			                 style="min-width:60px;">
				<template slot-scope="{row,$index}">
					<template
						v-if="(roles.includes('shop_admin') || row.shop_id === shopId) && ((row.order_status === '1' || row.order_status === '4'))">
						<el-button type="primary" size="mini" @click="showRefundDialog(row)">
							退款
						</el-button>
						<el-button size="mini" type="success" @click="showRefuseDialog(row)">
							拒绝
						</el-button>
					</template>
					<!--
						<el-button size="mini" @click="showDeliveryDialog(row)">
							查看物流
						</el-button>
					-->
					<template
						v-if="row.order_status === '2' || row.order_status === '3' || row.order_status === '4' || row.order_status === '5'">
						<el-button size="mini" @click="showDetailDialog(row)">
							处理详情
						</el-button>
					</template>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<!--	退款  -->
		<el-dialog :close-on-click-modal="false" :visible.sync="refundDialog" title="请确认退款金额">
			<el-form ref="refundForm" :model="refundForm">
				<el-form-item><p style="color:red;margin:0;">当前金额包含运费，退款时请注意核对！！</p></el-form-item>
				<el-form-item
					prop="serial_no"
					hidden
				>
					<el-input
						disabled
						v-model="refundForm.serial_no">
					</el-input>
				</el-form-item>
				<el-form-item
					prop="refund_amount"
					:rules="[
			      { required: true, message: '退款金额不能为空'},
			    ]"
				>
					<el-input
						type="number"
						placeholder="请填写退款金额"
						v-model="refundForm.refund_amount">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="refundDialog = false">
					取消
				</el-button>
				<el-button type="primary" @click="handleRefund">
					确认
				</el-button>
			</div>
		</el-dialog>

		<!--	拒绝  -->
		<el-dialog :close-on-click-modal="false" :visible.sync="refuseDialog">
			<el-form ref="refuseForm" :model="refuseForm">
				<el-form-item
					prop="serial_no"
					hidden
				>
					<el-input
						disabled
						v-model="refuseForm.serial_no">
					</el-input>
				</el-form-item>
				<el-form-item
					prop="reject_reason"
					:rules="[
			      { required: true, message: '拒绝原因不能为空'},
			    ]"
				>
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4}"
						placeholder="请填写拒绝原因"
						v-model="refuseForm.reject_reason">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="refuseDialog = false">
					取消
				</el-button>
				<el-button type="primary" @click="handleRefuse">
					确认
				</el-button>
			</div>
		</el-dialog>

		<!--	查看物流  -->
		<el-dialog :close-on-click-modal="false" :visible.sync="deliveryInfoDialog">
			<div style="margin: 20px;">
				<el-steps :active="1" align-center>
					<template v-for="step in deliveryInfo.express_info">
						<el-step :title="step.express_process" :description="step.time"></el-step>
					</template>
				</el-steps>
			</div>
			<p style="font-size:28px;text-align:center;">用时：{{ deliveryInfo.total_time }}</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="deliveryInfoDialog = false">
					确定
				</el-button>
			</div>
		</el-dialog>

		<!--	处理详情  -->
		<el-dialog :close-on-click-modal="false" :visible.sync="processDialog">
			<div style="padding:0 30px">
				<el-row style="height:50px;line-height:50px;">
					<el-col :span="6">操作人</el-col>
					<el-col :span="16">{{ processDetail.operator }}</el-col>
				</el-row>
				<el-row style="height:50px;line-height:50px;">
					<el-col :span="6">处理详情</el-col>
					<el-col :span="16">{{ salesStatusMap[processDetail.status] }}</el-col>
				</el-row>
				<el-row style="height:50px;line-height:50px;" v-if="processDetail.reject_reason">
					<el-col :span="6">退款原因</el-col>
					<el-col :span="16">{{ processDetail.reject_reason }}</el-col>
				</el-row>
				<el-row style="height:50px;line-height:50px;">
					<el-col :span="6">退款金额</el-col>
					<el-col :span="16">{{ processDetail.amount }}元</el-col>
				</el-row>
				<el-row style="height:50px;line-height:50px;">
					<el-col :span="6">处理时间</el-col>
					<el-col :span="16">{{ processDetail.gmt_handle }}</el-col>
				</el-row>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="processDialog = false">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import { afterSaleQuery, refund, refuse, checkExpress, checkExpressDetail } from "@/api/order";
	import { computeMonthRange, getToday } from "@/utils";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { salesOptions, salesStatusMap } from "../../utils/mapUtils";
	import { mapGetters } from "vuex";
	import { merchantChildren } from "../../api/merchant";


	export default {
		name: "AfterSale",
		components: { Pagination },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					published: "success",
					draft: "info",
					deleted: "danger"
				};
				return statusMap[status];
			}
		},
		computed: {
			...mapGetters(["shopId", "name", "roles"])
		},
		watch: {
			refundDialog(){
				if(!this.refundDialog) {
					this.$refs.refundForm.resetFields();
				}
			},
			refuseDialog(){
				if(!this.refuseDialog) {
					this.$refs.refuseForm.resetFields();
				}
			}
		},
		data(){
			return {
				list: null,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					status: "",
					serial_no: "",
					date_range: "",
					order_id: "",
					applicant_info: "",
					shop_id: ""
				},
				refundForm: {
					serial_no: "",
					max: 0,
					refund_amount: 0
				},
				refuseForm: {
					serial_no: "",
					reject_reason: ""
				},
				deliveryInfo: {},
				processDetail: {},
				refundAmount: 0,
				refuseReason: "",
				dateRange: [],
				shopOptions: [],
				salesOptions,
				salesStatusMap,
				refundDialog: false,
				refuseDialog: false,
				deliveryInfoDialog: false,
				processDialog: false,
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
			this.listQuery.shop_id = this.shopId;
			this.getList();
			this.getShops();
		},
		methods: {
			getShops(){
				merchantChildren({ shop_id: this.shopId }).then(({ data: res }) => {
					let list = [];
					res.shop_list.forEach(item => {
						let temp = {};
						temp.key = item.shop_id;
						temp.label = item.shop_name;
						list.push(temp);
						temp = null;
					});
					this.shopOptions = list;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.$nextTick(() => this.getList());
			},
			showRefundDialog(row){
				console.log(row);
				const value = (parseFloat(row.amount) + parseFloat(row.freight)).toFixed(2);
				this.refundForm.serial_no = row.serial_no;
				this.refundForm.refund_amount = value;
				this.refundForm.max = value;
				this.refundDialog = true;
			},
			showRefuseDialog(row){
				this.refuseForm.serial_no = row.serial_no;
				this.refuseDialog = true;
			},
			showDeliveryDialog(row){
				let { serial_no } = row;
				checkExpress({ serial_no }).then(res => {
					this.deliveryInfo = res.data;
					this.deliveryInfoDialog = true;
				}).catch(error => {
					this.$message.error("系统异常");
				});
			},
			showDetailDialog(row){
				let { serial_no } = row;
				checkExpressDetail({ serial_no }).then(res => {
					console.log(res.data);
					this.processDetail = res.data;
					this.$nextTick(() => {
						this.processDialog = true;
					});
				}).catch(error => {
					this.$message.error("系统异常");
				});
			},
			handleRefund(){
				this.$refs.refundForm.validate(valid => {
					if(valid) {
						if(this.refundForm.refund_amount <= 0) {
							this.$message.error("退款金额不能为0");
							return;
						}
						if(this.refundForm.max < this.refundForm.refund_amount) {
							this.$message.error("退款金额不能大于订单实付款");
							return;
						}
						let params = {
							serial_no: this.refundForm.serial_no,
							refund_amount: parseFloat(this.refundForm.refund_amount),
							username: this.name
						};
						refund(params).then(() => {
							this.$notify.success("操作成功");
							this.refundDialog = false;
							this.getList();
						});
					} else {
						return false;
					}
				});
			},
			handleRefuse(){
				this.$refs.refuseForm.validate(valid => {
					if(valid) {
						let params = {
							...this.refuseForm,
							username: this.name
						};
						refuse(params).then(() => {
							this.$notify.info("申请已提交");
							this.refuseDialog = false;
							this.getList();
						});
					} else {
						return false;
					}
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit,
				};
				if(this.listQuery.date_range) {
					params = Object.assign(params, {
						start_time: this.listQuery.date_range[0] + " 00:00:00",
						end_time: this.listQuery.date_range[1] + " 23:59:59",
					});
				}
				if(!params.shop_id) {
					params.shop_id = this.shopId || "";
				}
				delete params.limit;
				delete params.date_range;
				afterSaleQuery(params).then(({ data: res }) => {
					this.list = res && res.result_list || [];
					this.total = res && res.total || 0;
					this.listLoading = false;
				}).catch(error => {
					this.listLoading = false;
				});
			}
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
</style>
