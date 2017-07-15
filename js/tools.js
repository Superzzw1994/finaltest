/**
 * Created by zzw1994529 on 2017/7/15.
 *
 * 工具类
 */
var tools = {
    //获取元素
    $: function (id) {
        return document.getElementById(id);
    },
    //创建元素节点
    create: function (para) {
        //para:创建的dom节点名称
        return document.createElement(para);
    },
    //设置cookies
    setCookie: function (key, value, t) {
        var odate = new Date();
        odate.setDate(odate.getDate() + t);
        document.cookie = key + "=" + encodeURI(value) + ";expires=" + odate.toGMTString();
    },
    //获取cookies
    getCookie: function (key) {
        var arr1 = document.cookie.split("; ");
        for (var i = 0; i < arr1.length; i++) {
            var arr2 = arr1[i].split("=");
            if (arr2[0] == key) {
                return decodeURI(arr2[1]);
            }
        }
    },
    //删除cookies
    removeCookie: function (key) {
        this.setCookie(key, "", -1);

    },
    //ajax
    ajax: function (options) {
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }
        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
        function formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
            arr.push(("v=" + Math.random()).replace(".", ""));
            return arr.join("&");
        }

    },
    //点击关闭事件
    closehandler:function (para) {
        /*para={
            trigger: 触发元素
            target: 被触发元素
            Ev: 事件
            className: 被触发元素更改的样式
         }*/
        var trigger = tools.$(para.trigger);
        var target = tools.$(para.target);
        var evHandler = function () {
            target.className = para.className;
        }
        trigger.addEventListener(para.Ev,evHandler);
    }

}