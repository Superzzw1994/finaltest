/**
 * Created by zzw1994529 on 2017/6/25.'
 * 组件
 */
//轮播组件-淡入淡出
(function () {
    function slider(options) {
        this.imgs = options.imgs;
        this.id = options.id;
        this.init();
        this.addEvent();
    }

    //创建模板
    slider.prototype.init = function () {
        var con = document.getElementById(this.id);
        var list = document.createElement("ul");
        var imgsbox = document.createElement("div");
        imgsbox.className = "imgsbox";
        list.id = "list";
        imgsbox.id = "imgsbox";
        list.style.marginLeft = -this.imgs.length * 22 / 2 + 'px';
        for (var i = 0; i < this.imgs.length; i++) {
            var child = document.createElement("div");
            var img = document.createElement("img");
            var circle = document.createElement("li");
            img.src = this.imgs[i];
            child.appendChild(img);
            list.appendChild(circle);
            imgsbox.appendChild(child);
            (function (i) {
                return function () {
                    if (i == 0) {
                        child.className = "anim_fade";
                        circle.className = "active";
                    } else {
                        child.className = "hide";
                        circle.className = "normal";
                    }
                }()
            })(i);
        }
        con.appendChild(list);
        con.appendChild(imgsbox);
        //创建完毕即调用定时器
        this.move();
    }
    //事件模块
    slider.prototype.addEvent = function () {
        var con = document.getElementById("bannar");
        var list = document.getElementById("list")
        //鼠标悬停
        var mouseoverhandler = function () {
            clearInterval(this.interval);
        }.bind(this);
        con.addEventListener("mouseover", mouseoverhandler);
        //鼠标移出
        var mouseoutHandler = function () {
            this.move();
        }.bind(this);
        con.addEventListener("mouseout", mouseoutHandler);
        //鼠标点击
        var clickhandler = function (e) {
            if (e.target.tagName.toLowerCase() === "li") {
                if (e.target.className === "active") {
                    return;
                } else {
                    var listcon = document.getElementById("list").getElementsByTagName("li");
                    var con = document.getElementById("imgsbox").getElementsByTagName("div");
                    for (var i = 0; i < listcon.length; i++) {
                        listcon[i].className = "normal";
                        con[i].className = "hide";
                        listcon[i].index = i;
                        con[i].index = listcon[i];
                    }
                    e.target.className = "active";
                    console.log(e.target.index)
                    con[e.target.index].className = "anim_fade";
                }
            }
            else {
                return;
            }
        }
        list.addEventListener("click", clickhandler);
    }
    //运动模块
    slider.prototype.move = function () {
        this.swap = function () {
            var con = document.getElementById("imgsbox").getElementsByTagName("div");
            var listcon = document.getElementById("list").getElementsByTagName("li");
            for (var i = 0; i < con.length; i++) {
                if (i < con.length - 1) {
                    if (con[i].className === "anim_fade") {
                        con[i].className = "hide";
                        con[i + 1].className = "anim_fade";
                        listcon[i].className = "normal";
                        listcon[i + 1].className = "active";
                        return;
                    }
                } else {
                    con[con.length - 1].className = "hide";
                    listcon[con.length - 1].className = "normal";
                    listcon[0].className = "active";
                    con[0].className = "anim_fade";
                    listcon[i].index = con[i].index;
                }
            }

        };
        this.interval = setInterval(this.swap, 5000);
    }

    //暴露接口
    window.slider = slider;
})();

//无缝轮播
(function () {
    function smooth(options) {
        this.imgs = options.imgs;
        this.id = options.id;
        this.speed = options.speed;
        this.timer = options.timer;
        this.init();
        this.addEvent();
    }

    smooth.prototype.init = function () {

        var con = document.getElementById(this.id);
        var imgscon = document.createElement("ul");
        imgscon.id = "target";
        for (i = 0; i < this.imgs.length; i++) {
            var lis = document.createElement("li");
            var img = document.createElement("img");
            img.src = this.imgs[i];
            lis.appendChild(img);
            imgscon.appendChild(lis);
        }
        img.onload = function () {
            imgscon.style.width = img.width * this.imgs.length + "px";
        }.bind(this);
        //imgscon.style.width = img.width * this.imgs.length + "px";
        //console.log(imgscon.style.width)
        con.appendChild(imgscon);
        this.move();
    }
    smooth.prototype.move = function () {
        var target = document.getElementById("target");
        var tarchild = target.getElementsByTagName("li");
        tarchild[0].className = "first";
        if (target.style.marginLeft) {
            target.style.marginLeft = target.style.marginLeft + "px";
        } else {
            target.style.marginLeft = 0 + "px";
        }
        this.moveleft = function () {
            target.style.marginLeft = parseInt(target.style.marginLeft) - this.speed + "px";
            for (var i = 0; i < tarchild.length; i++) {
                if (tarchild[i].className == "first") {
                    if (tarchild[i].offsetLeft == -(tarchild[i].firstChild.width * tarchild.length - document.body.clientWidth)) {
                        var newli = document.createElement("li");
                        var newimg = document.createElement("img");
                        target.style.width = tarchild[i].firstChild.width * (this.imgs.length + 1) + "px";
                        newimg.src = tarchild[i].firstChild.src;
                        newli.appendChild(newimg);
                        target.appendChild(newli);
                    } else if (tarchild[i].offsetLeft == -tarchild[i].firstChild.width) {
                        tarchild[i + 1].className = "first";
                        target.removeChild(tarchild[i]);
                        target.style.marginLeft = 0 + "px";
                        target.style.width = tarchild[i].firstChild.width * this.imgs.length  + "px";
                    }
                } else {
                    return;
                }
            }
        }.bind(this);
        this.interval = setInterval(this.moveleft, this.timer);
    }
    smooth.prototype.addEvent = function () {
        //鼠标移入
        var con = document.getElementById("target");
        var mouseoverHander = function () {
            clearInterval(this.interval);
        }.bind(this);
        con.addEventListener("mouseover", mouseoverHander);
        //鼠标移出
        var mouseoutHandler = function () {
            clearInterval(this.interval);
            this.move();
        }.bind(this);
        con.addEventListener("mouseout", mouseoutHandler);
        //屏幕大小变化
        // window.onresize = function(){
        //     clearInterval(this.interval);
        //     var con = document.getElementById("target");
        //     // document.getElementById("slider").removeChild(con);
        //     // this.init();
        //     // this.addEvent();
        //     con.style.width = 1600 + "px";
        //     this.move();
        // }.bind(this);
    }
    window.smooth = smooth;
})();












