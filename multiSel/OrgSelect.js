/***********************************************************************
*   多选/单选JS文件
*   lt  2013-7-3 9:58:23   
*   InitSelect("车辆多选","../../OdometerCollect/GetCarsData",'carsel','selHidden','',null,true);
*   如果指定了 callback 函数   将返回两个参数  id 串和 name 串
*   如果没有指定 callback 函数   获取 id 串和 name 串 方法是通过隐藏域 hiddenID ，hideNameId 获取
*************************************************************************/
function OrgSelect() {
    var that = this;
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
    this.InitSelect = function (txt, url, inputID, hiddenID, hideNameId, callBack, isMult, height, width) {
        try {
            var that = this;
            this.inputTxt = txt;
            this.input = inputID;
            this.hidden = hiddenID;
            this.hideReg = hideNameId;
            this.height = height || 350;
            this.width = width || 200;
            this.isMultSel = typeof isMult == "undefined" ? this.isMultSel : isMult;
            if (typeof callBack != "undefined" && callBack != "" && callBack != null) {
                this.sureCallBack = callBack;
            }
            if (!that.multSelLoading) {
                $.ajax({ url: url, async: false, type: 'post', dataType: "json", headers: { token: checkToken },
                    success: function (vData) {
                        that.setting_fun = {
                            check: {
                                enable: that.isMultSel,
                                chkboxType: { "Y": "", "N": "" }
                            }
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
                                    that.zTree_fun.checkNode(treeNode, treeNode.checked ? false : true);
                                }
                                else {
                                    that.sureBtnClick();
                                }
                            }
                            , beforeClick: that.beforeclick_fun
                        }
                        };
                        if (!back_Check(vData.error)) { return; }
                        if (vData.obj.data == null || vData.obj.data == []) { return; }
                        var selData = [];
                        for (var n = 0; n < vData.obj.data.length; n++) {
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
                        that.multSelLoading = true;
                    }
                });
                var $input = $("#" + inputID);
                if ($input) {
                    $input.bind('focus', function () {
                        that.showSelDIv();
                    })
                .bind('click', function () {
                    that.showSelDIv();
                }).bind('keyup', function () {
                    that.searchSel(that);
                });
                    //                .bind('change', function () {
                    //                    that.zTree_fun.cancelSelectedNode();
                    //                    //that.zTree_fun.checkAllNodes(false);
                    //                    var name = $.trim($("#" + that.input).val());
                    //                    if (name == "") { return; }
                    //                    var nodes = that.zTree_fun.getNodesByParamFuzzy("Name", name, null);
                    //                    if (nodes == null || nodes == []) { return; }
                    //                    for (var i = 0; i < nodes.length; i++) {
                    //                        that.zTree_fun.selectNode(nodes[i], true);
                    //                        var pNode;
                    //                        var currentNode = nodes[i];
                    //                        while (true) {
                    //                            pNode = currentNode.getParentNode();
                    //                            if (pNode == null) { break; }
                    //                            else {
                    //                                if (!pNode.open) { that.zTree_fun.expandNode(pNode, true); }
                    //                                currentNode = pNode;
                    //                            }
                    //                        }
                    //                    }
                    //                    $("#" + that.input).focus();
                    //                });
                }
                var val = txt == "" ? "请选择" : txt;
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
                    }
                });
            }
        }
        catch (ex) {
            catchTheException("OrgSelect.js的InitSelect", ex);
        }
    };
    /*
    *   显示选择层
    */
    this.showSelDIv = function () {
        try {
            if (this.isDIvShow) return;
            this.isDIvShow = true;
            var inputObj = $("#" + this.input);
            var Offset = inputObj.offset();
            if ($("#" + this.input + "Div").length == 0) {
                var divObj = document.createElement('div');
                divObj.style.zIndex = "9999";
                divObj.id = this.input + "Div";
                document.body.appendChild(divObj);
                var $MultSelDiv = $("#" + divObj.id);
                $MultSelDiv.width(this.width)
                    .height(this.height)
                    .css("position", "absolute")
                //                    .css("background", "#f1f6fa")
                //                    .css("border", "1px solid #92b6cb")
                    .css("overflow", "hidden")
                    .css("display", "none")
                    .addClass("boxLayer")
                    .html("<div style=' width:200px;height:" + (that.isMultSel ? (this.height - 40) : this.height) + "px; overflow:auto;'><ul id='" + that.input + "selTree' class='ztree'></ul></div>" +
                                (that.isMultSel ? "<div style='width:200px;height:50px;background:#f1f1f1;border-top:1px solid #ddd; overflow:hidden;'>" +
                                "<input type='button' id='" + that.input + "sureBtn' value='确定' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 43px;' />" +
                //"<input type='button' id='" + that.input + "cancleSelBtn' value='取消' title='取消选择' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 23px;' />" +
                                "<input type='button' id='" + that.input + "cancleBtn' value='关闭' class='buttonCom' onmouseover=\"this.className='buttonComOver'\" onmouseout=\"this.className='buttonCom'\" style='margin:10px 0px 10px 43px;' />" +
                                (that.hideReg == "" ? "" : "<input type='hidden' id='" + that.hideReg + "' />") +
                                "</div>" : "") + "<input type='hidden' id='" + that.hidden + "' value=" + this.selectIDs + "/>");
                $.fn.zTree.init($("#" + that.input + "selTree"), that.setting_fun, that.data);
                that.zTree_fun = $.fn.zTree.getZTreeObj(that.input + "selTree");
                that.zTree_fun.expandAll(true);
                $("#" + that.input + "sureBtn").bind("mousedown", function () {
                    that.sureBtnClick();
                });
                $("#" + that.input + "cancleBtn").bind("mousedown", function () {
                    that.hideSelDiv();
                });
                $("#" + that.input + "cancleSelBtn").bind("mousedown", function () {
                    that.CancleSelDiv();
                });
            }
            that.zTree_fun.checkAllNodes(false);
            that.zTree_fun.cancelSelectedNode();
            if (that.selectIDs != "") {
                var selIds = that.selectIDs.split(',');
                for (var i = 0; i < selIds.length; i++) {
                    if (selIds[i] != "") {
                        if (that.isMultSel) {
                            that.zTree_fun.checkNode(that.zTree_fun.getNodeByParam("ID", selIds[i], null), true, true);
                        } else {
                            that.zTree_fun.selectNode(that.zTree_fun.getNodeByParam("ID", selIds[i], null), true);
                        }
                    }
                }
            }
            var divTop = 0;
            var wwhh = GetPageSize();
            if ((wwhh[3] - (Offset.top - document.documentElement.scrollTop)) < 380) {//下面空间不足
                divTop = Offset.top - this.height - 4;
                if (Offset.top < 380) {//下面空间不足
                    divTop = Offset.top + inputObj.outerHeight() + 3;
                }
            }
            else {
                divTop = Offset.top + inputObj.outerHeight() + 3;
            }
            $("#" + this.input + "Div").css("top", divTop + "px").css("left", (Offset.left) + "px").fadeIn("fast");
            $("body").bind("mouseup", that.bodyUp);
        }
        catch (ex) {
            catchTheException("MUltSelect.js的showSelDIv", ex);
        }
    };
    this.bodyUp = function (event) {
        var e = event || getEvent();
        if (!(e.target.id == that.input || e.target.id == that.input || e.target.id == (that.input + "Div") || $(e.target).parents("#" + that.input + "Div").length > 0)) {
            that.hideSelDiv();
            that.sureBtnClick();
        }
    };
    /*
    *   输入框内容变化  搜索  目前做了0.4秒延迟判断输入框内容那个有无变化再去搜索
    */
    this.searchSel = function (obj) {
        try {
            clearTimeout(obj.searchTimer);
            //此处区分单选和多选   为在输入框中搜索做处理
            if (!obj.isMultSel && $.trim($("#" + obj.input).val()) == "") {
                obj.selectIDs = "";
                $("#" + obj.hidden).val("");
                if (obj.hideReg != "") {
                    $("#" + obj.hideReg).val("");
                }
                obj.zTree_fun.cancelSelectedNode();
                return;
            }
            obj.searchTimer = setTimeout(function () {
                if (obj.value == $.trim($("#" + obj.input).val())) {
                    try {
                        obj.zTree_fun.cancelSelectedNode();
                        var name = $.trim($("#" + obj.input).val());
                        if (name == "") { return; }
                        $("#" + that.input + "Div .curSelectedNode").removeClass("curSelectedNode");
                        var nodes = obj.zTree_fun.getNodesByParamFuzzy("Name", name, null);
                        if (nodes == null || nodes == []) { return; }
                        for (var i = 0; i < nodes.length; i++) {
                            $("#" + nodes[i].tId + "_a").addClass("curSelectedNode");
                            if (i == nodes.length - 1) {
                                obj.zTree_fun.selectNode(nodes[i], true);
                            }
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
                    }
                    catch (ex) { }
                } else {
                    obj.value = $.trim($("#" + obj.input).val());
                    obj.searchSel(obj);
                }
            }, 400);
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
            var that = this;
            $("#" + that.input + "Div").fadeOut("fast");
            $("body").unbind("mouseup", that.bodyUp);
            that.isDIvShow = false;
        }
        catch (ex) {
            catchTheException("OrgSelect.js的hideSelDiv", ex);
        }
    };

    /*
    *   取消选择
    */
    this.CancleSelDiv = function () {
        try {
            that.zTree_fun.checkAllNodes(false);
            that.selectIDs = "";
        }
        catch (ex) {
            catchTheException("OrgSelect.js的CancleSelDiv", ex);
        }
    };
    /*
    *   确定点击
    */
    this.sureBtnClick = function () {
        try {
            var that = this;
            if (this.zTree_fun == null) { return; }
            this.selectIDs = "";
            var selectName = "";
            if (this.isMultSel) {//多选
                var checkedNode = this.zTree_fun.getCheckedNodes();
                if (checkedNode == null || checkedNode == [] || checkedNode.length < 1) { $("#" + this.input).val(this.inputTxt); checkedNode = []; }
                for (var i = 0; i < checkedNode.length; i++) {
                    if (checkedNode[i].pid != -1 && ("," + this.selectIDs).indexOf(checkedNode[i].ID) < 0) {
                        this.selectIDs += checkedNode[i].ID + ",";
                        selectName += checkedNode[i].Name + ",";
                    }
                }
                if (this.selectIDs != "") {
                    var l = this.selectIDs.split(',').length;
                    if (l > 1) {
                        $("#" + this.input).val("已选择：" + (l - 1));
                    }
                    else {
                        $("#" + this.input).val(this.inputTxt);
                    }
                }
                else {
                    $("#" + this.input).val(this.inputTxt);
                }
            }
            else { //单选
                var checkedNode = this.zTree_fun.getSelectedNodes();
                if (checkedNode == null || checkedNode == [] || checkedNode.length < 1) { return; }
                if (checkedNode[0].Sel == 1) {
                    this.selectIDs += checkedNode[0].ID;
                    selectName += checkedNode[0].Name;
                }
                //if (inputTxt == "") {
                $("#" + this.input).val(selectName);
                //}
            }
            $("#" + this.hidden).val(that.selectIDs);
            if (this.hideReg != "") {
                $("#" + this.hideReg).val(selectName);
            }
            this.hideSelDiv();
            var ids = this.selectIDs.split(',');
            var name = selectName.split(',');
            if (typeof this.sureCallBack != "undefined" && this.sureCallBack != null && this.sureCallBack != "") {
                eval("this.sureCallBack(ids,name)");
            }
        }
        catch (ex) {
            catchTheException("OrgSelect.js的sureBtnClick", ex);
        }
    };
    this.beforeclick_fun = function (treeId, treeNode, clickFlag) {
        try {
            return treeNode.Sel == 1;
        }
        catch (ex) {
            catchTheException("OrgSelect.js的beforeclick_fun", ex);
        }
    };
    //转换为大写
    this.toLocaleUpperCase = function (textBox) {
        try {
            var str = $("#" + textBox).val();
            $("#" + textBox).val(str.toUpperCase());
        }
        catch (ex) {
            catchTheException("OrgSelect.js的toLocaleUpperCase", ex);
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
            catchTheException("OrgSelect.js的getEvent", ex);
        }
    };
};