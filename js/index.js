/**
 * Created by zzw1994529 on 2017/7/10.
 *
 *
 */

(function () {
    if (cookieEvent.getCookie("isLogin") && cookieEvent.getCookie("isFollow")) {
        $("follow-btn").className = "hide";
        $("followed-btn").className = "followed-btn";
    }
    var followBtn = $("follow-btn");
    var clickHandler = function () {
        ajax(
            {
                url: "http://study.163.com/webDev/attention.htm",
                type: "GET",
                data: {},
                dataType: "json",
                success: function (response, xml) {
                    if (!cookieEvent.getCookie("isLogin")) {
                        $("mask").className = "mask show";
                    } else {
                        if (!cookieEvent.getCookie("isFollow")) {
                            cookieEvent.setCookie("isFollow", parseInt(response), 15);
                            $("follow-btn").className = "hide";
                            $("followed-btn").className = "followed-btn";
                        } else {
                            return;
                        }
                    }
                }
            }
        )
    }
    followBtn.addEventListener("click", clickHandler);
    var cancel = $("cancel");
    var cancelHandler = function () {
        cookieEvent.removeCookie("isFollow");
        $("follow-btn").className = "follow-btn show";
        $("followed-btn").className = "hide";
    }
    cancel.addEventListener("click", cancelHandler);
})();
function $(id) {
    return document.getElementById(id);
}

(function () {
    var cookieTarget = $("top-nav-right");
    var hideTarget = $("top-nav");
    if (cookieEvent.getCookie("status")) {
        hideTarget.className = "hide";
    }
    var ClickHandler = function () {
        if (cookieEvent.getCookie("status")) {
            return;
        } else {
            cookieEvent.setCookie("status", "1", 10);
            hideTarget.className = "hide";
        }
    }
    cookieTarget.addEventListener("click", ClickHandler);
})();
function place(id, tar) {
    var target = $(id);
    var message = $(tar);
    var inputHandler = function () {
        if (target.value == "") {
            message.className = "show";
        } else {
            message.className = "hide";
        }
    }
    target.addEventListener("input", inputHandler);
}

place("username", "username-label");
place("password", "password-label");
(function () {
    var btn = $("login-btn");
    var clickHandler = function () {
        var userName = $("username").value;
        var password = $("password").value;
        ajax({
            url: "http://study.163.com/webDev/login.htm",
            type: "GET",
            data: {"userName": md5(userName), "password": md5(password)},
            dataType: "json",
            success: function (response, xml) {
                if (parseInt(response) === 1) {
                    cookieEvent.setCookie("isLogin", "1", 15);
                    $("mask").className = "mask hide";
                } else {
                    alert("用户名或密码错误");
                    $("username").value = "";
                    $("password").value = "";
                    $("username-label").className = "show";
                    $("password-label").className = "show";
                }
            },
        });
        return false;
    }
    btn.addEventListener("click", clickHandler);
})();

(function () {
    var closebtn = $("close-btn");
    var clickHandler = function () {
        $("mask").className = "hide";
    }
    closebtn.addEventListener("click", clickHandler);
})();


(function () {
    var swap = $("swap");
    var child = swap.getElementsByTagName("li");
    var clickHandler = function (e) {
        if (e.target.className === "btn-normal") {
            for (var i = 0; i < child.length; i++) {
                child[i].className = "btn-normal";
            }
            e.target.className = "btn-active";
            var page = $("page");
            var _child = page.getElementsByTagName("a");
            if (e.target === child[0]) {
                for (var i = 0; i < _child.length; i++) {
                    if (i > 0 && i < _child.length - 1) {
                        _child[i].className = "com-li";
                        _child[1].className = "com-li spe-li";
                        ajax({
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
                        _child[1].className = "com-li spe-li";
                        ajax({
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
})();

(function () {
    var page = $("page");
    var child = page.getElementsByTagName("a");
    for (var i = 0; i < child.length; i++) {
        child[i].index = i;
        if (child[i].className === "com-li sel-li") {
            var index = i;
        }
    }

    var clickHandler = function (e) {
        var target = $("swap");
        var _child = target.getElementsByTagName("li");
        for (var i = 0; i < _child.length; i++) {
            if (_child[i].className === "btn-active") {
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
        console.log(_type);
        if (e.target.tagName.toLowerCase() === "a") {
            switch (e.target) {
                case child[0]:
                    if (index < child.length - 2) {
                        child[index].className = "com-li";
                        child[index + 1].className = "com-li sel-li";
                        index++;
                        ajax({
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

                    } else {
                        return;
                    }
                    break;
                case child[child.length - 1]:
                    if (index > 1) {
                        child[index].className = "com-li";
                        child[index - 1].className = "com-li sel-li";
                        index--;
                        console.log(index + 1);
                        ajax({
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
                        ajax({
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
})();

function init(para) {
    function create(p) {
        return document.createElement(p);
    }
    var data = JSON.parse(para).list;
    console.log(data);
    var container = $("classes");
    container.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var inner = create("li");
        inner.setAttribute("id", data[i].id)
        var link = create("a");
        var img = create("img");
        img.src = data[i].bigPhotoUrl;
        var box = create("div");
        var title = create("h1");
        title.className = "class-title";
        title.innerHTML = data[i].name;
        var title2 = create("h2");
        title2.className = "company";
        title2.innerHTML = data[i].provider;
        var title3 = create("p");
        title3.className = "people";
        title3.innerHTML = data[i].learnerCount;
        var title4 = create("p");
        title4.className = "price";
        title4.innerHTML = "$" + data[i].price;
        box.appendChild(title);
        box.appendChild(title2);
        box.appendChild(title3);
        box.appendChild(title4);
        link.appendChild(img);
        link.appendChild(box);
        inner.appendChild(link);
        container.appendChild(inner);
    }
}