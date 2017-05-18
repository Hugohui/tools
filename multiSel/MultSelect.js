/***********************************************************************
*   多选/单选JS文件
*   lt  2013-7-3 9:58:23   
*   InitSelect("车辆多选","../../OdometerCollect/GetCarsData",'carsel','selHidden','',null,true);
*   如果指定了 callback 函数   将返回两个参数  id 串和 name 串
*   如果没有指定 callback 函数   获取 id 串和 name 串 方法是通过隐藏域 hiddenID ，hideNameId 获取
*************************************************************************/
function MultiSelect() {
    this.data = null;
    this.multSelLoading = false;
    this.sureCallBack = null; //确定之后回调函数
    this.input = "";
    this.hidden = "";
    this.hideReg = "";
    this.zTree_fun = null;
    this.setting_fun = null;
    this.isDIvShow = false;
    this.selectIDs = "";
    this.selectNames = "";
    this.isMultSel = true;
    this.inputTxt = "";
    this.value = "";
    this.searchTimer = null;
    var that = this;
    this.searched = false;
    this.dataUrl = "";
    this.IsOverDiv = false;
    /*
    *  功能：单选/多选 选择器  初始化方法
    *  param: txt 文本框显示内容 
    *  param: url :请求数据地址   
    *  param: inputID:绑定输入框id   
    *  param: hiddenID：隐藏域Id   
    *  param: hideNameId:隐藏名称串  
    *  param: callBack:回调函数     
    *  param: isMult:是否多选  默认多选  false 单选
    *  param: height:高度   默认350 
    *  param: width:宽度   默认200
    */
    this.InitSelect = function (txt, url, inputID, hiddenID, hideNameId, callBack, isMult, height, width,readonly) {
        try {
            this.dataUrl = url;
            this.inputTxt = txt;
            //this.inputTxt = "请输入或选择";
            this.input = inputID;
            this.hidden = hiddenID;
            this.hideReg = hideNameId;
            this.height = height || 350;
            this.width = width || 200;
            this.isMultSel = typeof isMult == "undefined" ? this.isMultSel : isMult;
            if (!readonly) {
                this.readonly = false;
            }
            else { this.readonly = true; }
            if (typeof callBack != "undefined" && callBack != "" && callBack != null) {
                this.sureCallBack = callBack;
            }
            if (!that.multSelLoading) {
                var checkVal = null;
                if (that.isMultSel) {
                    checkVal = {
                        enable: true
                    };
                }
                else {
                    checkVal = {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    };
                }
                that.setting_fun = {
                    check: checkVal
                        , view: {
                            showIcon: false,
                            selectedMulti: that.isMultSel
                        }
                        , data: {
                            key: {
                                name: "Name"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "ID",
                                pIdKey: "pID",
                                Sel: "Sel"
                            }
                        }
                        , callback: {
                            onClick: function (e, treeId, treeNode) {
                                if (treeNode.Sel == 0) { return; }
                                if (that.isMultSel) {
                                    that.zTree_fun.checkNode(treeNode, !treeNode.checked);
                                    that.getCheckedValues(treeNode.ID, treeNode.checked);
                                }
                                else {
                                    that.zTree_fun.checkNode(treeNode, !treeNode.checked);
                                    that.sureBtnClick();
                                }
                            }
                            , beforeClick: that.beforeclick_fun
                            , onCheck: function (e, treeId, treeNode) {
                                if (!that.isMultSel && treeNode.Sel == 1) {
                                    that.sureBtnClick();
                                }
                                else if (that.isMultSel) {
                                    if (treeNode.Sel == 1) {
                                        that.getCheckedValues(treeNode.ID, treeNode.checked);
                                    }
                                    else {
                                        var nodes = that.zTree_fun.getCheckedNodes(treeNode.checked);
                                        if (nodes == null || nodes == [] || nodes == "[]") { return; }
                                        for (var i = 0, l = nodes.length; i < l; i++) {
                                            if (nodes[i].Sel == 1) {
                                                that.getCheckedValues(nodes[i].ID, treeNode.checked);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                };
                if (url != "") {
                    $.ajax({ url: url, async: false, type: 'post', dataType: "json", headers: { token: checkToken },
                        success: function (vData) {
                            //vData = eval('({"obj":{"data":[{"ID":"org-0000","pID":"org0","Name":"宇易通科技有限公司0","Type":0,"Sel":0},{"ID":"org-1111","pID":"org-0000","Name":"上海办1","Type":0,"Sel":0},{"ID":"org-1112","pID":"org-1111","Name":"浦东区3","Type":0,"Sel":0},{"ID":"org-11121","pID":"org-1112","Name":"浦5","Type":0,"Sel":0},{"ID":"org-1113","pID":"org-1112","Name":"车6","Type":1,"Sel":1},{"ID":"org-2221","pID":"org-0000","Name":"北京办2","Type":0,"Sel":0},{"ID":"org-2222","pID":"org-2221","Name":"海淀区4","Type":0,"Sel":0},{"ID":"org-2223","pID":"org-2222","Name":"车7","Type":1,"Sel":1},{"ID":"org-2224","pID":"org-2222","Name":"车8","Type":1,"Sel":1}]},"error":"","url":""})');
                            if (!back_Check(vData.error)) { return; }
                            if (vData.obj.data == null || vData.obj.data == []) { return; }
                            var selData = [];
                            for (var n = 0, x = vData.obj.data.length; n < x; n++) {
                                if (typeof vData.obj.data[n].Type == "undefined") {
                                    selData.push({
                                        ID: vData.obj.data[n].ID
                                        , pID: vData.obj.data[n].pID
                                        , Name: vData.obj.data[n].Name
                                        , Sel: vData.obj.data[n].Sel
                                        , Type: vData.obj.data[n].Type
                                    });
                                }
                                else {
                                    selData.push({
                                        ID: vData.obj.data[n].ID
                                        , pID: vData.obj.data[n].pID
                                        , Name: vData.obj.data[n].Name
                                        , Sel: vData.obj.data[n].Sel
                                        , Type: vData.obj.data[n].Type
                                        , isParent: (vData.obj.data[n].Type == 0 ? true : false)
                                    });
                                }
                            }
                            that.data = selData;
                        }
                    });
                }
                that.multSelLoading = true;
                var $input = $("#" + inputID);
                if ($input) {
                    $input
                    .bind('paste', function () {
                        setTimeout(function () {
                            that.searchSel_reload(that);
                        }, 100);
                    })
                    .bind('click', function () {
                        //if (!that.searched || $input.val().indexOf("已选择") > -1) {
                        //if (!that.searched) {
                       // $input.val('');
                        //}
                        that.showSelDIv();
                    })
                    .bind("keydown", function () {
                        that.IsOverDiv = false;
                    })
                    .bind('propertychange', function (event) {
                        if (that.IsOverDiv) { return; }
                        e = event || window.event;
                        if (e.keyCode == 9 || e.keyCode == 16) {
                            return;
                        }
                        that.searchSel_reload(that);
                        if (e.keyCode == 13) { //回车键的键值为13   
                            that.sureBtnClick();
                        }
                    })
                    .bind('input', function (event) {
                        e = event || window.event;
                        if (e.keyCode == 9 || e.keyCode == 16) {
                            return;
                        }
                        that.searchSel_reload(that);
                        if (e.keyCode == 13) { //回车键的键值为13   
                            that.sureBtnClick();
                        }
                    });
                }
                var val = txt == "" ? "请选择" : txt;
                //var val = "请输入或选择";
                $input.val(val);
                $input.each(function () {//使用data方法存储数据
                    $(this).data("txt", val);
                }).focus(function () {// 获得焦点时判断域内的值是否和默认值相同，如果相同则清空
                    if ($.trim($(this).val()) === $(this).data("txt")) {
                        $(this).val("");
                    }
                }).blur(function () { // 添加blur时间来恢复默认值
                    if ($.trim($(this).val()) === "") {
                        $(this).val($(this).data("txt"));
                        $(this).next().val("0");
                        that.selectIDs = "0";
                    }
                });
                if (isMult && that.selectIDs != "") {
                    $input.val("已选择：" + that.selectIDs.split(',').length);
                }
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.js的InitSelect", ex);
        }
    };
    //在节点进行勾选等操作的时候   对结果进行操作
    this.getCheckedValues = function (value, op) {
        if (op) {//add
            var sel = that.selectIDs.split(',');
            var ids = [];
            var exists = false;
            for (var i = 0, l = sel.length; i < l; i++) {
                if (!exists) {
                    if (sel[i] != value && sel[i] != "") {
                        exists = false;
                    }
                    else if (sel[i] != "" && sel[i] == value) {
                        exists = true;
                    }
                }
                if (sel[i] != "") {
                    ids.push(sel[i]);
                }
            }
            if (!exists) {
                ids.push(value);
            }
            that.selectIDs = ids.join(',');
        }
        else { //delete
            var sel = that.selectIDs.split(',');
            var ids = [];
            for (var i = 0, l = sel.length; i < l; i++) {
                if (sel[i] == value) {
                    sel.splice(i, 1);
                    break;
                }
            }
            for (var i = 0, l = sel.length; i < l; i++) {
                if (sel[i] != "") {
                    ids.push(sel[i]);
                }
            }
            that.selectIDs = ids.join(',');
        }
    };
    /*
    *   显示选择层
    */
    this.showSelDIv = function () {
        try {
            if (that.isDIvShow) {
                if (that.searched) {
                    that.searchSel_reload(that);
                    that.searched = false;
                }
                return;
            }
            that.isDIvShow = true;
            if (that.multSelLoading && that.zTree_fun == null) {
                var inputObj = $("#" + that.input);
                inputObj.val('');
                $("#" + that.input + "Div").remove();
                var Offset = inputObj.offset();
                if ($("#" + that.input + "Div").length == 0) {
                    var divObj = document.createElement('div');
                    divObj.style.zIndex = "9999";
                    divObj.id = that.input + "Div";
                    document.body.appendChild(divObj);
                    var $MultSelDiv = $("#" + divObj.id);
                    $MultSelDiv.width(that.width)
                    .height(that.height)
                    .css("position", "absolute")
                    .css("overflow", "hidden")
                    .css("display", "none")
                    .addClass("boxLayer")
                    .html("<div style=' width:200px;height:" + (that.isMultSel ? (that.height - 40) : that.height) + "px; overflow:auto;'><ul id='" + that.input + "selTree' class='ztree'></ul></div>" +
                                (that.isMultSel ? "<div style='width:200px;height:50px;background:#f1f1f1;border-top:1px solid #ddd; overflow:hidden;'>" +
                                "<input type='button' id='" + that.input + "sureBtn' value='确定' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 70px; width:60px' />" +
                    //"<input type='button' id='" + that.input + "cancleSelBtn' value='取消' title='取消选择' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 23px;' />" +
                    //                                "<input type='button' id='" + that.input + "cancleBtn' value='关闭' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 43px;' />" +
                                (that.hideReg == "" ? "" : "<input type='hidden' id='" + that.hideReg + "' />") +
                                "</div>" : "") + "<input type='hidden' id='" + that.hidden + "' value='" + that.selectIDs + "'/>");
                    $.fn.zTree.init($("#" + that.input + "selTree"), that.setting_fun, that.data);
                    that.zTree_fun = $.fn.zTree.getZTreeObj(that.input + "selTree");
                    that.zTree_fun.expandAll(true);
                    $("#" + that.input + "sureBtn").bind("mousedown", function () {
                        that.sureBtnClick();
                    });
                    $("#" + that.input + "cancleBtn").bind("mousedown", function () {
                        that.hideSelDiv();
                    });
                }
            }
            if (that.searched) {
                that.searchSel_reload(that);
                that.searched = false;
            }
            try {
                if (that.zTree_fun.setting.check.chkStyle == "radio") {
                    var selNode = that.zTree_fun.getCheckedNodes();
                    that.zTree_fun.checkNode(selNode[0],false);
                }
                else {
                    that.zTree_fun.checkAllNodes(false);
                }
            }
            catch (ex) { that.zTree_fun.checkAllNodes(false); }
            that.zTree_fun.cancelSelectedNode();
            //that.selectIDs = that.selectIDs == "" ? $("#" + that.hidden).val() : that.selectIDs;
            that.checkSelNodes(that.selectIDs);
            var inputObj = $("#" + that.input);
            var Offset = inputObj.offset();
            var divTop = 0;
            var wwhh = GetPageSize();
            if ((wwhh[3] - (Offset.top - document.documentElement.scrollTop)) < 380) {//下面空间不足
                divTop = Offset.top - that.height - 4;
                if (Offset.top < 380) {//下面空间不足
                    divTop = Offset.top + inputObj.outerHeight() + 3;
                }
            }
            else {
                divTop = Offset.top + inputObj.outerHeight() + 3;
            }
            $("#" + that.input + "Div").css("top", divTop + "px").css("left", (Offset.left) + "px").fadeIn("fast");
            $("body").bind("mouseup", that.bodyUp);
            $("#" + that.input + "Div").unbind("hover");
            $("#" + that.input + "Div").hover(function () { that.IsOverDiv = true; }, function () { that.IsOverDiv = false; });
        }
        catch (ex) {
            catchTheException("MUltSelect.js的showSelDIv", ex);
        }
    };

    this.checkSelNodes = function (IDs) {
        if (IDs != "") {
            var selIds = (IDs + "").split(',');
            for (var i = 0, l = selIds.length; i < l; i++) {
                if (selIds[i] != "") {
                    if (that.isMultSel) {
                        var node = that.zTree_fun.getNodeByParam("ID", selIds[i], null);
                        if (node != null && node != [] && node != "[]") {
                            that.zTree_fun.checkNode(node, true, true);
                        }
                    } else {
                        var node = that.zTree_fun.getNodeByParam("ID", selIds[i], null);
                        if (node != null && node != [] && node != "[]") {
                            that.zTree_fun.checkNode(node, true);
                        }
                    }
                }
            }
        }
    };

    this.bodyUp = function (event) {
        try {
            var e = event || getEvent();
            if (!(e.target.id == that.input || e.target.id == that.input || e.target.id == (that.input + "Div") || $(e.target).parents("#" + that.input + "Div").length > 0)) {
                that.hideSelDiv();
                that.sureBtnClick();
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.bodyUp", ex);
        }
    };

    //重载树的方法-------------------------------------------------------------------------------------------------------------------------------------start
    this.searchSel_reload = function (obj) {
        try {
            clearTimeout(obj.searchTimer);
            that.needShowData = [];
            if (typeof obj.zTree_fun == "undefined" || obj.zTree_fun == null) {
                obj.searched = false;
                return;
            }
            var schVal = $.trim($("#" + obj.input).val());
            if (schVal == "") {
                obj.searched = false;
                $.fn.zTree.init($("#" + that.input + "selTree"), that.setting_fun, that.data);
                that.zTree_fun.expandAll(true);
               // that.checkSelNodes(that.selectIDs);   //当输入值为空时，取消选择
            }
            else {
                if ($("#" + obj.input).data("txt") == $.trim($("#" + obj.input).val())) {
                    return;
                }
                obj.searchTimer = setTimeout(function () {
                    if (obj.value == $.trim($("#" + obj.input).val())) {
                        obj.searched = true;
                        var nodes = [];
                        for (var i = 0, l = that.data.length; i < l; i++) {
                            if (that.data[i].Name.toUpperCase().indexOf(schVal.toUpperCase()) > -1) {
                                nodes.push(that.data[i]);
                            }
                        }
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (l == 1 && nodes[i].Sel == 1) {
                                that.needShowData.push({
                                    ID: nodes[i].ID
                                    , pID: nodes[i].pID
                                    , Name: nodes[i].Name
                                    , Sel: nodes[i].Sel
                                    , Type: nodes[i].Type
                                    , checked: true
                                });
                                that.getCheckedValues(nodes[i].ID, true);
                                //that.selectIDs += nodes[i].ID + ",";
                            }
                            else {
                                that.needShowData.push({
                                    ID: nodes[i].ID
                                    , pID: nodes[i].pID
                                    , Name: nodes[i].Name
                                    , Sel: nodes[i].Sel
                                    , Type: nodes[i].Type
                                });
                            }
                            that.searchParentData(nodes[i].pID);
                            that.searchChildrenData(nodes[i].ID);
                        }
                        $.fn.zTree.init($("#" + that.input + "selTree"), that.setting_fun, that.needShowData);
                        that.zTree_fun.expandAll(true);
                        that.checkSelNodes(that.selectIDs);
                    }
                    else {
                        obj.value = $.trim($("#" + obj.input).val());
                        that.searched = false;
                        obj.searchSel_reload(obj);
                    }
                }, 200);
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.js的searchSel_reload", ex);
        }
    };
    this.needShowData = [];
    this.searchParentData = function (pid) {
        try {
            for (var i = 0, l = that.data.length; i < l; i++) {
                if (that.data[i].ID == pid) {
                    if (!that.chechExistData(that.data[i].ID)) {
                        that.needShowData.push(that.data[i]);
                        that.searchParentData(that.data[i].pID);
                    }
                }
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.js的searchParentData", ex);
        }
    };
    this.searchChildrenData = function (id) {
        try {
            for (var i = 0, l = that.data.length; i < l; i++) {
                if (that.data[i].pID == id) {
                    if (!that.chechExistData(that.data[i].ID)) {
                        that.needShowData.push(that.data[i]);
                        that.searchChildrenData(that.data[i].ID);
                    }
                }
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.js的searchChildrenData", ex);
        }
    };
    this.chechExistData = function (id) {
        try {
            var result = false;
            for (var i = 0, l = that.needShowData.length; i < l; i++) {
                if (that.needShowData[i].ID == id) {
                    result = true;
                    break;
                }
            }
            return result;
        }
        catch (ex) {
            catchTheException("MUltSelect.js的chechExistData", ex);
        }
    };

    //重载树的方法-------------------------------------------------------------------------------------------------------------------------------------end

    /*
    *   输入框内容变化  搜索  目前做了0.1秒延迟判断输入框内容那个有无变化再去搜索
    */
    this.searchSel = function (obj) {
        try {
            clearTimeout(obj.searchTimer);
            if (typeof obj.zTree_fun == "undefined" || obj.zTree_fun == null) {
                return;
                that.searched = false;
            }
            // if (that.selectNames == $.trim($("#" + obj.input).val())) { return; }
            //此处区分单选和多选   为在输入框中搜索做处理
            if ($.trim($("#" + obj.input).val()) == "") {
                that.searched = false;
                obj.zTree_fun.cancelSelectedNode();
                $("#" + that.input + "Div .curSelectedNode").removeClass("curSelectedNode");
                //obj.zTree_fun.checkAllNodes(false);
                if (!obj.isMultSel) {
                    var node = obj.zTree_fun.getCheckedNodes();
                    if (node == null || node == [] || node.length == 0) { return; }
                    obj.zTree_fun.checkNode(node[0], false);
                }
                return;
            }
            if ($("#" + obj.input).data("txt") == $.trim($("#" + obj.input).val())) {
                return;
            }
            obj.searchTimer = setTimeout(function () {
                if (obj.value == $.trim($("#" + obj.input).val())) {
                    try {
                        if (that.searched) return;
                        obj.zTree_fun.cancelSelectedNode();
                        $("#" + that.input + "Div .curSelectedNode").removeClass("curSelectedNode");
                        //obj.zTree_fun.checkAllNodes(false);
                        var name = $.trim($("#" + obj.input).val());
                        if (name == "") { return; }
                        var nodes = obj.zTree_fun.getNodesByParamFuzzy("Name", name, null);
                        if (nodes == null || nodes == []) { return; }
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (i == nodes.length - 1) {
                                obj.zTree_fun.selectNode(nodes[i], true);
                            }
                            if (nodes.length == 1) {
                                if (obj.isMultSel) {
                                    obj.zTree_fun.checkNode(nodes[i], true, true);
                                }
                                else {
                                    obj.zTree_fun.checkNode(nodes[i], true);
                                }
                            }
                            $("#" + nodes[i].tId + "_a").addClass("curSelectedNode");
                            var pNode;
                            var currentNode = nodes[i];
                            while (true) {
                                pNode = currentNode.getParentNode();
                                if (pNode == null) { break; }
                                else {
                                    if (!pNode.open) { obj.zTree_fun.expandNode(pNode, true); }
                                    currentNode = pNode;
                                }
                            }
                        }
                        $("#" + obj.input).focus();
                        that.searched = true;
                    }
                    catch (ex) { }
                } else {
                    obj.value = $.trim($("#" + obj.input).val());
                    obj.searchSel(obj);
                    that.searched = false;
                }
            }, 100);
        }
        catch (ex) {
            catchTheException("MUltSelect.js的searchSel", ex);
        }
    };
    /*
    *   隐藏选择层
    */
    this.hideSelDiv = function () {
        try {
            if (this.isMultSel) {//多选
                if (this.selectIDs != "") {
                    var l = this.selectIDs.split(',');
                    var ll = 0;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i] != "") {
                            ll++;
                        }
                    }
                    if (ll > 0) {
                        $("#" + this.input).val("已选择：" + ll);
                        that.selectNames = "已选择：" + ll;
                    }
                    else {
                        $("#" + this.input).val(this.inputTxt);
                        that.selectNames = this.inputTxt;
                    }
                }
                else {
                    //可输入时（非只读），不给文本框赋值“请输入或选择”
                    if (that.readonly) {
                        $("#" + this.input).val(this.inputTxt);
                        that.selectNames = this.inputTxt;
                    }
                }
            }
            else {
                if (this.selectIDs != "") {
                    var checkedNode = this.zTree_fun.getCheckedNodes();
                    if (checkedNode != null && checkedNode != [] && checkedNode.length != 0) {
                        $("#" + this.input).val(checkedNode[0].Name);
                        that.selectNames = checkedNode[0].Name;
                    }
                }
            }
            $("#" + that.input + "Div").fadeOut("fast");
            $("body").unbind("mouseup", that.bodyUp);
            that.isDIvShow = false;
        }
        catch (ex) {
            catchTheException("MUltSelect.js的hideSelDiv", ex);
        }
    };

    /*
    *   取消选择
    */
    this.CancleSelDiv = function () {
        try {
            that.zTree_fun.checkAllNodes(false);
            that.selectIDs = "";
            that.selectNames = this.inputTxt;
        }
        catch (ex) {
            catchTheException("MUltSelect.js的CancleSelDiv", ex);
        }
    };
    /*
    *   确定点击
    */
    this.sureBtnClick = function () {
        try {
            if (that.zTree_fun == null) { return; }
            //that.selectIDs = "";
            var selectName = "";
            if (this.isMultSel) {//多选
                //                var checkedNode = that.zTree_fun.getCheckedNodes();
                //                if (checkedNode == null || checkedNode == [] || checkedNode.length < 1) { $("#" + that.input).val(that.inputTxt); checkedNode = []; }
                //                for (var i = 0, l = checkedNode.length; i < l; i++) {
                //                    //                    if (!checkedNode[i].isParent && checkedNode[i].pid != -1 && ("," + this.selectIDs).indexOf(checkedNode[i].ID) < 0) {
                //                    if (checkedNode[i].Sel == 1 && ("," + that.selectIDs + ",").indexOf("," + checkedNode[i].ID + ",") < 0) {
                //                        that.selectIDs += checkedNode[i].ID + ",";
                //                        selectName += checkedNode[i].Name + ",";
                //                    }
                //                }
                //                that.searched = false;
                //                $.fn.zTree.init($("#" + that.input + "selTree"), that.setting_fun, that.data);
                //                that.zTree_fun.expandAll(true);
                //                that.checkSelNodes(that.selectIDs);
                if (that.selectIDs != "") {
                    var l = that.selectIDs.split(',');
                    var ll = 0;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i] != "") {
                            for (var k = 0, m = that.data.length; k < m; k++) {
                                if (l[i] == that.data[k].ID) {
                                    selectName += that.data[k].Name + ",";
                                    break;
                                }
                            }
                            ll++;
                        }
                    }
                    if (ll > 0) {
                        $("#" + that.input).val("已选择：" + ll);
                        that.selectNames = "已选择：" + ll;
                    }
                    else {
                        $("#" + that.input).val(that.inputTxt);
                        that.selectNames = that.inputTxt;
                    }
                }
                else {
                    if (!that.readonly) {//当可输入时，输入的值不清除
                        var inputValue = $.trim($("#" + that.input).val());
                        if (inputValue == "") { $("#" + that.input).val(that.inputTxt); }
                        that.selectNames = inputValue;
                    }
                    else {
                        $("#" + that.input).val(that.inputTxt);
                        that.selectNames = that.inputTxt; 
                    }
                }
            }
            else { //单选
                that.selectIDs = "";
                selectName = "";
                var checkedNode = that.zTree_fun.getCheckedNodes();
                if (checkedNode == null || checkedNode == [] || checkedNode.length < 1) {
                    $("#" + that.input).val(that.inputTxt);
                    $("#" + that.hidden).val(that.selectIDs);
                    return;
                }
                if (checkedNode[0].Sel == 1) {
                    that.selectIDs += checkedNode[0].ID;
                    selectName += checkedNode[0].Name;
                }
                if (selectName != "") {
                    $("#" + that.input).val(selectName);
                    that.selectNames = selectName;
                }
                else {
                    if (!that.readonly) {//当可输入时，输入的值不清除
                        var inputValue = $.trim($("#" + that.input).val());
                        if (inputValue == "") { $("#" + that.input).val(that.inputTxt); }
                        that.selectNames = inputValue;
                    }
                    else {
                        $("#" + that.input).val(that.inputTxt);
                        that.selectNames = that.inputTxt;
                    }
                }
            }
            that.hideSelDiv();
            var outIDs = [];
            var outNames = [];
            var ids = that.selectIDs.split(',');
            for (var i = 0, l = ids.length; i < l; i++) {
                if (ids[i] != "") {
                    outIDs.push(ids[i]);
                }
            }
            var name = selectName.split(',');
            for (var i = 0, l = name.length; i < l; i++) {
                if (name[i] != "") {
                    outNames.push(name[i]);
                }
            }
            $("#" + that.hidden).val(outIDs.join(','));
            if (that.hideReg != "") {
                $("#" + that.hideReg).val(outNames.join(','));
            }
            if (typeof that.sureCallBack != "undefined" && that.sureCallBack != null && that.sureCallBack != "") {
                eval("this.sureCallBack(outIDs,outNames)");
            }
        }
        catch (ex) {
            catchTheException("MUltSelect.js的sureBtnClick", ex);
        }
    };
    this.beforeclick_fun = function (treeId, treeNode, clickFlag) {
        try {
            return treeNode.Sel == 1;
        }
        catch (ex) {
            catchTheException("MUltSelect.js的beforeclick_fun", ex);
        }
    };
    //转换为大写
    this.toLocaleUpperCase = function (textBox) {
        try {
            var str = $("#" + textBox).val();
            $("#" + textBox).val(str.toUpperCase());
        }
        catch (ex) {
            catchTheException("MUltSelect.js的beforeclick_fun", ex);
        }
    };
    //同时兼容火狐和IE下得到event事件
    this.getEvent = function () {
        try {
            if (document.all) { return window.event; }
            func = getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
                     || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        }
        catch (ex) {
            catchTheException("MUltSelect.js的beforeclick_fun", ex);
        }
    };
    //销毁
    this.destroy = function () {
        try {
            $("#" + this.input + "Div").remove();
            //$("body").unbind("mousedown");
            this.data = null;
            this.multSelLoading = false;
            this.sureCallBack = null; //确定之后回调函数
            this.input = "";
            this.hidden = "";
            this.hideReg = "";
            this.zTree_fun = null;
            this.setting_fun = null;
            this.isDIvShow = false;
            this.selectIDs = "";
            this.isMultSel = true;
            this.inputTxt = "";
        }
        catch (ex) {
            catchTheException("MUltSelect.js的beforeclick_fun", ex);
        }
    };
};