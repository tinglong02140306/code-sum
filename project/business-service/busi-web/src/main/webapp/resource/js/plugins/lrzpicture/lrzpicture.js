
!function( $ ) {

    "use strict"

    var LrzPicture = function ( element, options ) {
        this.init('lrzPicture', element, options)
    }
    LrzPicture.prototype = {
        constructor: LrzPicture
        , init: function ( type, element, options ) {
            this.type = type
            this.$element = $(element)
            this.options = this.getOptions(options);
            this.lrz();
            if(this.options.cache)   this.loadCachePhoto() ;
        }
        , getOptions: function ( options ) {
            options = $.extend({}, $.fn[this.type].defaults, options);
            return options;
        },
        //页面显示图片
        showPhoto : function(filePath,save){
          /*  try {*/
                var filePathArray = filePath.split(','),
                    obj = this,
                    option = obj.options;
                for(var i = 0;i < filePathArray.length;i ++) {
                    option.uploadsize++;
                    var filePathId = filePathArray[i].replace(/\/|\./g, ""),
                        html = '<div class="span3 photoDiv" style="position:relative" id="' + filePathId + '">' +
                        '<img   style="width:3.04rem;height:2.88rem;border: 1px solid #e5e5e5;" src="' + option.downloadUrl + filePathArray[i] + '" id="'+filePathArray[i]+'"/>' +
                        (option.deleteValue ? '<div class="' + filePathId + '"  param="' + filePathArray[i] + '">' +
                            option.deleteTemplate + '</div>' : "") +
                        '</div>';
                      $(html).insertBefore(option.$uploadDiv);
                
                     //保存图片路径
                    if (save){
                        option.$pics.val(option.$pics.val() == "" ? filePathArray[i] : option.$pics.val() + "," + filePathArray[i]);
                    }
                    //点击删除
                    $("." + filePathId).on("click", function () {
                        var proxy = $.proxy(obj.deletePhone, obj);
                        proxy($(this).attr("param"), $(this).attr("class"));
                    });
                    obj.checkPhotoSize(obj);
                }
                $(".photoDiv img").off('error').on('error', function() {
                    $(this).attr('src', CONTEXTPATH + '/resource/h5/images/common/list-default.png');
                }); // 默认图片
               
           /* }catch (e){
                console.log('1');
            }*/
        },
        //显示缓存图片
        loadCachePhoto : function(){
            var obj = this;
            var option = obj.options;
            obj.checkPhotoSize(obj);
            if(option.$pics.val() !=""){
                var photoId = option.$pics.val().split(",");
                for(var i=0;i< photoId.length;i++){
                    var filePath = photoId[i];
                    if(filePath != ""){
                       // var timestamp=new Date().getTime();
                        obj.showPhoto(filePath,false);
                    }
                }
            }
        },
        //图片压缩上传
        lrz : function(){
            var obj = this;
            var option = obj.options;
            document.getElementById(option.id).addEventListener('change', function () {
                 //遮罩层
                var platForm = util.checkMobilePlatform(),
                    formData = new FormData();
                if(option.uploadsize >3 ){
                    var msg = '最多上传三张图片!';
                    if(platForm) {
                        util.toast(msg);
                    }else {
                        util.toastHtml(msg,'','','');
                    }
                    return;
                }
                var files = this.files,
                    fileLength;
                if(files.length > 3 - option.uploadsize) {
                    var msg = '最多上传三张图片!';
                    if(platForm) {
                        util.toast(msg);
                    }else {
                        util.toastHtml(msg,'','','');
                    }
                    return;
                }
                for (var i = 0; i < files.length; i++) {
                    formData.append('files'+i, files[i]);
                }
                $.ajax({
                    url: option.uploadUrl,
                    type: 'POST',
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function(){
                        if(platForm) {
                            util.mask(true,'上传中');
                        }else {
                            util.maskHtml(true,'上传中');
                        }
                    },
                    success: function (res) {
                        if(platForm) {
                            util.mask(false);
                        }else {
                            util.maskHtml(false,'');
                        }
                        $('#upload-plus')[0].value='';
                        if (!res.flag) {
                            var msg = res.message || '图片上传失败！';
                           if(platForm) {
                                util.toast(msg);
                            }else {
                                util.toastHtml(msg,'','','');
                            }
                            return;
                        }
                        if(option.show){
                           // var timestamp=new Date().getTime();
                           var ts = res.data;
                           obj.showPhoto(ts,true);
                        }

                    },
                    error: function() {
                        var msg = '图片上传失败!';
                        if(platForm) {
                            util.mask(false);
                            util.toast(msg)
                        }else {
                            util.maskHtml(false,'');
                            util.toastHtml(msg,'','','');
                        }
                    }
                }); 
               /* lrz(that.files[0], {
                    width: 500,
                    quality : 1
                })
                    .then(function (rst) {
                        // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
                        // 其他框架，例如ajax处理formData略有不同，请自行google，baidu。

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', option.uploadUrl);
                        xhr.onload = function (e) {
                            if (xhr.status === 200) {
                                // 上传成功后 ---执行函数
                                if(option.afterFun != null)
                                for(var i=0; i< option.afterFun.length ;i++){
                                    option.afterFun[i].call(obj,eval('('+xhr.responseText+')').filePath);
                                }
                                //更新头像
                                if(option.update) {
                                    obj.$element.attr("src", rst.base64);
                                }
                                //显示图片
                                if(option.show){

                                   // var timestamp=new Date().getTime();
                                     var ts=eval('('+xhr.responseText+')').data;

                                    obj.showPhoto(ts,true);
                                }
                            } else {
                                // 处理其他情况
                               // alert(JSON.stringify(e));
                            }
                            //解决安卓重复上传同一张图片不显示的方法---暂时
                            document.getElementById(option.id).outerHTML = document.getElementById(option.id).outerHTML;
                            obj.lrz();
                            if(platForm) {
                                util.mask(false);
                            }else {
                                util.maskHtml(false,'');
                            }
                        };
                        xhr.onerror = function (e) {
                            if(platForm) {
                                util.mask(false);
                            }else {
                                util.maskHtml(false,'');
                            }
                            if(platForm) {
                                util.toast('图片上传失败！');
                            }else {
                                util.toastHtml('图片上传失败！','','','');
                            }
                            // 处理错误
                            //bui.alert(JSON.stringify(e));

                        };
                        // issues #45 提到似乎有兼容性问题,关于progress
                        xhr.upload.onprogress = function (e) {
                            // 上传进度
                            var percentComplete = ((e.loaded / e.total) || 0) * 100;
                        };
                        // 添加参数和触发上传
                       // rst.formData.append('a', '我是参数');
                        xhr.send(rst.formData);
                        return rst;
                    });*/
            });
        },
        //限制图片数量
        checkPhotoSize : function(obj){
            var option = obj.options;
            var size = option.size;
            if(size != "" && ((size == 1 && option.$pics.val()!="") ||
                (/,/g.test(option.$pics.val()) && option.$pics.val().match(/,/g).length == (size-1)))){
                // bui.alert("最多可上传"+size+"张照片!");
                // return  false;
                option.$uploadDiv.hide();
            }else{
                // return true;
            }
        },
        //删除图片
        deletePhone : function(filePath,filePathId){
            var timeoutData = 300 ;
            if(util.phoneOs() == 'IOS') {
                timeoutData = 500;
            }
            $('.car-num').blur();
            var obj = this,
                option = obj.options;
            $('.delete-picture-wrap').off('click','.delete-confirm').on('click','.delete-confirm',function(e) {
                obj.options.uploadsize--;
                option.$uploadDiv.show();
                $("#"+filePathId).remove();
                var reger=new RegExp("^" + filePath + ",|,"+filePath+"|"+filePath,"gm");
                option.$pics.val(option.$pics.val().replace(reger,""));
                $('.delete-picture-wrap').addClass('hide');
                fly.$.ajax({
                    url: CONTEXTPATH + '/file/remove',
                    data: {
                        path:filePath
                    },
                    dataType: 'json',
                    type: 'POST', //因为走nodej,POST请求获取数据不正确，顾改成GET
                    cache: false,
                    success: function (res) {
                    
                    },
                    error: function(res) {
                    }
                });
            });
            $('.delete-picture-wrap').off('click','.delete-cancle').on('click','.delete-cancle',function(e) {
                $('.delete-picture-wrap').addClass('hide');
            });
            setTimeout(function(){
                $('.delete-picture').css({ 
                    position: "absolute", 
                    top: ($('.mask').height() - $('.delete-picture').outerHeight())/2 
                }); 
                $('.delete-picture-wrap').removeClass('hide');
            },timeoutData);
            /*$('.delete-picture-wrap').removeClass('hide');*/
            /*var obj = this;
            var option = obj.options;
            option.$uploadDiv.show();
            $("#"+filePathId).remove();
            var reger=new RegExp("^" + filePath + ",|,"+filePath+"|"+filePath,"gm");
            option.$pics.val(option.$pics.val().replace(reger,""));*/

            /*bui.ajax({
                method : "get",
                url: option.deleteUrl+filePath
            }).done(function(res){

            }).fail(function(res,status){
                console.log(res,status);
            }) ;*/
        }
    }
    $.fn.lrzPicture = function ( option ) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('lrzPicture')
                , options = typeof option == 'object' && option
            if (!data) $this.data('lrzPicture', (data = new LrzPicture(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.lrzPicture.Constructor = LrzPicture

    $.fn.lrzPicture.defaults = {
        id : "",
        $pics  : "",//保存图片路径,逗号隔开
        $uploadDiv : "",//图片显示位置
        uploadUrl  : CONTEXTPATH+"/file/upload3",//上传图片url.默认使用框架方法
        downloadUrl  : CONTEXTPATH+"/component/upload.do?action=download&filepath=",//下载图片url，默认使用框架方法
        deleteUrl  : CONTEXTPATH+"/component/upload.do?action=delete&filepath=",//下载图片url，默认使用框架方法
        deleteValue : true,//是否显示删除按钮
        cache : false, //是否显示缓存图片
        update : false, //是否是更新头像
        show : true , //上传后是否显示图片
        size : "",   //设置最多能上传照片数量
        afterFun : null, //查询后执行函数,
        ocr : false,//是否是ocr识别
        loadingText : "正在上传...", //显示
        uploadsize: 0,
        deleteTemplate: '<div class="photoIcon" style="position:absolute;right:-0.22rem;top:-0.6rem;width: 0.74rem;height:0.74rem">' +
        '<svg class="icon" aria-hidden="true"> ' +
        '<use xlink:href="#icon-shanchu">' +
        '</use></svg></div>'  //删除按钮模板
    }
}( window.jQuery);

/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */
