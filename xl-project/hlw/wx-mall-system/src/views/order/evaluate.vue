<template>
	<div class="app-container">

		<div class="filter-container" style="display:flex;">
			<el-input v-model="listQuery.product" placeholder="商品名称/ID" style="width: 200px;margin-right:20px" clearable
			          class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.audit_status" placeholder="状态" clearable class="filter-item"
			           style="width: 130px;margin-right:20px">
				<el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.label"
				           :value="item.key"/>
			</el-select>

			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>

		</div>

		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="商品ID" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.product_id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="商品名称">
				<template slot-scope="scope">
					<span>{{ scope.row.product_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center" label="店铺名称">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" label="用户ID" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.user_id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="100px" label="用户名" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.user_name }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="手机号" width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.telephone }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="评分" width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.grade }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="评价内容" width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.content }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="图片" width="300" align="center">
				<template slot-scope="{row}">
					<template v-for="(url,index) in row.images_url">
						<el-image
							style="width:100px;height:100px;margin-right:20px;"
							:src="url"
							:preview-src-list="row.images_url"
							fit="fill"></el-image>
					</template>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="评价时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.gmt_create }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="审核人" width="110">
				<template slot-scope="{row}">
					<span>{{ row.auditor }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="审核时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.audit_time }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="审核状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.audit_status | statusFilter">
						{{ auditStatusMap[row.audit_status] }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" align="center" width="150" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}" v-if="row.audit_status === '0'">
					<el-button type="primary" size="mini" @click="handleAudit(row,'2')">
						通过
					</el-button>
					<el-button size="mini" type="success" @click="handleAudit(row,'1')">
						拒绝
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>
	</div>
</template>

<script>
	import { evaluationQuery, evaluationAudit } from "@/api/order";
	import waves from "@/directive/waves"; // waves directive
	import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
	import { auditStatusMap,auditStatusOptions } from "../../utils/mapUtils";
	import { mapGetters } from "vuex";

	export default {
		name: "EvaluateList",
		components: { Pagination },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					"2": "success",
					"0": "info",
					"1": "danger"
				};
				return statusMap[status];
			}
		},
		computed: {
			...mapGetters(["name","shopId"])
		},
		data(){
			return {
				list:null,
				total: 0,
				listLoading: true,
				auditStatusMap,
				auditStatusOptions,
				listQuery: {
					product: "",
					audit_status: "0",
					page: 1,
					limit: 10
				},
			};
		},
		created(){
			this.getList()
		},
		methods: {
			handleFilter(){
				this.listQuery.page = 1;
				this.$nextTick(() => this.getList());
			},
			handleAudit(row, status){
				let msg = status === "2" ? "审核通过, 是否继续?" : "审核拒绝, 是否继续?";
				this.$confirm(msg, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					const { sub_order_id } = row;
					evaluationAudit({sub_order_id,audit_status:status,username:this.name}).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					}).catch(error => {
						this.$message.error("系统异常");
					});
				}).catch(() => {
					this.$message.info("已取消");
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit,
					shop_id: this.shopId
				};
				delete params.limit;
				evaluationQuery(params).then(({data:res}) => {
					this.list = res.result_list;
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
