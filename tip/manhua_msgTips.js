
$(function () {
    $.fn.manhua_msgTips = function (options) {
        var defaults = {
            timeOut: 3000, 			//显示的时间
            msg: "", 		//显示的内容简
            speed: 300, 			//显示速度
            type: "success"			//消息类型：success   error    warning
        };
        var options = $.extend(defaults, options);
        if ($("#tip_container").length>0) {
            $("#tip_container").fadeOut("fast");
            $("#tip_container").remove();
        }
        if ($("#tip_container").length ==0) {
            $("body").prepend('<div id="tip_container" class="container tip_container"><div id="tip" class="mtip"><i id="tipi"><i class="icon iconfont micon3">&#xe605;</i></i><span id="tsc"></span><i id="mclose" class="mclose"></i></div></div>');
        }
        var $this = $(this);
        var $tip_container = $("#tip_container");
        var $tip = $("#tip");
        var $tipi = $("#tipi");
        var $tipSpan = $("#tsc");
        var $colse = $("#mclose");

        //清除定时
        clearTimeout(window.timer);

        //$tip.attr("class", options.type).addClass("mtip");
        switch (options.type) {
            case "error":
                $tipi.html('<i class="icon iconfont micon1">&#xe6c6;</i>');
                break;
            case "warning":
                $tipi.html('<i class="icon iconfont micon2">&#xe64f;</i>');
                break;
            case "success":
                $tipi.html('<i class="icon iconfont micon3">&#xe605;</i>');
                break;
        }
        $tipSpan.html(options.msg);
        $tip_container.fadeIn(options.speed);
        window.timer = setTimeout(function () {
            $tip_container.fadeOut(options.speed);
            $tip_container.remove();
        }, options.timeOut);


        //鼠标放置 清除定时
        //$tip_container.delegate("div","mouseover", function () {
        //    clearTimeout(window.timer);
        //});

        ////鼠标移开  重新定时
        //$tip_container.delegate("div", "mouseout", function () {
        //    window.timer = setTimeout(function () {
        //        $tip_container.fadeOut(options.speed);
        //        $tip_container.remove();
        //    }, options.timeOut);
        //});
        $colse.on("click", function () {
            $tip_container.fadeOut(options.speed);
            $tip_container.remove();
        });
    }
});