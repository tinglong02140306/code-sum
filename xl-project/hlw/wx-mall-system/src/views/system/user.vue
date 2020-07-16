<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.user_name" clearable placeholder="用户名" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
			           @click="handleAdd">
				新增
			</el-button>

		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%">
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="{$index}">
					<span>{{ $index + 1 }}</span>
				</template>
			</el-table-column>

			<el-table-column width="150" align="center" label="用户名">
				<template slot-scope="scope">
					<span>{{ scope.row.user_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="所在店铺">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="150px" label="姓名" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="手机号" width="150">
				<template slot-scope="{row}">
					<span>{{ row.mobile }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="创建时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.gmt_create }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="180" class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleReset(row)">
						密码重置
					</el-button>
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						修改
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<el-dialog :title="dialogStatusTextMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="userForm" :model="userForm" :rules="rules" class="form-container">

				<div class="createPost-main-container">
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item prop="user_name" style="width: 100%;" label-width="120px" label="用户名" maxlength="15"
										              class="postInfo-container-item">
											<el-input placeholder="4-20位字母或数字" v-model="userForm.user_name"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item prop="name" style="width: 100%;" label-width="120px" label="姓名" :maxlength="15"
										              class="postInfo-container-item">
											<el-input placeholder="用户名" v-model="userForm.name"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" v-if="dialogStatus === 'create'">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item prop="password" style="width: 100%;" label-width="120px" label="密码"
										              class="postInfo-container-item">
											<el-input placeholder="2-12位" v-model="userForm.password" type="password"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item prop="shop_id" style="width:100%;" label-width="120px" label="所属店铺" class="postInfo-container-item">
								<el-select filterable v-model="userForm.shop_id" placeholder="所属店铺" clearable class="filter-item">
									<el-option v-for="item in shopOptions" :key="item.key"
									           :label="item.name"
									           :value="item.key"/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" v-if="dialogStatus === 'create' || (dialogStatus === 'edit' && userForm.shop_id)">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item style="width: 100%;" label-width="120px" label="手机号" class="postInfo-container-item">
											<el-input placeholder="11位手机号" v-model="userForm.mobile"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="20">
										<el-form-item prop="remark" style="width: 100%;" label-width="120px" label="备注"
										              class="postInfo-container-item">
											<el-input type="textarea" v-model="userForm.remark"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>

				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
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
	import { mapGetters } from "vuex";
	import { fetchList, addUser, updateUser, resetPwd } from "@/api/user";
	import { merchantChildren } from "@/api/merchant";
	import waves from "@/directive/waves"; // waves directive
	import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

	const dialogStatusTextMap = {
		"create": "新增用户",
		"edit": "修改用户"
	};

	export default {
		name: "UserList",
		components: { Pagination },
		directives: { waves },
		computed: {
			...mapGetters(["id", "shopId"])
		},
		data(){
			var validateNumberAlpha = (rule, value, callback) => {
				console.log(value);
				let reg = /[0-9a-zA-Z]+/;
				if (value.trim() === '') {
					callback(new Error('不能为空'));
				} else {
					if (!reg.test(value)) {
						callback(new Error("格式错误"));
					}
					callback();
				}
			};

			return {
				list: null,
				total: 0,
				dialogStatusTextMap,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					user_name: ""
				},
				userForm: {
					user_id: "",
					name: "",
					user_name: "",
					shop_id: "",
					mobile: "",
					password: "",
					remark: ""
				},
				dialogStatus: "",
				dialogFormVisible: false,
				rules: {
					user_name: [{required: true,message: "用户名不能为空", trigger: "blur"},{ validator: validateNumberAlpha,trigger: ["blur","change"]}],
					name: [{required: true,message: "姓名不能为空", trigger: "blur"}],
					password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
					shop_id: [{ required: true, message: "所属店铺不能为空", trigger: "blur" }],
				},
				shopOptions: []
			};
		},
		watch: {
			dialogFormVisible(){
				if(!this.dialogFormVisible) {
					this.userForm = {
						user_id: "",
						name: "",
						user_name: "",
						shop_id: "",
						mobile: "",
						password: "",
						remark: ""
					};
				}
			}
		},
		created(){
			this.getList();
			let params = { shop_id: this.shopId, shop_status: "1" };
			this.getMerchants(params);
		},
		methods: {
			getMerchants(params){
				merchantChildren(params).then(({ data: res }) => {
					let list = [];
					res.shop_list.forEach(item => {
						let temp = {};
						temp.name = item.shop_name;
						temp.key = item.shop_id;
						list.push(temp);
						temp = null;
					});
					this.shopOptions = list;
				});
			},
			handleSubmit(){
				this.$refs.userForm.validate(valid => {
					if(valid) {
						let params = {};
						const userId = this.userForm.user_id;
						if(this.dialogStatus === "create") {
							params = {
								name: this.userForm.name,
								user_name: this.userForm.user_name,
								shop_id: this.userForm.shop_id,
								remark: this.userForm.remark,
								mobile: this.userForm.mobile,
								password: this.userForm.password,
							};
							addUser(params).then(() => {
								this.$notify.success("新增成功");
								this.dialogFormVisible = false;
								this.getList();
							});
							return;
						}
						params = {
							user_id: this.userForm.user_id,
							name: this.userForm.name,
							user_name: this.userForm.user_name,
							shop_id: this.userForm.shop_id,
							remark: this.userForm.remark
						};
						updateUser(params).then(async () => {
							this.$notify.success("修改成功");
							this.dialogFormVisible = false;
							if(this.id === userId) {
								await this.$store.dispatch("user/logout");
								this.$router.push(`/login?redirect=${ this.$route.fullPath }`);
								return;
							}
							this.getList();
						});
					} else {
						console.log("submit error");
						return false;
					}
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.$nextTick(() => this.getList());
			},
			handleAdd(){
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				delete params.limit;
				fetchList(params).then(({ data: res }) => {
					this.list = res.result_list;
					this.total = res.total;
					this.listLoading = false;
				}).catch(error => {
					console.log(error);
					this.listLoading = false;
				});
			},
			handleUpdate(row){
				this.dialogStatus = "edit";
				const { user_id, name, user_name, shop_id, remark,mobile } = row;
				this.userForm = {
					user_id,
					name,
					user_name,
					shop_id,
					mobile,
					remark
				};
				this.$nextTick(() => this.dialogFormVisible = true);
			},
			handleReset(row){
				const { user_id, name } = row;
				this.$confirm(`重置${ name }密码为888888，是否继续？`, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					resetPwd({ user_id }).then(async () => {
						this.$notify.success("操作成功");
						if(this.id === user_id) {
							await this.$store.dispatch("user/logout");
							this.$router.push(`/login?redirect=${ this.$route.fullPath }`);
						}
					}).catch(error => {
						this.$notify.error("系统异常");
					});
				}).catch(() => {
					this.$message.info("已取消");
				});
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
</style>
