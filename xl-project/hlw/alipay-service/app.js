App({
	onLaunch(){
		const updateManager = my.getUpdateManager();
		updateManager.onCheckForUpdate((res) => {
			// 请求完新版本信息的回调
			if(res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					my.alert({
						title: "更新提示",
						content: "新版本已经准备好，立即重启完成更新",
						success: () => {
							updateManager.applyUpdate();
						}
					});
				});
			}
			updateManager.onUpdateFailed(() => {
				my.alert({
					title: "更新提示",
					content: "网络错误！"
				});
			});
		});
	},
	globalData: {
		url: "",
	}
});