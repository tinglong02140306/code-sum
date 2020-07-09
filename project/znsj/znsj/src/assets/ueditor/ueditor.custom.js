/**
 * 改写图片上传地址
 * @type {Function|*}
 * @private
 */
// UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
// UE.Editor.prototype.getActionUrl = function(action) {
//     if (action == 'uploadimage' || action == 'uploadscrawl') {
//         return CONTEXTPATH + '/ueditor/uploadImg.do';
//     } else if (action == 'catchimage') {
//         return CONTEXTPATH + '/ueditor/catchImg.do';
//     } else if (action == 'uploadvideo') {
//         return CONTEXTPATH + '/ueditor/uploadFile.do';
//     } else if (action == 'listimage') {
//         return CONTEXTPATH + '/ueditor/listImg.do';
//     } else {
//         return this._bkGetActionUrl.call(this, action);
//     }
// }