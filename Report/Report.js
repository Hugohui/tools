$(function () {
    try {
        //LoadView('AreaAssessReport');
        SetReportSize();
    }
    catch (ex) {
        catchTheException("cdis.Report.js的$()", ex);
    }
});


//function SetReportSize() {
//    var wh = GetPageSize();
//    $("#container").width(wh[2]).height(wh[3]-50);
//}


/*
* 加载页面的html
*/
function LoadView(id, name) {
    try {
        var url = getRootPath() + "/Report/Report/LoadReportView";
        $.ajax({
            url: url, async: false, type: 'post', dataType: "text", headers: { token: checkToken }, data: { viewName: id, th: jsVersion },
            success: function (data) {
                $("#container").html(data);
            }
        });
    } catch (ex) {
        catchTheException("cdis.Report.js的LoadView", ex);
    }
}

/*
*命名空间注册工具
*/
var Namespace = new Object();
Namespace.register = function (path) {
    try {
        var arr = path.split(".");
        var ns = "";
        for (var i = 0, l = arr.length; i < l; i++) {
            if (i > 0) ns += ".";
            ns += arr[i];
            eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");
        }
    }
    catch (ex) {
        catchTheException("Report.js的Namespace.register", ex);
    }
};


/*
* 导出的时候地址转成form提交
* url:网址
*/
function UrlToForm(url) {
    try {
        $("#ExportDiv").html("");
        var path = url.split('?');
        var params = path[1].split('&');
        var html = "<form action='" + path[0] + "' method='post' id='reportExport'>";
        for (var i = 0; i < params.length; i++) {
            var keyv = params[i].split('=');
            html += "<input type='hidden' name='" + keyv[0] + "' value='" + keyv[1] + "' />";
        }
        html += "</form>";
        $("#ExportDiv").html(html);
        $("#reportExport").submit();
    }
    catch (ex) {
        catchTheException("UrlToForm", ex);
    }
};
