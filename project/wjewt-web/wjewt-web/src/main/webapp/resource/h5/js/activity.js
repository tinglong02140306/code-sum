$(function(){
	var OBJ = {
        shareType: croods.shareType.WebPage,
        shareText: '下载“皖警便民服务e网通”，领旺年红包！这里有一键挪车、警网头条、春节路况~',
        url: ACTIVITYURL,
        title: '皖警便民服务e网通旺年给您发福利啦',
        site: '皖警便民服务e网通旺年给您发福利啦',
        titleUrl: ACTIVITYURL,
        siteUrl: ACTIVITYURL,
        imageUrl: SHAREADDRESS + '/resource/h5/images/share/logo.png'
    },
    share = window.share = new Share('share', {
		list: [{
            icon: "qq",
            platform: "QQ",
            type: 1
        }, {
            icon: "qzone",
            type: 2,
            platform: "QQ空间"
        }, {
            icon: "session",
            type: 4,
            platform: "微信"
        }, {
            icon: "timeline",
            type: 5,
            platform: "朋友圈"
        }]
	});
	share.shareFun(OBJ);
	$('.header-item').off('.share-btn').on('click', '.share-btn', function() {
		share.show();
	});
	$('.back').on('click', function() {
		util.checkMobilePlatform() ? croods.pageClose({}) : window.history.back(-1);
	});
});