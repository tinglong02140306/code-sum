<template>
	<div class="createPost-container" style="padding:0;">
		<el-form>
			<div class="createPost-main-container">
				<el-row v-if="productInfo.audit_status === '1'">
					<el-form-item style="width: 100%;" label-width="120px" label="拒绝原因" class="postInfo-container-item">
						<el-input type="textarea" v-model="productInfo.reject_reason" :disabled="true"/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="postInfo-container">
							<el-row>
								<el-col :span="12">
									<el-form-item style="width: 100%;" label-width="120px" label="商品ID" class="postInfo-container-item">
										<el-input placeholder="请输入内容" v-model="productInfo.product_id" :disabled="true"/>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item style="width: 100%;" label-width="120px" label="所在店铺" class="postInfo-container-item">
										<el-input placeholder="请输入内容" :value="productInfo.shop_name" :disabled="true"/>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item style="width: 100%;" prop="product_name" label-width="120px" label="商品标题" class="postInfo-container-item">
							<el-input placeholder="不超过100个字" v-model="productInfo.product_name" disabled/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item style="width: 100%;" prop="category_id" label-width="120px" label="所属分类" class="postInfo-container-item">
							<el-input placeholder="不超过100个字" v-model="productInfo.category_name" disabled/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="运费模板" prop="template_id"
						              class="postInfo-container-item">
							<el-input placeholder="不超过100个字" v-model="productInfo.template_name" :disabled="true"/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="品种规格" class="postInfo-container-item">
							<template v-for="(spec,index) in productInfo.specs_list">
								<div class="postInfo-container">
									<el-row>
										<el-col :span="4">
											<el-input placeholder="不超过50个字" v-model="spec.specs_name" :disabled="true"/>
										</el-col>
										<el-col :span="3" align="center">价格</el-col>
										<el-col :span="4">
											<el-input placeholder="请输入" v-model="spec.price" :disabled="true">
												<template slot="append">元</template>
											</el-input>
										</el-col>
										<el-col :span="3" align="center">重量</el-col>
										<el-col :span="4">
											<el-input placeholder="请输入" v-model="spec.weight" :disabled="true">
												<template slot="append">g</template>
											</el-input>
										</el-col>
									</el-row>
								</div>
							</template>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="图片上传" class="postInfo-container-item">
							<template v-for="url in productInfo.image_arr">
								<el-image
									style="width: 100px; height: 100px"
									:src="url"
									:preview-src-list="productInfo.image_arr">
								</el-image>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item prop="detail" style="width: 100%;" label-width="120px" label="产品详情">
							<vue-ueditor-wrap :destroy="true" :value="productInfo.detail" :config="myConfig"></vue-ueditor-wrap>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item style="width: 100%;" label-width="120px" label="店铺排序" class="postInfo-container-item">
							<el-input placeholder="仅可输入正整数" v-model="productInfo.priority" type="number" disabled/>
						</el-form-item>
					</el-col>
				</el-row>

			</div>
		</el-form>
	</div>
</template>

<script>
	import VueUeditorWrap from "vue-ueditor-wrap";
	import UEditorConfig from "@/utils/ueditor";

	export default {
		name: "ProductView",
		components: { VueUeditorWrap },
		props: {
			productInfo: {
				type: Object,
				default(){
					return {};
				}
			},
		},
		data(){
			return {
				myConfig: {...UEditorConfig,toolbars: []},
			};
		},
		methods: {}
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
</style>
