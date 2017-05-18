var DialogImport = function (opt) {
    //-------------------------------------------------------导入----------------------------------------------------------//
    this.importDatasArr = []; //导入数据的数组
    this.importFailDatasArr = []; //导入失败数据的数组ch
    this.selCb = []; //选择要导入的数据的checkbox
    this.sendNum = 0; //发送Ajax的次数标识 
    this.callBackNum = 0;  //执行回调函数的次数
    this.opts;
    var that = this;
    //弹出层ch
    var box = new BlackBox({
        'clickOverlayEffect': 'shake', //点击覆盖层效果，默认为抖动 'shake'，可选关闭 'close'
        'overlayColor': '#000', //覆盖层颜色，默认为黑色 #000
        'overlayOpacity': .6, //覆盖层透明度，默认为 .6
        'allowPromptBlank': false, //允许prompt时输入内容为空，默认否，即为空时提交会抖动
        'displayClose': false, //在alert,confirm和prompt模式中显示关闭按钮
        'enableKeyPress': false //使用快捷键确定和取消
    });
    that.opts = $.extend({
        resize: true                     //弹出层是否重置
        , isExportError: false        //是否到处错误数据
    }, opt || {});
    this.InitImportDialog = function () {
        $("#importDiv").dialog({
            autoOpen: false,
            resizable: that.opts.resize,
            bottomVisible: false,
            width: 750,
            height: 480,
            modal: false,
            dialogClass: "mapLayer",
            buttons: {
                "导入": function () {
                    that.importSubmit();
                },
                "取消": function () {
                    that.importFailDatasArr.length = 0; //ch 2015-07-30 清空错误数据
                    $(this).dialog("close");
                }
            },
            close: function () {
                try {
                    that.importFailDatasArr.length = 0; //ch 2015-07-30 清空错误数据
                    ImportDialogColse();
                } catch (e) {
                    alert('请实现关闭层刷新方法');
                }
            }
        });
        $("#excelfile").bind("change", function () {
            $("#loadSpan").show();
            $("#importTable").html('');
            if ($.trim($("#excelfile").val()) != "") {
                $("#importDiv form").submit();
            }
        });
    };

    this.OpenImportDiv = function () {
        try {
            $("#importTable").html('');
            $("#excelfile").val("");
            $("#loadSpan").hide();
            this.importDatasArr.length = 0;
            this.selCb.length = 0;
            this.sendNum = 0;
            $("#importDiv").dialog("open");
        }
        catch (ex) {
            catchTheException("OpenImportDiv", ex);
        }
    };
    this.LoadImportDatas = function (data) {
        try {
            var json = eval("((" + data + "))");
            if (json.issuc == 1) {
                //初始化表头
                var tHeader = "<tr>";
                tHeader += "<th style='width:70px; text-align:center;'><input type='checkbox' id='CbAll' style='margin-left:1px;'/></th>";
                //                tHeader += '<th style="width:100px; text-align:center;">导入状态</th>';
                for (var i = 0; i < json.column.length; i++) {
                    //循环列头信息
                    tHeader += "<th>" + json.column[i].ColName + "</th>";
                }
                tHeader += "</tr>";
                $("#importTable").append(tHeader);
                $("#CbAll").bind("click", function () { that.CheckAllClick(); });
                //初始化表格内容信息
                var tContentArr = [];
                importDatasArr = json.data.concat();
                for (var i = 0; i < json.data.length; i++) {
                    var trTemp = "<tr id='tr" + i + "'>";
                    trTemp += '<td id="iStatus' + i + '" name="iStatus" style=" text-align:center;"><input type="checkbox" id="Cb' + i + '" style="margin-left:1px;"/></td>';
                    //                    trTemp += '<td id="iStatus' + i + '" name="iStatus" style=" text-align:center;">未导入</td>';
                    //循环列头信息
                    for (var j = 0; j < json.column.length; j++) {
                        var view = eval("json.data[i]." + json.column[j].Key);
                        if (view == null) {
                            view = "";
                        }
                        trTemp += '<td title=\"' + view + '\">' + view + '</td>';
                    }
                    trTemp += "</tr>";
                    tContentArr.push(trTemp);
                }
                $("#importTable").append(tContentArr.join(""));
            }
            else {
                $().manhua_msgTips({
                    timeOut: 2000, 			//提示层显示的时间
                    msg: json.error, 		//显示的消息
                    speed: 300, 			//滑动速度
                    type: "error"			//提示类型（1、success 2、error 3、warning）
                });
            }
            $("#loadSpan").hide();
        }
        catch (ex) {
            catchTheException("loadImportDatas", ex);
        }
    };

    this.CheckAllClick = function () {
        try {
            if ($("#CbAll").attr("checked")) {
                $("#importTable td").find(":checkbox").attr("checked", true);
            }
            else {
                $("#importTable td").find(":checkbox").attr("checked", false);
            }
        }
        catch (ex) {
            catchTheException("CheckAllClick", ex);
        }
    };
    this.importSubmit = function () {
        try {
            this.selCb = $("#importTable td").find(":checkbox:checked");
            $(this.selCb).parent().parent().find("[name='iStatus']").html('<img src="' + getRootPath() + '/Images/Video/sLoading.gif" title="导入中..."/>');
            this.sendNum = 0;
            this.callBackNum = 0; //ch
            try {
                SendImportAjax();
            } catch (e) {
                alert('请实现导入提交事件');
            }
        }
        catch (ex) {
            catchTheException("importSubmit", ex);
        }
    };
    this.ImportBack = function (obj) {
        try {
            if ($("#CbAll").attr("checked")) {
                $("#CbAll").attr("checked", false);
            }
            if (obj.issuc == 1) {
                $("#iStatus" + obj.rowId).html('<i class="cSuccess" title="导入成功"></i>');
            }
            else {
                $("#iStatus" + obj.rowId).html('<i class="cFail" title="' + obj.error + '"></i>');
                //记录导入错误的数据 ch
                var failData = importDatasArr[obj.rowId];
                failData.errorStr = obj.error;
                that.importFailDatasArr.push(failData);
            }
            if (that.callBackNum >= that.selCb.length - 1) {
                that.DialogConfirm();
            }
            else {
                that.callBackNum++;
            }
            $("#Cb" + obj.rowId).remove();
        }
        catch (ex) {
            catchTheException("ImportBack", ex);
        }
    };
    //弹窗提醒是否需要导出导入失败的数据
    this.DialogConfirm = function () {
        if (that.importFailDatasArr.length == 0) {
            $().manhua_msgTips({
                timeOut: 2000, 			//提示层显示的时间
                msg: "全部导入成功", 		//显示的消息
                speed: 300, 			//滑动速度
                type: "warning"			//提示类型（1、success 2、error 3、warning）
            });
            return;
        }
        else {
            if (that.opts.isExportError) {
                box.confirm("导入完成，是否导出导入失败的数据", function (result) {
                    if (result) {
                        ExportImportFailDatas();
                    }
                    that.importFailDatasArr.length = 0; //ch 2015-07-30 清空错误数据
                });
            }
        }
    };

    //form提交导出
    this.UrlToFm = function (url) {
        try {
            var path = url.split('?');
            $("#ExportFailDataDiv").html("");
            var params = path[1].split('&');
            var aframe = "<iframe id='exportFrame' name='exportFrame' style='display:none;'></iframe>";
            var aform = "<form action='" + path[0] + "'  id='exportFailDatas' style='display:none;' method='post'   name='exportFailDatas' enctype='multipart/form-data' target='exportFrame'>";
            var keyv = params[1].substring(0, params[1].indexOf("="));
            var keyv1 = params[1].substring(params[1].indexOf("=") + 1, params[1].length);
            if (params.length > 2) {
                var importTypeKey = params[2].substring(0, params[2].indexOf("="));
                if (importTypeKey = 'ImportType') {
                    var importTypeValue = params[2].substring(params[2].indexOf("=") + 1, params[2].length);
                    aform += "<input type='hidden' name='" + importTypeKey + "' id='" + importTypeKey + "' value='" + importTypeValue + "'/>' ";
                }
            }
            aform += "<input type='hidden' name='" + keyv + "' id='" + keyv + "' value='" + keyv1 + "'/></form>";
            $("#ExportFailDataDiv").html(aform);
            $("#ExportFailDataDiv").append(aframe);
            $("#exportFailDatas").submit();
        } catch (ex) {
            catchTheException("UrlToFrom", ex);
        }
    };

    //请求Ajax失败时的回调函数
    this.ImportFailBack = function () {
        try {
            if ($("#CbAll").attr("checked")) {
                $("#CbAll").attr("checked", false);
            }
            if (that.callBackNum >= that.selCb.length - 1) {
                that.DialogConfirm();
            }
            else {
                that.callBackNum++;
            }
        }
        catch (ex) {
            catchTheException("ImportFailBack", ex);
        }
    };

};
