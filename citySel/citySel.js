/**********************************************
*   说明：城市选择js                                                          *
*   作者：zl     2013-9-25                                                  *
/*********************************************/
/*
*   全局变量
*/
var txtId = ""; //文本框ID
var hidId = ""; //隐藏域ID
var callbackFun = null; //回调函数(返回值：‘银川市|38.47426*106.28956@38.473786*106.285127|9|6553856’ （其中，城市代码6553856可能为""）  OR   ‘38.47426*106.28956@38.473786*106.285127’)
var cPanelHeight = 292; //面板高度
var cPanelWidth = 394; //面板宽度
var isSetMap = true; //是否设置地图中心点
var isProvinceSel = false; //省份是否可以选择（默认不可选）
/*
*  选择城市
*tId-文本框ID，hId-隐藏域ID，callback-选择城市之后的回调函数，isSet-是否设置地图，isPClick-省份(全国)是否可以选择
*/
function cSelectCity(tId, hId, callback, isSet, isPSel) {
    try {
        if (typeof tId != "undefined" && tId != "" && tId != null) { txtId = tId; }
        if (typeof hId != "undefined" && hId != "" && hId != null) { hidId = hId; }
        if (typeof callback != "undefined" && callback != "" && callback != null) { callbackFun = callback; }
        if (typeof isSet != "undefined" && isSet != null) { isSetMap = isSet; }
        if (typeof isPSel != "undefined" && isPSel != null) { isProvinceSel = isPSel; }
        cDrawCitySelPanel();
        var wwhh = GetPageSize();
        var divTop = 0;
        var divLeft = 0;
        //获取滚动条的位置   gesheng 2015-06-05
        var scrollTop = getScroll().scrollTop;
        var scrollLeft = getScroll().scrollLeft;
        if (txtId != "") {
            var inputObj = $("#" + txtId);
            var Offset = inputObj.offset();
            //下面空间处理
            if ((wwhh[3] - (Offset.top - scrollTop)) < cPanelHeight) {
                divTop = Offset.top - cPanelHeight;
            }
            else {
                divTop = Offset.top + inputObj.outerHeight();
            }
            //右边空间处理
            if ((wwhh[2] - (Offset.left - scrollLeft)) < cPanelWidth) {
                divLeft = (Offset.left + inputObj.width()) - cPanelWidth + 5;
            }
            else {
                divLeft = Offset.left;
            }
        }
        else {
            divTop = (wwhh[3] - scrollTop) / 2 - cPanelHeight / 2;
            divLeft = (wwhh[2] - scrollLeft) / 2 - cPanelWidth / 2;
        }
        $("#cCitySelDiv").css("left", divLeft)
                                        .css("top", divTop);
        $("#cCitySelDiv").show();
        cInitCitySelDiv();
        $("#cProvinceDiv .line a").off("click");
        $("#cProvinceDiv .line a").on("click", function () {
            cFocusCityA(0, this);
        });
        $("#cCityDiv .line a").off("click");
        $("#cCityDiv .line a").on("click", function () {
            cFocusCityA(1, this);
        });
        //        cLoadCityDatas();
    }
    catch (ex) {
        catchTheException("cSelectCity", ex);
    }
};

/********************
 * 取窗口滚动条高度 
 *gesheng 2015-06-05
 ******************/
function getScroll() {
    var scrollTop, scrollLeft;

    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
        scrollLeft = document.documentElement.scrollLeft;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
        scrollLeft = document.body.scrollLeft;
    }
    return { scrollTop: scrollTop, scrollLeft: scrollLeft };
}

//初始化面板
function cInitCitySelDiv() {
    try {
        var pClassStr = $("#cAccordingToPA").attr("class");
        var cClassStr = $("#cAccordingToCA").attr("class");
        if (pClassStr.indexOf("now") >= 0) {
            $("#cProvinceDiv").show();
            $("#cCityDiv").hide();
            cLoadProvinceInfos();
        }
        else if (cClassStr.indexOf("now") >= 0) {
            $("#cProvinceDiv").hide();
            $("#cCityDiv").show();
            cLoadCityInfos();
        }
    }
    catch (ex) {
        catchTheException("cInitCitySelDiv", ex);
    }
};
//绘制城市选择面板
function cDrawCitySelPanel() {
    try {
        if ($("#cCitySelDiv").length > 0) {
            $("#cSearchTxt").val("");
            $("#cCitySelDiv a[class='selected']").removeClass("selected");
            $("#cSearchTxt").blur();
            return;
          }
        var cityPanelStr = "";
        var cityDiv = document.createElement("div");
        $(cityDiv).attr("id", "cCitySelDiv")
                     .addClass("cityLayer")
                     .css("width", 390)
                     .css("top", 100)
                     .css("left", 100)
                     .css("display", "none")
                     .css("z-index",5000);                      //gs后来加的
        var countryStr = "";
        if (isProvinceSel) { countryStr = '<a href="javascript:void(0)" onclick="cSetMapCity(0,\'全国|34.30017*108.9976@34.301612*108.992755|1|\');"><b>全国</b></a>'; }
        else { countryStr = '<a href="javascript:void(0)" style=" color:#808080; text-decoration:none;cursor:default;"><b>全国</b></a>'; }
        cityPanelStr += '<a class="closeCom" href="javascript:void(0)" title="关闭" id="cCloseBtn" onclick="cCloseCityPanel();">关闭</a>'
                                 + '<div class="cityListLayer">'
                                    + '<div class="hotCity" id="cHotCityDiv">'
                                        + countryStr
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'北京|39.89945*116.40969@39.898046*116.403447|7|1114368\');">北京</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'上海|31.23385*121.4755@31.235782*121.470968|7|3211520\');">上海</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'天津|39.14307*117.2001@39.142018*117.193784|8|1179904\');">天津</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'重庆|29.56029*106.55355@29.563135*106.549829|8|5243136\');">重庆</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'深圳|22.55197*114.11819@22.554654*114.113081|8|4457216\');">深圳</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'广州|23.13399*113.26006@23.136667*113.254734|8|4456704\');">广州</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'西安|34.30017*108.9976@34.301612*108.992755|8|6357248\');">西安</a>'
                                        + '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'香港|22.31881*114.18144@22.321572*114.176492|8|8454145\');">香港</a>'
                                    + '</div>'
                                    + '<div class="searchCity fix" >'
                                        + '<div class="left fix">'
                                            + '<a class="bl now" href="javascript:void(0)" id="cAccordingToPA" onclick="cAccordingToClick(0);">按省份</a>'
                                            + '<a class="br" href="javascript:void(0)" id="cAccordingToCA" onclick="cAccordingToClick(1);">按城市</a>'
                                        + '</div>'
                                        + '<div class="comSearch right" style="display:none;">'
                                            + '<input id="cSearchTxt" class="inp" type="text" value="输入城市名" style="width: 133px;" />'
                                            + '<input id="cSearchBtn" class="bot" type="button" onmousemove="this.className=\'botOver\'" onmouseout="this.className=\'bot\'" value="" onclick="cSearchCity();" />'
                                        + '</div>'
                                    + '</div>'
                                    + '<div id="cProvinceDiv">'
                                        + '<div class="line" style="display:none;">'
                                            + '<a href="javascript:void(0)">A</a>'
                                            + '<a href="javascript:void(0)">F</a>'
                                            + '<a href="javascript:void(0)">G</a>'
                                            + '<a href="javascript:void(0)">H</a>'
                                            + '<a href="javascript:void(0)">J</a>'
                                            + '<a href="javascript:void(0)">L</a>'
                                            + '<a href="javascript:void(0)">N</a>'
                                            + '<a href="javascript:void(0)">Q</a>'
                                            + '<a href="javascript:void(0)">S</a>'
                                            + '<a href="javascript:void(0)">X</a>'
                                            + '<a href="javascript:void(0)">Y</a>'
                                            + '<a href="javascript:void(0)">Z</a>'
                                            + '<a href="javascript:void(0)">其它</a>'
                                        + '</div>'
                                        + '<div id="cPContentDiv" class="cityList">'
                                            + '<table>'
                                                + '<tbody id="cProvinceInfoTB">'
                                                + '</tbody>'
                                            + '</table>'
                                        + '</div>'
                                    + '</div>'
                                    + '<div id="cCityDiv" style="display:none;">'
                                        + '<div class="line"  style="display:none;">'
                                            + '<a href="javascript:void(0)">A</a>'
                                            + '<a href="javascript:void(0)">B</a>'
                                            + '<a href="javascript:void(0)">C</a>'
                                            + '<a href="javascript:void(0)">D</a>'
                                            + '<a href="javascript:void(0)">E</a>'
                                            + '<a href="javascript:void(0)">F</a>'
                                            + '<a href="javascript:void(0)">G</a>'
                                            + '<a href="javascript:void(0)">H</a>'
                                            + '<a href="javascript:void(0)">J</a>'
                                            + '<a href="javascript:void(0)">K</a>'
                                            + '<a href="javascript:void(0)">L</a>'
                                            + '<a href="javascript:void(0)">M</a>'
                                            + '<a href="javascript:void(0)">N</a>'
                                            + '<a href="javascript:void(0)">P</a>'
                                            + '<a href="javascript:void(0)">Q</a>'
                                            + '<a href="javascript:void(0)">R</a>'
                                            + '<a href="javascript:void(0)">S</a>'
                                            + '<a href="javascript:void(0)">T</a>'
                                            + '<a href="javascript:void(0)">W</a>'
                                            + '<a href="javascript:void(0)">X</a>'
                                            + '<a href="javascript:void(0)">Y</a>'
                                            + '<a href="javascript:void(0)">Z</a>'
                                        + '</div>'
                                        + '<div id="cCContentDiv" class="cityList">'
                                            + '<table>'
                                                + '<tbody id="cCityInfoTB">'
                                                + '</tbody>'
                                            + '</table>'
                                        + '</div>'
                                    + '</div>'
                                 + '</div>';
        $(cityDiv).html(cityPanelStr);
        document.body.appendChild(cityDiv);
        $("#cSearchTxt").focus(function (e) {
            if (this.value == "输入城市名") {
                $(this).val("").css("color", "black");
            }
        })
        .blur(function () {
            if (this.value == "") {
                $(this).val("输入城市名").css("color", "#c0c0c0");
            }
        })
        .keyup(function (e) {
            if (e.keyCode == "13") { cSearchCity(); }
        });
    }
    catch (ex) {
        catchTheException("cDrawCitySelPanel", ex);
    }
};
/*
*加载面板数据
*/
//加载省份信息
function cLoadProvinceInfos() {
    try {
        if ($.trim($("#cProvinceInfoTB").html()) != "") { return; }
        $("#cPContentDiv").mask("loading...");
        //加载省份信息
        var pContentArr = new Array();
        var pStr = "";
        var pFlag = "";
        for (var i = 0, len = cProvinceDatas.length; i < len; i++) {
            var cProvinceArr = cProvinceDatas[i].split("|");
            if (cProvinceArr[4] == "") { continue; }
            pStr = '<tr>';
            if (cProvinceArr[4] != pFlag) {
                pStr += '<td valign="top"><b><a href="javascript:void(0)" style="cursor:default;" id="cP' + cProvinceArr[4] + '">' + cProvinceArr[4] + '</a></b></td>';
            }
            else if (cProvinceArr[4] == pFlag) {//相同字母的第一列留空
                pStr += '<td></td>';
            }
            if (isProvinceSel) {
                pStr += '<td valign="top"><h2><a href="javascript:void(0)" onclick="cSetMapCity(0,\'' + cProvinceDatas[i] + '\');">' + cProvinceArr[0].replace("省", "") + '</a></h2></td>';
            }
            else {
                pStr += '<td valign="top"><h3><a href="javascript:void(0)" style="cursor:default;">' + cProvinceArr[0].replace("省", "") + '</a></h3></td>';
            }
            pStr += '<td>';
            for (var j = 0, len1 = cCityDatas[cProvinceArr[0]].length; j < len1; j++) {
                var cityArr = cCityDatas[cProvinceArr[0]][j].split("|");
                pStr += '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'' + cCityDatas[cProvinceArr[0]][j] + '\');">' + cityArr[0].replace("市", "") + '</a>';
            }
            pStr += '</td>'
                     + '</tr>';
            pFlag = cProvinceArr[4];
            pContentArr.push(pStr);
        }
        //其它处理
        pStr = '<tr>'
                + '<td></td>'
                + '<td><h3><a href="javascript:void(0)" style="cursor:default;" id="cPOther">其它</a></h3></td>'
                + '<td>';
        for (var n = 0, len = cCityDatas["其它"].length; n < len; n++) {
            var cityArr = cCityDatas["其它"][n].split("|");
            pStr += '<a href="javascript:void(0)" onclick="cSetMapCity(1,\'' + cCityDatas["其它"][n] + '\');">' + cityArr[0].replace("市", "") + '</a>';
        }
        pStr += '</td>'
                     + '</tr>';
        pContentArr.push(pStr);

        $("#cProvinceInfoTB").html(pContentArr.join(""));
        $("#cPContentDiv").unmask();
    }
    catch (ex) {
        catchTheException("cLoadProvinceInfos", ex);
    }
};
//加载城市信息
function cLoadCityInfos() {
    try {
        if ($.trim($("#cCityInfoTB").html()) != "") { return; }
        $("#cCContentDiv").mask("loading...");
        var cCityAArr = new Array();
        cCityAArr["A"] = new Array();
        cCityAArr["B"] = new Array();
        cCityAArr["C"] = new Array();
        cCityAArr["D"] = new Array();
        cCityAArr["E"] = new Array();
        cCityAArr["F"] = new Array();
        cCityAArr["G"] = new Array();
        cCityAArr["H"] = new Array();
        cCityAArr["J"] = new Array();
        cCityAArr["K"] = new Array();
        cCityAArr["L"] = new Array();
        cCityAArr["M"] = new Array();
        cCityAArr["N"] = new Array();
        cCityAArr["P"] = new Array();
        cCityAArr["Q"] = new Array();
        cCityAArr["R"] = new Array();
        cCityAArr["S"] = new Array();
        cCityAArr["T"] = new Array();
        cCityAArr["W"] = new Array();
        cCityAArr["X"] = new Array();
        cCityAArr["Y"] = new Array();
        cCityAArr["Z"] = new Array();
        var cContentArr = new Array();
        var cStr = "";
        //加载城市信息
        for (var i in cCityDatas) {
            for (var j = 0, len = cCityDatas[i].length; j < len; j++) {
                var cityArr = cCityDatas[i][j].split("|");
                cCityAArr[cityArr[4]].push('<a href="javascript:void(0)" onclick="cSetMapCity(1,\'' + cCityDatas[i][j] + '\');">' + cityArr[0].replace("市", "") + '</a>');
            }
        }
        //将处理好的城市信息拼接成表格
        for (var n in cCityAArr) {
            cStr = '<tr>'
                         + '<td valign="top"><b><a href="javascript:void(0)" id="cC' + n + '">' + n + '</a></b></td>'
                         + '<td>' + cCityAArr[n].join("") + '</td>'
                     + '</tr>';
            cContentArr.push(cStr);
        }
        $("#cCityInfoTB").html(cContentArr.join(""));
        $("#cCContentDiv").unmask();
    }
    catch (ex) {
        catchTheException("cLoadCityInfos", ex);
    }
};
//设置选中城市为当前城市
function cSetMapCity(type, cityInfoStr) {
    try {
        var cityInfoArr = cityInfoStr.split("|");
        var lon84 = 0;
        var lat84 = 0;
        var lon02 = 0;
        var lat02 = 0;
        var llArr = cityInfoArr[1].split("@");
        lon02 = parseFloat(llArr[0].split("*")[1]);
        lat02 = parseFloat(llArr[0].split("*")[0]);
        lon84 = parseFloat(llArr[1].split("*")[1]);
        lat84 = parseFloat(llArr[1].split("*")[0]);
        var level = parseInt(cityInfoArr[2]);
        if (isSetMap && typeof map != "undefined" && map != null) {
            var cPoint = createLngLatObj_Common(lon84, lat84, lon02, lat02);
            map.setZoom(level + 3);
            map.setMapCenter(cPoint);
        }
        var sCitySel = cityInfoArr[0].replace("省", "").replace("市", "");
        if (txtId != "") { $("#" + txtId).val(sCitySel); }
        if (hidId != "") { $("#" + hidId).val(cityInfoStr); }
        var cName = cityInfoArr[0];
        if (typeof cName != "undefined" && cName != "" && cName != null) {
            cName = cName.replace("省", "").replace("市", "");
        }
        else { cName = ""; }
        if (callbackFun != null) {
            eval("callbackFun('" + cityInfoStr + "','" + cName + "','" + type + "')");
        }
        cCloseCityPanel();
    }
    catch (ex) {
        catchTheException("cSetMapCity", ex);
    }
};
//查找城市
function cSearchCity() {
    try {
        var pClassStr = $("#cAccordingToPA").attr("class");
        var cClassStr = $("#cAccordingToCA").attr("class");
        var selDivId = "";
        if (pClassStr.indexOf("now") >= 0) { selDivId = "cProvinceDiv"; }
        else { selDivId = "cCityDiv"; }
        var sTxt = $.trim($("#cSearchTxt").val());
        if (sTxt != "" && sTxt != "输入城市名") {
            var selCityA = null;
            var selCount = 0;
            var citys = $("#" + selDivId + " a");
            var allCitys = $("#cHotCityDiv a");
            $.merge(allCitys, citys);
            for (var i = 0, len = allCitys.length; i < len; i++) {
                allCitys[i].className = "";
                if (allCitys[i].innerHTML.indexOf(sTxt) >= 0 || sTxt.indexOf(allCitys[i].innerHTML) >= 0) {
                    if ((!isProvinceSel && $(allCitys[i]).parent()[0].tagName != "H3") || isProvinceSel) {
                        allCitys[i].className = "selected";
                        if (selCityA == null || $(allCitys[i]).html().replace("市", "") != $(selCityA).html().replace("市", "")) {
                            selCount++;
                        }
                        selCityA = allCitys[i];
                    }
                }
            }
            $(selCityA).focus();
            if (selCityA != null && selCount == 1) {
                $(selCityA).click();
            }
        }
        else {
            $("#cCitySelDiv a[class='selected']").removeClass("selected");
            $("#cSearchTxt").blur();
         }
    }
    catch (ex) {
        catchTheException("cSearchCity", ex);
    }
};
//按照省份/城市按钮事件（0-省份；1-城市）
function cAccordingToClick(type) {
    try {
        if (type == 0) {
            $("#cProvinceDiv").show();
            $("#cCityDiv").hide();
            $("#cAccordingToCA").removeClass("now");
            $("#cAccordingToPA").addClass("now");
            cLoadProvinceInfos();
        }
        else {
            $("#cProvinceDiv").hide();
            $("#cCityDiv").show();
            $("#cAccordingToPA").removeClass("now");
            $("#cAccordingToCA").addClass("now");
            cLoadCityInfos();
        }
    }
    catch (ex) {
        catchTheException("cAccordingToClick", ex);
    }
};
//根据拼音将省市数据focus
function cFocusCityA(type, obj) {
    try {
        var flagStr = (type == 0) ? "P" : "C";
        var letterStr = $(obj).html();
        if (letterStr == "其它") { letterStr = "Other"; }
        $("#c" + flagStr + letterStr).focus();
    }
    catch (ex) {
        catchTheException("cFocusCityA", ex);
    }
};
//关闭弹出层面板
function cCloseCityPanel() {
    try {
        $("#cCitySelDiv").hide();
    }
    catch (ex) {
        catchTheException("cCloseCityPanel", ex);
    }
};