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
//登录cookies操作
(function () {
    var btn = tools.$("login-btn");
    var User = tools.$("username");
    var Pw = tools.$("password");
    var clickHandler = function () {
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
                    alert("用户名或密码错误");
                    User.value = "";
                    Pw.value = "";
                    tools.$("username-label").className = "show";
                    tools.$("password-label").className = "show";
                }
            },
        });
        return false;
    }
    btn.addEventListener("click", clickHandler);
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
                            //console.log(i);
                            var _index = i;
                        }
                    }
                    if (e.target = child[i]) {
                        return;
                    } else {
                        e.target.className = "com-li sel-li";

                        console.log(child[_index]);
                        child[_index].className = "com-li";
                        for (var i = 0; i < child.length; i++) {
                            if (e.target === child[i]) {
                                var page_No = i;
                            }
                        }
                        console.log(page_No);
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
//构建课程模块
function init(para) {
    var data = JSON.parse(para).list;
    console.log(data);
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
        //创建标签
        var link = tools.create("a");
        //添加节点
        link.appendChild(img);
        link.appendChild(box);
        //挂载到容器上
        inner.appendChild(link);
        container.appendChild(inner);
    }
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