// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数，在这个函数中，可以拿到我们给ajax提供的配制对象
$.ajaxPrefilter(function (options) {
    // 看到在发起请求时，是可以拿到配制的url的
    // console.log(options.url);
    // 在发起真正的请求之前，统一拼接请求根路径
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;

    // 统一为有权限的接口设置请求头，如果url中带有/my/字段，说明访问的是有权限的接口，才设置请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || "",
        };
    }

    // 全局统一添加 complete 回调函数
    options.complete = function (res) {
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (
            res.responseJSON.status === 1 &&
            res.responseJSON.message === "身份认证失败！"
        ) {
            // 1. 强制清空token
            localStorage.removeItem("token");
            // 2. 强制跳转到登录页面
            location.href = "/login.html";
        }
    };
});
