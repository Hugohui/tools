
var fileUpload = function () {
    var opts = null;           //初始化参数
    var that = this;
    var frame;
    var tk = "";
    this.init = function (options, token, successCallback, errorCallback, deleteFileCallBack) {
        that.tk = token;
        if (successCallback == undefined) {
            successCallback = null;
        }
        if (errorCallback == undefined) {
            errorCallback = null;
        }
        if (deleteFileCallBack == undefined) {
            deleteFileCallBack = null;
        }

        that.opts = $.extend({
            actionurl: 'http://filetest.e-tms.cn'                     //提交的地址
            , domain: 'e6gps.com'                                     //指定域名（这个很重要！！！）
            , objname: "imgcont"                                       //页面声明对象名称
            , comID: 'fileImport'                                     //组件的id
            , successCallback: successCallback                                  //上传成功回调函数
            , errorCallback: errorCallback                                      //上传失败回调函数
            , deleteFileCallBack: deleteFileCallBack                            //删除图片回调函数
        }, options || {});
        that.frame = $('<iframe id="' + that.opts.comID + '_Frame" name="' + that.opts.comID + '_Frame" style="display:none;" scr="/File/SubHtml"></iframe>');
        $("body").append(that.frame);
        //指定域名（这个很重要！！！）
        document.domain = that.opts.domain;
    };

    //创建图片
    this.createFile = function (parms) {
        parms = $.extend({
            imgurl: ""
            , ftype: "img"  //img|doc|xls
            , divID: ''                                                      //Div的id（必填）
            , defaultUrl: '/Images/best/upload_carimg.jpg'           //默认为空时图片地址
            , compressType: 0                                        //压缩类型（0=不压缩； 1=压缩大图； 2=压缩大图和小图）
            , bwidth: 500                                               //压缩大图的宽    
            , bheight: 400                                              //压缩大图的高    
            , btype: 'tianchong'                                     //压缩大图类型：tianchong,dengbi
            , swidth: 100                                               //压缩小图的宽 
            , sheight: 80                                               //压缩小图的高
            , stype: 'tianchong'                                     //压缩小图类型：tianchong,dengbi
            , isImgWater: 0                                           //大图是否加水印
            , waterImg: ''                                              //水印图片
            //            , defaultwidth: 69                                       //上传以后显示图片的宽    fanrong  2016-1-6 09:46:25  注释默认图片的高度和宽度
            //            , defaultheight: 63                                      //上传以后显示图片的高
        }, parms || {});

        var form = $('<form action="' + that.opts.actionurl + '"  id="' + that.opts.comID + '_form_' + parms.divID + '" method="post"   name="' + that.opts.comID + '_form_' + parms.divID + '" enctype="multipart/form-data" target="' + that.opts.comID + '_Frame" style="position:relative;"></form>');
        var file = $('<input class="uploading" id="' + that.opts.comID + '_input_' + parms.divID + '" type="file" name="' + that.opts.comID + '_input_' + parms.divID + '" title="请选择文件"' +
            '/><span id="' + that.opts.comID + '_span_' + parms.divID + '"></span>');
        var tkObj = $('<input type="hidden"  name="token"  value="' + that.tk + '"/>');
        var parmo = $('<input type="hidden"  name="ftype"  value="' + parms.ftype + '"/>' +
             '<input type="hidden"  name="divID"  value="' + parms.divID + '"/>' +
            '<input type="hidden"  name="comID"  value="' + that.opts.comID + '"/>' +
            '<input type="hidden"  name="compressType"  value="' + parms.compressType + '"/>' +
            '<input type="hidden"  name="bwidth"  value="' + parms.bwidth + '"/>' +
            '<input type="hidden"  name="bheight"  value="' + parms.bheight + '"/>' +
            '<input type="hidden"  name="btype"  value="' + parms.btype + '"/>' +
            '<input type="hidden"  name="swidth"  value="' + parms.swidth + '"/>' +
            '<input type="hidden"  name="sheight"  value="' + parms.sheight + '"/>' +
            '<input type="hidden"  name="stype"  value="' + parms.stype + '"/>' +
            '<input type="hidden"  name="objname"  value="' + that.opts.objname + '"/>' +
            '<input type="hidden"  name="isImgWater"  value="' + parms.isImgWater + '"/>' +
            '<input type="hidden"  name="waterImg"  value="' + parms.waterImg + '"/>');
        var img = $('<img id="' + that.opts.comID + '_img_' + parms.divID + '" src="' + (parms.imgurl == "" ? parms.defaultUrl : parms.imgurl) + '" width="' + parms.defaultwidth + '" height="' + parms.defaultheight + '"/>');
        var hidFileUrl = $('<input type="hidden"  name="fileUrl" value=""/>');

        var clear = $('<a href="javascript:void(0);" class="sup_close iconTags iconX"' + (parms.imgurl == "" ? "style=display:none" : "") + '></a>');
        if (parms.ftype == 'img') {
            form.append(img);
        }
        form.append(tkObj);
        form.append(hidFileUrl);
        form.append(parmo);
        form.append(file);
        form.append(clear);

        $("#" + parms.divID).append(form);
        file.bind("change", function () {
            var files = $(this).attr("id");
            var check = checkFile(files);
            if (!check) { return;}
            that.submit(parms.divID);
        });
        file.click(function (e) {
            if (e && e.stopPropagation){
                //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
        } else {
                //否则，我们需要使用IE的方式来取消事件冒泡 
                window.event.cancelBubble = true;
            }
            
            this.form.reset();

        })
        clear.click(function (e) {
                if (e && e.stopPropagation) {
                    //因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                } else {
                    //否则，我们需要使用IE的方式来取消事件冒泡 
                    window.event.cancelBubble = true;
                }
                ClearUploadImg(this);
            })
    };

    //上传图片
    this.submit = function (divID) {
        $('#' + that.opts.comID + '_form_' + divID).submit();

    };

    //获取上传的文件的地址
    this.getFileUrl = function (divID) {
        var src = $('#' + that.opts.comID + '_form_' + divID).find('input[name="fileUrl"]').val();
        return src == that.opts.defaultUrl ? "" : src;
    };
};

//上传成功的回调函数
function fileUploadSuccessCallBack(json) {
    var data = eval(json);
    $("#" + data.obj.comID + '_span_' + data.obj.divID).html('');
    if (data.obj.ftype == 'img') {
        $("#" + data.obj.comID + '_img_' + data.obj.divID).attr("src", data.obj.filename);
    } else {
        $("#" + data.obj.comID + '_span_' + data.obj.divID).html('文件已上传').css("color", "green");
    }
    $("#" + data.obj.comID + '_form_' + data.obj.divID).find("input[name='fileUrl']").val(data.obj.filename);
    $("#" + data.obj.comID + '_form_' + data.obj.divID).find(".sup_close").show(); //上传成功后展示叉叉
    $("#" + data.obj.divID).addClass("col-xs-6");
    if ($("#querypic").length > 0) { //判断回单图片数量
        $("#" + data.obj.divID).parent().attr("urls", data.obj.filename);
        $("#" + data.obj.divID).addClass("hasImg");
        var num = parseInt($(".carimgs .hasImg").length);
        if ($("#querypic").find("img").length > 0) {
            num += parseInt($("#querypic").find("img").length);            
        } 
        if (num < 5) { $("#" + data.obj.divID).parent().next().find(".photoimg").show(); };
    } else {
        $("#" + data.obj.divID).next().show();
    }
    
};

//上传失败的回调函数
function fileUploadErrorCallBack(json) {
    //var data = eval(json);
    //if (data.obj != null) {
    //    $("#" + data.obj.comID + '_span_' + data.obj.divID).html(data.error).css("color", "red");
    //}
};
function checkFile(files) {
    var imgfile = $("#" + files).val();
    var fileTypes = new Array("jpg", "jpeg", "png", "gif", "bmp", "tiff");  //定义可支持的文件类型数组
    var fileTypeFlag = "0";
    var newFileName = imgfile.split('.');
    newFileName = newFileName[newFileName.length - 1];
    for (var i = 0; i < fileTypes.length; i++) {
        if (fileTypes[i] == newFileName) {
            fileTypeFlag = "1";
        }
    }
    if (fileTypeFlag == "0") {
        $().manhua_msgTips({
            timeOut: 2000, 			//提示层显示的时间
            msg: "请上传图片", 		//显示的消息
            speed: 300, 			//滑动速度
            type: "error"			//提示类型（1、success 2、error 3、warning）
        });
        return false;
    } else {
        return true;
    }
}
