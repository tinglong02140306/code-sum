var CONFIG = {
    path: './public/wcportal/0.0.1/',
    appName: '皖警便民服务e网通 ',
    // viewPath: 'http://61.191.24.229:5069/',
    viewPath: 'https://wj.ahga.gov.cn/',
    serviceAddress: 'http://wewt.ahga.gov.cn:8082/wjewt/'
    // 测试环境
    // serviceAddress: 'http://192.168.57.177:8304/wjewt/'
    // 开发环境
    // serviceAddress: 'http://61.191.24.229:5069/wjewt/'
};
CONFIG.BlogDetail = CONFIG.serviceAddress + 'h5/blog-news-detail.do';
CONFIG.newsDetail = CONFIG.serviceAddress + 'h5/news-detail.do';
CONFIG.shareFile = CONFIG.serviceAddress + 'h5/share.do';
CONFIG.shareImg = CONFIG.serviceAddress + 'resource/h5/images/share/logo.png';
__inline('jquery/jquery-1.8.2.min.js');
__inline('croods/croods-1.3.1.min.js');
 