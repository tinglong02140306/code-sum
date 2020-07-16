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
			<el-select v-model="listQuery.audit_status" placeholder="状态" clearable class="filter-item"
			           style="width: 130px;margin-right:20px">
				<el-option v-for="option in auditOptions" :key="option.key" :label="option.label"
				           :value="option.key"/>
			</el-select>
			<el-input v-model="listQuery.product" placeholder="商品名称/ID" style="width: 200px;margin-right:20px"
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleBatchAudit">
				批量审核
			</el-button>
		</div>

		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row
		          @selection-change="handleSelectionChange" style="width: 100%">
			<el-table-column
				align="center"
				type="selection"
				width="55">
			</el-table-column>
			<el-table-column align="center" label="申请单ID" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.serial_no }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="商品ID">
				<template slot-scope="scope">
					<span>{{ scope.row.product_id }}</span>
				</template>
			</el-table-column>

			<el-table-column fit align="center" label="商品名称">
				<template slot-scope="scope">
					<span>{{ scope.row.product_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="店铺">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="价格/元" width="110">
				<template slot-scope="{row}">
					<span>{{ row.price }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="审核状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.audit_status | auditFilter">
						{{ auditStatusMap[row.audit_status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="申请人" width="120">
				<template slot-scope="{row}">
					<span>{{ row.applicant }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="申请时间">
				<template slot-scope="scope">
					<span>{{ scope.row.apply_time }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" fit class-name="small-padding" style="min-width:60px;">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleCheck(row,$index)" v-if="row.audit_status === '0'">
						审核
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<el-dialog width="60%" :append-to-body="true" :close-on-press-escape="false" :close-on-click-modal="false"
		           title="商品详情"
		           :visible.sync="dialogFormVisible" @closed="onClose">
			<product-detail
				:key="new Date().getTime()"
				:is-edit="true"
				:product-info="productInfo"
				:templates="templates"
				:merchants="merchants"
				:has-more="!(curIndex === filterList.length-1)"
				@refused="refused"
				@next="auditNext"
			>

			</product-detail>
		</el-dialog>

		<el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="dialogFormVisible2">
			<el-input
				type="textarea"
				:autosize="{ minRows: 2, maxRows: 4}"
				placeholder="请输入内容"
				v-model="textarea2">
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">
					取消
				</el-button>
				<el-button type="primary" @click="auditReject">
					确定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { productAuditList, productAuditInfo, productAudit, getTemplates,productAuditBatch } from "@/api/product";
	import { merchantChildren } from "@/api/merchant";
	import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
	import { computeMonthRange, getToday } from "@/utils";
	import waves from "@/directive/waves"; // waves directive
	import ProductDetail from "./components/ProductDetail";
	import { mapGetters } from "vuex";
	import { auditStatusOptions,auditStatusMap } from "@/utils/mapUtils"

	export default {
		name: "CheckList",
		components: { Pagination, ProductDetail },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					"2": "info",
					"1": "success",
					"0": "danger"
				};
				return statusMap[status];
			},
			auditFilter(status){
				const statusMap = {
					"0": "info",
					"2": "success",
					"1": "danger"
				};
				return statusMap[status];
			}
		},
		watch: {
			dialogFormVisible2(){
				if(!this.dialogFormVisible2) {
					this.textarea2 = "";
					this.tempObj = "";
				}
			}
		},
		computed: {
			...mapGetters(["shopId"])
		},
		data(){
			return {
				textarea2: "",    // 审核拒绝原因
				needRefresh: false,   // 是否需要重新查询数据 如果在弹框内调用了审核通过或审核拒绝  置此字段为true 当弹框关闭时重新请求数据
				curIndex: "",     // 选中记录的下标值
				list: [],
				templates: [],
				merchants: [],
				total: 2,
				auditStatusMap,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					date_range: "",
					product: "",
					audit_status: "0"
				},
				auditOptions: auditStatusOptions,
				multipleSelection: [],      // 选中的记录
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
				dialogFormVisible: false,
				dialogFormVisible2: false,
				productInfo: {},
				filterList: [],
				tempObj: "" // 暂存拒绝时的对象
			};
		},
		async created(){
			this.getList();
			this.getTemplate();
			if(!this.shopId) {
				this.getMerchants();
			}
		},
		methods: {
			async getMerchants(){
				let { data: res } = await merchantChildren({ shop_id: "", shop_status: "" });
				let result = res.shop_list;
				let list = [];
				result && result.forEach(item => {
					let option = {};
					option.name = item.shop_name;
					option.key = item.shop_id;
					list.push(option);
					option = null;
				});
				this.merchants = list;
			},
			getTemplate(){
				getTemplates({shop_id: this.shopId}).then(({ data: res }) => {
					let list = [];
					res.list && res.list.forEach(item => {
						let temp = {};
						temp.label = item.template_name;
						temp.value = item.template_id;
						list.push(temp);
						temp = null;
					});
					this.templates = list;
				});
			},
			onClose(){
				if(this.needRefresh) {
					this.curIndex = "";
					this.getList();
				}
			},
			auditReject(){
				const params = {
					serial_no: this.tempObj.serial_no,
					audit_status: "1",
					reject_reason: this.textarea2.trim()
				};
				productAudit(params).then(() => {
					this.tempObj = "";
					this.$notify.success("操作成功");
					this.dialogFormVisible = false;
					this.dialogFormVisible2 = false;
					this.getList();
				});
			},
			refused(val){
				this.tempObj = val;
				this.dialogFormVisible2 = true;
			},
			auditNext(val){
				let params = {
					...val,
					audit_status: "2",
					remark: ""
				};
				delete params.applicant;
				delete params.apply_time;
				productAudit(params).then(() => {
					this.needRefresh = true;
					this.$notify.success("操作成功");
					this.dialogFormVisible = false;
					if(this.curIndex === this.filterList.length - 1) {
						this.getList();
						return;
					}
					this.curIndex = this.curIndex + 1;
					this.productInfo = null;
					productAuditInfo({ serial_no: this.filterList[this.curIndex].serial_no }).then(({ data: res }) => {
						let productInfo = res;
						productInfo.image_url_arr = productInfo.image_arr;
						this.productInfo = productInfo;
						this.$nextTick(() => {
							this.dialogFormVisible = true;
						});
					});
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
			handleBatchAudit(){
				if(!this.multipleSelection.length) {
					this.$message.warning("请先选择需要审核的记录");
					return;
				}
				console.log(this.multipleSelection);
				let auditList = this.multipleSelection.filter(item => item.audit_status === "0");
				if(!auditList.length){
					this.$message.warning("选择了0条待审核的商品");
					return;
				}
				let serialNo = "";
				auditList.forEach(item => {
					serialNo += item.serial_no + "|";
				});
				this.$confirm(`已勾选${ this.multipleSelection.length }个商品，待审核${auditList.length}个商品，请确认`, "批量审核", {
					distinguishCancelAndClose: true,
					confirmButtonText: "全部通过",
					cancelButtonText: "全部拒绝",
					type: "primary"
				}).then(() => {
					productAuditBatch({ serial_no: serialNo, audit_status: "2" }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					});
				}).catch((action) => {
					if(action === "cancel") {
						productAuditBatch({ serial_no: serialNo, audit_status: "1" }).then(() => {
							this.$notify.success("操作成功");
							this.getList();
						});
					}
				});
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			handleCheck(row, index){
				const serialNo = row.serial_no;
				// 找到当前选择的记录在filterList中的下标
				this.curIndex = this.filterList.findIndex(item => item.serial_no === serialNo);
				productAuditInfo({ serial_no: serialNo }).then(({ data: res }) => {
					console.log(res);
					let productInfo = res;
					productInfo.image_url_arr = productInfo.image_arr;
					this.productInfo = productInfo;
					console.log(productInfo);
					this.$nextTick(() => {
						this.dialogFormVisible = true;
					});
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				if(this.listQuery.date_range) {
					params = Object.assign(params, {
						start_time: this.listQuery.date_range[0] + " 00:00:00",
						end_time: this.listQuery.date_range[1] + " 23:59:59",
					});
				}
				delete params.limit;
				delete params.date_range;
				productAuditList(params).then(({ data: res }) => {
					if(this.needRefresh) {
						this.needRefresh = false;
					}
					this.list = res.result_list;
					this.filterList = res.result_list.filter(item => item.audit_status === "0");
					this.total = res.total;
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
