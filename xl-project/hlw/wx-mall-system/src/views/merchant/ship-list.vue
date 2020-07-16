<template>
	<div class="app-container">

		<div class="filter-container" style="display:flex;">

			<el-input v-model="listQuery.title" placeholder="商店编号" style="width: 200px;margin-right:20px"
			          class="filter-item" clearable
			          @keyup.enter.native="handleFilter"/>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">
				添加模板
			</el-button>
		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%">
			<el-table-column align="center" label="模板ID" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.template_id }}</span>
				</template>
			</el-table-column>

			<el-table-column fit align="center" label="模板名称">
				<template slot-scope="scope">
					<span>{{ scope.row.template_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="100px" label="店铺ID" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_id }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="是否包邮" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.is_pinkage | statusFilter">
						{{ shipStatusMap[row.is_pinkage] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="创建时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.gmt_create }}</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="修改时间" width="180">
				<template slot-scope="{row}">
					<span>{{ row.gmt_modified }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleClick(row,'view',row.template_id)">
						查看
					</el-button>
					<el-button type="primary" size="mini" @click="handleClick(row,'modify',row.template_id)">
						修改
					</el-button>
					<el-button type="primary" size="mini" @click="handleClick(row,'delete',row.template_id)">
						删除
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<!--	新建/更新  -->
		<el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :title="textMap[dialogStatus]"
		           :visible.sync="dialogFormVisible">
			<el-row style="margin-bottom:20px;text-align:center">
				<el-col :span="4">模板名称</el-col>
				<el-col :span="18">
					<el-input placeholder="请输入内容" v-model="templateForm.template_name" :disabled="dialogStatus === 'view'">
						<template slot="prepend"></template>
					</el-input>
				</el-col>
			</el-row>
			<el-row style="margin-bottom:20px;text-align:center" v-if="!shopId">
				<el-col :span="4">选择店铺</el-col>
				<el-col :span="18" align="left">
					<el-select v-model="rowShopId" clearable filterable placeholder="请选择" :disabled="dialogStatus === 'view'">
						<el-option
							v-for="item in merchantOptions"
							:key="item.key"
							:label="item.name"
							:value="item.key">
						</el-option>
					</el-select>
				</el-col>
			</el-row>
			<template>
				<el-row style="padding:0 20px;">
					<el-radio :disabled="dialogStatus === 'view'" v-model="templateForm.is_pinkage" label="1">包邮</el-radio>
					<el-radio :disabled="dialogStatus === 'view'" v-model="templateForm.is_pinkage" label="0">不包邮</el-radio>
				</el-row>
				<br>
				<el-row style="padding:0 20px;">
					<span style="color:red;">*包邮指所有配送区域包邮，如果想设置某个区包邮，其他区不包邮，请选择不包邮，在需要包邮的区设置首费0续费0</span>
				</el-row>
				<br>
			</template>
			<template v-if="templateForm.is_pinkage==='0'">
				<template v-if="dialogStatus !== 'view' ">
					<el-row style="padding:0 20px;">
						<el-button type="primary" @click="add">新增</el-button>
					</el-row>
					<br/>
				</template>
				<el-table
					v-loading="listLoading"
					:data="templateForm.sub_template_list"
					border
					fit
					highlight-current-row
					style="width: 100%;"
				>
					<el-table-column label="配送地区" fit align="center">
						<template slot-scope="{row}">
							<span>{{ [...row.areas].flat(Infinity).join(",") }}</span>
						</template>
					</el-table-column>
					<el-table-column label="首重" width="80px" align="center">
						<template slot-scope="{row}">
							<span>{{ row.first_weight }}</span>
						</template>
					</el-table-column>
					<el-table-column label="首费" width="80px" align="center">
						<template slot-scope="{row}">
							<span>{{ row.first_freight }}</span>
						</template>
					</el-table-column>
					<el-table-column label="续重" width="80px" align="center">
						<template slot-scope="{row}">
							<span>{{ row.continued_weight }}</span>
						</template>
					</el-table-column>
					<el-table-column label="续费" width="80px" align="center">
						<template slot-scope="{row}">
							<span>{{ row.continued_freight }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="180" v-if="dialogStatus !== 'view'">
						<template slot-scope="{row,$index}">
							<el-button type="primary" size="mini" @click="handleDelete(row,$index)">
								删除
							</el-button>
							<el-button type="primary" size="mini" @click="handleModList(row,$index)">
								修改
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div slot="footer" class="dialog-footer">
				<template v-if="dialogStatus === 'view'">
					<el-button type="primary" @click="dialogFormVisible = false">
						确认
					</el-button>
				</template>
				<template v-else>
					<el-button @click="dialogFormVisible = false">
						取消
					</el-button>
					<el-button type="primary" @click="handleUpdate()">
						保存
					</el-button>
				</template>
			</div>
		</el-dialog>

		<el-dialog :close-on-press-escape="false" :append-to-body="true" :close-on-click-modal="false"
		           :visible.sync="addDialogFormVisible">
			<el-form ref="tempForm" :model="temp" label-width="100px" :rules="tempRules">
				<el-form-item label="配送地区" prop="areaCode">
					<treeselect
						:multiple="true"
						:options="options"
						:clearable="true"
						:searchable="true"
						placeholder="请选择配送区域"
						v-model="temp.areaCode"
						noChildrenText="没有数据"
						@select="select"
						@deselect="deselect"
					/>
				</el-form-item>
				<el-form-item label="首重" prop="first_weight">
					<el-input v-model="temp.first_weight" type="number">
						<template slot="append">g</template>
					</el-input>
				</el-form-item>
				<el-form-item label="首费" prop="first_freight">
					<el-input v-model="temp.first_freight" type="number">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="续重" prop="continued_weight">
					<el-input v-model="temp.continued_weight" type="number">
						<template slot="append">g</template>
					</el-input>
				</el-form-item>
				<el-form-item label="续费" prop="continued_freight">
					<el-input v-model="temp.continued_freight" type="number">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<template>
					<el-button type="primary" @click="addToList">
						确认
					</el-button>
					<el-button @click="addDialogFormVisible = false">
						取消
					</el-button>
				</template>
			</div>
		</el-dialog>

	</div>
</template>

<script>

	import {
		getTemplates,
		addTemplate,
		updateTemplate,
		getTemplateInfo,
		deleteTemplate,
		merchantChildren
	} from "@/api/merchant";
	import { computeMonthRange, getToday,formatArea } from "@/utils";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import { mapGetters } from "vuex";
	import { shipStatusMap } from "@/utils/mapUtils";
	import Treeselect from "@riophae/vue-treeselect";
	import "@riophae/vue-treeselect/dist/vue-treeselect.css";
	import options from "@/utils/area";

	export default {
		name: "TemplateList",
		components: { Pagination, Treeselect },
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
		computed: {
			...mapGetters(["shopId"])
		},
		watch: {
			dialogFormVisible(){
				if(!this.dialogFormVisible) {
					this.resetForm();
					this.rowShopId = "";
				}
			},
			addDialogFormVisible(){
				if(!this.addDialogFormVisible) {
					this.temp = {
						ship_area: null,
						first_freight: "0",
						first_weight: "0",
						continued_freight: "0",
						continued_weight: "0",
						areas: [],
						areaCode: []
					};
				}
			}
		},
		data(){
			return {
				list: null,
				listLoading: true,
				addDialogFormVisible: false,
				listQuery: {
					title: "",
					page: 1,
					limit: 10
				},
				shipStatusMap,
				total: 0,
				area: null,
				options,
				templateForm: {
					template_id: "",
					template_name: "",
					is_pinkage: "1",
					sub_template_list: []
				},
				temp: {
					ship_area: null,
					first_freight: "0",
					first_weight: "0",
					continued_freight: "0",
					continued_weight: "0",
					areas: [],
					areaCode: []
				},
				tempRules: {
					areaCode: [{ required: true, message: "配送区域不能为空", trigger: ["blur", "change"] }],
					first_freight: [{ required: true, message: "首费不能为空", trigger: ["blur", "change"] }],
					first_weight: [{ required: true, message: "首重不能为空", trigger: ["blur", "change"] }],
					continued_freight: [{ required: true, message: "续费不能为空", trigger: ["blur", "change"] }],
					continued_weight: [{ required: true, message: "续重不能为空", trigger: ["blur", "change"] }],
				},
				dialogFormVisible: false,
				pickerOptions: {
					shortcuts: [{
						text: "本月",
						onClick(picker){
							let res = computeMonthRange();
							console.log(res);
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
				dialogStatus: "",
				textMap: {
					add: "新建模板",
					view: "查看模板",
					modify: "修改模板"
				},
				rowShopId: "",
				merchantOptions: [],
				curMerchant: ""
			};
		},
		created(){
			this.getList();
		},
		methods: {
			select(node, instanceId){
				this.temp.areas.push(node.label);
				this.temp.areaCode.push(node.id);
			},
			deselect(node, instanceId){
				this.temp.areas.splice(this.temp.areas.findIndex(item => item === node.label), 1);
				this.temp.areaCode.splice(this.temp.areaCode.findIndex(item => item === node.id), 1);
			},
			resetForm(){
				this.templateForm = {
					template_id: "",
					template_name: "",
					is_pinkage: "1",
					sub_template_list: []
				};
			},
			handleDelete(row, index){
				this.templateForm.sub_template_list.splice(index, 1);
			},
			handleUpdate(){
				if(!this.validCheck()) return;
				let params = {};
				let subList = [];
				// 不包邮才有子列表
				if(this.templateForm.is_pinkage === "0") {
					subList = [...this.templateForm.sub_template_list];
					subList.forEach(item => {
						item.ship_area = formatArea(item.areaCode);
						delete item.areas;
						delete item.areaCode;
					});
				}
				if(this.dialogStatus === "add") {
					params = {
						shop_id: this.rowShopId || this.shopId,
						...this.templateForm,
						sub_template_list: subList
					};
					delete params.template_id;
					addTemplate(params).then(() => {
						this.dialogFormVisible = false;
						this.$notify.success("操作成功");
						this.getList();
					});
				} else {
					params = {
						shop_id: this.rowShopId,
						...this.templateForm,
						sub_template_list: subList
					};
					updateTemplate(params).then(() => {
						this.dialogFormVisible = false;
						this.$notify.success("操作成功");
						this.getList();
					});
				}
			},
			validCheck(){
				const templateForm = this.templateForm;
				if(!templateForm.template_name.trim()) {
					this.$message.error("请输入模板名称");
					return false;
				}
				if(!this.shopId && !this.rowShopId) {
					this.$message.error("请选择店铺");
					return false;
				}
				if(templateForm.is_pinkage === "") {
					this.$message.error("请选择是否包邮");
					return false;
				}
				if(templateForm.is_pinkage === "0" && templateForm.sub_template_list.length === 0) {
					this.$message.error("请录入模板详情");
					return false;
				}
				return true;
			},
			handleModList(row, index){
				console.log(row);
				this.temp = { ...row };
				this.temp.index = index;
				this.addDialogFormVisible = true;
			},
			addToList(){
				if(this.$refs.tempForm.validate(valid => {
					if(valid) {
						if(this.temp.continued_weight <= 0) {
							this.$message.info("续重不能为0，请修改");
							return;
						}
						let temp = Object.assign({}, this.temp);
						if(temp.index !== undefined) {
							let index = temp.index;
							delete temp.index;
							this.$set(this.templateForm.sub_template_list, index, temp);
							this.addDialogFormVisible = false;
							return;
						}
						this.templateForm.sub_template_list.push(temp);
						console.log(this.templateForm);
						this.addDialogFormVisible = false;
					} else {
						return false;
					}
				})) ;
			},
			add(){
				this.addDialogFormVisible = true;
			},
			selectAllAreas(){
				this.temp.ship_area = [["历下区"], ["市中区"], ["槐荫区"], ["天桥区"], ["历城区"], ["长清区"], ["章丘区"], ["济阳区"], ["莱芜区"], ["钢城区"], ["平阴县"], ["商河县"], ["高新区"]];
			},
			handleAdd(){
				if(!this.shopId) {
					merchantChildren({ shop_id: "", shop_status: "" }).then(({ data: res }) => {
						let result = res.shop_list;
						let list = [];
						result.forEach(item => {
							let option = {};
							option.name = item.shop_name;
							option.key = item.shop_id;
							list.push(option);
							option = null;
						});
						this.merchantOptions = list;
						this.dialogStatus = "add";
						this.dialogFormVisible = true;
					});
				} else {
					this.dialogStatus = "add";
					this.dialogFormVisible = true;
				}
			},
			async handleClick(row, status, template_id){
				if(status === "delete") {
					this.$confirm("确认删除?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						deleteTemplate({ template_id }).then(() => {
							this.$notify.success("操作成功");
							this.getList();
						});
					}).catch(() => {
						this.$message({
							type: "info",
							message: "已取消"
						});
					});
					return;
				}
				// 商户
				if(!this.shopId) {
					merchantChildren({ shop_id: "", shop_status: "" }).then(({ data: res }) => {
						let result = res.shop_list;
						let list = [];
						result.forEach(item => {
							let option = {};
							option.name = item.shop_name;
							option.key = item.shop_id;
							list.push(option);
							option = null;
						});
						this.merchantOptions = list;
					});
				}
				// 获取模板信息
				getTemplateInfo({ template_id }).then(({ data: res }) => {
					console.log(res);
					res.sub_template_list.forEach(item => {
						let areas = [], areaCode = [];
						item.ship_area.forEach(area => {
							areas.push(area.name);
							areaCode.push(area.code);
						});
						item.areas = areas;
						item.areaCode = areaCode;
					});
					this.templateForm = {
						template_id: res.template_id,
						template_name: res.template_name,
						is_pinkage: res.is_pinkage,
						sub_template_list: res.sub_template_list,
					};
					this.rowShopId = row.shop_id;
					this.dialogStatus = status;
					this.dialogFormVisible = true;
				});
			},
			handleFilter(){
				this.listQuery = {
					...this.listQuery,
					page: 1,
					limit: 10
				};
				this.$nextTick(() => this.getList());
			},
			getList(){
				this.listLoading = true;
				let params = {
					shop_id: this.listQuery.title,
					page: this.listQuery.page,
					per_num: this.listQuery.limit
				};
				getTemplates(params).then(({ data: res }) => {
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

	td.el-table_1_column_4 {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

	}

	.xxxx {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
