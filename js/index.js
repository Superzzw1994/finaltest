/**
 * Created by zzw1994529 on 2017/7/10.
 *
 *
 */
//顶部导航栏cookies操作
(function () {
    var cookieTarget = tools.$("top-nav-right");
    var hideTarget = tools.$("top-nav");
    //加载页面前判断是否存在cookies
    if (tools.getCookie("status")) {
        hideTarget.className = "hide";
    }
    var ClickHandler = function () {
        if (tools.getCookie("status")) {
            return;
        } else {
            //如果不存在就设置cookies并隐藏导航栏
            tools.setCookie("status", "1", 10);
            hideTarget.className = "hide";
        }
    }
    cookieTarget.addEventListener("click", ClickHandler);
})(tools);
//关注cookies操作
(function () {
    var followBtn = tools.$("follow-btn");
    var followedBtn = tools.$("followed-btn");
    //如果登录与关注的cookie都存在
    if (tools.getCookie("isLogin") && tools.getCookie("isFollow")) {
        //显示已关注的按钮
        followBtn.className = "hide";
        followedBtn.className = "followed-btn";
    }
    var clickHandler = function () {
        //如果没登录就弹出登录表单，如果已登录就设置关注cookie并改变按钮样式
        if (tools.getCookie("isLogin")) {
            tools.ajax(
                {
                    url: "http://study.163.com/webDev/attention.htm",
                    type: "GET",
                    data: {},
                    dataType: "json",
                    success: function (response, xml) {
                        tools.setCookie("isFollow", parseInt(response), 15);
                        followBtn.className = "hide";
                        followedBtn.className = "followed-btn";
                    }
                }
            )
        } else {
            tools.$("mask").className = "mask show";
        }
    }
    followBtn.addEventListener("click", clickHandler);
    //点击取消按钮清除关注cookie，改变按钮样式
    var cancel = tools.$("cancel");
    var cancelHandler = function () {
        tools.removeCookie("isFollow");
        followBtn.className = "follow-btn show";
        followedBtn.className = "hide";
    }
    cancel.addEventListener("click", cancelHandler);
})(tools);
//登录cookies操作
(function () {
    var btn = tools.$("login-btn");
    var User = tools.$("username");
    var Pw = tools.$("password");
    var formUp = tools.$("formUp");
    var clickHandler = function () {
        if (!tools.getCookie("isLogin")) {
            var userName = User.value;
            var password = Pw.value;
            tools.ajax({
                url: "http://study.163.com/webDev/login.htm",
                type: "GET",
                data: {"userName": md5(userName), "password": md5(password)},
                dataType: "json",
                success: function (response, xml) {
                    if (parseInt(response) === 1) {
                        tools.setCookie("isLogin", "1", 15);
                        tools.$("mask").className = "mask hide";
                    } else {
                        var k = new shake({
                            id: "loginbox",
                            speed: 2,
                            leng: 20,
                            dis: "left"
                        });
                        // alert("用户名或密码错误");
                        User.value = "";
                        Pw.value = "";
                        tools.$("username-label").className = "show";
                        tools.$("password-label").className = "show";
                    }
                },
                fail: function () {
                    console.log("ajax false");
                }
            });
        }
    }
    var formUpHandler = function () {
        event.preventDefault();
    };
    formUp.addEventListener("submit", formUpHandler);
    btn.addEventListener("click", clickHandler);
})(tools);
//切换模块
(function () {
    var swap = tools.$("swap");
    var child = swap.getElementsByTagName("li");
    var clickHandler = function (e) {
        if (e.target.className === "btn-normal") {
            for (var i = 0; i < child.length; i++) {
                child[i].className = "btn-normal";
            }
            e.target.className = "btn-active";
            var page = tools.$("page");
            var _child = page.getElementsByTagName("a");
            if (e.target === child[0]) {
                for (var i = 0; i < _child.length; i++) {
                    if (i > 0 && i < _child.length - 1) {
                        _child[i].className = "com-li";
                        _child[1].className = "com-li sel-li";
                        console.log("完成")
                        tools.ajax({
                            url: "http://study.163.com/webDev/couresByCategory.htm",
                            type: "GET",
                            data: {
                                pageNo: 1,
                                psize: 20,
                                type: 10
                            },
                            success: function (response, xml) {
                                init(response);
                            }
                        })
                    }

                }

            } else {
                for (var i = 0; i < _child.length; i++) {
                    if (i > 0 && i < _child.length - 1) {
                        _child[i].className = "com-li";
                        _child[1].className = "com-li sel-li";
                        tools.ajax({
                            url: "http://study.163.com/webDev/couresByCategory.htm",
                            type: "GET",
                            data: {
                                pageNo: 1,
                                psize: 20,
                                type: 20
                            },
                            success: function (response, xml) {
                                init(response);
                            }
                        })
                    }
                }
            }
        } else {
            return;
        }
    };
    swap.addEventListener("click", clickHandler);
})(tools);
//分页模块
(function () {
    var page = tools.$("page");
    var target = tools.$("swap");
    var child = page.getElementsByTagName("a");
    var swapBtn = target.getElementsByTagName("li");
    var clickHandler = function (e) {
        //找到当前被选中的按钮
        for (var i = 0; i < child.length; i++) {
            //child[i].index = i;
            if (child[i].className === "com-li sel-li") {
                var index = i;
                console.log(index);
            }
        }
        //确定在哪个tab栏下
        for (var i = 0; i < swapBtn.length; i++) {
            if (swapBtn[i].className === "btn-active") {
                switch (i) {
                    case 0:
                        _type = 10;
                        break;
                    default:
                        _type = 20;
                        break;
                }
            }
        }
        if (e.target.tagName.toLowerCase() === "a") {
            switch (e.target) {
                case child[0]:
                    if (index < child.length - 2) {
                        child[index].className = "com-li";
                        child[index + 1].className = "com-li sel-li";
                        tools.ajax({
                            url: "http://study.163.com/webDev/couresByCategory.htm",
                            type: "GET",
                            data: {
                                pageNo: index + 1,
                                psize: 20,
                                type: _type
                            },
                            success: function (response, xml) {
                                init(response);
                            }
                        })
                        index++;
                    } else {
                        return;
                    }
                    break;
                case child[child.length - 1]:
                    if (index > 1) {
                        child[index].className = "com-li";
                        child[index - 1].className = "com-li sel-li";
                        //console.log(index-1);
                        tools.ajax({
                            url: "http://study.163.com/webDev/couresByCategory.htm",
                            type: "GET",
                            data: {
                                pageNo: index - 1,
                                psize: 20,
                                type: _type
                            },
                            success: function (response, xml) {
                                init(response);
                            }
                        })
                        index--;
                    } else {
                        return;
                    }
                    break;
                default:
                    for (var i = 0; i < child.length; i++) {
                        if (child[i].className === "com-li sel-li") {
                            var _index = i;
                        }
                    }
                    if (e.target === child[_index]) {
                        return;
                    } else {
                        e.target.className = "com-li sel-li";
                        child[_index].className = "com-li";
                        for (var i = 0; i < child.length; i++) {
                            if (e.target === child[i]) {
                                var page_No = i;
                            }
                        }
                        tools.ajax({
                            url: "http://study.163.com/webDev/couresByCategory.htm",
                            type: "GET",
                            data: {
                                pageNo: page_No,
                                psize: 20,
                                type: _type
                            },
                            success: function (response, xml) {
                                init(response);
                            }
                        })
                    }
                    break;
            }
        } else {
            return;
        }
    }
    page.addEventListener("click", clickHandler);
})(tools);
//课程hover
// function hover() {
//     var parent = tools.$("classes");
//     var overHandler = function (e) {
//             var l = e.target;
//             while(l.tagName !== 'LI'){
//                 if(l === parent){
//                     l = null;
//                     break;
//                 }
//                 l = l.parentNode;
//             }
//             if(l){
//                 console.log("in")
//                // l.nextSibling.className = "hover-box";
//                 console.log(e.target);
//             }
//     };
//     var outHandler = function (e) {
//         var l = e.target;
//         while(l.tagName !== 'LI'){
//             if(l === parent){
//                 l = null;
//                 break;
//             }
//             l = l.parentNode;
//         }
//         if(l){
//             console.log("out")
//             console.log(e.target);
//            // l.nextSibling.className = "hover-box hide";
//         }else{
//             return false;
//         }
//
//     };
//     parent.addEventListener("mouseover",overHandler,true);
//     parent.addEventListener("mouseout",outHandler,true);
// };

// function aaa() {
//     window.onload = function () {
//         console.log(1)
//         var container = tools.$("classes").getElementsByTagName("li");
//         for (var i = 0; i < container.length; i++) {
//             container[i].addEventListener("mouseover",function () {
//                 console.log(this);
//             },true);
//             container[i].addEventListener("mouseout",function () {
//                 console.log("2");
//             },true)
//         }
//     }
// }


//构建课程模块
function init(para) {
    var data = JSON.parse(para).list;
    var container = tools.$("classes");
    container.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        //创建外部容器 li
        var inner = tools.create("li");
        //设置id
        inner.setAttribute("id", data[i].id);
        //创建盒子
        var box = tools.create("div");
        //设置课程名称
        var title = tools.create("h1");
        title.className = "class-title";
        title.innerHTML = data[i].name;
        //设置机构
        var company = tools.create("h2");
        company.className = "company";
        company.innerHTML = data[i].provider;
        //设置关注人数
        var people = tools.create("p");
        people.className = "people";
        people.innerHTML = data[i].learnerCount;
        //设置价格
        var price = tools.create("p");
        price.className = "price";
        if (data[i].price) {
            price.innerHTML = "$" + data[i].price;
        } else {
            price.innerHTML = "免费";
        }
        //添加节点
        box.appendChild(title);
        box.appendChild(company);
        box.appendChild(people);
        box.appendChild(price);
        //创建图片
        var img = tools.create("img");
        img.src = data[i].bigPhotoUrl;
        //添加节点
        inner.appendChild(img);
        inner.appendChild(box);
        //挂载到容器上

        container.appendChild(inner);
        var hoverbox = tools.create("div");
        if(parseInt(getComputedStyle(container).getPropertyValue("width"))=== 980){
            if(i<4){
                console.log("se");
                hoverbox.style.left = i * 245 +"px";
            }else{
                hoverbox.style.left = (i%4) * 245 +"px";
                hoverbox.style.top = (Math.floor(i/4))*256 + "px";
            }
        }else {
            if(i<3){
                console.log("ze");
                hoverbox.style.left = i * 245 +"px";
            }else{
                hoverbox.style.left = (i%3) * 245 +"px";
                hoverbox.style.top = (Math.floor(i/3))*256 + "px";
            }
        }
        console.log(hoverbox)
        hoverbox.className = "hover-box hide";
        var top_content = tools.create("div");
        top_content.className = "top-content clearfix";
        var hoverimg = tools.create("img");
        hoverimg.src = data[i].bigPhotoUrl;
        top_content.appendChild(hoverimg);
        var hover_div = tools.create("div");
        var h2 = tools.create("h2");
        h2.innerHTML = data[i].name;
        var p_fir = tools.create("p");
        p_fir.className = "hover-people";
        p_fir.innerHTML = data[i].learnerCount;
        var p_sec = tools.create("p");
        p_sec.innerHTML = "发布者:"+data[i].provider;
        var p_thr = tools.create("p");
        p_thr.innerHTML = "目标人群:"+data[i].targetUser;
        hover_div.appendChild(h2);
        hover_div.appendChild(p_fir);
        hover_div.appendChild(p_sec);
        hover_div.appendChild(p_thr);
        top_content.appendChild(hover_div);
        hoverbox.appendChild(top_content);
        var bot_content = tools.create("div");
        bot_content.className ="bottom-content";
        var bot_p = tools.create("p");
        bot_p.innerHTML = data[i].description;
        bot_content.appendChild(bot_p);
        hoverbox.appendChild(bot_content);
        container.appendChild(hoverbox)
    }
}
//构建热门课程
function initRanking(para) {
    var container = tools.$("ranking");
    for (var i = 0; i < para.length; i++) {
        var img = tools.create("img");
        img.src = para[i].bigPhotoUrl;
        img.alt = para[i].description;
        var des = tools.create("h2");
        des.innerHTML = para[i].name;
        des.className = "ranking-title";
        var targetPeople = tools.create("span");
        targetPeople.className = "ranking-people";
        targetPeople.innerHTML = para[i].learnerCount;
        var herf = tools.create("a");
        herf.appendChild(img);
        herf.appendChild(des);
        herf.appendChild(targetPeople);
        var con = tools.create("li");
        con.appendChild(herf);
        container.appendChild(con);
    }
}
//热门课程滚动
// function zzz(tools) {
//     var container = tools.$("ranking");
//     var arr = container.getElementsByTagName("li");
//     function doMove() {
//         var domove = new slide({
//             target: "ranking",
//             dis: "top",
//             speed: 2,
//             time: 80,
//             leng: -50,
//         });
//     }
//
//     kimer = setInterval(doMove, 5000);
//
// };
function zzz(tools) {
    var container = tools.$("ranking");
    var arr = container.getElementsByTagName("li");
    var movehandler = function () {
        var leng = 50;
        var speed = 2;
        var timer;
        timer = setInterval(function () {
            var trigger = parseInt(getComputedStyle(container).getPropertyValue("top"));
            container.style.top = trigger - speed + "px";
            if (parseInt(container.style.top) === -50) {
                clearInterval(timer);
                var list = arr[0];
                container.removeChild(list);
                container.appendChild(list);
                container.style.top = 20 + "px";
            }
        }, 30)
    }
    intern = setInterval(movehandler, 5000);
}

//点击关闭事件模块
(function () {
    //点击关闭登录表单
    tools.closehandler({
        trigger: "close-btn",
        target: "mask",
        Ev: "click",
        className: "hide"
    })
    //点击视频缩略图弹出视频modal
    tools.closehandler({
        trigger: "openVideo",
        target: "videoModal",
        Ev: "click",
        className: "v-modal"
    });
    //点击右上X关闭视频modal
    tools.closehandler({
        trigger: "video-closeBtn",
        target: "videoModal",
        Ev: "click",
        className: "hide"
    })
})(tools);
//利用lable模拟placeholder函数
function placeHolder(id, tar) {
    var target = tools.$(id);
    var message = tools.$(tar);
    var inputHandler = function () {
        if (target.value == "") {
            message.className = "show";
        } else {
            message.className = "hide";
        }
    }
    target.addEventListener("input", inputHandler);
}
//登录表单 username调用
placeHolder("username", "username-label");
//密码调用
placeHolder("password", "password-label");