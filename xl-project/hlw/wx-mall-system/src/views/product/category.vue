<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.category" clearable placeholder="类别名称/编号" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
			           @click="handleCreate">
				新增类别
			</el-button>
		</div>
		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%">
			<el-table-column align="center" label="类别编号" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.category_id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="类别名称">
				<template slot-scope="scope">
					<span>{{ scope.row.category_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center" label="排序">
				<template slot-scope="scope">
					<span>{{ scope.row.priority }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ statusMap[row.status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="创建时间">
				<template slot-scope="scope">
					<span>{{ scope.row.gmt_create }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="创建人" width="110">
				<template slot-scope="{row}">
					<span>{{ row.creator }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" fit align="center" class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="toggleState(row)" v-if="row.status==='1'">
						禁用
					</el-button>
					<el-button type="primary" size="mini" @click="toggleState(row)" v-if="row.status==='0'">
						启用
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form ref="imageForm" :model="categoryForm" :rules="categoryFormRules" class="form-container">

				<div class="createPost-main-container">
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item style="width: 100%;" label-width="120px" label="类别名称" class="postInfo-container-item">
											<el-input placeholder="请输入内容" v-model="categoryForm.category_name"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="20">
							<el-form-item style="width: 100%;" label-width="120px" label="排序" class="postInfo-container-item"
							              prop="priority">
								<el-input placeholder="仅可输入正整数" v-model="categoryForm.priority" type="number"/>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="状态" class="postInfo-container-item"
							              prop="status">
								<el-radio v-model="categoryForm.status" label="1">启用</el-radio>
								<el-radio v-model="categoryForm.status" label="0">停用</el-radio>
							</el-form-item>
						</el-col>
					</el-row>

				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="imageFormDialog = false">
					取消
				</el-button>
				<el-button type="primary" @click="handleSubmit">
					确定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { getCategories, addCategory, modCategory, getCateList } from "@/api/product";
	import { mapGetters } from "vuex";

	const statusMap = {
		"1": "正常",
		"0": "禁用"
	};
	export default {
		name: "category",
		components: { Pagination },
		directives: { waves },
		watch: {
			dialogVisible(){
				if(!this.dialogVisible) {
					this.categoryForm = {
						category_name: "",
						priority: "",
						status: "1"
					};
				}
			},
		},
		filters: {
			statusFilter(status){
				const statusMap = {
					"1": "success",
					"0": "danger"
				};
				return statusMap[status];
			},
		},
		computed: {
			...mapGetters(["name"])
		},
		data(){
			return {
				statusMap,
				listLoading: false,
				total: 0,
				listQuery: {
					page: 1,
					limit: 10,
					category: "",
				},
				list: null,
				dialogVisible: false,
				categoryForm: {
					category_name: "",
					priority: "",
					status: "1"
				},
				categoryFormRules: {
					category_name: [
						{ required: true, message: "请输入类别名称", trigger: "blur" },
					],
					status: [
						{ required: true, message: "请选择类别状态", trigger: "change" }
					],
					priority: [
						{ required: true, message: "请输入产品排序", trigger: "blur" }
					]
				},
			};
		},
		methods: {
			handleFilter(){
			},
			handleCreate(){
				this.dialogVisible = true;
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				delete params.limit;
				getCategories(params).then(({ data: res }) => {
					this.list = res.result_list || [];
					this.total = res.total;
					this.listLoading = false;
				}).catch(error => {
					console.log(error);
					this.listLoading = false;
				});
			},
			handleSubmit(){
				let params = {
					...this.categoryForm,
					operator: this.name
				};
				addCategory(params).then(() => {
					this.dialogVisible = false;
					this.$notify.success("添加成功");
					this.getList();
				});
			},
			toggleState(row){
				const { status } = row;
				let msg = status === "0" ? "启用分类，是否确定？" : "禁用分类，需要该分类下所有商品处于下架状态，是否确认？";
				this.$confirm(msg, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					const params = {
						category_id: row.category_id,
						category_name: row.category_name,
						priority: row.priority,
						status: status === "1" ? "0" : "1"
					};
					modCategory(params).then(() => {
						this.$notify.success("更新成功");
						this.getList();
					}).catch(error => {
						console.log(error);
					});
				}).catch(() => {
					this.$message.info("已取消");
				});
			}
		},
		created(){
			this.getList();
		},
	};
</script>

<style scoped>

</style>
