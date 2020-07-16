<template>
	<div :class="classObj" class="app-wrapper">
		<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
		<sidebar class="sidebar-container"/>
		<div :class="{hasTagsView:needTagsView}" class="main-container">
			<div :class="{'fixed-header':fixedHeader}">
				<navbar @reset="resetPwd"/>
				<tags-view v-if="needTagsView"/>
			</div>
			<app-main/>
			<right-panel v-if="showSettings">
				<settings/>
			</right-panel>
		</div>
		<el-dialog title="修改用户" :visible.sync="dialogVisible" width="600px">
			<el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" class="form-container">
				<div class="createPost-main-container">
					<el-row>
						<el-col :span="24">
							<div class="postInfo-container">
								<el-row>
									<el-col :span="23">
										<el-form-item style="width: 100%;" label-width="100px" label="用户名" class="postInfo-container-item">
											<el-input placeholder="请输入内容" :disabled="true" :value="userName"/>
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
									<el-col :span="23">
										<el-form-item style="width: 100%;" label-width="100px" label="原密码" class="postInfo-container-item"
										              prop="oldPwd">
											<el-input placeholder="请输入原密码" type="password" v-model="pwdForm.oldPwd" disabled/>
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
									<el-col :span="23">
										<el-form-item style="width: 100%;" label-width="100px" label="新密码" class="postInfo-container-item"
										              prop="newPwd">
											<el-input placeholder="请输入新密码" type="password" v-model="pwdForm.newPwd"/>
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
									<el-col :span="23">
										<el-form-item style="width: 100%;" label-width="100px" label="确认新密码" class="postInfo-container-item"
										              prop="confirmNewPwd">
											<el-input placeholder="请再次输入新密码" type="password" v-model="pwdForm.confirmNewPwd"/>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>

					<div slot="footer" class="dialog-footer" style="text-align:right">
						<el-button @click="dialogVisible = false">
							取消
						</el-button>
						<el-button type="primary" @click="confirm">
							确定
						</el-button>
					</div>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import RightPanel from "@/components/RightPanel";
	import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
	import ResizeMixin from "./mixin/ResizeHandler";
	import { mapState,mapGetters } from "vuex";

	export default {
		name: "Layout",
		components: {
			AppMain,
			Navbar,
			RightPanel,
			Settings,
			Sidebar,
			TagsView
		},
		mixins: [ResizeMixin],
		computed: {
			...mapState({
				sidebar: state => state.app.sidebar,
				device: state => state.app.device,
				showSettings: state => state.settings.showSettings,
				needTagsView: state => state.settings.tagsView,
				fixedHeader: state => state.settings.fixedHeader
			}),
			...mapGetters(["userName","id","name"]),
			classObj(){
				return {
					hideSidebar: !this.sidebar.opened,
					openSidebar: this.sidebar.opened,
					withoutAnimation: this.sidebar.withoutAnimation,
					mobile: this.device === "mobile"
				};
			}
		},
		watch: {
			dialogVisible(){
				if(!this.dialogVisible) {
					this.resetForm();
				}
			}
		},
		data(){
			var validatePass = (rule, value, callback) => {
				if(value === "") {
					callback(new Error("请输入密码"));
				} else {
					if(this.pwdForm.newPwd !== "") {
						this.$refs.pwdForm.validateField("confirmNewPwd");
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === "") {
					callback(new Error("请再次输入密码"));
				} else if(value !== this.pwdForm.newPwd) {
					callback(new Error("两次输入密码不一致!"));
				} else {
					callback();
				}
			};
			return {
				pwdForm: {
					oldPwd: "123456",
					newPwd: "",
					confirmNewPwd: ""
				},
				pwdRules: {
					oldPwd: [
						{ required: true, message: "请输入原密码", trigger: "blur" },
					],
					newPwd: [
						{ required: true, validator: validatePass, trigger: "blur" },
					],
					confirmNewPwd: [
						{ required: true, validator: validatePass2, trigger: "blur" },
					]
				},
				dialogVisible: false,
			};
		},
		methods: {
			resetForm(){
				this.$refs.pwdForm.resetFields();
			},
			resetPwd(){
				this.dialogVisible = true;
			},
			confirm(){
				this.$refs.pwdForm.validate(async valid => {
					if(valid) {
						const data = {
							"user_id":this.id,
							"name":this.name,
							"username":this.userName,
							"password":this.pwdForm.newPwd
						};
						await this.$store.dispatch("user/resetPass", data);
						this.$nextTick(() => this.dialogVisible = false);
						this.$message({
							message: "修改成功，请重新登录",
							type: "success"
						});
						await this.$store.dispatch("user/logout");
						this.$router.push(`/login?redirect=${ this.$route.fullPath }`);
					} else {
						return false;
					}
				});
			},
			handleClickOutside(){
				this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "~@/styles/mixin.scss";
	@import "~@/styles/variables.scss";

	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;

		&.mobile.openSidebar {
			position: fixed;
			top: 0;
		}
	}

	.drawer-bg {
		background: #000;
		opacity: 0.3;
		width: 100%;
		top: 0;
		height: 100%;
		position: absolute;
		z-index: 999;
	}

	.fixed-header {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: calc(100% - #{$sideBarWidth});
		transition: width 0.28s;
	}

	.hideSidebar .fixed-header {
		width: calc(100% - 54px)
	}

	.mobile .fixed-header {
		width: 100%;
	}
</style>
