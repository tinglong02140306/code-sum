<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.shop" clearable placeholder="店铺名称/编号" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-input v-model="listQuery.product" clearable placeholder="商品名称/编号" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.product_status" placeholder="状态" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in productStatusOptions" :key="item.key" :label="item.display_name"
				           :value="item.key"/>
			</el-select>
			<el-select v-model="listQuery.audit_status" placeholder="审核状态" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in auditStatusOptions" :key="item.key" :label="item.label"
				           :value="item.key"/>
			</el-select>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
			           @click="handleCreate">
				添加商品
			</el-button>
			<el-button v-waves class="filter-item" type="primary" icon="el-icon-s-flag"
			           @click="handleRecommend" v-if="roles.includes('shop_admin')">
				设为推荐
			</el-button>
		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			@selection-change="handleSelectionChange"
			style="width: 100%">
			<el-table-column
				align="center"
				type="selection"
				width="55">
			</el-table-column>
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

			<el-table-column width="120px" align="center" label="店铺">
				<template slot-scope="scope">
					<span>{{ scope.row.shop_name }}</span>
				</template>
			</el-table-column>

			<el-table-column width="100px" label="价格/元" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.price }}</span>
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="审核状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.audit_status | auditFilter">
						{{ auditStatusMap[row.audit_status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="状态" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ productStatusMap[row.status] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="首页好物精选" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.is_recommend | statusFilter">
						{{ recommendMap[row.is_recommend] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="首页超值特惠" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.is_product_recommend | statusFilter">
						{{ recommendMap[row.is_product_recommend] }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="成交总量" width="110">
				<template slot-scope="{row}">
					<span>{{ row.sale_num }}</span>
				</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="创建时间">
				<template slot-scope="scope">
					<span>{{ scope.row.gmt_create }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="220" align="center" fixed="right" class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="getDetail(row)">
						查看
					</el-button>
					<template v-if="(roles.includes('shop_admin') || shopId === row.shop_id) && row.shop_status === '1'">
						<el-button type="primary" size="mini" @click="handleUpdate(row,'edit')" v-if="row.status==='0'">
							修改
						</el-button>
						<el-button v-if="row.status==='1'" size="mini" type="success" @click="handleUpdate(row,'unShelve')">
							下架
						</el-button>
						<el-button v-if="row.status==='0' && row.audit_status === '2'" size="mini" type="success"
						           @click="handleUpdate(row,'shelve')">
							上架
						</el-button>
						<el-button size="mini" @click="handleUpdate(row,'delete')" v-if="row.status==='0'">
							删除
						</el-button>
					</template>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
		            @pagination="getList"/>

		<!--	设为推荐  -->
		<el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="商品推荐"
		           :visible.sync="recommendFormVisible" style="overflow-y:scroll;">
			<p style="color:red;">**首页好物精选需要设置商品页排序</p>
			<template v-for="(recommend,index) in recommends">
				<el-card style="margin-bottom:15px;">
					<el-row>
						<el-col :span="6"><p>商品编号</p></el-col>
						<el-col :span="16">
							<el-input :value="recommend.product_id" disabled/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6"><p>商品名称</p></el-col>
						<el-col :span="16">
							<el-input :value="recommend.product_name" disabled/>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6"><p>首页好物精选</p></el-col>
						<el-col :span="5">
							<p>
								<el-radio v-model="recommend.type" label="1">是</el-radio>
								<el-radio v-model="recommend.type" label="0">否</el-radio>
							</p>
						</el-col>
						<el-col :span="8" v-if="recommend.type==='1'">
							<el-col :span="1"><span style="color:red;">*</span></el-col>
							<el-col :span="20">
								<el-input v-model="recommend.priority" min="0" type="number" placeholder="排序"/>
							</el-col>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6"><p>首页超值特惠</p></el-col>
						<el-col :span="5">
							<p>
								<el-radio v-model="recommend.ptype" label="1">是</el-radio>
								<el-radio v-model="recommend.ptype" label="0">否</el-radio>
							</p>
						</el-col>
						<el-col :span="8" v-if="recommend.ptype==='1'">
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="20">
								<el-input v-model="recommend.product_priority" min="0" type="number" placeholder="排序"/>
							</el-col>
						</el-col>
					</el-row>
				</el-card>
			</template>
			<div slot="footer" class="dialog-footer">
				<el-button @click="recommendFormVisible = false">
					取消
				</el-button>
				<el-button type="primary" @click="recommendProducts">
					确定
				</el-button>
			</div>
		</el-dialog>

		<!--	商品详情	-->
		<el-dialog width="60%" :append-to-body="true"
		           title="商品详情"
		           :visible.sync="dialogDetailVisible">
			<product-view
				:key="new Date().getTime()"
				:product-info="productInfo"
			/>
		</el-dialog>
	</div>
</template>

<script>
	import {
		fetchList,
		addProduct,
		updateProduct,
		productInfo,
		productRecommend,
		toggleProduct,
		delProduct
	} from "@/api/product";
	import waves from "@/directive/waves";
	import Pagination from "@/components/Pagination";
	import ProductView from "./components/ProductView";
	import {
		productStatusOptions,
		auditStatusOptions,
		auditStatusMap,
		productStatusMap,
		recommendMap
	} from "@/utils/mapUtils";
	import { mapGetters } from "vuex";
	import { merchantChildren } from "../../api/merchant";

	export default {
		name: "ProductList",
		components: { Pagination, ProductView },
		directives: { waves },
		filters: {
			statusFilter(status){
				const statusMap = {
					"2": "info",
					"1": "success",
					"0": "danger"
				};
				return statusMap[status];
			},
			auditFilter(status){
				const statusMap = {
					"0": "info",
					"2": "success",
					"1": "danger"
				};
				return statusMap[status];
			}
		},
		computed: {
			...mapGetters(["roles", "shopId"])
		},
		watch: {
			dialogDetailVisible(){
				if(!this.dialogDetailVisible) {
					this.productInfo = {};
				}
			}
		},
		data(){
			return {
				list: null,
				recommendFormVisible: false,
				recommends: [],
				productStatusOptions,
				auditStatusOptions,
				auditStatusMap,
				productStatusMap,
				recommendMap,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					shop: "",
					product: "",
					product_status: "",
					audit_status: ""
				},
				multipleSelection: [],
				productInfo: {},
				dialogDetailVisible: false,
				templates: [],
				merchants: []
			};
		},
		created(){
			this.getList();
		},
		methods: {
			async getDetail(row){
				const { product_id } = row;
				productInfo({ product_id }).then(({ data: info }) => {
					this.productInfo = {
						...info,
						...row
					};
					this.dialogDetailVisible = true;
				});
			},
			handleFilter(){
				this.listQuery.page = 1;
				this.getList();
			},
			handleRecommend(){
				if(!this.multipleSelection.length) {
					this.$message.warning("请先选择商品");
					return;
				}
				let filterList = this.multipleSelection.filter(item => item.audit_status === "2" && item.status === "1");
				if(!filterList.length) {
					this.$message.info("只有审核通过且已上架商品才能进行推荐商品操作");
					return;
				}
				let list = [];
				filterList.forEach(item => {
					let temp = {
						product_id: item.product_id,
						product_name: item.product_name,
						type: item.is_recommend,
						ptype: item.is_product_recommend,
						priority: item.recommend_priority || 0,
						product_priority: item.product_priority || 0
					};
					list.push(temp);
					temp = null;
				});
				this.recommends = list;
				this.recommendFormVisible = true;
			},
			handleUpdate(row, status){
				if(status === "edit") {
					const { product_id } = row;
					this.$router.push("/products/edit/" + product_id);
					return;
				}
				if(status === "shelve") {
					if(this.shopId) {
						merchantChildren({ shop_id: this.shopId, shop_status: "0" }).then(({ data: res }) => {
							if(res.shop_list.some(item => item.shop_id === this.shopId)) {
								this.$notify.error("当前店铺已经停用，无法上架商品，请先启用店铺");
								return;
							}
							toggleProduct({ product_id: row.product_id, status: "1" }).then(() => {
								this.$notify.success("操作成功");
								this.getList();
							});
						});
						return;
					}
					toggleProduct({ product_id: row.product_id, status: "1" }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					});
					return;
				}
				if(status === "unShelve") {
					this.$confirm("下架商品, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						toggleProduct({ product_id: row.product_id, status: "0" }).then(() => {
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
				// 删除商品
				if(row.status !== "0") {
					this.$alert("请先下架商品");
					return;
				}
				this.$confirm("删除商品, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "error"
				}).then(() => {
					delProduct({ product_id: row.product_id }).then(() => {
						this.$notify.success("操作成功");
						this.getList();
					});
				}).catch(() => {
					this.$message({
						type: "info",
						message: "已取消"
					});
				});
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			recommendProducts(){
				const recommends = this.recommends;
				if(recommends.some(item => item.type === "1" && item.priority == 0 )) {
					this.$message.error("首页好物精选需要设置商品页排序，请检查！");
					return;
				}
				if(recommends.some(item =>  !/^[0-9]*$/.test(item.priority))) {
					this.$message.error("首页好物精选只能输入正整数！");
					return;
				}
				productRecommend({ product_list: recommends }).then(() => {
					this.recommends = [];
					this.multipleSelection = [];
					this.recommendFormVisible = false;
					this.$notify.success("操作成功");
					this.getList();
				});
			},
			handleCreate(){
				if(this.shopId) {
					merchantChildren({ shop_id: this.shopId, shop_status: "0" }).then(({ data: res }) => {
						if(res.shop_list.some(item => item.shop_id === this.shopId)) {
							this.$notify.error("当前店铺已经停用，无法新增商品，请先启用店铺");
							return;
						}
						this.$router.push("/products/create");
					});
					return;
				}
				this.$router.push("/products/create");
			},
			getList(){
				this.listLoading = true;
				let params = {
					...this.listQuery,
					shop_id: this.shopId || "",
					per_num: this.listQuery.limit
				};
				delete params.limit;
				fetchList(params).then(({ data: res }) => {
					this.list = res.result_list || [];
					this.total = res.total;
					this.listLoading = false;
				}).catch(error => {
					console.log(error);
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
