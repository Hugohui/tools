function RightMenu() {

    if (window.rightMenuStatus) return;
    window.rightMenuStatus = true;

    this.backgroundColor = "white";
    this.borderTop = "1px solid #969696";
    this.borderLeft = "1px solid #969696";
    this.borderBottom = "1px solid #969696";
    this.borderRight = "1px solid #969696";

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
            width = "150px";
            lineHeight = "20px";
            backgroundColor = this.backgroundColor;
            borderTop = this.borderTop;
            borderLeft = this.borderLeft;
            borderBottom = this.borderBottom;
            borderRight = this.borderRight;
            cursor = "default";
            zIndex = 2000;
        }

        document.body.appendChild(div);

        var s = "";
        for (var i = 0; i < this.MenuContent.length; i++) {
            if (this.MenuContent[i] == "line") {
                s += "<div style=\"height:0px;line-height:0px;overflow:hidden;border-top:1px solid #888;border-bottom:1px solid #fff;\"></div>";
            }
            else {
                if (this.MenuContent[i][2]) {
                    s += "<div style=\"width:100%;\" onclick=\"" + this.MenuContent[i][1] + "\" onmouseover=\"style.background=\'#0a246a\';style.color=\'#fff\';\" onmouseout=\"style.background=\'\';style.color=\'\';\">&nbsp;<img alt=\"\" src=\"" + this.MenuContent[i][2] + "\" />" + this.MenuContent[i][0] + "</div>";
                }
                s += "<div style=\"width:100%;\" onclick=\"" + this.MenuContent[i][1] + "\" onmouseover=\"style.background=\'#0a246a\';style.color=\'#fff\';\" onmouseout=\"style.background=\'\';style.color=\'\';\">&nbsp;" + this.MenuContent[i][0] + "</div>";
            }
            div.innerHTML = s;
            div.oW = div.offsetWidth;
            div.oH = div.offsetHeight;
            div.style.display = "none";

        }
        obj.oncontextmenu = function (event) {
            event = event || window.event;
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

            div.style.display = "block";

            this.onclick = function () {
                setTimeout(function () {
                    div.style.display = "none";
                }, 100);
                this.onclick = null;
            }
            document.body.onclick = function () {
                div.style.display = "none";
            }
            return false;
        }
    }
}