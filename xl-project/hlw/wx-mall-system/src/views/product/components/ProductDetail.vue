<template>
	<div class="createPost-container" style="padding:0;">
		<slot name="header"></slot>
		<template v-if="$route.name === 'ProductCheck'">
			<div style="padding:0 50px;">
				<el-row style="height:80px;line-height:80px;">
					<el-col :span="12" style="font-weight:bold;text-align:left;color:red;">*</el-col>
					<el-col :span="5">
						<el-button @click="refuse">拒绝</el-button>
					</el-col>
					<el-col :span="5">
						<el-button type="primary" @click="next" v-if="!hasMore">通过</el-button>
						<el-button type="primary" @click="next" v-else>通过并显示下一条</el-button>
					</el-col>
				</el-row>
			</div>
		</template>
		<el-form ref="postForm" :model="postForm" :rules="rules">
			<div class="createPost-main-container">
				<el-row v-if="$route.name === 'ProductCheck'">
					<el-col :span="24">
						<div class="postInfo-container">
							<el-row>
								<el-col :span="12">
									<el-form-item style="width: 100%;" label-width="120px" label="申请时间" class="postInfo-container-item">
										<span>{{ postForm.apply_time }}</span>
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
								<el-col :span="12" v-if="isEdit">
									<el-form-item style="width: 100%;" label-width="120px" label="商品ID" class="postInfo-container-item">
										<el-input placeholder="请输入内容" v-model="postForm.product_id" :disabled="true"/>
									</el-form-item>
								</el-col>
								<el-col :span="12" v-if="shopId">
									<el-form-item style="width: 100%;" label-width="120px" label="所在店铺" class="postInfo-container-item">
										<el-input placeholder="请输入内容" :value="shopName" :disabled="true"/>
									</el-form-item>
								</el-col>
								<el-col :span="12" v-if="!shopId">
									<el-form-item style="width: 100%;" label-width="120px" label="所属店铺" class="postInfo-container-item">
										<el-select v-model="postForm.shop_id" clearable filterable placeholder="请选择" @change="handleSelectChange">
											<el-option
												v-for="item in merchants"
												:key="item.key"
												:label="item.name"
												:value="item.key">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item style="width: 100%;" prop="product_name" label-width="120px" label="商品标题" class="postInfo-container-item">
							<el-input placeholder="不超过100个字" v-model="postForm.product_name"/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item style="width: 100%;" prop="category_id" label-width="120px" label="所属分类" class="postInfo-container-item">
							<el-select v-model="postForm.category_id" clearable filterable placeholder="请选择">
								<el-option
									v-for="item in cates"
									:key="item.category_id"
									:label="item.category_name"
									:value="item.category_id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="运费模板" prop="template_id"
						              class="postInfo-container-item">
							<el-select v-model="postForm.template_id" clearable filterable placeholder="请选择">
								<el-option
									v-for="item in realTemplates"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item prop="specs_list" style="width: 100%;" label-width="120px" label="品种规格" class="postInfo-container-item">
							<template v-for="(spec,index) in postForm.specs_list">
								<div class="postInfo-container">
									<el-row>
										<el-col :span="4">
											<el-input placeholder="不超过50个字" v-model="spec.specs_name"/>
										</el-col>
										<el-col :span="3" align="center">价格</el-col>
										<el-col :span="4">
											<el-input placeholder="请输入" v-model="spec.price">
												<template slot="append">元</template>
											</el-input>
										</el-col>
										<el-col :span="3" align="center">重量</el-col>
										<el-col :span="4">
											<el-input placeholder="请输入" v-model="spec.weight">
												<template slot="append">g</template>
											</el-input>
										</el-col>
										<el-col v-if="index !== 0 || postForm.specs_list.length > 1" :span="2" style="margin-left:10px;">
											<el-button @click="removeRow(index)">删除</el-button>
										</el-col>
										<el-col :span="2" v-if="index === postForm.specs_list.length-1"
										        style="margin-left:10px;">
											<el-button @click="addRow">添加</el-button>
										</el-col>
									</el-row>
								</div>
							</template>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item prop="fileList" style="width: 100%;" label-width="120px" label="图片上传" class="postInfo-container-item">
							<el-upload
								action=""
								:class="{ 'disabled': uploadDisabled }"
								:auto-upload="false"
								:file-list="postForm.fileList"
								:on-change="handleChange"
								list-type="picture-card"
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
						<el-form-item prop="detail" style="width: 100%;" label-width="120px" label="产品详情">
							<vue-ueditor-wrap :destroy="true" v-model="postForm.detail" :config="myConfig"></vue-ueditor-wrap>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="店铺排序" class="postInfo-container-item" prop="priority">
							<el-input placeholder="仅可输入正整数" v-model="postForm.priority" min="0" type="number"/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row style="margin-bottom:30px;" v-if="$route.name !== 'ProductCheck'">
					<el-col :span="10" align="right">
						<el-button type="primary" size="medium " @click="handleSave">确定</el-button>
					</el-col>
					<el-col :span="2"/>
					<el-col :span="12" align="center" >
						<el-button @click="handleCancel">取消</el-button>
					</el-col>
				</el-row>
			</div>
		</el-form>
	</div>
</template>

<script>
	import VueUeditorWrap from "vue-ueditor-wrap";
	import { productInfo, updateProduct, addProduct,getTemplates,getCateList } from "@/api/product";
	import UEditorConfig from "@/utils/ueditor";
	import { mapGetters } from "vuex";


	export default {
		name: "ProductDetail",
		components: { VueUeditorWrap },
		computed: {
			...mapGetters(["shopId", "shopName", "name"]),
			realTemplates() {
				return this.asyncTemplates || this.templates;
			}
		},
		props: {
			isEdit: {
				type: Boolean,
				default: false
			},
			productInfo: {
				type: Object,
				default(){
					return {};
				}
			},
			templates: {
				type: Array,
				default(){
					return [];
				}
			},
			hasMore: {
				type: Boolean,
				default: true
			},
			merchants: {
				type: Array,
				default(){
					return [];
				}
			}
		},
		data(){
			const validateRequire = (rule, value, callback) => {
				if(value === "") {
					this.$message({
						message: rule.field + "为必传项",
						type: "error"
					});
					callback(new Error(rule.field + "为必传项"));
				} else {
					callback();
				}
			};
			const validateSpecs = (rule, value, callback) => {
				if(value.some(item => !item.specs_name.trim() || !item.price || !item.weight)){
					callback(new Error("品种规格输入有误，请检查"));
				} else {
					callback();
				}
			};
			const validateFileList = (rule, value, callback) => {
				if(value == null || value.length===0){
					callback(new Error("请选择图片"));
				} else {
					callback();
				}
			};
			const validatePriority = (rule, value, callback) => {
				if(!/^[0-9]*$/.test(value)){
					callback(new Error("店铺排序只能输入正整数"));
				} else{
					callback();
				}
			};
			return {
				cates: [],
				asyncTemplates: "",
				myConfig: UEditorConfig,
				msg: "",
				loading: false,
				userListOptions: [],
				rules: {
					image_uri: [{ validator: validateRequire }],
					title: [{ validator: validateRequire }],
					content: [{ validator: validateRequire }],
					category_id: [{ required: true, message: "所属分类不能为空", trigger: ["blur", "change"] }],
					template_id: [{ required: true, message: "运费模板不能为空", trigger: ["blur", "change"] }],
					product_name: [{ required: true, message: "商品标题不能为空", trigger: ["blur", "change"] }],
					specs_list: [{ required: true, validator: validateSpecs }],
					fileList: [{ required: true, validator: validateFileList }],
					priority: [{validator: validatePriority}]
				},
				temp: {
					specs_name: "",
					price: "",
					weight: 0
				},
				postForm: {
					serial_no: "",
					applicant: "",
					apply_time: "",
					product_id: "",
					product_name: "",
					shop_id: "",
					template_id: "",
					category_id: "",
					priority: 0,
					detail: "",
					image_arr: [],
					specs_list: [{
						specs_name: "",
						price: "",
						weight: 0
					}],
					fileList: []
				},
				dialogImageUrl: "",
				imagePreviewDialog: false,
				tempRoute: {},
				options: [{
					value: "kg",
					label: "kg"
				}, {
					value: "g",
					label: "g"
				},],
				uploadDisabled: false
			};
		},
		created(){
			getCateList({status: "1"}).then(({data:res}) => {
				console.log(res);
				this.cates = res;
			});
			// 在商品审核页面 调用商品申请详情接口
			if(this.$route.name === "ProductCheck" || this.isEdit) {
				let postForm = Object.assign({}, this.productInfo);
				let fileList = [];
				postForm.image_arr.forEach(item => {
					let temp = {};
					temp.url = item;
					fileList.push(temp);
					temp = null;
				});
				this.uploadDisabled = fileList.length >= 3;
				postForm.fileList = fileList;
				this.postForm = postForm;
			}
		},
		beforeDestroy(){
			this.postForm = {
				serial_no: "",
				applicant: "",
				apply_time: "",
				product_id: "",
				product_name: "",
				shop_id: "",
				template_id: "",
				category_id: "",
				priority: 0,
				detail: "",
				image_arr: [],
				specs_list: [{
					specs_name: "",
					price: "",
					weight: 0
				}],
			};
		},
		methods: {
			checkNumber(){
				console.log(this.postForm.priority);
				this.postForm.priority = this.postForm.priority.replace(/\D/g, "");
			},
			handleSelectChange(val){
				this.postForm.template_id = "";
				getTemplates({shop_id: val}).then(({ data: res }) => {
					let list = [];
					res.list && res.list.forEach(item => {
						let temp = {};
						temp.label = item.template_name;
						temp.value = item.template_id;
						list.push(temp);
						temp = null;
					});
					this.asyncTemplates = list;
				});
			},
			handleCancel(){
				this.$router.go(-1);
			},
			async handleSave(){
				this.$refs.postForm.validate(async valid => {
					if(valid) {
						if(this.isEdit) {
							let params = await this.generateParams();
							updateProduct(params).then(() => {
								this.$router.go(-1);
							});
						} else {
							let params = await this.generateParams();
							if(!params.shop_id) {
								params.shop_id = this.shopId;
							}
							delete params.serial_no;
							delete params.applicant;
							delete params.apply_time;
							delete params.product_id;
							addProduct(params).then(() => {
								this.$router.go(-1);
							});
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			async refuse(){
				let params = await this.generateParams();
				this.$emit("refused",params);
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
			generateImageUrl(file){
				return new Promise(async resolve => {
					let url = "";
					let raw = file && file.raw;
					if(raw) {
						url = await this.blobToDataURL(raw);
					} else {
						url = file && file.url;
					}
					resolve(url);
				});
			},
			async generateParams(){
				const params = Object.assign({}, this.postForm);
				const fileList = params.fileList || [];
				let image_list = [];
				const promises = fileList.map(item => this.generateImageUrl(item));
				for(const promise of promises) {
					const url = await promise;
					image_list.push(url);
				}
				params.image_arr = image_list;
				params.username = this.name;
				delete params.fileList;
				return params;
			},
			async next(){
				let params = await this.generateParams();
				this.$emit("next",params);
				// console.log(params);
				// updateProduct(params).then(() => {
				// 	this.$emit("next",params);
				// });
			},
			addRow(){
				let temp = {
					specs_name: "",
					price: "",
					weight: 0
				};
				let specsList = this.postForm.specs_list.slice();
				specsList.push(temp);
				this.$set(this.postForm, "specs_list", specsList);
			},
			removeRow(index){
				let specsList = this.postForm.specs_list.slice();
				specsList.splice(index, 1);
				this.$set(this.postForm, "specs_list", specsList);
			},
			handlePictureCardPreview(file){
				this.dialogImageUrl = file.url;
				this.imagePreviewDialog = true;
			},
			handleChange(file, fileList){
				this.postForm.fileList = fileList.slice();
				this.uploadDisabled = fileList.length === 3;
			},
			beforeRemove(file, fileList){
				let name = file && file.name || "";
				return this.$confirm(`确定移除 ${ name }？`);
			},
			handleRemove(file, fileList){
				this.postForm.fileList = fileList.slice();
				this.uploadDisabled = fileList.length === 3;
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/styles/mixin.scss";

	.createPost-container {
		position: relative;

		.createPost-main-container {
			padding: 40px 15px 20px 10px;

			.postInfo-container {
				position: relative;
				@include clearfix;
				margin-bottom: 10px;

				.postInfo-container-item {
					float: left;
				}
			}
		}

		.word-counter {
			width: 40px;
			position: absolute;
			right: 10px;
			top: 0px;
		}
	}

	.article-textarea /deep/ {
		textarea {
			padding-right: 40px;
			resize: none;
			border: none;
			border-radius: 0px;
			border-bottom: 1px solid #bfcbd9;
		}
	}
</style>

<style>
	.edui-combox-body, .edui-button-body {
		height: 20px !important;
	}

	.edui-toolbar {
		height: 25px !important;
	}

	.disabled .el-upload--picture-card {
		display: none!important;
	}
</style>
