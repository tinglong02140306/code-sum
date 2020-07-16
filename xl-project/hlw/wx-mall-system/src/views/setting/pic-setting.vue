<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
			           @click="handleAdd">
				添加图片
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
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="图片">
				<template slot-scope="scope">
					<el-image
						v-if="scope.row.image"
						style="width:100px; height:100px"
						:src="scope.row.image"
						:preview-src-list="[scope.row.image]">
					</el-image>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="分类">
				<template slot-scope="scope">
					<span>{{ imageType[scope.row.type] }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" label="链接商品" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.product_name }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="所在店铺" width="110">
				<template slot-scope="{row}">
					<span>{{ row.shop_name }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="排序" width="110">
				<template slot-scope="{row}">
					<span>{{ row.priority }}</span>
				</template>
			</el-table-column>
			<!--
			<el-table-column class-name="status-col" label="点击量" width="110">
				<template slot-scope="{row}">
					<span>{{ row.hits }}</span>
				</template>
			</el-table-column>
			-->
			<el-table-column class-name="status-col" label="状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ imageStatusMap[row.status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="创建人" width="110">
				<template slot-scope="{row}">
					<span>{{ row.creater }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="创建时间">
				<template slot-scope="scope">
					<span>{{ scope.row.gmt_create }}</span>
				</template>
			</el-table-column>

			<el-table-column fixed="right" label="操作" align="center" width="220" class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleUpdate(row,'0')" v-if="row.status === '1'">
						禁用
					</el-button>
					<!--	控制已经启用10张隐藏启用按钮	-->
					<el-button type="primary" size="mini" @click="handleUpdate(row,'1')" v-if="row.status === '0' && filterList.length < 10">
						启用
					</el-button>
					<el-button size="mini" type="success" @click="handleEdit(row)" v-if="row.status === '0'">
						编辑
					</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(row)" v-if="row.status === '0'">
						删除
					</el-button>
				</template>
			</el-table-column>

		</el-table>


		<el-dialog :visible.sync="imageFormDialog" :close-on-click-modal="false">
			<el-form ref="imageForm" :model="imageForm" :rules="imageFormRules" class="form-container">

				<div class="createPost-main-container">
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="12">
										<el-form-item style="width: 100%;" label-width="120px" label="分类" class="postInfo-container-item">
											<el-input placeholder="请输入内容" value="首页轮播图" :disabled="true"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="图片上传" class="postInfo-container-item"
							              prop="fileList">
								<el-upload
									:limit="1"
									:on-exceed="handleExceed"
									action=""
									:class="{ 'disabled': uploadDisabled }"
									:auto-upload="false"
									:on-change="handleChange"
									list-type="picture-card"
									:file-list="imageForm.fileList"
									:on-preview="handlePictureCardPreview"
									:before-remove="beforeRemove"
									:on-remove="handleRemove">
									<i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog :visible.sync="imagePreviewDialog" :append-to-body="true">
									<img width="100%" :src="dialogImageUrl" alt="">
								</el-dialog>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="链接商品" class="postInfo-container-item"
							              prop="product_id">
								<treeselect
									placeholder="请选择链接商品"
									:disable-branch-nodes="true"
									name="tree"
									:multiple="false"
									:clearable="true"
									:searchable="true"
									:disabled="false"
									:close-on-select="true"
									:options="options"
									:limit="6"
									:max-height="600"
									v-model="imageForm.product_id"
									noChildrenText="没有数据"
								/>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="排序" class="postInfo-container-item"
							              prop="priority">
								<el-input placeholder="仅可输入正整数" v-model="imageForm.priority" type="number"/>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="状态" class="postInfo-container-item"
							              prop="status">
								<el-radio v-model="imageForm.status" label="1">启用</el-radio>
								<el-radio v-model="imageForm.status" label="0">停用</el-radio>
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
	import {
		getImageList,
		getImageDetail,
		addImage,
		editImage,
		manageImage,
		delImage,
		queryProduct
	} from "@/api/setting";
	import Treeselect from "@riophae/vue-treeselect";
	import "@riophae/vue-treeselect/dist/vue-treeselect.css";
	import { mapGetters } from "vuex";
	import { imageStatusMap } from "@/utils/mapUtils";

	const imageType = {
		"1": "首页banner",
		"2": "首页九宫格"
	};

	export default {
		name: "PicSetting",
		components: { Treeselect },
		filters: {
			statusFilter(status){
				const statusMap = {
					"1": "success",
					"0": "danger"
				};
				return statusMap[status];
			}
		},
		watch: {
			imageFormDialog(){
				if(!this.imageFormDialog) {
					this.uploadDisabled = false;
					this.imageForm = {
						type: "",
						image: "",
						product_id: null,
						priority: "",
						status: "1",
						fileList: [],
						id: ""
					};
				}
			},
		},
		computed: {
			...mapGetters(["name"])
		},
		data(){
			return {
				imagePreviewDialog: false,
				imageType,
				imageStatusMap,
				dialogImageUrl: "",
				options: [],
				list: null,
				listLoading: true,
				imageForm: {
					id: "",
					type: "",
					image: "",
					product_id: null,
					priority: "",
					status: "1",
					fileList: []
				},
				imageFormRules: {
					product_id: [
						{ required: true, message: "请输入链接产品", trigger: "blur" },
					],
					status: [
						{ required: true, message: "请选择状态", trigger: "change" }
					],
					priority: [
						{ required: true, message: "请输入产品排序", trigger: "blur" }
					]
				},
				imageFormDialog: false,
				uploadDisabled: false,
				filterList: []
			};
		},
		created(){
			this.getList();
			this.getProducts();
		},
		methods: {
			handleSubmit(){
				if(!this.imageForm.fileList.length){
					this.$message.error("请上传图片");
					return;
				}
				this.$refs.imageForm.validate(async valid => {
					if(valid) {
						let params = await this.generateParams();
						if(this.dialogStatus === "add") {
							addImage(params).then(() => {
								this.$notify.success("操作成功");
								this.imageFormDialog = false;
								this.getList();
							});
							return;
						}
						editImage(params).then(() => {
							this.$notify.success("操作成功");
							this.imageFormDialog = false;
							this.getList();
						});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			async generateParams(){
				let params = {
					...this.imageForm,
					username: this.name
				};
				let raw = params.fileList[0] && params.fileList[0].raw;
				if(raw){
					let base64 = await this.blobToDataURL(raw);
					params = {
						...params,
						image: base64,
					}
				} else {
					params = {
						...params,
						image: params.fileList[0] && params.fileList[0].url
					}
				}
				delete params.fileList;
				console.log(params);
				return params;
			},
			getProducts(){
				queryProduct().then(({ data: res }) => {
					this.options = this.deleteChildren(res);
					console.log(this.options);
				});
			},
			deleteChildren(arr){
				arr.forEach( item => {
					if(item.children) {
						return this.deleteChildren(item.children);
					} else {
						delete item.children;
						return item;
					}
				});
				return arr;
			},
			blobToDataURL(blob){
				return new Promise(resolve => {
					let reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onload = function(e){
						resolve(e.target.result);
					};
				});
			},
			handleRemove(file, fileList){
				this.imageForm.fileList = fileList;
				this.uploadDisabled = fileList.length === 1;
			},
			handleChange(file, fileList){
				this.imageForm.fileList = fileList.slice(-1);
				this.uploadDisabled = fileList.length === 1;
			},
			beforeRemove(file, fileList){
				let name = file && file.name || "";
				return this.$confirm(`确定移除 ${ name }？`);
			},
			handleExceed(files, fileList){
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${ files.length } 个文件，共选择了 ${ files.length + fileList.length } 个文件`);
			},
			handlePictureCardPreview(file){
				this.dialogImageUrl = file.url;
				this.imagePreviewDialog = true;
			},
			handleEdit(row){
				this.dialogStatus = "edit";
				const { id } = row;
				getImageDetail({ id }).then(({data:res}) => {
					let result = res;
					result.fileList = [{url: res.image}];
					this.imageForm = result;
					this.uploadDisabled = true;
					this.imageFormDialog = true;
				}).catch(error => {
					this.$message.error("系统异常");
				});
			},
			handleUpdate(row, status){
				let msg = status === "1" ? "启用记录, 是否继续?" : "禁用记录, 是否继续?";
				this.$confirm(msg, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					const { id } = row;
					manageImage({ id, status }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					}).catch(error => {
						this.$notify.error("系统异常");
					});
				}).catch(() => {
					this.$message.info("已取消");
				});
			},
			handleDelete(row){
				this.$confirm("删除记录，是否继续？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					const { id } = row;
					delImage({ id }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					}).catch(error => {
						this.$notify.error("系统异常");
					});
				}).catch(() => {
					this.$message.info("已取消");
				});
			},
			handleAdd(){
				this.dialogStatus = "add";
				this.imageFormDialog = true;
			},
			getList(){
				this.listLoading = true;
				getImageList().then(({ data: res }) => {
					this.list = res;
					this.filterList = res.filter(item => item.status === "1");
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

	.disabled .el-upload--picture-card {
		display: none !important;
	}

</style>



