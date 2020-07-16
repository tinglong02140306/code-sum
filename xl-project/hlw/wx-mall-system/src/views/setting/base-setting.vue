<template>
	<div class="app-container">
		<div class="filter-container">
			<el-row class="row">
				<el-col :span="3" v-if="disabled">
					<el-button class="filter-item" style="margin-left: 10px;" type="primary"
					           @click="handleModify">
						修改
					</el-button>
				</el-col>
				<el-col :span="3" v-if="!disabled">
					<el-button class="filter-item" style="margin-left: 10px;" type="primary"
					           @click="handleCancel">
						取消
					</el-button>
				</el-col>
				<el-col :span="3">
					<el-button v-waves class="filter-item" type="primary"
					           @click="handleSave">
						保存
					</el-button>
				</el-col>
			</el-row>
		</div>
		<div style="width:600px">
			<el-row style="height:50px;line-height:50px;">
				<el-col :span="6">自动确认收货</el-col>
				<el-col :span="6">
					<el-input :disabled="disabled" v-model="curData.input1"/>
				</el-col>
				<el-col :span="3" align="center">天</el-col>
			</el-row>
			<el-row style="height:50px;line-height:50px;">
				<el-col>发货后时间</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row style="height:50px;line-height:50px;">
				<el-col :span="6">默认好评时间</el-col>
				<el-col :span="6">
					<el-input :disabled="disabled" v-model="curData.input2"/>
				</el-col>
				<el-col :span="3" align="center">天</el-col>
			</el-row>
			<el-row style="height:50px;line-height:50px;">
				<el-col>确认收货后时间</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row style="height:50px;line-height:50px;">
				<el-col :span="6">售后时间</el-col>
				<el-col :span="6">
					<el-input :disabled="disabled" v-model="curData.input3"/>
				</el-col>
				<el-col :span="3" align="center">天</el-col>
			</el-row>
			<el-row style="height:50px;line-height:50px;">
				<el-col>确认收货后时间</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import { fetchList } from "@/api/article";
	import waves from "@/directive/waves"; // waves directive


	export default {
		name: "BaseSetting",
		directives: { waves },
		data(){
			return {
				disabled: true,
				originData: {
					input1:1,
					input2:2,
					input3:3,
				},
				curData: null
			};
		},
		created(){
			this.curData = Object.assign({},this.originData);
		},
		methods: {
			handleModify(){
				this.disabled = false;
			},
			handleSave(){
			},
			handleCancel(){
				this.curData = Object.assign({},this.originData);
				this.disabled = true;
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
