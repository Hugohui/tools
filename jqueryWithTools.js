(function ($) { $.fn.colorPicker = function (i1, i2, i3, i4, fun) { var in1, in2, in3; if (i1 != false) { in1 = GetObj(this, i1) } if (i2 != false) { if (i2) in2 = $(i2); else in2 = this } if (i3) { in3 = GetObj(this, i3) } if (in1 == in3 && !i1) in1 = false; var _p = jQuery('#fy_ColorPicker'); if (_p.length == 0) { $('body').append('<div id="fy_ColorPicker"></div>'); _p = $('#fy_ColorPicker'); _p.css({ "position": "absolute", "z-index": "999999", "background-color": "#FFFFFF", "border": "1px solid #CCCCCC", "padding": "1px", "cursor": "pointer" }) } else _p.toggle(); var _l = GetLoc(this[0]); _p.css({ "left": _l.Left + (i4 ? _l.Width : 0) + "px", "top": (_l.Top + _l.Height) + "px" }); if ($('table', _p).length == 0) { var hc = ["FF", "CC", "99", "66", "33", "00"]; var i = 0, j = 0; var r, g, b, c; var s = new Array(); s[0] = '<table cellspacing="1" cellpadding="0"><tr>'; for (r = 0; r < 6; r++) { for (g = 0; g < 6; g++) { for (b = 0; b < 6; b++) { c = hc[r] + hc[g] + hc[b]; if (i % 18 == 0 && i > 0) { s[j + 1] = "</tr><tr>"; j++ } s[j + 1] = '<td class="color" bgcolor="#' + c + '" height="10" width="10"></td>'; i++; j++ } } } s[j + 1] = '</tr><tr><td height="10" colspan="18" id="fy_ColorPicker_Select" style="font-family:Tamoha;font-size:10px;text-align:center;cursor:default;"></td></tr></table>'; _p.html(s.join('')) } $('.color', _p).unbind("mouseover").unbind("click").mouseover(function () { setSelect(this.bgColor.toUpperCase()) }).click(function () { setColorValue(this.bgColor.toUpperCase(), in1, in2, in3, fun) }) }; function GetLoc(element) { if (arguments.length != 1 || element == null) { return null } var offsetTop = element.offsetTop; var offsetLeft = element.offsetLeft; var offsetWidth = element.offsetWidth; var offsetHeight = element.offsetHeight; while (element = element.offsetParent) { offsetTop += element.offsetTop; offsetLeft += element.offsetLeft } return { Top: offsetTop, Left: offsetLeft, Width: offsetWidth, Height: offsetHeight} }; function setColorValue(v, in1, in2, in3, fun) { var v = v == 'TRANSPARENT' ? 'transparent' : v; $('#fy_ColorPicker').hide(); if (in1) { var n = in1[0].tagName; if (n == 'INPUT' || n == 'BUTTON') in1.val(v); else in1.text(v) } if (in2) in2.css('background-color', v); if (in3) in3.css('color', v); if (typeof (fun) != "undefined") fun(); }; function setSelect(v) { var v = v == 'TRANSPARENT' ? 'transparent' : v; $("#fy_ColorPicker_Select").css('background-color', v).text(v) }; function GetObj(a, v) { var r; if (v) r = $(v); else { var n = a[0].tagName; var t = a.attr('type'); if (t) t = t.toUpperCase(); if (n == 'INPUT' && (t == 'TEXT' || t == 'HIDDEN' || t == 'BUTTON') || n == 'BUTTON' || n == 'SPAN' || n == 'DIV') r = a; else { var o = a.prev("input[@type=hidden],input[@type=text],input[@type=button],button"); if (o.length > 0) r = $(o[0]); else { var o = a.next("input[@type=hidden],input[@type=text],input[@type=button],button"); if (o.length > 0) r = $(o[0]) } } } return r } })(jQuery);

//var shareScriptSrc = ""; //公共JS文件目录前缀
//var rootPath = ""; //网站目录前缀
//var checkToken = ""; //验证token
var trackUrl = ""; //轨迹地址
//var scriptUrl = "jsEncode"; //引用JS（加密/明文）文件目录
//var version = "?v=1.0"; //js版本号

//得到select项的个数   
// jQuery.fn.size = function(){   
//     return jQuery(this).get(0).options.length;   
// } 
//获得选中项的索引
jQuery.fn.getSelectedIndex = function () {
    try {
        return jQuery(this).get(0).selectedIndex;
    }
    catch (ex) {
        catchTheException("jQuery.fn.getSelectedIndex", ex);
    }
};
//获得当前选中项的文本
jQuery.fn.getSelectedText = function () {
    try {
        if (this[0].length == 0) return "下拉框中无选项";
        else {
            var index = this.getSelectedIndex();
            if (index >= 0) {
                return jQuery(this).get(0).options[index].text;
            }
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.getSelectedText", ex);
    }
};

//分页
jQuery.fn.pager = function (currentIndex, recordCount, opts) {
    opts = $.extend({
        PageSize: 20,
        DIVCSS: "page",
        CurrentCSS: "now",
        PrevCSS:"",
        NextCSS:"",
        PrevText: "上一页",
        NextText: "下一页",
        BtnDisplay: 4,
        ShowOnly: false,
        ShowSum: false
    }, opts || {});
    if (!opts.callback && !opts.UrlFormat) {
        var url = ""; 
        location.href.replace(/http:\/\/[^/]+/i, "");
        var ret = url.replace(/(\?|&)page=.*?(&|$)/i, "$1page={0}$2");
        opts.UrlFormat = ret + ((ret == url) ? (url.match(/\?/) ? "&" : "?") + "page={0}" : "");
    }
    var instanse = this;
    var pageCount = Math.max(Math.ceil(recordCount / opts.PageSize), 1);
    if (opts.DIVCSS) {
        this.attr("class", opts.DIVCSS);
    }
    if (opts.ShowOnly || pageCount > 1) {
        showPage(currentIndex);
    }
    else {
        $(this).html("");
    }
    function showPage(currentIndex) {
        currentIndex = Math.min(Math.max(currentIndex, 1), pageCount);
        var first = currentIndex > opts.BtnDisplay ? Math.max(Math.min(currentIndex - opts.BtnDisplay, pageCount - opts.BtnDisplay * 2), 1) : 1;
        var last = currentIndex > opts.BtnDisplay ? Math.min(currentIndex + opts.BtnDisplay - 1, pageCount) : Math.min(opts.BtnDisplay * 2 + 1, pageCount);
        var pagebtn = "";
        //显示条数的统计
        if(opts.ShowSum){
            pagebtn = "<span>共" + recordCount + "条，每页" + opts.PageSize + "条</span>";
        }
        if (currentIndex !== 1 && opts.PrevText !== ""){
            //pagebtn += "<a class='" + opts.NextCSS + "' rel='" + (currentIndex - 1) + "'>" + opts.PrevText + "</a>";
            pagebtn += "<a class='' aria-hidden='true' rel=" + (currentIndex - 1) + "><i class='iconTags iconUp'></i></a>";
        }
        if (first > 1) {
            pagebtn += "<a rel='1'>1</a>";
        }
        if (first > 2) {
            pagebtn += "<span class='f20' rel='" + (first - 1) + "'>...</span>";
        }
        for (var i = first; i <= last; i++) {
        if (i == currentIndex){
                pagebtn += "<a rel='" + i + "' class='" + opts.CurrentCSS + "'>" + i + "</a>";
            }
            else{
                pagebtn += "<a rel='" + i + "'>" + i + "</a>";
            }
        }
        if (last < pageCount - 1) pagebtn += "<span class='f20' rel='" + (last + 1) + "'>...</span>";
        if (last < pageCount) pagebtn += "<a rel='" + pageCount + "'>" + pageCount + "</a>";
        if(currentIndex != pageCount && opts.NextText!="")
            //pagebtn += "<a class='" + opts.NextCSS + "' rel='" + (currentIndex + 1) + "'>" + opts.NextText + "</a>";
            pagebtn += "<a href='#' class='' aria-hidden='true' rel=" + (currentIndex + 1) + "><i class='iconTags iconDown'></i></a>";
        instanse.empty().append(pagebtn).find('a').each(function (i, n) {
            var o = $(n);
            var p = o.attr("rel");
            if (opts.callback)
                o.attr("href", "javascript:void(0)").click(function () {
                    showPage(p);
                    $(window).scrollTop(0);
                    return (opts.callback(p)) ? false : false;
                });
            else
                o.attr("href", opts.UrlFormat.replace("{0}", p));
        }).removeAttr("rel");
    }
    return this;
};


//设置选中指定索引项
jQuery.fn.setSelectedIndex = function (index) {
    try {
        if (typeof this[0] == "undefined") { return; }
        var count = this[0].length;
        if (typeof count == "undefined") {
            return;
        }
        if (index >= count || index < 0) {
//            alert("选中项索引超出范围");
        }
        else {
            jQuery(this).get(0).selectedIndex = index;
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.setSelectedIndex", ex);
    }
};

//设置选中指定索引项
jQuery.fn.setNoSelectedIndex = function () {
    try {
        jQuery(this).get(0).selectedIndex = -1;
    }
    catch (ex) {
        catchTheException("jQuery.fn.setNoSelectedIndex", ex);
    }
};

//设置某索引值的text和value值
jQuery.fn.setIndexTextValue = function (index, text, value) {
    try {
        if (this[0].length == 0) return "下拉框中无选项";
        else {
            if (index > 0) {
                jQuery(this).get(0).options[index].text = text;
                jQuery(this).get(0).options[index].value = value;
            }
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.setIndexTextValue", ex);
    }
};

//获取某索引值的text
jQuery.fn.getTextByIndex = function (index) {
    try {
        var count = this[0].length;
        if (index >= count || index < 0) {
//            alert("选中项索引超出范围");
        }
        else {
            return jQuery(this).get(0).options[index].text;
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.getTextByIndex", ex);
    }
};

//获取某索引值的value
jQuery.fn.getValueByIndex = function (index) {
    try {
        var count = this[0].length;
        if (index >= count || index < 0) {
//            alert("选中项索引超出范围");
        }
        else {
            return jQuery(this).get(0).options[index].value;
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.getValueByIndex", ex);
    }
};


//获得当前选中项的值
jQuery.fn.getSelectedValue = function () {
    try {
        if (this.size() == 0)
            return "下拉框中无选中值";
        else {
            var index = this.getSelectedIndex();
            if (index >= 0) {
                return jQuery(this).get(0).options[index].value;
            }
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.getSelectedValue", ex);
    }
};
//设置select中值为value的项为选中
jQuery.fn.setSelectedValue = function (value) {
    try {
        jQuery(this).get(0).value = value;
    }
    catch (ex) {
        catchTheException("jQuery.fn.setSelectedValue", ex);
    }
};
//设置select中文本为text的第一项被选中
jQuery.fn.setSelectedText = function (text) {
    try {
        var isExist = false;
        var count = this[0].length;
        for (var i = 0; i < count; i++) {
            if (jQuery(this).get(0).options[i].text == text) {
                jQuery(this).get(0).options[i].selected = true;
                isExist = true;
                break;
            }
        }
        if (!isExist) {
//            alert("下拉框中不存在该项");
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.setSelectedText", ex);
    }
};
//判断select项中是否存在值为value的项
jQuery.fn.isExistItem = function (value) {
    try {
        var isExist = false;
        var count = this[0].length;
        for (var i = 0; i < count; i++) {
            if (jQuery(this).get(0).options[i].value == value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }
    catch (ex) {
        catchTheException("jQuery.fn.isExistItem", ex);
    }
};
//向select中添加一项，显示内容为text，值为value,如果该项值已存在，则提示
jQuery.fn.addOption = function (text, value) {
    try {
        if (this.isExistItem(value)) {
//            alert("待添加项的值已存在");
        }
        else {
            jQuery(this).get(0).options.add(new Option(text, value));
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.addOption", ex);
    }
};
//删除select中值为value的项，如果该项不存在，则提示
jQuery.fn.removeItem = function (value) {
    try {
        if (this.isExistItem(value)) {
            var count = this[0].length;
            for (var i = 0; i < count; i++) {
                if (jQuery(this).get(0).options[i].value == value) {
                    jQuery(this).get(0).remove(i);
                    break;
                }
            }
        }
        else {
//            alert("待删除的项不存在!");
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.removeItem", ex);
    }
};
//删除select中指定索引的项
jQuery.fn.removeIndex = function (index) {
    try {
        var count = this[0].length;
        if (index >= count || index < 0) {
//            alert("待删除项索引超出范围");
        }
        else {
            jQuery(this).get(0).remove(index);
        }
    }
    catch (ex) {
        catchTheException("jQuery.fn.removeIndex", ex);
    }
};
//删除select中选定的项
jQuery.fn.removeSelected = function () {
    try {
        var index = this.getSelectedIndex();
        this.removeIndex(index);
    }
    catch (ex) {
        catchTheException("jQuery.fn.removeSelected", ex);
    }
};
//清除select中的所有项
jQuery.fn.clearAll = function () {
    try {
        jQuery(this).get(0).options.length = 0;
    }
    catch (ex) {
        catchTheException("jQuery.fn.clearAll", ex);
    }
};
/*
* 将对象转换为json字符串
*/
jQuery.extend({
    /** * @see 将javascript数据类型转换为json字符串 * @param 待转换对象,支持object,array,string,function,number,boolean,regexp * @return 返回json字符串 */
    toJSON: function (object) {
        try {
            var type = typeof object;
            if (object != null) {
                if ('object' == type) {
                    if (Array == object.constructor) type = 'array';
                    else if (RegExp == object.constructor) type = 'regexp';
                    else type = 'object';

                }
            }
            switch (type) {
                case 'undefined':
                case 'unknown':
                    return;
                    break;
                case 'function':
                case 'boolean':
                case 'regexp':
                    return object.toString();
                    break;
                case 'number':
                    return isFinite(object) ? object.toString() : 'null';
                    break;
                case 'string':
                    var s = object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\/|\t/g, function () {
                        var a = arguments[0];
                        return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : (a == "\/") ? '\\/' : ""
                    });
                    s = s.toString().replace("/", "\/");
                    var str = '"' + s + '"';


                    return str;
                    break;
                case 'object':
                    if (object === null) return 'null';
                    var results = [];
                    for (var property in object) {
                        var value = jQuery.toJSON(object[property]);
                        if (value !== undefined) {
                            results.push(jQuery.toJSON(property) + ':' + value);
                        }
                    }
                    var rslt = '{' + results.join(',') + '}';
                    return rslt;
                    break;
                case 'array':
                    var results = [];
                    for (var i = 0; i < object.length; i++) {
                        var value = jQuery.toJSON(object[i]);
                        if (value !== undefined) {
                            results.push(value);
                        }
                    }
                    return '[' + results.join(',') + ']';
                    break;
            }
        }
        catch (ex) {
            catchTheException("toJSON", ex);
        }
    }
});
//----------------------------------------------------------------------------------------------//
/*
* 获取页面高度和宽度
* return Array
*/
function GetPageSize() {
    try {
        var xScroll; //页面滚动宽度 
        var yScroll; //页面滚动高度

        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.body.scrollWidth;
            yScroll = window.innerHeight + window.scrollMaxY;
        }
        else if (document.body.scrollHeight > document.body.offsetHeight) {
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        }
        else {
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }

        var windowWidth; //屏幕宽度
        var windowHeight; //屏幕高度

        if (self.innerHeight) { // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        }
        else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }
        /*当页面滚动高度比屏幕高度小的时候，页面高度为屏幕高度，反之，为页面滚动高度*/
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        }
        else {
            pageHeight = yScroll;
        }
        /*当页面滚动宽度比屏幕宽度小的时候，页面宽度为屏幕宽度，反之，为页面滚动宽度*/
        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        }
        else {
            pageWidth = xScroll;
        }

        arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
        return arrayPageSize;
    }
    catch (ex) {
        catchTheException("GetPageSize", ex);
    }
};
//--------------------------------------------Ajax--------------------------------------------//
/*
* Ajax请求，可以多以可传
*/
function SendAjax(url, opts) {
    try {
        sendAjaxRequest(url, opts.sucCallback, opts.type, opts.param, opts.datatype, opts.basync, opts.bErrorBack, opts.errorCallBack);
    }catch (ex) {
        catchTheException("SendAjax", ex);
    }
};

//Ajax方法
// sendAjaxRequest(url, sucCallback, type, param, datatype, basync, bErrorBack,errorCallBack)
//success
function sendAjax(url, opts) {
    try {
        if (typeof url == "undefined" || url == "" || url == null) { return; }
        //ajaxError.Fun = opts.error || null;
        $.ajax({
            url: url,
            type: opts.type || "POST",
            data: opts.data || {},
            dataType: opts.dataType || "json",
            headers: { token: checkToken },
            timeout: opts.timeout || 50 * 1000,
            async: (typeof opts.async == "boolean" && opts.async == false) ? false : true,
            error: function(XMLHttpRequest, textStatus, errorThrown){
				try {
					var status = XMLHttpRequest.status;
					var errorStr = "";
					if (status == 404) {
						errorStr = "请求未找到！";
					}
					else if (status == 401) {
						errorStr = "访问被拒绝！";
					}
					else if (status == 403) {
						errorStr = "禁止访问！";
					}
					else if (status == 500) {
						errorStr = "服务器错误！";
					}
					else if (status == 501) {
						errorStr = "页眉值指定了未实现的配置！";
					}
					else if (status == 502) {
						errorStr = "网络故障，请检查网络刷新页面！";
					}
					else if (status == 503) {
						errorStr = "服务不可用！";
					}
					else if (status == 504) {
						errorStr = "网关超时！";
					}
					else {
						//                        errorStr = status + "---" + textStatus + "---" + errorThrown;
					}
			
					if(XMLHttpRequest.statusText == "timeout"){ errorStr = "网关超时！";}
//					if (typeof ajaxError.Fun != "undefined" && ajaxError.Fun != "" && ajaxError.Fun != null) {
//						var errObj = { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown, errorStr: errorStr, responseText: XMLHttpRequest.responseText };
//						ajaxError.Fun(errObj);
//					}
					if (typeof opts.error != "undefined" && opts.error != "" && opts.error != null) {
						var errObj = { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown, errorStr: errorStr, responseText: XMLHttpRequest.responseText };
						opts.error(errObj);
					}
				}
				catch (ex) {
					catchTheException("ajaxError", ex);
				}
            },
            success: opts.success || null
        });
    }
    catch (ex) {
        catchTheException("sendAjax", ex);
    }
};
//function ajaxError(XMLHttpRequest, textStatus, errorThrown) {
//    try {
//        var status = XMLHttpRequest.status;
//        var errorStr = "";
//        if (status == 404) {
//            errorStr = "请求未找到！";
//        }
//        else if (status == 401) {
//            errorStr = "访问被拒绝！";
//        }
//        else if (status == 403) {
//            errorStr = "禁止访问！";
//        }
//        else if (status == 500) {
//            errorStr = "服务器错误！";
//        }
//        else if (status == 501) {
//            errorStr = "页眉值指定了未实现的配置！";
//        }
//        else if (status == 502) {
//            errorStr = "网络故障，请检查网络刷新页面！";
//        }
//        else if (status == 503) {
//            errorStr = "服务不可用！";
//        }
//        else if (status == 504) {
//            errorStr = "网关超时！";
//        }
//        else {
//            //                        errorStr = status + "---" + textStatus + "---" + errorThrown;
//        }
//        
//        if(XMLHttpRequest.statusText == "timeout"){ errorStr = "网关超时！";}
//        if (typeof ajaxError.Fun != "undefined" && ajaxError.Fun != "" && ajaxError.Fun != null) {
//            var errObj = { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown, errorStr: errorStr, responseText: XMLHttpRequest.responseText };
//            ajaxError.Fun(errObj);
//        }
//    }
//    catch (ex) {
//        catchTheException("ajaxError", ex);
//    }
//};

/*
* AJAX请求
* @param 请求地址
* @param 回调函数
* @param 请求类型   
* @param 参数       
* @param 数据类型       
* @param 同步false或异步true   
* @param Ajax成功后，如果数据错误（error != "" || error != "无"），是否执行回调函数（默认数据错误不执行回调函数）
*/
var LocationCount = 0;
function sendAjaxRequest(url, sucCallback, type, param, datatype, basync, bErrorBack,errorCallBack) {
    try {
        if (typeof url == "undefined" || url == "" || url == null) return;
        if (typeof type == "undefined" || type == "" || type == null) type = "POST";
        if (typeof param == "undefined" || param == "" || param == null) param = {};
        if (typeof datatype == "undefined" || datatype == "" || datatype == null) datatype = "json";
        if (typeof basync == "undefined" || basync == "" || basync == null) basync = true;
        if (typeof bErrorBack == "undefined" || bErrorBack == "" || bErrorBack == null) bErrorBack = false;
        $.ajax(
        {
            url: url
            , type: type
            , async: basync
            , data: param
            , error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {
                    var status = XMLHttpRequest.status;
                    var errorStr = "";
                    if (status == 404) {
                        errorStr = "请求未找到！";
                    }
                    else if (status == 401) {
                        errorStr = "访问被拒绝！";
                    }
                    else if (status == 403) {
                        errorStr = "禁止访问！";
                    }
                    else if (status == 500) {
                        errorStr = "服务器错误！";
                    }
                    else if (status == 501) {
                        errorStr = "页眉值指定了未实现的配置！";
                    }
                    else if (status == 502) {
                        errorStr = "网络故障，请检查网络刷新页面！";
                    }
                    else if (status == 503) {
                        errorStr = "服务不可用！";
                    }
                    else if (status == 504) {
                        errorStr = "网关超时！";
                    }
                    else {
//                        errorStr = status + "---" + textStatus + "---" + errorThrown;
                    }
                    if(errorStr!=""){
                        $().manhua_msgTips({
                            timeOut: 10000, 			//提示层显示的时间
                            msg: errorStr, 		//显示的消息
                            speed: 300, 			//滑动速度
                            type: "error"			//提示类型（1、success 2、error 3、warning）
                        });
                    }
                    $("#loadingDiv").hide();
                    if (typeof errorCallBack != "undefined" && errorCallBack != "" && errorCallBack != null){
                        errorCallBack();
                    }
                }
                catch (ex) {
                    catchTheException("ajaxError", ex);
                }
            }
            , dataType: datatype
            , success: function (data) {
                if (sucCallback == null) { return; }
                if (bErrorBack || back_Check_Url(data)) {
                    sucCallback(data);
                }
            }
            , headers: { token: checkToken }
        }
    );
    }
    catch (ex) {
        catchTheException("sendAjaxRequest", ex);
    }
};
//function ajaxError(err) {
//    try {
//        if (LocationCount < 5)
//            LocationCount++;
//        else {
//            LocationCount = 0;
//            $().manhua_msgTips({
//                timeOut: 2000, 			//提示层显示的时间
//                msg: "网络故障！请检查网络！", 		//显示的消息
//                speed: 300, 			//滑动速度
//                type: "error"			//提示类型（1、success 2、error 3、warning）
//            });
//        } 
//    }
//    catch (ex) {
//        catchTheException("ajaxError", ex);
//    }
//};
/*
*    回调检查 post lt  2013-6-4 
*/
function back_Check(error) {
    try {
        if (error == "" || error == "无") {
            return true;
        }
        else {
            $().manhua_msgTips({
                timeOut: 2000, 			//提示层显示的时间
                msg: error, 		//显示的消息
                speed: 300, 			//滑动速度
                type: "error"			//提示类型（1、success 2、error 3、warning）
            });
            return false;
        }
    }
    catch (ex) {
        catchTheException("back_Check", ex);
    }
};
function back_Check_Url(data) {
    try {
        if (data.error == "" || data.error == "无") {
            return true;
        }
        else {
            if (data.url == "") {
                $().manhua_msgTips({
                    timeOut: 2000, 			//提示层显示的时间
                    msg: data.error, 		//显示的消息
                    speed: 300, 			//滑动速度
                    type: "error"			//提示类型（1、success 2、error 3、warning）
                });
            }
            else {
                var box = new BlackBox({
                    'clickOverlayEffect': 'shake', //点击覆盖层效果，默认为抖动 'shake'，可选关闭 'close'
                    'overlayColor': '#000', //覆盖层颜色，默认为黑色 #000
                    'overlayOpacity': .6, //覆盖层透明度，默认为 .6
                    'allowPromptBlank': false, //允许prompt时输入内容为空，默认否，即为空时提交会抖动
                    'displayClose': false, //在alert,confirm和prompt模式中显示关闭按钮
                    'enableKeyPress': false //使用快捷键确定和取消
                });
                box.alert(data.error, function () { window.location = data.url; });
            }
            return false;
        }
    }
    catch (ex) {
        catchTheException("back_Check_Url", ex);
    }
};
/**********************************/
//功能：格式化日期输出
//参数：style(格式，默认yyyy-MM-dd hh:mm:ss)
//使用方法 
//var now = new Date();
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
//使用方法2: 
//var testDate = new Date();
//var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
//alert(testStr);
//示例： 
//alert(new Date().format("yyyy年MM月dd日"));
//alert(new Date().format("MM/dd/yyyy"));
//alert(new Date().format("yyyyMMdd"));
//alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
/**********************************/
Date.prototype.format = function (style) {
    try {
        if (typeof (style) == "undefined" || style == "") style = "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),      //day
            "h+": this.getHours(),     //hour
            "m+": this.getMinutes(),   //minute
            "s+": this.getSeconds(),   //second
            "w+": "天一二三四五六".charAt(this.getDay()),   //week
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(style)) {
            style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(style)) {
                style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return style;
    }
    catch (ex) {
        catchTheException("Date.prototype.format", ex);
    }
};
/**********************************/
//功能：提交表单并获取返回值 用于上传附件
//参数：
//     control:控件ID
//     url:请求地址
//     callback:回调函数
//     basync:同步false或异步true
/**********************************/
function submitRequest(control, url, callback, basync) {
    try {
        if (control.getForm().isValid()) {
            control.getForm().submit({
                method: "POST",
                clearValidation: true,
                waitMsg: '正在提交,请稍候...',
                url: url,
                async: basync,
                success: function (control, response) {
                    var json = eval(response.response.responseText).Message; //取返回信息
                    var str = backCheck(json, "POST"); //返回信息验证
                    if (str != "Error") {
                        callback(str); //进行回调
                    }
                    //获取蒙板并去掉 蒙板不能自动去掉
                    var mask = $(".x-mask");
                    for (var i = 0; i < mask.length; i++) {
                        $(mask[i]).css('display', 'none');
                    }
                },
                failure: function (control, response) {
                    var json = eval(response.response.responseText).Message;
                    var str = backCheck(json, "POST");
                    if (str != "Error") {
                        callback(str);
                    }
                    var mask = $(".x-mask");
                    for (var i = 0; i < mask.length; i++) {
                        $(mask[i]).css('display', 'none');
                    }
                }
            })
        }
    }
    catch (ex) {
        catchTheException("submitRequest", ex);
    }
};
/*
* 去特殊字符
*/
String.prototype.TextFilter = function () {
    try {
        var pattern = new RegExp("[`/\\~^|{}':;,.<>\"]"); //[]内输入要过滤的字符
        var rs = "";
        for (var i = 0; i < this.length; i++) {
            rs += this.substr(i, 1).replace(pattern, ' ');
        }
        return rs;
    }
    catch (ex) {
        catchTheException("String.prototype.TextFilter", ex);
    }
};
/*
* 判断字符串中是否含有特殊字符
*/
String.prototype.haveSpecialCharacters = function () {
    try {
        var pattern = new RegExp("[`/\\~^|{}':;,.<>\"]");
        return pattern.test(this);
    }
    catch (ex) {
        catchTheException("String.prototype.haveSpecialCharacters", ex);
    }
};
/*------------------------------------------------------------------------------------------------------------*/
/*************************************************/
//功能：将字符串转为日期类型
//参数：style(日期格式，默认yyyy-MM-dd hh:mm:ss)
/*************************************************/
String.prototype.toDate = function (style) {
    try {
        if (typeof (style) == "undefined" || style == "") style = "yyyy-MM-dd hh:mm:ss";
        var currentTime = new Date();
        var y, M, d, h, m, s;
        y = parseInt(this.substring(style.indexOf("y"), style.lastIndexOf("y") + 1), 10);  //年
        M = parseInt(this.substring(style.indexOf("M"), style.lastIndexOf("M") + 1), 10) - 1; //月减1
        d = parseInt(this.substring(style.indexOf("d"), style.lastIndexOf("d") + 1), 10);  //日
        h = parseInt(this.substring(style.indexOf("h"), style.lastIndexOf("h") + 1), 10);  //时
        m = parseInt(this.substring(style.indexOf("m"), style.lastIndexOf("m") + 1), 10);  //分
        s = parseInt(this.substring(style.indexOf("s"), style.lastIndexOf("s") + 1), 10);  //秒
        if (isNaN(y)) y = currentTime.getFullYear();
        if (isNaN(M)) M = currentTime.getMonth();
        if (isNaN(d)) d = currentTime.getDate();
        if (isNaN(h)) h = currentTime.getHours();
        if (isNaN(m)) m = currentTime.getMinutes();
        if (isNaN(s)) s = currentTime.getSeconds();
        var date = new Date(y, M, d, h, m, s);
        if (date.getFullYear() != y) return false;
        else if (date.getMonth() != M) return false;
        else if (date.getDate() != d) return false;
        else if (date.getHours() != h) return false;
        else if (date.getMinutes() != m) return false;
        else if (date.getSeconds() != s) return false;
        //    else return date.format("yyyy-MM-dd hh:mm:ss");
        else return date;
    }
    catch (ex) {
        catchTheException("String.prototype.toDate", ex);
    }
};
//+---------------------------------------------------  
//| 日期计算  
//+---------------------------------------------------
Date.prototype.DateAdd = function (strInterval, Number) {
    try {
        var dtTmp = this;
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    }
    catch (ex) {
        catchTheException("Date.prototype.DateAdd", ex);
    }
};
//+---------------------------------------------------  
//| 将日期转成时间戳 
//+---------------------------------------------------
Date.prototype.toInt = function (){    
    try{
        var dateStr = this.toString();
        var dateInt = Date.parse(dateStr);//当前时间毫秒的时间戳
        return dateInt;
    }
    catch(ex){
        catchTheException("Date.prototype.toInt", ex);
    }
};

/*
*   获取两个时间间隔   时间1   时间2   单位 （天d  时h 分n 秒s ）
*   例如：2013-10-15 0：00：00    到  2013-10-15 23：59：59    d : 1天
*   getDateDiff("2013-10-15 0：00：00","2013-10-15 23：59：59","d")   返回1
*/
function getDateDiff(date1, date2, strInterval) {
    try {
        var sstime = new Date(date1.replace(/-/gm, "/"));
        var eetime = new Date(date2.replace(/-/gm, "/"));
        var number = 0;
        switch (strInterval) {
            case 's': number = 1000; break;
            case 'n': number = 60000; break;
            case 'h': number = 3600000; break;
            case 'd': number = 86400000; break;
        }
        var diff = ((eetime - sstime) / number);
        return diff;
    }
    catch (ex) {
        catchTheException("getDateDiff", ex);
    }
};
/*
*   获取光标位置函数
*/
function getCursortPosition(ctrl) {//获取光标位置函数
    try {
        var CaretPos = 0; // IE Support
        if (document.selection) {
            //ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }
    catch (ex) {
        catchTheException("getCursortPosition", ex);
    }
};
/*
*   设置光标位置函数
*/
function setCaretPosition(ctrl, pos) {
    try {
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    catch (ex) {
        catchTheException("setCaretPosition", ex);
    }
};
/*
*	动态向叶面中添加Css 文件
*/
function addStyle(Path) {
    try {
        var container = document.getElementsByTagName("head")[0];
        var addStyle = document.createElement("link");
        addStyle.rel = "stylesheet";
        addStyle.type = "text/css";
        addStyle.media = "screen";
        addStyle.href = Path;
        container.appendChild(addStyle);
    }
    catch (ex) {
        catchTheException("addStyle", ex);
    }
};
/*
*	动态向叶面中添加JS 文件
*/
function addScript(Path) {
    try {
        //        var container = document.getElementsByTagName("head")[0];
        //        var addScript = document.createElement("script");
        //        addScript.type = "text/javascript";
        //        addScript.src = Path;
        //        container.appendChild(addScript);

        document.write("<script type='text/javascript' src='" + Path + "'></script>");
    }
    catch (ex) {
        catchTheException("addScript", ex);
    }
};

/*
* 控制边栏折叠展开  id     other:展开的按钮
*/
function objOpenOrClose(id, other) {
    try {
        if (rightTreeShow) {
            rightTreeShow = false;
            PageResize();
            $('#' + id).hide();
            $('#' + other).show();
            //        $('#' + id).animate({ width: 'hide', opacity: 'hide' }, 'normal', function () {
            //            rightTreeShow = false;
            //            PageResize();
            //            $('#' + other).animate({ width: 'show', opacity: 'show' }, 'normal');
            //        });
        }
        else {
            rightTreeShow = true;
            PageResize();
            $('#' + other).hide();
            $('#' + id).show();
            //        $('#' + other).animate({ width: 'hide', opacity: 'hide' }, 'normal');
            //        $('#' + id).animate({ width: 'show', opacity: 'show' }, 'normal');
        }
    }
    catch (ex) {
        catchTheException("objOpenOrClose", ex);
    }
};
/*
* 获取虚拟目录
*/
function getRootPath() {
    try {
        //    var strFullPath = window.document.location.href;
        //    var strPath = window.document.location.pathname;
        //    var pos = strFullPath.indexOf(strPath);
        //    var prePath = strFullPath.substring(0, pos);
        //    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        //    return (prePath + postPath);
        return etmsRootPath;
    }
    catch (ex) {
        catchTheException("getRootPath", ex);
    }
};
/*
*内页右侧切换菜单  liuli add 2013-8-24 10:39:28
                   gesheng update 2015-8-5 14:12:16
*/
function ShowSelMenu(showid, ulClass) {
    try {
        if (ulClass == undefined || ulClass == '') {
            $.each($("#sidebar li>a"), function (i, n) {
                $(n).removeClass("active");
            });
        }
        else {
            $.each($("." + ulClass + " li>a"), function (i, n) {
                $(n).removeClass("active");
            });
        }
        $("#" + showid+">a").addClass("active");
    }
    catch (ex) {
        catchTheException("ShowSelMenu", ex);
    }
};
/*
*正验证整数
*/
function IsNumber(Obj) {
    try {
        if (Obj == "" || Obj == undefined) {
            return false;
        }
        var rego = /^0+$/
        if (rego.test(Obj)) {
            return false;
        }
        var reg = /^(0|([1-9]\d*))?$/;
        if (reg.test(Obj)) {
            return true;
        }
        return false;
    }
    catch (ex) {
        catchTheException("IsNumber", ex);
    }
};
/*
*去掉右侧“分隔符+空格”
*如：str="aa,bb,cc,   "。去掉后的结果是str="aa,bb,cc"
*/
function TrimSplit(str, spli) {
    try {
        str = str.replace(/(\s*$)/g, "");
        spli = "(" + spli + "*$)";
        var zz = new RegExp(spli);
        return str.replace(zz, "");
    }
    catch (ex) {
        catchTheException("TrimSplit", ex);
    }
};
//验证是否是整数或者小数
var maxLon_Common = 140; //最东端：135度2分30秒
var minLon_Common = 75; //最西端：73度40分
var maxLat_Common = 55; //最北端：53度33分
var minLat_Common = 2; //最南端：3度52分
function IsNum(str, max, min) {
    try {
        var res = false;
        var floatReg = /^(-?\d+)(\.\d+)?$/;
        var intReg = /^-?\d+$/;
        if (floatReg.test(str) || intReg.test(str)) {
            var num = parseFloat(str);
            if (num <= max && num >= min) {
                res = true;
            }
        }
        return res;
    }
    catch (ex) {
        catchTheException("IsNum", ex);
    }
};
//经纬度验证
function lonValidator(tLon) {
    if (tLon == "") {
        return "经度不能为空";
    }
    if (!IsNum(tLon, maxLon_Common, minLon_Common)) {
        return "经度不正确";
    }
    return "";
};
function latValidator(tLat) {
    if (tLat == "") {
        return "纬度不能为空";
    }
    if (!IsNum(tLat, maxLat_Common, minLat_Common)) {
        return "纬度不正确";
    }
    return "";
};
/*
*   输入框Enter时间出发查询
*/
function KeySearch(e,buttonID) {
    try {
        e = e || window.event;
        if (e.keyCode == 13){ //回车键的键值为13   
            document.getElementById(buttonID).click(); //调用按钮事件
            return false;
        }
        else {
            return true;
        }
    }
    catch (ex) {
        catchTheException("KeySearch", ex);
    }
};

/*************
*   全选反选控制(LL)
*/
function SetSelStatus() {
    try {
        $("#ck_selStatusSet").toggle(
      function () {
          $("#ck_selStatusSet > span").html("不选");
          $("#ck_selStatusSet > i").removeClass();
          $("#ck_selStatusSet > i").toggleClass("tNotSelect");
          SelectRows(1);
      },
      function () {
          $("#ck_selStatusSet > span").html("全选");
          $("#ck_selStatusSet > i").removeClass();
          $("#ck_selStatusSet > i").addClass("tSelect");
          SelectRows(0);
      })
    }
    catch (ex) {
        catchTheException("SetSelStatus", ex);
    }
};
/***************
*   还原全选反选状态(LL)
*/
function SetSelDefault() {
    try {
        var view = $("#ck_selStatusSet > span").html();
        if (view == "不选") {
            $("#ck_selStatusSet > span").html("全选");
            $("#ck_selStatusSet > i").removeClass();
            $("#ck_selStatusSet > i").addClass("tSelect");
            $("#ck_selStatusSet").unbind();
            SetSelStatus();
        }
    }
    catch (ex) {
        catchTheException("SetSelDefault", ex);
    }
};

/****************************************
*    liuli>列表页选中框的选中操作 type:1全选；0:全不选
*/
function SelectRows(type) {
    try {
        var dataModel = $("#show").pqGrid("option", "dataModel");
        var dataArr = dataModel.data;
        var curPage = dataModel.curPage;
        var rPP = dataModel.rPP;
        for (var i = 0; i < dataArr.length; i++) {
            if (type == 1) {

                var s = $("#show").pqGrid("getCell", { rowIndx: (curPage - 1) * rPP + i, colIndx: 0 });
                //判断disabled属性
                var ckBoxDisValue = $(s).find(":input[type='checkbox']").attr("disabled");
                if (ckBoxDisValue != "disabled") {
                    dataArr[i][0] = true;
                    $(s).find(":input[type='checkbox']").attr("checked", true);
                }
            }
            else {
                dataArr[i][0] = false;
                var s = $("#show").pqGrid("getCell", { rowIndx: (curPage - 1) * rPP + i, colIndx: 0 });
                $(s).find(":input[type='checkbox']").attr("checked", false);
            }
        }
    }
    catch (ex) {
        catchTheException("SelectRows", ex);
    }
};
//获取Cookie
function getCookie(sName) {
    try {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        var oRE = new RegExp(sRE);
        if (oRE.test(document.cookie)) {
            return decodeURIComponent(RegExp["$1"]);
        } else {
            return null;
        }
    }
    catch (ex) {
        catchTheException("getCookie", ex);
    }
};
////设置Cookie
//function setCookie(sName, sValue, oExpires, sPath, sDomain, bSecure) {
//    try {
//        var sCookie = sName + "=" + encodeURIComponent(sValue);
//        if (oExpires) {
//            sCookie += "; expires=" + oExpires.toGMTString();
//        }
//        if (sPath) {
//            sCookie += "; path=" + sPath;
//        }
//        if (sDomain) {
//            sCookie += "; domain=" + sDomain;
//        }
//        if (bSecure) {
//            sCookie += "; secure";
//        }
//        document.cookie = sCookie;
//    }
//    catch (ex) {
//        catchTheException("setCookie", ex);
//    }
//};
//设置Cookie
function setCookie(sName, sValue, opts) {
    try {
        opts = opts || {};
        opts.oExpires = opts.oExpires || null
        opts.sPath = opts.sPath || null;
        opts.sDomain = opts.sDomain || null;
        if(typeof opts.bSecure == "undefined" || opts.bSecure == null || opts.bSecure == ""){
            opts.bSecure = true;
        }
        var sCookie = sName + "=" + encodeURIComponent(sValue);
        if (opts.oExpires) {
            sCookie += "; expires=" + opts.oExpires.toGMTString();
        }
        if (opts.sPath) {
            sCookie += "; path=" + opts.sPath;
        }
        if (opts.sDomain) {
            sCookie += "; domain=" + opts.sDomain;
        }
//        if (opts.bSecure) {
//            sCookie += "; secure";
//        }
        document.cookie = sCookie;
    }
    catch (ex) {
        catchTheException("setCookie", ex);
    }
};
//删除Cookie
function deleteCookie(sName) {
    try {
//        setCookie(sName, "", new Date(Date.parse("Jan 1, 1970")), "/");
        setCookie(sName, "", {oExpires:new Date(Date.parse("Jan 1, 1970")), sPath:"/"});
    }
    catch (ex) { }
};
/*********************
//通过名称获取url地址传入的参数
**********************/
function getUrlParaValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};
/*********************
*   选择器显示文字（domid：保存值的隐藏域）
*   liuli
*/
function ShowSelCarCount(domid) {
    try {
        var val = $("#" + domid);
        if (val != undefined && val != null) {
            var domValue = val.val();
            if (domValue != "")
                domValue = TrimSplit(domValue, ",") + ",";
            var count = domValue.split(',').length - 1;
            return count;
        }
        else {
            return 0;
        }
    }
    catch (ex) {
        catchTheException("ShowSelCarCount", ex);
    }
};

/*********************
*   显示车辆数
*   liuli
*/
function LoadCarCount(hidId, viewId) {
    try {
        var carCount = ShowSelCarCount(hidId);
        if (carCount == 0) {
            $("#" + viewId).val("选择车辆");
        }
        else {
            $("#" + viewId).val("已选择：" + carCount);
        }
    }
    catch (ex) {
        catchTheException("LoadCarCount", ex);
    }
};

/**********
*   liuli
*   去掉后面空格
*/
function doTrimEnd(strValue) {
    try {
        var strTrim = strValue.replace(/(\s*$)/g, "");
        return strTrim;
    }
    catch (ex) {
        catchTheException("doTrimEnd", ex);
    }
};


/**********
*   liuli
*   去掉前面空格
*/
function doTrimPro(strValue) {
    try {
        var strTrim = strValue.replace(/(^\s*)/g, "");
        return strTrim;
    }
    catch (ex) {
        catchTheException("doTrimPro", ex);
    }
};
/**********
*   去掉后边特殊字符
*/
String.prototype.trimEnd = function(trimStr){
    if(!trimStr){return this;}
    var temp = this;
    while(true){
        if(temp.substr(temp.length-trimStr.length,trimStr.length)!=trimStr){
            break;
        }
        temp = temp.substr(0,temp.length-trimStr.length);
    }
    return temp;
};
/**********
*   去掉前边特殊字符
*/
String.prototype.trimStart = function(trimStr){
    if(!trimStr){return this;}
    var temp = this;
    while(true){
        if(temp.substr(0,trimStr.length)!=trimStr){
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp;
};
/*
*  异常捕获
*/
function catchTheException(funName, exception) {
    try{
//            sendAjaxRequest(getRootPath() + "/Home/InsErrorLog", null, "post", { functionName: funName, errorMsg: exception.message, math: Math.random() });
//            sendAjax(getRootPath() + "/Home/InsErrorLog",{data:{ functionName: funName, errorMsg: exception.message, math: Math.random() }});
        }
    catch(ex){}
};

//判断是否含有页面提交不安全元素
function inputHasHtml(str) {
    try {
        if (str == undefined || str == null || str == "") {
            return false;
        }
        else {
            var reg1 = /<\w*>|<>|</gi;
            if(!reg1.test(str)){ 
                var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9 -@_\.\u4e00-\u9fa5]+$/gi;
                return !reg.test(str);
            }
            else{
                return true;
            }
            //var reg = /<|>/gi;
        }
    }
    catch (ex) {
        catchTheException("inputHasHtml", ex);
    }
};


/*
* usage:
var loader = new JsLoader()
loader.load("xxx.js");
loader.onsuccess  = function()
{
alert("loaded!");  
}
*/
function JsLoader() {
    this.load = function (url) {
        this.url = url;
        //获取所有的<script>标记
        var ss = document.getElementsByTagName("script");

        //判断指定的文件是否已经包含，如果已包含则触发onsuccess事件并返回
        for (i = 0; i < ss.length; i++) {
            if (ss[i].src && ss[i].src.indexOf(url) != -1) {
                this.onsuccess();
                return;
            }
        }
        //创建script结点,并将其属性设为外联JavaScript文件
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.charset = "utf-8";
        s.src = url;

        //获取head结点，并将<script>插入到其中
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);

        //获取自身的引用
        var self = this;

        //对于IE浏览器，使用readystatechange事件判断是否载入成功
        //对于其他浏览器，使用onload事件判断载入是否成功
        s.onload = s.onreadystatechange = function () {
            //在此函数中this指针指的是s结点对象，而不是JsLoader实例,
            //所以必须用self来调用onsuccess事件，下同。
            if (this.readyState && this.readyState == "loading")
                return;
            self.onsuccess();
        }
        s.onerror = function () {
            head.removeChild(s);
            self.onfailure();
        }
    };
    //定义载入成功事件
    this.onsuccess = function () {
    };

    //定义失败事件
    this.onfailure = function () {
    };

    //卸载脚本
    this.removejs = function (filename) {
        if (!filename) {
            filename = this.url;
        }
        var allsuspects = document.getElementsByTagName("script");
        for (var i = allsuspects.length; i >= 0; i--) {
            if (allsuspects[i] && allsuspects[i].getAttribute("src") != null &&
            allsuspects[i].getAttribute("src").indexOf(filename) != -1)
                allsuspects[i].parentNode.removeChild(allsuspects[i]); //remove element by calling parentNode.removeChild()
        }
    };
};

/*
*载入多个依赖脚本或不依赖的脚本
* usage:
*  var loaders = new JssProc();
*  loaders.loads(["xx.js","xx1.js"],true);//同步加载
*  loaders.loaded = function()
*  {
*       alert("all loaded!"); 
*  }
*/
function JssProc() {

    //是否同同步加载
    this.loads = function (urls, isSyn) {
        var number = 0;
        var self = this;
        if (!isSyn) {
            for (var i = 0; i < urls.length; i++) {
                var s = new JsLoader()
                s.load(urls[i]);
                s.onsuccess = function () {
                    number++;
                    if (number == urls.length) {
                        self.loaded();
                    }
                }
            }
        }
        else {
            //递归方式
            var j = 0;
            function load() {
                j++;
                if (urls[j]) {
                    var ss = new JsLoader();
                    ss.load(urls[j]);
                    ss.onsuccess = load;
                }
                else {
                    self.loaded();
                }
            }
            var s = new JsLoader();
            s.load(urls[j]);
            s.onsuccess = load;
        }
    };
    //全部加载完调用的事件
    this.loaded = function () {

    };

    //卸载多个脚本
    this.unload = function () {
        for (var i = 0; i < urls.length; i++) {
            new JsLoader().removejs(urls[j]);
        }
    };
};

/*
*   表格最大化方法(要求：保证表格外面加两层DIV  爷爷DIV的ID比父亲DIV的ID多一个T)
*   linkID : 放大链接ID
*   tableDivID : 表格ID
*   tableParentDivID : 表格父亲div的ID
*   heightT : 表格原来的高度
*   title : 表格名字
*/
function setTableShowMax(linkID, tableDivID, tableParentDivID, heightT, title) {
    $("#" + linkID).bind("click", function () { showTableMax(linkID, tableDivID, tableParentDivID, heightT, title); });
};
function showTableMax(linkID, divID, parentID, heightT, title) {
    var wh = GetPageSize();
    var wt = $("#" + parentID + "T").parent().width();
    heightT = parseInt($("#" + divID).parent().css("height"));
    var $grid = $("#" + divID);
    $("#" + parentID).dialog({
        resizable: false,
        height: wh[3],
        width: wh[2] - 2,
        modal: true,
        title: title,
        dialogClass: "mapLayer"
        , open: function (evt, ui) {
            $grid.pqGrid("option", { width: wh[2] - 2, height: wh[3] - 35 - 33 });
            $("#" + linkID).hide();
        }
        , close: function () {
            var $parent = $("#" + divID).parent();
            $parent.append($grid);
            $parent.css("height",heightT+"px").width(wt - 2).show();
            $("#" + parentID).dialog("destroy");
            $("#" + parentID).height(heightT + 33).width(wt - 2).show();
            $("#" + parentID + "T").append($("#" + parentID));
            $("#" + divID).pqGrid("option", { width: wt - 2, height: heightT });
            $("#" + linkID).show();
        }
    });
};

function setFlexShowMax(linkID, tableDivID, tableParentDivID, heightT, title,reloadFun) {
    $("#" + linkID).bind("click", function () { showFlexMax(linkID, tableDivID, tableParentDivID, heightT, title, reloadFun); });
};
function showFlexMax(linkID, divID, parentID, heightT, title, reloadFun) {
    var wh = GetPageSize();
    var wt = $("#" + parentID + "T").parent().width();
    var $flex = $("#" + divID);
    $("#" + parentID).dialog({
        resizable: false,
        height: wh[3],
        width: wh[2] - 2,
        modal: true,
        title: title,
        dialogClass: "mapLayer"
        , open: function (evt, ui) {
            //$("#" + divID).html("");
            $("#" + linkID).hide();
            $("#" + divID).height($("#" + parentID).height() - 32);
            reloadFun();
        }
        , close: function () {
            var $parent = $("#" + parentID);
            $parent.dialog("destroy");
            $parent.height(heightT + 33).width(wt - 2).show();
            $("#" + parentID + "T").append($parent);
            $("#" + linkID).show();
            $("#" + divID).height($("#" + parentID).height() - 32);
            reloadFun();
        }
    });
};

//自定义排序（设置dataType时，赋值自定义排序函数即可）
function datetimeType(val1, val2) {
    var date1 = val1.toDate("yyyy-MM-dd hh:mm:ss");
    var date2 = val2.toDate("yyyy-MM-dd hh:mm:ss");
    if (date1 > date2) { return 1; }
    else if (date1 == date2) { return 0; }
    else { return -1; }
};
//判断浏览器类型及版本
function uaMatch(ua) {
	var browser;
	var version;
	var rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
	rFirefox = /(firefox)\/([\w.]+)/,
	rOpera = /(opera).+version\/([\w.]+)/,
	rChrome = /(chrome)\/([\w.]+)/,
	rSafari = /version\/([\w.]+).*(safari)/;
	var match = rMsie.exec(ua);
	if (match != null) {
		return { browser: "IE", version: match[2] || "0" };
	}
	var match = rFirefox.exec(ua);
	if (match != null) {
		return { browser: match[1] || "", version: match[2] || "0" };
	}
	var match = rOpera.exec(ua);
	if (match != null) {
		return { browser: match[1] || "", version: match[2] || "0" };
	}
	var match = rChrome.exec(ua);
	if (match != null) {
		return { browser: match[1] || "", version: match[2] || "0" };
	}
	var match = rSafari.exec(ua);
	if (match != null) {
		return { browser: match[2] || "", version: match[1] || "0" };
	}
	if (match != null) {
		return { browser: "", version: "0" };
	}
};

function getBrowserInfo(){
	var ua = navigator.userAgent.toLowerCase();
	var browserMatch = uaMatch(ua);
	if (browserMatch.browser) {
		return {browser:browserMatch.browser,version:browserMatch.version};
	}
	else{
		return {browser:"",version:"0"};
	}
};

/*************
*   设置默认时间
*   opt :  HMS(时分秒) HM(时分)
*/
function SetDefaultTime(btime, etime,opt) {
    try {
        var currTime = new Date();
        var year = currTime.getFullYear();
        var month = currTime.getMonth();
        var day = currTime.getDate();
        if (opt == 'HMS') {
            $("#" + btime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + " 00:00:00");
            $("#" + etime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + " 23:59:59");
        } else if(opt == 'HM') {
            $("#" + btime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + " 00:00");
            $("#" + etime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + " 23:59");
        }
    }
    catch (ex) {
        catchTheException("Report.js的SetDefaultTime", ex);
    }
};
//设置标准时间   前面没有0的补0
function setStandardTime(val){
    var str = val;
    if(val<10){
        str = "0"+str;
    }
    return str;
};

/*
*   时间段选择控制 方法 
*   参数1： 下拉列表id
*   参数2： 开始时间id
*   参数3： 结束时间id
*   参数4 :   HMS(时分秒) HM(时分)
*/
function bindTimeSelect(select, btime, etime,opt) {
    try {
        if (opt == undefined||opt==null) {opt = {};}
        opt.timeformat = opt.timeformat || "HMS";
        SetDefaultTime(btime, etime,opt.timeformat);
        $("#" + select).bind("change", function () {
            var currTime = new Date();
            var year = currTime.getFullYear();
            var month = currTime.getMonth();
            var day = currTime.getDate();
            var startformat, endformat;
            if (opt.timeformat) opt.timeformat = opt.timeformat || 'HMS';
            if (opt.timeformat == 'HM') {
                startformat =  ' 00:00';
                endformat = ' 23:59';
            }
            else{
                 startformat = ' 00:00:00';
                endformat = ' 23:59:59';
            }
            switch (this.value) {
                case "自定义时间":
//                    $("#" + btime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" +setStandardTime(day) + " 00:00:00").parent().parent().removeClass("unavailable");
//                    $("#" + etime).attr("disabled", false).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + " 23:59:59").parent().parent().removeClass("unavailable");
                    $("#" + btime).attr("disabled", false).parent().parent().removeClass("unavailable");
                    $("#" + etime).attr("disabled", false).parent().parent().removeClass("unavailable");
                    break;
                case "今天":
                    $("#" + btime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + endformat).parent().parent().addClass("unavailable");
                    break;
                case "昨天":
                    var btimeObj = currTime.DateAdd('d', -1);
                    $("#" + btime).attr("disabled", true).val(btimeObj.getFullYear() + "-" + setStandardTime(btimeObj.getMonth() + 1) + "-" + setStandardTime(btimeObj.getDate()) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(btimeObj.getFullYear() + "-" + setStandardTime(btimeObj.getMonth() + 1) + "-" + setStandardTime(btimeObj.getDate()) + endformat).parent().parent().addClass("unavailable");
                    break;
                case "最近2天":
                    var btimeObj = currTime.DateAdd('d', -1);
                    $("#" + btime).attr("disabled", true).val(btimeObj.getFullYear() + "-" + setStandardTime(btimeObj.getMonth() + 1) + "-" + setStandardTime(btimeObj.getDate()) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + endformat).parent().parent().addClass("unavailable");
                    break;
                case "最近7天":
                    var btimeObj0 = currTime.DateAdd('d', -6);
                    $("#" + btime).attr("disabled", true).val(btimeObj0.getFullYear() + "-" + setStandardTime(btimeObj0.getMonth() + 1) + "-" + setStandardTime(btimeObj0.getDate()) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + endformat).parent().parent().addClass("unavailable");
                    break;
                case "最近10天":
                    var btimeObj1 = currTime.DateAdd('d', -9);
                    $("#" + btime).attr("disabled", true).val(btimeObj1.getFullYear() + "-" + setStandardTime(btimeObj1.getMonth() + 1) + "-" + setStandardTime(btimeObj1.getDate()) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + endformat).parent().parent().addClass("unavailable");
                    break;
                case "最近30天":
                    var btimeObj2 = currTime.DateAdd('d', -29);
                    $("#" + btime).attr("disabled", true).val(btimeObj2.getFullYear() + "-" + setStandardTime(btimeObj2.getMonth() + 1) + "-" + setStandardTime(btimeObj2.getDate()) + startformat).parent().parent().addClass("unavailable");
                    $("#" + etime).attr("disabled", true).val(year + "-" + setStandardTime(month + 1) + "-" + setStandardTime(day) + endformat).parent().parent().addClass("unavailable");
                    break;
                default:
                    break;
            }
            
            if (opt.callback != undefined) {
                opt.callback();
            }
        });
    }
    catch (ex) {
        catchTheException("Report.js的bindTimeSelect", ex);
    }
};

//设置页面上的时间选择
function timeSelCtrl(id){
    var sel = ["自定义时间","今天","昨天","最近2天","最近7天","最近30天"];
    var selobj = document.getElementById(id); //下拉框组件
    for (var i = 0; i < sel.length; i++) {
        var option = document.createElement("option");
        option.text = sel[i];
        option.value = sel[i];
        selobj.add(option);
    }
};
//设置页面上的时间选择
function timeSelCtrl_10(id){
    var sel = ["自定义时间","今天","昨天","最近2天","最近7天","最近10天"];
    var selobj = document.getElementById(id); //下拉框组件
    for (var i = 0; i < sel.length; i++) {
        var option = document.createElement("option");
        option.text = sel[i];
        option.value = sel[i];
        selobj.add(option);
    }
};

//检查小数点后面位数
function checkFloatLength(obj, length) {
    var data = obj.val().split('.');
    if (data.length > 1 && data[1].length > length) {
        showError_Sub(obj, "小数点后最多"+length+"位");
        return false;
    }
    return true;
};
//时间选择后置焦点，让鼠标移开后移除黄色tips验证（有时间验证的需要加）
function dateChanged() {
    $("#"+this.id).focus();
 };
 
//将秒换算成时分秒
function formatSeconds(value) {
    var theTime = parseInt(value); // 秒
    var theTime1 = 0; // 分
    var theTime2 = 0; // 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
};
/*
*处理IE8的placeholder不兼容的情况
*参数：id - 文本框id；str - 要提示的文字
*/
function dealPlaceHolder(id, str) {
    $("#" + id).val(str).css("color", "#aaa");
    $("#" + id).focus(function (e) {
        if (this.value == str) {
            $(this).val("").css("color", "black");
        }
    })
    .blur(function () {
        if (this.value == "") {
            $(this).val(str).css("color", "#aaa");
        }
    });
};