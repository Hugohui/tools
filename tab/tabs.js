/**
*  mac.core 1.2
*/
var mac = { Msg: Msg || {} };
if (jQuery) (function () {
    $.extend($.fn, {
        mac: function () {
            var func = arguments[0];
            arguments[0] = this;
            return eval('mac.' + func).apply(this, arguments);
        },
        seek: function (name) {
            return $(this).find('[name=' + name + ']');
        }
    });
})(jQuery);
mac.getMousePos = function (e) {
    var e = e || window.event, d = document
		, de = d.documentElement, db = d.body;
    return {
        x: e.pageX || (e.clientX + (de.scrollLeft || db.scrollLeft)),
        y: e.pageY || (e.clientY + (de.scrollTop || db.scrollTop))
    }
}
mac.eval = function (str) {
    return str ? eval('(' + str + ')') : {};
};
mac.getMsg = function (msg, params) {
    if (params && params.length)
        for (var i = 0; i < params.length; i++)
            msg = msg.replace('{' + i + '}', params[i]);
    return msg;
};

/*
* name: MagicTabs
* author: Mac_J
* version: 1.3.2
* note: need core.js
*/
mac.tabs = function (self, cfg) {
    cfg = self.config = $.extend({
        speed: 6,
        tabHeight: 30,
        hbarHeight: 2
    }, cfg);
    var th = cfg.tabHeight;
    var bh = th + cfg.hbarHeight;
    var hx = $('<div class="sbtn"><span></span></div>');
    var hm = $('<div class="main"></div>').height(th);
    var ht = $('<div class="tt"></div>').height(th);
    hx.width(th).height(th);
    var hb = $('<div class="hbar"></div>');
    hb.height(cfg.hbarHeight).css('top', th);
    var hd = $('<div class="head"></div>').height(th);
    self.append(hb).append(hd);
    var hl = hx.clone().addClass('left'), hr = hx.clone().addClass('right');
    hd.append(hl).append(hm.append(ht)).append(hr);
    var bd = $('<div class="body"></div>').appendTo(self);
    //bd.css('height', "auto");
    self.adjust = function () {
        var maxHeight = 0;
        //var sw = self.width(), sh = self.height(), h = sh - hd.height();
        bd.children('.main').each(function (n, c) {
            var ec = $(c);
            //, x = ec.attr('height');
            //            if (x) {
            //                if (x == 'auto') {
            //                    ec.css('height', null);
            //                } else
            if (ec.css("visibility") != "hidden") {
                ec.css('height', "auto");
            }
            //            } else {
            //                ec.height(bd.height());
            //            }
            maxHeight = ec.height() > maxHeight ? ec.height() : maxHeight;
        })
        bd.css('height', 'auto');
        hm.width(hd.width());
        //$("#aaaaaaa").val("hd=" + hd.width() + "    ht=" + ht.width() + "    hm=" + hm.width());
        if (hd.width()) {
            var b = hd.width() <= ht.width();
            hl.toggle(b);
            hr.toggle(b);
            hm.width(hd.width() - (b ? hl.width() * 2 : 0));
        }
    }
    function closeTab(a, b, c) {
        if (!a.hasClass('closeable'))
            return;
        c = c || a.attr('name');
        b = b || bd.children('[name=' + c + ']');
        if (cfg.onCloseTab && !cfg.onCloseTab(self, c, a))
            return false;
        var s = a.next('.item');
        if (s.length != 1)
            s = a.prev('.item');
        var t = self.selected, t = (t ? t.attr('name') : '');
        if (c == t && s.length == 1)
            s.click();
        a.hide();
        b.hide();
        window.setTimeout(function () {
            a.remove();
            b.remove();
            if (cfg.onTabClosed)
                cfg.onTabClosed(self, c, a);
        }, 0);
        self.adjust();
    }
    self.closeTab = function (c, a) {
        a = a || hd.seek(c);
        closeTab(a, 0, c);
    }
    self.closeTabs = function (x) {
        hd.find('.item').each(function (n, a) {
            var o = $(a), c = o.attr('name');
            if (c != x)
                closeTab(o);
        });
    }
    self.closeCurTab = function () {
        var t = self.selected;
        closeTab(t);
    }
    self.getCurTab = function () {
       return self.selected;
    }
    self.CloseTab = function (x) {
        closeTab(x);
    }
    self.closeTabsExcept = function () {
        var t = self.selected, t = (t ? t.attr('name') : '');
        hd.find('.item').each(function (n, a) {
            var o = $(a), c = o.attr('name');
            if (c != t)
                closeTab(o);
        });
    }
    self.addTab = function (p, n, cb) {
        var k = p.code || 'm' + n;
        var a = hd.seek(k), b;
        if (p.update && a.length > 0) {
            self.select(k);
            b = bd.children('[name=' + k + ']');
            b.empty();
        } else {
            a = $('<div class="item normal" name="' + k + '"></div>');
            if (p.el.indexOf("<object classid") >= 0) {
                b = $('<div class="main" name="' + k + '"></div>');
            }
            else {
                b = $('<div class="main hidden" name="' + k + '"></div>');
            }
            if (p.bodyCls)
                b.addClass(p.bodyCls);
            if (p.height)
                b.attr('height', p.height);
            ht.append(a.height(th));
            self.adjust();
            var m = $('<div class="main"></div>');
            m.append(p.title);
            var bw = 0; // xbtn width
            a.append('<div class="left"></div>').append(m);
            if (p.closeable) {
                var x = $('<span class="icon icon-close"></span>');
                var w = $('<div class="xbtn"></div>').append(x);
                x.click(function () {
                    closeTab(a, b, k);
                    return false;
                });
                a.addClass('closeable').append(w);
                bw = x.width();
            }
            if (cfg.tabWidth)
                m.width(cfg.tabWidth - bw);
            a.append('<div class="right"></div>');
            bd.append(b);
        }
        a.unbind('click');
        a.click(function () {
            var s = self.selected;
            if (s) {
                s.removeClass("selected");
                if (bd.children('[name=' + s.attr('name') + ']').find("object").length > 0) {
                    bd.children('[name=' + s.attr('name') + ']')[0].style.visibility = "hidden";
                    bd.children('[name=' + s.attr('name') + ']')[0].style.height = 0;
                    bd.children('[name=' + s.attr('name') + ']')[0].style.width = 0;
                }
                else {
                    bd.children('[name=' + s.attr('name') + ']').hide();
                }
            }
            self.selected = a.addClass("selected");
            if (p.url && !b.html() && !p.autoLoad) {
                b.load(p.url, p.params, function () {
                    if (cfg.onLoadPage)
                        cfg.onLoadPage(self, a, b, p);
                });
            }
            var h = b.attr('height');
            if (!h) {
                bd.height(self.height() - hd.height() - 4);
            } else if (h == 'auto') {
                bd.css('height', h);
            } else {
                bd.css('overflow', 'hidden');
                bd.height(h);
            }
            if (b.find("object").length > 0) {
                b[0].style.visibility = "visible";
                b[0].style.width = "100%";
            }
            else {
                b.show();
            }
            if (cfg.onShowTab)
                cfg.onShowTab(self, a, b, p);
            bd.css('height', "auto");
            //为报表页面控制页面内容大小调用方法
            PageResize();
        });
        if (p.el) {
            b.append(p.el)
        } else if (p.url && p.autoLoad) {
            b.load(p.url, p.params, function () {
                if (cfg.onLoadPage)
                    cfg.onLoadPage(self, a, b, p);
            });
        }
        if (cb)
            cb(a, b, p);
        self.adjust();
        self.scroll(a);
        return a;
    }
    $.each(cfg.items, function (n, p) {
        self.addTab(p, n);
    });
    self.hscroll = function () {
        var s = cfg.speed * ($(this).hasClass('left') ? -1 : 1);
        $(document).mouseup(function () {
            var t = self.timer;
            if (t)
                window.clearInterval(t);
        });
        self.timer = window.setInterval(function () {
            var l = hm.scrollLeft();
            hm.scrollLeft(l + s);
        }, 20);
        return self.timer;
    };
    hl.mousedown(self.hscroll);
    hr.mousedown(self.hscroll);
    self.adjust();
    self.scroll = function (a) {
        if (a.length == 0) return self;
        var al = a.position().left;
        var pl = hm.position().left;
        if (al < pl || al + a.width() > pl + hm.width())
            hm.scrollLeft(hm.scrollLeft() + al - pl);
        return self;
    }
    function select(a, c) {
        a.click();
        self.scroll(a);
        return a;
    }
    self.selectFirst = function () {
        var a = hd.find('.item:first');
        return select(a, a.attr('name'));
    }
    self.select = function (c) {
        return select(hd.seek(c), c);
    }
    return self;
}


var Msg = {
    status: "Status",
    code: "Code",
    name: "Name",
    type: "Type",
    desc: "Description",
    date: "Date",
    startDate: "Start date",
    endDate: "End date",
    ok: "Confirm",
    submit: "Submit",
    yes: "Yes",
    no: "No",
    save: "Save",
    next: "Next",
    add: "Add",
    del: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    close: "Close",
    view: "View",
    keyword: "Keyword",
    find: "Find",
    start: "Start",
    query: "Query",
    action: "Actions",
    year: 'Year',
    month: "Month",
    day: "Day",
    loading: "Loading...",
    load: "Load",
    send: "Send",
    weekDay: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    title: "Title",
    skip: "Skip",
    skipAll: "Skip All",
    saved: "Saved",
    prev: "Previous",
    agree: "Agree",
    url: "Url",
    content: "Content",
    saving: 'saving',
    lowDel: 'delete',
    lowAdd: 'add',
    lowSave: "save",
    lowChange: "change",
    count: "Count",
    stop: "Stop",
    key: "Key"
};
Msg.login = {
    code: "Username",
    password: "Password",
    input: "Please enter login name.",
    title: "User login",
    submit: "Login",
    error: "Login name or password is incorrect.",
    lp: "Please enter password.",
    verifyCodeError: 'Verify code error.',
    verifyCodeEmpty: 'Please enter verify code.',
    changeVerifyCode: 'Change verify code.'
};
Msg.pager = {
    page: "{0}, {1}/{2}",
    go: "go to",
    needPageno: "Please enter valid page number.",
    total: 'Total:'
};
Msg.confirm = {
    message: "Are you sure you want to {0}?",
    start: "Do you want to start the {0} now ?",
    alsoCreate: "Do you want to also create {0} ?"
};
Msg.info = {
    waiting: "{0}，please wait...",
    select: "Please select the record you want to {0}!",
    success: "{0} success!",
    fail: "{0} failed!",
    error: "{0} failed! Error: {1}",
    notExist: "{0} is invalid"
};
Msg.error = {
    noResponse: "Server no response.",
    unknown: "{0} failed, unknown error.",
    inUse: "{0} failed! {1} has already been used.",
    needParam: "{0} failed! Missing parameter: {1}.",
    invalidParam: "{0} failed! wrong parameter.",
    notFound: "{0} failed! {1} not found.",
    unauth: 'Unauthorized!'
};
Msg.valid = {
    required: "{0} is required.",
    length: "{0} failed! Error: {1} too long ",
    check: "Input validate",
    formatError: "{0} failed! {1} is invalid.",
    justNumber: "{0} must be nubmer!",
    mustGT: "{0} endDate must great than startDate!",
    inputUrlformatError: "{0} input URL Do not meet specifications",
    newPwd2: 'Two password is diffrent',
    error: "{0} is error or required .",
    exist: "{0} has existed !"
};
Msg.picker = {
    needed: "Please select one of the {0}"
};
Msg.region = {
    picker: 'Region picker',
    region: 'Region',
    allRegions: 'All Regions',
    add: 'Add Region',
    edit: 'Edit Region'
};


/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.4
*
* Requires: 1.2.2+
*/
(function (c) { var a = ["DOMMouseScroll", "mousewheel"]; c.event.special.mousewheel = { setup: function () { if (this.addEventListener) { for (var d = a.length; d; ) { this.addEventListener(a[--d], b, false) } } else { this.onmousewheel = b } }, teardown: function () { if (this.removeEventListener) { for (var d = a.length; d; ) { this.removeEventListener(a[--d], b, false) } } else { this.onmousewheel = null } } }; c.fn.extend({ mousewheel: function (d) { return d ? this.bind("mousewheel", d) : this.trigger("mousewheel") }, unmousewheel: function (d) { return this.unbind("mousewheel", d) } }); function b(i) { var g = i || window.event, f = [].slice.call(arguments, 1), j = 0, h = true, e = 0, d = 0; i = c.event.fix(g); i.type = "mousewheel"; if (i.wheelDelta) { j = i.wheelDelta / 120 } if (i.detail) { j = -i.detail / 3 } d = j; if (g.axis !== undefined && g.axis === g.HORIZONTAL_AXIS) { d = 0; e = -1 * j } if (g.wheelDeltaY !== undefined) { d = g.wheelDeltaY / 120 } if (g.wheelDeltaX !== undefined) { e = -1 * g.wheelDeltaX / 120 } f.unshift(i, j, e, d); return c.event.handle.apply(this, f) } })(jQuery);

/*
*   右键
*/
function RightMenu() {

    if (window.rightMenuStatus) return;
    window.rightMenuStatus = true;

    //    this.backgroundColor = "white";
    //    this.borderTop = "1px solid #969696";
    //    this.borderLeft = "1px solid #969696";
    //    this.borderBottom = "1px solid #969696";
    //    this.borderRight = "1px solid #969696";


    this.backgroundColor = "#fdfdfd";
    this.borderRadius = "3px";
    this.border = "1px solid #b1b1b1";
    this.boxShadow = "0 1px 5px #666";

    this.MenuContent = [];

    this.AddItem = function (name, fn, img) {
        this.MenuContent[this.MenuContent.length] = [name, fn, img];
    }

    this.Clear = function () {
        this.MenuContent = [];
        $("#tabRightMenu").remove();
    }

    this.AddLine = function () {
        this.MenuContent[this.MenuContent.length] = "line";
    }

    this.Init = function (obj) {
        var div = document.createElement("div");
        div.id = "tabRightMenu";
        with (div.style) {
            position = "absolute";
            left = top = "0px";
            width = "170px";
            lineHeight = "20px";
            fontSize = "12px";
            //            backgroundColor = this.backgroundColor;
            //            borderTop = this.borderTop;
            //            borderLeft = this.borderLeft;
            //            borderBottom = this.borderBottom;
            //            borderRight = this.borderRight;

            backgroundColor = this.backgroundColor;
            borderRadius = this.borderRadius;
            border = this.border;
            boxShadow = this.boxShadow;
            cursor = "default";
            zIndex = 2000;
        }

        document.body.appendChild(div);

        var s = "";
        for (var i = 0; i < this.MenuContent.length; i++) {
            if (this.MenuContent[i] == "line") {
                s += "<div style=\"height:0px;line-height:0px;overflow:hidden;border-top:1px solid #7aafd7;border-bottom:1px solid #fff;\"></div>";
            }
            else {
                if (this.MenuContent[i][2]) {
                    s += "<div style=\"border-bottom:1px solid #dcdcdc; box-shadow:0 1px 0 #fff; padding:5px 10px; width:150px;\" onclick=\"" + this.MenuContent[i][1] + "\" onmouseover=\"this.style.background=\'#ececec\';\" onmouseout=\"this.style.background=\'\';\"><img alt=\"\" src=\"" + this.MenuContent[i][2] + "\" />" + this.MenuContent[i][0] + "</div>";
                }
                s += "<div style=\"border-bottom:1px solid #dcdcdc; box-shadow:0 1px 0 #fff; padding:5px 10px; width:150px;\" onclick=\"" + this.MenuContent[i][1] + "\" onmouseover=\"this.style.background=\'#ececec\';\" onmouseout=\"this.style.background=\'#fff\';\">" + this.MenuContent[i][0] + "</div>";
            }
            div.innerHTML = s;
            div.oW = div.offsetWidth;
            div.oH = div.offsetHeight;
            div.style.display = "none";

        }
        obj.oncontextmenu = function (event) {
            event = event || window.event;
            //多标签右键选中  其他地方慎用
            if (event.target) {
                tabs.select(event.target.innerHTML);
                var items = $("#tabRightMenu div");
                if (items.length > 0) {
                    $.each(items, function (i, n) {
                        n.style.background = "";
                        n.style.color = "";
                        n.style.fontWeight = "";
                        if (n.innerHTML == event.target.innerHTML) {
                            //n.style.background = "#0a246a";
                            n.style.fontWeight = "700";
                        }
                    });
                }
            }
            var nx = document.body.scrollLeft + event.clientX;
            var ny = document.body.scrollTop + event.clientY;
            if (event.clientX + div.oW + 20 > document.body.offsetWidth) {
                nx = nx - div.oW;
            }
            if (event.clientY + div.oH + 20 > document.body.offsetHeight) {
                ny = ny - div.oH;
            }

            div.style.left = nx + "px";
            div.style.top = ny + "px";


            $(this).one("click", function () {
                div.style.display = "none";
                $("body").unbind();
                $(this).unbind();
            });
            $("body").one("click", function () {
                div.style.display = "none";
                $("body").unbind();
                $(div).unbind();
            });
            div.style.display = "block";
            return false;
        }
    }
};