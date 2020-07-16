<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.title" placeholder="店铺名称/编号" style="width: 200px;" class="filter-item"
			          @keyup.enter.native="handleFilter"/>
			<el-select v-model="listQuery.type" placeholder="状态" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"
				           :value="item.key"/>
			</el-select>
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
			@selection-change="handleSelectionChange"
			style="width: 100%">
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column width="180px" align="center" label="角色编号">
				<template slot-scope="scope">
					<span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center" label="角色名称">
				<template slot-scope="scope">
					<span>{{ scope.row.author }}</span>
				</template>
			</el-table-column>

			<el-table-column width="100px" label="角色状态">
				<template slot-scope="scope">
					<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
				</template>
			</el-table-column>

			<el-table-column class-name="status-col" label="备注" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ row.status }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="创建时间" width="110">
				<template slot-scope="{row}">
					<el-tag :type="row.status | statusFilter">
						{{ row.status }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="left" width="330" class-name="small-padding">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">
						修改
					</el-button>
					<el-button size="mini" type="success" @click="dialogFormVisible2 = true">
						用户列表
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

		<!--	新增	-->
		<el-dialog title="新增角色" :visible.sync="dialogFormVisible">
			<el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

				<div class="createPost-main-container">
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="12">
										<el-form-item style="width: 100%;" label-width="120px" label="角色名称" class="postInfo-container-item">
											<el-input  placeholder="2-12位" v-model="input"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item style="width: 100%;" label-width="120px" label="角色状态" class="postInfo-container-item">
								<el-radio v-model="radio" label="1">启用</el-radio>
								<el-radio v-model="radio" label="2">停用</el-radio>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="12">
										<el-form-item style="width: 100%;" label-width="120px" label="备注" class="postInfo-container-item">
											<el-input type="textarea" placeholder="请输入" v-model="input" />
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
				<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
					确定
				</el-button>
			</div>
		</el-dialog>

		<!--	用户列表	-->
		<el-dialog title="用户列表" :visible.sync="dialogFormVisible2">
			<el-table
				:key="tableKey"
				v-loading="listLoading"
				:data="list"
				border
				fit
				highlight-current-row
				style="width: 100%;"
				@sort-change="sortChange"
			>
				<el-table-column label="序号" min-width="150px">
					<template slot-scope="{row}">
						<span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
						<el-tag>{{ row.type | typeFilter }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="用户名" width="110px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.author }}</span>
					</template>
				</el-table-column>
				<el-table-column label="姓名" width="150px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="用户状态" width="110px" align="center">
					<template slot-scope="{row}">
						<span>{{ row.author }}</span>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
		</el-dialog>

	</div>
</template>

<script>
	import { fetchList } from '@/api/article'
	import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

	export default {
		name: 'ArticleList',
		components: { Pagination },
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'info',
					deleted: 'danger'
				}
				return statusMap[status]
			}
		},
		data() {
			return {
				list: null,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10
				},
				dialogFormVisible: false,
				dialogFormVisible2: false
			}
		},
		created() {
			this.getList()
		},
		methods: {
			handleSelectionChange(){},
			handleAdd(){
				this.dialogFormVisible = true;
			},
			getList() {
				this.listLoading = true
				fetchList(this.listQuery).then(response => {
					this.list = response.data.items
					this.total = response.data.total
					this.listLoading = false
				})
			}
		}
	}
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
