<template>
	<div class="app-container">
		<div style="width:800px;border-bottom:1px solid #eee;padding-bottom:20px;">
			<el-row :gutter="5" style="height:50px;line-height:50px;">
				<el-col :span="4">模板名称：</el-col>
				<el-col :span="6"><el-input/></el-col>
			</el-row>
		</div>
		<div style="height:60px;line-height:60px;">
			<el-button @click="add">增加</el-button>
		</div>
		<el-table :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="运送到" width="380">
				<template slot-scope="{row}">
					<template v-if="row.edit">
						<el-select v-model="value" placeholder="请选择" style="width:370px">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</template>
					<span v-else>{{ row.title }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="首重(kg)">
				<template slot-scope="{row}">
					<template v-if="row.edit">
						<el-input v-model="row.title" class="edit-input" size="small" />
					</template>
					<span v-else>{{ row.title }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="首费(元)">
				<template slot-scope="{row}">
					<template v-if="row.edit">
						<el-input v-model="row.title" class="edit-input" size="small" />
					</template>
					<span v-else>{{ row.title }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" label="续重(kg)">
				<template slot-scope="{row}">
					<template v-if="row.edit">
						<el-input v-model="row.title" class="edit-input" size="small" />
					</template>
					<span v-else>{{ row.title }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="续费(元)" width="180">
				<template slot-scope="{row}">
					<template v-if="row.edit">
						<el-input v-model="row.title" class="edit-input" size="small" />
					</template>
					<span v-else>{{ row.title }}</span>
				</template>
			</el-table-column>

			<el-table-column fit align="center" label="操作" >
				<template slot-scope="{row}">
					<el-button
						v-if="row.edit"
						type="success"
						size="small"
						icon="el-icon-circle-check-outline"
						@click="confirmEdit(row)"
					>
						保存
					</el-button>
					<el-button
						v-else
						type="primary"
						size="small"
						icon="el-icon-edit"
						@click="row.edit=!row.edit"
					>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { fetchList, fetchPv, createArticle, updateArticle } from "@/api/article";
	import waves from "@/directive/waves"; // waves directive
	import { parseTime } from "@/utils";
	import SubBranch from "./components/Subbranch"; // secondary package based on el-pagination
	import Pagination from '@/components/Pagination' // secondary package based on el-pagination


	const calendarTypeOptions = [
		{ key: "CN", display_name: "China" },
		{ key: "US", display_name: "USA" },
		{ key: "JP", display_name: "Japan" },
		{ key: "EU", display_name: "Eurozone" }
	];

	// arr to obj, such as { CN : "China", US : "USA" }
	const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
		acc[cur.key] = cur.display_name;
		return acc;
	}, {});

	export default {
		name: "ComplexTable",
		components: { SubBranch,Pagination },
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
		data(){
			return {
				tableKey: 0,
				list: [],
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					importance: undefined,
					title: undefined,
					type: undefined,
					sort: "+id"
				},
				importanceOptions: [1, 2, 3],
				calendarTypeOptions,
				sortOptions: [{ label: "ID Ascending", key: "+id" }, { label: "ID Descending", key: "-id" }],
				statusOptions: ["published", "draft", "deleted"],
				showReviewer: false,
				temp: {
					id: undefined,
					importance: 1,
					remark: "",
					timestamp: new Date(),
					title: "",
					type: "",
					status: "published"
				},
				dialogFormVisible: false,
				dialogStatus: "",
				textMap: {
					update: "Edit",
					create: "Create"
				},
				dialogPvVisible: false,
				pvData: [],
				rules: {
					type: [{ required: true, message: "type is required", trigger: "change" }],
					timestamp: [{ type: "date", required: true, message: "timestamp is required", trigger: "change" }],
					title: [{ required: true, message: "title is required", trigger: "blur" }]
				},
				downloadLoading: false,
				value1: '',
				value2: '',
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				value: ''
			};
		},
		created(){
		},
		methods: {
			add(){
				this.list.push(this.temp)
			},
			handleClick(){
				this.dialogFormVisible = true;
			},
			getList(){
				this.listLoading = true;
				fetchList(this.listQuery).then(response => {
					this.list = response.data.items;
					this.total = response.data.total;

					// Just to simulate the time of the request
					setTimeout(() => {
						this.listLoading = false;
					}, 1.5 * 1000);
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
			handleModifyStatus(row, status){
				this.$message({
					message: "操作Success",
					type: "success"
				});
				row.status = status;
			},
			sortChange(data){
				const { prop, order } = data;
				if(prop === "id") {
					this.sortByID(order);
				}
			},
			sortByID(order){
				if(order === "ascending") {
					this.listQuery.sort = "+id";
				} else {
					this.listQuery.sort = "-id";
				}
				this.handleFilter();
			},
			resetTemp(){
				this.temp = {
					id: undefined,
					importance: 1,
					remark: "",
					timestamp: new Date(),
					title: "",
					status: "published",
					type: ""
				};
			},
			handleCreate(){
				this.resetTemp();
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
				});
			},
			createData(){
				this.$refs["dataForm"].validate((valid) => {
					if(valid) {
						this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
						this.temp.author = "vue-element-admin";
						createArticle(this.temp).then(() => {
							this.list.unshift(this.temp);
							this.dialogFormVisible = false;
							this.$notify({
								title: "Success",
								message: "Created Successfully",
								type: "success",
								duration: 2000
							});
						});
					}
				});
			},
			handleUpdate(row){
				this.temp = Object.assign({}, row); // copy obj
				this.temp.timestamp = new Date(this.temp.timestamp);
				this.dialogStatus = "update";
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
				});
			},
			updateData(){
				this.$refs["dataForm"].validate((valid) => {
					if(valid) {
						const tempData = Object.assign({}, this.temp);
						tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
						updateArticle(tempData).then(() => {
							const index = this.list.findIndex(v => v.id === this.temp.id);
							this.list.splice(index, 1, this.temp);
							this.dialogFormVisible = false;
							this.$notify({
								title: "Success",
								message: "Update Successfully",
								type: "success",
								duration: 2000
							});
						});
					}
				});
			},
			handleDelete(row, index){
				this.$notify({
					title: "Success",
					message: "Delete Successfully",
					type: "success",
					duration: 2000
				});
				this.list.splice(index, 1);
			},
			handleFetchPv(pv){
				fetchPv(pv).then(response => {
					this.pvData = response.data.pvData;
					this.dialogPvVisible = true;
				});
			},
			handleDownload(){
				this.downloadLoading = true;
				import("@/vendor/Export2Excel").then(excel => {
					const tHeader = ["timestamp", "title", "type", "importance", "status"];
					const filterVal = ["timestamp", "title", "type", "importance", "status"];
					const data = this.formatJson(filterVal);
					excel.export_json_to_excel({
						header: tHeader,
						data,
						filename: "table-list"
					});
					this.downloadLoading = false;
				});
			},
			formatJson(filterVal){
				return this.list.map(v => filterVal.map(j => {
					if(j === "timestamp") {
						return parseTime(v[j]);
					} else {
						return v[j];
					}
				}));
			},
			getSortClass: function(key){
				const sort = this.listQuery.sort;
				return sort === `+${ key }` ? "ascending" : "descending";
			}
		}
	};
</script>

<style scoped>
	.section-header{
		width: 800px;
		height: 60px;
		line-height: 60px;
		border-bottom: 1px solid #eee;
	}
</style>
