<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.shop" clearable placeholder="店铺名称或ID" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.shop_status" placeholder="店铺状态" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in shopStatusOptions" :key="item.key" :label="item.display_name"
				           :value="item.key"/>
			</el-select>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<template v-if="roles.includes('shop_admin')">
				<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
				           @click="handleClick('create')">
					新增商户
				</el-button>
				<el-button class="filter-item" type="primary" icon="el-icon-edit"
				           @click="handleClick('edit')">
					修改商户
				</el-button>
			</template>
		</div>

		<el-table
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			border
			fit
			:summary-method="getSummaries"
			show-summary
			highlight-current-row
			style="width: 100%;"
		>
			<el-table-column
				align="center"
				width="88">
				<template slot-scope="{$index}">
					<el-radio v-model="radio" :label="$index">
						<!--						<span style="font-size:20px;">{{ radio === $index ? "★" : "☆" }}</span>-->
						<span style="font-size:20px;">&nbsp;</span>
					</el-radio>
				</template>
			</el-table-column>
			<el-table-column label="店铺ID" prop="id" sortable="custom" align="center" width="180">
				<template slot-scope="{row}">
					<span>{{ row.shop_id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="店铺名称" width="200px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.shop_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="门店数量" width="110px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.num }}</span>
				</template>
			</el-table-column>
			<el-table-column label="总店地址" fit align="center">
				<template slot-scope="{row}">
					<span>{{ row.address }}</span>
				</template>
			</el-table-column>
			<el-table-column label="总店联系电话" width="150px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.mobile }}</span>
				</template>
			</el-table-column>
			<el-table-column label="店铺状态" width="110px" align="center">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ row.status | typeFilter }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" width="180px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.gmt_create }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fit class-name="small-padding" style="min-width:60px;">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						详情
					</el-button>
					<template v-if="roles.includes('shop_admin')">
						<el-button size="mini" type="success" @click="handleBranch(row,'add')">
							新增分店
						</el-button>
						<el-button size="mini" @click="handleBranch(row,'modify')">
							修改分店
						</el-button>
					</template>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<!--	新增店铺/编辑店铺 Dialog	-->
		<el-dialog width="80%" :close-on-press-escape="false" :close-on-click-modal="false" :title="textMap[dialogStatus]"
		           :visible.sync="dialogFormVisible">
			<el-form ref="merchantForm" :rules="rules" :model="merchantForm" label-position="right" label-width="120px"
			         style="width: 600px; margin-left:50px;">
				<el-form-item label="店铺ID" prop="shop_id" v-if="dialogStatus!=='create'">
					<el-input v-model="merchantForm.shop_id" disabled/>
				</el-form-item>
				<el-form-item label="店铺名称" prop="shop_name">
					<el-input v-model="merchantForm.shop_name" clearable maxlength="32" placeholder="不超过32个字，不可为空"/>
				</el-form-item>
				<el-form-item label="信联支付账户" prop="mch_id_consume">
					<el-input v-model="merchantForm.mch_id_consume" clearable placeholder="不可为空"/>
				</el-form-item>
				<el-form-item label="信联退款账户" prop="mch_id_refund">
					<el-input v-model="merchantForm.mch_id_refund" clearable placeholder="不可为空"/>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="merchantForm.mobile" clearable placeholder="座机或手机号"/>
				</el-form-item>
				<el-form-item label="门店地址" prop="address">
					<el-input v-model="merchantForm.address" clearable :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
					          placeholder="不超过100个字"/>
				</el-form-item>
				<el-form-item v-if="false" label="配送区域" prop="ship_area">
					<el-cascader
						style="width:100%"
						placeholder="试试搜索"
						@change="pickArea"
						v-model="merchantForm.ship_area"
						filterable
						:options="options"
						:props="{ multiple:true }"
						clearable></el-cascader>
				</el-form-item>
				<el-form-item label="店铺主图" prop="imgs" v-if="dialogStatus!=='add'">
					<el-upload
						:limit="1"
						:on-exceed="handleExceed"
						action=""
						:auto-upload="false"
						:class="{ 'disabled': uploadDisabled }"
						:on-change="(file,fileList) => handleChange(file,fileList,'merchantForm')"
						list-type="picture-card"
						:file-list="merchantForm.fileList"
						:on-preview="handlePictureCardPreview"
						:before-remove="beforeRemove"
						:on-remove="(file,fileList) => handleRemove(file,fileList,'merchantForm')">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="imagePreviewDialog" append-to-body>
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="包邮起步费" prop="free_delivery" :rules="[{required: true}]">
					<el-input type="number" v-model="merchantForm.free_delivery">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="营业时间" prop="time_range">
					<el-time-picker
						is-range
						arrow-control
						value-format="HH:mm:ss"
						v-model="merchantForm.time_range"
						range-separator="至"
						@change="pickTime('merchantForm')"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						placeholder="选择时间范围">
					</el-time-picker>
				</el-form-item>
				<el-form-item label="店铺状态">
					<el-radio v-model="merchantForm.shop_status" label="1">启用</el-radio>
					<el-radio v-model="merchantForm.shop_status" label="0">停用</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					取消
				</el-button>
				<el-button type="primary" @click="submitForm">
					确定
				</el-button>
			</div>
		</el-dialog>

		<!--	新增分店/修改分店	-->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="textMap[dialogStatus]"
		           :visible.sync="dialogBranchFormVisible" @close="handleClose"
		           width="80%">
			<template v-if="dialogStatus === 'add'">
				<el-form ref="branchForm" :rules="rules" :model="branchForm" label-position="right" label-width="150px"
				         style="width: 600px; margin-left:50px;">
					<el-form-item label="店铺名称" prop="shop_name">
						<el-input v-model="branchForm.shop_name" placeholder="不超过32个字，不可为空"/>
					</el-form-item>
					<el-form-item label="信联支付账户" prop="mch_id_consume">
						<el-input v-model="branchForm.mch_id_consume" placeholder="不可为空"/>
					</el-form-item>
					<el-form-item label="信联退款账户" prop="mch_id_refund">
						<el-input v-model="branchForm.mch_id_refund" placeholder="不可为空"/>
					</el-form-item>
					<el-form-item label="联系电话" prop="mobile">
						<el-input v-model="branchForm.mobile" placeholder="座机或手机号"/>
					</el-form-item>
					<el-form-item label="门店地址" prop="address">
						<el-input v-model="branchForm.address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
						          placeholder="不超过100个字"/>
					</el-form-item>
					<el-form-item v-if="false" label="配送区域" prop="ship_area">
						<el-cascader
							style="width:100%"
							placeholder="试试搜索"
							@change="pickArea"
							v-model="branchForm.ship_area"
							filterable
							:options="options"
							:props="{ multiple:true }"
							clearable></el-cascader>
					</el-form-item>
					<el-form-item label="是否为总店" v-if="false">
						<el-radio v-model="branchForm.level" label="1">是</el-radio>
						<el-radio v-model="branchForm.level" label="0">否</el-radio>
					</el-form-item>
					<el-form-item label="店铺主图" prop="image" v-if="branchForm.level === '1'">
						<el-upload
							:limit="1"
							:on-exceed="handleExceed"
							:class="{ 'disabled': uploadDisabled }"
							action=""
							:auto-upload="false"
							:on-change="(file,fileList) => handleChange(file,fileList,'branchForm')"
							list-type="picture-card"
							:file-list="branchForm.fileList"
							:on-preview="handlePictureCardPreview"
							:before-remove="beforeRemove"
							:on-remove="(file,fileList) => handleRemove(file,fileList,'branchForm')">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="imagePreviewDialog" append-to-body>
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-form-item>
					<el-form-item label="包邮起步费" prop="free_delivery">
						<el-input type="number" v-model="branchForm.free_delivery">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="营业时间" prop="time_range">
						<el-time-picker
							is-range
							arrow-control
							value-format="HH:mm:ss"
							v-model="branchForm.time_range"
							range-separator="至"
							@change="pickTime('branchForm')"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							placeholder="选择时间范围">
						</el-time-picker>
					</el-form-item>
					<el-form-item label="店铺状态">
						<el-radio v-model="branchForm.shop_status" label="1">启用</el-radio>
						<el-radio v-model="branchForm.shop_status" label="0">停用</el-radio>
					</el-form-item>
				</el-form>
			</template>
			<template v-if="dialogStatus === 'modify'">
				<p style="color:red;">**每个标签页修改后需要单独保存，否则不会生效</p>
				<el-tabs style="margin-top:15px;" type="border-card" v-model="activeName" stretch
				         :before-leave="beforeTabLeave" @tab-click="handleTabClick">
					<el-tab-pane v-for="(tab,index) in tabs" :key="tab.shop_id" :label="tab.shop_name"
					             :name="tab.shop_id">
						<el-form ref="tabBranchForm" :rules="rules" :model="branchForm" label-position="right" label-width="170px"
						         style="margin-left:50px;">
							<el-form-item label="店铺ID" prop="shop_id">
								<el-input v-model="branchForm.shop_id" disabled/>
							</el-form-item>
							<el-form-item label="店铺名称" prop="shop_name">
								<el-input v-model="branchForm.shop_name" placeholder="不超过32个字，不可为空"/>
							</el-form-item>
							<el-form-item label="信联支付账户" prop="mch_id_consume">
								<el-input v-model="branchForm.mch_id_consume" placeholder="不可为空"/>
							</el-form-item>
							<el-form-item label="信联退款账户" prop="mch_id_refund">
								<el-input v-model="branchForm.mch_id_refund" placeholder="不可为空"/>
							</el-form-item>
							<el-form-item label="联系电话" prop="mobile">
								<el-input v-model="branchForm.mobile" placeholder="座机或手机号"/>
							</el-form-item>
							<el-form-item label="门店地址" prop="address">
								<el-input v-model="branchForm.address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
								          placeholder="不超过100个字"/>
							</el-form-item>
							<el-form-item v-if="false" label="配送区域" prop="ship_area">
								<el-cascader
									style="width:100%"
									placeholder="试试搜索"
									@change="pickArea"
									v-model="branchForm.ship_area"
									filterable
									:options="options"
									:props="{ multiple:true }"
									clearable></el-cascader>
							</el-form-item>
							<el-form-item label="是否为总店" v-if="false">
								<el-radio v-model="branchForm.level" label="1">是</el-radio>
								<el-radio v-model="branchForm.level" label="0">否</el-radio>
							</el-form-item>
							<el-form-item label="店铺主图" prop="image" v-if="branchForm.level === '1'">
								<el-upload
									:limit="1"
									:on-exceed="handleExceed"
									action=""
									:auto-upload="false"
									:class="{ 'disabled': uploadDisabled }"
									:on-change="(file,fileList) => handleChange(file,fileList,'branchForm')"
									list-type="picture-card"
									:file-list="branchForm.fileList"
									:on-preview="handlePictureCardPreview"
									:before-remove="beforeRemove"
									:on-remove="(file,fileList) => handleRemove(file,fileList,'branchForm')">
									<i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog :visible.sync="imagePreviewDialog" append-to-body>
									<img width="100%" :src="dialogImageUrl" alt="">
								</el-dialog>
							</el-form-item>
							<el-form-item label="包邮起步费" prop="name">
								<el-input type="number" v-model="branchForm.free_delivery">
									<template slot="append">元</template>
								</el-input>
							</el-form-item>
							<el-form-item label="营业时间" prop="time_range">
								<el-time-picker
									is-range
									arrow-control
									value-format="HH:mm:ss"
									v-model="branchForm.time_range"
									range-separator="至"
									@change="pickTime('branchForm')"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
									placeholder="选择时间范围">
								</el-time-picker>
							</el-form-item>
							<el-form-item label="店铺状态">
								<el-radio v-model="branchForm.shop_status" label="1">启用</el-radio>
								<el-radio v-model="branchForm.shop_status" label="0">停用</el-radio>
							</el-form-item>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</template>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogBranchFormVisible = false">
					取消
				</el-button>
				<el-button type="primary" @click="submitBranch">
					确定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import area from "@/utils/area";
	import { shopStatusMap, shopStatusOptions } from "@/utils/mapUtils";
	import { fetchList, merchantInfo, addMerchant, updateMerchant, merchantChildren } from "@/api/merchant";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { mapGetters } from "vuex";

	const shopStatusKeyValue = shopStatusOptions.reduce((acc, cur) => {
		acc[cur.key] = cur.display_name;
		return acc;
	}, {});

	export default {
		name: "MerchantIndex",
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
			typeFilter(type){
				return shopStatusKeyValue[type];
			}
		},
		computed: {
			...mapGetters(["roles", "level", "shopId"]),
		},
		watch: {
			dialogFormVisible(){
				if(!this.dialogFormVisible) {
					this.resetTemp();
					this.uploadDisabled = false;
				}
			},
			dialogBranchFormVisible(){
				if(!this.dialogBranchFormVisible) {
					this.resetBranch();
					this.uploadDisabled = false;
				}
			}
		},
		data(){
			var validatePic = (rule, value, callback) => {
				if(this.dialogStatus === "add" && this.branchForm.level === "1") {
					if(this.branchForm.fileList.length === 0) {
						callback(new Error("总店主图不能为空"));
					}
					callback();
				}
				if(this.dialogStatus === "modify") {
					let idx = this.tabs.findIndex(tab => tab.shop_id === this.activeName);
					if(this.tabs[idx].level === "1" && this.tabs[idx].fileList.length === 0) {
						callback(new Error("总店主图不能为空"));
					}
					callback();
				}
				callback();
			};
			return {
				shopStatusMap,
				sumBranchNum: 0,
				radio: -1,
				tabs: [],
				tableKey: 0,
				areax: "",
				imagePreviewDialog: false,
				dialogImageUrl: "",
				total: 0,
				list: [],
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					shop: "",
					shop_status: "1"
				},
				activeName: "",
				shopStatusOptions,
				options: area,
				merchantForm: {
					shop_id: "",
					time_range: "",
					shop_name: "",
					mobile: "",
					address: "",
					fileList: [],
					free_delivery: "",
					open_time_start: "",
					open_time_end: "",
					shop_status: "1",
					level: "1",
					head_shop_id: "",
					mch_id_consume: "",
					mch_id_refund: ""
				},
				branchForm: {
					shop_id: "",
					time_range: "",
					shop_name: "",
					mobile: "",
					address: "",
					fileList: [],
					free_delivery: "",
					open_time_start: "",
					open_time_end: "",
					shop_status: "1",
					level: "2",
					head_shop_id: "",
					mch_id_consume: "",
					mch_id_refund: ""
				},
				multipleSelection: [],      // 选中的记录
				dialogFormVisible: false,   // 控制新增商户 修改商户dialog
				dialogBranchFormVisible: false,   // 控制新增分店 修改分店dialog
				dialogStatus: "",
				textMap: {
					edit: "修改商户",
					create: "新增商户",
					add: "新增分店",
					modify: "修改分店"
				},
				rules: {
					shop_name: [{ required: true, message: "店铺名称不能为空", trigger: ["blur", "change"] }],
					mch_id_consume: [{ required: true, message: "信联支付账户不能为空", trigger: "blur" }],
					mch_id_refund: [{ required: true, message: "信联退款账户不能为空", trigger: "blur" }],
					mobile: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
					address: [{ required: true, message: "门店地址不能为空", trigger: "blur" }],
					image: [{ validator: validatePic, trigger: "blur" }],
				},
				uploadDisabled: false,
				needRefresh: false
			};
		},
		created(){
			this.getList();
		},
		methods: {
			handleClose(){
				if(this.needRefresh) {
					this.needRefresh = false;
					this.getList();
				}
			},
			handleTabClick(){
				return false;
			},
			confirm(){
				return new Promise((resolve) => this.$confirm("切换标签将导致修改丢失，请确保您修改后已经保存", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					resolve(true);
				}).catch(() => {
					resolve(false);
				}));
			},
			async beforeTabLeave(activeName, oldActiveName){
				if(activeName !== oldActiveName && oldActiveName !== "" && activeName !== "") {
					let result = await this.confirm();
					if(result) {
						this.resetBranch(false);
						let defaultTab = this.tabs[this.tabs.findIndex(item => item.shop_id === activeName)];
						merchantInfo({ shop_id: defaultTab.shop_id, is_query_sub_shop: "0" }).then(({ data: shop }) => {
							this.generateBranchStructure(shop, "modify");
							this.$nextTick(() => {
								return true;
							});
						});
					} else {
						return Promise.reject();
					}
				} else {
					return false;
				}
			},
			formId(index){
				return "branch" + index;
			},
			submitForm(){
				let merchantForm = this.merchantForm;
				this.$refs["merchantForm"].validate(async (valid) => {
					if(valid) {
						let params = await this.generateParams(merchantForm);
						if(this.dialogStatus === "create") {
							addMerchant(params).then(() => {
								this.dialogFormVisible = false;
								this.$notify.success("保存成功");
								this.getList();
							});
							return;
						}
						if(this.dialogStatus === "edit") {
							updateMerchant(params).then(() => {
								this.dialogFormVisible = false;
								this.$notify.success("保存成功");
								this.getList();
							});
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			submitBranch(){
				let formName = "branchForm";
				let branchForm = this.branchForm;
				if(this.dialogStatus === "modify") {
					let idx = this.tabs.findIndex(tab => tab.shop_id === this.activeName);
					formName = "tabBranchForm";
				}
				// 这里有个问题 动态循环出来的ref  需要[0]来取  其他的不要
				let dom = this.$refs[formName][0] || this.$refs[formName];
				dom.validate(async (valid) => {
					if(valid) {
						let params = await this.generateParams(branchForm);
						console.log(params);
						if(this.dialogStatus === "add") {
							addMerchant(params).then(() => {
								this.dialogBranchFormVisible = false;
								this.$notify.success("保存成功");
								this.getList();
							});
							return;
						}
						if(this.dialogStatus === "modify") {
							updateMerchant(params).then(() => {
								this.$notify.success("保存成功");
								if(this.tabs.length === 1) {
									this.dialogBranchFormVisible = false;
									this.getList();
								} else {
									this.needRefresh = true;
								}
							});
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			// 生成参数
			async generateParams(form){
				let params = {
					...form,
				};
				let raw = form.fileList[0] && form.fileList[0].raw;
				if(raw) {
					let base64 = await this.blobToDataURL(raw);
					params = {
						...params,
						image: base64
					};
				} else {
					params = {
						...params,
						image: form.fileList[0] && form.fileList[0].url || "",
					};
				}
				delete params.time_range;
				delete params.fileList;
				return params;
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
			pickTime(formName){
				if(this[formName]["time_range"]) {
					this[formName] = {
						...this[formName],
						open_time_start: this[formName].time_range[0],
						open_time_end: this[formName].time_range[1],
					};
				}
			},
			pickArea(){
			},
			handlePictureCardPreview(file){
				this.dialogImageUrl = file.url;
				this.imagePreviewDialog = true;
			},
			handleRemove(file, fileList, formName){
				this[formName].fileList = fileList;
				this.uploadDisabled = fileList.length === 1;
			},
			handleChange(file, fileList, formName){
				this[formName].fileList = fileList.slice(-1);
				this.uploadDisabled = fileList.length === 1;
			},
			beforeRemove(file, fileList){
				let name = file && file.name || "";
				return this.$confirm(`确定移除 ${ name }？`);
			},
			async handleClick(status){
				if(status === "edit") {
					//  修改商户  先判断一下是不是选中了一个
					if(this.radio === -1) {
						this.$message.warning("请先选择商户");
						return;
					}
					let shop_id = this.list[this.radio].shop_id;
					merchantInfo({ shop_id, is_query_sub_shop: "0" }).then(({ data: res }) => {
						let merchantForm = {
							...res,
							time_range: [res.open_time_start, res.open_time_end],
							fileList: [{ url: res.image }]
						};
						this.uploadDisabled = true;
						delete merchantForm.sub_shop_list;
						this.merchantForm = merchantForm;
						this.dialogStatus = status;
						this.dialogFormVisible = true;
						this.$nextTick(() => {
							this.$refs["merchantForm"].clearValidate();
						});
					}).catch(error => {
					});
					return;
				}

				this.dialogStatus = status;
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs["merchantForm"].clearValidate();
				});
			},
			handleExceed(files, fileList){
				this.$message.warning(`当前限制选择 1 个文件，请删除多余图片后再选择`);
			},
			getSummaries(param){
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = "合计";
						return;
					}
					if(index === 3) {
						sums[index] = this.sumBranchNum;
						return;
					}
					sums[index] = "";
				});
				return sums;
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					per_num: this.listQuery.limit
				};
				delete params.limit;
				fetchList(params).then(({ data: res }) => {
					this.sumBranchNum = res.total_num;
					this.list = res.result_list;
					this.total = res.total;
					this.listLoading = false;
				}).catch(error => {
					console.log(error);
					this.listLoading = false;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
			async handleBranch(row, status){
				if(status === "modify") {
					let shop_id = row.shop_id;
					let { data: res } = await merchantChildren({ shop_id });
					// 过滤掉主商户 只展示子商户  分店只显示自己
					let list = res.shop_list.filter(item => item.level === "2");
					if(this.level === "2") {
						list = list.filter(item => item.shop_id === this.shopId);
					}
					console.log(list);
					if(!list.length) {
						this.$notify.info("该商户没有子商户！");
						return;
					}
					this.tabs = list;
					let defaultTab = list[0];
					this.activeName = defaultTab.shop_id;
					let { data: shop } = await merchantInfo({ shop_id: defaultTab.shop_id, is_query_sub_shop: "0" });
					this.generateBranchStructure(shop, status);
					this.$nextTick(() => {
						return true;
					});
				}
				this.branchForm.head_shop_id = row.shop_id;
				this.dialogStatus = status;
				this.dialogBranchFormVisible = true;
			},
			generateBranchStructure(res, status){
				delete res.sub_shop_list;
				let branchForm = {
					...res,
					time_range: [res.open_time_start, res.open_time_end],
					fileList: [{ url: res.image }]
				};
				delete branchForm.sub_shop_list;
				this.branchForm = branchForm;
				this.dialogStatus = status;
				this.dialogBranchFormVisible = true;
			},
			resetTemp(){
				this.merchantForm = {
					shop_id: "",
					time_range: "",
					shop_name: "",
					mobile: "",
					address: "",
					fileList: [],
					free_delivery: "",
					open_time_start: "",
					open_time_end: "",
					shop_status: "1",
					level: "1",
					head_shop_id: "",
					mch_id_consume: "",
					mch_id_refund: ""
				};
			},
			resetBranch(flag = true){
				if(flag) {
					this.activeName = "";
				}
				this.branchForm = {
					shop_id: "",
					time_range: "",
					shop_name: "",
					mobile: "",
					address: "",
					fileList: [],
					free_delivery: "",
					open_time_start: "",
					open_time_end: "",
					shop_status: "1",
					level: "2",
					head_shop_id: "",
					mch_id_consume: "",
					mch_id_refund: ""
				};
			},
			handleUpdate(row){
				this.$router.push("/merchant/manage/" + row.shop_id);
			},
		}
	};
</script>
