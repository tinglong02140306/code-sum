import { getToken } from "@/utils/auth";

export default {
	// 编辑器不自动被内容撑高
	autoHeightEnabled: true,
	// 初始容器高度
	initialFrameHeight: 480,
	// 初始容器宽度
	initialFrameWidth: "100%",
//工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
	toolbars: [[
		"bold", "italic", "underline", "fontborder", "strikethrough", "|", 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',"|","fontfamily", "fontsize", "|", "simpleupload"
	]],
	// imageActionName: "uploadimage",
	// imageFieldName: "image",
	// 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
	// serverUrl: "http://35.201.165.105:8000/controller.php",
	// serverUrl: "http://ue.test.etcsd.cn/sys/ueditor/exec",
	zIndex: 1999,
	serverUrl: "/xlkshop-manager/ueditor/exec",
	// 打包时需放开
	UEDITOR_HOME_URL: process.env.NODE_ENV === "production" ? "/xlk-shop/manager/static/UEditor/" : "/static/UEditor/",
	headers: {
		"Authorization": getToken()
	},
};
