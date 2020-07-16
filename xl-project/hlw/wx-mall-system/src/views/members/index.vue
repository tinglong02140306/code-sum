<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.user_info" placeholder="用户名称" style="width: 200px;" class="filter-item" clearable
			          @keyup.enter.native="handleFilter"/>
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
			style="width: 100%;">
			<el-table-column label="用户ID" prop="id" align="center" width="250">
				<template slot-scope="{row}">
					<span>{{ row.user_id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="用户名称" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.user_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="绑定时间" width="200px" align="center" prop="bind_time">
				<template slot-scope="{row}">
					<span>{{ row.bind_time }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" width="110px" align="center">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter" v-if="row.status">
						{{ memberStatusMap[row.status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="信联卡信息" width="150px" align="center">
				<template slot-scope="{row}">
					<span style="color:blue;cursor:pointer;" @click="handleDetail(row)">详情</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fit class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleStatus(row,'0')" v-if="row.status==='1'">
						禁用
					</el-button>
					<el-button size="mini" type="success" @click="handleStatus(row,'1')" v-if="row.status==='0'">
						解禁
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="信联卡信息" :visible.sync="cardDialog">
			<div class="filter-container">
				<el-row style="height:50px;line-height:50px;">
					<el-col :span="3">总余额/元</el-col>
					<el-col :span="6">{{ userInfo.total_balance }}</el-col>
				</el-row>
			</div>

			<el-table
				:key="new Date().getTime()"
				:data="userInfo.card_list"
				border
				fit
				highlight-current-row
				style="width: 100%;"
			>
				<el-table-column label="信联卡号" fit align="center">
					<template slot-scope="{row}">
						<span class="link-type">{{ row.card_no }}</span>
					</template>
				</el-table-column>
				<el-table-column label="余额" width="110px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.balance }}</span>
					</template>
				</el-table-column>
				<!--
				<el-table-column label="绑卡时间" width="180px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.bind_time }}</span>
					</template>
				</el-table-column>
				-->
			</el-table>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="cardDialog = false">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import { getUsers, userManage, getXlCards } from "@/api/member";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { memberStatusMap } from "@/utils/mapUtils";

	export default {
		name: "Member",
		components: { Pagination },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					"1": "success",
					"0": "danger"
				};
				return statusMap[status];
			},
		},
		watch: {
			cardDialog(){
				if(!this.cardDialog) {
					this.userInfo = {};
				}
			}
		},
		data(){
			return {
				tableKey: 0,
				list: null,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					user_info: ""
				},
				userInfo: {},
				cardDialog: false,
				downloadLoading: false,
				memberStatusMap
			};
		},
		created(){
			this.getList();
		},
		methods: {
			handleDetail(row){
				const { user_id } = row;
				getXlCards({ user_id }).then(({data:res}) => {
					this.userInfo = res;
					this.cardDialog = true;
				}).catch(error => {
					// this.$message.error("系统异常");
				});
			},
			handleStatus(row, status){
				let msg = status === "0" ? "禁用用户, 是否继续?" : "解禁用户, 是否继续?";
				this.$confirm(msg, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					const { user_id } = row;
					userManage({ user_id, status }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					}).catch(error => {
						this.$notify.error("系统异常");
					});
				}).catch(() => {
					this.$notify.info("已取消");
				});
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				delete params.limit;
				getUsers(params).then(({ data: res }) => {
					this.list = res && res.result_list || [];
					this.total = res && res.total || 0;
					this.listLoading = false;
				}).catch(error => {
					this.listLoading = false;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
		}
	};
</script>
